DROP TABLE IF EXISTS properties;

CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK(type IN ('Căn hộ','Nhà phố','Đất nền')),
  area TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  price_billion REAL NOT NULL DEFAULT 0,
  price_text TEXT NOT NULL DEFAULT '',
  price_band TEXT NOT NULL DEFAULT '',
  size TEXT NOT NULL DEFAULT '',
  road TEXT NOT NULL DEFAULT '',
  highlight TEXT NOT NULL DEFAULT '',
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  front_yard TEXT NOT NULL DEFAULT '',
  back_yard TEXT NOT NULL DEFAULT '',
  car_yard TEXT NOT NULL DEFAULT '',
  terrace TEXT NOT NULL DEFAULT '',
  function_text TEXT NOT NULL DEFAULT '',
  legal TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  images TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','reserved','sold','hidden')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_price ON properties(price_billion);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_created ON properties(created_at);
