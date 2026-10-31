-- Amplia o catálogo da loja com 34 produtos. Rode DEPOIS de reset-sales.sql, senão as vendas
-- criadas aqui são apagadas por ele. Pode rodar de novo: o que já existe é ignorado.
--
--   - 16 à venda do John Doe
--   - 4 à venda da Bianca
--   - 14 vendidos pela Bianca, entre mar/2025 e out/2026, para 7 compradores diferentes
--   - 9 avaliações nessas vendas, cada uma de quem comprou o produto
--
-- Fotos: Unsplash (licença gratuita, uso comercial permitido). A coluna guarda a URL da
-- imagem, sem base64, então cada linha ocupa poucos bytes.

begin;

create temp table new_products (
  slug text,
  name text,
  description text,
  price numeric,
  photo text,
  owner text,
  sold boolean,
  created timestamptz
) on commit drop;

insert into new_products values
  -- À venda, do John Doe
  ('notebook-gamer-15', 'Notebook Gamer 15"', 'Notebook com tela de 144 Hz, 16 GB de RAM e SSD de 512 GB. Roda jogos atuais com folga e acompanha o carregador original.', 4299.90, '1603302576837-37561b2e2302', 'john', false, '2026-10-20'),
  ('monitor-27-qhd', 'Monitor 27" QHD', 'Monitor IPS de 27 polegadas com resolução QHD e 165 Hz. Bordas finas e cores fiéis para trabalho e jogos.', 1599.00, '1587831990711-23ca6441447b', 'john', false, '2026-10-18'),
  ('teclado-mecanico-sem-fio', 'Teclado Mecânico Sem Fio', 'Teclado mecânico compacto com conexão Bluetooth e USB-C. Teclas firmes e bateria para semanas de uso.', 349.90, '1618384887929-16ec33fab9ef', 'john', false, '2026-10-16'),
  ('mouse-sem-fio', 'Mouse Sem Fio', 'Mouse ergonômico com sensor preciso e clique silencioso. A bateria dura até 70 horas de uso.', 189.00, '1527864550417-7fd91fc51a46', 'john', false, '2026-10-14'),
  ('fone-bluetooth-anc', 'Fone Bluetooth com ANC', 'Fone over-ear com cancelamento de ruído ativo e 30 horas de bateria. Dobrável e confortável para longas sessões.', 459.00, '1505740420928-5e560c06d30e', 'john', false, '2026-10-12'),
  ('caixa-de-som-portatil', 'Caixa de Som Portátil', 'Caixa de som Bluetooth à prova de água, com graves fortes e 12 horas de reprodução. Ideal para levar a qualquer lugar.', 279.90, '1608043152269-423dbba4e7e1', 'john', false, '2026-10-10'),
  ('smart-tv-50-4k', 'Smart TV 50" 4K', 'Smart TV de 50 polegadas com resolução 4K e HDR. Tem os principais aplicativos de streaming e três entradas HDMI.', 2199.00, '1646861039459-fd9e3aabf3fb', 'john', false, '2026-10-08'),
  ('console-portatil', 'Console Portátil', 'Console híbrido com tela OLED de 7 polegadas e controles destacáveis. Jogue em casa ou leve na mochila.', 2199.00, '1585427795543-33cf23ea2853', 'john', false, '2026-10-06'),
  ('camera-mirrorless', 'Câmera Mirrorless', 'Câmera mirrorless de 24 MP que grava em 4K. Acompanha lente 18-55 mm, ótima para foto e vídeo.', 3899.00, '1516035069371-29a1b244cc32', 'john', false, '2026-10-04'),
  ('drone-4k', 'Drone com Câmera 4K', 'Drone com câmera 4K estabilizada e até 30 minutos de voo por bateria. Fácil de pilotar, mesmo para iniciantes.', 2799.00, '1473968512647-3e447244af8f', 'john', false, '2026-10-02'),
  ('leitor-de-ebooks', 'Leitor de E-books', 'Leitor digital com tela de 6,8 polegadas sem reflexo e luz ajustável. À prova de água e com bateria para semanas.', 549.00, '1676107779594-7a23bd99e07c', 'john', false, '2026-09-28'),
  ('webcam-full-hd', 'Webcam Full HD', 'Webcam 1080p com foco automático e microfone embutido. Prende direto no monitor, ideal para reuniões e aulas.', 229.00, '1760348213920-d2a90ed705fd', 'john', false, '2026-09-24'),
  ('roteador-wifi-6', 'Roteador Wi-Fi 6', 'Roteador dual band com velocidade de até 3000 Mbps. Melhora a cobertura e aguenta vários aparelhos conectados.', 399.00, '1606904825846-647eb07f5be2', 'john', false, '2026-09-20'),
  ('ssd-externo-1tb', 'SSD Externo 1 TB', 'SSD portátil de 1 TB com conexão USB-C e leitura de até 1050 MB/s. Pequeno, resistente e cabe no bolso.', 499.90, '1577538926210-fc6cc624fde2', 'john', false, '2026-09-16'),
  ('tablet-11', 'Tablet 11"', 'Tablet de 11 polegadas com tela de 120 Hz e 128 GB de armazenamento. Tem suporte a caneta e serve para estudo e trabalho.', 2399.00, '1561154464-82e9adf32764', 'john', false, '2026-09-12'),
  ('relogio-gps', 'Relógio com GPS', 'Relógio esportivo com GPS, monitor cardíaco e 14 dias de bateria. Registra corrida, ciclismo e natação.', 899.00, '1587400519568-1fe0329bfb2e', 'john', false, '2026-09-08'),

  -- À venda, da Bianca
  ('impressora-multifuncional', 'Impressora Multifuncional', 'Imprime, copia e digitaliza com conexão Wi-Fi. Boa opção para casa e pequenos escritórios.', 899.00, '1612815154858-60aa4c59eaa6', 'bianca', false, '2026-10-22'),
  ('microfone-usb', 'Microfone USB', 'Microfone condensador com captação limpa para podcast, lives e reuniões. É só conectar na USB e usar.', 319.00, '1660631228116-b3643559f611', 'bianca', false, '2026-10-19'),
  ('hub-usb-c', 'Hub USB-C 7 em 1', 'Adaptador com HDMI 4K, portas USB, leitor de cartão e carregamento de 100 W. Essencial para notebooks finos.', 169.90, '1616578273461-3a99ce422de6', 'bianca', false, '2026-10-15'),
  ('suporte-para-notebook', 'Suporte para Notebook', 'Suporte de alumínio que eleva a tela à altura dos olhos. Melhora a postura e a ventilação do notebook.', 129.00, '1629317480826-910f729d1709', 'bianca', false, '2026-10-11'),

  -- Vendidos, da Bianca (os pedidos são criados logo abaixo)
  ('headset-gamer', 'Headset Gamer', 'Headset com som surround 7.1 e microfone removível. Almofadas macias para longas partidas.', 289.00, '1610041321327-b794c052db27', 'bianca', true, '2025-03-05'),
  ('teclado-compacto-75', 'Teclado Compacto 75%', 'Teclado mecânico no formato 75%, sem fio, com teclas de perfil retrô. Economiza espaço na mesa.', 459.00, '1760708551859-6559dc9640b8', 'bianca', true, '2025-05-12'),
  ('monitor-curvo-34', 'Monitor Curvo 34"', 'Monitor ultrawide curvo de 34 polegadas. Mais espaço para trabalhar com várias janelas abertas.', 1899.00, '1527800792452-506aacb2101f', 'bianca', true, '2025-06-20'),
  ('mouse-gamer', 'Mouse Gamer', 'Mouse com sensor de alta precisão, seis botões e cabo leve. Pega firme para jogos competitivos.', 149.00, '1605773527852-c546a8584ea3', 'bianca', true, '2025-08-02'),
  ('caixa-de-som-bluetooth', 'Caixa de Som Bluetooth', 'Caixa de som com luzes de LED, graves reforçados e 10 horas de bateria.', 219.00, '1589256469067-ea99122bbdc4', 'bianca', true, '2025-09-15'),
  ('tablet-10-com-capa', 'Tablet 10" com Capa', 'Tablet de 10 polegadas com capa-suporte inclusa. Ótimo para leitura, vídeos e chamadas.', 899.00, '1623126908029-58cb08a2b272', 'bianca', true, '2025-11-08'),
  ('console-retro', 'Console Retrô', 'Console clássico restaurado, com controles originais. Para reviver os jogos da infância.', 399.00, '1550745165-9bc0b252726f', 'bianca', true, '2025-11-25'),
  ('fone-tws', 'Fone Sem Fio TWS', 'Fone intra-auricular com estojo de carregamento e 24 horas de bateria no total.', 179.00, '1590658268037-6bf12165a8df', 'bianca', true, '2025-12-10'),
  ('ssd-nvme-500gb', 'SSD NVMe 500 GB', 'SSD interno M.2 com leitura de 3500 MB/s. Deixa o computador bem mais rápido.', 279.00, '1669480380758-4b163a33f6f9', 'bianca', true, '2026-01-18'),
  ('webcam-2k', 'Webcam 2K', 'Webcam com resolução 2K, base ajustável e som limpo para videochamadas.', 239.00, '1623949556303-b0d17d198863', 'bianca', true, '2026-03-03'),
  ('roteador-dual-band', 'Roteador Dual Band', 'Roteador com antenas externas e boa cobertura para apartamentos e casas pequenas.', 249.00, '1516044734145-07ca8eef8731', 'bianca', true, '2026-04-22'),
  ('smartwatch-fit', 'Smartwatch Fit', 'Relógio inteligente com notificações, monitor de sono e sete dias de bateria.', 329.00, '1579586337278-3befd40fd17a', 'bianca', true, '2026-06-14'),
  ('camera-de-acao', 'Câmera de Ação 4K', 'Câmera compacta que grava em 4K. Acompanha caixa estanque para aventuras na água.', 799.00, '1562878671-b3efe27953b9', 'bianca', true, '2026-08-09'),
  ('notebook-14', 'Notebook 14"', 'Notebook leve com 8 GB de RAM e SSD de 256 GB. Bom para estudo, trabalho e viagens.', 2199.00, '1719523676561-10af04209e8c', 'bianca', true, '2026-10-03');

