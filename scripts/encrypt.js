const crypto = require('crypto');
require('dotenv').config({ path: '../.env.local' });

// Load key from environment or use fallback placeholder for testing
const keyString = process.env.ENCRYPTION_KEY || 'e2d7c581a9f032b4c6e917d84b2c1f3a5e8d9b0a1f2c3d4e5f6a7b8c9d0e1f2a';
const key = Buffer.from(keyString, 'hex');

function encryptUrl(url) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
  let encrypted = cipher.update(url);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // Format: iv_hex:encrypted_hex
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

// Ensure an argument was provided
const urlToEncrypt = process.argv[2];

if (!urlToEncrypt) {
  console.log("Usage: node encrypt.js <url_to_encrypt>");
  console.log("Example: node encrypt.js 'https://t.me/SukunaFileShareBot?start=example'");
  process.exit(1);
}

const token = encryptUrl(urlToEncrypt);
console.log("\n✅ Encrypted Token Generated!");
console.log("----------------------------------------");
console.log(`URL: ${urlToEncrypt}`);
console.log(`Token: ${token}`);
console.log("\nTest Link (Assuming localhost:3000):");
console.log(`http://localhost:3000/secure?t=${token}`);
console.log("----------------------------------------\n");
