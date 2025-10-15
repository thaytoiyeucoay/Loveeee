# Hướng dẫn Deploy Loveeee App

## 🚀 Deploy nhanh trên Vercel

### Bước 1: Chuẩn bị Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Loveeee couples app"

# Push to GitHub
git remote add origin https://github.com/your-username/loveeee-app.git
git branch -M main
git push -u origin main
```

### Bước 2: Tạo Database trên Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn **Storage** → **Create Database**
3. Chọn **Postgres** và tạo database mới
4. Copy **DATABASE_URL** để cấu hình

### Bước 3: Deploy trên Vercel
1. Truy cập [Vercel](https://vercel.com)
2. Nhấp **New Project**
3. Import repository từ GitHub
4. Cấu hình environment variables:

#### Environment Variables cần thiết:
```env
# Database
DATABASE_URL="postgresql://..." # Từ Vercel Postgres

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-random-secret-key"

# OAuth (Tùy chọn)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary (Cho upload ảnh)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# MapBox (Cho bản đồ)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"
```

### Bước 4: Thiết lập Database
Sau khi deploy thành công:

```bash
# Cài đặt Vercel CLI
npm i -g vercel

# Login và link project
vercel login
vercel link

# Run database migrations
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Bước 5: Cấu hình Domain (Tùy chọn)
1. Trong Vercel Dashboard → **Settings** → **Domains**
2. Thêm custom domain nếu có
3. Cập nhật `NEXTAUTH_URL` với domain mới

## 🗂️ Cấu hình Services

### Google OAuth
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project existing
3. Enable **Google+ API**
4. Tạo **OAuth 2.0 Client IDs**
5. Thêm authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`

### Cloudinary
1. Đăng ký tại [Cloudinary](https://cloudinary.com)
2. Lấy **Cloud Name**, **API Key**, **API Secret**
3. Cấu hình upload presets nếu cần

### MapBox
1. Đăng ký tại [MapBox](https://www.mapbox.com)
2. Tạo Access Token mới
3. Cấu hình permissions cho web applications

## 📊 Database Seeding (Tùy chọn)

Tạo file `prisma/seed.ts` để seed dữ liệu mẫu:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed sample data
  console.log('Seeding database...')
  
  // Add sample users, couples, etc.
  // See full seed file in repository
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Chạy seed:
```bash
npx prisma db seed
```

## 🔒 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Configure CORS properly
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure CSP headers
- [ ] Enable database encryption
- [ ] Regular backup schedule

## 📱 PWA Configuration

App đã được cấu hình để hoạt động như PWA:
- ✅ Service Worker tự động
- ✅ Manifest file
- ✅ Offline support
- ✅ App icons đầy đủ
- ✅ Installable trên mobile

## 🛠️ Post-Deployment

### Test App
1. Truy cập app URL
2. Test đăng ký/đăng nhập
3. Test tất cả features chính
4. Test trên mobile devices
5. Test PWA installation

### Monitor
- Setup Vercel Analytics
- Configure error tracking (Sentry)
- Monitor database performance
- Setup uptime monitoring

## 🚨 Troubleshooting

### Common Issues:

**Database Connection Error:**
```bash
# Check DATABASE_URL format
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Regenerate Prisma client
npx prisma generate
```

**Build Failures:**
```bash
# Clear .next and node_modules
rm -rf .next node_modules
npm install
npm run build
```

**OAuth Issues:**
- Kiểm tra redirect URIs
- Đảm bảo domain khớp với cấu hình
- Check client ID/secret

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy:

1. Check Vercel build logs
2. Review environment variables
3. Test locally với production build
4. Liên hệ support qua GitHub Issues

---

🎉 **Chúc mừng! App Loveeee đã sẵn sàng để các cặp đôi sử dụng!** ❤️
