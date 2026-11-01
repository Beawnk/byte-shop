export function formatCurrency(value) {
    const number = Number(value);
    return (Number.isFinite(number) ? number : 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
