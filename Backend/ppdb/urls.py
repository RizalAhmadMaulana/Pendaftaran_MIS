from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    PendaftarCreateAPIView,
    CustomTokenObtainPairView,
    DashboardDataAPIView,
    DokumenUploadAPIView,
    JadwalSeleksiAPIView,
    UnitPendidikanListAPIView,
    UnitPendidikanDetailAPIView,
    GelombangListCreateAPIView,
    GelombangDetailAPIView,
    AdminStatsAPIView,
    AdminPendaftarListAPIView,
    AdminPendaftarDetailAPIView,
    AdminJadwalListCreateAPIView,
    AdminJadwalDetailAPIView,
    AdminJadwalPesertaAPIView,
    AdminAssignJadwalAPIView,
    AdminKeputusanSeleksiAPIView,
)

urlpatterns = [
    # Unit & Gelombang
    path('units/', UnitPendidikanListAPIView.as_view(), name='unit-list'),
    path('units/<str:kode>/', UnitPendidikanDetailAPIView.as_view(), name='unit-detail'),
    path('gelombang/', GelombangListCreateAPIView.as_view(), name='gelombang-list-create'),
    path('gelombang/<int:pk>/', GelombangDetailAPIView.as_view(), name='gelombang-detail'),

    # Admin Portal Endpoints
    path('admin/stats/', AdminStatsAPIView.as_view(), name='admin-stats'),
    path('admin/pendaftar/', AdminPendaftarListAPIView.as_view(), name='admin-pendaftar-list'),
    path('admin/pendaftar/<int:pk>/', AdminPendaftarDetailAPIView.as_view(), name='admin-pendaftar-detail'),
    path('admin/pendaftar/<int:pk>/keputusan/', AdminKeputusanSeleksiAPIView.as_view(), name='admin-keputusan-seleksi'),
    path('admin/jadwal/', AdminJadwalListCreateAPIView.as_view(), name='admin-jadwal-list-create'),
    path('admin/jadwal/<int:pk>/', AdminJadwalDetailAPIView.as_view(), name='admin-jadwal-detail'),
    path('admin/jadwal/<int:pk>/peserta/', AdminJadwalPesertaAPIView.as_view(), name='admin-jadwal-peserta'),
    path('admin/jadwal/<int:pk>/assign/', AdminAssignJadwalAPIView.as_view(), name='admin-jadwal-assign'),


    # Siswa & PPDB Core
    path('daftar/', PendaftarCreateAPIView.as_view(), name='pendaftar-create'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard-data/', DashboardDataAPIView.as_view(), name='dashboard_data'),
    path('upload-dokumen/', DokumenUploadAPIView.as_view(), name='upload_dokumen'),
    path('jadwal/', JadwalSeleksiAPIView.as_view(), name='jadwal_seleksi'),
]
