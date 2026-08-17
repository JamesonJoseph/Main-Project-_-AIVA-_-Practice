import { CONFIG } from "./config";
import type { Post, ReinforcementRecord } from "./types";

/**
 * LocalStorage-backed "database". This is the peer-to-peer store: every user's
 * browser keeps its own copy of the feed. There is no server, so the data lives
 * entirely client-side. (See README for the import/export P2P sharing feature.)
 */

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadPosts(): Post[] {
  return read<Post[]>(CONFIG.STORAGE_KEY, []);
}

export function savePosts(posts: Post[]): void {
  write(CONFIG.STORAGE_KEY, posts);
}

export function loadReinforcements(): ReinforcementRecord[] {
  return read<ReinforcementRecord[]>(CONFIG.REINFORCEMENTS_KEY, []);
}

export function saveReinforcements(records: ReinforcementRecord[]): void {
  write(CONFIG.REINFORCEMENTS_KEY, records);
}

export function createPost(content: string): Post {
  const post: Post = {
    id: crypto.randomUUID(),
    content,
    created_at: Date.now(),
    integrity: CONFIG.MAX_INTEGRITY,
    reinforcements: 0,
    status: "live",
    epitaph: null,
    fossil_image_url: null,
  };
  const posts = loadPosts();
  posts.push(post);
  savePosts(posts);
  return post;
}

/** Has this identity already reinforced this post? (one per identity per post) */
export function hasReinforced(postId: string, identityId: string): boolean {
  return loadReinforcements().some(
    (r) => r.post_id === postId && r.identity_id === identityId
  );
}

export function addReinforcement(postId: string, identityId: string): Post | null {
  if (hasReinforced(postId, identityId)) return null;
  const records = loadReinforcements();
  records.push({ post_id: postId, identity_id: identityId, created_at: Date.now() });
  saveReinforcements(records);

  const posts = loadPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post || post.status !== "live") return null;
  post.reinforcements += 1;
  savePosts(posts);
  return post;
}

/** BroadcastChannel lets peers (other tabs/windows) react to local mutations. */
export const syncChannel: BroadcastChannel | null =
  typeof window !== "undefined" && "BroadcastChannel" in window
    ? new BroadcastChannel("fossil-sync")
    : null;
