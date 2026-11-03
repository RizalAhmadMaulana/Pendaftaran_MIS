from django.db import models
from django.utils import timezone

def default_syarat_pendaftaran():
    return [
        "Mengisi Formulir Pendaftaran Online",
        "Fotocopy Akta Kelahiran (1 lembar)",
        "Fotocopy Kartu Keluarga (1 lembar)",
        "Pas Foto 3x4 (4 lembar, berwarna / hitam putih)",
        "Fotocopy KPS/KKS (jika menerima)",
        "Fotocopy Ijazah/Raport Terakhir"
    ]

class UnitPendidikan(models.Model):
    kode = models.CharField(max_length=20, unique=True)
    nama = models.CharField(max_length=100)
    kategori_label = models.CharField(max_length=100, default='UNIT PENDIDIKAN')
    lokasi_kampus = models.CharField(max_length=150, default='Kampus Utama (Polanharjo)')
    deskripsi_singkat = models.TextField(blank=True, default='')
    profil_lembaga = models.TextField(blank=True, default='')
    syarat_pendaftaran = models.JSONField(default=default_syarat_pendaftaran)
    is_active = models.BooleanField(default=True, help_text="Saklar utama: jika False maka unit otomatis Tutup")
    urutan = models.IntegerField(default=0)

    class Meta:
        verbose_name = 'Unit Pendidikan'
        verbose_name_plural = 'Unit Pendidikan'
        ordering = ['urutan', 'id']

    def __str__(self):
        return f"{self.nama} ({self.kode})"

    def get_active_gelombang(self):
        if not self.is_active:
            return None
        today = timezone.localdate()
        return self.gelombang_list.filter(
            is_aktif=True,
            tanggal_mulai__lte=today,
            tanggal_selesai__gte=today
        ).order_by('tanggal_mulai', 'id').first()


class GelombangPendaftaran(models.Model):
    unit = models.ForeignKey(UnitPendidikan, on_delete=models.CASCADE, related_name='gelombang_list')
    nama_gelombang = models.CharField(max_length=100)
    tanggal_mulai = models.DateField()
    tanggal_selesai = models.DateField()
    biaya_pendaftaran = models.IntegerField(default=250000)
    is_aktif = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Gelombang Pendaftaran'
        verbose_name_plural = 'Gelombang Pendaftaran'
        ordering = ['tanggal_mulai', 'id']

    def __str__(self):
        return f"{self.unit.nama} - {self.nama_gelombang}"


