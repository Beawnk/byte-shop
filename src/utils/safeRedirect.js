export const safeRedirect = (value) => {
	if (typeof value !== 'string') return null;
	if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null;
	return value;
};
