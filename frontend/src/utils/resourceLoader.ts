/**
 * Utility for handling resource loading with fallbacks
 * This helps prevent ERR_BLOCKED_BY_CLIENT errors from breaking the application
 */

// Cache for loaded resources
const resourceCache: Record<string, any> = {};

/**
 * Load a resource with fallback options
 * @param primaryUrl The primary URL to load the resource from
 * @param fallbackUrl Optional fallback URL
 * @param resourceType The type of resource (script, style, image, etc.)
 * @returns Promise that resolves when the resource is loaded
 */
export const loadResource = async (
  primaryUrl: string,
  fallbackUrl?: string,
  resourceType: 'script' | 'style' | 'image' = 'script'
): Promise<any> => {
  // Check if resource is already cached
  if (resourceCache[primaryUrl]) {
    return resourceCache[primaryUrl];
  }

  try {
    // Try loading from primary URL
    const resource = await loadResourceFromUrl(primaryUrl, resourceType);
    resourceCache[primaryUrl] = resource;
    return resource;
  } catch (error) {
    console.warn(`Failed to load resource from ${primaryUrl}:`, error);
    
    // If fallback URL is provided, try loading from there
    if (fallbackUrl) {
      try {
        const fallbackResource = await loadResourceFromUrl(fallbackUrl, resourceType);
        resourceCache[primaryUrl] = fallbackResource;
        return fallbackResource;
      } catch (fallbackError) {
        console.error(`Failed to load fallback resource from ${fallbackUrl}:`, fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
};

/**
 * Load a resource from a specific URL
 * @param url The URL to load the resource from
 * @param resourceType The type of resource
 * @returns Promise that resolves when the resource is loaded
 */
const loadResourceFromUrl = (url: string, resourceType: 'script' | 'style' | 'image'): Promise<any> => {
  return new Promise((resolve, reject) => {
    switch (resourceType) {
      case 'script':
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
        break;
        
      case 'style':
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.onload = () => resolve(link);
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${url}`));
        document.head.appendChild(link);
        break;
        
      case 'image':
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        break;
        
      default:
        reject(new Error(`Unsupported resource type: ${resourceType}`));
    }
  });
};

/**
 * Check if a resource is blocked by the client
 * @param url The URL to check
 * @returns Promise that resolves to true if the resource is blocked
 */
export const isResourceBlocked = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // This helps detect some blocking scenarios
    });
    
    clearTimeout(timeoutId);
    return false;
  } catch (error) {
    // If we get a specific error or timeout, assume it's blocked
    return true;
  }
}; 