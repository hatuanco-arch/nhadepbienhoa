NHADEPBIENHOA V34 — MOBILE LCP / IMAGE DELIVERY

Based on V33.

Changes:
- Hero fallback Unsplash reduced from 1200px to 800px, WebP, quality 68.
- Hero preload and hero <img> use the exact optimized URL.
- R2 hero/category images use Cloudflare Images optimizer with smaller widths/quality.
- Category image CSS blur backgrounds now use the same optimized image URL instead of downloading the original image a second time.
- Category images reduced from 700px to 480px.
- Embedded brand logo converted from PNG (~117 KB) to WebP (~27 KB).
- Embedded Zalo QR converted from JPEG (~92 KB) to WebP (~26 KB).
- Main HTML references /brand-logo.webp and /zalo-qr.webp with v=34 cache-bust.
- Existing .png/.jpg routes remain supported for compatibility, but now return WebP bytes.
- V33 Cloudflare Images binding and Worker Cache settings are preserved.

Validation:
- node --check src/index.js passed.

Deploy test:
  npx wrangler deploy --dry-run

Then deploy:
  npx wrangler deploy

After deployment run Lighthouse Mobile again. V34 is not Lighthouse-verified until deployed and tested.
