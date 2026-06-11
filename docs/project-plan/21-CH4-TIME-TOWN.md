# CH4 — 시간 마을 (Time Town) + Trail 3 — STATUS: PLANNED

**Stream:** CONTENT-CH4 · **Slug:** `town4`, `trail3` · **Files:** `src/world/trail3.js`, `src/world/town4.js`, `data/drills/town-4.js`, story hooks per N-rows.
**Engine deps:** none hard. Nice: E1 (builder exams), E5 (duel R3), E6 (letter L3). Stand-ins ok.

## Theme & story

The clocktower broke and the whole town runs late; nobody agrees what time anything happened. The Watchmaker (leader 도윤) restores the tower only when someone can *talk about time and the past* — the player interviews witnesses (past tense!), rebuilds the schedule board, and wins the **Clock Badge (시계 배지)**. Lost-child Haneul appears having lost her day-schedule (N4 hook).

## Curriculum allocation (lock list for Q1.5)

From CURRICULUM_MAP CH4: time 시/분 (native hours + sino minutes), 요일, dates 월/일, 오늘/어제/내일, particle 에 (time), 부터/까지 (intro), **past tense 았/었어요**, question 언제. Allowed word categories: `time`, `daysMonths`, `dailyVerbs` (+ review: all earlier).
Pronunciation event: nasalization chimes (십만→심만 style pairs) at the tower.

## Trail 3 — 시계 고개 (Clock Pass) (34×54, musicKey `trail3`)

Linear corridor teaching the time-reading mechanics before town:
- **Sundial Shrine** (soundFountain object): study board `clockHours` (한 시…열두 시) → generated drill `trail3Hours` (clock glyph "3:00" → 세 시; both directions). Flags `trail3.hoursBoardRead`, `trail3.hoursPassed`.
- **Minute Stones**: board `clockMinutes` (오 분…삼십 분=반) → `trail3Minutes` generated (compose 시+분: "2:30" → 두 시 반 / 두 시 삼십 분 accepted as separate choices).
- **Yesterday Camp**: two hikers speak past-tense pairs (먹어요→먹었어요) — sign drill `trail3PastIntro` (match present→past, 5 static + builder TODO(E1)).
- Exits: south→town3 north gate (badge-gated there already), north→town4 south gate.

## Town map sketch (48×38)

```
        N gate (trail4, badge-gated)
   ┌─────────────────────────────────────┐
   │ Watch School      CLOCKTOWER  Diary │   clocktower = leader gym (style: clocktower)
   │ (theory+exams)      PLAZA     House │
   │        Schedule Board ▣             │
   │ W gate─ Morning Market   Stationery │
   │           Guesthouse   Clock Cafe   │
   └───────────S gate (trail3)───────────┘
```

## Buildings & interiors

| Building | Interior | Stations |
| --- | --- | --- |
| Watch School (school archetype) | 20×14 | boards: `daysOfWeek`(월~일), `datesMonths`(1월~12월, 일 counter), `pastTense`(았/었 rule chart); desks: generated practice resolver (days→dates→past); blackboard: exams `town4DaysExam`, `town4PastExam` |
| Clocktower (gym) | 18×12, clock face wall | leader Doyun resolver; **badge exam** `town4ClockBadge` (mixed: read clock, date, past sentence, schedule line; passCorrectCount 6/7) at podium; broken-gear flavor objects (nasalization chime drill `town4Chimes` on the bell: 십육→[심뉵] recognize-the-sound pairs) |
| Diary House | 14×10 | grandma's diary book objects → `town4Diary` drill (read past-tense diary lines, answer what/when); progress: diary pages unlock with past-practice flag |
| Morning Market | 12×10 | routine sellers; review-echo board `town4Review` (generated: all previous categories + time) |
| Clock Cafe | 14×10 | barista; `town4CafeTimes` drill: "몇 시에 문을 열어요?" read opening-hours sign |
| Guesthouse | 12×9 | bed (letter L3 trigger), host |

## Schedule Board minigame (signature, plaza ▣)

Restore the town schedule: 6 event cards (시장 8:00, 학교 9:00, …) shuffled; prompt speaks/shows "시장은 여덟 시부터예요" → player places card on the correct row (choice-based stand-in: pick the time slot per event; E1 upgrade: order full board). Pass flag `town4.schedulePassed`. Drill `town4ScheduleBoard`, static 6 steps + extras (stepCount 6 of 9).

## Stopped Clock investigation (quest chain)

Interview 5 witnesses (각자 past-tense alibi: "저는 아홉 시에 빵을 먹었어요") → clipboard interactable assembles statements → find contradiction (two claim same time/place) → confront → tower gear found → leader unlocks exam. Flags: `town4.caseStarted`, 5× `town4.witnessN`, `town4.caseSolved`. Drill `town4CaseBoard` checks comprehension of each statement (who/when/what).

