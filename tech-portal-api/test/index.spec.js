import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src/index.js';

// Test helper
async function makeRequest(path, options = {}) {
  const request = new Request(`http://localhost${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);

  return {
    status: response.status,
    headers: response.headers,
    data: await response.json().catch(() => null)
  };
}

describe('Tech Portal API', () => {

  // ================================
  // HEALTH & BASIC ENDPOINTS
  // ================================
  describe('Health Check', () => {
    it('should return OK status', async () => {
      const res = await makeRequest('/api/health');
      expect(res.status).toBe(200);
      expect(res.data.status).toBe('ok');
      expect(res.data.timestamp).toBeDefined();
    });

    it('should include cache headers', async () => {
      const res = await makeRequest('/api/health');
      expect(res.headers.get('Cache-Control')).toContain('max-age');
    });
  });

  // ================================
  // PUBLIC ENDPOINTS
  // ================================
  describe('Public Endpoints', () => {
    it('GET /api/home should return categories', async () => {
      const res = await makeRequest('/api/home');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('3d-baski');
      expect(res.data).toHaveProperty('teknoloji');
      expect(res.data).toHaveProperty('yapay-zeka');
      expect(Array.isArray(res.data['3d-baski'])).toBe(true);
    });

    it('GET /api/posts should return paginated results', async () => {
      const res = await makeRequest('/api/posts');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('posts');
      expect(res.data).toHaveProperty('pagination');
      expect(Array.isArray(res.data.posts)).toBe(true);
      expect(res.data.pagination).toHaveProperty('page');
      expect(res.data.pagination).toHaveProperty('totalPages');
    });

    it('GET /api/posts should filter by category', async () => {
      const res = await makeRequest('/api/posts?category=teknoloji');
      expect(res.status).toBe(200);
      if (res.data.posts.length > 0) {
        expect(res.data.posts[0].category).toBe('teknoloji');
      }
    });

    it('GET /api/posts should paginate correctly', async () => {
      const res = await makeRequest('/api/posts?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.data.pagination.page).toBe(1);
      expect(res.data.pagination.limit).toBe(5);
    });

    it('GET /api/stats should return counts', async () => {
      const res = await makeRequest('/api/stats');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('total');
    });

    it('GET /api/search should require query', async () => {
      const res = await makeRequest('/api/search');
      expect(res.status).toBe(200);
      expect(res.data.results).toEqual([]);
    });

    it('GET /api/search should search posts', async () => {
      const res = await makeRequest('/api/search?q=test');
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('results');
      expect(res.data).toHaveProperty('query');
      expect(res.data.query).toBe('test');
    });

    it('GET /api/post/:slug should return 404 for missing', async () => {
      const res = await makeRequest('/api/post/non-existent-slug-12345');
      expect(res.status).toBe(404);
      expect(res.data.code).toBe('NOT_FOUND');
    });
  });

  // ================================
  // CORS
  // ================================
  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const res = await makeRequest('/api/health');
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should handle OPTIONS preflight', async () => {
      const request = new Request('http://localhost/api/posts', {
        method: 'OPTIONS'
      });
      const ctx = createExecutionContext();
      const response = await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });
  });

  // ================================
  // ADMIN ENDPOINTS (Protected)
  // ================================
  describe('Admin Endpoints', () => {
    it('should reject requests without secret', async () => {
      const res = await makeRequest('/admin/posts');
      expect(res.status).toBe(403);
      expect(res.data.code).toBe('FORBIDDEN');
    });

    it('should reject requests with wrong secret', async () => {
      const res = await makeRequest('/admin/posts', {
        headers: { 'X-ADMIN-SECRET': 'wrong-secret' }
      });
      expect(res.status).toBe(403);
    });

    // Note: These tests would need actual ADMIN_SECRET to pass
    // In real testing, you'd mock env.ADMIN_SECRET
  });

  // ================================
  // INPUT VALIDATION
  // ================================
  describe('Input Validation', () => {
    it('should handle invalid pagination gracefully', async () => {
      const res = await makeRequest('/api/posts?page=-1&limit=9999');
      expect(res.status).toBe(200);
      expect(res.data.pagination.page).toBeGreaterThan(0);
      expect(res.data.pagination.limit).toBeLessThanOrEqual(50);
    });

    it('should ignore invalid category', async () => {
      const res = await makeRequest('/api/posts?category=invalid-category');
      expect(res.status).toBe(200);
      // Should return all posts, not filter by invalid category
    });

    it('should sanitize search query', async () => {
      const res = await makeRequest('/api/search?q=<script>alert(1)</script>');
      expect(res.status).toBe(200);
      // Query should not cause error
    });
  });

  // ================================
  // ERROR HANDLING
  // ================================
  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await makeRequest('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.data.error).toBeDefined();
    });

    it('should return proper error format', async () => {
      const res = await makeRequest('/api/unknown');
      expect(res.data).toHaveProperty('error');
      expect(res.data).toHaveProperty('code');
    });
  });

  // ================================
  // RATE LIMITING
  // ================================
  describe('Rate Limiting', () => {
    it('should allow normal requests', async () => {
      const res = await makeRequest('/api/health');
      expect(res.status).toBe(200);
    });

    // Note: Full rate limit testing would require many requests
    // and is better done in integration tests
  });
});
