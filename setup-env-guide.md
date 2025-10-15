# 🔧 Tạo Environment Variables

## Tạo file .env.local trong root project:

```env
# Database Production (Thay bằng URL thực từ Neon/PlanetScale/Railway)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# NextAuth Configuration (TẠO RANDOM SECRET)
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="openssl-rand-base64-32-output-here"

# OAuth Providers (TẠO TẠI GOOGLE/GITHUB CONSOLE)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional - GitHub OAuth
GITHUB_ID="your-github-client-id"  
GITHUB_SECRET="your-github-client-secret"

# Optional - Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## 🔐 Tạo NEXTAUTH_SECRET:
```bash
# Method 1: OpenSSL (Mac/Linux/WSL)
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Online generator
# https://generate-secret.vercel.app/32
```

## 🔗 Setup Google OAuth:
1. Đi tới: https://console.developers.google.com
2. Tạo project mới hoặc chọn existing project
3. Enable Google+ API
4. Credentials → Create OAuth client ID
5. Authorized redirect URIs: 
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://your-app.vercel.app/api/auth/callback/google` (prod)

## 🔗 Setup GitHub OAuth (Optional):
1. Đi tới: https://github.com/settings/developers
2. New OAuth App
3. Homepage URL: `https://your-app.vercel.app`
4. Callback URL: `https://your-app.vercel.app/api/auth/callback/github`
