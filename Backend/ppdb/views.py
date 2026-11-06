import random
from django.contrib.auth.models import User
from django.http import Http404
from django.db.models import Q
from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Pendaftar, JadwalSeleksi, UnitPendidikan, GelombangPendaftaran
from .serializers import (
    PendaftarSerializer,
    AdminPendaftarSerializer,
    JadwalSeleksiSerializer,
    UnitPendidikanSerializer,
    GelombangPendaftaranSerializer,
    CustomTokenObtainPairSerializer
)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UnitPendidikanListAPIView(generics.ListCreateAPIView):
    queryset = UnitPendidikan.objects.all().order_by('urutan', 'id')
    serializer_class = UnitPendidikanSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        from datetime import timedelta
        from django.utils import timezone

        instance = serializer.save()
        # Otomatis buatkan Gelombang 1 default jika belum ada gelombang
        if not instance.gelombang_list.exists():
            today = timezone.localdate()
            GelombangPendaftaran.objects.create(
                unit=instance,
                nama_gelombang='Gelombang 1',
                tanggal_mulai=today,
                tanggal_selesai=today + timedelta(days=60),
                biaya_pendaftaran=250000,
                is_aktif=True
            )

class UnitPendidikanDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UnitPendidikan.objects.all()
    serializer_class = UnitPendidikanSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        kode = self.kwargs.get('kode', '').strip()
        obj = UnitPendidikan.objects.filter(kode__iexact=kode).first()
        if not obj and kode.isdigit():
            obj = UnitPendidikan.objects.filter(id=int(kode)).first()
        if not obj:
            raise Http404(f"Unit pendidikan '{kode}' tidak ditemukan.")
        return obj

class GelombangListCreateAPIView(generics.ListCreateAPIView):
    queryset = GelombangPendaftaran.objects.all().order_by('tanggal_mulai', 'id')
    serializer_class = GelombangPendaftaranSerializer
    permission_classes = [permissions.AllowAny]

class GelombangDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = GelombangPendaftaran.objects.all()
    serializer_class = GelombangPendaftaranSerializer
    permission_classes = [permissions.AllowAny]

class AdminStatsAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_pendaftar = Pendaftar.objects.count()
        total_lunas = Pendaftar.objects.filter(status_pembayaran__in=['PAID', 'LUNAS']).count()
        menunggu_pembayaran = Pendaftar.objects.filter(status_pembayaran__in=['UNPAID', 'PENDING']).count()
        verifikasi_berkas = Pendaftar.objects.filter(status_dokumen__icontains='VERIFIKASI').count()

        unit_rekap = []
        for unit in UnitPendidikan.objects.all().order_by('urutan', 'id'):
            cnt = Pendaftar.objects.filter(unit__iexact=unit.kode).count()
            active_g = unit.get_active_gelombang()
            unit_rekap.append({
                "id": unit.id,
                "kode": unit.kode,
                "nama": unit.nama,
                "total_pendaftar": cnt,
                "nama_gelombang_aktif": active_g.nama_gelombang if active_g else "Tidak Ada",
                "biaya_aktif": active_g.biaya_pendaftaran if active_g else 0,
                "is_open": active_g is not None,
            })

        return Response({
            "total_pendaftar": total_pendaftar,
            "total_lunas": total_lunas,
            "menunggu_pembayaran": menunggu_pembayaran,
            "verifikasi_berkas": verifikasi_berkas,
            "unit_rekap": unit_rekap
        })

class AdminPendaftarListAPIView(generics.ListAPIView):
    serializer_class = AdminPendaftarSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Pendaftar.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', '').strip()
        unit = self.request.query_params.get('unit', '').strip()
        pembayaran = self.request.query_params.get('pembayaran', '').strip()
        seleksi = self.request.query_params.get('seleksi', '').strip()

        if search:
            qs = qs.filter(
                Q(nama_lengkap__icontains=search) |
                Q(no_registrasi__icontains=search) |
                Q(nik__icontains=search)
            )
        if unit and unit != 'Semua':
            qs = qs.filter(unit__iexact=unit)
        if pembayaran and pembayaran != 'Semua':
            qs = qs.filter(status_pembayaran__iexact=pembayaran)
        if seleksi and seleksi != 'Semua':
            qs = qs.filter(status_seleksi__iexact=seleksi)
        return qs

class AdminPendaftarDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pendaftar.objects.all()
    serializer_class = AdminPendaftarSerializer
    permission_classes = [permissions.AllowAny]

    def perform_update(self, serializer):
        instance = serializer.save()
        if hasattr(instance, 'tagihan') and instance.tagihan:
            if instance.status_pembayaran in ['PAID', 'LUNAS']:
                instance.tagihan.status = 'PAID'
            else:
                instance.tagihan.status = 'UNPAID'
            instance.tagihan.save()

    def perform_destroy(self, instance):
        User.objects.filter(username=instance.no_registrasi).delete()
        instance.delete()

class PendaftarCreateAPIView(generics.CreateAPIView):
    queryset = Pendaftar.objects.all()
    serializer_class = PendaftarSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        unit_val = self.request.data.get('unit', '')
        if not unit_val:
            raise serializers.ValidationError({"unit": "Pilihan unit pendidikan wajib diisi."})

        # Cari UnitPendidikan berdasarkan kode atau nama (case-insensitive)
        unit_obj = UnitPendidikan.objects.filter(kode__iexact=unit_val).first()
        if not unit_obj:
            unit_obj = UnitPendidikan.objects.filter(nama__iexact=unit_val).first()

        if not unit_obj:
            raise serializers.ValidationError({"unit": f"Unit pendidikan '{unit_val}' tidak ditemukan."})

        active_gelombang = unit_obj.get_active_gelombang()
        if not active_gelombang:
            raise serializers.ValidationError({
                "unit": f"Pendaftaran untuk unit '{unit_obj.nama}' saat ini sedang ditutup atau belum ada gelombang aktif."
            })

        biaya = active_gelombang.biaya_pendaftaran

        # Generate no_registrasi unik dengan format MIS-2026-{random_4_digit}
        while True:
            random_4_digit = random.randint(1000, 9999)
            generated_no = f"MIS-2026-{random_4_digit}"
            if not Pendaftar.objects.filter(no_registrasi=generated_no).exists():
                break

        instance = serializer.save(no_registrasi=generated_no, unit=unit_obj.kode.upper())

        # Update status dokumen menjadi MENUNGGU VERIFIKASI jika siswa mengunggah dokumen sejak pendaftaran awal
        if instance.file_kk or instance.file_akta or instance.file_ijazah or instance.file_raport or instance.file_foto:
            instance.status_dokumen = 'MENUNGGU VERIFIKASI'
            instance.save(update_fields=['status_dokumen'])

        # Buat akun user untuk login. Username = no_registrasi, Password = NIK
        default_password = instance.nik if instance.nik else 'mis2026'
        User.objects.create_user(
            username=generated_no,
            password=default_password,
            first_name=instance.nama_lengkap
        )

        # Generate Tagihan & QRIS Otomatis
        from payment.models import TagihanPendaftaran
        from payment.bri_api import generate_qris_string

        kode_unik = random.randint(100, 999)
        total = biaya + kode_unik

        # Panggil fungsi generate QRIS SNAP BI
        qris_data = generate_qris_string(total, generated_no)

        TagihanPendaftaran.objects.create(
            pendaftar=instance,
            biaya_pokok=biaya,
            kode_unik=kode_unik,
            total_tagihan=total,
            qris_string=qris_data
        )

class DashboardDataAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = PendaftarSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj = Pendaftar.objects.filter(no_registrasi=self.request.user.username).first()
        if not obj:
            raise Http404("Data pendaftar tidak ditemukan.")
        return obj

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.nama_lengkap and self.request.user.first_name != instance.nama_lengkap:
            self.request.user.first_name = instance.nama_lengkap
            self.request.user.save()