insert into public.products (id, name, description, price, image_url, vendor_id, sold, created_date)
select
  n.slug,
  n.name,
  n.description,
  n.price,
  array['https://images.unsplash.com/photo-' || n.photo || '?w=900&q=80&auto=format&fit=crop'],
  case n.owner
    when 'john' then '299c0323-9ae1-459d-9d69-eea0eddfe83b'::uuid
    else '4d6d8e1e-7e54-414d-8b73-c6e39129c72d'::uuid
  end,
  n.sold,
  n.created
from new_products n
on conflict (id) do nothing;

-- Um pedido por produto vendido, no mesmo formato que a função purchase_products grava.
-- O endereço vem do perfil de quem comprou; quem não tem endereço cadastrado usa o padrão.
insert into public.orders (buyer_id, product_id, product, total, address, created_at)
select
  u.id,
  p.id,
  jsonb_build_object(
    'name', p.name,
    'price', p.price,
    'pictures', to_jsonb(p.image_url),
    'vendor_id', p.vendor_id,
    'description', p.description
  ),
  p.price,
  jsonb_build_object(
    'cep', coalesce(nullif(u.address_cep, ''), '01310100'),
    'street', coalesce(nullif(u.address_street, ''), 'Avenida Paulista'),
    'number', coalesce(nullif(u.address_number, ''), '1000'),
    'district', coalesce(nullif(u.address_district, ''), 'Bela Vista'),
    'city', coalesce(nullif(u.address_city, ''), 'São Paulo'),
    'state', coalesce(nullif(u.address_state, ''), 'SP'),
    'country', coalesce(nullif(u.address_country, ''), 'Brasil')
  ),
  n.created + interval '3 days'
