V33 – MOBILE/PERFORMANCE

- Bỏ @import Google Fonts khỏi CSS render-blocking; chuyển Google Fonts sang preload + async stylesheet + preconnect.
- Dùng IMAGE_OPTIMIZER thực sự cho ảnh R2 qua /media/...?...w=..., resize theo kích thước cần dùng và xuất WebP.
- Thêm Workers Cache cho ảnh đã transform.
- Card ảnh chính ~480px, thumbnail ~260px, category ~700px, hero ~1400px.
- Không xóa/ghi đè ảnh gốc trong R2.
- D1/R2 giữ nguyên. Không có migration.
