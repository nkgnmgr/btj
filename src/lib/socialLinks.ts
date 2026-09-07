export interface SocialPost {
  id: string;
  url: string;
  caption: string;
  addedAt: string;
}

const platforms: Record<string, string> = {
  'x.com': 'X', 'twitter.com': 'X', 'instagram.com': 'Instagram',
  'tiktok.com': 'TikTok', 'youtube.com': 'YouTube', 'youtu.be': 'YouTube',
  'facebook.com': 'Facebook', 'fb.watch': 'Facebook',
  'threads.net': 'Threads', 'threads.com': 'Threads', 'bsky.app': 'Bluesky',
};

export function parseSocialUrl(input: string): { url: string; platform: string } {
  let parsed: URL;
  try { parsed = new URL(input.trim()); }
  catch { throw new Error('Paste a full social link beginning with https://.'); }
  const host = parsed.hostname.replace(/^(www\.|m\.|mobile\.)/, '');
  const platform = platforms[host];
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.port || !platform)
    throw new Error('Use an HTTPS link from X, Instagram, TikTok, YouTube, Facebook, Threads or Bluesky.');
  if (!parsed.pathname.replace(/\//g, '')) throw new Error('Paste a link to a post, video or profile.');
  if (host === 'twitter.com') parsed.hostname = 'x.com';
  else parsed.hostname = host;
  parsed.hash = '';
  for (const key of [...parsed.searchParams.keys()]) {
    if (key.startsWith('utm_') || ['si', 'fbclid', 'igsh', 'igshid'].includes(key) || (platform === 'X' && ['s', 't'].includes(key))) parsed.searchParams.delete(key);
  }
  parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  return { url: parsed.href, platform };
}

export function normalizeSocialPosts(value: unknown): SocialPost[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.flatMap((item): SocialPost[] => {
    if (!item || typeof item.id !== 'string' || typeof item.url !== 'string' ||
        typeof item.caption !== 'string' || typeof item.addedAt !== 'string' || !Number.isFinite(Date.parse(item.addedAt))) return [];
    try {
      const { url } = parseSocialUrl(item.url);
      if (seen.has(url)) return [];
      seen.add(url);
      return [{ id: item.id, url, caption: item.caption.slice(0, 500), addedAt: item.addedAt }];
    } catch { return []; }
  }).sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt));
}
