# TradeFlow — Setup

## Run locally
```bash
npm install
npm run dev
```

## Environment
Copy `.env.example` to `.env` and fill in your Supabase (Lovable Cloud) values:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: TradeFlow"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Backend
This project uses Lovable Cloud (Supabase). Database migrations live in `supabase/migrations/`, edge functions in `supabase/functions/`.

## Tip
The easiest way to keep code synced with GitHub is Lovable's built-in GitHub connector: **Connectors → GitHub → Connect project**.
