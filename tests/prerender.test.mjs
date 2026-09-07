import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

test('prerender respects zero published pages and escapes JSON-LD script content', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'japan-prerender-'));
  try {
    for (const folder of ['scripts','src/lib','dist/public']) await mkdir(path.join(root,folder),{recursive:true});
    await copyFile(new URL('../scripts/prerender.mjs',import.meta.url),path.join(root,'scripts/prerender.mjs'));
    await copyFile(new URL('../src/lib/countries.ts',import.meta.url),path.join(root,'src/lib/countries.ts'));
    await writeFile(path.join(root,'dist/public/index.html'),'<html><head><meta name="viewport" content="width=device-width"></head><body></body></html>');
    const preload = path.join(root,'mock.mjs');
    await writeFile(preload,'globalThis.fetch = async () => new Response("[]");');
    const run = () => execFileSync(process.execPath,['--experimental-strip-types','--import',preload,path.join(root,'scripts/prerender.mjs')],{env:{...process.env,VITE_SUPABASE_URL:'https://example.test',VITE_SUPABASE_ANON_KEY:'test'}});
    run();
    assert.deepEqual(await readdir(path.join(root,'dist/public')),['index.html']);
    const rows=[{slug:'test',title:'</script><script>alert(1)</script>',flag:'',native_name:'en',sections:[]}];
    await writeFile(preload,`globalThis.fetch = async () => new Response(${JSON.stringify(JSON.stringify(rows))});`);
    run();
    const html = await readFile(path.join(root,'dist/public/country/test/index.html'),'utf8');
    assert.ok(!html.includes('</script><script>alert(1)</script>'));
    assert.ok(html.includes('\\u003c/script>'));
  } finally {await rm(root,{recursive:true,force:true});}
});
