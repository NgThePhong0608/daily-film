/**
 * Fetch with retry and timeout support
 */

interface FetchWithRetryOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Fetch with automatic retry on failure
 * @param url - URL to fetch
 * @param options - Fetch options with retry configuration
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 15000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on abort (intentional cancellation)
      if ((error as Error).name === "AbortError") {
        console.warn(
          `Fetch timeout for ${url} (attempt ${attempt + 1}/${retries + 1})`,
        );
      }

      // Wait before retrying (with exponential backoff)
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        console.log(
          `Retrying fetch in ${delay}ms... (attempt ${attempt + 2}/${retries + 1})`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw (
    lastError ||
    new Error(`Failed to fetch ${url} after ${retries + 1} attempts`)
  );
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
