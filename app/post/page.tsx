"use client";

import { usePosts } from "@/lib/usePosts";
import Composer from "@/components/Composer";

export default function PostPage() {
  const { createPost } = usePosts();
  return <Composer onCreate={createPost} />;
}
