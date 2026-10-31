// Migração única: copia as imagens base64 e as fotos do Unsplash de products, users e orders
// pro bucket `images` e troca cada uma pela URL pública.
//
// Sem --apply só mostra o que faria, sem gravar nada. O nome do arquivo vem do conteúdo da
// imagem, então rodar de novo não duplica nada e continua de onde parou.
//
// Usa a chave secret porque precisa alterar linhas de todos os usuários. Ela fica só na
// variável do terminal: nunca no .env, que o Vite lê, nem no código.
//
//   node --env-file=.env scripts/migrate-images.mjs
//   node --env-file=.env scripts/migrate-images.mjs --apply

import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'images';
const UNSPLASH = 'https://images.unsplash.com/';
const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const { VITE_SUPABASE_URL: url, SUPABASE_SECRET_KEY: secretKey } = process.env;
const apply = process.argv.includes('--apply');

if (!url || !secretKey) {
  console.error('Faltam variáveis: VITE_SUPABASE_URL (vem do .env) e SUPABASE_SECRET_KEY (do terminal).');
  process.exit(1);
}

const supabase = createClient(url, secretKey, { auth: { persistSession: false } });

const isBase64 = (image) => typeof image === 'string' && image.startsWith('data:');
const isUnsplash = (image) => typeof image === 'string' && image.startsWith(UNSPLASH);
const needsMove = (image) => isBase64(image) || isUnsplash(image);

const stats = { arquivos: 0, mb: 0 };
// A product and its orders hold the same image: this keeps them pointing at a single file.
const moved = new Map();

const unwrap = ({ data, error }) => {
  if (error) throw error;
  return data;
};

const readBase64 = (dataUrl) => {
  const [, mime, base64] = dataUrl.match(/^data:([^;,]+);base64,(.+)$/s) ?? [];
  return { mime, bytes: Buffer.from(base64 ?? '', 'base64') };
};

const download = async (imageUrl) => {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Download falhou (${response.status}): ${imageUrl}`);
  return {
    mime: response.headers.get('content-type')?.split(';')[0],
    bytes: Buffer.from(await response.arrayBuffer()),
  };
};

const moveImage = async (image, ownerId) => {
  const key = `${ownerId}:${image}`;
  if (moved.has(key)) return moved.get(key);

  const { mime, bytes } = isBase64(image) ? readBase64(image) : await download(image);
  const extension = EXTENSIONS[mime];
  if (!extension) throw new Error(`Formato não suportado: ${mime ?? image.slice(0, 30)}`);

  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 32);
  const path = `${ownerId}/${hash}.${extension}`;
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  stats.arquivos += 1;
  stats.mb += bytes.length / 1048576;
  console.log(`  ${mime}, ${Math.round(bytes.length / 1024)} KB -> ${path}`);

  if (apply) {
    unwrap(await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: mime === 'image/jpg' ? 'image/jpeg' : mime,
      cacheControl: '31536000',
      upsert: true,
    }));

    // The row only changes after the file is confirmed to be reachable.
    const response = await fetch(publicUrl);
    if (!response.ok) throw new Error(`Arquivo não encontrado depois do envio: ${publicUrl}`);
  }

  moved.set(key, publicUrl);
  return publicUrl;
};

const moveList = async (images, ownerId) => {
  const urls = [];
  for (const image of images) urls.push(needsMove(image) ? await moveImage(image, ownerId) : image);
  return urls;
};

const productHasPending = (product) => product.image_url?.some(needsMove);
const orderHasPending = (order) => /"data:|images\.unsplash\.com/.test(JSON.stringify(order.product ?? null));

const products = unwrap(await supabase.from('products').select('id, vendor_id, image_url'));
const users = unwrap(await supabase.from('users').select('id, avatar'));
const orders = unwrap(await supabase.from('orders').select('id, buyer_id, product_id, product'));
const vendors = new Map(products.map((product) => [product.id, product.vendor_id]));

for (const product of products) {
  if (!productHasPending(product)) continue;
  console.log(`products ${product.id}`);
  const image_url = await moveList(product.image_url, product.vendor_id);
  if (apply) unwrap(await supabase.from('products').update({ image_url }).eq('id', product.id));
}

for (const user of users) {
  if (!needsMove(user.avatar)) continue;
  console.log(`users ${user.id}`);
  const avatar = await moveImage(user.avatar, user.id);
  if (apply) unwrap(await supabase.from('users').update({ avatar }).eq('id', user.id));
}

for (const order of orders) {
  if (!order.product?.pictures?.some(needsMove)) continue;
  console.log(`orders ${order.id}`);
  const pictures = await moveList(order.product.pictures, vendors.get(order.product_id) ?? order.buyer_id);
  if (apply) unwrap(await supabase.from('orders').update({ product: { ...order.product, pictures } }).eq('id', order.id));
}

const others = products
  .flatMap((product) => product.image_url ?? [])
  .filter((image) => !needsMove(image) && !image.startsWith(url));

console.log(`\n${apply ? 'Enviados' : 'A enviar'}: ${stats.arquivos} arquivos, ${stats.mb.toFixed(2)} MB`);
if (others.length) console.log('URLs de outros sites, que ficam como estão:', others);

if (apply) {
  const left = {
    products: unwrap(await supabase.from('products').select('id, image_url')).filter(productHasPending).length,
    users: unwrap(await supabase.from('users').select('id, avatar')).filter((row) => needsMove(row.avatar)).length,
    orders: unwrap(await supabase.from('orders').select('id, product')).filter(orderHasPending).length,
  };
  console.log('Linhas que ainda têm imagem pra migrar:', left);
} else {
  console.log('Nada foi gravado. Pra aplicar, rode de novo com --apply.');
}
