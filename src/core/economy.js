window.KA = window.KA || {};
window.KA.items = window.KA.items || {};
window.KA.shops = window.KA.shops || {};
window.KA.economy = window.KA.economy || {};

const ITEMS = {};
const SHOPS = {};

function normalizeItemCount(count) {
  const value = Number(count);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function normalizeWon(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

function registerItems(items = []) {
  items.forEach((item) => {
    if (!item?.id || !item.nameKey) return;
    ITEMS[item.id] = {
      id: item.id,
      nameKey: item.nameKey,
      priceWon: normalizeWon(item.priceWon),
      category: item.category || "general",
      orderNameKo: item.orderNameKo || null,
    };
  });
}

function itemById(itemId) {
  return ITEMS[itemId] || null;
}

function registerShops(shops = []) {
  shops.forEach((shopData) => {
    if (!shopData?.id || !Array.isArray(shopData.items)) return;
    SHOPS[shopData.id] = {
      id: shopData.id,
      titleKey: shopData.titleKey || "shop.title",
      items: [...shopData.items],
      clerkVoice: shopData.clerkVoice || null,
    };
  });
}

function shopById(shopId) {
  return SHOPS[shopId] || null;
}

function wonBalance() {
  progress.won = normalizeWon(progress.won);
  return progress.won;
}

function formatWon(amount) {
  return `${normalizeWon(amount).toLocaleString("en-US")}원`;
}

function itemCount(itemId) {
  progress.items[itemId] = normalizeItemCount(progress.items[itemId]);
  return progress.items[itemId];
}

function addWon(amount) {
  const value = normalizeWon(amount);
  if (!value) return wonBalance();
  progress.won = wonBalance() + value;
  scheduleSave();
  return progress.won;
}

function spendWon(amount) {
  const value = normalizeWon(amount);
  if (wonBalance() < value) return false;
  progress.won -= value;
  scheduleSave();
  return true;
}

function addItem(itemId, count = 1) {
  if (!ITEMS[itemId]) return 0;
  const value = normalizeItemCount(count);
  if (!value) return itemCount(itemId);
  progress.items[itemId] = itemCount(itemId) + value;
  refreshQuestLevels();
  scheduleSave();
  return progress.items[itemId];
}

function removeItem(itemId, count = 1) {
  const value = normalizeItemCount(count);
  if (!value || itemCount(itemId) < value) return false;
  progress.items[itemId] -= value;
  refreshQuestLevels();
  scheduleSave();
  return true;
}

function hasItemCount(itemId, count = 1) {
  return itemCount(itemId) >= normalizeItemCount(count || 1);
}

function normalizeItemRequirement(requirement) {
  if (!requirement) return [];
  if (Array.isArray(requirement)) return requirement.flatMap((entry) => normalizeItemRequirement(entry));
  if (typeof requirement === "object" && requirement.item) {
    return [{ item: requirement.item, count: normalizeItemCount(requirement.count || 1) || 1 }];
  }
  if (typeof requirement === "object") {
    return Object.entries(requirement).map(([item, count]) => ({ item, count: normalizeItemCount(count || 1) || 1 }));
  }
  return [];
}

function hasRequiredItems(requirement) {
  const required = normalizeItemRequirement(requirement);
  return required.length > 0 && required.every(({ item, count }) => hasItemCount(item, count));
}

function rewardKeyApplied(key) {
  return !!key && progress.rewarded.has(key);
}

function grantRewardOnce(key, reward = {}, options = {}) {
  if (!key || rewardKeyApplied(key)) return false;
  const rewardWon = normalizeWon(reward.rewardWon);
  const rewardItems = normalizeItemRequirement(reward.rewardItems);
  if (!rewardWon && !rewardItems.length) return false;

  if (rewardWon) progress.won = wonBalance() + rewardWon;
  rewardItems.forEach(({ item, count }) => {
    if (ITEMS[item]) progress.items[item] = itemCount(item) + count;
  });
  progress.rewarded.add(key);
  if (options.refresh !== false) refreshQuestLevels();
  scheduleSave();
  return true;
}

function economySummary() {
  return {
    won: wonBalance(),
    wonText: formatWon(progress.won),
    items: { ...progress.items },
  };
}

function shopItems(shopState = shop) {
  const data = shopState?.data;
  if (!data) return [];
  return data.items.map((itemId) => itemById(itemId)).filter(Boolean);
}

function selectedShopItem() {
  const items = shopItems();
  if (!items.length) return null;
  return items[shop.selectedIndex] || items[0];
}

function currentShop() {
  return shop || null;
}

function setShopStatus(statusKey, statusParams = {}) {
  if (!shop) return;
  shop.statusKey = statusKey;
  shop.statusParams = statusParams;
}

function openShop(shopId) {
  const data = shopById(shopId);
  if (!data || !data.items.some((itemId) => ITEMS[itemId])) return false;
  stopSpeech();
  dialog = null;
  drill = null;
  studyBoard = null;
  shop = {
    id: shopId,
    data,
    selectedIndex: 0,
    statusKey: "shop.status.ready",
    statusParams: {},
  };
  clearMovementInput();
  return true;
}

function closeShop() {
  stopSpeech();
  shop = null;
  clearMovementInput();
}

function moveShopSelection(delta) {
  if (!shop) return;
  const count = shopItems().length;
  if (!count) return;
  shop.selectedIndex = (shop.selectedIndex + delta + count) % count;
}

function formatWonForSpeech(amount) {
  if (typeof composeSinoReading === "function") {
    const reading = composeSinoReading(normalizeWon(amount))?.reading;
    if (reading) return `${reading} 원이에요`;
  }
  return `${formatWon(amount)}이에요`;
}

function speakShopTransaction(item) {
  if (!item) return;
  const request = `${item.orderNameKo || t(item.nameKey, {}, "ko")} 주세요`;
  const response = formatWonForSpeech(item.priceWon);
  if (!speechSupported()) return;

  textToSpeech().speak({
    text: request,
    languageCode: "ko",
    voiceProfile: { id: "shopCustomer", gender: "female", nameKey: item.nameKey },
    onComplete: () => {
      textToSpeech().speak({
        text: response,
        languageCode: "ko",
        voiceProfile: shop?.data.clerkVoice || { id: shop?.id || "shopClerk", gender: "female", nameKey: shop?.data.titleKey },
        onComplete: () => {},
      });
    },
  });
}

function buySelectedShopItem() {
  if (!shop) return false;
  const item = selectedShopItem();
  if (!item) return false;
  if (wonBalance() < item.priceWon) {
    setShopStatus("shop.status.insufficient", { item: t(item.nameKey), price: formatWon(item.priceWon), balance: formatWon(progress.won) });
    return false;
  }

  spendWon(item.priceWon);
  addItem(item.id, 1);
  setShopStatus("shop.status.bought", { item: t(item.nameKey), balance: formatWon(progress.won) });
  speakShopTransaction(item);
  return true;
}

function handleShopInput(event) {
  if (!shop) return;
  const dir = keyToDir[event.code];
  if (dir === "up" || dir === "down" || dir === "left" || dir === "right") {
    event.preventDefault();
    moveShopSelection(dir === "down" || dir === "right" ? 1 : -1);
    return;
  }

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    buySelectedShopItem();
    return;
  }

  if (event.code === "Escape") {
    event.preventDefault();
    closeShop();
  }
}

Object.assign(window.KA.items, {
  all: ITEMS,
  register: registerItems,
  get: itemById,
});

Object.assign(window.KA.shops, {
  all: SHOPS,
  register: registerShops,
  get: shopById,
});

Object.assign(window.KA.economy, {
  addWon,
  spendWon,
  addItem,
  removeItem,
  itemCount,
  hasItemCount,
  hasRequiredItems,
  normalizeItemRequirement,
  grantRewardOnce,
  rewardKeyApplied,
  summary: economySummary,
  formatWon,
  openShop,
  closeShop,
  currentShop,
  shopItems,
  selectedShopItem,
  buySelectedShopItem,
  handleShopInput,
});
