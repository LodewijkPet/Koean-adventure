# Town 1 Hangul Basics Plan

This document is the clean working plan for improving the first town into the Chapter 1 Hangul basics area.

Use this file as the source of truth for the next implementation passes. Keep older broad brainstorming in `docs/plan.md`, but do not scatter new Town 1 decisions across multiple temporary files unless a task truly needs a separate technical note.

## Current State

Town 1 now has:

- A playable outdoor map with houses, NPCs, fountain practice, and route links.
- An elementary school building in the northwest part of town.
- In-memory Town 1 progress flags and quest-level tracking.
- In-memory Hangul dictionary tracking for seen items, answer attempts, streaks, and mastered items.
- A compact quest/status readout in the existing info panel.
- Progress-aware school interactions for the wall maps, teacher intro, desks, fountain, and blackboard.
- Randomized levelled Town 1 drills for basic vowel romanization, basic consonant names, first open syllables, aspirated consonants, double consonants, batchim examples, and blackboard checks.
- A Hangul Dictionary menu screen that shows encountered Hangul items and mastery state by category.
- Aspirated consonants and double consonants in the school sequence, while batchim moves to a separate Final Sound House converted from the current Rival Guesthouse.
- Final Sound House batchim theory for first final `ㄴ` and starter double-batchim examples, with fountain practice levels.
- A classroom interior with:
  - Teacher NPC.
  - Three student NPCs.
  - Blackboard.
  - Basic consonant wall map.
  - Basic vowel wall map.
  - Bookshelves.
  - Student desks with books.
  - Walkable seats.
- Study-board overlays for the vowel/consonant maps, aspirated and double-consonant books, and Final Sound House batchim notes.

The current school now has the first clean quest and mastery loop through the full basic consonant alphabet. The next work should deepen the content rather than replace the structure: improve feedback, add the later Town 1 badge exam, and decide whether compound vowels belong in Town 1 or a later chapter.

## Chapter 1 Learning Goal

Town 1 should teach the player how to read the basics of Hangul before asking for broader Korean meaning.

By the end of Town 1, the player should be able to:

- Recognize the basic vowels.
- Recognize the basic consonants.
- Match letters to basic romanized sound names.
- Understand that Hangul letters combine into syllable blocks.
- Recognize simple open syllables such as `가`, `나`, `다`, `마`.
- Recognize aspirated consonants such as `ㅋ`, `ㅌ`, `ㅍ`, and `ㅊ` as related to base consonants plus an `ㅎ` breath sound.
- Recognize double consonants such as `ㄲ`, `ㄸ`, `ㅃ`, `ㅆ`, and `ㅉ` as doubled/tense signs related to familiar base consonants.
- Understand first batchim as a consonant placed under a syllable block.
- Prepare for double-batchim and sentence-block work without mixing those topics too early.

The first town should stay focused. Do not add sentence grammar, object labels, actions, counters, or honorific complexity to this town until the basic Hangul-reading loop is stable.

## Town 1 Quest Shape

Town 1 needs a quest list instead of isolated drills.

Use quests because they feel more game-like than a checklist, but implement them as simple structured progress data first.

Suggested first quests:

| Quest | Theory | Practice | Exam |
| --- | --- | --- | --- |
| Basic Vowels | Inspect vowel wall map and talk to a student. | Fountain vowel romanization level 1. | Blackboard vowel check. |
| Basic Consonants | Inspect consonant wall map and talk to the teacher. | Fountain consonant romanization level 1. | Blackboard consonant check. |
| First Syllables | Read a short student workbook/table note. | Combine consonant + vowel at classroom desks. | Small school blackboard test. |
| Aspirated Consonants | Talk to Teacher Seo and read the aspirated consonant book. | Fountain aspirated-sign level. | Blackboard aspirated check. |
| Double Consonants | Talk to Teacher Seo and read the double-consonant book. | Fountain double-consonant level. | Blackboard double-consonant check. |
| First Batchim | Visit the Final Sound House and read the final-sound note. | Fountain single-batchim level. | Later Final Sound House check. |
| Double Batchim | Talk to the second learner in the Final Sound House and read the double-final note. | Fountain double-batchim level. | Later Final Sound House check. |
| Town 1 Reading Badge | Review maps, aspirated signs, and final sounds. | Mixed fountain review. | Future gym/final test location. |

