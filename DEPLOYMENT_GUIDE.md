# EV Analytics Dashboard - Deployment Guide

## 🚀 Deploying to Render

### Step 1: Prepare Your Repository
1. Make sure all files are committed to GitHub
2. Push to your main branch

### Step 2: Render Dashboard Configuration

#### Create New Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository: `Sudheerchikile/EV_Data_Dashboard`
4. Select the `main` branch

#### Configure Build & Deploy Settings

**Basic Settings:**
- **Name:** `ev-analytics-dashboard` (or your preferred name)
- **Region:** Choose nearest to your users
- **Branch:** `main`
- **Root Directory:** Leave blank (or just use `.`)

**Build & Deploy:**
- **Runtime:** `Node`
- **Build Command:** `bash build.sh`
- **Start Command:** `cd Backend && npm start`

**Instance Type:**
- Choose `Free` tier to start

#### Environment Variables
Add the following environment variables in Render:

| Key | Value |
|-----|-------|
| `PORT` | `10000` (Render's default) |
| `GEMINI_API_KEY` | `AIzaSyCnqqMItAMC0so9ztc8r1Y-IQCmaUPT4BQ` |
| `NODE_ENV` | `production` |

### Step 3: Deploy
1. Click **"Create Web Service"**
2. Render will automatically:
   - Install backend dependencies
   - Install frontend dependencies
   - Build the frontend
   - Start the backend server
   - Serve the static frontend files

### Step 4: Verify Deployment
Once deployed, your app will be available at:
```
https://ev-analytics-dashboard.onrender.com
```
(URL will be based on your service name)

---

## 📋 Alternative: Manual Commands

If `build.sh` doesn't work, use these commands in Render:

**Build Command:**
```bash
cd Backend && npm install && cd ../Frontend && npm install && npm run build
```

**Start Command:**
```bash
cd Backend && npm start
```

---

## 🔍 Troubleshooting

### Port Binding Issues
- Make sure `PORT` environment variable is set
- Backend should listen on `0.0.0.0` not `localhost`

### Build Failures
- Check Node version (minimum 18.0.0)
- Verify all dependencies in package.json
- Check build logs in Render dashboard

### Frontend Not Loading
- Ensure Frontend is built (`Frontend/dist` exists)
- Backend should serve static files from `../Frontend/dist`
- Catch-all route `app.get("*")` should be last

### API Not Working
- Check environment variables are set
- Verify GEMINI_API_KEY is correct
- Check API routes start with `/api/`

---

## 🛠️ Local Development

```bash
# Install all dependencies
npm run install-all

# Run backend
npm run dev-backend

# Run frontend (in another terminal)
npm run dev-frontend
```

---

## 📦 Project Structure

```
EV_Analytics/
├── Backend/
│   ├── index.js          # Express server
│   ├── package.json      # Backend dependencies
│   └── .env             # Environment variables (not committed)
├── Frontend/
│   ├── src/             # React components
│   ├── public/          # Static assets
│   ├── dist/            # Built files (generated)
│   └── package.json     # Frontend dependencies
├── build.sh             # Render build script
├── package.json         # Root package.json
└── .gitignore          # Git ignore rules
```

---

## ✅ Deployment Checklist

- [ ] All code committed and pushed to GitHub
- [ ] `.env` file added to `.gitignore`
- [ ] Environment variables configured in Render
- [ ] Build command set correctly
- [ ] Start command set correctly
- [ ] Port binding configured (0.0.0.0)
- [ ] GEMINI_API_KEY added to Render environment

---

**Need Help?** Check Render logs for detailed error messages.
