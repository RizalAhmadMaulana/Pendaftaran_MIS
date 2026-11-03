from django.db import models
from ppdb.models import Pendaftar

class PengaturanSistem(models.Model):
    # Kredensial BRI Sandbox User
    bri_client_id = models.CharField(max_length=255, default='2EAYwMs99t3YSmsak45GINC1s7aSDjmJ')
    bri_client_secret = models.CharField(max_length=255, default='DXRUivA3LhGvXeGp')
    merchant_id = models.CharField(max_length=100, default='00007100010926', help_text="ID Merchant unik")
    terminal_id = models.CharField(max_length=100, default='213141251124', help_text="ID Terminal")
    private_key = models.TextField(blank=True, null=True, help_text="Masukkan RSA 2048 Private Key (.pem) di sini untuk SNAP BI")
    is_production = models.BooleanField(default=False, help_text="Biarkan False untuk menggunakan Sandbox")
    
    class Meta:
        verbose_name_plural = "Pengaturan Sistem"
        
    def __str__(self):
        return "Konfigurasi BRI API"

class TagihanPendaftaran(models.Model):
    pendaftar = models.OneToOneField(Pendaftar, on_delete=models.CASCADE, related_name='tagihan')
    kode_unik = models.IntegerField(default=0)
    biaya_pokok = models.IntegerField()
    total_tagihan = models.IntegerField()
    status = models.CharField(max_length=20, default='UNPAID')
    qris_string = models.TextField(blank=True, null=True, help_text="Data QR dari BRI")
    bukti_pembayaran = models.FileField(upload_to='bukti_bayar/', blank=True, null=True, help_text="Bukti transfer / struk pembayaran manual")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tagihan {self.pendaftar.no_registrasi} - Rp {self.total_tagihan}"
