insert into public.categories (code, name, display_order)
values
  ('pass', '패스', 1),
  ('single', '단품', 2)
on conflict (code) do update
set name = excluded.name,
    display_order = excluded.display_order,
    is_active = true;

insert into public.products (
  category_id, slug, name, description, thumbnail_url,
  original_price, sale_price, is_active, display_order
)
select c.id, p.slug, p.name, p.description, p.thumbnail_url,
       p.original_price, p.sale_price, p.is_active, p.display_order
from (
  values
    ('single', 'hidden-kice-2026-s7-korean', '2026 Hidden Kice 시즌7 국어', '시즌7 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 40000, 40000, true, 10),
    ('pass', 'hidden-kice-2026-s7-korean-pass', '2026 Hidden Kice 시즌7 국어 패스', '시즌7 국어 모의고사와 해설 강의', '/images/products/product-pass-set.png', 76000, 72200, true, 20),
    ('pass', 'hidden-kice-2026-s7-math-pass', '2026 Hidden Kice 시즌7 수학 패스', '시즌7 수학 모의고사와 해설 강의', '/images/products/product-pass-set.png', 76000, 72200, true, 30),
    ('pass', 'hidden-kice-2026-s7-all-pass', '2026 Hidden Kice 시즌7 전과목 패스', '시즌7 국어·수학·영어 전과목 구성', '/images/products/product-hidden-kice.png', 120000, 96000, true, 40),
    ('pass', 'hidden-kice-2026-s7-english-pass', '2026 Hidden Kice 시즌7 영어 패스', '시즌7 영어 모의고사와 해설 강의', '/images/products/product-hidden-kice.png', 72000, 64800, true, 50),
    ('pass', 'hidden-kice-2026-s6-all-pass', '2026 Hidden Kice 시즌6 전과목 패스', '시즌6 국어·수학·영어 전과목 구성', '/images/products/product-pass-set.png', 110000, 88000, true, 60),
    ('single', 'hidden-kice-2026-s7-math', '2026 Hidden Kice 시즌7 수학', '시즌7 수학 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 40000, 36000, true, 70),
    ('pass', 'hidden-kice-2026-s6-korean-pass', '2026 Hidden Kice 시즌6 국어 패스', '시즌6 국어 모의고사와 해설 강의', '/images/products/product-pass-set.png', 72000, 64800, true, 80),
    ('single', 'hidden-kice-2026-s7-english', '2026 Hidden Kice 시즌7 영어', '시즌7 영어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 38000, 38000, true, 90),
    ('pass', 'hidden-kice-2026-s6-math-pass', '2026 Hidden Kice 시즌6 수학 패스', '시즌6 수학 모의고사와 해설 강의', '/images/products/product-pass-set.png', 72000, 68400, true, 100),
    ('pass', 'hidden-kice-2026-s5-all-pass', '2026 Hidden Kice 시즌5 전과목 패스', '시즌5 국어·수학·영어 전과목 구성', '/images/products/product-pass-set.png', 100000, 85000, true, 110),
    ('single', 'hidden-kice-2026-s6-korean', '2026 Hidden Kice 시즌6 국어', '시즌6 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 38000, 34200, true, 120),
    ('single', 'hidden-kice-2026-s6-math', '2026 Hidden Kice 시즌6 수학', '시즌6 수학 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 38000, 38000, true, 130),
    ('pass', 'hidden-kice-2026-s5-korean-pass', '2026 Hidden Kice 시즌5 국어 패스', '시즌5 국어 모의고사와 해설 강의', '/images/products/product-pass-set.png', 68000, 68000, true, 140),
    ('single', 'hidden-kice-2026-s6-english', '2026 Hidden Kice 시즌6 영어', '시즌6 영어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 36000, 32400, true, 150),
    ('pass', 'hidden-kice-2026-s5-math-pass', '2026 Hidden Kice 시즌5 수학 패스', '시즌5 수학 모의고사와 해설 강의', '/images/products/product-pass-set.png', 68000, 61200, true, 160),
    ('single', 'hidden-kice-2026-s5-korean', '2026 Hidden Kice 시즌5 국어', '시즌5 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 36000, 36000, true, 170),
    ('single', 'hidden-kice-2026-s5-math', '2026 Hidden Kice 시즌5 수학', '시즌5 수학 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 36000, 30600, true, 180),
    ('pass', 'hidden-kice-2026-s1-s3-korean-pass', '2026 Hidden Kice 시즌1~3 국어 패스', '시즌1~3 국어 모의고사 묶음', '/images/products/product-pass-set.png', 90000, 63000, true, 190),
    ('single', 'hidden-kice-2026-s5-english', '2026 Hidden Kice 시즌5 영어', '시즌5 영어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 34000, 34000, true, 200),
    ('pass', 'hidden-kice-2026-s1-s3-math-pass', '2026 Hidden Kice 시즌1~3 수학 패스', '시즌1~3 수학 모의고사 묶음', '/images/products/product-pass-set.png', 90000, 67500, true, 210),
    ('single', 'hidden-kice-2026-s4-korean', '2026 Hidden Kice 시즌4 국어', '시즌4 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 34000, 27200, true, 220),
    ('single', 'hidden-kice-2026-s4-math', '2026 Hidden Kice 시즌4 수학', '시즌4 수학 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 34000, 34000, true, 230),
    ('pass', 'hidden-kice-2026-s4-s7-korean-pass', '2026 Hidden Kice 시즌4~7 국어 패스', '시즌4~7 국어 모의고사 묶음', '/images/products/product-pass-set.png', 140000, 105000, true, 240),
    ('single', 'hidden-kice-2026-s3-korean', '2026 Hidden Kice 시즌3 국어', '시즌3 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 32000, 32000, true, 250),
    ('pass', 'hidden-kice-2026-s4-s7-math-pass', '2026 Hidden Kice 시즌4~7 수학 패스', '시즌4~7 수학 모의고사 묶음', '/images/products/product-pass-set.png', 140000, 112000, true, 260),
    ('single', 'hidden-kice-2026-s3-math', '2026 Hidden Kice 시즌3 수학', '시즌3 수학 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 32000, 25600, true, 270),
    ('single', 'hidden-kice-2026-s2-korean', '2026 Hidden Kice 시즌2 국어', '시즌2 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 30000, 30000, true, 280),
    ('pass', 'hidden-kice-2026-annual-pass', '2026 Hidden Kice 연간 패스', '시즌1~7 전과목 모의고사와 해설 강의', '/images/products/product-pass-set.png', 390000, 273000, true, 290),
    ('single', 'hidden-kice-2026-s1-korean', '2026 Hidden Kice 시즌1 국어', '시즌1 국어 실전 모의고사 4회분', '/images/products/product-hidden-kice.png', 30000, 21000, true, 300),
    ('single', 'hidden-kice-2025-s7-korean', '2025 Hidden Kice 시즌7 국어', '판매 종료된 2025 시즌 교재', '/images/products/product-hidden-kice.png', 38000, 38000, false, 310)
) as p (category_code, slug, name, description, thumbnail_url, original_price, sale_price, is_active, display_order)
join public.categories c on c.code = p.category_code
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    description = excluded.description,
    thumbnail_url = excluded.thumbnail_url,
    original_price = excluded.original_price,
    sale_price = excluded.sale_price,
    is_active = excluded.is_active,
    display_order = excluded.display_order;
