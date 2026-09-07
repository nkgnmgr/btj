import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSocialUrl, normalizeSocialPosts } from '../src/lib/socialLinks.ts';

test('supports social platforms and removes tracking without losing YouTube IDs', () => {
  assert.equal(parseSocialUrl(' https://twitter.com/person/status/123?s=20 ').url, 'https://x.com/person/status/123');
  assert.equal(parseSocialUrl('https://www.youtube.com/watch?v=abc&si=tracking').url, 'https://youtube.com/watch?v=abc');
  for (const host of ['instagram.com', 'tiktok.com', 'youtu.be', 'facebook.com', 'threads.net', 'threads.com', 'bsky.app']) assert.ok(parseSocialUrl(`https://${host}/example`).platform);
});
test('rejects executable links, spoofed domains, credentials and empty links', () => {
  for (const url of ['javascript:alert(1)', 'http://x.com/a', 'https://x.com.evil.test/a', 'https://x.com@evil.test/a', 'https://user:pass@x.com/a', 'https://x.com', 'bad', 'https://x.com:8443/a']) assert.throws(() => parseSocialUrl(url));
});
test('normalizes persisted posts, sorts newest first and deduplicates aliases', () => {
  const post = {id:'one', url:'https://twitter.com/a/status/123?s=20', caption:'Tokyo', addedAt:'2026-09-01T00:00:00Z'};
  const result = normalizeSocialPosts([post, {...post, id:'duplicate', url:'https://x.com/a/status/123'}, {...post, id:'two', url:'https://instagram.com/p/abc', addedAt:'2026-09-02T00:00:00Z'}, {...post, url:'javascript:alert(1)'}, {...post, addedAt:'invalid'}, null]);
  assert.deepEqual(result.map(p => p.id), ['two','one']);
  assert.deepEqual(normalizeSocialPosts({}), []);
  assert.deepEqual(normalizeSocialPosts([]), []);
});
