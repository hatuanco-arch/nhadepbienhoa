TỐI ƯU LIGHTHOUSE – NHÀ ĐẸP BIÊN HÒA v30

Đã xử lý nguyên nhân Lighthouse báo ~9.5 MB ảnh có thể tiết kiệm:
1. Ảnh listing trên trang chủ/search chuyển sang deferred loading (không tải 8 ảnh lớn ngay khi mở trang).
2. Ảnh listing dùng Cloudflare Images binding để resize + WebP khi trình duyệt yêu cầu.
3. Ảnh card chính: tối đa 800px, quality 72. Ảnh thumbnail: 360px, quality 65.
4. Hero: tối đa 1400px, quality 76 và vẫn được preload/fetchpriority=high để cải thiện LCP.
5. Category: tối đa 520px, quality 72.
6. Trang chi tiết: ảnh chính 1200px, thumbnail 420px.
7. Ảnh gốc vẫn nằm nguyên trong R2, không xóa/ghi đè ảnh cũ.
8. D1 và R2 binding giữ nguyên. Không chạy migration.
9. Thêm Images binding tên IMAGE_OPTIMIZER để xử lý ảnh khi phân phối.

Lưu ý: Cloudflare Images transformations là tính năng có thể phát sinh chi phí theo số biến thể ảnh được tạo. Các biến thể được cache; ảnh lặp lại không cần xử lý lại trong cùng chu kỳ theo cơ chế của Cloudflare.
