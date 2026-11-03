from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

# Generate Private Key
private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

# Serialize Private Key
pem_private = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Serialize Public Key
public_key = private_key.public_key()
pem_public = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

with open("private_key.pem", "wb") as f:
    f.write(pem_private)
with open("public_key.pem", "wb") as f:
    f.write(pem_public)

print("Kunci RSA berhasil dibuat: private_key.pem & public_key.pem")

