# 🛡️ Hệ Thống Trợ Lý AI Hỗ Trợ Giám Sát & Vận Hành SOC (AI_SOC)

Hệ thống Trợ lý Trí tuệ Nhân tạo phục vụ công tác giám sát an toàn thông tin (SOC), hỗ trợ phân tích cảnh báo, điều tra sự cố và tra cứu tri thức bảo mật nội bộ. Nền tảng được xây dựng dựa trên **Open WebUI** (đã tinh chỉnh và bản địa hóa 100% tiếng Việt) kết hợp máy chủ suy luận mô hình ngôn ngữ lớn **Ollama Local** chạy offline hoàn toàn trên máy nội bộ.

---

## 📌 1. Tổng Quan Kiến Trúc & Tính Năng Nổi Bật

- **Môi trường hoạt động độc lập (Offline / On-Premise)**: Hoạt động hoàn toàn trên mạng nội bộ, không phụ thuộc vào kết nối Internet bên ngoài, không gửi dữ liệu ra máy chủ bên thứ ba, đáp ứng tuyệt đối các tiêu chuẩn bảo mật dữ liệu an toàn thông tin.
- **Giao diện Tiếng Việt Chuyên biệt (vi-VN)**: Bản địa hóa 100% toàn bộ hệ thống menu, thanh công cụ, thông báo trạng thái, cài đặt quản trị và tác vụ.
- **Gợi ý tác vụ SOC sẵn có (Custom SOC Prompts)**: Tích hợp sẵn bộ kịch bản gợi ý tác vụ chuyên sâu:
  - Phân tích cảnh báo SIEM (Brute Force, bất thường truy cập, phát hiện tấn công leo thang đặc quyền).
  - Phân tích Log dòng lệnh PowerShell / Bash tìm kỹ thuật Obfuscation & Command Injection.
  - Tra cứu ma trận kỹ thuật tấn công **MITRE ATT&CK** và gợi ý Detection Rules.
  - Viết và kiểm thử quy tắc phát hiện **Sigma / YARA rule**.
  - Quy trình ứng cứu sự cố chuẩn (Incident Response Playbook) khi nghi ngờ nhiễm Ransomware / APT.
  - Phân tích Log Web Server (Nginx, Apache, IIS) phát hiện dấu vết SQL Injection, XSS, Path Traversal.
- **Bộ nút chuyển đổi Suy luận (Thinking Mode)**: Bổ sung nút `[ 🧠 Suy luận ]` trực quan trên thanh nhập liệu, cho phép cán bộ SOC kích hoạt hoặc tắt chế độ Chain-of-Thought (suy luận từng bước) theo nhu cầu.
- **Phân quyền giao diện (RBAC)**: Tự động tối ưu hóa giao diện người dùng theo vai trò: Người dùng thông thường có giao diện tinh gọn, tập trung; Quản trị viên (Admin) có đầy đủ bảng điều khiển tham số mô hình và quản lý người dùng.
- **Truy xuất Tri thức Tích hợp (RAG - Retrieval Augmented Generation)**: Tích hợp sẵn cơ chế nạp tài liệu quy trình, sổ tay kỹ thuật SOP, báo cáo ATTT dạng PDF, DOCX để AI tra cứu chính xác theo ngữ cảnh nội bộ.

---

## 🧠 2. Chi Tiết Các Mô Hình AI Sử Dụng (Models)

Hệ thống được thiết kế linh hoạt hỗ trợ các mô hình AI mã nguồn mở chất lượng cao qua máy chủ suy luận **Ollama**, bao gồm các mô hình tiêu biểu:

### 2.1. Nhóm Mô hình Chuyên sâu An toàn Thông tin & Vận hành SOC
- **`foundation-sec-abliterated`**:
  - **Mục đích**: Mô hình chuyên biệt dành riêng cho lĩnh vực An toàn thông tin (Cyber Security) và Phân tích bảo mật.
  - **Đặc tính**: Đã được hiệu chỉnh để không bị từ chối trả lời (uncensored/abliterated) khi phân tích các đoạn mã độc, giải mã shellcode, dịch ngược payload hoặc thảo luận chi tiết về các lỗ hổng CVE/Zero-day phục vụ công tác phòng thủ (Blue Team) và kiểm thử an toàn mạng.
  - **Ứng dụng**: Phân tích hành vi mã độc, phân tích mẫu cảnh báo tấn công, tư vấn giải pháp vá lỗ hổng.

