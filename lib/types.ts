export type PostStatus = "live" | "fossilized" | "dissolved";

export interface Post {
  id: string;
  content: string;
  created_at: number; // epoch ms
  integrity: number; // 0-100, cached
  reinforcements: number;
  status: PostStatus;
  epitaph: string | null;
  fossil_image_url: string | null; // data URL (local, no Blob backend)
}

export type IntegrityBand =
  | "fresh"
  | "fading"
  | "critical"
  | "terminal"
  | "dissolved"
  | "fossilized";

export interface ReinforcementRecord {
  post_id: string;
  identity_id: string;
  created_at: number;
}
