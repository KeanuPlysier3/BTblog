// Thin wrappers around the GitHub "contents" REST endpoint, shared by forms that commit files.
const API = "https://api.github.com";

export type Target = { repo: string; branch: string; token: string };

const headers = (t: Target) => ({
  Authorization: `Bearer ${t.token}`,
  Accept: "application/vnd.github+json",
});

async function fail(response: Response): Promise<never> {
  const detail = (await response.json().catch(() => ({}))).message ?? response.statusText;
  throw new Error(`GitHub rejected the request (${response.status}): ${detail}`);
}

// Overwriting an existing file needs its current sha; undefined means the file does not exist yet.
export async function getFileSha(t: Target, path: string): Promise<string | undefined> {
  const response = await fetch(`${API}/repos/${t.repo}/contents/${path}?ref=${encodeURIComponent(t.branch)}`, {
    headers: headers(t),
    cache: "no-store",
  });
  if (response.status === 404) return undefined;
  if (!response.ok) await fail(response);
  return (await response.json()).sha;
}

// Creates the file, or replaces it when a sha is passed.
export async function putFile(t: Target, path: string, base64: string, message: string, sha?: string) {
  const response = await fetch(`${API}/repos/${t.repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(t),
    body: JSON.stringify({ message, content: base64, branch: t.branch, sha }),
  });
  if (!response.ok) await fail(response);
}
