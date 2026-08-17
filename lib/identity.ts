import { CONFIG } from "./config";

/** Anonymous identity: a random UUID stored in localStorage (signed-cookie analog). */
export function getIdentity(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(CONFIG.IDENTITY_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(CONFIG.IDENTITY_KEY, id);
  }
  return id;
}
