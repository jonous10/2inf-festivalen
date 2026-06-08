// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const limiters = new Map<string, RateLimitEntry>();

export function rateLimit(
  key: string,
  maxRequests: number = 100,
  windowMs: number = 60000, // 1 minute default
): boolean {
  const now = Date.now();
  const entry = limiters.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new limit window
    limiters.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return true; // Request allowed
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return true; // Request allowed
  }

  return false; // Rate limit exceeded
}

export function getRateLimitStatus(
  key: string,
  maxRequests: number = 100,
): { remaining: number; resetTime: number | null } {
  const entry = limiters.get(key);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      remaining: maxRequests,
      resetTime: null,
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limiters.entries()) {
    if (now > entry.resetTime) {
      limiters.delete(key);
    }
  }
}, 60000); // Clean up every minute
