import datetime
from django.core.management.base import BaseCommand
from ppdb.models import UnitPendidikan, GelombangPendaftaran, default_syarat_pendaftaran

class Command(BaseCommand):
    help = "Seed initial 6 Educational Units (TPA, KB, TK, SD, SMP, SMA) and their waves"

    def handle(self, *args, **options):
        units_data = [
            {
                "kode": "tpa",
                "nama": "TPA Ma'had Imam Syafi'i",
                "kategori_label": "PENDIDIKAN NON-FORMAL AL-QUR'AN",
                "lokasi_kampus": "Kampus 1 (Polanharjo, Klaten)",
                "deskripsi_singkat": "Program pendidikan baca tulis Al-Qur'an dan dasar-dasar ilmu agama Islam untuk anak-anak sejak usia dini dengan metode praktis dan menyenangkan.",
                "profil_lembaga": "TPA Ma'had Imam Syafi'i berdedikasi membimbing santri cilik dalam melafalkan dan menghafalkan ayat-ayat suci Al-Qur'an dengan kaidah tajwid yang lurus, membiasakan adab harian, doa-doa ma'tsurat, dan pengenalan sirah nabawiyah sejak usia dini.",
                "biaya_g1": 150000,
                "biaya_g2": 175000,
                "urutan": 1,
            },
            {
                "kode": "kb",
                "nama": "Kelompok Bermain (KB) Islam Terpadu",
                "kategori_label": "PENDIDIKAN ANAK USIA DINI (PAUD)",
                "lokasi_kampus": "Kampus 1 (Polanharjo, Klaten)",
                "deskripsi_singkat": "Mengembangkan potensi fitrah dan kecerdasan anak melalui stimulasi bermain edukatif Islami yang aman, nyaman, dan terarah.",
                "profil_lembaga": "KB Islam Terpadu Ma'had Imam Syafi'i menyiapkan pondasi karakter anak yang saleh, mandiri, dan berakhlakul karimah melalui pendekatan sensorik, motorik, dan pembiasaan adab Islami harian.",
                "biaya_g1": 200000,
                "biaya_g2": 225000,
                "urutan": 2,
            },
            {
                "kode": "tk",
                "nama": "Taman Kanak-Kanak (TK) Islam Terpadu",
                "kategori_label": "TAMAN KANAK-KANAK (TK)",
                "lokasi_kampus": "Kampus 1 (Polanharjo, Klaten)",
                "deskripsi_singkat": "Pembentukan pondasi adab, tahfidz juz 30, literasi, dan numerasi awal yang menyenangkan bagi masa keemasan anak.",
                "profil_lembaga": "TK Islam Terpadu Ma'had Imam Syafi'i membimbing anak mencintai Al-Qur'an dan Sunnah, siap mandiri secara sosial-emosional, serta memiliki kesiapan kognitif optimal menuju jenjang Sekolah Dasar.",
                "biaya_g1": 250000,
                "biaya_g2": 275000,
                "urutan": 3,
            },
            {
                "kode": "sd",
                "nama": "SD Islam Terpadu Ma'had Imam Syafi'i",
                "kategori_label": "SEKOLAH DASAR (SD)",
                "lokasi_kampus": "Kampus 1 (Polanharjo, Klaten)",
                "deskripsi_singkat": "Integrasi kurikulum nasional, tahfidzul Qur'an mutqin, serta penguasaan dasar-dasar bahasa Arab dan ilmu syar'i.",
                "profil_lembaga": "SD Islam Terpadu Ma'had Imam Syafi'i memadukan keunggulan akademik sains dan teknologi dengan penanaman aqidah shahihah, pembiasaan akhlak mulia, dan target hafalan Al-Qur'an juz 28, 29, 30.",
                "biaya_g1": 300000,
                "biaya_g2": 350000,
                "urutan": 4,
            },
            {
                "kode": "smp",
                "nama": "SMP Islam Terpadu / Pondok Pesantren",
                "kategori_label": "SEKOLAH MENENGAH PERTAMA (SMP)",
                "lokasi_kampus": "Kampus 2 (Boarding School, Polanharjo)",
                "deskripsi_singkat": "Pendidikan berasrama (boarding) dengan fokus tahfidz Al-Qur'an 30 juz, bahasa Arab aktif, dan keunggulan akademik.",
                "profil_lembaga": "SMP Islam Terpadu Ma'had Imam Syafi'i membina generasi remaja muslim yang kokoh aqidahnya, fasih berbahasa Arab dan Inggris, serta berprestasi tinggi dalam kompetisi sains dan teknologi.",
                "biaya_g1": 350000,
                "biaya_g2": 400000,
                "urutan": 5,
            },
            {
                "kode": "sma",
                "nama": "SMA Islam Terpadu / Madrasah Aliyah",
                "kategori_label": "SEKOLAH MENENGAH ATAS (SMA)",
                "lokasi_kampus": "Kampus 2 (Boarding School, Polanharjo)",
                "deskripsi_singkat": "Kaderisasi ulama dan intelektual muslim masa depan dengan penguasaan kitab turots dan persiapan perguruan tinggi terbaik.",
                "profil_lembaga": "SMA Islam Terpadu Ma'had Imam Syafi'i mengantarkan santri menuju gerbang perguruan tinggi ternama baik di dalam negeri maupun Timur Tengah (Madinah, Mesir, LIPIA) dan universitas riset global.",
                "biaya_g1": 400000,
                "biaya_g2": 450000,
                "urutan": 6,
            },
        ]

        today = datetime.date.today()
        # Gelombang 1 mencakup tanggal hari ini
        g1_mulai = datetime.date(today.year, 10, 1) if today.month >= 10 else datetime.date(today.year - 1, 10, 1)
        g1_selesai = datetime.date(today.year if today.month >= 10 else today.year, 12, 31)
        # Gelombang 2 mendatang
        g2_mulai = datetime.date(g1_selesai.year + 1, 1, 1)
        g2_selesai = datetime.date(g1_selesai.year + 1, 3, 31)

        self.stdout.write("Mulai seeding data unit pendidikan dan gelombang pendaftaran...")

        for data in units_data:
            unit, created = UnitPendidikan.objects.update_or_create(
                kode=data["kode"],
                defaults={
                    "nama": data["nama"],
                    "kategori_label": data["kategori_label"],
                    "lokasi_kampus": data["lokasi_kampus"],
                    "deskripsi_singkat": data["deskripsi_singkat"],
                    "profil_lembaga": data["profil_lembaga"],
                    "syarat_pendaftaran": default_syarat_pendaftaran(),
                    "is_active": True,
                    "urutan": data["urutan"],
                }
            )

            # Gelombang 1 (Aktif)
            GelombangPendaftaran.objects.update_or_create(
                unit=unit,
                nama_gelombang="Gelombang 1 (Early Bird)",
                defaults={
                    "tanggal_mulai": g1_mulai,
                    "tanggal_selesai": g1_selesai,
                    "biaya_pendaftaran": data["biaya_g1"],
                    "is_aktif": True,
                }
            )

            # Gelombang 2 (Mendatang)
            GelombangPendaftaran.objects.update_or_create(
                unit=unit,
                nama_gelombang="Gelombang 2 (Reguler)",
                defaults={
                    "tanggal_mulai": g2_mulai,
                    "tanggal_selesai": g2_selesai,
                    "biaya_pendaftaran": data["biaya_g2"],
                    "is_aktif": True,
                }
            )

            status_str = "Dibuat" if created else "Diperbarui"
            self.stdout.write(self.style.SUCCESS(f"[{status_str}] Unit: {unit.nama} ({unit.kode})"))

        self.stdout.write(self.style.SUCCESS("Seeding Unit Pendidikan & Gelombang selesai dengan sukses!"))