Each quest should have three phases:

- Theory: player reads, listens, inspects, or talks.
- Practice: player can repeat low-pressure drills.
- Exam: player proves mastery and unlocks the next level.

Do not make the first pass too stateful. Add the data model first, then connect one or two visible quest steps.

## Progress And Unlocks

The first progress-system pass is implemented. It uses in-memory flags plus quest-level storage:

Suggested shape:

```js
const progress = {
  flags: new Set(),
  questLevels: {},
};
```

Possible flags:

| Flag | Set by | Use |
| --- | --- | --- |
| `town1.schoolEntered` | Entering elementary school. | First quest discovery. |
| `town1.vowelMapRead` | Inspecting vowel wall map. | Unlock fountain vowel practice. |
| `town1.consonantMapRead` | Inspecting consonant wall map. | Unlock fountain consonant practice. |
| `town1.teacherIntroDone` | Talking to Teacher Seo. | Unlock classroom blackboard hints. |
| `town1.vowelPracticePassed1` | Fountain vowel romanization level 1. | Unlock vowel level 2. |
| `town1.consonantPracticePassed1` | Fountain consonant romanization level 1. | Unlock consonant level 2. |
| `town1.firstSyllablesPassed` | Blackboard or desk syllable test. | Unlock Town 1 badge exam. |
| `town1.aspiratedIntroDone` | Talking to Teacher Seo after first syllables. | Unlock the aspirated consonant book. |
| `town1.aspiratedBookRead` | Reading the school aspirated consonant book. | Unlock fountain aspirated practice. |
| `town1.aspiratedPracticePassed1` | Fountain aspirated consonant level. | Unlock aspirated blackboard check. |
| `town1.aspiratedExamPassed` | Blackboard aspirated consonant check. | Unlock double-consonant school sequence. |
| `town1.doubleConsonantIntroDone` | Talking to Teacher Seo after the aspirated check. | Unlock the double-consonant book. |
| `town1.doubleConsonantBookRead` | Reading the school double-consonant book. | Unlock fountain double-consonant practice. |
| `town1.doubleConsonantPracticePassed1` | Fountain double-consonant level. | Unlock double-consonant blackboard check. |
| `town1.doubleConsonantExamPassed` | Blackboard double-consonant check. | Unlock Final Sound House batchim sequence. |
| `town1.batchimSingleIntroDone` | Talking to the Final Sound Coach. | Unlock the single-batchim note. |
| `town1.batchimSingleBookRead` | Reading the single-batchim note. | Unlock fountain single-batchim practice. |
| `town1.batchimSinglePracticePassed1` | Fountain single-batchim level. | Unlock double-batchim intro. |
| `town1.batchimDoubleIntroDone` | Talking to the second learner in the Final Sound House. | Unlock the double-batchim note. |
| `town1.batchimDoubleBookRead` | Reading the double-batchim note. | Unlock fountain double-batchim practice. |
| `town1.batchimDoublePracticePassed1` | Fountain double-batchim level. | Unlock later Town 1 badge work. |

Additional first-pass flags now used by the implementation:

| Flag | Set by | Use |
| --- | --- | --- |
| `town1.firstSyllablePracticePassed1` | Classroom desk syllable practice. | Unlock blackboard syllable check. |
| `town1.vowelExamPassed` | Blackboard vowel check. | Advance Basic Vowels quest. |
| `town1.consonantExamPassed` | Blackboard consonant check. | Advance Basic Consonants quest. |

Keep physical map access open. Unlock learning levels and quest steps, not basic movement through the town.

## Exercise Direction

### Fountain Practice

The fountain is now the first progress-gated practice station. Hangul fountain levels are generated from shared item pools instead of fixed question lists. Each run favors unseen or weaker items first, then shuffles prompts and choices so repeat practice covers the full taught set over time.

Next fountain levels:

