# Korea Adventure — Curriculum Map

The complete language curriculum from zero to ~CEFR A2–B1, mapped to the world. Each chapter lists reading goals, grammar, vocabulary domains with target counts, pronunciation rules, and can-do statements. The world details for each location live in `WORLD_DESIGN.md`.

Conventions:

- **Recognition** = player reliably picks/understands the form. **Production** = player builds it (sentence builder, fill-blank, typed).
- Every chapter ends with a badge exam or trail gate that *only* tests taught material.
- Every chapter's practice stations include a **review mode** drawing the player's weakest items from all earlier chapters (weakness-first selection, already implemented for Hangul).
- Romanization is allowed only in Chapter 1 (letter names) and never again.

## CEFR Trajectory

| Chapters | Stage | Outcome |
| --- | --- | --- |
| 1–2 (+ Trails 1–2) | Pre-A1 | Reads Hangul fluently; parses sentence blocks; survival patterns |
| 3–5 | A1 | Numbers, time, family, shopping, simple talk about self |
| 6–8 | A1+ → A2 | Restaurants, travel, school/work, past/future, connected sentences |
| 9–10 | A2 | Health, hobbies, conditions, descriptions, experiences |
| 11–12 | A2+ → B1 threshold | Plans, formal style, reported speech intro, full daily-life integration |

## Chapter 1 — 하늘 마을 (Haneul Town): Reading Machine

**Status: implemented.** The school + Final Sound House + fountain loop.

- **Reading**: 10 basic vowels; 14 basic consonants; syllable block structure (C+V, C+V+C); first open syllables; aspirated ㅋㅌㅍㅊ as base+ㅎ; double ㄲㄸㅃㅆㅉ; single batchim (ㄴ first); double batchim intro (앉/닭/값).
- **Grammar**: none on purpose. Only the *shape* of sentences (they end in 요; they split into chunks).
- **Vocabulary** (~60 items): letter names; anchor words 한국, 집, 문, 물, 책, 길, 산, 손, 눈, 밥…
- **Can-do**: "I can sound out any basic Hangul block without romanization."
- **Exit gate**: blackboard checks (done) + Town 1 Reading Badge exam (to build — see ROADMAP).

## Trail 1 — 첫길 (First Trail): Sentence Blocks

**Status: implemented.**

- **Grammar (recognition)**: 저는 X예요/이에요; 이건/그건/저건; X이/가 있어요/없어요; 을/를 + verb; SOV order; verbs 가요 와요 봐요 먹어요 마셔요 읽어요 써요.
- **Vocabulary** (~40): 저, 이름, 학생, 선생님, 친구, 가방, 사과, 나무, 다리…
- **Can-do**: "I can split a simple Korean sentence into chunks and find who/what/action."

## Chapter 2 — 이름시 (Name City): Identity & Presence

**Status: implemented; badge wiring in progress.** Information Center, Lost-and-Found, Label Museum, Action Park, City Hall.

- **Grammar**: 은/는 vs 이/가 (functional contrast only: topic vs. exists/subject); N이에요/예요 with batchim rule; 뭐예요? questions; 네/아니요 answers; full S-O-V recognition.
- **Vocabulary** (~80 new): roles (주민, 의사…), everyday objects, 여기/저기, basic adjective sightings.
- **Pronunciation**: linking (연음) noticed — 이름이 → [이르미] (taught as "the batchim slides").
- **Can-do**: "I can introduce myself, ask what something is, and say what is present or missing."
- **Badge 1: 첫말 배지 (First Words Badge)** — City Hall five-station exam (reading, names, objects, presence, actions).

## Trail 2 — 둘째 길: Compound Vowels & Where Things Are

**Status: to build (next).**

- **Reading**: compound vowels ㅐ ㅔ ㅒ ㅖ ㅘ ㅝ ㅙ ㅞ ㅚ ㅟ ㅢ — taught as combinations at a shrine of mirrors (ㅗ+ㅏ=ㅘ).
- **Grammar**: N에 있어요/없어요 (location); position nouns 위/아래/앞/뒤/옆/안/밖 + 에; 어디예요? / 어디에 있어요?; 도 "also".
- **Vocabulary** (~60): nature/trail words (새, 꽃, 바위, 호수, 다람쥐), position words, 왼쪽/오른쪽.
- **Events**: hidden-object quests answered with location sentences ("열쇠가 바위 아래에 있어요").
- **Can-do**: "I can read every modern Hangul syllable and say where things are."

