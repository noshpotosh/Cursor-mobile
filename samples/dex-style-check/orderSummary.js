// Sample only — style spot-check for Warewolf JS.
// Domain: a tiny coffee-shop order summary.

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function formatDollars(amountInCents) {
  const dollars = amountInCents / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

function lineTotalInCents(item) {
  return item.unitPriceInCents * item.quantity;
}

function subtotalInCents(items) {
  let total = 0;

  for (const item of items) {
    total += lineTotalInCents(item);
  }

  return total;
}

// Wisconsin ready-food example rate for the demo only.
function taxInCents(subtotal, taxRate = 0.055) {
  return Math.round(subtotal * taxRate);
}

function buildLineItem(item) {
  return {
    name: item.name,
    quantity: item.quantity,
    unitPrice: formatDollars(item.unitPriceInCents),
    lineTotal: formatDollars(lineTotalInCents(item)),
  };
}

function validateOrder(order) {
  if (isBlank(order.customerName)) {
    return "Customer name is required.";
  }

  if (!Array.isArray(order.items) || order.items.length === 0) {
    return "Order needs at least one item.";
  }

  for (const item of order.items) {
    if (isBlank(item.name)) {
      return "Every item needs a name.";
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Item quantity must be a whole number >= 1.";
    }

    if (
      !Number.isInteger(item.unitPriceInCents)
      || item.unitPriceInCents < 0
    ) {
      return "Item price must be cents as a whole number >= 0.";
    }
  }

  return null;
}

function buildOrderSummary(order) {
  const validationError = validateOrder(order);

  if (validationError) {
    return {
      ok: false,
      error: validationError,
    };
  }

  const subtotal = subtotalInCents(order.items);
  const tax = taxInCents(subtotal);
  const total = subtotal + tax;

  return {
    ok: true,
    customerName: order.customerName.trim(),
    lines: order.items.map(buildLineItem),
    subtotal: formatDollars(subtotal),
    tax: formatDollars(tax),
    total: formatDollars(total),
  };
}

module.exports = {
  buildOrderSummary,
  formatDollars,
  subtotalInCents,
  taxInCents,
};