from (values
  ('headset-gamer', 'a3cab0bb-b810-43ac-b5a3-f4d637a9e573'),          -- Lucas Brown
  ('teclado-compacto-75', 'dbb04f96-bb4d-441e-b2b4-9682a73031d2'),    -- Ana White
  ('monitor-curvo-34', '016c601a-d318-4650-8a7d-1e17ff89203e'),       -- David Green
  ('mouse-gamer', '98259ada-e7c1-43cb-b955-87165337abe0'),            -- Marie Johnson
  ('caixa-de-som-bluetooth', 'fe068363-6581-4157-bde6-88b00e5503bd'), -- Jane Smith
  ('tablet-10-com-capa', 'dbb04f96-bb4d-441e-b2b4-9682a73031d2'),     -- Ana White
  ('console-retro', '034d883d-aeae-4efd-961e-964bc3af54d2'),          -- Pedro Bianchi Machado da Silva
  ('fone-tws', '299c0323-9ae1-459d-9d69-eea0eddfe83b'),               -- John Doe
  ('ssd-nvme-500gb', 'a3cab0bb-b810-43ac-b5a3-f4d637a9e573'),         -- Lucas Brown
  ('webcam-2k', 'dbb04f96-bb4d-441e-b2b4-9682a73031d2'),              -- Ana White
  ('roteador-dual-band', '016c601a-d318-4650-8a7d-1e17ff89203e'),     -- David Green
  ('smartwatch-fit', 'fe068363-6581-4157-bde6-88b00e5503bd'),         -- Jane Smith
  ('camera-de-acao', '98259ada-e7c1-43cb-b955-87165337abe0'),         -- Marie Johnson
  ('notebook-14', '034d883d-aeae-4efd-961e-964bc3af54d2')             -- Pedro Bianchi Machado da Silva
) as s(slug, buyer_id)
join new_products n on n.slug = s.slug
join public.products p on p.id = s.slug
join public.users u on u.id = s.buyer_id::uuid
on conflict (product_id) do nothing;