## Chapter 3 — 숫자 시장 (Number Market City): Counting & Buying

**Status: to build (this expansion).** A market city where everything is numbered, priced, and counted.

- **Grammar**: Sino-Korean numbers 일~십, 백, 천, 만 (prices, money 원); native numbers 하나~열 (counting things); counters 개, 명, 마리, 병, 잔, 권, 살; 얼마예요?; N 주세요; 하고 "and" for nouns; 몇 + counter questions (몇 개?).
- **Vocabulary** (~120): numbers, money, market goods (과일: 사과 배 귤 포도; 채소; 생선), colors (빨간색, 파란색…) at the cloth stall, 싸요/비싸요, 많이/조금.
- **Pronunciation**: tensification awareness in compounds (숫자, 값이).
- **Mini-games**: price haggling (hear a price, pick the tag), the counter shop (choose the right counter for the item), shopping-list quest (buy 사과 두 개, 물 한 병 with limited won).
- **Economy unlock**: this chapter introduces money — quests/exams pay won; shops open across the world.
- **Can-do**: "I can ask prices, understand them, and buy N things politely."
- **Badge 2: 숫자 배지 (Number Badge)** — Market Guild Hall exam: read prices, count goods, complete three purchases.

## Chapter 4 — 시간 마을 (Time Town): Clocks, Days, and the Past

A clocktower town obsessed with schedules; everyone is late since the tower broke.