### 2.2. Nhóm Mô hình Suy luận Đa năng (General Reasoning & Analysis)
- **`gemma4:12b` / `gemma4:12b-it-qat`**:
  - **Mục đích**: Mô hình ngôn ngữ thế hệ mới có năng lực tư duy logic, suy luận ngữ cảnh sâu và khả năng lập trình tốt.
  - **Định dạng QAT / Quantization**: Tối ưu hóa định dạng lượng tử hóa giúp mô hình chạy mượt mà trên phần cứng máy nội bộ mà vẫn duy trì chất lượng câu trả lời tương đương bản gốc.
  - **Ứng dụng**: Hỗ trợ viết kịch bản tự động hóa (Python, Bash, PowerShell), phân tích tổng hợp báo cáo sự cố, soạn thảo văn bản kỹ thuật.
- **`gemma4:e4b-it-qat`**:
  - **Mục đích**: Phiên bản thu gọn tối ưu hóa tốc độ, tiêu thụ ít tài nguyên bộ nhớ VRAM, đảm bảo phản hồi tức thì với độ trễ cực thấp.
  - **Ứng dụng**: Phù hợp cho các tác vụ hỏi đáp nhanh, tóm tắt log ngắn hoặc xử lý đồng thời nhiều truy vấn.

### 2.3. Nhóm Mô hình Nhúng Vector Phục vụ RAG (Embedding Model)
- **`nomic-embed-text`**:
  - **Mục đích**: Mô hình tạo vector nhúng ngữ nghĩa (Text Embedding) hiệu năng cao với cửa sổ ngữ cảnh lên tới 8192 tokens.
  - **Ứng dụng**: Chuyển đổi các tài liệu quy định, quy trình ứng cứu sự cố, sổ tay SOC sang định dạng vector lưu trữ trong cơ sở dữ liệu véc-tơ để tìm kiếm ngữ nghĩa chính xác khi cán bộ tra cứu tài liệu.

---

## 🖥️ 3. Yêu Cầu Phần Cứng Thử Nghiệm

Hệ thống đã được kiểm thử và hoạt động ổn định trên cấu hình phần cứng:
- **Thiết bị**: Máy nội bộ.
- **GPU**: GPU AMD 16GB VRAM (hỗ trợ tăng tốc suy luận song song qua ROCm).
- **CPU**: Bộ vi xử lý đa nhân (Intel Core i5 hoặc tương đương trở lên).
- **RAM**: 32 GB - 64 GB DDR4/DDR5.
- **Lưu trữ**: Ổ cứng SSD NVMe tốc độ cao cho tốc độ nạp mô hình vào VRAM tức thì.

---

## 🚀 4. Hướng Dẫn Khởi Chạy Nhanh

### Bước 1: Khởi động Máy chủ Mô hình (Ollama)
Cấu hình biến môi trường và chạy Ollama:
```powershell
$env:OLLAMA_MODELS = "D:\models"
$env:OLLAMA_HOST = "0.0.0.0:11434"
$env:OLLAMA_ORIGINS = "*"
ollama serve
```

Tải các mô hình cần thiết (nếu triển khai máy mới):
```powershell
ollama pull nomic-embed-text
ollama pull gemma4:12b
# Các mô hình bảo mật chuyên biệt
```

### Bước 2: Chạy Giao diện Open WebUI
Sử dụng kịch bản `docker-compose` hoặc khởi chạy trực tiếp qua tập lệnh đi kèm dự án:
```powershell
.\docker-start.bat
```

Sau khi khởi chạy thành công, truy cập giao diện qua trình duyệt web tại địa chỉ:  
👉 **`http://localhost:3000`** (hoặc địa chỉ IP mạng nội bộ của máy chủ).

---

## 📜 5. Bản Quyền & Giấy Phép
Dự án được xây dựng và phát triển mở rộng trên nền tảng mã nguồn mở [Open WebUI](https://github.com/open-webui/open-webui), tuân thủ các điều khoản giấy phép mã nguồn mở tương ứng.
