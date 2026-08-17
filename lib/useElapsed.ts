"use client";

import { useEffect, useState } from "react";

/**
 * Returns `false` until at least `ms` milliseconds have elapsed since mount,
 * then `true`. Used to guarantee a minimum splash/loader display time even when
 * the underlying work (a synchronous localStorage read) finishes instantly.
 */
export function useElapsed(ms: number): boolean {
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setElapsed(true), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return elapsed;
}