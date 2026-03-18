/**
 * Session storage helper to centralize all session-related operations.
 * Enhanced with lightweight client-side encoding and a 20-day expiration policy.
 */

const SESSION_SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET || 'nbc-rag-frontend-default-secret-key-12345';
const EXPIRY_DAYS = 20;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const SESSION_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  USER_ID: 'userId',
};

/**
 * Encoding Helpers
 */
const encodeBase64 = (value: string): string => {
  if (typeof window === 'undefined') return value;
  return window.btoa(unescape(encodeURIComponent(value)));
};

const decodeBase64 = (value: string): string | null => {
  try {
    if (typeof window === 'undefined') return value;
    return decodeURIComponent(escape(window.atob(value)));
  } catch (e) {
    console.error('Decoding failed', e);
    return null;
  }
};

const xorTransform = (value: string): string => {
  return value
    .split('')
    .map((char, index) =>
      String.fromCharCode(
        char.charCodeAt(0) ^
          SESSION_SECRET.charCodeAt(index % SESSION_SECRET.length)
      )
    )
    .join('');
};

const encrypt = (data: string): string => {
  return encodeBase64(xorTransform(data));
};

const decrypt = (encryptedData: string): string | null => {
  try {
    const decoded = decodeBase64(encryptedData);
    if (!decoded) return null;
    return xorTransform(decoded);
  } catch (e) {
    console.error('Decryption failed', e);
    return null;
  }
};

/**
 * Expiry Helpers
 */
interface SessionData {
  value: string;
  expiry: number;
}

const wrapWithExpiry = (value: string): string => {
  const data: SessionData = {
    value,
    expiry: Date.now() + EXPIRY_MS,
  };
  return JSON.stringify(data);
};

const unwrapIfValid = (wrappedValue: string, key: string): string | null => {
  try {
    const data: SessionData = JSON.parse(wrappedValue);
    if (Date.now() > data.expiry) {
      console.warn(`Session key ${key} has expired.`);
      sessionHelper.clearSession();
      return null;
    }
    return data.value;
  } catch (e) {
    // If it's not JSON, it might be legacy or corrupted data
    return null;
  }
};

export const sessionHelper = {
  /**
   * Set all session data after login or registration
   */
  setSession: (accessToken: string, refreshToken: string, user: any) => {
    if (typeof window === 'undefined') return;
    
    sessionHelper.setItem(SESSION_KEYS.ACCESS_TOKEN, accessToken);
    sessionHelper.setItem(SESSION_KEYS.REFRESH_TOKEN, refreshToken);
    sessionHelper.setItem(SESSION_KEYS.USER, JSON.stringify(user));
    if (user.id || user._id) {
      sessionHelper.setItem(SESSION_KEYS.USER_ID, user.id || user._id);
    }
  },

  /**
   * Get the access token from session storage
   */
  getAccessToken: (): string | null => {
    return sessionHelper.getItem(SESSION_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get the current user from session storage
   */
  getUser: (): any | null => {
    const userStr = sessionHelper.getItem(SESSION_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from session', e);
      return null;
    }
  },

  /**
   * Clear all session data (logout)
   */
  clearSession: () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(SESSION_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(SESSION_KEYS.REFRESH_TOKEN);
    sessionStorage.removeItem(SESSION_KEYS.USER);
    sessionStorage.removeItem(SESSION_KEYS.USER_ID);
  },

  /**
   * Generic get item with decryption and expiry check
   */
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const encryptedAndWrapped = sessionStorage.getItem(key);
    if (!encryptedAndWrapped) return null;

    const decrypted = decrypt(encryptedAndWrapped);
    if (!decrypted) return null;

    return unwrapIfValid(decrypted, key);
  },

  /**
   * Generic set item with encryption and expiry
   */
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    const wrapped = wrapWithExpiry(value);
    const encrypted = encrypt(wrapped);
    sessionStorage.setItem(key, encrypted);
  },

  /**
   * Generic remove item
   */
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }
};
