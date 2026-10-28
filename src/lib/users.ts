import { createHash } from "node:crypto";

// Build-time only: reads TEAM_PASSWORD from .env / CI secrets and ships a hash, never plaintext.
export function getPasswordHash(): string {
  const password = import.meta.env.TEAM_PASSWORD ?? process.env.TEAM_PASSWORD;
  if (!password) return "";
  return createHash("sha256").update(password).digest("hex");
}
