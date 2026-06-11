# CH7 — 기차역 도시 (Station City) + Trail 6 — STATUS: PLANNED

**Stream:** CONTENT-CH7 · **Slug:** `town7`, `trail6` · **Files:** `src/world/trail6.js`, `src/world/town7.js`, `data/drills/town-7.js`.
**Engine deps:** E8 fast travel is the badge REWARD (chapter playable without; reward note shown). Subway puzzle is content-local.

## Theme & story

The island's grand rail hub: a cathedral station, a 3-line mini-subway, a bus terminal, a harbor. Stationmaster Mirae won't certify a traveler who can't read a timetable, buy the right ticket, and give directions — prove it on a solo trip mission and earn the **Travel Badge (여행 배지)**; reward: the rail network opens (fast travel).

## Curriculum allocation (lock)

Future -(으)ㄹ 거예요; 에서 (action location) vs 에; (으)로 direction/means; 에서~까지; -(으)ㄹ 수 있어요/없어요; 어떻게 가요?; duration 걸려요. Categories: `transport`, `places`, `directions`.
Pronunciation: ㄹ assimilation (신라→[실라]) via station-name announcements.

## Trail 6 — 철길 산책로 (Rail Trail) (34×54)

Decommissioned line walk: future-tense workposts ("내년에 새 기차가 올 거예요") — `trail6Future` generated present→future transforms + intent statements; means-of-transport stones (버스로/기차로/걸어서) `trail6Means`; ability arch: "수영할 수 있어요?" yes/no gate `trail6Ability`.

## City map (50×40)

```
        N: GRAND STATION (gym, style: station)   NE: Harbor
   W gate(trail6)  Timetable Hall  Subway entrances ①②③
        Bus Terminal   Direction Plaza   Rail Museum
        Ticket Office   Guesthouse    E gate(trail7)
```

## Stations & interiors

| Place | Stations |
| --- | --- |
| Timetable Hall | board `timetableReading` (row anatomy: destination/time/platform/price) → `town7Timetable` generated (CH4 time + CH3 price fusion: "부산행은 몇 시예요?" style rows) |
| Ticket Office | **ticket minigame** `town7Tickets`: spoken request ("두 시에 출발하는 표 주세요, 어른 두 장") → pick correct ticket card (destination×time×count; 장 counter introduced) |
| Subway entrances ①②③ | **transfer puzzle**: 3-line map board; prompt "병원역에 어떻게 가요?" → choose route chain (2호선으로 갈아타요 …) `town7Transfer` static 9 pick 5 + generated extension |
| Direction Plaza | lost tourists ×3 (resolvers): give directions by choosing instruction sequences (왼쪽으로 가요 → 사거리에서 직진 …) `town7Directions`; teaches (으)로 |
| Bus Terminal | ability counter: "버스를 탈 수 있어요?" schedule constraints `town7Ability` |
| Rail Museum | reading flavor + ㄹ-assimilation listening corner `town7Announcements` (신라역/설날 pairs spoken) |
| Harbor | future-plans pier: NPCs state plans; review echo `town7Review` |
| Grand Station (gym) | Mirae resolver; **badge = solo trip mission** `town7TravelBadge`: chained steps — read timetable → buy ticket → board right platform (choice) → transfer once → arrive by "time" (3 segments, pass = ≤1 mistake); flag `town7.travelBadgePassed` → fast-travel unlock note (E8) |
| Guesthouse | bed (L6), host |

## NPC roster (21)
greeter, plaza guide(resolver), Mirae(leader), timetable clerk, ticket clerk, 3 lost tourists(resolvers), conductor, museum curator, harbor master, bus driver, 3 commuters (pools, future-plan lines), announcer voice (object), kid trainspotter, rival spot R6, Haneul arc #3 (wrong platform — N4), wanderers ×2.

## Drills summary
trail6Future/Means/Ability · town7Timetable · town7Tickets · town7Transfer · town7Directions · town7Ability · town7Announcements · town7Review · town7TravelBadge (mission). Exams: `town7FutureExam` (school-less chapter: exam lives at Timetable Hall blackboard).

## Quests (~11 whereKeyed)
trail6Tomorrow/Means/CanYou · arrival · timetable(2) · tickets(2) · subway(2) · helpTourists(3 collapsed 2) · harborPlans · announcements · travelBadge.

## Word list (target 130; core)
transport: 기차 지하철 버스 택시 배(rev) 비행기(seed) 자전거 표 역 정류장 터미널 항구 승강장 노선 호선 출구 입구 환승 장(counter)
verbs: 타요 내려요 갈아타요 출발해요(rev) 도착해요(rev) 걸려요 걸어가요 운전해요 기다려요(rev) 예약해요
directions: 직진 사거리 횡단보도 신호등 모퉁이 왼쪽(rev) 오른쪽(rev) 쪽 으로 까지(rev) 에서
places: 병원 학교(rev) 은행 우체국 공원 호텔 시청(rev) 공항(seed) 박물관 서점
future/ability frames: ~(으)ㄹ 거예요 ~(으)ㄹ 수 있어요/없어요 어떻게 얼마나

## Narrative hooks
R6 platform mix-up + duel · L6 ticket-stub letter · Haneul wrong-train rescue task.

## Music
`town7`→Trail1.mp3 fallback (locomotive), `trail6`→Trail2.mp3.

## Upgrade pass
E8: badge completion registers all visited badge-towns as fast-travel nodes; station boards everywhere gain travel UI. E1: direction-sequence ordering native. E5/E6 standard.

## Acceptance beats
Timetable questions randomize rows; ticket minigame rejects wrong count/time; transfer puzzle validates full chains; solo trip fails gracefully and repeats; after badge + E8, fast travel from Town3 station works.

## P-step checklist
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
