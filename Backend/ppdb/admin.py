from django.contrib import admin
from .models import Pendaftar, JadwalSeleksi, UnitPendidikan, GelombangPendaftaran

class GelombangPendaftaranInline(admin.TabularInline):
    model = GelombangPendaftaran
    extra = 1
    fields = ('nama_gelombang', 'tanggal_mulai', 'tanggal_selesai', 'biaya_pendaftaran', 'is_aktif')

@admin.register(UnitPendidikan)
class UnitPendidikanAdmin(admin.ModelAdmin):
    list_display = ('kode', 'nama', 'kategori_label', 'lokasi_kampus', 'is_active', 'urutan')
    list_editable = ('is_active', 'urutan')
    search_fields = ('kode', 'nama', 'lokasi_kampus')
    list_filter = ('is_active', 'kategori_label')
    inlines = [GelombangPendaftaranInline]

@admin.register(GelombangPendaftaran)
class GelombangPendaftaranAdmin(admin.ModelAdmin):
    list_display = ('unit', 'nama_gelombang', 'tanggal_mulai', 'tanggal_selesai', 'biaya_pendaftaran', 'is_aktif')
    list_editable = ('biaya_pendaftaran', 'is_aktif')
    list_filter = ('unit', 'is_aktif')
    search_fields = ('nama_gelombang', 'unit__nama')

@admin.register(Pendaftar)
class PendaftarAdmin(admin.ModelAdmin):
    list_display = (
        'no_registrasi',
        'nama_lengkap',
        'unit',
        'status_pembayaran',
        'status_dokumen',
        'status_seleksi',
        'created_at'
    )
    search_fields = ('no_registrasi', 'nama_lengkap', 'nik')
    list_filter = ('unit', 'status_pembayaran', 'status_dokumen', 'status_seleksi', 'created_at')
    readonly_fields = ('no_registrasi', 'created_at')

@admin.register(JadwalSeleksi)
class JadwalSeleksiAdmin(admin.ModelAdmin):
    list_display = ('gelombang', 'tanggal', 'waktu_mulai', 'waktu_selesai', 'lokasi')
    search_fields = ('gelombang', 'lokasi', 'deskripsi')
    list_filter = ('tanggal', 'gelombang')
