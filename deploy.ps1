# ClearPath AI Deployment Script for Vercel (PowerShell)

Write-Host "🚀 Starting ClearPath AI deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI is already installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Navigate to frontend directory
Set-Location -Path "frontend"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Run type checking
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
npm run type-check

# Run linting
Write-Host "🧹 Running linting..." -ForegroundColor Yellow
npm run lint

# Build the application
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build

# Go back to root directory
Set-Location -Path ".."

# Deploy to Vercel
Write-Host "🌐 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🎉 Your ClearPath AI application is now live on Vercel!" -ForegroundColor Green