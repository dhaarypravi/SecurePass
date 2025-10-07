import CryptoJS from 'crypto-js';

/**
 * Derive a secure encryption key from master password
 */
export function deriveKey(masterPassword: string, email: string): string {
  // Use PBKDF2 for key derivation (more secure than simple hashing)
  return CryptoJS.PBKDF2(masterPassword, `${email}-secure-vault-salt`, {
    keySize: 256 / 32,
    iterations: 100000, // High iteration count for security
    hasher: CryptoJS.algo.SHA256,
  }).toString();
}

/**
 * Encrypt data with derived key
 */
export function encryptData(data: string, encryptionKey: string): string {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypt data with derived key
 */
export function decryptData(encryptedData: string, encryptionKey: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Decryption failed - wrong master password');
    }
    
    return decrypted;
  } catch (error) {
    throw new Error('Failed to decrypt data. Please check your master password.');
  }
}

/**
 * Validate master password
 */
export function validateMasterPassword(inputPassword: string, storedHash: string, email: string): boolean {
  const derivedKey = deriveKey(inputPassword, email);
  return CryptoJS.SHA256(derivedKey).toString() === storedHash;
}

/**
 * Generate master password hash for storage
 */
export function generateMasterPasswordHash(masterPassword: string, email: string): string {
  const derivedKey = deriveKey(masterPassword, email);
  return CryptoJS.SHA256(derivedKey).toString();
}

// Keep the old functions for backward compatibility
export function encryptPassword(password: string, encryptionKey: string): string {
  return encryptData(password, encryptionKey);
}

export function decryptPassword(encryptedPassword: string, encryptionKey: string): string {
  return decryptData(encryptedPassword, encryptionKey);
}