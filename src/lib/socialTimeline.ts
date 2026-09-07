import { useQuery } from '@tanstack/react-query';
import { getSupabase, supabaseEnabled } from './supabase';
import { normalizeSocialPosts, parseSocialUrl, type SocialPost } from './socialLinks';

export const timelineKey = ['social-posts'];
export async function fetchSocialPosts(): Promise<SocialPost[]> {
  if (!supabaseEnabled) return [];
  const { data, error } = await getSupabase()
    .from('social_posts')
    .select('id,url,caption,added_at')
    .order('added_at', { ascending: false });
  if (error) throw error;
  return normalizeSocialPosts((data ?? []).map((post) => ({
    id: post.id,
    url: post.url,
    caption: post.caption,
    addedAt: post.added_at,
  })));
}
export async function addSocialPost(input: { url: string; caption: string }): Promise<SocialPost> {
  if (!supabaseEnabled) throw new Error('Link submissions are not configured yet.');
  const parsed = parseSocialUrl(input.url);
  const caption = input.caption.trim().slice(0, 500);
  const response = await fetch('/api/social-posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: parsed.url, caption }),
  });
  const result = await response.json() as SocialPost & { error?: string };
  if (!response.ok) throw new Error(result.error ?? 'The link could not be added.');
  return result;
}
export async function removeSocialPost(id: string): Promise<void> {
  const { error } = await getSupabase().from('social_posts').delete().eq('id', id);
  if (error) throw error;
}
export function useSocialPosts() {
  return useQuery({ queryKey: timelineKey, queryFn: fetchSocialPosts, staleTime: 30_000 });
}
