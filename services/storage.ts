
import { GeneratedImage } from '../types';

const STORAGE_KEYS = {
  IMAGES: 'vogue_ai_images',
  CREDITS: 'vogue_ai_credits'
};

/**
 * Base64 images from Gemini can be extremely large (up to 2MB per image).
 * LocalStorage has a strict global limit of ~5MB per origin.
 * We prioritize the most recent generations and prune older ones aggressively
 * to ensure the application remains stable.
 */
const MAX_INITIAL_CACHE_COUNT = 3; 
const SAFE_CHARACTER_LIMIT = 4000000; // ~4MB safety threshold for serialized data

export const storage = {
  /**
   * Retrieves images from LocalStorage with deep validation to prevent
   * app crashes due to corrupted or malformed data.
   */
  getImages: (): GeneratedImage[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IMAGES);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      
      // Filter out invalid items to maintain type safety
      return parsed.filter((img): img is GeneratedImage => 
        img && 
        typeof img === 'object' && 
        typeof img.url === 'string' &&
        img.url.startsWith('data:image')
      );
    } catch (e) {
      console.warn("Session storage corrupted. Resetting local cache.");
      try { localStorage.removeItem(STORAGE_KEYS.IMAGES); } catch(err) {}
      return [];
    }
  },

  /**
   * Saves images to LocalStorage using an adaptive pruning strategy.
   * If the browser's quota is reached, it automatically discards the oldest
   * items and retries until the write operation succeeds.
   */
  saveImages: (images: GeneratedImage[]) => {
    if (!images || images.length === 0) {
      try { localStorage.removeItem(STORAGE_KEYS.IMAGES); } catch(e) {}
      return;
    }

    // Create a copy and sort by most recent (highest timestamp) first
    let toStore = [...images]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_INITIAL_CACHE_COUNT);

    // Iterative pruning loop to guarantee a successful save
    while (toStore.length > 0) {
      try {
        const serialized = JSON.stringify(toStore);
        
        // 1. Proactive size check: If string is clearly too big for LocalStorage,
        // prune early to avoid triggering the more expensive QuotaExceeded exception.
        if (serialized.length > SAFE_CHARACTER_LIMIT) {
          console.debug(`Data size (${serialized.length}) exceeds safe limit. Pruning...`);
          toStore.pop(); // Remove oldest
          continue;
        }

        // 2. Physical write attempt
        localStorage.setItem(STORAGE_KEYS.IMAGES, serialized);
        return; // Success: Exit function

      } catch (e: any) {
        // 3. Handle physical browser quota limits (code 22 or specific names)
        const isQuotaError = 
          e.name === 'QuotaExceededError' || 
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
          e.code === 22;

        if (isQuotaError && toStore.length > 1) {
          console.warn(`Physical storage quota reached with ${toStore.length} images. Retrying with fewer items.`);
          toStore.pop(); // Discard the oldest generation and try again
        } else if (isQuotaError && toStore.length === 1) {
          // Even a single image is too large for the remaining LocalStorage space
          console.error("Single image too large for available storage space.");
          try { localStorage.removeItem(STORAGE_KEYS.IMAGES); } catch(err) {}
          break;
        } else {
          // Unrecoverable error (e.g. JSON stringify failure)
          console.error("Critical storage error:", e);
          break;
        }
      }
    }

    // Final fallback: If even one image fails, we ensure the key is cleaned up
    // to prevent lingering stale or partial data.
    if (toStore.length === 0) {
      try { localStorage.removeItem(STORAGE_KEYS.IMAGES); } catch(e) {}
    }
  },

  getCredits: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREDITS);
      return data ? parseInt(data, 10) : 10;
    } catch (e) {
      return 10;
    }
  },

  saveCredits: (credits: number) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CREDITS, credits.toString());
    } catch (e) {}
  },

  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.IMAGES);
      localStorage.removeItem(STORAGE_KEYS.CREDITS);
    } catch (e) {}
  }
};
