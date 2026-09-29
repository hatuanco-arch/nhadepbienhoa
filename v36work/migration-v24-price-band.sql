-- v24: nhóm giá dùng riêng cho bộ lọc tìm kiếm
ALTER TABLE properties ADD COLUMN price_band TEXT DEFAULT '';

UPDATE properties
SET price_band = CASE
  WHEN price_billion < 1 THEN 'under-1b'
  WHEN price_billion >= 1 AND price_billion < 1.5 THEN '1b-1_5b'
  WHEN price_billion >= 1.5 AND price_billion < 2 THEN '1_5b-2b'
  WHEN price_billion >= 2 AND price_billion < 2.5 THEN '2b-2_5b'
  WHEN price_billion >= 2.5 AND price_billion <= 3 THEN '2_5b-3b'
  WHEN price_billion > 3 THEN 'over-3b'
  ELSE ''
END
WHERE price_band = '';
