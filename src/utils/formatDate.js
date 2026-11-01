const formatter = new Intl.DateTimeFormat('pt-BR', {
	timeZone: 'America/Sao_Paulo',
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});

export const formatDate = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return formatter.format(date).replace(',', '');
};
