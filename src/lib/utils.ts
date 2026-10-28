// "Café Notes!" -> "cafe-notes": lowercase, strip accents, collapse non-alphanumerics to "-".
export function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// UTF-8 safe base64, which is the encoding the GitHub contents API expects.
export function toBase64(text: string) {
  let binary = "";
  new TextEncoder().encode(text).forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

// Same as toBase64 but for raw bytes (images), so there is no text-encoding step.
export async function blobToBase64(blob: Blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

// Shrinks an image in the browser before upload so the repo (which keeps every version forever) stays small.
// GIFs are returned untouched because drawing them on a canvas would flatten the animation.
export async function shrinkImage(file: File, maxWidth = 1600): Promise<Blob> {
  if (file.type === "image/gif") return file;

  // Decode the file into a bitmap we can draw.
  const bitmap = await createImageBitmap(file);

  // Only scale down, never up, and keep the aspect ratio.
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  // Drawing onto the canvas is what actually resamples the pixels to the smaller size.
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  // Re-encode as WebP at 85% quality. A browser without WebP support silently returns PNG instead,
  // so the caller must read the real format from blob.type rather than assume WebP.
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))), "image/webp", 0.85),
  );
}
