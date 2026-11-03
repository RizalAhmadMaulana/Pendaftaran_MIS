import base64
from datetime import datetime, timezone
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key

client_id = "2EAYwMs99t3YSmsak45GINC1s7aSDjmJ"
timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

with open("private_key.pem", "rb") as f:
    private_key = load_pem_private_key(f.read(), password=None)

string_to_sign = f"{client_id}|{timestamp}"
signature = private_key.sign(string_to_sign.encode('utf-8'), padding.PKCS1v15(), hashes.SHA256())
x_signature = base64.b64encode(signature).decode('utf-8')

print("\n=== COPY PASTE KE HEADERS POSTMAN ===")
print(f"X-TIMESTAMP : {timestamp}")
print(f"X-SIGNATURE : {x_signature}")
print("=====================================\n")