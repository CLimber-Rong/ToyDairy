# Cloudflare deploy notes — Toy Dairy

## Pages (frontend)

| Item | Value |
|------|--------|
| Project | `toydairy` |
| Production URL | https://toydairy.pages.dev |
| Production branch | `main` |
| Preview deploys | non-`main` branches (via Git integration or `wrangler pages deploy --branch <name>`) |
| Custom domain | none (default `*.pages.dev` only) |

### Deploy static build (manual)

```bash
cd web
npm ci
npm run build
npx wrangler pages deploy ./dist --project-name=toydairy --branch=main --commit-dirty=true
```

Preview branch:

```bash
npx wrangler pages deploy ./dist --project-name=toydairy --branch=feature/foo
```

### SPA routing

`web/public/_redirects` → `/* /index.html 200` for React Router.

## Storage (provisioned)

| Resource | Name / ID | Binding (future Worker) |
|----------|-----------|-------------------------|
| KV | `TOYDAIRY_KV` / `f7455bde32684c789bc19a9e6eb01c63` | `TOYDAIRY_KV` |
| D1 | `toydairy-db` / `6ccd35b5-c08a-4eea-9e10-4a04dc577e99` | `DB` |
| R2 | `toydairy-media` | `MEDIA` |

Config: `web/wrangler.jsonc`

Current frontend still uses browser mock (`USE_MOCK = true`). Wire API to these bindings when `server/` lands.
