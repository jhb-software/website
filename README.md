# Website of JHB Software

Monorepository of the JHB Website frontend and content management system (CMS)

## Deployment

This repository uses a GitHub Actions workflow to deploy both the CMS and Web frontend to Vercel. The workflow ensures the CMS is always deployed before the Web frontend, as the frontend fetches data from the CMS at build time.

### How It Works

| Trigger | CMS | Web | Environment |
|---------|-----|-----|-------------|
| Push to `main` | If `cms/` changed | If `web/` changed | Production |
| Pull request | If `cms/` changed | If `web/` changed | Preview |
| Manual dispatch | Configurable | Configurable | Configurable |
| Vercel Deploy Hook | No | Yes | Production |

### Vercel Setup

To avoid double deployments (one from Vercel's Git integration and one from GitHub Actions), disable automatic deployments in Vercel:

1. Go to **Vercel Dashboard** → **CMS Project** → **Settings** → **Git**
2. Under "Deploy Hooks", you can optionally create a hook for CMS-triggered rebuilds
3. Under "Ignored Build Step", select **Don't build** (or use the GitHub Actions workflow exclusively)
4. Repeat for the **Web Project**

Alternatively, disconnect the Git repository from Vercel entirely and rely solely on the GitHub Actions workflow for deployments.

### CMS-Triggered Web Rebuilds

When content is updated in the CMS, you can trigger a Web rebuild using Vercel's Deploy Hook:

1. Go to **Vercel Dashboard** → **Web Project** → **Settings** → **Git** → **Deploy Hooks**
2. Create a new hook (e.g., "CMS Content Update")
3. Use the generated URL in your CMS to trigger rebuilds when content is published

### Skip Deployments

Add these tags to your commit message to skip specific deployments:

- `[skip-cms]` - Skip CMS deployment
- `[skip-web]` - Skip Web deployment

Example: `fix(web): update styles [skip-cms]`

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token ([create here](https://vercel.com/account/tokens)) |
| `VERCEL_ORG_ID` | Vercel Team ID (Settings → General) |
| `VERCEL_CMS_PROJECT_ID` | CMS project ID (Project Settings → General) |
| `VERCEL_WEB_PROJECT_ID` | Web project ID (Project Settings → General) |

### Preview Deployments

For pull requests, the workflow:
1. Deploys CMS to a preview URL
2. Deploys Web to a preview URL, configured to use the CMS preview URL
3. Posts a comment on the PR with both preview URLs

**Note:** Disable Vercel Authentication for CMS preview deployments to allow the Web build to fetch data:
- Go to **Vercel Dashboard** → **CMS Project** → **Settings** → **Deployment Protection**
- Set Vercel Authentication to **Disabled** or **Only Production**
