"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addReinforcement,
  createPost as createPostStore,
  hasReinforced,
  loadPosts,
  savePosts,
  syncChannel,
} from "./storage";
import { getIdentity } from "./identity";
import { runDecay } from "./decay";
import { CONFIG } from "./config";
import type { Post } from "./types";

/**
 * Client-side store. Replaces the server DB + KV + cron:
 *  - loads posts from localStorage
 *  - runs `runDecay` on mount and on an interval (the "cron" heartbeat)
 *  - persists transitions back to localStorage
 *  - syncs across tabs/windows via BroadcastChannel (the peer-to-peer bit)
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [ready, setReady] = useState(false);

  const persist = useCallback((next: Post[]) => {
    savePosts(next);
    setPosts(next);
  }, []);

  const refresh = useCallback(() => {
    const decayed = runDecay(loadPosts());
    persist(decayed);
  }, [persist]);

  useEffect(() => {
    refresh();
    setReady(true);

    const interval = setInterval(refresh, CONFIG.CRON_INTERVAL_MS); // cron heartbeat (once / 2 days)

    const onSync = () => refresh();
    syncChannel?.addEventListener("message", onSync);

    return () => {
      clearInterval(interval);
      syncChannel?.removeEventListener("message", onSync);
    };
  }, [refresh]);

  const createPost = useCallback(
    (content: string): Post => {
      const post = createPostStore(content);
      refresh();
      syncChannel?.postMessage("update");
      return post;
    },
    [refresh]
  );

  const reinforce = useCallback(
    (postId: string): Post | null => {
      const identity = getIdentity();
      const updated = addReinforcement(postId, identity);
      if (updated) {
        refresh();
        syncChannel?.postMessage("update");
      }
      return updated;
    },
    [refresh]
  );

  const alreadyReinforced = useCallback((postId: string): boolean => {
    return hasReinforced(postId, getIdentity());
  }, []);

  return { posts, ready, refresh, createPost, reinforce, alreadyReinforced };
}
