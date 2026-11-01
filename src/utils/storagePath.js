const PUBLIC_PREFIX = '/storage/v1/object/public/images/';

export const storagePath = (url) => {
	const [, path] = (url ?? '').split(PUBLIC_PREFIX);
	return path ?? null;
};
