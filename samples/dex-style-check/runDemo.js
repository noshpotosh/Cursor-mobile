const { buildOrderSummary } = require("./orderSummary");

const sampleOrder = {
  customerName: "Fabrizio Cortell",
  items: [
    {
      name: "Brewski latte",
      quantity: 2,
      unitPriceInCents: 450,
    },
    {
      name: "Wolf bite muffin",
      quantity: 1,
      unitPriceInCents: 325,
    },
  ],
};

const summary = buildOrderSummary(sampleOrder);

if (!summary.ok) {
  console.error(summary.error);
  process.exit(1);
}

console.log(`Customer: ${summary.customerName}`);
console.log("");

for (const line of summary.lines) {
  console.log(
    `${line.quantity} x ${line.name} @ ${line.unitPrice}`
      + ` = ${line.lineTotal}`
  );
}

console.log("");
console.log(`Subtotal: ${summary.subtotal}`);
console.log(`Tax:      ${summary.tax}`);
console.log(`Total:    ${summary.total}`);
