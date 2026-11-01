export const PRODUCT_SORTS = [
	{ value: 'recentes', label: 'Mais recentes' },
	{ value: 'antigos', label: 'Mais antigos' },
	{ value: 'menor', label: 'Menor preço' },
	{ value: 'maior', label: 'Maior preço' },
	{ value: 'nome', label: 'Nome (A-Z)' },
];

const addedAt = (product) => new Date(product.created_date ?? 0).getTime();

const COMPARE = {
	recentes: (a, b) => addedAt(b) - addedAt(a),
	antigos: (a, b) => addedAt(a) - addedAt(b),
	menor: (a, b) => Number(a.price) - Number(b.price),
	maior: (a, b) => Number(b.price) - Number(a.price),
	nome: (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
};

export const sortProducts = (products, sort) => [...products].sort(COMPARE[sort] ?? COMPARE.recentes);
