# Korea Adventure — World Design

The world is **한국도 (Hanguk-do)**, a fictional island province shaped like a rough crescent. Travelers arrive by sea in the south and work their way north and east, earning badges, until the capital ferry opens. Curriculum mapping for every location is in `CURRICULUM_MAP.md`.

## World Map (logical layout)

```
                          [12] 수도 한벽 (Capital)
                                  ║ ferry (needs 8 badges)
   [11] 하늘 공항 신도시 ══ [9] 바다 병원 마을 ── lighthouse coast
        (Airport)                 │
            │              Trail 8 (coast road)
   [10] 등불 호수 ─ Trail 9 ─ [8] 책산 캠퍼스 (Campus)
        (Lantern Lake)            │
            │              Trail 7 (book pass)
       festival road       [7] 기차역 도시 (Station City) ══ rail spurs to all badge towns
                                  │
                           Trail 6 (rail trail)
   [5] 가족 마을 ─ Trail 5 ─ [6] 맛길 거리 (Tastetrail)
        (Family Village)          │
            │              Trail 4 (orchard road)
       hanok lanes         [4] 시간 마을 (Time Town)
                                  │
                           Trail 3 (clock pass)              ← next frontier
                           [3] 숫자 시장 (Number Market)      ← implemented
                                  │
                           Trail 2 (mirror shrine path)      ← implemented
                           [2] 이름시 (Name City)            ← implemented
                                  │
                           Trail 1 (creek path)              ← implemented
                           [1] 하늘 마을 (Haneul Town)        ← implemented
                                  │
                              southern sea (arrival)
```

Scene IDs follow the existing convention: `town`, `trail1`, `town2` (implemented); next: `trail2`, `town3`, `trail3`, `town4` … The rail network in Chapter 7 retroactively connects towns (fast travel that *requires reading the timetable*).

## Location Archetype Library

Every town is assembled from these archetypes. Each archetype has a fixed pedagogical role so players always know what a building *does*.

| Archetype | Role | Examples in world |
| --- | --- | --- |
| **School / academy** | Theory hub: study boards, teacher NPC, blackboard exams | Town 1 elementary school; Ch 8 campus; cooking school (Ch 6) |
| **Practice fountain / landmark** | Repeatable generated drills, weakness-first review | Town 1 fountain; Mirror Shrine (T2); Clocktower (Ch 4) |
| **Market / shop** | Vocabulary domains + transactions; money sink/source | Corner Market (T1); entire Number Market (Ch 3); pharmacy (Ch 9) |
| **Restaurant / cafe / tea house** | Ordering, desire, negation, taste talk | Hanok Tea House (T1); Tastetrail Street (Ch 6); campus cafe (Ch 8) |
| **Guesthouse / home** | Rest point, family/daily-life vocabulary, save anchor | Player guesthouses (T1, T2); hanok homes (Ch 5) |
| **Civic hall (city hall / guild)** | Badge exam stations | Name City City Hall; Market Guild (Ch 3); each badge town |
| **Library / museum** | Reading practice, optional lore in easy Korean | Review Library (T2 city); Label Museum (T2); rail museum (Ch 7) |
| **Park / plaza** | Action verbs, observation drills, NPC density | Action Park (T2); lake park (Ch 10) |
| **Station / terminal / harbor / airport** | Timetables, tickets, directions | Station City (Ch 7); harbor (Ch 9); airport (Ch 11) |
| **Clinic / hospital** | Body, symptoms, instructions | Hospital Town (Ch 9); school nurse (Ch 8) |
| **Festival ground** | Seasonal events, integrated review quests | Lantern Lake (Ch 10); Chuseok at Family Village (Ch 5) |
| **Trail / route** | One grammar pattern set drilled through 6–8 events | Trails 1–9 |

## Implemented Locations (current build)

### [1] 하늘 마을 — Haneul Town (Chapter 1)

Pallet-Town-sized starter. Implemented in `buildMap()`/`createInteriorScenes()`.

- **Your Guesthouse** — home base; host + kid NPCs.
- **Elementary School** — teacher Seo, 3 students, vowel/consonant wall maps (study boards), desks (syllable practice), blackboard (exams).
- **Final Sound House** — batchim theory (converted rival guesthouse); coach + learner NPCs.
- **Sound Fountain** — leveled generated Hangul drills (vowels → consonants → syllables → aspirated → double → batchim → review).
- **Corner Market, Hanok Tea House, Travel Orientation Center** — flavor, future shop/quest hooks, beach + shoreline.
- **Exit north** → Trail 1.

