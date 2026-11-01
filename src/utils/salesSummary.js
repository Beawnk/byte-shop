const parts = new Intl.DateTimeFormat('pt-BR', {
	timeZone: 'America/Sao_Paulo',
	year: 'numeric',
	month: 'numeric',
});

const monthName = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', month: 'short' });

const monthKey = (date) => {
	const values = Object.fromEntries(parts.formatToParts(date).map(({ type, value }) => [type, value]));
	return `${values.year}-${values.month.padStart(2, '0')}`;
};

const emptyMonth = (year, monthIndex) => {
	// Dia 15 em UTC: longe da virada do mês, nenhum fuso muda o mês.
	const date = new Date(Date.UTC(year, monthIndex, 15));
	return { key: monthKey(date), label: monthName.format(date).replace('.', ''), total: 0, count: 0 };
};

const lastMonths = (now, amount) => {
	const [year, month] = monthKey(now).split('-').map(Number);
	return Array.from({ length: amount }, (_, index) => emptyMonth(year, month - 1 - (amount - 1 - index)));
};

const monthsOfYear = (year) => Array.from({ length: 12 }, (_, index) => emptyMonth(year, index));

const monthsOf = (period, now) => {
	if (period === '6m') return lastMonths(now, 6);
	if (period === '12m') return lastMonths(now, 12);
	return monthsOfYear(Number(period));
};

export const periodOptions = (orders) => {
	const years = new Set(orders.map((order) => monthKey(new Date(order.created_at)).slice(0, 4)));

	return [
		{ value: '12m', label: 'Últimos 12 meses' },
		{ value: '6m', label: 'Últimos 6 meses' },
		...[...years].sort().reverse().map((year) => ({ value: year, label: year })),
	];
};

export const summarizeSales = (orders, { period = '12m', now = new Date() } = {}) => {
	const monthly = monthsOf(period, now);
	const byKey = new Map(monthly.map((month) => [month.key, month]));

	const inPeriod = orders.filter((order) => {
		const month = byKey.get(monthKey(new Date(order.created_at)));
		if (!month) return false;
		month.total += Number(order.total) || 0;
		month.count += 1;
		return true;
	});

	const revenue = monthly.reduce((sum, month) => sum + month.total, 0);

	return {
		orders: inPeriod,
		revenue,
		count: inPeriod.length,
		average: inPeriod.length ? revenue / inPeriod.length : 0,
		monthly,
	};
};
