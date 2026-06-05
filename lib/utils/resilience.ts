export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  backoffFactor = 2
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw error;
      }
      const backoffDelay = delay * Math.pow(backoffFactor, attempt - 1);
      console.warn(`Attempt ${attempt} failed. Retrying in ${backoffDelay}ms... Error:`, error);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
}
