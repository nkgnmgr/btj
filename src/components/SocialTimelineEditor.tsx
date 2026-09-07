import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type SocialPost } from '@/lib/socialLinks';
import { addSocialPost, removeSocialPost, timelineKey, useSocialPosts } from '@/lib/socialTimeline';
import { TIMELINE_TITLE, TimelineList } from './SocialTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SocialTimelineEditor() {
  const { data: posts = [], isLoading, isError, refetch } = useSocialPosts();
  const client = useQueryClient();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const save = useMutation({
    mutationFn: addSocialPost,
    onSuccess: (post) => {
      client.setQueryData<SocialPost[]>(timelineKey, (current = []) => [post, ...current]);
      client.invalidateQueries({ queryKey: timelineKey });
    },
  });
  async function add(e: React.FormEvent) {
    e.preventDefault(); setError(''); setNotice('');
    try {
      await save.mutateAsync({ url, caption });
      setUrl(''); setCaption(''); setNotice('Link published to the timeline.');
    } catch (err) { setError((err as Error).message); }
  }
  async function remove(post: SocialPost) {
    if (!window.confirm(`Remove ${post.url} from the timeline?`)) return;
    setError(''); setNotice('');
    try {
      await removeSocialPost(post.id);
      client.setQueryData<SocialPost[]>(timelineKey, posts.filter(p => p.id !== post.id));
      await client.invalidateQueries({ queryKey: timelineKey });
      setNotice('Link removed.');
    }
    catch (err) { setError((err as Error).message); }
  }
  return <section className="mt-10 rounded-lg border border-gray-200 bg-white p-5">
    <h2 className="text-xl font-semibold text-gray-900">{TIMELINE_TITLE}</h2>
    <p className="mt-2 text-sm text-gray-600">Paste a social link to publish it on the home page. Newest additions appear first.</p>
    {isError ? <p role="alert" className="mt-4 text-red-700">Could not load saved links. <button className="underline" onClick={() => refetch()}>Try again</button></p>
    : isLoading ? <p role="status" className="mt-4">Loading links…</p> : <>
      <form onSubmit={add} className="mt-5 space-y-4">
        <label className="block text-sm font-medium">Social link
          <Input type="url" required maxLength={2048} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://x.com/username/status/…" className="mt-1" disabled={save.isPending} />
        </label>
        <label className="block text-sm font-medium">Description (optional)
          <Textarea maxLength={500} value={caption} onChange={e => setCaption(e.target.value)} rows={3} className="mt-1" disabled={save.isPending} />
        </label>
        <p className="text-sm text-gray-500">X, Instagram, TikTok, YouTube, Facebook, Threads and Bluesky. Links open the original post in a new tab.</p>
        <Button type="submit" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Add to timeline'}</Button>
      </form>
      <div className="mt-6 space-y-4">{posts.map(post => <div key={post.id}>
        <TimelineList posts={[post]} />
        <Button type="button" variant="outline" size="sm" className="ml-8 mt-2" disabled={save.isPending} onClick={() => remove(post)} aria-label={`Remove ${post.url}`}>Remove link</Button>
      </div>)}</div>
    </>}
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-3 text-sm text-green-700">{notice}</p>}
  </section>;
}
