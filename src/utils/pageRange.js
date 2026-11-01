export const pageRange = (current, total) => {
	const pages = [...new Set([1, current - 1, current, current + 1, total])]
		.filter((page) => page >= 1 && page <= total)
		.sort((a, b) => a - b);

	return pages.flatMap((page, index) => {
		const gap = page - (pages[index - 1] ?? page);
		if (gap === 2) return [page - 1, page];
		if (gap > 2) return [null, page];
		return [page];
	});
};