1. Basic vowels: show a Korean vowel, choose the sound name.
2. Basic consonants: show a Korean consonant, choose the letter name.
3. Open syllables: show a syllable such as `가`, choose `ga`.
4. Aspirated consonants: show `ㄱ + ㅎ`, choose `ㅋ`; show `ㅌ`, choose `t`.
5. Double consonants: show `ㄱ + ㄱ`, choose `ㄲ`; show `ㄸ`, choose the tense/double d sound.
6. Single batchim: show a block such as `간`, identify the bottom consonant and final `n`.
7. Double batchim: show examples such as `앉`, `닭`, and `값`, choose whether the first or second final consonant is used in the taught word.
8. Mixed review: choose between close visual or sound contrasts.

The first fountain update replaced the active Town 1 fountain interaction with romanization-style recognition. It currently runs vowel practice first, then consonant practice after the consonant map flag, then mixed review.

Study boards mark their Hangul items as seen in the Hangul Dictionary. Exercise answers update item attempts, correct counts, streaks, and mastery. An item is currently mastered after three correct answers with an active correct streak.

Examples:

```text
ㅏ -> a
ㅓ -> eo
ㄱ -> giyeok
ㄴ -> nieun
가 -> ga
너 -> neo
```

Use clear feedback that explains the shape, not only the answer.

### Classroom Theory

The school should teach before it tests.

Current classroom interactions:

- Teacher explains how the school sequence works and sets the intro flag.
- Students give short hints about vowels, consonants, and combining.
- Bookshelves open simple theory pages or dialogue.
- Student desks are practice stations for first open syllables after fountain practice.
- Blackboard is the school exam station for vowel, consonant, and first-syllable checks.

The wall maps open study boards and set the matching progress flags.

### Aspirated Consonants

The aspirated consonants should be introduced in the school after the first open-syllable check:

- Teacher Seo explains that `ㅎ` is a breath sound and that some base consonants have stronger aspirated signs.
- The school bookcase opens a small aspirated consonant board:
  - `ㄱ + ㅎ -> ㅋ`
  - `ㄷ + ㅎ -> ㅌ`
  - `ㅂ + ㅎ -> ㅍ`
  - `ㅈ + ㅎ -> ㅊ`
- The fountain then practices recognition of the aspirated signs and their sound names.
- The blackboard can check this once the fountain level is passed.

Do not introduce batchim in the school. Use the school only for the aspirated consonant bridge.

### Double Consonants

The double consonants should also be introduced in the school, after the aspirated consonant check and before batchim:

- Teacher Seo explains that some familiar consonants can be doubled to make tense/double signs.
- A second school bookcase or classroom note opens a small double-consonant board:
  - `ㄱ + ㄱ -> ㄲ`
  - `ㄷ + ㄷ -> ㄸ`
  - `ㅂ + ㅂ -> ㅃ`
  - `ㅅ + ㅅ -> ㅆ`
  - `ㅈ + ㅈ -> ㅉ`
- The fountain then practices recognition of the double signs and their sound names.
- The blackboard checks this once the fountain level is passed.

Treat this as the final school alphabet step. After this check, the player has seen the basic consonants, aspirated consonants, and double consonants before moving to final sounds.

### Final Sound House

Convert the existing Rival Guesthouse into the Final Sound House for batchim learning.

Role:

- This house teaches final consonants outside the classroom so batchim feels like a new location and chapter beat.
- It unlocks after the school has tested aspirated and double consonants.
- The first NPC, the Final Sound Coach, introduces one final consonant first.
- A house note or book explains that batchim is always a consonant placed under a syllable block.
- The fountain provides the repeatable single-batchim drill after the house theory step.
- The second learner introduces double batchim after the single-batchim fountain level.
- A second note explains that double-batchim reading depends on the word; sometimes the first consonant is used, sometimes the second.
- The fountain provides the repeatable double-batchim drill.

Start with `ㄴ` as the first single batchim. Good first examples:

```text
간 -> final ㄴ -> n
문 -> final ㄴ -> n
나 -> no batchim
```

Good early double-batchim examples:

