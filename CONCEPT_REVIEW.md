# Lobie Translate Concept Review

## Overview
Ứng dụng dịch thuật thông minh kết hợp bản dịch thô miễn phí và tinh chỉnh bằng AI hiện đại, với trọng tâm giáo dục (phân tích từ vựng) và trải nghiệm trò chuyện hai chiều mượt mà.

## Providers

### Basic Mode (Server-side, hoàn toàn miễn phí, không cần key)
- **DeepL Free** (ưu tiên cao nhất nếu có key – 500.000 ký tự/tháng miễn phí).
- **Google Translate unofficial** (nhanh, ổn định, dùng làm bản dịch thô chính).
- **LibreTranslate** (rotate các instance: Argos → libre.de → terraprint) để fallback và tránh rate limit.

### AI Pro Mode (Tinh chỉnh bản dịch)
- Gemini 2.5 Flash/ Gemini 3.0 Flash (Google).
- OpenRouter (call api get all models have (free)).
- Nvidia NIM LLM.

*Implementation*:  
- Personal use: lưu key trong `.env`.  
- Public deploy: client-side input key (user tự nhập và lưu localStorage).

## Luồng xử lý (Workflow)

1. **Bước 1 – Bản dịch thô (Anchor)**  
   Khi người dùng submit, hệ thống gọi ngay Basic Mode (DeepL → Google → Libre) để lấy bản dịch nhanh.  
   Kết quả hiển thị ngay trong tab **Google Free** làm tham chiếu.

2. **Bước 2 – Tinh chỉnh bằng AI (Polish)**  
   Nếu chọn AI Pro provider, hệ thống tạo system prompt thông minh dựa trên chế độ, giọng điệu và mức sáng tạo, gửi kèm text gốc + bản dịch thô đến AI.  
   AI trả về kết quả theo định dạng JSON để frontend parse và hiển thị đẹp.

3. **Option "All" cho Creativity**  
   Gửi đồng thời 3 request với 3 mức temperature khác nhau → hiển thị 3 tab: **An toàn | Cân bằng | Đột phá**.

## Các chế độ đặc biệt

### Chế độ (Mode)
- **Default**: Dịch tự nhiên thông thường.
- **Từ vựng (Vocabulary)**: AI phân tích từ khóa quan trọng → trả JSON với flashcards (từ gốc, phát âm, nghĩa, giải thích ngữ cảnh/chơi chữ, ví dụ).
- **Song ngữ (Parallel)**: Hiển thị hai cột gốc – dịch song song.
- **Tóm tắt (Summary)**: AI đọc hiểu toàn bộ và viết lại ngắn gọn theo giọng điệu chọn.
- **Pha trộn (Mixed)**: Dịch nhưng giữ nguyên thuật ngữ chuyên ngành (IT, y tế…).

### Giọng điệu (Tone)
Formal, Casual, Humorous, Professional, Poetic, Slang, v.v.

### Mức độ sáng tạo (Creativity)
- **Bình thường** (temperature 0.0–0.2): sát nghĩa, an toàn.
- **Vừa** (temperature 0.5): tự nhiên, trôi chảy.
- **Nhiều** (temperature 0.8–1.0): phóng tác, sáng tạo.
- **All**: hiển thị đồng thời 3 phiên bản.

## Giao diện & Trải nghiệm người dùng (UX)

### Layout chính
- Hai khung textarea lớn đặt song song:
  - Trái: tiếng Việt (mặc định).
  - Phải: tiếng Anh (mặc định).
- Nút ↔ ở giữa để swap ngôn ngữ (tùy chọn).
- Thanh **Control Center** phía trên:
  - Dropdown Provider.
  - Dropdown Mode.
  - Dropdown Tone.
  - Slider Creativity + checkbox "All versions".
  - Nút input key AI (nếu cần).

### Khu vực Output
- Tab **Google Free**: luôn hiển thị bản dịch thô nhanh.
- Tab **AI Polished**: kết quả sau tinh chỉnh AI (3 sub-tab nếu chọn All).
- Khu vực **Insights** (chỉ hiện khi Vocabulary mode): flashcards từ vựng nổi bật phía dưới bản dịch.

### Tương tác cốt lõi (Bidirectional Conversation)
- Người dùng gõ/sửa tự do ở bất kỳ ô nào (không real-time translate).
- Submit bằng:
  - Nút "Dịch →" mỗi ô.
  - Shortcut **Ctrl + Enter**.
- Tự động detect hướng dịch dựa trên ô đang focus:
  - Focus trái → dịch sang phải.
  - Focus phải → dịch ngược sang trái.
- Sau dịch, người dùng có thể click ngay vào ô kết quả để chỉnh sửa và submit lại → tạo vòng lặp trò chuyện tự nhiên.

### Tính năng bổ trợ
- Auto-detect ngôn ngữ nguồn.
- Loading spinner riêng cho bản thô và AI.
- History dạng chat bubble phía dưới (lưu localStorage).
- Nút Copy / Clear / TTS (Text-to-Speech bằng Web Speech API) cho mỗi ô.

## Implementation (Next.js + Vercel)

- **/api/translate**: xử lý Basic Mode + workflow bước 1 (fallback tự động).
- **Frontend**: 
  - Detect focus để xác định hướng dịch.
  - Client-side fetch cho AI Pro (với key localStorage).
  - Parse JSON từ AI để render flashcards và các chế độ đặc biệt.
- Deploy miễn phí trên Vercel, source public trên GitHub.

Lobie Translate – công cụ dịch không chỉ chính xác mà còn giúp người dùng học và hiểu sâu ngôn ngữ.