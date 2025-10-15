# 🚀 LOVE DIARY - DEPLOY TO VERCEL

## 📋 Checklist trước khi deploy:

### ✅ 1. Database Production
- [ ] Tạo database tại Neon/PlanetScale/Railway
- [ ] Copy connection string
- [ ] Update `prisma/schema.prisma` → postgresql

### ✅ 2. Environment Variables
- [ ] Tạo `.env.local` với DATABASE_URL production
- [ ] Tạo NEXTAUTH_SECRET random
- [ ] Setup Google OAuth credentials
- [ ] (Optional) Setup GitHub OAuth

### ✅ 3. Code Ready
- [ ] Commit tất cả changes
- [ ] Push to GitHub repository
- [ ] Test build locally: `npm run build`

## 🚀 DEPLOY STEPS:

### Bước 1: Commit & Push
```bash
git add .
git commit -m "🚀 Ready for deployment"
git push origin main
```

### Bước 2: Deploy to Vercel
```bash
# Option A: Vercel CLI
npm i -g vercel
vercel --prod

# Option B: Vercel Dashboard
# 1. Đi tới https://vercel.com/dashboard
# 2. Import từ GitHub repository
# 3. Add environment variables
# 4. Deploy
```

### Bước 3: Add Environment Variables trên Vercel
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add từng variable:

```
DATABASE_URL = postgresql://...
NEXTAUTH_URL = https://your-app.vercel.app
NEXTAUTH_SECRET = your-random-secret
GOOGLE_CLIENT_ID = your-google-id
GOOGLE_CLIENT_SECRET = your-google-secret
```

### Bước 4: Redeploy
- Sau khi add env vars → Deployments → Redeploy latest

## 🔧 TROUBLESHOOTING:

### Build fails - Prisma error:
```bash
# Add to vercel.json
{
  "installCommand": "npm install && npx prisma generate"
}
```

### Database connection error:
- Check DATABASE_URL format
- Ensure database allows connections từ Vercel IPs
- For Neon: Enable "Allow all connections"

### NextAuth error:
- Check NEXTAUTH_URL matches deployed domain
- Update OAuth redirect URIs trong Google Console
- Ensure NEXTAUTH_SECRET is set

### API routes timeout:
- Add to vercel.json:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 📱 POST-DEPLOY:

### Test các features:
- [ ] Login/Register
- [ ] Diary entries (CRUD)
- [ ] Bucket list (CRUD)  
- [ ] Mood tracking (CRUD)
- [ ] Finance tracking (CRUD)
- [ ] Couple setup

### Performance:
- [ ] Lighthouse audit
- [ ] Database query optimization
- [ ] Image optimization

## 🌐 CUSTOM DOMAIN (Optional):
1. Vercel Dashboard → Project → Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update NEXTAUTH_URL với new domain
