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
