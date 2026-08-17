"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Post } from "@/lib/types";

/**
 * Reinforce button with optimistic UI: it immediately bumps the displayed count
 * (and disables itself) before reconciling with the store. If the store rejects
 * the reinforcement (already reinforced, post not live), it rolls back.
 */
export default function ReinforceButton({
  post,
  onReinforce,
  alreadyReinforced,
}: {
  post: Post;
  onReinforce: (id: string) => Post | null;
  alreadyReinforced: boolean;
}) {
  const [optimistic, setOptimistic] = useState(false);
  const [count, setCount] = useState(post.reinforcements);

  const handle = () => {
    if (alreadyReinforced || optimistic) return;
    // optimistic
    setOptimistic(true);
    setCount((c) => c + 1);

    const updated = onReinforce(post.id);
    if (!updated) {
      // rollback
      setOptimistic(false);
      setCount(post.reinforcements);
    }
  };

  const disabled = alreadyReinforced || optimistic;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={handle}
        disabled={disabled}
        className="rounded-md border border-fossil-accent/50 bg-fossil-accent/10 px-3 py-1.5 text-sm font-semibold text-fossil-accent transition hover:bg-fossil-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disabled ? "reinforced" : "reinforce +3"}
      </motion.button>
      <span className="text-xs text-fossil-fading">
        {count} / 50 to fossilize
      </span>
    </div>
  );
}