## NPC roster (18)

| NPC | Role | Talk |
| --- | --- | --- |
| gateGreeter | arrival flag | pools×2 |
| plazaGuide | chapterGuideLines("town4") | resolver |
| watchmakerDoyun | leader | resolver (intro/ready/done) |
| schoolTeacher | theory intro | resolver + pools |
| pupilA/B | hints (한 시 vs 일 시!) | pools×2 each |
| diaryGrandma | diary quest | resolver |
| witnesses ×5 (baker, fisher, kid, postman, cafe regular) | investigation | resolver each (statement → after-solved line) |
| marketSellerA/B | routine verbs ambient | pools×2 |
| barista | cafe | pools×2 |
| haneulChild | N4 arc | resolver |
| stationeryClerk | sells notebooks (E3 later) | pools×2, TODO(E3) shop |
| residentWander | flavor | pools×2 |

## Drills summary

| Key | Type | Teaches | Flags |
| --- | --- | --- | --- |
| trail3Hours / trail3Minutes | generated both-directions | clock reading | trail3.* |
| trail3PastIntro | static 8 (pick 5) | 아요→았어요 pairs | trail3.pastIntroPassed |
| town4DaysDates (desks) | generated | 요일/날짜 | town4.daysPracticed |
| town4DaysExam / town4PastExam | generated exams | — | town4.*ExamPassed |
| town4ScheduleBoard | minigame static | 부터/에 + times | town4.schedulePassed |
| town4Diary | static 10 (pick 6) | past reading | town4.diaryPassed |
| town4CaseBoard | static per witness | past comprehension | town4.caseSolved |
| town4Chimes | static pairs | nasalization | town4.chimesHeard |
| town4Review | generated echo | all prior | — |
| town4ClockBadge | exam mixed | chapter | town4.clockBadgePassed |

## Quests (register chapter `town4`, journal title `journal.chapter.town4`)

| Quest | Steps (flag → where) |
| --- | --- |
| trail3Clockwork | hoursBoardRead→trail3 · hoursPassed→trail3 · minutesPassed→trail3 |
| town4Arrival | arrived→town4 |
| town4SchoolTime | days theory→school · practice→school · daysExam→school |
| town4Yesterday | past theory→school · pastPractice→school · pastExam→school |
| town4Schedule | scheduleRead→plaza · schedulePassed→plaza |
| town4DiaryQuest | diaryStarted→DiaryHouse · diaryPassed→DiaryHouse |
| town4StoppedClock | caseStarted→tower · witness1..5 (collapsed 2 steps) · caseSolved→tower |
| town4CafeHours | cafeTimes→cafe |
| town4ClockBadgeQ | badge→tower |

## Word list (target 110; core 70 below, fill rest in P2 from domains)

time: 시간 시 분 반 오전 오후 아침 점심 저녁 밤 오늘 어제 내일 지금 언제 매일 주말 평일 시계 달력 일정 약속
days/months: 요일 월요일 화요일 수요일 목요일 금요일 토요일 일요일 월 일 년 주 1월~12월(12 entries) 생일 날짜
daily verbs (과거형 taught on these): 일어나요 자요 씻어요 시작해요 끝나요 만나요 기다려요 도착해요 출발해요 공부해요 일해요 쉬어요 열어요 닫아요
misc: 종 시계탑 수첩 편지 다이어리

## Narrative hooks (from 14-WS)
- Rival R3 at clocktower steps (duel pool time/past, TODO(E5) stand-in mixed drill `town4RivalDuel`).
- Letter L3 trigger on badge (TODO(E6)).
- Haneul schedule task: read her crumpled schedule (3-step drill) → `town4.haneulHelped`.

## Music
`trail3`→Trail2.mp3 fallback; `town4`→Town2.mp3 fallback (A1 owns real tracks). Register keys in world file.

## Upgrade pass (post-engine)
| TODO | Replace with |
| --- | --- |
| E1 | builder steps in PastExam + ScheduleBoard ordering |
| E3 | stationery shop real purchases |
| E5 | town4RivalDuel → duel system |
| E6 | L3 letter delivery |

## Acceptance beats (Q2 additions)
Clock reads correctly both directions ×3 random; schedule completes; all 5 witnesses → case solves only after all; badge gates trail4; diary pages flag-locked until past practice; nasalization drill plays pairs.

## P-step checklist
- [ ] P1 … - [ ] P2 … - [ ] P3 … - [ ] P4 … - [ ] P5 … - [ ] P6 … - [ ] P7 … - [ ] P8 … - [ ] P9 … - [ ] P10 … - [ ] P11 … - [ ] P12
