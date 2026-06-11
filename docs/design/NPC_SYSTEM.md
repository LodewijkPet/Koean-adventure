# Korea Adventure — NPC System

NPCs are the game's teachers in disguise. This document defines the NPC data model, the speech-leveling rules that keep every line comprehensible, the archetype catalog, and dialogue authoring rules.

## 1. NPC Data Model

Current (implemented - see `npcs` arrays in `src/world/*.js` and `addInteriorNpc` in `src/world/helpers.js`):

```js
{
  nameKey: "npc.town3FruitSeller",     // TEXT key, three languages
  x: 12, y: 9, dir: "down",
  nextTurn: 0,                          // idle look-around timer
  wander: true,                         // optional movement
  kind: "child",                        // optional small sprite
  jacket: "#b5563f",                    // sprite palette
  voiceGender: "female",                // TTS voice selection
  voiceId: "town3FruitSeller",          // stable voice hash (never reuse!)
  conversationKeys: ["npc...line1", "npc...line2"],
  conversationResolver: fn,             // progress-aware dialogue
  progressFlagOnTalk: "town3.x",        // quest hooks
  requiredFlags: [...], lockedConversationKeys: [...],
  drillKey / drillResolver,             // immediate drill (use sparingly — NPC speaks first is better)
}
```

Planned additive fields:

```js
  level: 3,            // chapter whose grammar this NPC's lines may use (see §2)
  archetype: "vendor", // catalog reference (see §3)
  questGiver: "town3.shoppingList",   // journal portrait hookup
  scheduleKey: null,   // future: festival-only NPCs
```

## 2. Speech Leveling (the core rule)

**An NPC's Korean may use only grammar and vocabulary from its `level` chapter or below — plus at most ONE pattern from the next chapter, used so transparently that context translates it.** (The "i+1" rule.)

Mechanics:

- Every NPC declares `level` = the chapter of its home area by default.
- Dialogue keys are reviewed against the `CURRICULUM_MAP.md` inventory for that chapter.
- The one allowed "+1" pattern per NPC must be (a) optional flavor, never quest-critical, and (b) guessable from situation (a baker holding bread saying 빵을 만들었어요 *before* past tense is formally taught — the player sees flour and an oven).
- Earlier-chapter NPCs never retroactively gain later grammar — Town 1 stays readable for a fresh player forever.
- Review NPCs (rival, mentor letters) deliberately mix *all* chapters up to the player's current badge — they are the spiral.

Korean-first delivery (implemented): NPC lines play as Korean TTS first; Space reveals text; hold `T` shows the primary-language translation. This stays the universal contract.

## 3. Archetype Catalog

Archetypes × towns generate hundreds of concrete NPCs. Each archetype defines: pedagogical role, typical lines pattern, drill association, and placement rules. Concrete NPCs are instances (unique name, palette, voiceId, level).

### 3.1 Teaching Cast (one per learning unit)

| Archetype | Role | Example instances |
| --- | --- | --- |
| **Teacher (선생님)** | introduces theory, gates sequence | Seo (T1 school), abacus master (Ch3), watchmaker (Ch4), head chef (Ch6), professor (Ch8), doctor (Ch9) |
| **Coach** | guards one sub-skill outside school | Final Sound Coach (T1), counter coach (Ch3), transfer guide (Ch7) |
| **Student/learner peer** | models mistakes + hints, low-pressure review | rival student (T1), desk students, abacus pupils |
| **Examiner** | runs the exam archetype | blackboard (object) + City Hall attendants (T2), guild examiner (Ch3) |
| **Mentor (recurring)** | letters = scheduled review reading | Teacher Seo across all chapters |
| **Rival (recurring)** | review duels at each badge town | the guidebook traveler from T1's guesthouse |

### 3.2 Commerce Cast