### Trail 1 — 첫길 (Chapter 1.5)

Creek bridge, batchim sign drill, name-card board, object-label stall, action sign, rest table, trail keeper NPC. Connects Town 1 ↔ Town 2.

### [2] 이름시 — Name City (Chapter 2)

The label-mixup city. Implemented in `createTown2Scene()`/`createTown2InteriorScenes()`.

- **Central Plaza** — review board/table, speech bench, distance-triangle markers.
- **Information Center** — identity registration (저는 X예요) with applicant NPCs.
- **Lost-and-Found + Search Field** — presence/absence (있어요/없어요), hidden item spots.
- **Label Museum** — 이건/그건/저건 displays.
- **Action Park** — actor NPCs demonstrating verbs; action board.
- **Review Library** — Hangul/batchim retry stations.
- **City Hall (Blocks Hall)** — five badge stations + leader + podium → **First Words Badge**.
- **North gate** → Trail 2 (road guard checks the badge).

### Trail 2 — 거울 길 (Mirror Path) (implemented)

A wooded path with the **Mirror Shrine**: a board that combines vowels (ㅗ+ㅏ=ㅘ) — compound-vowel theory + generated mirror-pool drills. Events: location posts (위/아래/옆/안 + 에 있어요), the 도-echo twins (저도!), and the Lost Key quest (search under the rocks, answer in location sentences). Connects Name City ↔ Number Market. Hiker and shrine keeper NPCs.

### [3] 숫자 시장 — Number Market City (Chapter 3) (implemented, first cut)

A market city: stalls everywhere, prices on everything.

- **South Gate Plaza** — greeter, Grand Price Board (sino theory), market review board (weakness-first word review).
- **Fruit / Fish / Cloth stalls** — native numbers + counters 개/마리, colors; each with its own drill.
- **Counter Word Stall + Price Tag Stall** — the counter and price practice stations (theory-gated).
- **Counting House (school archetype)** — sino/native/counter boards; abacus desks (mixed generated practice: meanings, price readings, counting phrases); number blackboard (exams).
- **Snack Cafe** — 잔 counter, first ordering loop (pre-restaurant).
- **Market Guild Hall (civic)** — **Number Badge** podium (requires both exams + counters + prices).
- **Grandma's shopping list** side quest; market guesthouse.
- **North gate** → Trail 3 (pending). Planned for M3: real won-based buying at the stalls.

## Future Locations (designed, build later)

### [4] 시간 마을 — Time Town (Ch 4)
Broken clocktower (nasalization chime mini-game), schedule board plaza, watchmaker school, diary house (past tense), early-morning market (routine verbs). Badge: Clock.

### Trail 4 — 과수원 길 (Orchard Road)
Past-tense storytelling events: farmers recount what happened to the harvest.

### [5] 가족 마을 — Family Village (Ch 5)
Hanok lanes, three multi-generation family compounds (family-tree quests), ancestral hall (honorific intro), pet yard (animals), feast hall (Chuseok festival event). Badge: Family.

### Trail 5 — 한옥 골목 (Hanok Alleys)
Adjective corridors: houses described (큰 집, 작은 문) — recognition seeds for Ch 10 relative clauses.

### [6] 맛길 거리 — Tastetrail Street (Ch 6)
One long food street: 분식집, 국밥집, BBQ house, bakery, cooking school, night-market alley. The player works a waiter shift as the badge exam. Badge: Taste.

### Trail 6 — 철길 산책로 (Rail Trail)
Decommissioned tracks; future-tense events (workers planning the new line).

### [7] 기차역 도시 — Station City (Ch 7)
Grand station (timetable hall), subway mini-network (3 lines, transfer puzzle), bus terminal, harbor, rail museum. Completing the badge unlocks **rail fast-travel** to earlier towns (reading the timetable each time). Badge: Travel.

### Trail 7 — 책 고개 (Book Pass)
Connector events using -고 chains (hikers describing their route step by step).

### [8] 책산 캠퍼스 — Bookmountain Campus (Ch 8)
University quad, lecture halls, library tower (multi-floor reading challenges), club fair grounds, cafe, dorms, small office district. Badge: Study.

