export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-CA").format(Number(value || 0));
