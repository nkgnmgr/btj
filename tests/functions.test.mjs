import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost as upload } from '../functions/api/upload.ts';
import { onRequestPost as redeploy } from '../functions/api/redeploy.ts';
import { onRequestPost as socialPosts } from '../functions/api/social-posts.ts';

test('upload rejects unauthenticated requests before storage access', async () => {
  assert.equal((await upload({request:new Request('https://example.test/api/upload',{method:'POST'}),env:{}})).status,401);
});
test('redeploy reports missing configuration and rejects unsigned requests', async () => {
  const request = new Request('https://example.test/api/redeploy',{method:'POST'});
  assert.equal((await redeploy({request,env:{}})).status,501);
  assert.equal((await redeploy({request,env:{DEPLOY_HOOK_URL:'https://example.test/hook'}})).status,401);
});
test('upload and redeploy reject signed-in non-admin users', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async url => new Response(JSON.stringify(String(url).endsWith('/is_admin') ? false : {id:'user'}));
  try {
    const env = { SUPABASE_URL:'https://example.test', SUPABASE_ANON_KEY:'test', DEPLOY_HOOK_URL:'https://example.test/hook' };
    for (const handler of [upload,redeploy]) assert.equal((await handler({request:new Request('https://example.test/api',{method:'POST',headers:{Authorization:'Bearer test'}}),env})).status,403);
  } finally {globalThis.fetch=previous;}
});
test('social post endpoint validates input before contacting Supabase', async () => {
  const env = {
    VITE_SUPABASE_URL: 'https://example.test',
    VITE_SUPABASE_ANON_KEY: 'test',
  };
  const invalid = new Request('https://example.test/api/social-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://fake-x.com/post/1', caption: '' }),
  });
  assert.equal((await socialPosts({ request: invalid, env })).status, 400);
});
