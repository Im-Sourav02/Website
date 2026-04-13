import os
import sys
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend

# Replace this with the actual ENCRYPTION_KEY used in .env.local
ENCRYPTION_KEY_HEX = os.getenv("ENCRYPTION_KEY", "e2d7c581a9f032b4c6e917d84b2c1f3a5e8d9b0a1f2c3d4e5f6a7b8c9d0e1f2a")

def encrypt_url(url: str) -> str:
    # Key must be exactly 32 bytes for AES-256
    key = bytes.fromhex(ENCRYPTION_KEY_HEX)
    
    # Generate 16 byte IV
    iv = os.urandom(16)
    
    # Pad the URL (PKCS7)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(url.encode('utf-8')) + padder.finalize()
    
    # Encrypt via AES-256-CBC
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
    
    # Return format iv_hex:encrypted_hex
    return f"{iv.hex()}:{encrypted_data.hex()}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python encrypt.py <url_to_encrypt>")
        print("Example: python encrypt.py 'https://t.me/SukunaFileShareBot?start=example'")
        sys.exit(1)
        
    url_to_encrypt = sys.argv[1]
    token = encrypt_url(url_to_encrypt)
    
    print("\n✅ Encrypted Token Generated!")
    print("-" * 40)
    print(f"URL: {url_to_encrypt}")
    print(f"Token: {token}")
    print(f"Test Link: http://localhost:3000/secure?t={token}")
    print("-" * 40 + "\n")
