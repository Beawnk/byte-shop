// Accepts numbers or numeric strings (older rows store the price as text).
export function formatCurrency(value) {
    const number = Number(value);
    return (Number.isFinite(number) ? number : 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
