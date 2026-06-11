# CH9 — 바다 병원 마을 (Seaside Hospital Town) + Trail 8 — STATUS: PLANNED

**Stream:** CONTENT-CH9 · **Slug:** `town9`, `trail8` · **Files:** `src/world/trail8.js`, `src/world/town9.js`, `data/drills/town-9.js`.
**Engine deps:** E2 conversations strongly desired (doctor consultations). 8th badge → CAPITAL FERRY opens (gate logic here).

## Theme & story

A calm coastal wellness town — clinic, pharmacy, jjimjilbang, lighthouse. Doctor Sunwoo certifies travelers who can *describe symptoms, follow medical instructions, and use if-sentences*. Triage the waiting room, read dosages, learn bathhouse rules, run the lighthouse give-receive relay — earn the final **Health Badge (건강 배지)**, opening the ferry to the Capital.

## Curriculum allocation (lock)

Body/symptoms (아파요 frame: N이/가 아파요; 감기에 걸렸어요); duration 동안; **-(으)면** conditions; 주다/받다/드리다 (+한테/에게/께); permission -아/어도 돼요; prohibition -(으)면 안 돼요; doctor's orders -(으)세요/-지 마세요. Categories: `body`, `health`, `feelings`, `weatherBasic`.
Pronunciation: ㅎ weakening (좋아요→[조아요]), aspiration merge (입학→[이팍]) at clinic phrase corner.

## Trail 8 — 해안 도로 (Coast Road) (34×54)

Weather small-talk posts (비가 와요/바람이 불어요 + feelings 추워요/더워요) `trail8Weather`; condition arches: "비가 오면 우산을 써요" cause→effect matching `trail8If`; feelings fisherfolk (기뻐요/슬퍼요/피곤해요) `trail8Feelings`.

## Town map (46×38)

CLINIC N (gym wing attached) · Pharmacy · JJIMJILBANG W · Lighthouse pier S · Ferry Office SE (capital gate) · Guesthouse · gates: W(trail8), ferry SE.

## Stations & interiors

| Place | Stations |
| --- | --- |
| Clinic waiting room | **triage minigame** `town9Triage`: patients state symptoms (TTS) → send to correct room (eye/stomach/cold/bone icons); escalating: duration added ("사흘 동안 머리가 아파요") |
| Consultation room | boards: `bodyMap` (anatomy chart wall — body words), `symptomFrames`, `ifBoard`; doctor conversation `town9Consult` (E2: answer the doctor's questions about your symptoms from picture-card state; stand-in choice drill) |
| Pharmacy | **dosage reading** `town9Dosage`: labels "하루에 세 번, 식후 30분" → answer when/how-many; counts 번 counter; buy meds (E3) |
| Jjimjilbang | etiquette signs: 해도 돼요/하면 안 돼요 sorting `town9Rules` (towel-hat yes! running no!); relax bonus: feelings vocab lounge |
| Lighthouse pier | **give-receive relay** `town9Relay`: chain items between NPCs per spoken instructions (할머니께 드리세요 / 동생한테 주세요) — honorific 드리다 vs 주다 enforced; receive side 받아요 |
| Clinic gym wing | leader Sunwoo resolver; badge exam `town9HealthBadge` (mixed 8 pass 7: triage item, dosage read, if-sentence, relay rule, prohibition) → flag `town9.healthBadgePassed` |
| Ferry Office | gate: requires ALL EIGHT badges (flags check incl. town1 reading-badge backfill row — see Note) → ferry route to Capital registered; locked line teaches "여덟 개" counting recap |
| Guesthouse | bed (L8 = League invitation letter), host |

**Note:** Town1 Reading Badge formalization — CH9 owner files a STATUS row: CONTENT-CH1-polish adds `town1.readingBadgePassed` exam (blackboard final) so the 8-badge count holds: reading, firstWords, numbers, clock, family, taste, travel, study, health = 9? → Design decision recorded: the EIGHT gate badges are firstWords…health; Reading Badge is honorary badge #0 displayed separately. Ferry checks the eight.

## NPC roster (20)
greeter, boardwalk guide(resolver), Sunwoo(leader), nurse(triage host), 6 patients (resolvers w/ symptom scripts, re-randomized per visit), pharmacist, jjimjilbang attendant, towel kid, lighthouse keeper, fisher pair (pools), ferry officer(resolver gate), rival R8, wanderer.

## Drills summary
trail8Weather/If/Feelings · town9Triage · town9Consult · town9Dosage · town9Rules · town9Relay · pronunciation corner `town9Sounds` (좋아요/입학 listening pairs) · town9Review (echo) · town9HealthBadge.

## Quests (~11 whereKeyed)
trail8×3 · arrival · bodyBasics(2) · triageDuty(2) · pharmacyRun · bathhouseRules · lighthouseRelay(2) · consult · healthBadge · ferryGate (badge-count step → capital teaser).

## Word list (target 130; core)
body: 몸 머리(rev) 눈(rev) 코 입 귀 목 어깨 팔 손(rev) 다리 발 배3 무릎 이(tooth) 피부 등
health: 병원(rev) 의사 간호사 약사 약 알약 감기 열 기침 콧물 두통 배탈 상처 주사 처방전 밴드 마스크 휴식 건강
verbs/frames: 아파요 걸렸어요 나았어요 쉬세요 드세요(rev) 바르세요 ~지 마세요 ~아/어도 돼요 ~(으)면 안 돼요 ~(으)면 동안 번(counter) 받아요 줘요(rev) 드려요
feelings: 기뻐요 슬퍼요 화나요 무서워요 피곤해요 졸려요 괜찮아요 아파요(rev)
weather: 날씨 비 눈2 바람 구름 맑아요 흐려요 추워요 더워요 따뜻해요 시원해요 우산

## Narrative hooks
R8 jjimjilbang overdo + duel · L8 = League invitation (gives `league.invited`) · ferry-opening cutscene stub (E4) when 8 badges.

## Music
`town9`→Trail2.mp3 fallback (waves); `trail8`→Trail2.mp3.

## Upgrade pass
E2 native consultations · E3 pharmacy purchases · relay later uses inventory items (E3).

## Acceptance beats
Triage randomizes symptom→room mapping fairly; dosage parses 번/식후 variants; relay rejects 주세요 to elder (teaches 드리세요); prohibition vs permission never ambiguous; ferry refuses at 7 badges with counting line, opens at 8.

## P-step checklist
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
