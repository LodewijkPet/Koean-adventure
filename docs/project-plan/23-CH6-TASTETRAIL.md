# CH6 — 맛길 거리 (Tastetrail Street) + Trail 5 — STATUS: PLANNED

**Stream:** CONTENT-CH6 · **Slug:** `town6`, `trail5` · **Files:** `src/world/trail5.js`, `src/world/town6.js`, `data/drills/town-6.js`.
**Engine deps:** E3 economy + **E7 shift minigame** are this chapter's heart (stand-ins acceptable but plan to land E7 first). E2 elevates ordering.

## Theme & story

One long food street: 분식집, 국밥집, BBQ house, bakery, night-market alley, and the Cooking School. Head Chef Taeo lost his entire floor staff before the festival weekend — the player works up from runner to waiter to sous-chef, survives the **dinner rush**, and earns the **Taste Badge (맛 배지)**.

## Curriculum allocation (lock)

-고 싶어요 desire; ordering frames (N 주세요 → N 하나 주세요 → 여기 N이요); negation 안 + -지 않아요; 못; suggestions -(으)ㄹ까요? / 같이 -아/어요; -아/어 주세요 requests; taste adjectives (맛있어요 매워요 짜요 달아요 셔요 써요 싱거워요 — ㅂ-irregular *recognition*). Categories: `dishes`, `ingredients`, `cooking`, `taste`.
Pronunciation: 먹고→[먹꼬] tensification; 같이→[가치] palatalization (recipe steps).

## Trail 5 — 한옥 골목 (Hanok Alleys) (34×54)

Adjective→noun seeds: houses described (큰 집/작은 문 — *recognition only*, preview of CH10); want-stations: pilgrims state cravings "비빔밥을 먹고 싶어요" → drill `trail5Wants` (match craving→dish, generated from dish words + -고 싶어요 frame); shortcut gate with 못 가요 sign (blocked path joke + 못 teaching `trail5MotGate`).

## Street map (50×36 — one long EW street, gates W(trail5)/E(trail6))

Buildings N side: Bunsik Snackbar · Gukbap House · BBQ House · Cooking School. S side: Bakery · Night Market alley (festival-style stalls) · Tea-rest · Guesthouse. Center: Menu Plaza with the big **Menu Board**.

## Buildings & stations

| Place | Stations |
| --- | --- |
| Menu Plaza | board `menuReading` (real menu layout: dish+price — CH3 review built-in); drill `town6Menu` generated (read menu line → dish/price questions) |
| Cooking School (school) | boards: `wantForm` (-고 싶어요), `negationBoard` (안/-지 않아요/못 contrast table), `requestBoard` (-아/어 주세요); desk practices generated; blackboard exams `town6WantNegExam` |
| Bunsik (training restaurant) | **shift minigame tier 1** (E7): 1-item orders, menu 떡볶이 김밥 라면 순대 튀김 |
| Gukbap House | tier 2 shifts: counts + 빼 주세요/안 맵게 modifiers |
| BBQ House (gym) | leader Taeo; tier 3 **dinner-rush badge shift** `town6TasteBadge` (multi-item + negation + request modifiers, pass threshold) + mixed exam steps |
| Bakery | -(으)ㄹ까요? suggestion drill `town6Suggest` ("같이 빵 만들까요?") + recipe-following minigame `town6Recipe`: ordered steps (썰어요→넣어요→끓여요…) — E1 ordering, stand-in choice-sequence; 같이=[가치] callout |
| Night Market alley | review-echo stalls (`town6Review` generated all-prior) + taste-guess stall: speak/desc "매워요!" → pick dish (`town6TasteGuess`) |
| Guesthouse | bed (L5), host |

## NPC roster (20)
greeter, street guide(resolver), Taeo(leader resolver), school chef-teacher + 2 trainees, bunsik ajumma, gukbap halmeoni, 4 rotating customers (pool lines double as listening seeds), baker pair, night-market vendors ×3 (pools), picky eater (negation showcase resolver), food critic (taste adjectives resolver), rival spot R5, Haneul absent.

## Drills/minigames summary
trail5Wants/MotGate · town6Menu · want/negation/request practices + `town6WantNegExam` · shifts tier1/2 (`town6ShiftBunsik`, `town6ShiftGukbap`, E7 or stand-in listening-choice chains) · town6Suggest · town6Recipe · town6TasteGuess · town6Review · `town6TasteBadge` (badge shift+exam, flag `town6.tasteBadgePassed`).

## Quests (~11, all whereKeyed)
trail5Cravings · trail5NoWay · arrival · menuPlaza · schoolWants(3) · schoolNegation(2) · runnerShift · waiterShift · bakerySuggest · recipeDay · tasteBadge.

## Word list (target 150; core)
dishes: 김치찌개 된장찌개 비빔밥 불고기 갈비 삼겹살 떡볶이 김밥 라면 순대 튀김 국밥 냉면 만두 전 빈대떡 잡채 볶음밥 죽
ingredients: 고기 소고기 돼지고기 닭고기 김치 두부 계란 파 마늘 고추 간장 고추장 된장 설탕 소금 기름 쌀 면
cooking verbs: 만들어요 끓여요 썰어요 넣어요 볶아요 구워요 비벼요 싸요2(wrap) 맛봐요
taste: 맛 맛있어요 맛없어요 매워요 짜요 달아요 셔요 써요 싱거워요 뜨거워요 차가워요
restaurant: 메뉴 주문 손님(rev) 사장님 종업원 그릇 젓가락 숟가락 컵 물수건 계산서 추가 빼고 같이 혼자
frames: 주세요(rev) ~고 싶어요 ~지 않아요 못 ~(으)ㄹ까요 ~아/어 주세요 (pattern entries for E10 log)

## Narrative hooks
R5 rival mis-order comedy + duel · L5 recipe letter · critic subplot: 3 reviews readable after each shift tier (reading rewards).

## Music
`town6` upbeat fallback Town2.mp3; `trail5`→Trail1.mp3.

## Upgrade pass
E7 replaces stand-in shifts (keep same flags) · E3: real bill payment + tips · E2: table small-talk conversations · E1: recipe ordering native.

## Acceptance beats
Order with 안 맵게 modifier resolves correctly; 못/안 contrast exam item present; recipe order enforced; badge shift fails below threshold and is repeatable; tensification/palatalization callouts shown once each.

## P-step checklist
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
