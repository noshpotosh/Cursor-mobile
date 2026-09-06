import {
  clearElement,
  createEl,
  formatHistoryStamp,
} from "./desktopDom.js";
import {
  formatCompanyBucks,
  listOfficeHistory,
  listOffices,
  listUpgrades,
  purchaseOffice,
  purchaseUpgrade,
  selectOwnedOffice,
} from "./economy.js";

function buildUpgradeCard(upgrade, economy, onRefresh, onBuy) {
  const card = createEl("article", "loft-card loft-shop-row");

  if (upgrade.isOwned) {
    card.classList.add("is-owned");
  }

  const swatch = createEl(
    "div",
    `loft-swatch loft-swatch-${upgrade.id}`
  );
  swatch.setAttribute("aria-hidden", "true");
  card.appendChild(swatch);

  const copy = createEl("div", "loft-card-copy");
  copy.appendChild(
    createEl("h3", "loft-title", upgrade.title)
  );
  copy.appendChild(
    createEl("p", "loft-description", upgrade.description)
  );

  const meta = createEl("p", "loft-meta");
  meta.textContent = `${upgrade.costBucks} bucks`;
  copy.appendChild(meta);

  if (upgrade.isOwned) {
    copy.appendChild(
      createEl("p", "loft-status", "Installed")
    );
    card.appendChild(copy);
    return card;
  }

  const canAfford =
    economy.companyBucks >= upgrade.costBucks;
  const button = createEl(
    "button",
    "loft-buy-button",
    canAfford ? "Buy" : "Need more bucks"
  );
  button.type = "button";
  button.disabled = !canAfford;
  button.addEventListener("click", () => {
    const result = purchaseUpgrade(economy, upgrade.id);

    if (!result.ok) {
      return;
    }

    onRefresh();

    if (onBuy) {
      onBuy(result);
    }
  });
  copy.appendChild(button);
  card.appendChild(copy);
  return card;
}

function buildOfficeCard(office, economy, onRefresh, onChange) {
  const card = createEl("article", "loft-card");

  if (office.isCurrent) {
    card.classList.add("is-owned");
  }

  card.appendChild(
    createEl("h3", "loft-title", office.displayName)
  );
  card.appendChild(
    createEl("p", "loft-description", office.description)
  );

  const meta = createEl("p", "loft-meta");
  meta.textContent =
    office.costBucks === 0
      ? `Free · ${office.thumbnailLabel}`
      : `${office.costBucks} bucks · ${office.thumbnailLabel}`;
  card.appendChild(meta);

  if (office.isCurrent) {
    card.appendChild(
      createEl("p", "loft-status", "Current office")
    );
    return card;
  }

  if (office.isOwned) {
    const button = createEl(
      "button",
      "loft-buy-button",
      "Move in"
    );
    button.type = "button";
    button.addEventListener("click", () => {
      const result = selectOwnedOffice(economy, office.id);

      if (!result.ok) {
        return;
      }

      onRefresh();

      if (onChange) {
        onChange(result);
      }
    });
    card.appendChild(button);
    return card;
  }

  const canAfford =
    economy.companyBucks >= office.costBucks;
  const button = createEl(
    "button",
    "loft-buy-button",
    canAfford ? "Buy office" : "Need more bucks"
  );
  button.type = "button";
  button.disabled = !canAfford;
  button.addEventListener("click", () => {
    const result = purchaseOffice(economy, office.id);

    if (!result.ok) {
      return;
    }

    onRefresh();

    if (onChange) {
      onChange(result);
    }
  });
  card.appendChild(button);
  return card;
}

function buildHistoryRow(entry) {
  const row = createEl("p", "loft-history-row");
  row.textContent =
    `${entry.displayName} — ${entry.note} `
    + `(${formatHistoryStamp(entry.atMs)})`;
  return row;
}

export function renderLoftApp(body, desktop) {
  clearElement(body);

  const economy = desktop.economy;
  const onUpgradePurchase = desktop.onUpgradePurchase;
  const onOfficeChange = desktop.onOfficeChange;

  const layout = createEl("div", "loft-layout");
  const summary = createEl("p", "loft-summary");
  const upgradeHeading = createEl(
    "h3",
    "loft-section-title",
    "Loft upgrades"
  );
  const upgradeList = createEl("div", "loft-list");
  const officeHeading = createEl(
    "h3",
    "loft-section-title",
    "Office catalog"
  );
  const officeList = createEl("div", "loft-list");
  const historyHeading = createEl(
    "h3",
    "loft-section-title",
    "Office history"
  );
  const historyList = createEl("div", "loft-history");

  function refresh() {
    clearElement(upgradeList);
    clearElement(officeList);
    clearElement(historyList);
    summary.textContent =
      `Company balance: ${formatCompanyBucks(economy.companyBucks)}`;

    for (const upgrade of listUpgrades(economy)) {
      upgradeList.appendChild(
        buildUpgradeCard(
          upgrade,
          economy,
          refresh,
          onUpgradePurchase
        )
      );
    }

    for (const office of listOffices(economy)) {
      officeList.appendChild(
        buildOfficeCard(
          office,
          economy,
          refresh,
          onOfficeChange
        )
      );
    }

    const history = listOfficeHistory(economy)
      .slice()
      .reverse();

    for (const entry of history) {
      historyList.appendChild(buildHistoryRow(entry));
    }
  }

  refresh();
  layout.appendChild(summary);
  layout.appendChild(upgradeHeading);
  layout.appendChild(upgradeList);
  layout.appendChild(officeHeading);
  layout.appendChild(officeList);
  layout.appendChild(historyHeading);
  layout.appendChild(historyList);
  body.appendChild(layout);
}
