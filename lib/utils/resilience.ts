function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as Record<string, unknown>;
  if (err.status === 429 || err.statusCode === 429) {
    return true;
  }
  const details = err.details as Record<string, unknown> | undefined;
  if (details?.status === 429 || details?.statusCode === 429) {
    return true;
  }
  const message = String(err.message || "").toLowerCase();
  if (message.includes("429") || message.includes("rate limit") || message.includes("ratelimit") || message.includes("too many requests")) {
    return true;
  }
  if (err.cause && typeof err.cause === "object") {
    const causeErr = err.cause as Record<string, unknown>;
    const causeMessage = String(causeErr.message || "").toLowerCase();
    if (causeMessage.includes("429") || causeMessage.includes("rate limit") || causeMessage.includes("ratelimit") || causeMessage.includes("too many requests")) {
      return true;
    }
  }
  return false;
}

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
      
      // If we detect a 429 (Rate Limit) error, apply a much larger base delay (e.g. 15 seconds)
      const isRateLimit = isRateLimitError(error);
      const currentBaseDelay = isRateLimit ? Math.max(delay, 15000) : delay;
      const backoffDelay = currentBaseDelay * Math.pow(backoffFactor, attempt - 1);
      
      console.warn(
        `Attempt ${attempt} failed${isRateLimit ? " due to Rate Limit (429)" : ""}. ` +
        `Retrying in ${backoffDelay}ms... Error:`, 
        error
      );
      
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
}
