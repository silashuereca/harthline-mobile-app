# Local Supabase + Google OAuth on iOS

Use this flow when you want the iOS app to hit your local Supabase instance instead of production.

## 1) Configure Supabase auth secrets
- Copy `supabase/.env.example` to `supabase/.env` and fill in your Google OAuth client id/secret for a **dev** OAuth client.
- Set `SUPABASE_AUTH_GOOGLE_REDIRECT_URI` to the callback you will expose. Default: `http://127.0.0.1:54321/auth/v1/callback` (works on web/simulator).
- `harthline://auth/callback` is already allow-listed in `supabase/config.toml` for the native deep link.

## 2) Start Supabase locally
From the repo root:
```
supabase start
```
This starts the API on port `54321`. If you change `SUPABASE_AUTH_GOOGLE_REDIRECT_URI`, restart Supabase so the new value is picked up.

## 3) Make the API reachable from the device
- **Physical device:** expose port `54321` over HTTPS so Google can redirect back:
  - `ngrok http 54321` (or) `cloudflared tunnel --url http://127.0.0.1:54321`
  - Take the HTTPS URL (e.g. `https://abc.ngrok-free.app`) and set `SUPABASE_AUTH_GOOGLE_REDIRECT_URI=https://abc.ngrok-free.app/auth/v1/callback` in `supabase/.env`, then restart `supabase start`.
- **Simulator on the same Mac:** you can usually keep `http://127.0.0.1:54321` and skip the tunnel. If that fails, use your LAN IP, e.g. `http://192.168.1.10:54321`.

## 4) Point the app at the same host
- In your `.env` (or a platform-specific `.env.local.ios`), set:
  - `VITE_SUPABASE_URL` to the tunnel/LAN host (e.g. `https://abc.ngrok-free.app` or `http://192.168.1.10:54321`)
  - `VITE_SUPABASE_ANON_KEY` to the local anon key (the default key in `.env` works with the local stack).

## 5) Update Google OAuth client redirect URIs
- Add the HTTPS callback from step 3 to your Google OAuth client (`.../auth/v1/callback`). With a free ngrok subdomain you must update this each time; a reserved/vanity domain avoids that churn.

After these steps, install/run the iOS build and sign in with Google; the tokens will be issued by your local Supabase instead of production.
