import requests
import json
import base64
import hmac
import hashlib
import textwrap
from datetime import datetime, timezone
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from .models import PengaturanSistem

def get_bri_config():
    config = PengaturanSistem.objects.first()
    if not config:
        raise Exception("Konfigurasi BRI belum diatur di Database Admin.")
    return config

def get_iso_timestamp():
    """Format: 2021-11-02T13:14:15.678+07:00 atau Z (UTC)"""
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

def sanitize_private_key(raw_key):
    if not raw_key:
        return None
    key_str = raw_key.strip()
    key_str = key_str.replace("-----BEGIN PRIVATE KEY-----", "")
    key_str = key_str.replace("-----END PRIVATE KEY-----", "")
    key_str = key_str.replace("\n", "").replace("\r", "").replace(" ", "")
    formatted_key = "\n".join(textwrap.wrap(key_str, 64))
    return f"-----BEGIN PRIVATE KEY-----\n{formatted_key}\n-----END PRIVATE KEY-----"

def generate_rsa_signature(client_id, timestamp, private_key_pem):
    try:
        string_to_sign = f"{client_id}|{timestamp}"
        clean_pem = sanitize_private_key(private_key_pem)
        private_key = load_pem_private_key(clean_pem.encode('utf-8'), password=None)
        signature = private_key.sign(
            string_to_sign.encode('utf-8'),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return base64.b64encode(signature).decode('utf-8')
    except Exception as e:
        print(f"Error RSA Signature: {e}")
        return None

def get_b2b_snap_token():
    config = get_bri_config()
    if not config.private_key:
        print("Private Key RSA belum dimasukkan di Django Admin!")
        return None

    base_url = "https://partner.api.bri.co.id" if config.is_production else "https://sandbox.partner.api.bri.co.id"
    url = f"{base_url}/snap/v1.0/access-token/b2b"
    
    timestamp = get_iso_timestamp()
    signature = generate_rsa_signature(config.bri_client_id, timestamp, config.private_key)
    
    headers = {
        'X-SIGNATURE': signature,
        'X-CLIENT-KEY': config.bri_client_id,
        'X-TIMESTAMP': timestamp,
        'Content-Type': 'application/json'
    }
    payload = {"grantType": "client_credentials"}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            return response.json().get('accessToken')
        else:
            print(f"Gagal Get Token B2B. Status: {response.status_code}, Respon: {response.text}")
    except Exception as e:
        print(f"Exception Get Token: {e}")
    return None

def generate_hmac_signature(method, endpoint_url, token, body_str, timestamp, client_secret):
    body_hash = hashlib.sha256(body_str.encode('utf-8')).hexdigest().lower()
    string_to_sign = f"{method}:{endpoint_url}:{token}:{body_hash}:{timestamp}"
    
    signature = hmac.new(
        client_secret.encode('utf-8'),
        string_to_sign.encode('utf-8'),
        hashlib.sha512
    ).digest()
    return base64.b64encode(signature).decode('utf-8')

def generate_qris_string(total_amount, no_registrasi):
    token = get_b2b_snap_token()
    if not token:
        return None

    config = get_bri_config()
    base_url = "https://partner.api.bri.co.id" if config.is_production else "https://sandbox.partner.api.bri.co.id"
    endpoint_path = "/snap/v1.1/qr/qr-mpm-generate"
    url = f"{base_url}{endpoint_path}"
    
    formatted_amount = f"{float(total_amount):.2f}"
    
    numeric_no_reg = "".join(filter(str.isdigit, no_registrasi))
    if not numeric_no_reg:
        numeric_no_reg = "123456789"
        
    payload_dict = {
        "partnerReferenceNo": numeric_no_reg[:36],
        "amount": {
            "value": formatted_amount,
            "currency": "IDR"
        },
        "merchantId": config.merchant_id,
        "terminalId": config.terminal_id
    }
    
    payload_str = json.dumps(payload_dict, separators=(',', ':'))
    
    timestamp = get_iso_timestamp()
    signature = generate_hmac_signature("POST", endpoint_path, token, payload_str, timestamp, config.bri_client_secret)

    headers = {
        'Authorization': f'Bearer {token}',
        'X-TIMESTAMP': timestamp,
        'X-SIGNATURE': signature,
        'Content-Type': 'application/json',
        # PERBAIKAN: X-PARTNER-ID wajib diisi dengan Client ID pembuat Token
        'X-PARTNER-ID': config.bri_client_id, 
        'CHANNEL-ID': 'WEB',
        'X-EXTERNAL-ID': numeric_no_reg[:36]
    }
    
    try:
        response = requests.post(url, headers=headers, data=payload_str, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('responseCode') == '2004700':
                return data.get('qrContent')
            print(f"Gagal dari BRI: {data}")
            return None
        else:
            print(f"HTTP Error {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print(f"Error Hit API QRIS: {e}")
        return None

def check_qris_status(tagihan):
    # Simulasi sukses
    return True
