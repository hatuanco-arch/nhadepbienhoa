V36 — LIGHTHOUSE MOBILE IMAGE/LCP TUNING

Based on V35.

Changes:
- Re-encoded the brand logo to 360x74 WebP (~12 KB instead of ~45 KB).
- Re-encoded the Zalo QR to 192x194 WebP (~10 KB instead of ~30 KB).
- Added intrinsic width/height to logo and QR images.
- If the dedicated R2 homepage/hero image is not configured, use the latest property's first local /media/ image as the hero instead of the external Unsplash fallback. If an admin-uploaded homepage hero exists, it is kept unchanged.
- Kept V33/V34/V35 Cloudflare Images optimization, caching, robots.txt, sitemap.xml and accessibility changes.

Expected focus:
- Reduce image-delivery savings from the logo/QR.
- Remove the external Unsplash hero request when a local property image is available.
- Re-measure LCP and Performance after deployment; no Lighthouse score is guaranteed before measurement.