- **Grammar**: time-of-day 시/분 (native hours + sino minutes — the great trap, drilled gently); 요일; dates 월/일; 오늘/어제/내일; time particle 에; 부터/까지; **past tense 았/었어요**; 언제?
- **Vocabulary** (~110): days, months, daily routine verbs (일어나요, 자요, 씻어요, 시작해요, 끝나요), 아침/점심/저녁.
- **Pronunciation**: nasalization (했ނ는 → 한는… taught as 받침 ㄷ/ㅂ/ㄱ + ㄴ/ㅁ rules with 했는데 deferred; simple cases: 십만 → [심만]).
- **Quests**: fix the schedule board (order events by time), the diary quest (match past-tense entries to yesterday's events), train-of-the-day announcements.
- **Can-do**: "I can say when things happen and talk about yesterday."
- **Badge 3: 시계 배지 (Clock Badge).**

## Chapter 5 — 가족 마을 (Family Village): People & Politeness

A multi-generational hanok village preparing a grandmother's 잔치 (feast).

- **Grammar**: family terms (the asymmetric system: 형/오빠/누나/언니, taught by *whose* sibling, via NPC family trees); possession 의 (and its dropping); descriptive verbs as predicates (커요, 작아요, 예뻐요, 좋아요); honorific intro: -(으)세요 statements/questions about elders, 께서 recognition, 분/명 contrast; 와/과·하고 review; age with 살 + 몇 살이에요/연세.
- **Vocabulary** (~120): family, people descriptions, house rooms (방, 부엌, 마당), pets/animals (개, 고양이, 새, 물고기 + farm animals), adjectives.
- **Quests**: build the family tree (listen to who is whose 형/언니), seat the feast table by age and honorifics, pet roundup (animals + location grammar review).
- **Can-do**: "I can describe my family and speak more politely to elders."
- **Badge 4: 가족 배지 (Family Badge).**

## Chapter 6 — 맛길 거리 (Tastetrail Street): The Restaurant Chapter

A food street + cooking school. The restaurant fantasy, finally — built on numbers (Ch3) and time (Ch4).

- **Grammar**: **-고 싶어요** desire; ordering patterns (N 주세요 review → N 하나 주세요 → 여기 N이요); negation **안** + verb and **-지 않아요**; **못** inability; suggestions **-(으)ㄹ까요?** and **같이 -아/어요**; taste adjectives (맛있어요, 매워요 with ㅂ-irregular *recognition only*); -아/어 주세요 requests.
- **Vocabulary** (~150): dishes (김치찌개, 비빔밥, 불고기…), ingredients, kitchen verbs (만들어요, 끓여요, 썰어요), tableware, 더, 또.
- **Pronunciation**: tensification after ㄱ/ㅂ (먹고 → [먹꼬]); 같이 → [가치] palatalization.
- **Quests**: take orders as a waiter (listen, mark the table's order), cook-along (follow imperative recipe steps), the picky eater (negation practice), menu design (label dishes with taste words).
- **Can-do**: "I can order food, say what I want and don't want, and follow a simple recipe."
- **Badge 5: 맛 배지 (Taste Badge)** — run the dinner rush: three tables, full order-serve-bill cycle in Korean.

## Chapter 7 — 기차역 도시 (Station City): Movement & the Future

A grand rail hub + bus terminal + harbor. Everything Ch3+Ch4 taught becomes timetables and tickets.

- **Grammar**: **future -(으)ㄹ 거예요**; 에 가다/오다 review → **에서** (action location) vs 에 contrast; **(으)로** (direction/means: 버스로, 왼쪽으로); 에서 ~까지 (from~to); **-(으)ㄹ 수 있어요/없어요** ability; 어떻게 가요? directions; 걸려요 duration.
- **Vocabulary** (~130): transport (기차, 버스, 지하철, 배, 표, 역, 정류장), directions (직진, 사거리), travel verbs (타요, 내려요, 갈아타요, 도착해요, 출발해요), places in town.
- **Pronunciation**: ㄹ assimilation (신라 → [실라]); reading station names fast.
- **Quests**: buy the right ticket (destination/time/price triple-check), the transfer puzzle (subway map navigation in Korean), lost tourist escort (give directions by choosing instructions), harbor timetable reading.
- **Can-do**: "I can buy tickets, navigate transport, and talk about plans."
- **Badge 6: 여행 배지 (Travel Badge)** — solo trip mission: get from Station City to a target village with three connections, on time, under budget.

## Chapter 8 — 책산 캠퍼스 (Bookmountain Campus): Study, Work & Connected Speech

University town + offices. The chapter where single sentences become *speech*.

- **Grammar**: **-고** (and then/and) connector; **-지만** (but); **reasons -아/어서** and **-(으)니까** (contrast in nuance kept light); **-고 있어요** progressive; **-아/어야 해요** obligation; comparisons **보다/더/제일**; ordinal-ish 첫 번째…; 무슨/어떤/어느 question words.
- **Vocabulary** (~150): school (수업, 시험, 숙제, 전공), work (회사, 회의, 일하다), stationery, tech basics (컴퓨터, 핸드폰, 이메일), 쉬워요/어려워요.
- **Quests**: class schedule builder, the excuse engine (pick valid reasons with -아/어서), library research chain (multi-step instructions with -고), job board matching (abilities -(으)ㄹ 수 있어요 → jobs), club fair (comparisons: which club is more X).
- **Can-do**: "I can connect sentences, explain reasons, and describe what I'm doing and must do."
- **Badge 7: 공부 배지 (Study Badge).**

## Chapter 9 — 바다 병원 마을 (Seaside Hospital Town): Health & Conditions

A coastal wellness town: clinic, pharmacy, jjimjilbang, lighthouse.

- **Grammar**: body/symptom patterns (머리가 아파요, 감기에 걸렸어요); duration + 동안; **-(으)면** conditions; **giving/receiving 주다/받다/드리다** (+ 한테/에게/께); permission **-아/어도 돼요**; prohibition **-(으)면 안 돼요**; mild imperatives **-(으)세요/-지 마세요** (doctor's orders).
- **Vocabulary** (~130): body parts, symptoms, medicine (약, 알약, 하루에 세 번), feelings (기뻐요, 슬퍼요, 피곤해요), weather basics for health small talk.
- **Pronunciation**: ㅎ weakening (좋아요 → [조아요]); aspiration merges (입학 → [이팍]).
- **Quests**: symptom triage (route patients by what they say hurts), pharmacy dosage (read instructions: 하루에 두 번, 식후), jjimjilbang etiquette (permission/prohibition signs), first-aid relay (give/receive chains).
- **Can-do**: "I can explain symptoms, understand instructions, and use if-sentences."
- **Badge 8: 건강 배지 (Health Badge)** — final badge; opens the Capital ferry.

## Chapter 10 — 등불 호수 (Lantern Lake): Hobbies, Weather & Description

Festival region around a lake; recreation, seasons, and the descriptive engine. (Optional region — required for 100%, not for the Capital.)

- **Grammar**: **relative clauses -는/-(으)ㄴ N** (the person who sings, the food I ate); **-(으)ㄹ 때** when; **experience -아/어 봤어요**; **-는 것** nominalization (수영하는 것을 좋아해요); frequency adverbs 자주/가끔/항상; weather patterns + seasons.
- **Vocabulary** (~150): hobbies (등산, 낚시, 노래방, 사진), sports, instruments, nature/seasons (봄 여름 가을 겨울, 단풍, 눈), festival items.
- **Quests**: the talent show (match performers to relative-clause descriptions), four-seasons photo album (when-clauses), lantern wish-writing (sentence builder), fishing contest (counting review with 마리).
- **Can-do**: "I can describe people/things with clauses and talk about experiences and hobbies."

## Chapter 11 — 하늘 공항 신도시 (Sky Airport New City): Plans & Formality

Airport + technology district. Prepares departure-level Korean.

- **Grammar**: **-(으)려고 해요** intention; **-기 전에 / -(으)ㄴ 후에** before/after; **-(으)ㄹ게요** promises; formal style **-습니다/-ㅂ니다** (announcements, recognition + basic production); reported speech intro **-다고 해요** (recognition); phone Korean (여보세요, 바꿔 주세요).
- **Vocabulary** (~140): airport (여권, 탑승권, 출국), technology (충전기, 와이파이, 앱), country names, phone/messaging verbs.
- **Quests**: check-in desk roleplay, announcement decoding (formal style listening), the group-chat quest (read short messages), itinerary builder (before/after chains).
- **Can-do**: "I can handle announcements, make plans and promises, and recognize formal speech."

## Chapter 12 — 수도 한벽 (The Capital): A Day in Korean

The finale city. No new grammar — total integration, plus 반말 *awareness* (friends' casual speech with polite-form answers).

- **The Day in Korean** (final exam): wake to a to-do list in Korean; complete a full day — bank, post office, lunch order, subway transfer, phone call, shopping, meeting the rival — every interaction in Korean, no held-`T` translation, generated from the player's full curriculum with weakness-weighted selection.
- **Post-game**: daily random errand generator, hard-mode conversation replays, Korean-only UI new game+.
- **Can-do (game complete)**: matches the A2 descriptors + B1 threshold listening/reading listed in `MASTER_VISION.md` §1.

## Master Grammar Inventory (taught → tested)

| # | Pattern | Introduced | Production by |
| --- | --- | --- | --- |
| 1 | 저는 N이에요/예요 | Trail 1 | Ch 2 |
| 2 | 이/그/저 (+거) | Trail 1 | Ch 2 |
| 3 | 이/가 있어요/없어요 | Trail 1 | Ch 2 |
| 4 | 은/는 topic | Trail 1 | Ch 2 |
| 5 | 을/를 + V-아/어요 present | Trail 1 | Ch 2 |
| 6 | 뭐예요? / 네·아니요 | Ch 2 | Ch 2 |
| 7 | N에 있어요 + position nouns | Trail 2 | Ch 3 |
| 8 | 도 | Trail 2 | Ch 4 |
| 9 | Sino & native numbers + counters | Ch 3 | Ch 3 |
| 10 | 얼마예요 / N 주세요 / 하고 | Ch 3 | Ch 3 |
| 11 | Time 시/분, 요일, 월/일, 에 | Ch 4 | Ch 4 |
| 12 | 부터/까지 | Ch 4 | Ch 7 |
| 13 | Past 았/었어요 | Ch 4 | Ch 4 |
| 14 | 의 possession | Ch 5 | Ch 5 |
| 15 | Descriptive verbs | Ch 5 | Ch 5 |
| 16 | Honorific -(으)세요 / 께서 | Ch 5 | Ch 9 (imperative use) |
| 17 | -고 싶어요 | Ch 6 | Ch 6 |
| 18 | 안 / -지 않아요 / 못 | Ch 6 | Ch 6 |
| 19 | -(으)ㄹ까요? suggestions | Ch 6 | Ch 6 |
| 20 | -아/어 주세요 | Ch 6 | Ch 6 |
| 21 | Future -(으)ㄹ 거예요 | Ch 7 | Ch 7 |
| 22 | 에서 / (으)로 / 에서~까지 | Ch 7 | Ch 7 |
| 23 | -(으)ㄹ 수 있어요/없어요 | Ch 7 | Ch 7 |
| 24 | -고 / -지만 connectors | Ch 8 | Ch 8 |
| 25 | -아/어서 / -(으)니까 reasons | Ch 8 | Ch 8 |
| 26 | -고 있어요 progressive | Ch 8 | Ch 8 |
| 27 | -아/어야 해요 obligation | Ch 8 | Ch 8 |
| 28 | 보다/더/제일 comparison | Ch 8 | Ch 8 |
| 29 | -(으)면 condition | Ch 9 | Ch 9 |
| 30 | 주다/받다/드리다 + 한테/에게/께 | Ch 9 | Ch 9 |
| 31 | -아/어도 돼요 / -(으)면 안 돼요 | Ch 9 | Ch 9 |
| 32 | -(으)세요 / -지 마세요 commands | Ch 9 | Ch 9 |
| 33 | Relative clauses -는/-(으)ㄴ N | Ch 10 | Ch 10 |
| 34 | -(으)ㄹ 때 | Ch 10 | Ch 10 |
| 35 | -아/어 봤어요 experience | Ch 10 | Ch 10 |
| 36 | -는 것 nominalization | Ch 10 | Ch 11 |
| 37 | -(으)려고 해요 / -(으)ㄹ게요 | Ch 11 | Ch 11 |
| 38 | -기 전에 / -(으)ㄴ 후에 | Ch 11 | Ch 11 |
| 39 | 합니다 formal style | Ch 11 | Ch 12 (recognition-heavy) |
| 40 | -다고 해요 reported (intro) | Ch 11 | recognition only |
| 41 | 반말 awareness | Ch 12 | recognition only |

## Vocabulary Progression (cumulative targets)

| After | New | Cumulative | Domains completed |
| --- | --- | --- | --- |
| Ch 1 | 60 | 60 | Hangul anchors |
| Trail 1 + Ch 2 | 120 | 180 | Identity, objects, basic verbs |
| Trail 2 + Ch 3 | 180 | 360 | Position, nature I, **numbers, money, food I, colors** |
| Ch 4 | 110 | 470 | **Time**, daily routine |
| Ch 5 | 120 | 590 | **Family**, **animals**, **housing I**, adjectives I |
| Ch 6 | 150 | 740 | **Food II/restaurant**, cooking |
| Ch 7 | 130 | 870 | **Travel/transport**, places |
| Ch 8 | 150 | 1,020 | **School**, **work**, **technology I** |
| Ch 9 | 130 | 1,150 | **Health/body**, feelings |
| Ch 10 | 150 | 1,300 | **Hobbies**, **nature II/seasons** |
| Ch 11 | 140 | 1,440 | Airport, **technology II**, countries |
| Ch 12 + side content | 360+ | **1,800 core / 3,000 incl. recognition** | **Daily life** integration |

Recognition vocabulary (heard/read in dialogue, tracked as "seen" in the Word Dictionary) is expected to roughly double the mastered core — total exposure ≈ 3,000+ words, matching the project goal.

## Pronunciation-Rule Curriculum

| Rule | Where taught | Vehicle |
| --- | --- | --- |
| Syllable structure, batchim sounds | Ch 1 | School + Final Sound House |
| Linking (연음) | Ch 2 | Name City registry (이름이…) |
| Compound vowels | Trail 2 | Mirror Shrine |
| Tensification (after stops) | Ch 3, 6 | Market compounds; 먹고 |
| Nasalization | Ch 4 | Clocktower chimes mini-game |
| Palatalization (같이) | Ch 6 | Recipe steps |
| ㄹ assimilation (신라) | Ch 7 | Station-name announcements |
| ㅎ weakening / aspiration merge | Ch 9 | Clinic phrases (좋아요, 입학) |
| Formal-style rhythm | Ch 11 | Airport announcements |
