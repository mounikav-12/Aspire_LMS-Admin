// =========================================================
// PASSKEY CRYPTO UTILITY — AES-256-GCM Reversible Encryption
// Format: `${ivHex}:${authTagHex}:${ciphertextHex}`
// Uses Web Crypto API (SubtleCrypto) for browser-native AES-GCM
// =========================================================

const PIN_ENCRYPTION_PASSPHRASE = 'AspireNextLMS2026@SecurePinKey!';

function str2ab(str) {
  return new TextEncoder().encode(str);
}

function ab2hex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hex2ab(hex) {
  const clean = hex.trim();
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substr(i, 2), 16);
  }
  return bytes.buffer;
}

// Derive a 256-bit crypto key from passphrase via SHA-256
async function getCryptoKey() {
  const hash = await crypto.subtle.digest('SHA-256', str2ab(PIN_ENCRYPTION_PASSPHRASE));
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a clean 6-character alphanumeric passkey (e.g. "k9X4mP")
 * Excludes confusing characters like 0, O, 1, I, l
 * @param {number} length - Number of characters (default 6)
 * @returns {string}
 */
export function generatePasskey(length = 6) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Encrypt a passkey string using AES-256-GCM
 * @param {string} passkey - The plain text passkey (e.g. "k9X4mP")
 * @returns {Promise<string>} - Formatted string: `${ivHex}:${tagHex}:${ciphertextHex}`
 */
export async function encryptPasskey(passkey) {
  if (!passkey) return '';
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const encoded = str2ab(String(passkey));

    const encryptedBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const encryptedBytes = new Uint8Array(encryptedBuf);
    const tagLength = 16;
    const ciphertextBytes = encryptedBytes.slice(0, encryptedBytes.length - tagLength);
    const tagBytes = encryptedBytes.slice(encryptedBytes.length - tagLength);

    const ivHex = ab2hex(iv.buffer);
    const tagHex = ab2hex(tagBytes.buffer);
    const ctHex = ab2hex(ciphertextBytes.buffer);

    return `${ivHex}:${tagHex}:${ctHex}`;
  } catch (err) {
    console.error('[Passkey Crypto] Encrypt error:', err);
    return '';
  }
}

/**
 * Decrypt an encrypted passkey string using AES-256-GCM
 * Supports `${iv}:${tag}:${ciphertext}`, contiguous hex, and plain text
 * @param {string} encryptedStr - The encrypted passkey string
 * @returns {Promise<string>} - Decrypted plain text passkey (e.g. "k9X4mP")
 */
export async function decryptPasskey(encryptedStr) {
  if (!encryptedStr || typeof encryptedStr !== 'string') return '';
  const trimmed = encryptedStr.trim();

  // If already clean plain passkey (e.g. 6 alphanumeric characters without colons)
  if (!trimmed.includes(':') && trimmed.length <= 10) {
    return trimmed;
  }

  try {
    const key = await getCryptoKey();

    if (trimmed.includes(':')) {
      const parts = trimmed.split(':');
      if (parts.length === 3) {
        const [ivHex, tagHex, ctHex] = parts;
        const iv = new Uint8Array(hex2ab(ivHex));
        const ct = new Uint8Array(hex2ab(ctHex));
        const tag = new Uint8Array(hex2ab(tagHex));

        const combined = new Uint8Array(ct.length + tag.length);
        combined.set(ct, 0);
        combined.set(tag, ct.length);

        const decryptedBuf = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          combined.buffer
        );

        return new TextDecoder().decode(decryptedBuf);
      }
    }

    if (trimmed.length >= 28) {
      const ivHex = trimmed.slice(0, 24);
      const ctHex = trimmed.slice(24);
      const iv = new Uint8Array(hex2ab(ivHex));
      const ciphertext = hex2ab(ctHex);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    }

    return trimmed;
  } catch (err) {
    console.warn('[Passkey Crypto] Decrypt error:', err);
    return trimmed;
  }
}

// Aliases for compatibility
export const generatePin = generatePasskey;
export const encryptPin = encryptPasskey;
export const decryptPin = decryptPasskey;
