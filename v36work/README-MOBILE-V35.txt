Nhà Đẹp Biên Hòa — V35

Fixes based on Lighthouse V34:
- Fixed 500 errors for /brand-logo.webp and /zalo-qr.webp by embedding valid WebP assets in the Worker.
- Added valid /robots.txt with sitemap reference and crawl exclusions for /admin and /api/.
- Added /sitemap.xml with main pages plus active/reserved/sold property detail URLs from D1.
- Increased footer/social link touch targets to at least 44px for mobile accessibility.
- Kept V34 LCP/image optimization unchanged.

Validation: node --check src/index.js
