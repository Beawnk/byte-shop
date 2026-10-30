// Only same-site paths are accepted as a post-login redirect: "/x" yes,
// "//evil.com" or "/\evil.com" (another host for the browser) no.
export const safeRedirect = (value) => {
	if (typeof value !== 'string') return null;
	if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null;
	return value;
};
