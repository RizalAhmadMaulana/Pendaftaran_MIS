import re
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from .models import Pendaftar, JadwalSeleksi, UnitPendidikan, GelombangPendaftaran

BULAN_INDONESIA = {
    1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April', 5: 'Mei', 6: 'Juni',
    7: 'Juli', 8: 'Agustus', 9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
}

def format_indo_date(d):
    if not d:
        return ""
    return f"{d.day} {BULAN_INDONESIA.get(d.month, '')} {d.year}"

class GelombangPendaftaranSerializer(serializers.ModelSerializer):
    status_waktu = serializers.SerializerMethodField()

    class Meta:
        model = GelombangPendaftaran
        fields = [
            'id', 'unit', 'nama_gelombang', 'tanggal_mulai', 'tanggal_selesai',
            'biaya_pendaftaran', 'is_aktif', 'status_waktu'
        ]

    def get_status_waktu(self, obj):
        today = timezone.localdate()
        if today < obj.tanggal_mulai:
            return 'AKAN_DATANG'
        elif obj.tanggal_mulai <= today <= obj.tanggal_selesai:
            return 'AKTIF' if obj.is_aktif else 'NONAKTIF'
        else:
            return 'BERAKHIR'

class UnitPendidikanSerializer(serializers.ModelSerializer):
    gelombang_list = GelombangPendaftaranSerializer(many=True, read_only=True)
    gelombang_aktif_data = serializers.SerializerMethodField()
    is_open = serializers.SerializerMethodField()
    biaya_aktif = serializers.SerializerMethodField()
    nama_gelombang_aktif = serializers.SerializerMethodField()
    masa_pendaftaran_teks = serializers.SerializerMethodField()
    syarat_pendaftaran = serializers.JSONField(required=False)

    class Meta:
        model = UnitPendidikan
        fields = [
            'id', 'kode', 'nama', 'kategori_label', 'lokasi_kampus',
            'deskripsi_singkat', 'profil_lembaga', 'syarat_pendaftaran',
            'is_active', 'urutan', 'gelombang_list', 'gelombang_aktif_data',
            'is_open', 'biaya_aktif', 'nama_gelombang_aktif', 'masa_pendaftaran_teks'
        ]

    def get_gelombang_aktif_data(self, obj):
        active_gel = obj.get_active_gelombang()
        if active_gel:
            return GelombangPendaftaranSerializer(active_gel).data
        return None

    def get_is_open(self, obj):
        return obj.get_active_gelombang() is not None

    def get_biaya_aktif(self, obj):
        active_gel = obj.get_active_gelombang()
        return active_gel.biaya_pendaftaran if active_gel else 0

    def get_nama_gelombang_aktif(self, obj):
        active_gel = obj.get_active_gelombang()
        return active_gel.nama_gelombang if active_gel else "Pendaftaran Ditutup"

    def get_masa_pendaftaran_teks(self, obj):
        active_gel = obj.get_active_gelombang()
        if active_gel:
            tgl_mulai = format_indo_date(active_gel.tanggal_mulai)
            tgl_selesai = format_indo_date(active_gel.tanggal_selesai)
            return f"{tgl_mulai} - {tgl_selesai}"
        return "Pendaftaran Sedang Ditutup"

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        role = 'admin' if (user.is_staff or user.is_superuser) else 'siswa'
        data['role'] = role
        data['username'] = user.username
        data['name'] = user.first_name if user.first_name else user.username
        return data

class PendaftarSerializer(serializers.ModelSerializer):
    jadwal_detail = serializers.SerializerMethodField()
    tagihan = serializers.SerializerMethodField()

    class Meta:
        model = Pendaftar
        fields = '__all__'
        read_only_fields = ('no_registrasi', 'created_at')

    def get_tagihan(self, obj):
        try:
            if hasattr(obj, 'tagihan') and obj.tagihan:
                from payment.serializers import TagihanSerializer
                return TagihanSerializer(obj.tagihan).data
        except Exception:
            pass
        return None

    def get_jadwal_detail(self, obj):
        if obj.jadwal:
            return {
                "id": obj.jadwal.id,
                "gelombang": obj.jadwal.gelombang,
                "tanggal": obj.jadwal.tanggal,
                "waktu": f"{obj.jadwal.waktu_mulai.strftime('%H:%M')} - {obj.jadwal.waktu_selesai.strftime('%H:%M')}",
                "lokasi": obj.jadwal.lokasi,
                "deskripsi": obj.jadwal.deskripsi,
            }
        return None

    def to_internal_value(self, data):
        # Normalisasi key camelCase dari frontend ke snake_case model Django
        mutable_data = {}
        for key in data:
            value = data.get(key)
            snake_key = re.sub(r'(?<!^)(?=[A-Z])', '_', key).lower()
            # Bersihkan date field jika kosong agar tidak error validasi DateField
            if snake_key == 'tanggal_lahir' and (value == '' or value is None):
                value = None
            mutable_data[snake_key] = value
        return super().to_internal_value(mutable_data)

class JadwalSeleksiSerializer(serializers.ModelSerializer):
    total_peserta = serializers.SerializerMethodField()
    nama_unit = serializers.SerializerMethodField()

    class Meta:
        model = JadwalSeleksi
        fields = '__all__'

    def get_total_peserta(self, obj):
        cnt = obj.peserta_list.count()
        if cnt == 0 and obj.unit:
            return Pendaftar.objects.filter(unit__iexact=obj.unit).count()
        return cnt

    def get_nama_unit(self, obj):
        return obj.unit.upper() if obj.unit else "SD"


class AdminPendaftarSerializer(serializers.ModelSerializer):
    tagihan = serializers.SerializerMethodField()
    jadwal_detail = serializers.SerializerMethodField()

    class Meta:
        model = Pendaftar
        fields = '__all__'

    def get_tagihan(self, obj):
        try:
            if hasattr(obj, 'tagihan') and obj.tagihan:
                from payment.serializers import TagihanSerializer
                return TagihanSerializer(obj.tagihan).data
        except Exception:
            pass
        return None

    def get_jadwal_detail(self, obj):
        if obj.jadwal:
            return {
                "id": obj.jadwal.id,
                "gelombang": obj.jadwal.gelombang,
                "tanggal": obj.jadwal.tanggal,
                "waktu": f"{obj.jadwal.waktu_mulai.strftime('%H:%M')} - {obj.jadwal.waktu_selesai.strftime('%H:%M')}",
                "lokasi": obj.jadwal.lokasi,
            }
        return None

