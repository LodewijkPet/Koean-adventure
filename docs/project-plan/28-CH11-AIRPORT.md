# CH11 — 하늘 공항 신도시 (Sky Airport New City) — STATUS: PLANNED (P4)

**Stream:** CONTENT-CH11 · **Slug:** `town11` (no trail — reached by rail spur from CH7, E8) · **Deps:** E2 (check-in roleplay), A5 (listening path — announcements are the chapter).

## Theme & story

Glass terminal + tech mall + international food court. No badge: this is the **formality and plans** chapter that polishes the player for the League. Pass the check-in roleplay, decode formal announcements, survive the group-chat, build a full itinerary.

## Curriculum allocation (lock)

-(으)려고 해요 intention; -기 전에/-(으)ㄴ 후에 before/after; -(으)ㄹ게요 promises; formal -습니다/-ㅂ니다 (recognition + greetings production); reported -다고 해요 (recognition); phone Korean (여보세요, 잠깐만요, 바꿔 주세요). Categories: `airport`, `tech2`, `countries`, `phone`.

## Layout & stations

Terminal Hall (check-in counters, announcement board, gates), Security corridor (rules review: 돼요/안 돼요 from CH9), Tech Mall (phone shop, charger kiosk), Food Court (world stalls = full food review), Observation deck (plans talk), Business lounge (formal corner).

| Piece | Spec |
| --- | --- |
| **Check-in roleplay** | E2 conversation: passport/ticket Q&A ("여권을 보여 주시겠어요?" recognition; player answers from documents in inventory) `town11CheckIn` |
| **Announcement decoder** | A5 listening: formal announcements spoken ("대한 항공 칠오삼 편… 탑승을 시작하겠습니다") → answer gate/flight/time `town11Announcements`; generated from flight table |
| Itinerary builder | order trip steps with 전에/후에 (E1) `town11Itinerary` |
| Phone booth quests | scripted calls (E2): book a room, confirm pickup `town11Calls` |
| Group-chat board | read a short message thread (다고 해요 reports inside) → comprehension `town11Chat` |
| Tech mall | gadget vocab shop (E3) + SIM-card quest |
| Formal corner | -습니다 transformation practice + greeting set (처음 뵙겠습니다) `town11Formal` |

## Word list (target 140; core)
airport: 공항 비행기(rev) 여권 표(rev) 탑승권 게이트 출국 입국 짐 가방(rev) 세관 면세점 항공사 편 좌석 창가 통로 지연 출발(rev) 도착(rev)
tech: 충전기 배터리 유심 와이파이(rev) 앱 문자 전화(rev) 화면(rev) 사진(rev) 비밀번호 인터넷
countries: 한국(rev) 미국 영국 일본 중국 프랑스 독일 네덜란드 호주 캐나다 나라 외국 외국인
phone/frames: 여보세요 잠깐만요 바꿔 주세요 ~(으)려고 해요 ~기 전에 ~(으)ㄴ 후에 ~(으)ㄹ게요 ~습니다 ~다고 해요

## NPCs (18): terminal guide(resolver), check-in agents ×2, announcer(voice), security officer, tech clerk, SIM kiosk, food-court trio (review pools), lounge formal gentleman, deck dreamers ×2 (plans), pilot+attendant cameo, Haneul family flying out (arc resolution beat), wanderers.

## Quests (~9): arrival · checkIn(2) · announcements(2) · itinerary · phoneCalls(2) · techMall · groupChat · formalCorner.

## Acceptance: announcements never show text before answer (A5); formal items accept 합니다체 only where required; itinerary validates sequence; check-in fails politely on wrong document answer and reteaches.

## P-steps
- [ ] P1 - [ ] P2 - [ ] P3 - [ ] P4 - [ ] P5 - [ ] P6 - [ ] P7 - [ ] P8 - [ ] P9 - [ ] P10 - [ ] P11 - [ ] P12
