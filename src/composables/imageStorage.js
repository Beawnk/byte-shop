import { supabase } from '@/lib/supabaseClient';
import { storagePath } from '@/utils/storagePath';

const BUCKET = 'images';
const MAX_SIDE = 1200;
const JPEG_QUALITY = 0.85;

export const resizeImage = async (file) => {
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));

	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);

	const context = canvas.getContext('2d');
	context.fillStyle = '#fff';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Image conversion failed'))),
			'image/jpeg',
			JPEG_QUALITY
		);
	});
};

export const uploadImage = async (file, userId) => {
	const blob = await resizeImage(file);
	const path = `${userId}/${crypto.randomUUID()}.jpg`;

	const { error } = await supabase.storage
		.from(BUCKET)
		.upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
	if (error) throw error;

	return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

export const removeImages = async (urls) => {
	const paths = urls.map(storagePath).filter(Boolean);
	if (!paths.length) return;

	const { error } = await supabase.storage.from(BUCKET).remove(paths);
	if (error) console.error('Could not remove images:', error);
};
