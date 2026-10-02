// =========================================================
// PASSKEY CRYPTO UTILITY — AES-256-GCM Reversible Encryption
// Format: `${ivHex}:${authTagHex}:${ciphertextHex}`
// Uses Web Crypto API (SubtleCrypto) for browser-native AES-GCM
// =========================================================

const CANDIDATE_SECRETS = [
  'aspire_lms_passkey_vault_secret_2026',
  'some-secure-random-secret-key-12345',
  'AspireNextLMS2026@SecurePinKey!'
];

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

// Derive a 256-bit crypto key from secret via SHA-256
async function getCryptoKey(secret = CANDIDATE_SECRETS[0]) {
  const hash = await crypto.subtle.digest('SHA-256', str2ab(String(secret)));
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random 6-character PIN (at least 1 uppercase, 1 lowercase, 1 digit)
 * Excludes ambiguous chars like 0, 1, I, O, l
 * @param {number} length - Number of characters (default 6)
 * @returns {string}
 */
export function generatePasskey(length = 6) {
  const UPPER    = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const LOWER    = 'abcdefghijkmnpqrstuvwxyz';
  const DIGITS   = '23456789';
  const ALL_CHARS = UPPER + LOWER + DIGITS;

  const len = Math.max(6, length);
  const uArr = new Uint32Array(len);
  crypto.getRandomValues(uArr);

  let result = [];
  result.push(UPPER[uArr[0] % UPPER.length]);
  result.push(LOWER[uArr[1] % LOWER.length]);
  result.push(DIGITS[uArr[2] % DIGITS.length]);

  for (let i = 3; i < len; i++) {
    result.push(ALL_CHARS[uArr[i] % ALL_CHARS.length]);
  }

  // Fisher-Yates shuffle
  const shuffArr = new Uint32Array(len);
  crypto.getRandomValues(shuffArr);
  for (let i = result.length - 1; i > 0; i--) {
    const j = shuffArr[i] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}

/**
 * Encrypt a passkey string using AES-256-GCM
 * @param {string} passkey - The plain text passkey (e.g. "Hk4xRt")
 * @param {string} [secret] - Optional specific secret
 * @returns {Promise<string>} - Formatted string: `${ivHex}:${tagHex}:${ciphertextHex}`
 */
export async function encryptPasskey(passkey, secret) {
  if (!passkey) return '';
  try {
    const key = await getCryptoKey(secret);
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
 * Decrypt an encrypted passkey string using AES-256-GCM with key rotation fallback
 * @param {string} encryptedStr - The encrypted passkey string ("<iv>:<tag>:<cipher>")
 * @param {string} [secret] - Optional specific secret
 * @returns {Promise<string>} - Decrypted plain text passkey
 */
export async function decryptPasskey(encryptedStr, secret) {
  if (!encryptedStr || typeof encryptedStr !== 'string') return '';
  const trimmed = encryptedStr.trim();

  // If already clean plain passkey (e.g. 6 alphanumeric characters without colons)
  if (!trimmed.includes(':') && trimmed.length <= 10) {
    return trimmed;
  }

  const secretsToTry = secret ? [secret] : CANDIDATE_SECRETS;

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

      for (const s of secretsToTry) {
        try {
          const key = await getCryptoKey(s);
          const decryptedBuf = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            combined.buffer
          );
          const res = new TextDecoder().decode(decryptedBuf);
          if (res) return res;
        } catch {
          // try next candidate secret
        }
      }
    }
  }

  return trimmed;
}

// Aliases for compatibility
export const generatePin = generatePasskey;
export const encryptPin = encryptPasskey;
export const decryptPin = decryptPasskey;
