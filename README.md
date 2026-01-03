# Lobie Translate

**Ứng dụng dịch thuật thông minh** kết hợp bản dịch thô miễn phí và tinh chỉnh bằng AI hiện đại, với trọng tâm giáo dục (phân tích từ vựng) và trải nghiệm trò chuyện hai chiều mượt mà.

## 🌟 Tính Năng Chính

### Basic Mode (Miễn phí, không cần key)
- **DeepL Free** (500.000 ký tự/tháng miễn phí)
- **Google Translate unofficial** (nhanh, ổn định)
- **LibreTranslate** (fallback tự động giữa các instance)

### AI Pro Mode (Tinh chỉnh bản dịch)
- **Gemini 2.5 Flash / Gemini 3.0 Flash** (Google)
- **OpenRouter** (hỗ trợ nhiều mô hình miễn phí)
- **Nvidia NIM LLM**

### Chế độ Đặc biệt
- **Default**: Dịch tự nhiên thông thường
- **Vocabulary**: Phân tích từ khóa → flashcards học tập
- **Parallel**: Hiển thị hai cột song song
- **Summary**: Tóm tắt ngắn gọn theo giọng điệu
- **Mixed**: Giữ nguyên thuật ngữ chuyên ngành

### Giọng điệu & Sáng tạo
- Giọng: Formal, Casual, Humorous, Professional, Poetic, Slang
- Mức sáng tạo: Normal (0.1) | Balanced (0.5) | Creative (0.9)
- Option "All versions" → hiển thị 3 phiên bản cùng lúc

## 🚀 Cài Đặt & Chạy

### Yêu cầu
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone & Cài đặt
```bash
git clone https://github.com/ngoloc2k4/Translate_WithAI.git
cd Translate_WithAI
npm install
```

### Bước 2: Cấu hình môi trường
Tạo file `.env.local` (copy từ `.env.local.example`):
```env
DEEPL_API_KEY=your_deepl_key_here
GEMINI_API_KEY=your_gemini_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
NVIDIA_NIM_API_KEY=your_nvidia_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Bước 3: Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.

## 📱 Cách Sử Dụng

1. **Chọn ngôn ngữ**: Chọn Tiếng Việt → Tiếng Anh (hoặc ngôn ngữ khác)
2. **Chọn cài đặt**:
   - Mode: Chế độ dịch (Default, Vocabulary, etc.)
   - Tone: Giọng điệu
   - Creativity: Mức độ sáng tạo
3. **Nhập text**: Gõ vào ô bên trái hoặc phải
4. **Submit**: Nhấn "Translate →" hoặc Ctrl+Enter
5. **Xem kết quả**: 
   - Tab "Google Free" = bản dịch thô
   - Tab "AI Polished" = bản dịch tinh chỉnh (nếu chọn AI provider)
6. **Tương tác**:
   - Copy, Speak (TTS), Edit
   - Kiểm tra lịch sử dịch
   - Học flashcards (mode Vocabulary)

## 🔐 Quản Lý API Keys

### Personal Use (Dùng riêng)
- Lưu key trong `.env.local`
- Chạy local không cần lo security

### Public Deploy (Deploy lên internet)
- **Không** commit `.env.local` lên GitHub
- Người dùng tự nhập key trong UI → lưu vào `localStorage`
- Các request AI được gửi **client-side**

## 📋 Luồng Xử Lý

```
User Input
    ↓
Step 1: Basic Translation (Server-side)
    → DeepL → Google → Libre (tự động fallback)
    → Hiển thị ngay tab "Google Free"
    ↓
Step 2: AI Polishing (Option)
    → Gửi text gốc + bản dịch thô đến AI
    → AI trả JSON (translation + metadata)
    → Parse & hiển thị tab "AI Polished"
    ↓
Step 3: Insights (Vocabulary mode)
    → Flashcards từ vựng nổi bật
    → Hiển thị dưới bản dịch
    ↓
History + Preferences
    → Lưu localStorage (50 entries tối đa)
```

## 🛠️ Project Structure

```
.
├── pages/
│   ├── _app.tsx              # App wrapper
│   ├── _document.tsx         # HTML template
│   ├── index.tsx             # Main page
│   └── api/
│       └── translate.ts      # Translation API
├── components/
│   ├── ControlCenter.tsx     # Control panel
│   ├── TranslateTextArea.tsx # Input textarea
│   ├── OutputPanel.tsx       # Output & tabs
│   ├── Insights.tsx          # Vocabulary flashcards
│   ├── History.tsx           # Translation history
│   └── ControlCenter.module.css
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utilities
│   ├── storage.ts            # localStorage helpers
│   └── providers/
│       ├── basic.ts          # DeepL, Google, Libre
│       └── ai.ts             # Gemini, OpenRouter, Nvidia
├── styles/
│   └── globals.css           # Global styles
├── public/
│   └── favicon.ico
└── package.json
```

## 🔑 Cấu Hình API Keys

### DeepL
- Đăng ký miễn phí: https://www.deepl.com/pro/account/intro
- Limit: 500.000 ký tự/tháng
- Đặt biến: `DEEPL_API_KEY`

### Gemini (Google)
- Tạo API key: https://aistudio.google.com/app/apikey
- Miễn phí cho 1,000 request/ngày
- Đặt biến: `GEMINI_API_KEY`

### OpenRouter
- Đăng ký: https://openrouter.ai
- Hỗ trợ 50+ mô hình (nhiều free)
- Đặt biến: `OPENROUTER_API_KEY`

### Nvidia NIM
- Đăng ký: https://build.nvidia.com
- Free credits có sẵn
- Đặt biến: `NVIDIA_NIM_API_KEY`

## 📦 Dependencies

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Axios**: HTTP client
- **CSS Modules**: Component styles

## 🚢 Deploy

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối repo với Vercel
3. Đặt environment variables trong Vercel dashboard
4. Auto-deploy khi push

```bash
# Command đơn giản
npm run build
npm start
```

### Các Platform Khác
- Netlify, Railway, Fly.io (tương tự)
- Chỉ cần env vars + Node.js support

## 🤝 Đóng Góp

Hoan nghênh PR và issues. Vui lòng:
1. Fork repository
2. Tạo branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

MIT © ngoloc2k4

## 📞 Support

- Issues: [GitHub Issues](https://github.com/ngoloc2k4/Translate_WithAI/issues)
- Email: contact@lobie.dev (nếu có)

---

**Lobie Translate** – Công cụ dịch không chỉ chính xác mà còn giúp bạn học và hiểu sâu ngôn ngữ.