class DokumenUploadAPIView(generics.UpdateAPIView):
    serializer_class = PendaftarSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return Pendaftar.objects.get(no_registrasi=self.request.user.username)

    def perform_update(self, serializer):
        serializer.save(status_dokumen='MENUNGGU VERIFIKASI')

class JadwalSeleksiAPIView(generics.ListAPIView):
    serializer_class = JadwalSeleksiSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        pendaftar = Pendaftar.objects.filter(no_registrasi=user.username).first()
        if pendaftar:
            # 1. Jika pendaftar sudah di-assign secara spesifik oleh admin ke jadwal tertentu:
            if pendaftar.jadwal:
                return JadwalSeleksi.objects.filter(id=pendaftar.jadwal.id)
            # 2. Jika belum di-assign spesifik, ambil jadwal yang unit-nya sesuai unit siswa
            if pendaftar.unit:
                unit_code = pendaftar.unit.lower().strip()
                qs = JadwalSeleksi.objects.filter(unit__iexact=unit_code).order_by('tanggal', 'waktu_mulai')
                if qs.exists():
                    return qs
        return JadwalSeleksi.objects.none()

class AdminJadwalListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = JadwalSeleksiSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = JadwalSeleksi.objects.all().order_by('-tanggal', '-id')
        unit = self.request.query_params.get('unit', '').strip()
        search = self.request.query_params.get('search', '').strip()
        tanggal = self.request.query_params.get('tanggal', '').strip()

        if unit and unit.lower() != 'semua':
            qs = qs.filter(unit__iexact=unit)
        if search:
            qs = qs.filter(
                Q(gelombang__icontains=search) |
                Q(lokasi__icontains=search) |
                Q(deskripsi__icontains=search)
            )
        if tanggal:
            qs = qs.filter(tanggal=tanggal)
        return qs

    def perform_create(self, serializer):
        unit_val = self.request.data.get('unit', 'sd').strip().lower()
        serializer.save(unit=unit_val)

class AdminJadwalDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JadwalSeleksi.objects.all()
    serializer_class = JadwalSeleksiSerializer
    permission_classes = [permissions.AllowAny]

class AdminJadwalPesertaAPIView(generics.ListAPIView):
    serializer_class = AdminPendaftarSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        from django.shortcuts import get_object_or_404
        pk = self.kwargs.get('pk')
        jadwal = get_object_or_404(JadwalSeleksi, pk=pk)
        qs = Pendaftar.objects.filter(jadwal=jadwal).order_by('-created_at')
        if not qs.exists():
            if jadwal.unit:
                qs = Pendaftar.objects.filter(unit__iexact=jadwal.unit).order_by('-created_at')
            else:
                qs = Pendaftar.objects.all().order_by('-created_at')
        return qs

class AdminAssignJadwalAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        from django.shortcuts import get_object_or_404
        jadwal = get_object_or_404(JadwalSeleksi, pk=pk)
        pendaftar_id = request.data.get('pendaftar_id')
        action = request.data.get('action', 'assign')
        pendaftar = get_object_or_404(Pendaftar, id=pendaftar_id)
        if action == 'assign':
            pendaftar.jadwal = jadwal
        else:
            pendaftar.jadwal = None
        pendaftar.save()
        return Response({"message": "Berhasil memperbarui jadwal peserta", "jadwal_id": jadwal.id})

class AdminKeputusanSeleksiAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        from django.shortcuts import get_object_or_404
        pendaftar = get_object_or_404(Pendaftar, pk=pk)
        keputusan = request.data.get('keputusan', '').strip().upper()
        if keputusan not in ['LULUS', 'TIDAK LULUS', 'BELUM PENGUMUMAN']:
            return Response({"error": "Keputusan tidak valid."}, status=400)
        pendaftar.status_seleksi = keputusan
        pendaftar.save()
        return Response({
            "message": f"Status seleksi {pendaftar.nama_lengkap} diubah menjadi {keputusan}",
            "id": pendaftar.id,
            "status_seleksi": pendaftar.status_seleksi
        })


