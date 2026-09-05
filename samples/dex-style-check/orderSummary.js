// Sample only — style spot-check for Warewolf JS.
// Domain: a tiny coffee-shop order summary.

const CENTS_PER_DOLLAR = 100;

const CurrencyCode = {
  US_DOLLAR: "USD",
};

// Demo assumes Madison, WI ready-food sales tax so the sample
// can show a full receipt without pulling live tax tables.
const WISCONSIN_READY_FOOD_TAX_RATE = 0.055;

function isBlank(value) {
  return value == null || String(value).trim() === "";
}

function formatDollars(amountInCents) {
  const dollars = amountInCents / CENTS_PER_DOLLAR;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CurrencyCode.US_DOLLAR,
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

function taxInCents(
  subtotal,
  taxRate = WISCONSIN_READY_FOOD_TAX_RATE
) {
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

function getOrderItemValidationError(item) {
  if (isBlank(item.name)) {
    return "Every item needs a name.";
  }

  const quantityIsMissingOrTooSmall =
    !Number.isInteger(item.quantity) || item.quantity < 1;

  if (quantityIsMissingOrTooSmall) {
    return "Item quantity must be a whole number >= 1.";
  }

  const priceIsNotWholeCents =
    !Number.isInteger(item.unitPriceInCents);
  const priceIsNegative = item.unitPriceInCents < 0;

  if (priceIsNotWholeCents || priceIsNegative) {
    return "Item price must be cents as a whole number >= 0.";
  }

  return null;
}

function getOrderValidationError(order) {
  if (isBlank(order.customerName)) {
    return "Customer name is required.";
  }

  const hasNoItems =
    !Array.isArray(order.items) || order.items.length === 0;

  if (hasNoItems) {
    return "Order needs at least one item.";
  }

  for (const item of order.items) {
    const itemError = getOrderItemValidationError(item);

    if (itemError) {
      return itemError;
    }
  }

  return null;
}

function buildOrderSummary(order) {
  const validationError = getOrderValidationError(order);

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
  CENTS_PER_DOLLAR,
  CurrencyCode,
  WISCONSIN_READY_FOOD_TAX_RATE,
};
