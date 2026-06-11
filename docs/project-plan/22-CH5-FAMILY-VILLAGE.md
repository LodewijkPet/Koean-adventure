# CH5 — 가족 마을 (Family Village) + Trail 4 — STATUS: PLANNED

**Stream:** CONTENT-CH5 · **Slug:** `town5`, `trail4` · **Files:** `src/world/trail4.js`, `src/world/town5.js`, `data/drills/town-5.js`.
**Engine deps:** none hard. Nice: E2 (conversation challenges shine here), E11 (Chuseok festival), E1, E5/E6. Stand-ins ok.

## Theme & story

A hanok village of three big families preparing Great-Grandma Boksun's 80th feast (잔치). Guests are coming and *nobody remembers who is whose 오빠/형/언니/누나* — the player rebuilds family trees, learns to speak politely to elders, seats the feast by age, and earns the **Family Badge (가족 배지)**. Chuseok festival event (E11) returns here later.

## Curriculum allocation (lock)

Family terms (asymmetric sibling system), possession 의 (+drop), descriptive verbs as predicates (커요/작아요/예뻐요/좋아요/많아요), honorific intro -(으)세요 statements/questions + 께서 recognition, age 살/몇 살, 와/과·하고 consolidation. Word categories: `family`, `animals`, `housing`, `adjectives`.

## Trail 4 — 과수원 길 (Orchard Road) (34×54)

- **Harvest Tales posts** ×3: farmers tell short past-tense harvest stories (CH4 review echo) — drill `trail4Harvest` (static 9 pick 5).
- **Adjective Orchard**: tree pairs big/small etc.; board `adjectivePairs` (커요/작아요, 많아요/적어요, 길어요/짧아요, 높아요/낮아요) → generated `trail4Adjectives` (picture-word: glyph pair → which tree? both directions via meaning↔hangul).
- **Pet crossing**: animal NPC-objects (개/고양이/새/닭/소/돼지/말/물고기) — `trail4Animals` generated word drill + 마리 counting review.

## Town map (46×38)

```
      N gate (trail5)
 ┌───────────────────────────────────┐
 │ KIM compound   ANCESTRAL   PARK   │  three hanok compounds (style: hanok)
 │ LEE compound      HALL    (pets)  │  ancestral hall = honorific theory
 │ CHOI compound   FEAST HALL        │  feast hall = gym
 │   Family School    Photo House    │
 └──────────S gate (trail4)──────────┘
```

## Buildings & interiors

| Building | Stations |
| --- | --- |
| Family School | boards: `familyTerms` (the 4-way sibling chart by speaker gender!), `possession의`, `ageCounting` (살 + 몇 살이에요/연세); desks generated practice; blackboard exams `town5FamilyExam`, `town5AdjExam` |
| Kim/Lee/Choi compounds (3 interiors) | each family 5–6 NPCs; **family-tree quests**: listen to members ("저는 민지예요. 지호는 제 오빠예요.") then tree-board drill assigns relations (`town5TreeKim` etc., static 6 each from authored facts) |
| Ancestral Hall | board `honorificIntro` (-(으)세요, 께서, 드세요 vs 먹어요 pairs); elder NPC speaks honorific lines; drill `town5Honorific` (choose polite version; E2 conversation upgrade) |
| Feast Hall (gym) | leader Boksun resolver; **seating minigame**; badge exam `town5FamilyBadge` (mixed 7, pass 6) |
| Photo House | family photos = description drills `town5Photos` ("아버지는 키가 커요" → pick person; generated from authored person facts) |
| Pet Park | animal roundup mini-quest: each pet found speaks its sound (멍멍!) — location grammar review (`town5Pets`, find-flag chain like trail2 key) |

## Seating minigame (signature)

Seat 6 guests at the feast table by clues: "할아버지께서 가운데에 앉으세요", "민지는 오빠 옆에 앉아요" — choice-based placement per seat (stand-in), E1 ordering upgrade. Teaches: honorifics + position review + family terms. Flag `town5.seatingPassed`.

## NPC roster (22)
greeter, guide(resolver), leader Boksun(resolver), school teacher + 2 pupils, 3×5 family members (mix resolvers for tree quests + pools), hall elder(resolver), photo keeper, pet owner kid, 2 wanderers, rival cameo spot (R4), Haneul absent this chapter.

## Drills summary
trail4Harvest/Adjectives/Animals · town5FamilyTerms practice+exam · town5AdjPhotos+exam · town5Honorific · town5TreeKim/Lee/Choi · town5Seating · town5Pets chain · town5Review (echo: time+numbers+this) · town5FamilyBadge.

## Quests
trail4Stories, trail4BigSmall, trail4Creatures · town5Arrival · town5SchoolFamily(3) · town5Trees(3 quests, one per compound) · town5Elders(2: theory+practice) · town5Photos · town5PetRoundup(3) · town5Seating · town5Badge. All whereKeyed (school/compounds/hall/feast/park).

## Word list (target 120; core below)
family: 가족 부모님 아버지 어머니 아빠 엄마 형 오빠 누나 언니 동생 남동생 여동생 아들 딸 할아버지(rev) 할머니(rev) 삼촌 이모 고모 사촌 부부 아기
people/desc: 사람(rev) 이름(rev) 나이 살(rev) 키
adjectives: 커요 작아요 많아요 적어요 길어요 짧아요 높아요 낮아요 예뻐요 멋있어요 좋아요 나빠요 젊어요 늙으셨어요(rec) 같아요 달라요
animals: 개 고양이 새(rev) 닭 소 돼지 말 토끼 물고기 멍멍 야옹
housing: 집(rev) 방 부엌 마당 문(rev) 창문 침대(rev) 사진 가구 한옥
honorific set: 께서 -(으)세요 드세요 주무세요 계세요 연세

## Narrative hooks
R4 rival at feast door (duel pool family/adjectives) · L4 letter on badge · Chuseok festival registration rows (E11): songpyeon stall, charye table walkthrough, 윷놀이 corner — content pre-built behind `festival.chuseok` flag.

## Music
`trail4`→Trail1.mp3, `town5`→Town1.mp3 fallbacks.

## Upgrade pass
E2: honorific drill → real conversation with elder. E11: activate Chuseok. E1: seating ordering. E5/E6 as usual.

## Acceptance beats
Sibling chart answers depend on speaker gender (test both tree quests prove it); honorific drill rejects plain forms; seating requires hall theory first; pets all findable; badge gates trail5.

## P-step checklist
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
