-- Dá histórico de vendas ao John Doe: 6 produtos já vendidos, com pedido e avaliação cada.
-- Avaliação exige uma venda, então não dá pra avaliar os produtos dele que estão à venda.
-- Dois pedidos são da Bianca, então aparecem em "Pedidos" e "Avaliações enviadas" da conta dela.
-- Pode rodar de novo: o que já existe é ignorado.
--
-- Um comando só, sem tabela temporária, então o aviso de RLS do SQL Editor não aparece.

with data (slug, name, description, price, photo, buyer, created, title, review, stars) as (
  values
  ('smart-tv-43', 'Smart TV 43"', 'Smart TV de 43 polegadas com Full HD e controle remoto por voz. Ótima para quartos e salas menores.', 1699.00, '1560169897-fc0cdbdfa4d5', 'a3cab0bb-b810-43ac-b5a3-f4d637a9e573', '2025-04-14', 'Chegou antes do prazo', 'A TV veio bem protegida e funcionou de primeira. O vendedor avisou assim que enviou.', 5),
  ('notebook-ultrafino-13', 'Notebook Ultrafino 13"', 'Notebook fino e leve com 16 GB de RAM e tela de alta resolução. Feito para trabalhar em qualquer lugar.', 3299.00, '1589561084283-930aa7b1ce50', '4d6d8e1e-7e54-414d-8b73-c6e39129c72d', '2025-07-02', 'Leve e rápido', 'Uso todos os dias para trabalhar e não trava. Só a bateria dura um pouco menos do que o anunciado.', 4),
  ('teclado-mecanico-colorido', 'Teclado Mecânico Colorido', 'Teclado mecânico com teclas em tons pastel. Som suave e visual diferente para a sua mesa.', 399.00, '1601445638532-3c6f6c3aa1d6', 'dbb04f96-bb4d-441e-b2b4-9682a73031d2', '2025-10-21', 'Lindo demais', 'As cores são ainda mais bonitas pessoalmente, e digitar nele é muito gostoso.', 5),
  ('monitor-24-full-hd', 'Monitor 24" Full HD', 'Monitor IPS de 24 polegadas com bordas finas. Boa opção para montar um home office.', 799.00, '1766642793344-34196c406643', 'fe068363-6581-4157-bde6-88b00e5503bd', '2026-02-09', 'Bom custo-benefício', 'Imagem boa pelo preço. A base é simples, mas cumpre o que promete.', 4),
  ('microfone-de-mesa', 'Microfone com Suporte', 'Microfone com suporte de mesa, ideal para gravações e transmissões.', 449.00, '1588800347304-ec7e6f353327', '4d6d8e1e-7e54-414d-8b73-c6e39129c72d', '2026-05-19', 'Áudio bem limpo', 'Comprei para reuniões e a diferença foi grande. Vendedor atencioso.', 5),
  ('suporte-articulado', 'Suporte Articulado para Notebook', 'Suporte articulado que ajusta a altura e o ângulo da tela. Deixa a mesa mais organizada.', 219.00, '1623251606108-512c7c4a3507', '016c601a-d318-4650-8a7d-1e17ff89203e', '2026-09-05', 'Resolve, mas é simples', 'Faz o que precisa, porém o acabamento poderia ser melhor pelo preço.', 3)
),
new_products as (
  insert into public.products (id, name, description, price, image_url, vendor_id, sold, created_date)
  select
    d.slug,
    d.name,
    d.description,
    d.price,
    array['https://images.unsplash.com/photo-' || d.photo || '?w=900&q=80&auto=format&fit=crop'],
    '299c0323-9ae1-459d-9d69-eea0eddfe83b'::uuid,
    true,
    d.created::timestamptz
  from data d
  on conflict (id) do nothing
),
new_orders as (
  insert into public.orders (buyer_id, product_id, product, total, address, created_at)
  select
    u.id,
    d.slug,
    jsonb_build_object(
      'name', d.name,
      'price', d.price,
      'pictures', jsonb_build_array('https://images.unsplash.com/photo-' || d.photo || '?w=900&q=80&auto=format&fit=crop'),
      'vendor_id', '299c0323-9ae1-459d-9d69-eea0eddfe83b',
      'description', d.description
    ),
    d.price,
    jsonb_build_object(
      'cep', coalesce(nullif(u.address_cep, ''), '01310100'),
      'street', coalesce(nullif(u.address_street, ''), 'Avenida Paulista'),
      'number', coalesce(nullif(u.address_number, ''), '1000'),
      'district', coalesce(nullif(u.address_district, ''), 'Bela Vista'),
      'city', coalesce(nullif(u.address_city, ''), 'São Paulo'),
      'state', coalesce(nullif(u.address_state, ''), 'SP'),
      'country', coalesce(nullif(u.address_country, ''), 'Brasil')
    ),
    d.created::timestamptz + interval '3 days'
  from data d
  join public.users u on u.id = d.buyer::uuid
  on conflict (product_id) do nothing
)
insert into public.reviews (user_id, vendor_id, product_id, title, review, stars, created_at)
select
  d.buyer::uuid,
  '299c0323-9ae1-459d-9d69-eea0eddfe83b'::uuid,
  d.slug,
  d.title,
  d.review,
  d.stars,
  d.created::timestamptz + interval '7 days'
from data d
on conflict (user_id, product_id) do nothing;