-- Avaliações do comprador em parte das vendas, alguns dias depois de cada pedido.
insert into public.reviews (user_id, vendor_id, product_id, title, review, stars, created_at)
select
  o.buyer_id,
  p.vendor_id,
  p.id,
  r.title,
  r.review,
  r.stars,
  o.created_at + interval '4 days'
from (values
  ('headset-gamer', 'Som muito bom', 'Chegou bem embalado e o som surpreendeu. O microfone também é ótimo para jogar com os amigos.', 5),
  ('monitor-curvo-34', 'Espaço de sobra', 'Mudou meu jeito de trabalhar: cabem várias janelas lado a lado. A vendedora respondeu rápido todas as dúvidas.', 5),
  ('mouse-gamer', 'Bom pelo preço', 'Funciona bem e é preciso, mas o cabo é um pouco mais curto do que eu esperava.', 4),
  ('tablet-10-com-capa', 'Exatamente como descrito', 'O tablet estava em ótimo estado e a capa ajuda muito para assistir vídeos.', 5),
  ('console-retro', 'Nostalgia pura', 'Funcionou de primeira e os controles estão bem conservados. Só demorou um pouco para chegar.', 4),
  ('fone-tws', 'Cumpre o que promete', 'Bateria boa e conexão estável. O som é ok, sem muito grave.', 3),
  ('ssd-nvme-500gb', 'Computador novo', 'A instalação foi simples e a diferença de velocidade é enorme. Recomendo.', 5),
  ('smartwatch-fit', 'Ótimo para o dia a dia', 'Leve, bonito e a bateria dura bastante. Uso todos os dias para acompanhar o sono.', 4),
  ('camera-de-acao', 'Vale muito a pena', 'Filmei uma viagem inteira com ela e a qualidade ficou excelente. Produto igual ao anúncio.', 5)
) as r(slug, title, review, stars)
join public.products p on p.id = r.slug
join public.orders o on o.product_id = p.id
on conflict (user_id, product_id) do nothing;

commit;
