// @ts-check
import { defineConfig } from 'astro/config';

// On GitHub Actions, GITHUB_REPOSITORY is "owner/repo", so site + base configure themselves.
const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');

export default defineConfig({
    site: owner ? `https://${owner}.github.io` : undefined,
    base: repo ? `/${repo}/` : '/',
});
