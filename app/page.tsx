"use client";

import { usePosts } from "@/lib/usePosts";
import { liveFeed } from "@/lib/decay";
import { computeIntegrity } from "@/lib/integrity";
import PostCard from "@/components/PostCard";

export default function FeedPage() {
  const { posts, ready, reinforce, alreadyReinforced } = usePosts();
  // Live display integrity (real time) so posts keep decaying between the
  // once-every-two-days cron runs that actually persist transitions.
  const feed = liveFeed(posts).map((p) =>
    p.status === "live"
      ? { ...p, integrity: computeIntegrity(p.created_at, p.reinforcements) }
      : p
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-fossil-fresh">
          The live feed
        </h1>
        <p className="mt-1 font-mono text-sm text-fossil-fading">
          Fresh first. Everything here is decaying. Reinforce what matters.
        </p>
      </div>

      {!ready ? (
        <p className="text-fossil-fading">loading the feed…</p>
      ) : feed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-fossil-edge p-10 text-center">
          <p className="font-mono text-fossil-fading">
            Nothing here yet. The feed is empty and silent.
          </p>
          <a
            href="/post"
            className="mt-4 inline-block rounded-md border border-fossil-accent/50 bg-fossil-accent/10 px-4 py-2 text-sm font-semibold text-fossil-accent"
          >
            say something
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {feed.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onReinforce={reinforce}
              alreadyReinforced={alreadyReinforced(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
