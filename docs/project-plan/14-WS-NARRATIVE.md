# WS-NARRATIVE — story, intro, rival, mentor, leaders, League (N1–N6)

**Owns:** `data/story/*.js` packs (text + story/conversation/letter registrations). Engine features consumed: E4 cutscenes, E2 conversations, E5 duels, E6 letters. Until merged, scripts ship as docs here + pack text keys (safe), wiring rows handed to consumers.

Tone rules: warm, lightly funny, never condescending; the world takes the player seriously as a learner. NPCs never mock mistakes; the rival teases himself more than you. Korean lines obey chapter leveling; story meta-lines (rare) may lean on EN/NL.

## Cast (canonical names, voices)

| Character | Korean | Role | Voice |
| --- | --- | --- | --- |
| Player | 여행자 (default; named in intro) | you | — |
| Rival | 준호 (Junho) | fellow traveler, one step ahead, guidebook addict | male, energetic |
| Mentor | 서연 선생님 (Teacher Seo) | Town1 teacher; letters | female, calm |
| Lost child | 하늘이 (Haneul) | recurring side arc (T2 → CH4 → CH7 → capital cameo) | child |
| Ch4 leader | 시계방 장인 도윤 (Watchmaker Doyun) | Clock Badge | male, precise |
| Ch5 leader | 큰할머니 복순 (Great-Grandma Boksun) | Family Badge | elder female |
| Ch6 leader | 주방장 태오 (Head Chef Taeo) | Taste Badge | male, booming |
| Ch7 leader | 역장 미래 (Stationmaster Mirae) | Travel Badge | female, brisk |
| Ch8 leader | 교수 지안 (Professor Jian) | Study Badge | female, dry wit |
| Ch9 leader | 의사 선우 (Doctor Sunwoo) | Health Badge | male, gentle |
| League chair | 연맹장 한별 (Chair Hanbyeol) | League finale | female, grand |

- [ ] N0.1 Register cast voiceIds/looks table with ART R3.2 + AUDIO A4.1 (rows in their docs).

## N1 — Game intro (with E4) — full script spec

Beats (each = cutscene step; KO line first, ~12 lines total):
1. Black → waves sound → ferry deck at dawn (bg `ferry` panorama by ART). Caption: 한국도 — Hanguk-do.
2. Seo (voiceover): "한국어를 배우고 싶어요?" … welcome lines (2).
3. Name entry (E9/E4): "이름이 뭐예요?" → keyboard; default 여행자.
4. Ferry horn; dock at Haneul Town beach; Seo on pier: two lines pointing to guesthouse + school; sets `intro.done`, quest toast fires; player control at guesthouse bed (existing spawn).
5. Skip rule: after `intro.done` exists in any save, title offers skip.
- [ ] N1.1 Write full trilingual script (≤14 keys) in `data/story/intro.js`.
- [ ] N1.2 Wire with E4; verify TTS voices; smoke path test (E4.4 covers).

## N2 — Rival arc (per-chapter scenes + duels with E5)

Junho pattern: arrives moments before you, botches one thing charmingly, duels you at the badge town AFTER you earn the badge (optional, rewards won + bragging lines), each duel pool = both chapters' weak items.

| # | Where | Scene beat | Duel pool |
| --- | --- | --- | --- |
| R1 | Town2 plaza (retrofit) | misreads a label (그건/저건 mixup) | ch1–2 |
| R2 | Town3 guild steps | bought 10 apples meaning 1 (하나/열) | numbers |
| R3 | CH4 clocktower | overslept: past tense confession | time/past |
| R4 | CH5 feast | seated wrong by age; honorifics save him | family |
| R5 | CH6 restaurant | ordered 안 매워요 but got 아주 매워요 | food/negation |
| R6 | CH7 platform | wrong train; future-tense vow | transport |
| R7 | CH8 library | comparison contest (제일!) | connectors |
| R8 | CH9 clinic | overdid jjimjilbang; conditions lecture | health |
| RL | League lobby | final duel BEFORE the League doors | all chapters |

- [ ] N2.1–N2.9 one checkbox per scene: script (6–10 trilingual lines) + duel registration + handoff row to chapter owner for placement coords.

## N3 — Mentor letters (with E6) — schedule + samples

One letter after each badge; each recycles that chapter's grammar + seeds the next.

| Letter | After | Content sketch | Comprehension Qs |
| --- | --- | --- | --- |
| L1 | First Words | congrats; "시장에서 뭐가 싸요?" teaser | 3 |
| L2 | Number | she bought 사과 다섯 개; asks what you bought | 3 |
| L3 | Clock | her daily schedule (past tense diary) | 4 |
| L4 | Family | her grandmother story (honorifics) | 4 |
| L5 | Taste | recipe she tried; 만들고 싶어요? | 4 |
| L6 | Travel | trip plan (future) + ticket stub enclosed | 4 |
| L7 | Study | why she became a teacher (reasons) | 5 |
| L8 | Health | get-well wisdom (conditions) + League invitation | 5 |

- [ ] N3.1 Write L1–L2 now (P2), rest with their phases; each = pages keys + a 3–5 step drill in the story pack.

## N4 — Lost-child arc (하늘이)

T2 key quest already ships her spiritually; formalize: CH4 she lost her *schedule* (time reading task), CH7 wrong platform (directions task), Capital cameo: she guides YOU one street. Each: 4–6 lines + one task hook in chapter packs (rows to owners).
- [ ] N4.1 Scripts ×3 + handoff rows.

## N5 — League finale + ending + credits (with CH12 owner)

- Structure: League lobby (badge check ceremony, 8 pedestals light) → Junho duel RL → 4 League Rooms (listening / reading / conversation / mixed-production gauntlets, generated weakness-weighted) → Chair Hanbyeol's "Day in Korean" trial (E12 generator, special day) → victory hall: Seo + Junho + leaders cameo lines → ending cutscene (ferry full-circle: you greet a NEW confused traveler — in Korean) → credits roll (contributors, track list from A6.2, "당신의 한국어 여행은 계속됩니다").
- [ ] N5.1 League scripts (~40 lines), ending (~12), credits data.
- [ ] N5.2 Post-credits: unlock E13 toggles + west-region teaser line.

## N6 — Flavor pass library

Reusable pool lines for ambient archetypes (vendor/kid/elder/commuter × 4 chapters each) so chapter owners pull instead of invent — keeps voice consistent.
- [ ] N6.1 60-line trilingual pool table in `data/story/flavor.js` (keys `story.flavor.<archetype>.<n>`), documented mapping.
