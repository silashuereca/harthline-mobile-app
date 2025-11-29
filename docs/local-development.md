# Local Development Setup

Use this as the quickstart for running the app against a local Supabase stack. Environment files are ignored by git; keep real values out of version control.

## Prerequisites
- Node 18+ with npm
- Supabase CLI (for `supabase start`)
- Ngrok or Cloudflare Tunnel if you need the API reachable from a physical iOS device

## Environment variables
Create two files with the following keys (replace the placeholders with your own values):

### `./.env` (app uses these at build/runtime)
```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<local anon key from Supabase>
```

### `./supabase/.env` (Supabase auth configuration)
```
SUPABASE_AUTH_GOOGLE_CLIENT_ID=<your Google OAuth client id>
SUPABASE_AUTH_GOOGLE_SECRET=<your Google OAuth client secret>
SUPABASE_AUTH_GOOGLE_REDIRECT_URI=http://127.0.0.1:54321/auth/v1/callback
```

### Optional
```
OPENAI_API_KEY=<your OpenAI API key>
```
Only needed if you want Supabase Studio's AI features locally.

## Start the stack
1) `cp supabase/.env.example supabase/.env` and fill in your Google OAuth details (or edit an existing file).  
2) `npm install`  
3) `supabase start` (starts Postgres/API/Studio on the default ports).  
4) `npm run dev` to serve the web app at http://localhost:5173.  
5) For iOS builds, use `npm run ios-run-live` (live reload) or `npm run ios-run-build` (fresh build).

## Safety notes
- `.env`, `supabase/.env`, and function-specific env files are already git-ignored; keep secrets out of example files.  
- When sharing configs, strip real keys and use placeholders like the ones above.
