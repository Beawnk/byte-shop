// Dates are stored in UTC (timestamptz); the store shows them in Brazil's time.
// Intl does what luxon was used for here, without the ~70 KB library.
const formatter = new Intl.DateTimeFormat('pt-BR', {
	timeZone: 'America/Sao_Paulo',
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
});

// "2025-01-07T09:20:00Z" -> "07/01/2025 06:20"
export const formatDate = (value) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return formatter.format(date).replace(',', '');
};
