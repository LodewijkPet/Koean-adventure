# CH8 — 책산 캠퍼스 (Bookmountain Campus) + Trail 7 — STATUS: PLANNED

**Stream:** CONTENT-CH8 · **Slug:** `town8`, `trail7` · **Files:** `src/world/trail7.js`, `src/world/town8.js`, `data/drills/town-8.js`.
**Engine deps:** E1 builder assumed live by P3 (connected-sentence chapter NEEDS ordering); E9 typed input debuts here (optional steps); E10 pattern log backfill.

## Theme & story

University town: quad, lecture halls, the seven-floor Library Tower, club fair, dorms, a small office district. Professor Jian's seminar only admits students who can *connect* sentences — reasons, contrasts, comparisons. Climb the Tower (one floor per connector), survive the Club Fair comparison gauntlet, earn the **Study Badge (공부 배지)**.

## Curriculum allocation (lock)

-고 (sequence/and); -지만 (but); -아/어서 + -(으)니까 (reasons, nuance light); -고 있어요 (progressive); -아/어야 해요 (obligation); 보다/더/제일 (comparison); 무슨/어떤/어느. Categories: `school`, `work`, `stationery`, `tech1`.

## Trail 7 — 책 고개 (Book Pass) (34×54)

Hikers describe routes in -고 chains ("산에 가고, 물을 마시고, 쉬어요") → `trail7Chains` (order the chain — E1; stand-in: pick correct chain); contrast stones -지만 ("높지만 좋아요") `trail7But`; progressive lookout: spot what NPCs are doing now (-고 있어요) `trail7Doing` (actor-matching like Town2 action park, richer).

## Campus map (50×40)

Quad center (club fair tents seasonal/E11-lite always-on), Lecture Hall W, LIBRARY TOWER N (gym), Cafe, Dorms E, Office Annex SE, gates: S(trail7), E(trail8).

## Stations & interiors

| Place | Stations |
| --- | --- |
| Lecture Hall | boards: `connectors` (-고/-지만), `reasons` (-아/어서 vs -(으)니까 usage table), `obligation`, `comparison`; seminar desks generated practice; blackboard exams ×2 |
| Library Tower (gym) | **7-floor climb**: each floor one challenge room (F1 -고 chain build · F2 -지만 pairs · F3 reason match Q→because · F4 progressive listening · F5 must-do sorting (해야 해요) · F6 comparisons (더/제일 ranking) · F7 mixed). Leader Jian at top; badge exam `town8StudyBadge` (mixed 8 pass 7, builder steps included); floors gate by flags `town8.floorN` |
| Club Fair (quad) | **comparison gauntlet minigame** `town8ClubFair`: clubs pitch ("우리 동아리가 제일 재미있어요!"); ranking tasks (which is 더 X?); join-a-club flavor reward (pin item E3) |
| Cafe | excuse engine `town8Excuses`: pick valid reason sentences for scenarios (왜 늦었어요? → 버스가 안 와서 늦었어요) |
| Dorms | roommate tasks: obligation list (`town8MustDo`: 청소해야 해요…) + progressive peek (what is roommate doing) |
| Office Annex | job board matching `town8Jobs`: abilities (CH7 review: 할 수 있어요) → job cards; work-vocab seeding |
| Quad kiosk | review echo `town8Review`; typed-input debut booth `town8Typing` (E9: type 5 known words; optional, rewards won) |

## NPC roster (21)
greeter, quad guide(resolver), Jian(leader), lecturer + TA, 7 floor wardens (light resolvers, one line each + drill), club recruiters ×3 (pools: each claims superiority — comparison ambient), barista, dorm RA + roommate, office manager, job-board clerk, typist mentor, rival R7 spot, wanderers ×2.

## Drills summary
trail7Chains/But/Doing · connector/reason/obligation/comparison practices + 2 exams · floor drills F1–F7 · town8ClubFair · town8Excuses · town8MustDo · town8Jobs · town8Typing (E9) · town8Review · town8StudyBadge.

## Quests (~12 whereKeyed)
trail7×3 · arrival · lectures(4 mini-quests, one per pattern family) · towerClimb (7 steps, collapsed to 4 journal steps) · clubFair · excuses · dormDuties · jobBoard · studyBadge.

## Word list (target 150; core)
school: 학교(rev) 대학교 수업 강의 교수 교실 시험 숙제 공부(rev) 책상(rev) 칠판(rev) 도서관 동아리 학기 방학 졸업 전공 질문 대답 발표
work: 회사 사무실 회의 일(rev) 직원 사장(rev) 월급 서류 명함 출근 퇴근 바빠요 한가해요
stationery/tech: 연필 펜 공책 지우개 가위 풀 컴퓨터 노트북 핸드폰 이메일 프린터 와이파이(seed) 화면 키보드
adjectives/adverbs: 쉬워요 어려워요 재미있어요 재미없어요 빨라요 느려요 더 제일 가장 진짜 아주(rev) 너무
frames: ~고 ~지만 ~아/어서 ~(으)니까 ~고 있어요 ~아/어야 해요 보다

## Narrative hooks
R7 library contest (제일 duel) · L7 reasons letter · pattern-log backfill rows for E10 here.

## Music
`town8`→Town1.mp3 fallback; `trail7`→Trail2.mp3.

## Upgrade pass
E9: typing booth expands to exam-optional steps. E1 native everywhere stand-ins remain.

## Acceptance beats
Tower floors strictly sequential; reason-nuance items never punish 아/어서 vs 니까 ambiguity (both accepted where natural — distractors are wrong-MEANING not wrong-nuance); comparison ranking randomizes club stats; typed booth composes 받침 correctly.

## P-step checklist
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
