# SubTrack VPS Deployment Guide

## Server Info
- **VPS IP:** 194.164.151.64
- **OS:** Ubuntu 25.04
- **Existing sites:** pdfveda.com (ports 3000 + 5000) — do not touch
- **SubTrack ports:** Web → 3001, API → 4000

---

## Step 1 — Connect to VPS

```bash
ssh root@194.164.151.64
```

---

## Step 2 — Update system

```bash
apt update && apt upgrade -y
```

> If prompted about `sshd_config`, select **"keep the local version currently installed"** and press Enter.

---

## Step 3 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs
```

Verify:
```bash
node -v   # should print v20.x.x
```

---

## Step 4 — Install pnpm and PM2

```bash
npm install -g pnpm pm2
```

---

## Step 5 — Install PostgreSQL

```bash
apt install -y postgresql postgresql-contrib
```

---

## Step 6 — Start PostgreSQL

```bash
systemctl start postgresql && systemctl enable postgresql
systemctl status postgresql   # should show active
```

---

## Step 7 — Create database and user

```bash
sudo -u postgres psql
```

Inside psql:
```sql
CREATE DATABASE subtrack;
CREATE USER subtrack_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE subtrack TO subtrack_user;
\q
```

> Save the password — you'll need it for DATABASE_URL.

---

## Step 8 — Install Nginx

```bash
apt install -y nginx
```

---

## Step 9 — Start Nginx

```bash
systemctl start nginx && systemctl enable nginx
systemctl status nginx   # should show active (running)
```

---

## Step 10 — Clone the project

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/subtrack.git
cd subtrack
pnpm install
```

---

## Step 11 — Create environment files

### API (`apps/api/.env`)
```
PORT=4000
DATABASE_URL=postgresql://subtrack_user:your_strong_password@localhost:5432/subtrack
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
WEB_URL=http://194.164.151.64:3001
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_from_email
VAPID_EMAIL=mailto:admin@subtrack.app
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRO_PRICE_ID=your_stripe_price_id
ADMIN_SECRET=your_admin_secret
```

### Web (`apps/web/.env.local`)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://194.164.151.64:3001
NEXT_PUBLIC_API_URL=http://194.164.151.64/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
DATABASE_URL=postgresql://subtrack_user:your_strong_password@localhost:5432/subtrack
```

---

## Step 12 — Generate secrets

### NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### VAPID keys
```bash
npx web-push generate-vapid-keys
```

---

## Step 13 — Push DB schema and build

```bash
cd /var/www/subtrack

# Push schema to database
cd packages/db && pnpm db:push && cd ../..

# Build
pnpm --filter api build
pnpm --filter web build
```

---

## Step 14 — PM2 process config

Create `/var/www/subtrack/ecosystem.config.js`:
```js
module.exports = {
  apps: [
    {
      name: "subtrack-web",
      cwd: "/var/www/subtrack/apps/web",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      env: { NODE_ENV: "production" },
    },
    {
      name: "subtrack-api",
      cwd: "/var/www/subtrack/apps/api",
      script: "dist/index.js",
      env: { NODE_ENV: "production" },
    },
  ],
};
```

Start:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # run the printed command to enable auto-start on reboot
```

---

## Step 15 — Nginx config for SubTrack

Create `/etc/nginx/sites-available/subtrack`:
```nginx
server {
    listen 80;
    server_name 194.164.151.64;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and reload:
```bash
ln -s /etc/nginx/sites-available/subtrack /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## Step 16 — Verify deployment

Open in browser:
```
http://194.164.151.64
```

---

## Redeployment (future updates)

```bash
cd /var/www/subtrack
git pull
pnpm install
pnpm --filter api build
pnpm --filter web build
pm2 restart all
```

---

## Port Reference

| Service         | Port |
|----------------|------|
| pdfveda web    | 3000 |
| pdfveda API    | 5000 |
| subtrack web   | 3001 |
| subtrack API   | 4000 |
| PostgreSQL     | 5432 |
| Nginx (public) | 80   |
