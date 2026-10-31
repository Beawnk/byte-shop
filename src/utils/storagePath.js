const PUBLIC_PREFIX = '/storage/v1/object/public/images/';

// The database stores public URLs, but Storage deletes by path. Anything outside the bucket
// (Unsplash photos, the default avatar) returns null: those files aren't ours to delete.
export const storagePath = (url) => {
	const [, path] = (url ?? '').split(PUBLIC_PREFIX);
	return path ?? null;
};
