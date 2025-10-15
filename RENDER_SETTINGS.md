# 🚀 RENDER DEPLOYMENT - QUICK REFERENCE

## Render Dashboard Settings

### Web Service Configuration

```
Service Name: ev-analytics-dashboard
Environment: Node
Region: Oregon (US West) or your preferred region
Branch: main
Root Directory: (leave blank)
```

### Build & Deploy Commands

```
Build Command: bash build.sh
Start Command: cd Backend && npm start
```

### Alternative Build Command (if bash doesn't work):
```
Build Command: cd Backend && npm install && cd ../Frontend && npm install && npm run build
```

### Environment Variables

Add these in Render Dashboard → Environment → Environment Variables:

```
PORT = 10000
GEMINI_API_KEY = AIzaSyCnqqMItAMC0so9ztc8r1Y-IQCmaUPT4BQ
NODE_ENV = production
```

### Auto-Deploy
```
☑️ Auto-Deploy: Yes (Deploy on every push to main branch)
```

---

## 📝 Step-by-Step Instructions

1. **Push to GitHub**
   ```powershell
   cd c:\Users\91826\Documents\Ev_data_dashboard\EV_Analytics
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Select `Sudheerchikile/EV_Data_Dashboard`
   - Select `main` branch

3. **Configure Settings** (as shown above)

4. **Add Environment Variables**
   - Click "Advanced" or go to "Environment" tab
   - Add PORT, GEMINI_API_KEY, NODE_ENV

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

6. **Access Your App**
   - URL will be: `https://your-service-name.onrender.com`

---

## ✅ Verification

After deployment, test these URLs:

```
https://your-app.onrender.com/              → Frontend (React App)
https://your-app.onrender.com/api/health    → Backend API
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No open ports detected" | Check PORT env variable, ensure server listens on 0.0.0.0 |
| "Cannot find package.json" | Set Build Command correctly, check Root Directory |
| "Build failed" | Check build logs, verify Node version >=18 |
| "404 on routes" | Ensure catch-all route exists in Backend/index.js |
| "Blank page" | Check if Frontend/dist folder was created during build |

---

## 📞 Need Help?

Check Render logs:
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Look for error messages

---

**Last Updated:** October 15, 2025
