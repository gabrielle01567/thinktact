import { db } from './db';

const RATE_LIMITS = {
  FREE: {
    requestsPerDay: 5,
    threadsPerDay: 2,
  },
  PRO: {
    requestsPerDay: 50,
    threadsPerDay: 20,
  },
  ENTERPRISE: {
    requestsPerDay: 500,
    threadsPerDay: 200,
  },
};

// Basic rate limiting configuration
// In a production environment, this would be more sophisticated
export async function getRateLimitConfig(userId: string) {
  return {
    isLimited: false, // For development, we'll disable rate limiting
    limit: 100,
    remaining: 100,
  }
} 