| Archetype | Teaches | Instances |
| --- | --- | --- |
| **Stall vendor** | item vocab, prices, counters | fruit/veg/fish/cloth sellers (Ch3), night-market vendors (Ch6) |
| **Shopkeeper** | shop frames (찾으세요? 있어요/없어요) | corner market clerk (T1), pharmacy (Ch9), phone shop (Ch11) |
| **Cashier** | numbers fast, 원, receipts | everywhere money moves |
| **Customer (browsing)** | overheard model sentences | market crowds — ambient i-level input |
| **Haggler** | adjectives 싸요/비싸요, 깎아 주세요 | Ch3 specialty |

### 3.3 Food Cast

waiter, cook, street-food ajumma, barista, baker, picky eater, food critic (taste adjectives), drunk regular (Ch12 반말 awareness, harmless).

### 3.4 Family & Village Cast

grandmother/grandfather (honorific targets), parents, older/younger siblings (the 형/오빠/누나/언니 matrix — four instances per family), baby (single-word utterances = easiest listening), neighbor ajumma (gossip = past tense), pet owner, farmer.

### 3.5 Transit Cast

ticket clerk, conductor, station announcer (formal style voice), taxi driver, bus driver, lost tourist (the player gives directions), commuter, harbor master, pilot/flight attendant (Ch11), customs officer.

### 3.6 Civic & Health Cast

mayor/leader (badge ceremonies), receptionist, librarian, museum curator, police officer (lost-and-found chains), postal worker (address reading), nurse, doctor, pharmacist, jjimjilbang attendant, lifeguard.

### 3.7 Campus & Work Cast

professor, TA, club recruiter (comparisons), librarian of the tower (multi-floor reading), office worker (schedule talk), job-board manager, IT helper (tech vocab).

### 3.8 Leisure & Festival Cast

fisher, hiker, photographer (T1's Sora generalizes), noraebang host, festival barker, lantern maker, fortune teller (future tense!), tour guide, monk (quiet wisdom in short sentences).

### 3.9 Children & Animals

kids (short, simple, present tense — free review), playground group (counting games), dogs/cats (onomatopoeia: 멍멍, 야옹 — fun Hangul reading).

### 3.10 Ambient Walkers

Non-quest NPCs with 2 lines of level-appropriate flavor; every town gets 4–8. They make towns alive and are zero-pressure listening practice.

Catalog math: ~40 archetypes × 12 chapters of instances ≈ **300+ distinct NPCs** at 1.0 (Town 1+2 already ship ~35).

## 4. Dialogue Authoring Rules

1. **Two lines default** (current pattern). Quest NPCs may use resolvers for state-dependent dialogue. Keep each line one sentence.
2. **Level check** against §2 before merge. The Korean line is written *first*; English/Dutch translate the Korean, never vice versa.
3. **Politeness**: NPCs speak 해요체 to the player by default. 합니다체 only for announcers/officials (Ch11+ recognition). 반말 only flagged child-to-child or rival-banter post-Ch12 intro.
4. **Names**: Korean given names from a curated list (민수, 지우, 하나, 서연, 도윤…); romanized only in EN/NL text, never in the KO text.
5. **No meta-teaching in dialogue.** NPCs never say "the topic particle marks…". They *demonstrate*; study boards explain.
6. **Reinforce + seed**: each chapter's NPC set must collectively reuse ≥10 items from each previous chapter (tracked in the chapter content checklist) — this is the ambient SRS.
7. **Voice**: assign `voiceGender` + unique `voiceId`; recurring characters keep their voiceId across scenes (voice = identity).
8. **Drills on objects, words from mouths**: NPCs give context and set flags; nearby objects carry `drillKey` (an NPC with a drill skips its own dialogue — current engine behavior, use only for actor-targets).

## 5. Conversation Challenges (planned drill type)

Branching scripted dialogues where the player *answers* an NPC by choosing among Korean responses (no English in choices). Wrong choices get an in-fiction gentle correction line and a retry; success can set flags. Implementation: new drill step shape `{ npcLineKey, choices, answer, replyKeys }` rendered in the dialog box rather than the drill overlay — see ROADMAP M6.