### Trail 8 — 해안 도로 (Coast Road)
Weather and feelings small-talk events; sets up Ch 9/10 vocabulary.

### [9] 바다 병원 마을 — Seaside Hospital Town (Ch 9)
Clinic (triage quest), pharmacy (dosage reading), jjimjilbang (permission/prohibition), lighthouse (give/receive relay), harbor ferry office (capital gate). Badge: Health (8th badge → ferry opens).

### [10] 등불 호수 — Lantern Lake (Ch 10, optional region)
Lake park, festival grounds (seasonal lantern festival), noraebang, fishing pier, four-seasons lookout. Relative-clause and experience content; biggest side-quest density.

### [11] 하늘 공항 신도시 — Sky Airport New City (Ch 11)
Airport terminal (check-in roleplay, announcements), tech mall (phone shop quest), international food court (review), departure-lounge stories. Formal-style listening hub.

### [12] 수도 한벽 — The Capital (Ch 12)
Full small city: bank, post office, department store, subway, offices, apartment, royal palace gate (culture). Hosts the **언어 연맹 (Language League)** — the Pokémon-League-style finale: present all eight badges at the League Hall, then face **A Day in Korean**, a gauntlet of back-to-back real-life challenges (bank, post office, lunch order, transfer, phone call, small talk) drawn from the full curriculum with weakness-weighted selection. Post-game: the errand generator.

## West Region (side expansion, post-main-road)

A western peninsula reached by ferry from Family Village. Optional, badge-free regions for depth, culture, and review — built only after the eight-badge main road is polished (quality before quantity).

### 조선 민속 마을 — Joseon Folk Village (flagship of the west)
A living-history town where everyone roleplays the Joseon era: hanok compounds, a 서당 village school teaching with brush and ink, craftsmen (한지 paper, 옹기 pottery, 한복 tailoring), a magistrate's office, and a 과거 civil-exam parody whose "exam" is a grand mixed review of everything learned. Teaches: traditional-life vocabulary (한복, 갓, 붓, 절, 마당…), politeness depth (bowing, elders, 세배), cultural literacy (jesa, tea ceremony, folk games 윷놀이/제기차기), and slow formal storytelling (옛날이야기 tales as listening/reading quests). A few NPCs use playful archaic flavor (~하오체), clearly marked as old-fashioned — recognition only, never tested.

### Other west-region sketches
- **온천 마을 (Hot Spring Town)** — relaxation, body/feeling review, bathhouse etiquette.
- **도예 마을 (Potters' Village)** — crafting chains: follow multi-step instructions to shape, glaze, and fire pottery (imperatives + sequencing review).
- **수묵 산길 (Ink-Painting Trail)** — quiet trail of poems and proverbs (사자성어 sampler, recognition only).

## Festivals & Cultural Events (cross-world)

| Event | Location | Unlock | Teaches |
| --- | --- | --- | --- |
| 추석 Chuseok feast | Family Village | Ch 5 | family honorifics, food, giving verbs |
| 등불 축제 Lantern Festival | Lantern Lake | Ch 10 | wishes (future), descriptions |
| 시장 큰장날 Grand Market Day | Number Market | post-Ch 3, repeatable | numbers/counters review at scale |
| 설날 New Year | Capital | post-game | age, 세배, formal greetings |
| 김장 Kimjang day | Tastetrail | post-Ch 6 | imperative recipes, quantities |

## World-Building Rules

1. **A town teaches one thing.** Its name says it (이름시 teaches names; 숫자 시장 teaches numbers). Players should be able to answer "what do I learn here?" instantly.
2. **Trails drill, towns apply.** Trails are linear grammar corridors with 6–8 single-pattern events; towns are open hubs with quests that mix the trail's pattern into real situations.
3. **Movement is never blocked backward.** Badge gates block only the *next* trail. All earlier areas stay open for review and side quests.
4. **Every building uses an archetype** so interaction expectations transfer (blackboards examine, fountains practice, boards teach).
5. **Korean signage everywhere**, readable with chapter-current skills; signs are themselves micro reading drills.
6. **Scenes follow `docs/guides/create-a-town.md` / `docs/guides/create-a-drill.md` patterns** — tile maps, route triggers, interiors, `TEXT` keys in three languages, `musicKey` from `MUSIC_TRACKS`.
