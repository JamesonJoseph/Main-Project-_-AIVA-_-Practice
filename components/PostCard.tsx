"use client";

import { motion } from "framer-motion";
import { bandFor, corruptionPercent } from "@/lib/integrity";
import { corruptText } from "@/lib/corruption";
import ReinforceButton from "./ReinforceButton";
import type { Post } from "@/lib/types";

const bandStyles: Record<string, string> = {
  fresh: "text-fossil-fresh border-fossil-edge",
  fading: "text-fossil-fading border-fossil-edge animate-flicker",
  critical: "text-fossil-critical border-fossil-critical/40 animate-flicker",
  terminal: "text-fossil-terminal border-fossil-terminal/50 animate-shake",
  fossilized: "text-fossil-fresh border-fossil-accent",
  dissolved: "text-fossil-fading border-fossil-edge opacity-40",
};

const bandLabel: Record<string, string> = {
  fresh: "FRESH",
  fading: "FADING",
  critical: "CRITICAL",
  terminal: "TERMINAL",
  fossilized: "✦ FOSSILIZED",
  dissolved: "DISSOLVED",
};

export default function PostCard({
  post,
  onReinforce,
  alreadyReinforced,
}: {
  post: Post;
  onReinforce?: (id: string) => void;
  alreadyReinforced?: boolean;
}) {
  const band = bandFor(post.integrity, post.status);
  const percent = corruptionPercent(post.integrity);

  if (post.status === "fossilized") {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-xl border-2 border-fossil-accent bg-fossil-panel p-4 sm:p-5"
      >
        <div className="mb-2 text-xs font-bold tracking-widest text-fossil-accent">
          {bandLabel[band]}
        </div>
        {post.fossil_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.fossil_image_url}
            alt="fossilized post"
            className="w-full rounded-lg"
          />
        ) : (
          <p className="whitespace-pre-wrap font-mono text-fossil-fresh">
            {post.content}
          </p>
        )}
        <div className="mt-3 text-xs text-fossil-fading">
          preserved by {post.reinforcements} reinforcements
        </div>
      </motion.article>
    );
  }

  if (post.status === "dissolved") {
    return (
      <motion.article
        layout
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.4 }}
        className="rounded-xl border border-dashed border-fossil-edge bg-fossil-panel p-4 sm:p-5"
      >
        <div className="mb-2 text-xs font-bold tracking-widest text-fossil-fading">
          {bandLabel[band]}
        </div>
        <p className="whitespace-pre-wrap font-mono text-fossil-fading opacity-60">
          {post.epitaph ?? "This message dissolved into the void."}
        </p>
      </motion.article>
    );
  }

  const display = corruptText(post.content, percent, post.id);
  const terminal = band === "terminal";
  const critical = band === "critical";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border bg-fossil-panel p-4 sm:p-5 ${bandStyles[band]}`}
      style={{
        opacity: band === "fading" ? 0.7 + (post.integrity / 100) * 0.3 : 1,
      }}
    >
      <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-widest">
        <span>{bandLabel[band]}</span>
        <span className="text-fossil-fading">integrity {post.integrity}</span>
      </div>

      <motion.p
        animate={
          critical || terminal
            ? { opacity: [1, 0.5, 1], x: terminal ? [0, -1.5, 1.5, 0] : [0, 0, 0] }
            : {}
        }
        transition={{ duration: terminal ? 0.6 : 2.4, repeat: Infinity }}
        className="whitespace-pre-wrap font-mono leading-relaxed"
      >
        {display}
      </motion.p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ReinforceButton
          post={post}
          onReinforce={(id) => onReinforce?.(id) ?? null}
          alreadyReinforced={!!alreadyReinforced}
        />

        {terminal && (
          <span className="ml-auto animate-pulseCta text-xs font-bold text-fossil-terminal sm:text-sm">
            REINFORCE TO SAVE
          </span>
        )}
      </div>
    </motion.article>
  );
}
