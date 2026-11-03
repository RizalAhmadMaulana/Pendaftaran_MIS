from django.urls import path
from .views import TagihanDetailAPIView, CekPembayaranAPIView, UploadBuktiPembayaranAPIView
from ppdb.views import UnitPendidikanListAPIView

urlpatterns = [
    path('units/', UnitPendidikanListAPIView.as_view(), name='payment_unit_list'),
    path('tagihan/<str:no_registrasi>/', TagihanDetailAPIView.as_view(), name='tagihan_detail'),
    path('cek-pembayaran/<str:no_registrasi>/', CekPembayaranAPIView.as_view(), name='cek_pembayaran'),
    path('upload-bukti/<str:no_registrasi>/', UploadBuktiPembayaranAPIView.as_view(), name='upload_bukti'),
]

