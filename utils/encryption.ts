import crypto from 'crypto';

/**
 * Decrypts a token payload.
 * The payload is expected to be in the format `iv:encryptedData` (both in hex).
 * We decrypt it using AES-256-CBC and the ENCRYPTION_KEY from environment variables.
 */
export function decryptToken(encryptedPayload: string): string | null {
  try {
    const keyString = process.env.ENCRYPTION_KEY;
    if (!keyString) {
      console.error('Missing ENCRYPTION_KEY in environment variables');
      return null;
    }

    // Convert hex string to 32-byte buffer
    const key = Buffer.from(keyString, 'hex');

    const [ivHex, encryptedHex] = encryptedPayload.split(':');
    if (!ivHex || !encryptedHex) {
      console.error('Invalid token format');
      return null;
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf-8');
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}
