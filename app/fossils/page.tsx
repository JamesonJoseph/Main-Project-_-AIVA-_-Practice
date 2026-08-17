"use client";

import { usePosts } from "@/lib/usePosts";
import { fossilGallery } from "@/lib/decay";

export default function FossilsPage() {
  const { posts, ready } = usePosts();
  const fossils = fossilGallery(posts);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-fossil-fresh">
          The fossil record
        </h1>
        <p className="mt-1 font-mono text-sm text-fossil-fading">
          Posts the crowd refused to let decay. Preserved forever as artifacts.
        </p>
      </div>

      {!ready ? (
        <p className="text-fossil-fading">loading fossils…</p>
      ) : fossils.length === 0 ? (
        <p className="rounded-xl border border-dashed border-fossil-edge p-10 text-center font-mono text-fossil-fading">
          No fossils yet. A post needs 50 reinforcements to be preserved.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {fossils.map((post) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={post.id}
              src={post.fossil_image_url ?? ""}
              alt="fossilized post"
              className="w-full rounded-xl border border-fossil-accent"
            />
          ))}
        </div>
      )}
    </div>
  );
}
