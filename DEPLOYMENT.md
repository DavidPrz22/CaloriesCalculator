# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free $5 credit/month)

---

## 1. Backend on Railway

### Setup Steps:
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your CaloriesTracker repository
4. Railway will detect the Dockerfile automatically

### Add PostgreSQL Database:
1. In your Railway project, click "+ New" → "Database" → "PostgreSQL"
2. Wait for the database to be provisioned
3. Click on the database, go to "Connect" tab, copy the **Internal Database URL**

### Configure Backend Environment Variables:
In your Railway project settings → Variables, add:
```
DATABASE_URL=<paste the internal database URL>
JWT_SECRET=8843fe9174926225bb7ef2a9245ae92dd4d46697a1909c4da6d14386c8877bca
USDAKEY=lTMn7kgznVEi2B51vfOhv2E2ZRiJlRUsM3WZHxol
NODE_ENV=production
CLIENT_ORIGIN=<will be set after frontend deployment>
```

### Run Migrations & Seed:
Railway will automatically run the Dockerfile CMD which includes:
- `prisma migrate deploy` - runs database migrations
- `node prisma/scripts/seed_demo.js` - seeds demo data
- `node nodeApp/app.js` - starts the server

### Get Backend URL:
1. Go to your backend service settings
2. Under "Networking", click "Generate Domain"
3. You'll get a URL like: `https://calories-backend-production-xxxx.up.railway.app`

---

## 2. Frontend on Vercel

### Setup Steps:
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your CaloriesTracker repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/CaloriesUI`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`

### Environment Variables:
Add this environment variable in Vercel project settings:
```
VITE_API_BASE_URL=https://calories-backend-production-xxxx.up.railway.app
```
(Use the Railway backend URL from step above)

### Deploy:
Click "Deploy" - Vercel will build and deploy your frontend.

### Get Frontend URL:
Vercel will give you a URL like: `https://calories-tracker.vercel.app`

---

## 3. Update Backend with Frontend URL

Go back to Railway and update the `CLIENT_ORIGIN` variable:
```
CLIENT_ORIGIN=https://calories-tracker.vercel.app
```

Railway will automatically redeploy.

---

## 4. Test the Demo

1. Go to your Vercel frontend URL
2. You should see the login page
3. Click "Try Demo" button or use credentials:
   - Username: `demo@caloriestracker.com`
   - Password: `demo1234`
4. You should be redirected to the dashboard with pre-loaded meal data

---

## Local Docker Development

To run everything locally with Docker:
```bash
docker compose up --build
```

Then access:
- Frontend: http://localhost
- Backend API: http://localhost:3000
- Database: localhost:5432

---

## Troubleshooting

### Backend fails to start on Railway:
- Check logs in Railway dashboard
- Verify DATABASE_URL is using the **Internal** URL, not Public
- Ensure all environment variables are set

### Frontend can't connect to backend:
- Verify VITE_API_BASE_URL is set correctly in Vercel
- Check Railway backend is running and healthy
- Ensure CLIENT_ORIGIN matches your Vercel URL exactly (including https://)

### CORS errors:
- Verify CLIENT_ORIGIN in Railway matches your Vercel URL
- Redeploy backend after changing CLIENT_ORIGIN

### Demo data not showing:
- Check Railway logs for seed script output
- The seed script runs on every deployment
- If food data already exists, it will skip re-seeding
