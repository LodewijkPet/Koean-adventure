# How To Create A Shop

Shops are plain engine overlays opened from world interactables with `shopId`. They use the player wallet (`progress.won`) and inventory (`progress.items`) through `KA.economy`.

## Add Text

Put all visible item and shop labels in the owning chapter data pack:

```js
text: {
  en: {
    "shop.town5Snack.title": "Snack Stall",
    "item.town5.bread": "Bread",
  },
  ko: {
    "shop.town5Snack.title": "간식 가게",
    "item.town5.bread": "빵",
  },
  nl: {
    "shop.town5Snack.title": "Snackkraam",
    "item.town5.bread": "Brood",
  },
}
```

## Register Items And Shop

Register from the owning world file:

```js
window.KA.items.register([
  { id: "town5.bread", nameKey: "item.town5.bread", priceWon: 800, category: "food", orderNameKo: "빵" },
]);

window.KA.shops.register([
  {
    id: "town5SnackShop",
    titleKey: "shop.town5Snack.title",
    items: ["town5.bread"],
    clerkVoice: { id: "town5SnackClerk", gender: "female", nameKey: "npc.town5SnackClerk" },
  },
]);
```

Purchases speak Korean: `<item> 주세요`, then `<price> 원이에요`. Use `orderNameKo` when the item name should be a shorter natural order word than the UI label.

## Hook An Interactable

For static shops:

```js
{
  labelKey: "object.town5SnackStall",
  x: 10,
  y: 8,
  solid: true,
  shopId: "town5SnackShop",
}
```

For progression-gated shops, use `shopResolver`:

```js
shopResolver: () => hasProgressFlag("town5.pricePracticePassed") ? "town5SnackShop" : null,
```

If the resolver returns `null`, the interactable falls through to its drill or dialog.

## Rewards

Drills and quests may grant one-time rewards:

```js
rewardWon: 1200,
rewardItems: [{ item: "town5.bread", count: 1 }],
```

Drill rewards are keyed by drill id and only pay once after a passing run.

## Buy Quests

Quest steps can require inventory while keeping their append-only flag:

```js
{
  flag: "town5.errandDone",
  objectiveKey: "quest.town5.errand.buyBread",
  whereKey: "area.town5",
  requiredItem: { item: "town5.bread", count: 1 },
}
```

When the inventory requirement is met, quest refresh sets the step flag and the journal advances.

## Verification

Run:

```powershell
node --check <changed-file.js>
node tools/smoke-test.js
```

Use a browser boot check when adding or moving `shopId`/`shopResolver` interactables.
