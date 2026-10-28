// Client-side session shared by every page. This is a UX gate, not real security:
// the site is static, so the posts themselves are public on GitHub Pages.
export type Session = { role: "member" | "teacher"; name: string };

const KEY = "blog-session";

export function getSession(): Session | null {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

const base = document.body.dataset.base ?? "/";
const session = getSession();

if (!session && document.body.dataset.public !== "true") {
  location.replace(`${base}login`);
}

if (session) {
  document.querySelector("[data-user]")!.textContent =
    session.role === "teacher" ? "Teacher (read only)" : session.name;
  if (session.role === "member") {
    document.querySelectorAll("[data-member-only]").forEach((el) => el.classList.remove("hidden"));
  }
} else {
  document.querySelector("[data-auth-only]")?.classList.add("hidden");
}

document.querySelector("[data-logout]")?.addEventListener("click", () => {
  sessionStorage.removeItem(KEY);
  location.href = `${base}login`;
});
