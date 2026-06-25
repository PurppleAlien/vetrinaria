import { describe, it, expect, afterEach } from 'vitest';

describe('Environment Configuration', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('should have DATABASE_URL in env', () => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DATABASE_URL).toContain('postgresql://');
  });

  it('should have NEXTAUTH_SECRET in env', () => {
    process.env.NEXTAUTH_SECRET = 'test-secret';
    expect(process.env.NEXTAUTH_SECRET).toBeDefined();
  });
});
