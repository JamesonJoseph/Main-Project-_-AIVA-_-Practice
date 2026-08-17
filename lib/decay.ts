import { CONFIG } from "./config";
import { bandFor, computeIntegrity } from "./integrity";
import { generateEpitaph } from "./epitaphs";
import { renderFossilImage } from "./fossilImage";
import type { Post } from "./types";

/**
 * THE DECAY CRON (core backend logic, ported to run client-side).
 *
 * This is the heart of Fossil. It walks every live post, recomputes integrity
 * from first principles, and transitions status to `fossilized` or `dissolved`.
 * It is pure with respect to the post list — pass in posts, get back the
 * mutated + transitioned list. (A real Vercel deployment would run an identical
 * function behind /api/cron/decay gated by CRON_SECRET.)
 *
 * No N+1 queries here: this is a single in-memory pass over the loaded array,
 * which is the localStorage-era equivalent of a batched transaction.
 */
export function runDecay(posts: Post[], now: number = Date.now()): Post[] {
  let mutated = false;

  const next = posts.map((post) => {
    if (post.status !== "live") return post;

    const integrity = computeIntegrity(post.created_at, post.reinforcements, now);

    // Fossilize: reached the reinforcement threshold before dissolving.
    if (post.reinforcements >= CONFIG.FOSSILIZE_THRESHOLD) {
      mutated = true;
      const fossil_image_url =
        post.fossil_image_url ?? renderFossilImage(post.content, post.reinforcements);
      return {
        ...post,
        status: "fossilized" as const,
        integrity: CONFIG.MAX_INTEGRITY,
        fossil_image_url,
      };
    }

    // Dissolve: integrity hit zero.
    if (integrity <= 0) {
      mutated = true;
      const epitaph = post.epitaph ?? generateEpitaph(post.content, post.id);
      return {
        ...post,
        status: "dissolved" as const,
        integrity: 0,
        epitaph,
      };
    }

    // Otherwise just refresh the cached integrity.
    if (post.integrity !== integrity) {
      mutated = true;
      return { ...post, integrity };
    }
    return post;
  });

  return mutated ? next : posts;
}

/** Filter the live feed: only live posts, sorted by integrity desc. */
export function liveFeed(posts: Post[]): Post[] {
  return posts
    .filter((p) => p.status === "live")
    .sort((a, b) => b.integrity - a.integrity);
}

export function fossilGallery(posts: Post[]): Post[] {
  return posts
    .filter((p) => p.status === "fossilized")
    .sort((a, b) => b.reinforcements - a.reinforcements);
}

export { bandFor };
