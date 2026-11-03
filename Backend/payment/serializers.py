from rest_framework import serializers
from .models import TagihanPendaftaran

class TagihanSerializer(serializers.ModelSerializer):
    pendaftar_nama = serializers.CharField(source='pendaftar.nama_lengkap', read_only=True)
    pendaftar_no_registrasi = serializers.CharField(source='pendaftar.no_registrasi', read_only=True)
    pendaftar_unit = serializers.CharField(source='pendaftar.unit', read_only=True)

    class Meta:
        model = TagihanPendaftaran
        fields = '__all__'
