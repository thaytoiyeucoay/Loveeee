# Loveeee - Ứng dụng tình yêu dành cho các cặp đôi ❤️

Loveeee là một Progressive Web App (PWA) được thiết kế đặc biệt để giúp các cặp đôi ghi lại những khoảnh khắc đẹp, lên kế hoạch cho tương lai và tăng cường sự kết nối trong mối quan hệ.

## ✨ Tính năng chính

### 1. 💌 Lời nhắn tình yêu hàng ngày
- Gửi lời nhắn ngọt ngào, nhắc nhở hàng ngày
- Đếm ngược đến các ngày kỷ niệm quan trọng
- Thông báo push để không bỏ lỡ dịp đặc biệt

### 2. 📖 Nhật ký tình yêu chung
- Viết nhật ký, chia sẻ khoảnh khắc
- Upload ảnh, video kỷ niệm
- Timeline hiển thị hành trình yêu đương

### 3. ⭐ Bucket List cho hai người
- Danh sách những điều muốn làm cùng nhau
- Đánh dấu hoàn thành và thêm ảnh chứng minh
- Gợi ý hoạt động date mới

### 4. 📅 Lịch hẹn hò thông minh
- Đồng bộ lịch của cả hai
- Lên kế hoạch date night
- Gợi ý địa điểm, nhà hàng, hoạt động

### 5. 🎮 Trò chơi câu hỏi tìm hiểu
- Câu hỏi hàng ngày để hiểu nhau hơn
- Thử thách tình yêu vui nhộn
- So sánh câu trả lời và tính điểm phù hợp

### 6. 💰 Quản lý tài chính chung
- Theo dõi chi tiêu chung
- Tiết kiệm cho mục tiêu lớn (đám cưới, du lịch)
- Phân chia chi phí công bằng

### 7. 🗺️ Bản đồ kỷ niệm
- Đánh dấu những nơi đã đến cùng nhau
- Gắn ảnh và ghi chú tại mỗi địa điểm
- Lên kế hoạch chuyến đi tiếp theo

### 8. 😊 Tâm trạng & Cảm xúc
- Check-in tâm trạng hàng ngày
- Hiểu cảm xúc của nhau
- Nhắc nhở quan tâm khi bạn đời buồn

## 🚀 Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL với Prisma ORM
- **Authentication**: NextAuth.js
- **PWA**: next-pwa
- **File Upload**: Cloudinary
- **Maps**: MapBox GL JS
- **Deployment**: Vercel

## 📦 Cài đặt và phát triển

### Yêu cầu hệ thống
- Node.js 18+
- npm hoặc yarn
- PostgreSQL database

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/loveeee-app.git
cd loveeee-app
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình environment variables
```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong file `.env`:
- Database URL
- NextAuth configuration
- OAuth provider credentials
- Cloudinary configuration
- MapBox access token
- VAPID keys cho push notifications

### Bước 4: Thiết lập database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### Bước 5: Chạy ứng dụng
```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🌐 Deployment

### Deploy trên Vercel

1. Push code lên GitHub repository
2. Kết nối repository với Vercel
3. Cấu hình environment variables trên Vercel dashboard
4. Deploy tự động sẽ được kích hoạt

### Database trên cloud
- Sử dụng Vercel PostgreSQL, PlanetScale, hoặc Supabase
- Cập nhật `DATABASE_URL` trong environment variables

## 📱 PWA Features

Ứng dụng hỗ trợ Progressive Web App với các tính năng:
- ✅ Installable trên mobile và desktop
- ✅ Offline support
- ✅ Push notifications
- ✅ Responsive design
- ✅ Fast loading với caching strategies

## 🔧 Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma generate        # Generate Prisma client
npx prisma db push        # Push schema changes
npx prisma db pull        # Pull schema from database
```

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: support@loveeee.app
- **Website**: https://loveeee.app
- **GitHub**: https://github.com/your-username/loveeee-app

## 🙏 Cảm ơn

- [Next.js](https://nextjs.org/) - React framework tuyệt vời
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Prisma](https://prisma.io/) - Modern database toolkit
- [Vercel](https://vercel.com/) - Platform deployment tốt nhất
- [Lucide React](https://lucide.dev/) - Beautiful icon library

---

Được phát triển với ❤️ cho tất cả các cặp đôi trên thế giới.
