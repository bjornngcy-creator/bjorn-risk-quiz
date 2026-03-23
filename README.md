# Bjorn Risk Quiz

Investor risk profile quiz with Google Sheets integration.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env.local
Copy `.env.example` to `.env.local` and fill in your values:
- `GOOGLE_SHEET_ID` — already filled in
- `GOOGLE_CLIENT_EMAIL` — already filled in
- `GOOGLE_PRIVATE_KEY` — paste the full private_key value from your downloaded JSON file

The private key looks like:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----
```
Wrap the entire thing in double quotes in your .env.local file.

### 3. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

## Deploy to Vercel

1. Push this folder to your GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. In the Environment Variables section, add:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_CLIENT_EMAIL`  
   - `GOOGLE_PRIVATE_KEY` (paste the full key including the BEGIN/END lines)
4. Click Deploy

That's it — your quiz is live.

## Google Sheet columns
The sheet records: Timestamp | Name | Email | Phone | Score | Risk Profile | Coaching Interest
