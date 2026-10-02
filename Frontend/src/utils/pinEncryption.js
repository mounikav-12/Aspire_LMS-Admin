// =========================================================
// PIN ENCRYPTION UTILITY — AES-256-GCM Reversible Encryption
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
 * Encrypt a PIN string using AES-256-GCM
 * @param {string} pin - The plain text PIN (e.g. "583921")
 * @returns {Promise<string>} - Formatted string: `${ivHex}:${tagHex}:${ciphertextHex}`
 */
export async function encryptPin(pin) {
  if (!pin) return '';
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const encoded = str2ab(String(pin));

    // AES-GCM output buffer in WebCrypto = [ciphertext bytes][16-byte auth tag]
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
    console.error('[PIN Encryption] Encrypt error:', err);
    return '';
  }
}

/**
 * Decrypt an encrypted PIN string using AES-256-GCM
 * Supports both `${iv}:${tag}:${ciphertext}` and raw hex formats
 * @param {string} encryptedStr - The encrypted PIN string
 * @returns {Promise<string>} - Decrypted plain text PIN (e.g. "583921")
 */
export async function decryptPin(encryptedStr) {
  if (!encryptedStr || typeof encryptedStr !== 'string') return '';
  const trimmed = encryptedStr.trim();

  // If already plain 6-digit numeric PIN, return as is
  if (/^\d{6}$/.test(trimmed)) {
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

        // Combine ciphertext + tag for WebCrypto AES-GCM
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

    // Fallback for contiguous hex string
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
    console.warn('[PIN Encryption] Decrypt fallback notice:', err);
    return '••••••';
  }
}

/**
 * Generate a random 6-digit numeric PIN
 * @returns {string} - A 6-digit PIN string (e.g. "849201")
 */
export function generatePin() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const pin = 100000 + (array[0] % 900000);
  return String(pin);
}