```text
앉 -> ㄵ, taught as first final ㄴ in this word
닭 -> ㄺ, taught as second final ㄱ in this word
값 -> ㅄ, taught as first final ㅂ in this word
```

### Blackboard Exam

The blackboard is now the first exam-style station.

Current checks:

- Vowel check after teacher intro and fountain vowel practice.
- Consonant check after fountain consonant practice.
- Open-syllable check after classroom desk practice.

Later, this can become the final classroom gate before the town gym.

### Gym Or Final Test

Reserve a future exam location for the full Town 1 badge.

The final test should not be the fountain. The fountain is practice. The school blackboard or a later gym-like room should be the real exam.

## UI And Board Work

The study-board overlay is the first reusable theory UI.

Next improvements:

- Make board content data-driven enough for theory pages, not only letter charts.
- Add a clear title, subtitle, and grouped entries for each topic.
- Keep mobile layout readable.
- Avoid long paragraphs inside the board.
- Prefer short examples and tables.
- Keep the Hangul Dictionary as the item/mastery view for encountered Hangul content. Use study boards for theory and drills for mastery changes.

Do not add scrolling UI until it is necessary. Keep each board small enough to fit one screen.

## Correctly Shaping Everything

Before adding lots of content, shape the first-town experience correctly.

This means:

- The physical town layout guides the player naturally from guesthouse to school to fountain.
- Important buildings are visually clear and reachable by road.
- School furniture collision matches what the player expects:
  - Desks, bookshelves, teacher desk, blackboard, and maps block movement.
  - Student seats are walkable.
- NPC placement does not block doors, exams, or narrow paths.
- Every learning object has a clear role: theory, practice, or exam.
- The fountain remains a practice space, not an exam space.
- The blackboard or future gym remains the exam space.
- Quest names, object names, and drill titles use consistent terminology.
- Every visible label exists in `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.
- Each new exercise has a fallback dialogue or non-crashing placeholder.
- Desktop and mobile board layouts are checked after UI changes.
- `node --check .\game.js` is run after JavaScript edits.

Treat this shaping work as part of the feature, not polish after the fact.

## Implementation Order

1. Done: Add progress flags and quest-level storage.
2. Done: Add a simple quest list data structure for Town 1.
3. Done: Set flags when the player inspects wall maps and talks to the teacher.
4. Done: Update the fountain into levelled romanization practice.
5. Done: Add classroom desk practice for simple consonant + vowel combinations.
6. Done: Add blackboard exam checks.
7. Done: Add a compact visible quest/status readout after the data model and interactions work.
8. Done: Add aspirated consonant teacher/book/fountain/blackboard flow.
9. Done: Add double-consonant teacher/book/fountain/blackboard flow.
10. Done: Convert Rival Guesthouse into the Final Sound House for batchim theory.
11. Done: Add fountain practice levels for single and double batchim.
12. Done: Convert Town 1 Hangul exercises to randomized item-pool generation and link study boards/drill answers to the Hangul Dictionary.
13. Next: Revisit map shaping, NPC placement, and the eventual Town 1 badge exam.

## Document Hygiene

Keep the documents clean while the game grows.

- Use this file for Town 1 Hangul basics planning.
- Keep `docs/learning-implementation-plan.md` for the broader drill contract and chapter-level notes.
- Keep `docs/create-*.md` files as reusable implementation guides.
- Keep Town 2 planning in the existing Town 2 files.
- Do not add a new planning file for every small Town 1 task.
- When a temporary plan becomes obsolete, either update it into a clean reference or delete it after the replacement is complete.
- Prefer short sections, tables, and explicit hook names over long brainstorming paragraphs.
- After a feature is implemented, update the relevant plan section from future tense to current state.

## Verification Checklist

For the next implementation pass:

- Town 1 loads without console errors.
- Elementary school can be entered and exited.
- Teacher and three students can be approached.
- Wall maps open the correct study board.
- Fountain levels unlock only after the matching theory step.
- Seats remain walkable.
- Desks and wall objects remain solid.
- Mobile board layout stays readable.
- `node --check .\game.js` passes.
