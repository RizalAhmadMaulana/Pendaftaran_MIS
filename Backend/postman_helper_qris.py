import hmac
import hashlib
import json
import base64
from datetime import datetime, timezone

# --- ⚠️ MASUKKAN TOKEN DARI POSTMAN DI SINI ⚠️ ---
client_secret = "DXRUivA3LhGvXeGp"
token = "kU9xmJuS0Q3fJ0z3Lv4AY0xJDwwL" 
# ------------------------------------------------

method = "POST"
endpoint_path = "/snap/v1.1/qr/qr-mpm-generate"
timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

# Data transaksi (Sengaja kita buat sederhana tanpa huruf untuk menghindari error X-EXTERNAL-ID)
payload_dict = {
    "partnerReferenceNo": "1234567890133",
    "amount": {
        "value": "250158.00",
        "currency": "IDR"
    },
    "merchantId": "00007100010926",
    "terminalId": "213141251124"
}

# Minify JSON persis seperti Django
payload_str = json.dumps(payload_dict, separators=(',', ':'))

# 1. Hash Body (SHA256) -> Hex Encode -> Lowercase
body_hash = hashlib.sha256(payload_str.encode('utf-8')).hexdigest().lower()

# 2. String to Sign
string_to_sign = f"{method}:{endpoint_path}:{token}:{body_hash}:{timestamp}"

# 3. HMAC-SHA512
signature = hmac.new(
    client_secret.encode('utf-8'),
    string_to_sign.encode('utf-8'),
    hashlib.sha512
).digest()

x_signature = base64.b64encode(signature).decode('utf-8')

print("\n=== 🚀 COPY PASTE KE POSTMAN UNTUK TAHAP 2 🚀 ===")
print(f"URL: https://sandbox.partner.api.bri.co.id{endpoint_path}")
print("\n--- HEADERS ---")
print(f"Authorization : Bearer {token}")
print(f"X-TIMESTAMP   : {timestamp}")
print(f"X-SIGNATURE   : {x_signature}")
print(f"X-PARTNER-ID  : 2EAYwMs99t3YSmsak45GINC1s7aSDjmJ")
print(f"CHANNEL-ID    : WEB")
print(f"X-EXTERNAL-ID : 1234567890133")
print(f"Content-Type  : application/json")
print("\n--- BODY (raw -> JSON) ---")
print(payload_str)
print("===================================================\n")