class Pendaftar(models.Model):
    # Identitas Registrasi & Unit
    no_registrasi = models.CharField(max_length=30, unique=True, blank=True)
    unit = models.CharField(max_length=50, blank=True, default='')

    # Bagian A. Keterangan Calon Peserta Didik
    nama_lengkap = models.CharField(max_length=150)
    jenis_kelamin = models.CharField(max_length=30, blank=True, default='Laki-laki')
    nik = models.CharField(max_length=30, blank=True, default='')
    tempat_lahir = models.CharField(max_length=100, blank=True, default='')
    tanggal_lahir = models.DateField(null=True, blank=True)
    agama = models.CharField(max_length=50, blank=True, default='Islam')

    # Alamat Tempat Tinggal
    jalan = models.CharField(max_length=255, blank=True, default='')
    rt = models.CharField(max_length=20, blank=True, default='')
    rw = models.CharField(max_length=20, blank=True, default='')
    dusun = models.CharField(max_length=100, blank=True, default='')
    desa_kelurahan = models.CharField(max_length=100, blank=True, default='')
    kecamatan = models.CharField(max_length=100, blank=True, default='')
    kabupaten = models.CharField(max_length=100, blank=True, default='Klaten')

    tempat_tinggal = models.CharField(max_length=100, blank=True, default='')
    transportasi = models.CharField(max_length=100, blank=True, default='')
    no_hp = models.CharField(max_length=50, blank=True, default='')
    no_kps_kks = models.CharField(max_length=50, blank=True, default='')

    # Bagian B. Keterangan Orang Tua Kandung
    nama_ayah = models.CharField(max_length=150, blank=True, default='')
    tahun_lahir_ayah = models.CharField(max_length=20, blank=True, default='')
    pendidikan_ayah = models.CharField(max_length=100, blank=True, default='')
    pekerjaan_ayah = models.CharField(max_length=100, blank=True, default='')
    penghasilan_ayah = models.CharField(max_length=100, blank=True, default='')
    status_ayah = models.CharField(max_length=50, blank=True, default='')
    tahun_meninggal_ayah = models.CharField(max_length=20, blank=True, default='')

    nama_ibu = models.CharField(max_length=150, blank=True, default='')
    tahun_lahir_ibu = models.CharField(max_length=20, blank=True, default='')
    pendidikan_ibu = models.CharField(max_length=100, blank=True, default='')
    pekerjaan_ibu = models.CharField(max_length=100, blank=True, default='')
    penghasilan_ibu = models.CharField(max_length=100, blank=True, default='')
    status_ibu = models.CharField(max_length=50, blank=True, default='')
    tahun_meninggal_ibu = models.CharField(max_length=20, blank=True, default='')

    # Bagian C. Data Periodik Calon Peserta Didik
    tinggi_badan = models.CharField(max_length=20, blank=True, default='')
    berat_badan = models.CharField(max_length=20, blank=True, default='')
    jarak_sekolah = models.CharField(max_length=20, blank=True, default='')
    waktu_jam = models.CharField(max_length=20, blank=True, default='')
    waktu_menit = models.CharField(max_length=20, blank=True, default='')

    anak_ke = models.CharField(max_length=20, blank=True, default='')
    dari_berapa_saudara = models.CharField(max_length=20, blank=True, default='')
    jumlah_saudara_kandung = models.CharField(max_length=20, blank=True, default='')
    jumlah_adik = models.CharField(max_length=20, blank=True, default='')
    jumlah_kakak = models.CharField(max_length=20, blank=True, default='')

    # Status & Timestamps
    status_pembayaran = models.CharField(max_length=30, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    # Dokumen & File Upload
    file_kk = models.FileField(upload_to='dokumen/', blank=True, null=True)
    file_akta = models.FileField(upload_to='dokumen/', blank=True, null=True)
    file_foto = models.FileField(upload_to='dokumen/', blank=True, null=True)
    file_ijazah = models.FileField(upload_to='dokumen/', blank=True, null=True)
    
    # Status Tambahan
    status_dokumen = models.CharField(max_length=50, default='BELUM LENGKAP')
    status_seleksi = models.CharField(max_length=50, default='BELUM PENGUMUMAN')
    jadwal = models.ForeignKey('JadwalSeleksi', on_delete=models.SET_NULL, null=True, blank=True, related_name='peserta_list')

    class Meta:
        verbose_name = 'Pendaftar'
        verbose_name_plural = 'Daftar Pendaftar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.no_registrasi} - {self.nama_lengkap}"


class JadwalSeleksi(models.Model):
    unit = models.CharField(max_length=20, default='sd', db_index=True)
    gelombang = models.CharField(max_length=100, default='Gelombang 1 - Tahun Ajaran 2026/2027')
    tanggal = models.DateField()
    waktu_mulai = models.TimeField()
    waktu_selesai = models.TimeField()
    lokasi = models.CharField(max_length=200, default='Aula Kampus Utama')
    deskripsi = models.TextField(blank=True, default="Tes Pemetaan, Observasi Tahsin & Wawancara")

    class Meta:
        verbose_name = 'Jadwal Seleksi'
        verbose_name_plural = 'Jadwal Seleksi'
        ordering = ['-tanggal', '-id']

    def __str__(self):
        return f"[{self.unit.upper()}] {self.gelombang} - {self.tanggal}"



