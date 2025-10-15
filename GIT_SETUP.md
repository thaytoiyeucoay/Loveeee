# 🚀 Git Setup & Deploy Guide

## 📁 Chuẩn bị push lên GitHub

### 1. Initialize Git repository
```bash
# Trong thư mục dự án
git init
git add .
git commit -m "🎉 Initial commit: Loveeee couples app complete

✨ Features:
- 💌 Daily love messages with countdown
- 📖 Shared love diary with photo/video upload  
- ⭐ Bucket list with completion tracking
- 📅 Smart dating calendar with sync
- 🎮 Question games with compatibility scoring
- 💰 Joint financial management
- 🗺️ Interactive memory map
- 😊 Mood tracking & emotional support

🛠️ Tech Stack:
- Next.js 14 + React 18 + TypeScript
- Tailwind CSS + Framer Motion
- Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- NextAuth.js authentication
- PWA ready with offline support
- Responsive design for all devices

🎨 UI/UX:
- Beautiful gradient backgrounds
- Glass morphism effects  
- Smooth animations
- Mobile-first responsive design
- Test accounts ready for demo"
```

### 2. Create GitHub repository
1. Truy cập [GitHub.com](https://github.com)
2. Click **"New repository"**  
3. Repository name: `loveeee-couples-app`
4. Description: `💕 Beautiful couples app with 8+ romantic features - PWA ready`
5. Choose **Public** (để showcase) hoặc **Private**
6. **KHÔNG** check "Add README" (vì đã có rồi)
7. Click **"Create repository"**

### 3. Connect & push to GitHub
```bash
# Replace YOUR_USERNAME với GitHub username của bạn
git remote add origin https://github.com/YOUR_USERNAME/loveeee-couples-app.git
git branch -M main
git push -u origin main
```

## 🌐 Deploy lên Vercel

### Option 1: Deploy từ GitHub (Recommended)
1. Truy cập [Vercel.com](https://vercel.com)
2. Login bằng GitHub account
3. Click **"New Project"**
4. Import repository `loveeee-couples-app`
5. **Framework Preset:** Next.js
6. **Root Directory:** `./` (default)
7. Click **"Deploy"**

### Option 2: Deploy trực tiếp
```bash
# Cài Vercel CLI
npm i -g vercel

# Login Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (chọn account của bạn)
# - Link to existing project? N  
# - What's your project's name? loveeee-couples-app
# - In which directory is your code located? ./
```

## 🗄️ Setup Database trên Vercel

### 1. Tạo PostgreSQL Database
1. Trong Vercel Dashboard → Project → **Storage**
2. Click **"Create Database"**
3. Chọn **"Postgres"**
4. Database name: `loveeee-db`
5. Region: chọn gần nhất (Singapore cho VN)
6. Click **"Create"**

### 2. Configure Environment Variables
Trong Vercel Dashboard → Settings → Environment Variables:

```env
# Database (copy từ Vercel Postgres)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-32-characters-long"

# OAuth (optional - có thể bỏ qua để test)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (optional - có thể bỏ qua để test)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# MapBox (optional - có thể bỏ qua để test)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"
```

### 3. Deploy Database Schema
```bash
# Update local .env with production DATABASE_URL
# Copy DATABASE_URL từ Vercel vào .env

# Generate Prisma client cho production
npx prisma generate

# Push schema to production database
npx prisma db push
```

### 4. Redeploy App
```bash
# Push changes để trigger redeploy
git add .
git commit -m "🔧 Add production database configuration"
git push

# Hoặc trigger manual redeploy trong Vercel Dashboard
```

## ✅ Verification Checklist

### Local Testing:
- [ ] `npm run dev` chạy không lỗi
- [ ] Đăng nhập với test accounts hoạt động
- [ ] Tất cả 8 tính năng load được
- [ ] Responsive design trên mobile
- [ ] PWA install hoạt động

### Production Testing:
- [ ] Vercel deployment thành công
- [ ] Database connection hoạt động
- [ ] Authentication system hoạt động
- [ ] All pages load properly
- [ ] PWA manifest accessible
- [ ] HTTPS enabled

## 🎉 Success URLs

Sau khi deploy thành công:

- **GitHub Repo:** `https://github.com/YOUR_USERNAME/loveeee-couples-app`
- **Live App:** `https://loveeee-couples-app-YOUR_USERNAME.vercel.app`
- **Test Accounts:**
  - `admin@loveeee.app` / `admin123`
  - `demo@loveeee.app` / `demo123`
  - `test@loveeee.app` / `test123`

## 🚨 Troubleshooting

### Common Issues:

**Build Error:**
```bash
# Clear cache và rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Error:**
```bash
# Reset Prisma client
npx prisma generate
npx prisma db push
```

**Environment Variables:**
- Check all required env vars are set in Vercel
- Make sure DATABASE_URL format is correct
- Verify NEXTAUTH_URL matches your domain

---

## 🎊 Ready to Share!

Khi deploy xong, bạn có thể share app với:
- **Demo URL** cho khách hàng/bạn bè test
- **GitHub repo** để showcase code
- **Screenshots/video** demo tính năng  
- **PWA install guide** cho user

**Chúc mừng! App Loveeee của bạn đã sẵn sàng chinh phục thế giới! 🌍❤️**
