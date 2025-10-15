#!/usr/bin/env bash
# Render Build Script

echo "📦 Installing Backend dependencies..."
cd Backend
npm install

echo "📦 Installing Frontend dependencies..."
cd ../Frontend
npm install

echo "🔨 Building Frontend..."
npm run build

echo "✅ Build completed successfully!"
