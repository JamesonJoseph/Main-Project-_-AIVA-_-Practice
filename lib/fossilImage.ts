/**
 * Fossil image renderer. Without Vercel Blob we render the fossilized post to
 * an offscreen <canvas> and return a PNG data URL, stored locally on the post
 * (`fossil_image_url`). This is the "static shareable image" from the spec.
 */

export function renderFossilImage(
  content: string,
  reinforcedBy: number
): string | null {
  if (typeof document === "undefined") return null;

  const W = 900;
  const H = 600;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#121214");
  grad.addColorStop(1, "#0a0a0b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = "#7dd3fc";
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  // Header
  ctx.fillStyle = "#7dd3fc";
  ctx.font = "bold 28px ui-monospace, monospace";
  ctx.fillText("✦ FOSSILIZED", 48, 80);

  ctx.fillStyle = "#6b6b73";
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillText(`preserved by ${reinforcedBy} reinforcements`, 48, 110);

  // Body (wrapped)
  ctx.fillStyle = "#e8e6df";
  ctx.font = "26px ui-monospace, monospace";
  wrapText(ctx, content, 48, 170, W - 96, 38);

  // Footer
  ctx.fillStyle = "#6b6b73";
  ctx.font = "14px ui-monospace, monospace";
  ctx.fillText("fossil — what the crowd refused to let decay", 48, H - 48);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(/\s+/);
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}
