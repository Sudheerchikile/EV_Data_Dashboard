# 🤖 Gemini AI Assistant Setup Guide

## Overview
The Gemini AI Assistant is a floating chat interface that analyzes all your dashboard data and provides intelligent insights using Google's Gemini AI.

## Features
✨ **Comprehensive Analysis** - Analyzes data from all charts
🎯 **Smart Insights** - Provides trends, patterns, and actionable recommendations  
💬 **Interactive UI** - Beautiful floating button with expandable chat panel
🔄 **Real-time** - Generate fresh insights anytime with one click
🎨 **Professional Design** - Matches your dashboard's clean aesthetic

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

### 2. Configure Backend
1. Navigate to the `Backend` folder:
   ```bash
   cd Backend
   ```

2. Create a `.env` file (if it doesn't exist):
   ```bash
   New-Item .env
   ```

3. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Install backend dependencies (if not already done):
   ```bash
   npm install
   ```

### 3. Start the Backend Server
```bash
npm start
```

The server will run on `http://localhost:5000`

### 4. Start the Frontend
In a separate terminal, from the project root:
```bash
npm run dev
```

## How to Use

1. **Open Dashboard** - Navigate to `http://localhost:5173`
2. **Click AI Button** - Look for the floating "✨ AI Insights" button in the bottom-right corner
3. **Generate Insights** - Click "🔍 Generate Insights" in the panel
4. **Review Analysis** - Gemini will analyze:
   

5. **Regenerate** - Click "🔄 Regenerate" for fresh insights anytime



## Troubleshooting

### Backend Not Running Error
**Error Message**: "⚠️ Backend server not running..."

**Solution**: 
1. Make sure you're in the `Backend` folder
2. Run `npm start`
3. Wait for "🚀 Server running on http://localhost:5000"

### API Key Error
**Error Message**: "GEMINI_API_KEY not set in .env"

**Solution**:
1. Check your `Backend/.env` file exists
2. Verify the format: `GEMINI_API_KEY=your_key_here` (no quotes)
3. Restart the backend server after adding the key

### CORS Error
If you get CORS errors, the backend already has CORS enabled. Make sure:
- Backend is running on port 5000
- Frontend is on a different port (5173)
- Both are running simultaneously

## Backend API Endpoint

**POST** `/api/generate-insights`

**Request Body**:
```json
{
  "data": {
    "topMakes": [...],
    "evTypes": [...],
    "topCounties": [...],
    "adoptionTrend": [...],
    "totalVehicles": 50000
  },
  "filters": {
    "context": "Complete EV Dashboard Analysis",
    "requestType": "comprehensive_insights"
  }
}
```

**Response**:
```json
{
  "insight": "AI-generated insights text..."
}
```

## Customization

### Change AI Prompt
Edit `Backend/index.js` line 26-35 to customize what insights are generated.

### Modify UI Appearance
Edit `src/components/GeminiAssistant.css` to change colors, sizes, positioning.

### Adjust Data Summary
Edit `src/components/GeminiAssistant.jsx` line 13-18 to include more/less data in the analysis.

## Tech Stack
- **Frontend**: React, Custom CSS
- **Backend**: Express.js, Node.js
- **AI**: Google Gemini Pro API
- **API**: RESTful architecture

## Cost & Limits
- Gemini API has generous free tier
- Check [Google AI Pricing](https://ai.google.dev/pricing) for current limits
- Each insight generation = 1 API call

---

**Pro Tip**: The assistant analyzes the most recent data each time, so as your filters change on charts, the data summary stays up-to-date! 🎯

**Created**: October 2025  
**AI Model**: Google Gemini Pro
