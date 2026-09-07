import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseSocialUrl, type SocialPost } from '@/lib/socialLinks';
import { addSocialPost, timelineKey, useSocialPosts } from '@/lib/socialTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const TIMELINE_TITLE = 'Watch Monkeys travelling to japan';
export function TimelineList({ posts }: { posts: SocialPost[] }) {
  return <ol className="ml-2 border-l border-gray-200 space-y-6">
    {posts.map(post => <li key={post.id} className="relative pl-6">
      <span aria-hidden="true" className="absolute -left-1.5 top-5 h-3 w-3 rounded-full border-2 border-white bg-gray-900" />
      <article className="min-w-0 rounded-lg border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-semibold text-gray-900">{parseSocialUrl(post.url).platform}</span>
          <time dateTime={post.addedAt} className="text-gray-500">Added {new Date(post.addedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time>
        </div>
        {post.caption && <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed text-gray-700">{post.caption}</p>}
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="mt-3 block break-all text-sm text-blue-700 underline underline-offset-4 hover:text-blue-900">
          {post.url}<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </article>
    </li>)}
  </ol>;
}
export default function SocialTimeline() {
  const { data: posts = [], isLoading, isError, refetch } = useSocialPosts();
  const client = useQueryClient();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const add = useMutation({
    mutationFn: addSocialPost,
    onSuccess: (post) => {
      client.setQueryData<SocialPost[]>(timelineKey, (current = []) => [post, ...current]);
      client.invalidateQueries({ queryKey: timelineKey });
    },
  });
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      await add.mutateAsync({ url, caption });
      setUrl('');
      setCaption('');
      setNotice('Thank you. Your link has been added.');
    } catch (err) {
      setError((err as Error).message);
    }
  }
  return <section aria-labelledby="social-timeline-title" className="mt-12 border-t border-gray-100 pt-8">
    <h2 id="social-timeline-title" className="mb-5 text-xl font-semibold tracking-tight text-gray-900">{TIMELINE_TITLE}</h2>
    <form onSubmit={submit} className="mb-7 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5">
      <p className="text-sm text-gray-700">Share a public social media post or profile about travelling to Japan.</p>
      <label className="block text-sm font-medium text-gray-800">Social link
        <Input type="url" required maxLength={2048} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://x.com/username/status/…" className="mt-1 bg-white" disabled={add.isPending} />
      </label>
      <label className="block text-sm font-medium text-gray-800">Description (optional)
        <Textarea maxLength={500} value={caption} onChange={e => setCaption(e.target.value)} rows={2} className="mt-1 bg-white" disabled={add.isPending} />
      </label>
      <p className="text-xs text-gray-500">Supported: X, Instagram, TikTok, YouTube, Facebook, Threads and Bluesky.</p>
      <Button type="submit" disabled={add.isPending}>{add.isPending ? 'Adding…' : 'Add link'}</Button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {notice && <p role="status" className="text-sm text-green-700">{notice}</p>}
    </form>
    {isLoading ? <p role="status" className="text-sm text-gray-500">Loading timeline…</p>
      : isError ? <p role="alert" className="text-sm text-gray-600">Could not load the timeline. <button onClick={() => refetch()} className="underline">Try again</button></p>
      : posts.length ? <TimelineList posts={posts} />
      : <p className="rounded-lg border border-dashed border-gray-300 p-6 text-base text-gray-500">No links have been added yet. Be the first to share one.</p>}
  </section>;
}
