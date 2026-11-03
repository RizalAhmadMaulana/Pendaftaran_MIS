from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from ppdb.models import Pendaftar
from .models import TagihanPendaftaran
from .serializers import TagihanSerializer
from .bri_api import check_qris_status

class TagihanDetailAPIView(generics.RetrieveAPIView):
    serializer_class = TagihanSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'pendaftar__no_registrasi'
    lookup_url_kwarg = 'no_registrasi'
    queryset = TagihanPendaftaran.objects.all()

class CekPembayaranAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, no_registrasi):
        try:
            tagihan = TagihanPendaftaran.objects.get(pendaftar__no_registrasi=no_registrasi)
            if check_qris_status(tagihan):
                tagihan.status = 'PAID'
                tagihan.save()
                
                pendaftar = tagihan.pendaftar
                pendaftar.status_pembayaran = 'LUNAS'
                pendaftar.save()
                
                return Response({"message": "Pembayaran Berhasil Diverifikasi", "status": "PAID"}, status=status.HTTP_200_OK)
            return Response({"message": "Pembayaran belum terdeteksi"}, status=status.HTTP_400_BAD_REQUEST)
        except TagihanPendaftaran.DoesNotExist:
            return Response({"message": "Tagihan tidak ditemukan"}, status=status.HTTP_404_NOT_FOUND)

class UploadBuktiPembayaranAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, no_registrasi):
        try:
            tagihan = TagihanPendaftaran.objects.get(pendaftar__no_registrasi=no_registrasi)
            file_obj = request.FILES.get('bukti_pembayaran')
            if not file_obj:
                return Response({"error": "File bukti pembayaran wajib dipilih."}, status=400)
            tagihan.bukti_pembayaran = file_obj
            tagihan.save()
            return Response({
                "message": "Bukti pembayaran berhasil diunggah.",
                "bukti_pembayaran": tagihan.bukti_pembayaran.url if tagihan.bukti_pembayaran else None,
                "status": tagihan.status
            }, status=200)
        except TagihanPendaftaran.DoesNotExist:
            return Response({"error": "Tagihan tidak ditemukan."}, status=404)
