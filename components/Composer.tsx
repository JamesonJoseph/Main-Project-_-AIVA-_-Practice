"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CONFIG } from "@/lib/config";

export default function Composer({
  onCreate,
}: {
  onCreate: (content: string) => void;
}) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const remaining = CONFIG.MAX_CHAR_LIMIT - value.length;
  const tooShort = value.trim().length < CONFIG.MIN_CHAR_LIMIT;

  const submit = () => {
    if (tooShort || remaining < 0) return;
    onCreate(value.trim());
    router.push("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl"
    >
      <h1 className="mb-2 text-2xl font-bold tracking-tight text-fossil-fresh">
        Leave a mark
      </h1>
      <p className="mb-6 font-mono text-sm text-fossil-fading">
        This will fade. Say it anyway.
      </p>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={CONFIG.MAX_CHAR_LIMIT}
        rows={6}
        placeholder="type something that might be worth preserving…"
        className="w-full resize-none rounded-xl border border-fossil-edge bg-fossil-panel p-4 font-mono text-fossil-fresh placeholder:text-fossil-fading/60 focus:border-fossil-accent/60 focus:outline-none"
      />

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs ${
            remaining < 0 ? "text-fossil-terminal" : "text-fossil-fading"
          }`}
        >
          {remaining} characters left
        </span>
        <button
          onClick={submit}
          disabled={tooShort || remaining < 0}
          className="rounded-md border border-fossil-accent/50 bg-fossil-accent/10 px-5 py-2 text-sm font-semibold text-fossil-accent transition hover:bg-fossil-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          post it
        </button>
      </div>
    </motion.div>
  );
}
