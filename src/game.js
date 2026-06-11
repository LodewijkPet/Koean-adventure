const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE = 32;
const WORLD_WIDTH = 42;
const WORLD_HEIGHT = 35;
const UI_FONT = '"Courier New", "Malgun Gothic", "Segoe UI", monospace';

const COLORS = {
  void: "#111217",
  grass: "#8fcf63",
  grassDark: "#6aa94b",
  grassLight: "#b8de78",
  path: "#d9bd7a",
  pathDark: "#b1915d",
  sand: "#e7d49a",
  sandDark: "#c8ad73",
  water: "#3c8dca",
  waterDark: "#2067a0",
  waterLight: "#77c3dc",
  stone: "#87919b",
  stoneDark: "#5e6973",
  hedge: "#3f8f45",
  hedgeDark: "#2c6738",
  trunk: "#805f34",
  roofRed: "#b44f4e",
  roofBlue: "#4f7fb4",
  roofTeal: "#4b9e91",
  roofViolet: "#8466a7",
  wall: "#e4d7aa",
  wallShadow: "#bda876",
  door: "#6e4b2d",
  black: "#151515",
  white: "#fffaf0",
  text: "#242424",
  panel: "#f7f1df",
  panelAccent: "#c04444",
  panelLine: "#63544a",
};

const DIRS = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const keyToDir = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

const LANGUAGES = [
  { code: "en", key: "language.english" },
  { code: "ko", key: "language.korean" },
  { code: "nl", key: "language.dutch" },
];

const MUSIC_TRACKS = {
  intro: "assets/audio/Intro.mp3",
  town1: "assets/audio/Town1.mp3",
  town2: "assets/audio/Town2.mp3",
  town3: "assets/audio/Intro.mp3",
  trail1: "assets/audio/Trail1.mp3",
  trail2: "assets/audio/Trail2.mp3",
};

const musicState = {
  tracks: {},
  currentKey: null,
  unlocked: false,
  volume: 0.45,
};

const TEXT = {
  en: {
    "area.haneulTown": "Haneul Town",
    "direction.down": "Down",
    "direction.left": "Left",
    "direction.right": "Right",
    "direction.up": "Up",
    "game.title": "Korea Adventure",
    "interaction.default": "You interacted with {target}.",
    "language.dutch": "Dutch",
    "language.english": "English",
    "language.korean": "Korean",
    "menu.back": "Back",
    "menu.quit": "Quit Game",
    "menu.return": "Return to Game",
    "menu.settings": "Settings",
    "menu.title": "Menu",
    "npc.joon.line1": "The north road leads to the next district.",
    "npc.joon.line2": "The guides are not ready yet, so I am watching the route marker.",
    "npc.mina.line1": "Welcome to Haneul Town.",
    "npc.mina.line2": "Travelers usually start by visiting the orientation center.",
    "npc.mrHan.line1": "The sea breeze is calm today.",
    "npc.mrHan.line2": "Check the notice board before stepping onto the beach.",
    "npc.sora.line1": "I keep turning around because I am looking for the best photo angle.",
    "npc.sora.line2": "The tea house roof looks good from almost every side.",
    "object.beachNoticeBoard": "Beach Notice Board",
    "object.cornerMarket": "Corner Market",
    "object.cornerMarket.door": "Corner Market Door",
    "object.hanokTeaHouse": "Hanok Tea House",
    "object.hanokTeaHouse.door": "Hanok Tea House Door",
    "object.northRouteMarker": "North Route Marker",
    "object.rivalGuesthouse": "Rival Guesthouse",
    "object.rivalGuesthouse.door": "Rival Guesthouse Door",
    "object.routeNorth": "Route North",
    "object.shoreline": "Shoreline",
    "object.townWelcomeSign": "Town Welcome Sign",
    "object.travelCenter": "Travel Orientation Center",
    "object.travelCenter.door": "Travel Orientation Center Door",
    "object.yourGuesthouse": "Your Guesthouse",
    "object.yourGuesthouse.door": "Your Guesthouse Door",
    "panel.area": "Area",
    "panel.facing": "Facing",
    "panel.primary": "Primary",
    "panel.quest": "Quest",
    "panel.questStep": "Step",
    "panel.secondary": "Secondary",
    "panel.tile": "Tile",
    "quit.message": "Game quit.",
    "quit.subtext": "Open the menu to return.",
    "settings.primary": "Primary Language",
    "settings.secondary": "Secondary Language",
    "settings.title": "Settings",
  },
  ko: {
    "area.haneulTown": "하늘 마을",
    "direction.down": "아래",
    "direction.left": "왼쪽",
    "direction.right": "오른쪽",
    "direction.up": "위",
    "game.title": "코리아 어드벤처",
    "interaction.default": "{target}와 상호작용했습니다.",
    "language.dutch": "네덜란드어",
    "language.english": "영어",
    "language.korean": "한국어",
    "menu.back": "뒤로",
    "menu.quit": "게임 종료",
    "menu.return": "게임으로 돌아가기",
    "menu.settings": "설정",
    "menu.title": "메뉴",
    "npc.joon.line1": "북쪽 길은 다음 구역으로 이어집니다.",
    "npc.joon.line2": "안내원이 아직 준비되지 않아서 길 표지판을 보고 있어요.",
    "npc.mina.line1": "하늘 마을에 오신 것을 환영합니다.",
    "npc.mina.line2": "여행자는 보통 오리엔테이션 센터부터 방문합니다.",
    "npc.mrHan.line1": "오늘은 바닷바람이 잔잔하네요.",
    "npc.mrHan.line2": "해변으로 가기 전에 안내판을 확인하세요.",
    "npc.sora.line1": "가장 좋은 사진 각도를 찾느라 계속 돌아보고 있어요.",
    "npc.sora.line2": "찻집 지붕은 거의 어느 쪽에서 봐도 멋져요.",
    "object.beachNoticeBoard": "해변 안내판",
    "object.cornerMarket": "골목 시장",
    "object.cornerMarket.door": "골목 시장 문",
    "object.hanokTeaHouse": "한옥 찻집",
    "object.hanokTeaHouse.door": "한옥 찻집 문",
    "object.northRouteMarker": "북쪽 길 표지판",
    "object.rivalGuesthouse": "라이벌 게스트하우스",
    "object.rivalGuesthouse.door": "라이벌 게스트하우스 문",
    "object.routeNorth": "북쪽 길",
    "object.shoreline": "해안선",
    "object.townWelcomeSign": "마을 환영 표지판",
    "object.travelCenter": "여행 오리엔테이션 센터",
    "object.travelCenter.door": "여행 오리엔테이션 센터 문",
    "object.yourGuesthouse": "내 게스트하우스",
    "object.yourGuesthouse.door": "내 게스트하우스 문",
    "panel.area": "지역",
    "panel.facing": "방향",
    "panel.primary": "기본",
    "panel.quest": "퀘스트",
    "panel.questStep": "단계",
    "panel.secondary": "보조",
    "panel.tile": "위치",
    "quit.message": "게임을 종료했습니다.",
    "quit.subtext": "메뉴를 열면 돌아갈 수 있습니다.",
    "settings.primary": "기본 언어",
    "settings.secondary": "보조 언어",
    "settings.title": "설정",
  },
  nl: {
    "area.haneulTown": "Haneulstad",
    "direction.down": "Omlaag",
    "direction.left": "Links",
    "direction.right": "Rechts",
    "direction.up": "Omhoog",
    "game.title": "Korea Avontuur",
    "interaction.default": "Je hebt interactie met {target}.",
    "language.dutch": "Nederlands",
    "language.english": "Engels",
    "language.korean": "Koreaans",
    "menu.back": "Terug",
    "menu.quit": "Spel stoppen",
    "menu.return": "Terug naar spel",
    "menu.settings": "Instellingen",
    "menu.title": "Menu",
    "npc.joon.line1": "De noordweg leidt naar het volgende gebied.",
    "npc.joon.line2": "De gidsen zijn nog niet klaar, dus ik let op de routemarkering.",
    "npc.mina.line1": "Welkom in Haneulstad.",
    "npc.mina.line2": "Reizigers beginnen meestal bij het orientatiecentrum.",
    "npc.mrHan.line1": "De zeebries is vandaag rustig.",
    "npc.mrHan.line2": "Bekijk het bord voordat je het strand op gaat.",
    "npc.sora.line1": "Ik draai steeds rond omdat ik de beste fotohoek zoek.",
    "npc.sora.line2": "Het dak van het theehuis ziet er van bijna elke kant goed uit.",
    "object.beachNoticeBoard": "Strandbord",
    "object.cornerMarket": "Hoekmarkt",
    "object.cornerMarket.door": "Deur van de Hoekmarkt",
    "object.hanokTeaHouse": "Hanok Theehuis",
    "object.hanokTeaHouse.door": "Deur van het Hanok Theehuis",
    "object.northRouteMarker": "Noordelijke Routemarkering",
    "object.rivalGuesthouse": "Rivalenpension",
    "object.rivalGuesthouse.door": "Deur van het Rivalenpension",
    "object.routeNorth": "Route Noord",
    "object.shoreline": "Kustlijn",
    "object.townWelcomeSign": "Welkomstbord",
    "object.travelCenter": "Reisorientatiecentrum",
    "object.travelCenter.door": "Deur van het Reisorientatiecentrum",
    "object.yourGuesthouse": "Jouw Pension",
    "object.yourGuesthouse.door": "Deur van Jouw Pension",
    "panel.area": "Gebied",
    "panel.facing": "Richting",
    "panel.primary": "Primair",
    "panel.quest": "Quest",
    "panel.questStep": "Stap",
    "panel.secondary": "Secundair",
    "panel.tile": "Tegel",
    "quit.message": "Spel gestopt.",
    "quit.subtext": "Open het menu om terug te keren.",
    "settings.primary": "Primaire taal",
    "settings.secondary": "Secundaire taal",
    "settings.title": "Instellingen",
  },
};

Object.assign(TEXT.en, {
  "settings.speech": "Speech Language",
  "settings.speechUnavailable": "Speech unavailable",
  "area.cornerMarket": "Corner Market",
  "area.haneulTrail": "North Trail",
  "area.hanokTeaHouse": "Hanok Tea House",
  "area.rivalGuesthouse": "Rival Guesthouse",
  "area.travelCenter": "Travel Orientation Center",
  "area.yourGuesthouse": "Your Guesthouse",
  "npc.guesthouseHost.line1": "Your room is ready whenever you need a rest.",
  "npc.guesthouseHost.line2": "The kitchen is small, but it has everything a traveler needs.",
  "npc.guesthouseKid.line1": "I drew a map of the town on the table.",
  "npc.guesthouseKid.line2": "The big building north of here is where visitors usually begin.",
  "npc.marketClerk.line1": "Fresh fruit, seaweed snacks, and travel supplies are all stocked today.",
  "npc.marketClerk.line2": "Tell me if you need help finding something before your trip.",
  "npc.marketCustomer.line1": "I am choosing snacks for the road north.",
  "npc.marketCustomer.line2": "The dried squid shelf is popular, but I prefer the tangerines.",
  "npc.marketStocker.line1": "I keep the vegetable crates full during the morning rush.",
  "npc.marketStocker.line2": "The fish icebox has to stay cold, so I check it often.",
  "npc.rivalDad.line1": "The guest upstairs left early to compare routes.",
  "npc.rivalDad.line2": "That desk has been covered in guidebooks all week.",
  "npc.rivalStudent.line1": "I am studying useful Korean phrases before going outside.",
  "npc.rivalStudent.line2": "I keep mixing up left and right when I practice directions.",
  "npc.teaCustomer.line1": "This tea house is quiet enough to plan the whole day.",
  "npc.teaCustomer.line2": "I recommend sitting near the cushions by the window.",
  "npc.teaOwner.line1": "Welcome. The barley tea is warm and ready.",
  "npc.teaOwner.line2": "Please enjoy the low tables and take your time.",
  "npc.travelGuide.line1": "This center helps new travelers choose their first route.",
  "npc.travelGuide.line2": "The wall map shows the town, the shore, and the northern road.",
  "npc.travelGuest.line1": "I am checking the brochure rack before I leave.",
  "npc.travelGuest.line2": "The market looks useful if we need supplies.",
  "npc.travelTrainee.line1": "I am organizing route cards for tomorrow's visitors.",
  "npc.travelTrainee.line2": "The front desk can answer questions from across the counter.",
  "npc.trailKeeper.line1": "The bridge ahead is old, but the footboards still hold.",
  "npc.trailKeeper.line2": "Follow the lighter dirt north and you will reach the next town road.",
  "object.bed": "Bed",
  "object.bookcase": "Bookcase",
  "object.brochureRack": "Brochure Rack",
  "object.counter": "Counter",
  "object.creekSign": "Creek Crossing Sign",
  "object.desk": "Desk",
  "object.exit": "Exit",
  "object.familyTable": "Family Table",
  "object.fishIcebox": "Fish Icebox",
  "object.fridge": "Refrigerator",
  "object.kitchen": "Kitchen",
  "object.mapBoard": "Wall Map",
  "object.marketCounter": "Market Counter",
  "object.produceShelf": "Produce Shelf",
  "object.routeSouth": "Route South",
  "object.routeTown2": "Town 2 Road",
  "object.sink": "Sink",
  "object.stove": "Stove",
  "object.supplyShelf": "Supply Shelf",
  "object.teaCounter": "Tea Counter",
  "object.teaTable": "Tea Table",
  "object.trailRestTable": "Trail Rest Table",
  "object.trailRestTable.line1": "A rest table holds a folded route map, a water jar, and two cups.",
  "object.trailNorthSign": "North Trail Sign",
  "object.trailSouthSign": "South Trail Sign",
  "object.tv": "TV",
  "route.town2.pending": "Town 2 lies beyond the ridge. The gate stones are being set.",
  "sign.creek.line1": "Creek Crossing. Stay on the bridge when the water is high.",
  "sign.trailNorth.line1": "North: Town 2.",
  "sign.trailSouth.line1": "South: Haneul Town.",
});

Object.assign(TEXT.ko, {
  "area.haneulTrail": "북쪽 길",
  "npc.trailKeeper.line1": "앞의 다리는 오래됐지만 발판은 아직 튼튼해요.",
  "npc.trailKeeper.line2": "밝은 흙길을 따라 북쪽으로 가면 다음 마을로 가는 길이 나와요.",
  "object.creekSign": "개울 건널목 표지판",
  "object.routeSouth": "남쪽 길",
  "object.routeTown2": "마을 2로 가는 길",
  "object.trailNorthSign": "북쪽 길 표지판",
  "object.trailRestTable": "길가 쉼터 탁자",
  "object.trailRestTable.line1": "쉼터 탁자 위에 접힌 길 지도, 물병, 컵 두 개가 놓여 있어요.",
  "object.trailSouthSign": "남쪽 길 표지판",
  "route.town2.pending": "마을 2는 능선 너머에 있어요. 문을 세울 돌을 놓고 있습니다.",
  "sign.creek.line1": "개울 건널목. 물이 높을 때는 다리 위로 건너세요.",
  "sign.trailNorth.line1": "북쪽: 마을 2.",
  "sign.trailSouth.line1": "남쪽: 하늘 마을.",
  "settings.speech": "음성 언어",
  "settings.speechUnavailable": "음성을 사용할 수 없음",
  "area.cornerMarket": "골목 시장",
  "area.hanokTeaHouse": "한옥 찻집",
  "area.rivalGuesthouse": "라이벌 게스트하우스",
  "area.travelCenter": "여행 오리엔테이션 센터",
  "area.yourGuesthouse": "내 게스트하우스",
  "npc.guesthouseHost.line1": "쉬고 싶을 때 언제든 방을 쓰세요.",
  "npc.guesthouseHost.line2": "부엌은 작지만 여행자에게 필요한 것은 다 있어요.",
  "npc.guesthouseKid.line1": "탁자 위에 마을 지도를 그렸어요.",
  "npc.guesthouseKid.line2": "북쪽의 큰 건물에서 보통 방문객이 시작해요.",
  "npc.marketClerk.line1": "오늘은 과일, 김 과자, 여행용품이 모두 들어왔어요.",
  "npc.marketClerk.line2": "필요한 물건을 찾기 어려우면 말해 주세요.",
  "npc.marketCustomer.line1": "북쪽 길에 가져갈 간식을 고르고 있어요.",
  "npc.marketCustomer.line2": "마른 오징어 선반도 인기지만 저는 귤이 좋아요.",
  "npc.marketStocker.line1": "아침 손님이 많아서 채소 상자를 계속 채워요.",
  "npc.marketStocker.line2": "생선 냉장고는 차갑게 유지해야 해서 자주 확인해요.",
  "npc.rivalDad.line1": "위층 손님은 길을 비교하려고 일찍 나갔어요.",
  "npc.rivalDad.line2": "그 책상은 일주일 내내 여행책으로 가득했죠.",
  "npc.rivalStudent.line1": "밖에 나가기 전에 유용한 한국어 표현을 공부해요.",
  "npc.rivalStudent.line2": "방향을 연습할 때 왼쪽과 오른쪽을 자꾸 헷갈려요.",
  "npc.teaCustomer.line1": "이 찻집은 하루 계획을 세우기에 충분히 조용해요.",
  "npc.teaCustomer.line2": "창가 방석 근처에 앉는 걸 추천해요.",
  "npc.teaOwner.line1": "어서 오세요. 보리차가 따뜻하게 준비됐어요.",
  "npc.teaOwner.line2": "낮은 탁자에서 천천히 쉬어 가세요.",
  "npc.travelGuide.line1": "이 센터는 새 여행자가 첫 길을 고르도록 도와줘요.",
  "npc.travelGuide.line2": "벽 지도에는 마을, 해변, 북쪽 길이 표시되어 있어요.",
  "npc.travelGuest.line1": "떠나기 전에 안내 책자를 보고 있어요.",
  "npc.travelGuest.line2": "필요한 물건이 있으면 시장이 유용해 보여요.",
  "npc.travelTrainee.line1": "내일 방문객을 위한 경로 카드를 정리하고 있어요.",
  "npc.travelTrainee.line2": "앞 데스크는 카운터 너머에서도 질문을 받을 수 있어요.",
  "object.bed": "침대",
  "object.bookcase": "책장",
  "object.brochureRack": "안내 책자 진열대",
  "object.counter": "카운터",
  "object.desk": "책상",
  "object.exit": "출구",
  "object.familyTable": "가족 식탁",
  "object.fishIcebox": "생선 냉장고",
  "object.fridge": "냉장고",
  "object.kitchen": "부엌",
  "object.mapBoard": "벽 지도",
  "object.marketCounter": "시장 카운터",
  "object.produceShelf": "채소 진열대",
  "object.sink": "싱크대",
  "object.stove": "가스레인지",
  "object.supplyShelf": "용품 선반",
  "object.teaCounter": "차 카운터",
  "object.teaTable": "찻상",
  "object.tv": "TV",
});

Object.assign(TEXT.nl, {
  "settings.speech": "Spraaktaal",
  "settings.speechUnavailable": "Spraak niet beschikbaar",
  "area.cornerMarket": "Hoekmarkt",
  "area.haneulTrail": "Noordpad",
  "area.hanokTeaHouse": "Hanok Theehuis",
  "area.rivalGuesthouse": "Rivalenpension",
  "area.travelCenter": "Reisorientatiecentrum",
  "area.yourGuesthouse": "Jouw Pension",
  "npc.guesthouseHost.line1": "Je kamer is klaar zodra je wilt rusten.",
  "npc.guesthouseHost.line2": "De keuken is klein, maar heeft alles wat een reiziger nodig heeft.",
  "npc.guesthouseKid.line1": "Ik heb een kaart van de stad op de tafel getekend.",
  "npc.guesthouseKid.line2": "Het grote gebouw in het noorden is waar bezoekers meestal beginnen.",
  "npc.marketClerk.line1": "Vers fruit, zeewiersnacks en reisbenodigdheden zijn vandaag aangevuld.",
  "npc.marketClerk.line2": "Zeg het als je hulp nodig hebt met zoeken.",
  "npc.marketCustomer.line1": "Ik kies snacks voor de noordelijke route.",
  "npc.marketCustomer.line2": "De gedroogde inktvis is populair, maar ik neem liever mandarijnen.",
  "npc.marketStocker.line1": "Ik vul de groentekisten bij tijdens de ochtenddrukte.",
  "npc.marketStocker.line2": "De viskist moet koud blijven, dus ik controleer hem vaak.",
  "npc.rivalDad.line1": "De gast boven vertrok vroeg om routes te vergelijken.",
  "npc.rivalDad.line2": "Dat bureau ligt al de hele week vol reisgidsen.",
  "npc.rivalStudent.line1": "Ik studeer nuttige Koreaanse zinnen voordat ik naar buiten ga.",
  "npc.rivalStudent.line2": "Ik haal links en rechts steeds door elkaar bij het oefenen.",
  "npc.teaCustomer.line1": "Dit theehuis is rustig genoeg om de hele dag te plannen.",
  "npc.teaCustomer.line2": "Ik raad de kussens bij het raam aan.",
  "npc.teaOwner.line1": "Welkom. De gerstthee staat warm klaar.",
  "npc.teaOwner.line2": "Geniet van de lage tafels en neem je tijd.",
  "npc.travelGuide.line1": "Dit centrum helpt nieuwe reizigers hun eerste route te kiezen.",
  "npc.travelGuide.line2": "De wandkaart toont de stad, de kust en de noordweg.",
  "npc.travelGuest.line1": "Ik bekijk het rek met brochures voordat ik vertrek.",
  "npc.travelGuest.line2": "De markt lijkt handig als we spullen nodig hebben.",
  "npc.travelTrainee.line1": "Ik sorteer routekaarten voor bezoekers van morgen.",
  "npc.travelTrainee.line2": "De balie kan vragen beantwoorden vanaf de andere kant.",
  "npc.trailKeeper.line1": "De brug verderop is oud, maar de planken houden nog.",
  "npc.trailKeeper.line2": "Volg het lichte zandpad naar het noorden en je komt bij de weg naar de volgende stad.",
  "object.bed": "Bed",
  "object.bookcase": "Boekenkast",
  "object.brochureRack": "Brochurerek",
  "object.counter": "Balie",
  "object.creekSign": "Bord bij de beek",
  "object.desk": "Bureau",
  "object.exit": "Uitgang",
  "object.familyTable": "Familietafel",
  "object.fishIcebox": "Viskist",
  "object.fridge": "Koelkast",
  "object.kitchen": "Keuken",
  "object.mapBoard": "Wandkaart",
  "object.marketCounter": "Marktbalie",
  "object.produceShelf": "Groenterek",
  "object.routeSouth": "Route Zuid",
  "object.routeTown2": "Weg naar Stad 2",
  "object.sink": "Gootsteen",
  "object.stove": "Fornuis",
  "object.supplyShelf": "Voorraadrek",
  "object.teaCounter": "Theebalie",
  "object.teaTable": "Theetafel",
  "object.trailRestTable": "Rusttafel langs het pad",
  "object.trailRestTable.line1": "Op de rusttafel liggen een gevouwen routekaart, een waterkan en twee kopjes.",
  "object.trailNorthSign": "Noordpadbord",
  "object.trailSouthSign": "Zuidpadbord",
  "object.tv": "TV",
  "route.town2.pending": "Stad 2 ligt voorbij de heuvelrug. De poortstenen worden geplaatst.",
  "sign.creek.line1": "Beekoversteek. Blijf op de brug als het water hoog staat.",
  "sign.trailNorth.line1": "Noord: Stad 2.",
  "sign.trailSouth.line1": "Zuid: Haneulstad.",
});

Object.assign(TEXT.en, {
  "area.elementarySchool": "Haneul Elementary School",
  "npc.hangulTeacher": "Teacher Seo",
  "npc.hangulTeacher.line1": "Welcome to the first reading classroom.",
  "npc.hangulTeacher.line2": "Start by looking at the vowel and consonant maps on the wall.",
  "npc.schoolStudentA": "Student Hana",
  "npc.schoolStudentA.line1": "I am checking ㅏ and ㄱ before the teacher asks us to combine them.",
  "npc.schoolStudentA.line2": "The fountain outside will make more sense after these maps.",
  "npc.schoolStudentB": "Student Min",
  "npc.schoolStudentB.line1": "I say the vowel names quietly while I walk.",
  "npc.schoolStudentB.line2": "ㅏ, ㅓ, ㅗ, and ㅜ each point in a different direction.",
  "npc.schoolStudentC": "Student Jae",
  "npc.schoolStudentC.line1": "The consonant names are longer than the shapes.",
  "npc.schoolStudentC.line2": "I remember ㄴ because nieun turns like a corner.",
  "object.consonantWallMap": "Basic Consonant Map",
  "object.elementarySchool": "Elementary School",
  "object.elementarySchool.door": "Elementary School Door",
  "object.schoolBlackboard": "Class Blackboard",
  "object.schoolBlackboard.line1": "A clean blackboard waits for Hangul combination practice.",
  "object.schoolBookshelf": "Class Bookshelf",
  "object.schoolBookshelf.line1": "Beginner books are sorted by vowels, consonants, and simple syllables.",
  "object.studentDesk": "Student Desk",
  "object.studentDesk.line1": "A workbook is open to the first Hangul page.",
  "object.studentSeat": "Student Seat",
  "object.teacherDesk": "Teacher Desk",
  "object.teacherDesk.line1": "The teacher's notes mark today's basics: vowels first, then consonants.",
  "object.vowelWallMap": "Basic Vowel Map",
  "study.basicConsonants.subtitle": "Read each consonant shape and its letter name.",
  "study.basicConsonants.title": "Basic Consonants",
  "study.basicVowels.subtitle": "Read each vowel shape and its basic sound name.",
  "study.basicVowels.title": "Basic Vowels",
});

Object.assign(TEXT.ko, {
  "area.elementarySchool": "하늘 초등학교",
  "npc.hangulTeacher": "서 선생님",
  "npc.hangulTeacher.line1": "첫 읽기 교실에 온 것을 환영합니다.",
  "npc.hangulTeacher.line2": "먼저 벽에 있는 모음 지도와 자음 지도를 살펴보세요.",
  "npc.schoolStudentA": "학생 하나",
  "npc.schoolStudentA.line1": "선생님이 합치라고 하기 전에 ㅏ와 ㄱ을 확인하고 있어요.",
  "npc.schoolStudentA.line2": "이 지도를 보면 밖의 분수가 더 잘 이해될 거예요.",
  "npc.schoolStudentB": "학생 민",
  "npc.schoolStudentB.line1": "걸어 다니면서 모음 이름을 조용히 말해요.",
  "npc.schoolStudentB.line2": "ㅏ, ㅓ, ㅗ, ㅜ는 각각 다른 방향을 가리켜요.",
  "npc.schoolStudentC": "학생 재",
  "npc.schoolStudentC.line1": "자음 이름은 모양보다 더 길어요.",
  "npc.schoolStudentC.line2": "ㄴ은 니은이 모서리처럼 돌아서 기억하기 쉬워요.",
  "object.consonantWallMap": "기본 자음 지도",
  "object.elementarySchool": "초등학교",
  "object.elementarySchool.door": "초등학교 문",
  "object.schoolBlackboard": "교실 칠판",
  "object.schoolBlackboard.line1": "깨끗한 칠판이 한글 조합 연습을 기다립니다.",
  "object.schoolBookshelf": "교실 책장",
  "object.schoolBookshelf.line1": "초급 책들이 모음, 자음, 쉬운 음절별로 정리되어 있습니다.",
  "object.studentDesk": "학생 책상",
  "object.studentDesk.line1": "워크북이 첫 한글 페이지에 펼쳐져 있습니다.",
  "object.studentSeat": "학생 의자",
  "object.teacherDesk": "선생님 책상",
  "object.teacherDesk.line1": "선생님의 노트에는 오늘의 기본이 적혀 있습니다. 먼저 모음, 다음은 자음입니다.",
  "object.vowelWallMap": "기본 모음 지도",
  "study.basicConsonants.subtitle": "각 자음 모양과 글자 이름을 읽어 보세요.",
  "study.basicConsonants.title": "기본 자음",
  "study.basicVowels.subtitle": "각 모음 모양과 기본 소리 이름을 읽어 보세요.",
  "study.basicVowels.title": "기본 모음",
});

Object.assign(TEXT.nl, {
  "area.elementarySchool": "Haneul Basisschool",
  "npc.hangulTeacher": "Juf Seo",
  "npc.hangulTeacher.line1": "Welkom in het eerste leeslokaal.",
  "npc.hangulTeacher.line2": "Begin met de klinkerkaart en medeklinkerkaart aan de muur.",
  "npc.schoolStudentA": "Leerling Hana",
  "npc.schoolStudentA.line1": "Ik controleer ㅏ en ㄱ voordat de juf vraagt om ze te combineren.",
  "npc.schoolStudentA.line2": "De fontein buiten wordt logischer na deze kaarten.",
  "npc.schoolStudentB": "Leerling Min",
  "npc.schoolStudentB.line1": "Ik zeg de klinkernamen zachtjes terwijl ik loop.",
  "npc.schoolStudentB.line2": "ㅏ, ㅓ, ㅗ en ㅜ wijzen elk een andere kant op.",
  "npc.schoolStudentC": "Leerling Jae",
  "npc.schoolStudentC.line1": "De medeklinkernamen zijn langer dan de vormen.",
  "npc.schoolStudentC.line2": "Ik onthoud ㄴ omdat nieun draait als een hoek.",
  "object.consonantWallMap": "Basismedeklinkerkaart",
  "object.elementarySchool": "Basisschool",
  "object.elementarySchool.door": "Deur van de Basisschool",
  "object.schoolBlackboard": "Klasbord",
  "object.schoolBlackboard.line1": "Een schoon bord wacht op Hangul-combinatieoefeningen.",
  "object.schoolBookshelf": "Klasboekenkast",
  "object.schoolBookshelf.line1": "Beginnerboeken zijn gesorteerd op klinkers, medeklinkers en eenvoudige lettergrepen.",
  "object.studentDesk": "Leerlingtafel",
  "object.studentDesk.line1": "Een werkboek ligt open op de eerste Hangul-pagina.",
  "object.studentSeat": "Leerlingstoel",
  "object.teacherDesk": "Juffenbureau",
  "object.teacherDesk.line1": "De aantekeningen markeren de basis van vandaag: eerst klinkers, daarna medeklinkers.",
  "object.vowelWallMap": "Basisklinkerkaart",
  "study.basicConsonants.subtitle": "Lees elke medeklinkervorm en de naam van de letter.",
  "study.basicConsonants.title": "Basismedeklinkers",
  "study.basicVowels.subtitle": "Lees elke klinkervorm en de basisgeluidnaam.",
  "study.basicVowels.title": "Basisklinkers",
});

Object.assign(TEXT.en, {
  "drill.passed": "Quest step passed",
  "drill.retry": "Try again with every answer correct to pass this quest step.",
  "drill.town1.choice.a": "a",
  "drill.town1.choice.bieup": "bieup",
  "drill.town1.choice.da": "da",
  "drill.town1.choice.digeut": "digeut",
  "drill.town1.choice.do": "do",
  "drill.town1.choice.du": "du",
  "drill.town1.choice.eo": "eo",
  "drill.town1.choice.eu": "eu",
  "drill.town1.choice.ga": "ga",
  "drill.town1.choice.geo": "geo",
  "drill.town1.choice.giyeok": "giyeok",
  "drill.town1.choice.gu": "gu",
  "drill.town1.choice.i": "i",
  "drill.town1.choice.mieum": "mieum",
  "drill.town1.choice.mu": "mu",
  "drill.town1.choice.na": "na",
  "drill.town1.choice.neo": "neo",
  "drill.town1.choice.nieun": "nieun",
  "drill.town1.choice.no": "no",
  "drill.town1.choice.o": "o",
  "drill.town1.choice.rieul": "rieul",
  "drill.town1.choice.siot": "siot",
  "drill.town1.choice.to": "to",
  "drill.town1.choice.u": "u",
  "drill.town1.choice.ya": "ya",
  "drill.town1.choice.yo": "yo",
  "drill.town1BlackboardConsonants.title": "Blackboard Consonant Check",
  "drill.town1BlackboardConsonants.1.prompt": "Exam: Which name fits ㄱ?",
  "drill.town1BlackboardConsonants.1.correct": "ㄱ is giyeok.",
  "drill.town1BlackboardConsonants.1.incorrect": "ㄱ turns like a corner; its name is giyeok.",
  "drill.town1BlackboardConsonants.2.prompt": "Exam: Which name fits ㄴ?",
  "drill.town1BlackboardConsonants.2.correct": "ㄴ is nieun.",
  "drill.town1BlackboardConsonants.2.incorrect": "ㄴ is the corner-shaped consonant named nieun.",
  "drill.town1BlackboardConsonants.3.prompt": "Exam: Which name fits ㅁ?",
  "drill.town1BlackboardConsonants.3.correct": "ㅁ is mieum.",
  "drill.town1BlackboardConsonants.3.incorrect": "The closed square consonant ㅁ is mieum.",
  "drill.town1BlackboardSyllables.title": "Blackboard First Syllables",
  "drill.town1BlackboardSyllables.1.prompt": "Exam: ㄱ + ㅏ makes 가. Choose the reading.",
  "drill.town1BlackboardSyllables.1.correct": "가 reads ga.",
  "drill.town1BlackboardSyllables.1.incorrect": "ㄱ gives g and ㅏ gives a, so 가 reads ga.",
  "drill.town1BlackboardSyllables.2.prompt": "Exam: ㄴ + ㅓ makes 너. Choose the reading.",
  "drill.town1BlackboardSyllables.2.correct": "너 reads neo.",
  "drill.town1BlackboardSyllables.2.incorrect": "ㄴ gives n and ㅓ gives eo, so 너 reads neo.",
  "drill.town1BlackboardSyllables.3.prompt": "Exam: ㄷ + ㅗ makes 도. Choose the reading.",
  "drill.town1BlackboardSyllables.3.correct": "도 reads do.",
  "drill.town1BlackboardSyllables.3.incorrect": "ㄷ gives d and ㅗ gives o, so 도 reads do.",
  "drill.town1BlackboardVowels.title": "Blackboard Vowel Check",
  "drill.town1BlackboardVowels.1.prompt": "Exam: Which sound name fits ㅏ?",
  "drill.town1BlackboardVowels.1.correct": "ㅏ is a.",
  "drill.town1BlackboardVowels.1.incorrect": "The right-facing short stroke marks the a vowel.",
  "drill.town1BlackboardVowels.2.prompt": "Exam: Which sound name fits ㅓ?",
  "drill.town1BlackboardVowels.2.correct": "ㅓ is eo.",
  "drill.town1BlackboardVowels.2.incorrect": "The left-facing short stroke marks eo.",
  "drill.town1BlackboardVowels.3.prompt": "Exam: Which sound name fits ㅜ?",
  "drill.town1BlackboardVowels.3.correct": "ㅜ is u.",
  "drill.town1BlackboardVowels.3.incorrect": "The lower short stroke marks u.",
  "drill.town1DeskSyllables.title": "First Syllable Desks",
  "drill.town1DeskSyllables.1.prompt": "Combine ㄱ + ㅏ. Which sound is 가?",
  "drill.town1DeskSyllables.1.correct": "ㄱ plus ㅏ makes 가, read ga.",
  "drill.town1DeskSyllables.1.incorrect": "Keep the consonant first, then the vowel: ㄱ + ㅏ reads ga.",
  "drill.town1DeskSyllables.2.prompt": "Combine ㄴ + ㅓ. Which sound is 너?",
  "drill.town1DeskSyllables.2.correct": "ㄴ plus ㅓ makes 너, read neo.",
  "drill.town1DeskSyllables.2.incorrect": "ㄴ gives n and ㅓ gives eo, so the block reads neo.",
  "drill.town1DeskSyllables.3.prompt": "Combine ㄷ + ㅗ. Which sound is 도?",
  "drill.town1DeskSyllables.3.correct": "ㄷ plus ㅗ makes 도, read do.",
  "drill.town1DeskSyllables.3.incorrect": "ㄷ gives d and ㅗ gives o, so the block reads do.",
  "drill.town1DeskSyllables.4.prompt": "Combine ㅁ + ㅜ. Which sound is 무?",
  "drill.town1DeskSyllables.4.correct": "ㅁ plus ㅜ makes 무, read mu.",
  "drill.town1DeskSyllables.4.incorrect": "ㅁ gives m and ㅜ gives u, so the block reads mu.",
  "drill.town1FountainConsonants.title": "Fountain Consonants 1",
  "drill.town1FountainConsonants.1.prompt": "The fountain shows ㄱ. Choose the letter name.",
  "drill.town1FountainConsonants.1.correct": "ㄱ is giyeok; it turns like a corner.",
  "drill.town1FountainConsonants.1.incorrect": "Look for giyeok, the ㄱ corner shape.",
  "drill.town1FountainConsonants.2.prompt": "The fountain shows ㄴ. Choose the letter name.",
  "drill.town1FountainConsonants.2.correct": "ㄴ is nieun; it sits like a corner.",
  "drill.town1FountainConsonants.2.incorrect": "The ㄴ shape is named nieun.",
  "drill.town1FountainConsonants.3.prompt": "The fountain shows ㄷ. Choose the letter name.",
  "drill.town1FountainConsonants.3.correct": "ㄷ is digeut; it has three sides.",
  "drill.town1FountainConsonants.3.incorrect": "The three-sided ㄷ shape is digeut.",
  "drill.town1FountainConsonants.4.prompt": "The fountain shows ㅁ. Choose the letter name.",
  "drill.town1FountainConsonants.4.correct": "ㅁ is mieum; it is a closed square.",
  "drill.town1FountainConsonants.4.incorrect": "The closed square ㅁ is mieum.",
  "drill.town1FountainReview.title": "Fountain Review",
  "drill.town1FountainReview.1.prompt": "Review: Which sound name fits ㅗ?",
  "drill.town1FountainReview.1.correct": "ㅗ is o.",
  "drill.town1FountainReview.1.incorrect": "The upper short stroke marks o.",
  "drill.town1FountainReview.2.prompt": "Review: Which name fits ㄴ?",
  "drill.town1FountainReview.2.correct": "ㄴ is nieun.",
  "drill.town1FountainReview.2.incorrect": "ㄴ is named nieun.",
  "drill.town1FountainReview.3.prompt": "Review: Which sound is 가?",
  "drill.town1FountainReview.3.correct": "가 reads ga.",
  "drill.town1FountainReview.3.incorrect": "ㄱ plus ㅏ reads ga.",
  "drill.town1FountainReview.4.prompt": "Review: Which sound is 무?",
  "drill.town1FountainReview.4.correct": "무 reads mu.",
  "drill.town1FountainReview.4.incorrect": "ㅁ plus ㅜ reads mu.",
  "drill.town1FountainVowels.title": "Fountain Vowels 1",
  "drill.town1FountainVowels.1.prompt": "The fountain shows ㅏ. Choose the sound name.",
  "drill.town1FountainVowels.1.correct": "ㅏ is read a; the short stroke points right.",
  "drill.town1FountainVowels.1.incorrect": "Look for the simple a sound: ㅏ.",
  "drill.town1FountainVowels.2.prompt": "The fountain shows ㅓ. Choose the sound name.",
  "drill.town1FountainVowels.2.correct": "ㅓ is read eo; the short stroke points left.",
  "drill.town1FountainVowels.2.incorrect": "ㅓ is the eo sound.",
  "drill.town1FountainVowels.3.prompt": "The fountain shows ㅗ. Choose the sound name.",
  "drill.town1FountainVowels.3.correct": "ㅗ is read o; the short stroke rises above the line.",
  "drill.town1FountainVowels.3.incorrect": "ㅗ is the o sound.",
  "drill.town1FountainVowels.4.prompt": "The fountain shows ㅜ. Choose the sound name.",
  "drill.town1FountainVowels.4.correct": "ㅜ is read u; the short stroke hangs below.",
  "drill.town1FountainVowels.4.incorrect": "ㅜ is the u sound.",
  "npc.hangulTeacher.line3": "Read a wall map, practice at the fountain, then return to the blackboard for a check.",
  "object.schoolBlackboard.complete.line1": "The board shows clean marks beside every Town 1 classroom check.",
  "object.schoolBlackboard.locked.consonants": "Pass the fountain consonant level before taking the consonant check.",
  "object.schoolBlackboard.locked.syllables": "Practice first syllables at a desk before taking this check.",
  "object.schoolBlackboard.locked.teacher": "Teacher Seo wants to explain the classroom sequence first.",
  "object.schoolBlackboard.locked.vowels": "Pass the fountain vowel level before taking the vowel check.",
  "object.soundFountain.complete.line1": "The fountain is in review mode for the sounds you have unlocked.",
  "object.soundFountain.locked.consonants": "Read the consonant map inside the school before starting the next fountain level.",
  "object.soundFountain.locked.vowels": "Read the vowel map inside the school before using the fountain practice.",
  "object.studentDesk.locked.consonants": "Pass the fountain consonant level before combining syllables here.",
  "object.studentDesk.locked.vowels": "Pass the fountain vowel level before using this workbook.",
  "quest.town1.basicConsonants": "Basic Consonants",
  "quest.town1.basicConsonants.exam": "Pass blackboard consonants",
  "quest.town1.basicConsonants.practice": "Pass fountain consonants",
  "quest.town1.basicConsonants.theory": "Read consonant map",
  "quest.town1.basicVowels": "Basic Vowels",
  "quest.town1.basicVowels.exam": "Pass blackboard vowels",
  "quest.town1.basicVowels.practice": "Pass fountain vowels",
  "quest.town1.basicVowels.theory": "Read vowel map",
  "quest.town1.firstSyllables": "First Syllables",
  "quest.town1.firstSyllables.exam": "Pass syllable blackboard",
  "quest.town1.firstSyllables.practice": "Practice at a desk",
  "quest.town1.readingBadge": "Town 1 Reading Badge",
  "quest.town1.readingBadge.ready": "Classroom checks complete",
});

Object.assign(TEXT.ko, {
  "drill.passed": "퀘스트 단계 통과",
  "drill.retry": "이 퀘스트 단계를 통과하려면 모든 답을 맞혀 다시 해 보세요.",
  "drill.town1.choice.a": "a",
  "drill.town1.choice.bieup": "bieup",
  "drill.town1.choice.da": "da",
  "drill.town1.choice.digeut": "digeut",
  "drill.town1.choice.do": "do",
  "drill.town1.choice.du": "du",
  "drill.town1.choice.eo": "eo",
  "drill.town1.choice.eu": "eu",
  "drill.town1.choice.ga": "ga",
  "drill.town1.choice.geo": "geo",
  "drill.town1.choice.giyeok": "giyeok",
  "drill.town1.choice.gu": "gu",
  "drill.town1.choice.i": "i",
  "drill.town1.choice.mieum": "mieum",
  "drill.town1.choice.mu": "mu",
  "drill.town1.choice.na": "na",
  "drill.town1.choice.neo": "neo",
  "drill.town1.choice.nieun": "nieun",
  "drill.town1.choice.no": "no",
  "drill.town1.choice.o": "o",
  "drill.town1.choice.rieul": "rieul",
  "drill.town1.choice.siot": "siot",
  "drill.town1.choice.to": "to",
  "drill.town1.choice.u": "u",
  "drill.town1.choice.ya": "ya",
  "drill.town1.choice.yo": "yo",
  "drill.town1BlackboardConsonants.title": "칠판 자음 확인",
  "drill.town1BlackboardConsonants.1.prompt": "시험: ㄱ에 맞는 이름은 무엇인가요?",
  "drill.town1BlackboardConsonants.1.correct": "ㄱ은 giyeok입니다.",
  "drill.town1BlackboardConsonants.1.incorrect": "ㄱ은 모서리처럼 꺾입니다. 이름은 giyeok입니다.",
  "drill.town1BlackboardConsonants.2.prompt": "시험: ㄴ에 맞는 이름은 무엇인가요?",
  "drill.town1BlackboardConsonants.2.correct": "ㄴ은 nieun입니다.",
  "drill.town1BlackboardConsonants.2.incorrect": "ㄴ은 모서리 모양의 자음이고 이름은 nieun입니다.",
  "drill.town1BlackboardConsonants.3.prompt": "시험: ㅁ에 맞는 이름은 무엇인가요?",
  "drill.town1BlackboardConsonants.3.correct": "ㅁ은 mieum입니다.",
  "drill.town1BlackboardConsonants.3.incorrect": "닫힌 네모 자음 ㅁ은 mieum입니다.",
  "drill.town1BlackboardSyllables.title": "칠판 첫 음절",
  "drill.town1BlackboardSyllables.1.prompt": "시험: ㄱ + ㅏ는 가가 됩니다. 읽는 소리를 고르세요.",
  "drill.town1BlackboardSyllables.1.correct": "가는 ga로 읽습니다.",
  "drill.town1BlackboardSyllables.1.incorrect": "ㄱ은 g, ㅏ는 a라서 가는 ga로 읽습니다.",
  "drill.town1BlackboardSyllables.2.prompt": "시험: ㄴ + ㅓ는 너가 됩니다. 읽는 소리를 고르세요.",
  "drill.town1BlackboardSyllables.2.correct": "너는 neo로 읽습니다.",
  "drill.town1BlackboardSyllables.2.incorrect": "ㄴ은 n, ㅓ는 eo라서 너는 neo로 읽습니다.",
  "drill.town1BlackboardSyllables.3.prompt": "시험: ㄷ + ㅗ는 도가 됩니다. 읽는 소리를 고르세요.",
  "drill.town1BlackboardSyllables.3.correct": "도는 do로 읽습니다.",
  "drill.town1BlackboardSyllables.3.incorrect": "ㄷ은 d, ㅗ는 o라서 도는 do로 읽습니다.",
  "drill.town1BlackboardVowels.title": "칠판 모음 확인",
  "drill.town1BlackboardVowels.1.prompt": "시험: ㅏ에 맞는 소리 이름은 무엇인가요?",
  "drill.town1BlackboardVowels.1.correct": "ㅏ는 a입니다.",
  "drill.town1BlackboardVowels.1.incorrect": "오른쪽을 향한 짧은 획은 a 모음입니다.",
  "drill.town1BlackboardVowels.2.prompt": "시험: ㅓ에 맞는 소리 이름은 무엇인가요?",
  "drill.town1BlackboardVowels.2.correct": "ㅓ는 eo입니다.",
  "drill.town1BlackboardVowels.2.incorrect": "왼쪽을 향한 짧은 획은 eo입니다.",
  "drill.town1BlackboardVowels.3.prompt": "시험: ㅜ에 맞는 소리 이름은 무엇인가요?",
  "drill.town1BlackboardVowels.3.correct": "ㅜ는 u입니다.",
  "drill.town1BlackboardVowels.3.incorrect": "아래쪽 짧은 획은 u입니다.",
  "drill.town1DeskSyllables.title": "첫 음절 책상",
  "drill.town1DeskSyllables.1.prompt": "ㄱ + ㅏ를 합치세요. 가는 어떤 소리인가요?",
  "drill.town1DeskSyllables.1.correct": "ㄱ과 ㅏ가 만나 가가 되고, ga로 읽습니다.",
  "drill.town1DeskSyllables.1.incorrect": "자음을 먼저, 그다음 모음을 보세요. ㄱ + ㅏ는 ga입니다.",
  "drill.town1DeskSyllables.2.prompt": "ㄴ + ㅓ를 합치세요. 너는 어떤 소리인가요?",
  "drill.town1DeskSyllables.2.correct": "ㄴ과 ㅓ가 만나 너가 되고, neo로 읽습니다.",
  "drill.town1DeskSyllables.2.incorrect": "ㄴ은 n, ㅓ는 eo라서 이 블록은 neo로 읽습니다.",
  "drill.town1DeskSyllables.3.prompt": "ㄷ + ㅗ를 합치세요. 도는 어떤 소리인가요?",
  "drill.town1DeskSyllables.3.correct": "ㄷ과 ㅗ가 만나 도가 되고, do로 읽습니다.",
  "drill.town1DeskSyllables.3.incorrect": "ㄷ은 d, ㅗ는 o라서 이 블록은 do로 읽습니다.",
  "drill.town1DeskSyllables.4.prompt": "ㅁ + ㅜ를 합치세요. 무는 어떤 소리인가요?",
  "drill.town1DeskSyllables.4.correct": "ㅁ과 ㅜ가 만나 무가 되고, mu로 읽습니다.",
  "drill.town1DeskSyllables.4.incorrect": "ㅁ은 m, ㅜ는 u라서 이 블록은 mu로 읽습니다.",
  "drill.town1FountainConsonants.title": "분수 자음 1",
  "drill.town1FountainConsonants.1.prompt": "분수가 ㄱ을 보여 줍니다. 글자 이름을 고르세요.",
  "drill.town1FountainConsonants.1.correct": "ㄱ은 giyeok입니다. 모서리처럼 꺾입니다.",
  "drill.town1FountainConsonants.1.incorrect": "ㄱ 모서리 모양인 giyeok을 찾으세요.",
  "drill.town1FountainConsonants.2.prompt": "분수가 ㄴ을 보여 줍니다. 글자 이름을 고르세요.",
  "drill.town1FountainConsonants.2.correct": "ㄴ은 nieun입니다. 모서리처럼 놓입니다.",
  "drill.town1FountainConsonants.2.incorrect": "ㄴ 모양의 이름은 nieun입니다.",
  "drill.town1FountainConsonants.3.prompt": "분수가 ㄷ을 보여 줍니다. 글자 이름을 고르세요.",
  "drill.town1FountainConsonants.3.correct": "ㄷ은 digeut입니다. 세 면이 있습니다.",
  "drill.town1FountainConsonants.3.incorrect": "세 면이 있는 ㄷ 모양은 digeut입니다.",
  "drill.town1FountainConsonants.4.prompt": "분수가 ㅁ을 보여 줍니다. 글자 이름을 고르세요.",
  "drill.town1FountainConsonants.4.correct": "ㅁ은 mieum입니다. 닫힌 네모입니다.",
  "drill.town1FountainConsonants.4.incorrect": "닫힌 네모 ㅁ은 mieum입니다.",
  "drill.town1FountainReview.title": "분수 복습",
  "drill.town1FountainReview.1.prompt": "복습: ㅗ에 맞는 소리 이름은 무엇인가요?",
  "drill.town1FountainReview.1.correct": "ㅗ는 o입니다.",
  "drill.town1FountainReview.1.incorrect": "위쪽 짧은 획은 o입니다.",
  "drill.town1FountainReview.2.prompt": "복습: ㄴ에 맞는 이름은 무엇인가요?",
  "drill.town1FountainReview.2.correct": "ㄴ은 nieun입니다.",
  "drill.town1FountainReview.2.incorrect": "ㄴ의 이름은 nieun입니다.",
  "drill.town1FountainReview.3.prompt": "복습: 가는 어떤 소리인가요?",
  "drill.town1FountainReview.3.correct": "가는 ga로 읽습니다.",
  "drill.town1FountainReview.3.incorrect": "ㄱ과 ㅏ는 ga로 읽습니다.",
  "drill.town1FountainReview.4.prompt": "복습: 무는 어떤 소리인가요?",
  "drill.town1FountainReview.4.correct": "무는 mu로 읽습니다.",
  "drill.town1FountainReview.4.incorrect": "ㅁ과 ㅜ는 mu로 읽습니다.",
  "drill.town1FountainVowels.title": "분수 모음 1",
  "drill.town1FountainVowels.1.prompt": "분수가 ㅏ를 보여 줍니다. 소리 이름을 고르세요.",
  "drill.town1FountainVowels.1.correct": "ㅏ는 a로 읽습니다. 짧은 획이 오른쪽을 향합니다.",
  "drill.town1FountainVowels.1.incorrect": "기본 a 소리인 ㅏ를 찾으세요.",
  "drill.town1FountainVowels.2.prompt": "분수가 ㅓ를 보여 줍니다. 소리 이름을 고르세요.",
  "drill.town1FountainVowels.2.correct": "ㅓ는 eo로 읽습니다. 짧은 획이 왼쪽을 향합니다.",
  "drill.town1FountainVowels.2.incorrect": "ㅓ는 eo 소리입니다.",
  "drill.town1FountainVowels.3.prompt": "분수가 ㅗ를 보여 줍니다. 소리 이름을 고르세요.",
  "drill.town1FountainVowels.3.correct": "ㅗ는 o로 읽습니다. 짧은 획이 위로 올라갑니다.",
  "drill.town1FountainVowels.3.incorrect": "ㅗ는 o 소리입니다.",
  "drill.town1FountainVowels.4.prompt": "분수가 ㅜ를 보여 줍니다. 소리 이름을 고르세요.",
  "drill.town1FountainVowels.4.correct": "ㅜ는 u로 읽습니다. 짧은 획이 아래로 내려갑니다.",
  "drill.town1FountainVowels.4.incorrect": "ㅜ는 u 소리입니다.",
  "npc.hangulTeacher.line3": "벽 지도를 읽고, 분수에서 연습한 다음, 칠판으로 돌아와 확인하세요.",
  "object.schoolBlackboard.complete.line1": "칠판에는 마을 1 교실 확인마다 깔끔한 표시가 되어 있습니다.",
  "object.schoolBlackboard.locked.consonants": "자음 확인을 보기 전에 분수 자음 단계를 통과하세요.",
  "object.schoolBlackboard.locked.syllables": "이 확인을 보기 전에 책상에서 첫 음절을 연습하세요.",
  "object.schoolBlackboard.locked.teacher": "서 선생님이 먼저 교실 순서를 설명하려고 합니다.",
  "object.schoolBlackboard.locked.vowels": "모음 확인을 보기 전에 분수 모음 단계를 통과하세요.",
  "object.soundFountain.complete.line1": "분수는 지금 배운 소리를 복습하는 모드입니다.",
  "object.soundFountain.locked.consonants": "다음 분수 단계를 시작하기 전에 학교 안의 자음 지도를 읽으세요.",
  "object.soundFountain.locked.vowels": "분수 연습을 시작하기 전에 학교 안의 모음 지도를 읽으세요.",
  "object.studentDesk.locked.consonants": "여기에서 음절을 합치기 전에 분수 자음 단계를 통과하세요.",
  "object.studentDesk.locked.vowels": "이 워크북을 사용하기 전에 분수 모음 단계를 통과하세요.",
  "quest.town1.basicConsonants": "기본 자음",
  "quest.town1.basicConsonants.exam": "칠판 자음 통과",
  "quest.town1.basicConsonants.practice": "분수 자음 통과",
  "quest.town1.basicConsonants.theory": "자음 지도 읽기",
  "quest.town1.basicVowels": "기본 모음",
  "quest.town1.basicVowels.exam": "칠판 모음 통과",
  "quest.town1.basicVowels.practice": "분수 모음 통과",
  "quest.town1.basicVowels.theory": "모음 지도 읽기",
  "quest.town1.firstSyllables": "첫 음절",
  "quest.town1.firstSyllables.exam": "칠판 음절 통과",
  "quest.town1.firstSyllables.practice": "책상에서 연습",
  "quest.town1.readingBadge": "마을 1 읽기 배지",
  "quest.town1.readingBadge.ready": "교실 확인 완료",
});

Object.assign(TEXT.nl, {
  "drill.passed": "Queststap gehaald",
  "drill.retry": "Probeer opnieuw met alle antwoorden goed om deze queststap te halen.",
  "drill.town1.choice.a": "a",
  "drill.town1.choice.bieup": "bieup",
  "drill.town1.choice.da": "da",
  "drill.town1.choice.digeut": "digeut",
  "drill.town1.choice.do": "do",
  "drill.town1.choice.du": "du",
  "drill.town1.choice.eo": "eo",
  "drill.town1.choice.eu": "eu",
  "drill.town1.choice.ga": "ga",
  "drill.town1.choice.geo": "geo",
  "drill.town1.choice.giyeok": "giyeok",
  "drill.town1.choice.gu": "gu",
  "drill.town1.choice.i": "i",
  "drill.town1.choice.mieum": "mieum",
  "drill.town1.choice.mu": "mu",
  "drill.town1.choice.na": "na",
  "drill.town1.choice.neo": "neo",
  "drill.town1.choice.nieun": "nieun",
  "drill.town1.choice.no": "no",
  "drill.town1.choice.o": "o",
  "drill.town1.choice.rieul": "rieul",
  "drill.town1.choice.siot": "siot",
  "drill.town1.choice.to": "to",
  "drill.town1.choice.u": "u",
  "drill.town1.choice.ya": "ya",
  "drill.town1.choice.yo": "yo",
  "drill.town1BlackboardConsonants.title": "Bordcontrole Medeklinkers",
  "drill.town1BlackboardConsonants.1.prompt": "Toets: welke naam hoort bij ㄱ?",
  "drill.town1BlackboardConsonants.1.correct": "ㄱ is giyeok.",
  "drill.town1BlackboardConsonants.1.incorrect": "ㄱ draait als een hoek; de naam is giyeok.",
  "drill.town1BlackboardConsonants.2.prompt": "Toets: welke naam hoort bij ㄴ?",
  "drill.town1BlackboardConsonants.2.correct": "ㄴ is nieun.",
  "drill.town1BlackboardConsonants.2.incorrect": "ㄴ is de hoekvormige medeklinker nieun.",
  "drill.town1BlackboardConsonants.3.prompt": "Toets: welke naam hoort bij ㅁ?",
  "drill.town1BlackboardConsonants.3.correct": "ㅁ is mieum.",
  "drill.town1BlackboardConsonants.3.incorrect": "De gesloten vierkante medeklinker ㅁ is mieum.",
  "drill.town1BlackboardSyllables.title": "Bordcontrole Eerste Lettergrepen",
  "drill.town1BlackboardSyllables.1.prompt": "Toets: ㄱ + ㅏ maakt 가. Kies de lezing.",
  "drill.town1BlackboardSyllables.1.correct": "가 lees je als ga.",
  "drill.town1BlackboardSyllables.1.incorrect": "ㄱ geeft g en ㅏ geeft a, dus 가 lees je als ga.",
  "drill.town1BlackboardSyllables.2.prompt": "Toets: ㄴ + ㅓ maakt 너. Kies de lezing.",
  "drill.town1BlackboardSyllables.2.correct": "너 lees je als neo.",
  "drill.town1BlackboardSyllables.2.incorrect": "ㄴ geeft n en ㅓ geeft eo, dus 너 lees je als neo.",
  "drill.town1BlackboardSyllables.3.prompt": "Toets: ㄷ + ㅗ maakt 도. Kies de lezing.",
  "drill.town1BlackboardSyllables.3.correct": "도 lees je als do.",
  "drill.town1BlackboardSyllables.3.incorrect": "ㄷ geeft d en ㅗ geeft o, dus 도 lees je als do.",
  "drill.town1BlackboardVowels.title": "Bordcontrole Klinkers",
  "drill.town1BlackboardVowels.1.prompt": "Toets: welke klanknaam hoort bij ㅏ?",
  "drill.town1BlackboardVowels.1.correct": "ㅏ is a.",
  "drill.town1BlackboardVowels.1.incorrect": "De korte streep naar rechts markeert de klinker a.",
  "drill.town1BlackboardVowels.2.prompt": "Toets: welke klanknaam hoort bij ㅓ?",
  "drill.town1BlackboardVowels.2.correct": "ㅓ is eo.",
  "drill.town1BlackboardVowels.2.incorrect": "De korte streep naar links markeert eo.",
  "drill.town1BlackboardVowels.3.prompt": "Toets: welke klanknaam hoort bij ㅜ?",
  "drill.town1BlackboardVowels.3.correct": "ㅜ is u.",
  "drill.town1BlackboardVowels.3.incorrect": "De onderste korte streep markeert u.",
  "drill.town1DeskSyllables.title": "Eerste Lettergreeptafels",
  "drill.town1DeskSyllables.1.prompt": "Combineer ㄱ + ㅏ. Welke klank is 가?",
  "drill.town1DeskSyllables.1.correct": "ㄱ plus ㅏ maakt 가, gelezen als ga.",
  "drill.town1DeskSyllables.1.incorrect": "Houd eerst de medeklinker, daarna de klinker: ㄱ + ㅏ is ga.",
  "drill.town1DeskSyllables.2.prompt": "Combineer ㄴ + ㅓ. Welke klank is 너?",
  "drill.town1DeskSyllables.2.correct": "ㄴ plus ㅓ maakt 너, gelezen als neo.",
  "drill.town1DeskSyllables.2.incorrect": "ㄴ geeft n en ㅓ geeft eo, dus het blok leest neo.",
  "drill.town1DeskSyllables.3.prompt": "Combineer ㄷ + ㅗ. Welke klank is 도?",
  "drill.town1DeskSyllables.3.correct": "ㄷ plus ㅗ maakt 도, gelezen als do.",
  "drill.town1DeskSyllables.3.incorrect": "ㄷ geeft d en ㅗ geeft o, dus het blok leest do.",
  "drill.town1DeskSyllables.4.prompt": "Combineer ㅁ + ㅜ. Welke klank is 무?",
  "drill.town1DeskSyllables.4.correct": "ㅁ plus ㅜ maakt 무, gelezen als mu.",
  "drill.town1DeskSyllables.4.incorrect": "ㅁ geeft m en ㅜ geeft u, dus het blok leest mu.",
  "drill.town1FountainConsonants.title": "Fontein Medeklinkers 1",
  "drill.town1FountainConsonants.1.prompt": "De fontein toont ㄱ. Kies de letternaam.",
  "drill.town1FountainConsonants.1.correct": "ㄱ is giyeok; hij draait als een hoek.",
  "drill.town1FountainConsonants.1.incorrect": "Zoek giyeok, de hoekvorm ㄱ.",
  "drill.town1FountainConsonants.2.prompt": "De fontein toont ㄴ. Kies de letternaam.",
  "drill.town1FountainConsonants.2.correct": "ㄴ is nieun; hij ligt als een hoek.",
  "drill.town1FountainConsonants.2.incorrect": "De ㄴ-vorm heet nieun.",
  "drill.town1FountainConsonants.3.prompt": "De fontein toont ㄷ. Kies de letternaam.",
  "drill.town1FountainConsonants.3.correct": "ㄷ is digeut; hij heeft drie zijden.",
  "drill.town1FountainConsonants.3.incorrect": "De driezijdige ㄷ-vorm is digeut.",
  "drill.town1FountainConsonants.4.prompt": "De fontein toont ㅁ. Kies de letternaam.",
  "drill.town1FountainConsonants.4.correct": "ㅁ is mieum; het is een gesloten vierkant.",
  "drill.town1FountainConsonants.4.incorrect": "Het gesloten vierkant ㅁ is mieum.",
  "drill.town1FountainReview.title": "Fonteinherhaling",
  "drill.town1FountainReview.1.prompt": "Herhaling: welke klanknaam hoort bij ㅗ?",
  "drill.town1FountainReview.1.correct": "ㅗ is o.",
  "drill.town1FountainReview.1.incorrect": "De bovenste korte streep markeert o.",
  "drill.town1FountainReview.2.prompt": "Herhaling: welke naam hoort bij ㄴ?",
  "drill.town1FountainReview.2.correct": "ㄴ is nieun.",
  "drill.town1FountainReview.2.incorrect": "ㄴ heet nieun.",
  "drill.town1FountainReview.3.prompt": "Herhaling: welke klank is 가?",
  "drill.town1FountainReview.3.correct": "가 lees je als ga.",
  "drill.town1FountainReview.3.incorrect": "ㄱ plus ㅏ lees je als ga.",
  "drill.town1FountainReview.4.prompt": "Herhaling: welke klank is 무?",
  "drill.town1FountainReview.4.correct": "무 lees je als mu.",
  "drill.town1FountainReview.4.incorrect": "ㅁ plus ㅜ lees je als mu.",
  "drill.town1FountainVowels.title": "Fontein Klinkers 1",
  "drill.town1FountainVowels.1.prompt": "De fontein toont ㅏ. Kies de klanknaam.",
  "drill.town1FountainVowels.1.correct": "ㅏ lees je als a; de korte streep wijst naar rechts.",
  "drill.town1FountainVowels.1.incorrect": "Zoek de eenvoudige a-klank: ㅏ.",
  "drill.town1FountainVowels.2.prompt": "De fontein toont ㅓ. Kies de klanknaam.",
  "drill.town1FountainVowels.2.correct": "ㅓ lees je als eo; de korte streep wijst naar links.",
  "drill.town1FountainVowels.2.incorrect": "ㅓ is de eo-klank.",
  "drill.town1FountainVowels.3.prompt": "De fontein toont ㅗ. Kies de klanknaam.",
  "drill.town1FountainVowels.3.correct": "ㅗ lees je als o; de korte streep staat boven de lijn.",
  "drill.town1FountainVowels.3.incorrect": "ㅗ is de o-klank.",
  "drill.town1FountainVowels.4.prompt": "De fontein toont ㅜ. Kies de klanknaam.",
  "drill.town1FountainVowels.4.correct": "ㅜ lees je als u; de korte streep hangt onder de lijn.",
  "drill.town1FountainVowels.4.incorrect": "ㅜ is de u-klank.",
  "npc.hangulTeacher.line3": "Lees een wandkaart, oefen bij de fontein en kom dan terug naar het bord voor een controle.",
  "object.schoolBlackboard.complete.line1": "Op het bord staan nette vinkjes naast elke klascontrole van Stad 1.",
  "object.schoolBlackboard.locked.consonants": "Haal het fonteinlevel medeklinkers voordat je de medeklinkercontrole doet.",
  "object.schoolBlackboard.locked.syllables": "Oefen eerste lettergrepen aan een tafel voordat je deze controle doet.",
  "object.schoolBlackboard.locked.teacher": "Juf Seo wil eerst de volgorde in het lokaal uitleggen.",
  "object.schoolBlackboard.locked.vowels": "Haal het fonteinlevel klinkers voordat je de klinkercontrole doet.",
  "object.soundFountain.complete.line1": "De fontein staat nu in herhalingsmodus voor de klanken die je hebt vrijgespeeld.",
  "object.soundFountain.locked.consonants": "Lees de medeklinkerkaart in de school voordat je het volgende fonteinlevel start.",
  "object.soundFountain.locked.vowels": "Lees de klinkerkaart in de school voordat je de fonteintraining gebruikt.",
  "object.studentDesk.locked.consonants": "Haal het fonteinlevel medeklinkers voordat je hier lettergrepen combineert.",
  "object.studentDesk.locked.vowels": "Haal het fonteinlevel klinkers voordat je dit werkboek gebruikt.",
  "quest.town1.basicConsonants": "Basismedeklinkers",
  "quest.town1.basicConsonants.exam": "Haal bordmedeklinkers",
  "quest.town1.basicConsonants.practice": "Haal fonteinmedeklinkers",
  "quest.town1.basicConsonants.theory": "Lees medeklinkerkaart",
  "quest.town1.basicVowels": "Basisklinkers",
  "quest.town1.basicVowels.exam": "Haal bordklinkers",
  "quest.town1.basicVowels.practice": "Haal fonteinklinkers",
  "quest.town1.basicVowels.theory": "Lees klinkerkaart",
  "quest.town1.firstSyllables": "Eerste Lettergrepen",
  "quest.town1.firstSyllables.exam": "Haal bordlettergrepen",
  "quest.town1.firstSyllables.practice": "Oefen aan een tafel",
  "quest.town1.readingBadge": "Stad 1 Leesbadge",
  "quest.town1.readingBadge.ready": "Klascontroles voltooid",
});

Object.assign(TEXT.en, {
  "area.rivalGuesthouse": "Final Sound House",
  "drill.town1.choice.anj": "앉",
  "drill.town1.choice.b": "b",
  "drill.town1.choice.ch": "ch",
  "drill.town1.choice.chieutSign": "ㅊ",
  "drill.town1.choice.d": "d",
  "drill.town1.choice.dalk": "닭",
  "drill.town1.choice.finalK": "final k",
  "drill.town1.choice.finalN": "final n",
  "drill.town1.choice.finalP": "final p",
  "drill.town1.choice.firstFinal": "first final",
  "drill.town1.choice.g": "g",
  "drill.town1.choice.gan": "간",
  "drill.town1.choice.gap": "값",
  "drill.town1.choice.hasBatchim": "Has batchim",
  "drill.town1.choice.h": "h",
  "drill.town1.choice.hieutSign": "ㅎ",
  "drill.town1.choice.j": "j",
  "drill.town1.choice.k": "k",
  "drill.town1.choice.kieukSign": "ㅋ",
  "drill.town1.choice.mun": "문",
  "drill.town1.choice.noBatchim": "No batchim",
  "drill.town1.choice.p": "p",
  "drill.town1.choice.pieupSign": "ㅍ",
  "drill.town1.choice.secondFinal": "second final",
  "drill.town1.choice.t": "t",
  "drill.town1.choice.tieutSign": "ㅌ",
  "drill.town1.choice.wordDecides": "word decides",
  "drill.town1BlackboardAspirated.title": "Blackboard Aspirated Check",
  "drill.town1BlackboardAspirated.1.prompt": "Exam: Which sound fits ㅋ?",
  "drill.town1BlackboardAspirated.1.correct": "ㅋ is the aspirated k sound.",
  "drill.town1BlackboardAspirated.1.incorrect": "ㄱ plus the ㅎ breath leads to the stronger k sign ㅋ.",
  "drill.town1BlackboardAspirated.2.prompt": "Exam: Which aspirated sign comes from ㄷ + ㅎ?",
  "drill.town1BlackboardAspirated.2.correct": "ㄷ with ㅎ points to ㅌ.",
  "drill.town1BlackboardAspirated.2.incorrect": "The d-side consonant becomes the stronger t sign ㅌ.",
  "drill.town1BlackboardAspirated.3.prompt": "Exam: Which aspirated sign comes from ㅂ + ㅎ?",
  "drill.town1BlackboardAspirated.3.correct": "ㅂ with ㅎ points to ㅍ.",
  "drill.town1BlackboardAspirated.3.incorrect": "The b-side consonant becomes the stronger p sign ㅍ.",
  "drill.town1FountainAspirated.title": "Fountain Aspirated Signs",
  "drill.town1FountainAspirated.1.prompt": "The book shows ㄱ + ㅎ. Choose the aspirated sign.",
  "drill.town1FountainAspirated.1.correct": "ㄱ plus the ㅎ breath is shown by ㅋ, the k sound.",
  "drill.town1FountainAspirated.1.incorrect": "Look for ㅋ, the stronger sign related to ㄱ.",
  "drill.town1FountainAspirated.2.prompt": "The book shows ㄷ + ㅎ. Choose the aspirated sign.",
  "drill.town1FountainAspirated.2.correct": "ㄷ plus the ㅎ breath is shown by ㅌ.",
  "drill.town1FountainAspirated.2.incorrect": "Look for ㅌ, the stronger sign related to ㄷ.",
  "drill.town1FountainAspirated.3.prompt": "The book shows ㅂ + ㅎ. Choose the aspirated sign.",
  "drill.town1FountainAspirated.3.correct": "ㅂ plus the ㅎ breath is shown by ㅍ.",
  "drill.town1FountainAspirated.3.incorrect": "Look for ㅍ, the stronger sign related to ㅂ.",
  "drill.town1FountainAspirated.4.prompt": "The book shows ㅈ + ㅎ. Choose the aspirated sign.",
  "drill.town1FountainAspirated.4.correct": "ㅈ plus the ㅎ breath is shown by ㅊ.",
  "drill.town1FountainAspirated.4.incorrect": "Look for ㅊ, the stronger sign related to ㅈ.",
  "drill.town1FountainBatchimDouble.title": "Fountain Double Batchim",
  "drill.town1FountainBatchimDouble.1.prompt": "The note shows 앉 with ㄵ. In this word, which final sound is taught?",
  "drill.town1FountainBatchimDouble.1.correct": "앉 uses the first final ㄴ in this basic reading.",
  "drill.town1FountainBatchimDouble.1.incorrect": "For this first example, ㄵ points to the first final ㄴ.",
  "drill.town1FountainBatchimDouble.2.prompt": "The note shows 닭 with ㄺ. In this word, which final sound is taught?",
  "drill.town1FountainBatchimDouble.2.correct": "닭 uses the second final ㄱ in this basic reading.",
  "drill.town1FountainBatchimDouble.2.incorrect": "For this example, ㄺ points to the second final ㄱ.",
  "drill.town1FountainBatchimDouble.3.prompt": "What is the rule idea for double batchim?",
  "drill.town1FountainBatchimDouble.3.correct": "The word decides which final consonant you hear.",
  "drill.town1FountainBatchimDouble.3.incorrect": "Do not guess by shape only. The word decides.",
  "drill.town1FountainBatchimSingle.title": "Fountain First Batchim",
  "drill.town1FountainBatchimSingle.1.prompt": "Does 간 have a consonant under the block?",
  "drill.town1FountainBatchimSingle.1.correct": "간 has ㄴ under the block, so it has batchim.",
  "drill.town1FountainBatchimSingle.1.incorrect": "The bottom ㄴ is the final consonant.",
  "drill.town1FountainBatchimSingle.2.prompt": "What final sound does 문 use?",
  "drill.town1FountainBatchimSingle.2.correct": "문 ends with final ㄴ, read as final n.",
  "drill.town1FountainBatchimSingle.2.incorrect": "Look under the block: 문 has ㄴ at the bottom.",
  "drill.town1FountainBatchimSingle.3.prompt": "Which block has no batchim?",
  "drill.town1FountainBatchimSingle.3.correct": "나 has no consonant under the vowel.",
  "drill.town1FountainBatchimSingle.3.incorrect": "Batchim sits at the bottom. 나 has no bottom consonant.",
  "npc.doubleFinalLearner.afterNote.line1": "Practice the double-final examples at the fountain.",
  "npc.doubleFinalLearner.done.line1": "Double batchim takes review. For now, remember that the word decides.",
  "npc.doubleFinalLearner.intro.line1": "Some blocks have two consonants at the bottom.",
  "npc.doubleFinalLearner.intro.line2": "You do not always hear both. In each word, learn whether the first or second final is used.",
  "npc.doubleFinalLearner.locked.line1": "Practice the first batchim level before my double-final notes.",
  "npc.doubleFinalLearner.readNote.line1": "Read the double-final note on the bookcase, then return to the fountain.",
  "npc.finalSoundCoach.afterNote.line1": "Now use the fountain to practice finding final ㄴ.",
  "npc.finalSoundCoach.done.line1": "You can now spot the first final consonant under a block.",
  "npc.finalSoundCoach.intro.line1": "Welcome to the Final Sound House.",
  "npc.finalSoundCoach.intro.line2": "Batchim is a consonant placed under a syllable block. Start with final ㄴ.",
  "npc.finalSoundCoach.locked.line1": "Finish the double consonant check at school before starting batchim here.",
  "npc.finalSoundCoach.readNote.line1": "Read the desk note about final ㄴ, then practice at the fountain.",
  "npc.hangulTeacher.aspiratedBook.line1": "Read the aspirated consonant bookcase. It shows how ㅎ adds breath to familiar consonants.",
  "npc.hangulTeacher.aspiratedDone.line1": "Good. The next reading step is outside school at the Final Sound House.",
  "npc.hangulTeacher.aspiratedIntro.line1": "There is one more consonant family before batchim.",
  "npc.hangulTeacher.aspiratedIntro.line2": "The ㅎ sound adds breath. ㄱ with that breath becomes ㅋ, a stronger k sound.",
  "npc.hangulTeacher.aspiratedIntro.line3": "Read the aspirated consonant bookcase, then the fountain will show those signs.",
  "npc.hangulTeacher.aspiratedPractice.line1": "The fountain is ready for aspirated consonant practice.",
  "object.aspiratedBookcase": "Aspirated Sound Bookcase",
  "object.aspiratedBookcase.locked.line1": "Teacher Seo should introduce these special breath signs first.",
  "object.batchimDoubleNotebook": "Double-Final Note",
  "object.batchimDoubleNotebook.locked.line1": "The second learner will explain double batchim after your first final practice.",
  "object.batchimSingleNotebook": "Final ㄴ Note",
  "object.batchimSingleNotebook.locked.line1": "The Final Sound Coach should introduce batchim first.",
  "object.rivalGuesthouse": "Final Sound House",
  "object.rivalGuesthouse.door": "Final Sound House Door",
  "object.schoolBlackboard.locked.aspirated": "Practice the aspirated signs at the fountain before this check.",
  "object.soundFountain.locked.aspirated": "Teacher Seo has the next consonant lesson inside the school.",
  "object.soundFountain.locked.batchimDouble": "Return to the Final Sound House for the double-batchim note.",
  "object.soundFountain.locked.batchimSingle": "Visit the Final Sound House before starting batchim practice.",
  "quest.town1.aspiratedConsonants": "Aspirated Consonants",
  "quest.town1.aspiratedConsonants.book": "Read aspirated book",
  "quest.town1.aspiratedConsonants.exam": "Pass aspirated blackboard",
  "quest.town1.aspiratedConsonants.practice": "Pass fountain aspiration",
  "quest.town1.aspiratedConsonants.theory": "Talk to Teacher Seo",
  "quest.town1.doubleBatchim": "Double Batchim",
  "quest.town1.doubleBatchim.book": "Read double-final note",
  "quest.town1.doubleBatchim.practice": "Pass double-batchim fountain",
  "quest.town1.doubleBatchim.theory": "Talk to double-final learner",
  "quest.town1.singleBatchim": "First Batchim",
  "quest.town1.singleBatchim.book": "Read final ㄴ note",
  "quest.town1.singleBatchim.practice": "Pass final ㄴ fountain",
  "quest.town1.singleBatchim.theory": "Visit Final Sound House",
  "study.aspiratedConsonants.subtitle": "See how ㅎ breath makes stronger consonant signs.",
  "study.aspiratedConsonants.title": "Aspirated Consonants",
  "study.doubleBatchim.subtitle": "Double batchim depends on the word. Learn each first example.",
  "study.doubleBatchim.title": "Double Batchim",
  "study.singleBatchim.subtitle": "Batchim is a consonant under a syllable block.",
  "study.singleBatchim.title": "First Batchim: final ㄴ",
});

Object.assign(TEXT.ko, {
  "area.rivalGuesthouse": "끝소리 집",
  "drill.town1.choice.anj": "앉",
  "drill.town1.choice.b": "b",
  "drill.town1.choice.ch": "ch",
  "drill.town1.choice.chieutSign": "ㅊ",
  "drill.town1.choice.d": "d",
  "drill.town1.choice.dalk": "닭",
  "drill.town1.choice.finalK": "끝소리 k",
  "drill.town1.choice.finalN": "끝소리 n",
  "drill.town1.choice.finalP": "끝소리 p",
  "drill.town1.choice.firstFinal": "첫 번째 받침",
  "drill.town1.choice.g": "g",
  "drill.town1.choice.gan": "간",
  "drill.town1.choice.gap": "값",
  "drill.town1.choice.hasBatchim": "받침 있음",
  "drill.town1.choice.h": "h",
  "drill.town1.choice.hieutSign": "ㅎ",
  "drill.town1.choice.j": "j",
  "drill.town1.choice.k": "k",
  "drill.town1.choice.kieukSign": "ㅋ",
  "drill.town1.choice.mun": "문",
  "drill.town1.choice.noBatchim": "받침 없음",
  "drill.town1.choice.p": "p",
  "drill.town1.choice.pieupSign": "ㅍ",
  "drill.town1.choice.secondFinal": "두 번째 받침",
  "drill.town1.choice.t": "t",
  "drill.town1.choice.tieutSign": "ㅌ",
  "drill.town1.choice.wordDecides": "단어마다 다름",
  "drill.town1BlackboardAspirated.title": "칠판 거센소리 확인",
  "drill.town1BlackboardAspirated.1.prompt": "시험: ㅋ에 맞는 소리는 무엇인가요?",
  "drill.town1BlackboardAspirated.1.correct": "ㅋ은 거센 k 소리입니다.",
  "drill.town1BlackboardAspirated.1.incorrect": "ㄱ에 ㅎ의 숨이 더해지면 더 센 k 표시 ㅋ이 됩니다.",
  "drill.town1BlackboardAspirated.2.prompt": "시험: ㄷ + ㅎ에서 나온 거센소리 글자는 무엇인가요?",
  "drill.town1BlackboardAspirated.2.correct": "ㄷ에 ㅎ이 더해지면 ㅌ을 떠올립니다.",
  "drill.town1BlackboardAspirated.2.incorrect": "d 쪽 자음은 더 센 t 표시 ㅌ이 됩니다.",
  "drill.town1BlackboardAspirated.3.prompt": "시험: ㅂ + ㅎ에서 나온 거센소리 글자는 무엇인가요?",
  "drill.town1BlackboardAspirated.3.correct": "ㅂ에 ㅎ이 더해지면 ㅍ을 떠올립니다.",
  "drill.town1BlackboardAspirated.3.incorrect": "b 쪽 자음은 더 센 p 표시 ㅍ이 됩니다.",
  "drill.town1FountainAspirated.title": "분수 거센소리",
  "drill.town1FountainAspirated.1.prompt": "책에 ㄱ + ㅎ이 보입니다. 거센소리 글자를 고르세요.",
  "drill.town1FountainAspirated.1.correct": "ㄱ에 ㅎ의 숨이 더해지면 k 소리 ㅋ으로 보입니다.",
  "drill.town1FountainAspirated.1.incorrect": "ㄱ과 관련된 더 센 표시 ㅋ을 찾으세요.",
  "drill.town1FountainAspirated.2.prompt": "책에 ㄷ + ㅎ이 보입니다. 거센소리 글자를 고르세요.",
  "drill.town1FountainAspirated.2.correct": "ㄷ에 ㅎ의 숨이 더해지면 ㅌ으로 보입니다.",
  "drill.town1FountainAspirated.2.incorrect": "ㄷ과 관련된 더 센 표시 ㅌ을 찾으세요.",
  "drill.town1FountainAspirated.3.prompt": "책에 ㅂ + ㅎ이 보입니다. 거센소리 글자를 고르세요.",
  "drill.town1FountainAspirated.3.correct": "ㅂ에 ㅎ의 숨이 더해지면 ㅍ으로 보입니다.",
  "drill.town1FountainAspirated.3.incorrect": "ㅂ과 관련된 더 센 표시 ㅍ을 찾으세요.",
  "drill.town1FountainAspirated.4.prompt": "책에 ㅈ + ㅎ이 보입니다. 거센소리 글자를 고르세요.",
  "drill.town1FountainAspirated.4.correct": "ㅈ에 ㅎ의 숨이 더해지면 ㅊ으로 보입니다.",
  "drill.town1FountainAspirated.4.incorrect": "ㅈ과 관련된 더 센 표시 ㅊ을 찾으세요.",
  "drill.town1FountainBatchimDouble.title": "분수 겹받침",
  "drill.town1FountainBatchimDouble.1.prompt": "노트에 ㄵ이 있는 앉이 보입니다. 이 단어에서는 어떤 끝소리를 배웠나요?",
  "drill.town1FountainBatchimDouble.1.correct": "앉은 이 기본 읽기에서 첫 번째 ㄴ 받침을 씁니다.",
  "drill.town1FountainBatchimDouble.1.incorrect": "이 첫 예시는 ㄵ에서 첫 번째 ㄴ을 봅니다.",
  "drill.town1FountainBatchimDouble.2.prompt": "노트에 ㄺ이 있는 닭이 보입니다. 이 단어에서는 어떤 끝소리를 배웠나요?",
  "drill.town1FountainBatchimDouble.2.correct": "닭은 이 기본 읽기에서 두 번째 ㄱ 받침을 씁니다.",
  "drill.town1FountainBatchimDouble.2.incorrect": "이 예시는 ㄺ에서 두 번째 ㄱ을 봅니다.",
  "drill.town1FountainBatchimDouble.3.prompt": "겹받침의 기본 생각은 무엇인가요?",
  "drill.town1FountainBatchimDouble.3.correct": "어떤 끝소리가 들리는지는 단어마다 배웁니다.",
  "drill.town1FountainBatchimDouble.3.incorrect": "모양만 보고 추측하지 마세요. 단어마다 다릅니다.",
  "drill.town1FountainBatchimSingle.title": "분수 첫 받침",
  "drill.town1FountainBatchimSingle.1.prompt": "간에는 글자 아래 자음이 있나요?",
  "drill.town1FountainBatchimSingle.1.correct": "간에는 아래에 ㄴ이 있어서 받침이 있습니다.",
  "drill.town1FountainBatchimSingle.1.incorrect": "아래 ㄴ이 끝 자음입니다.",
  "drill.town1FountainBatchimSingle.2.prompt": "문은 어떤 끝소리를 쓰나요?",
  "drill.town1FountainBatchimSingle.2.correct": "문은 끝 ㄴ으로 끝나며 final n으로 읽습니다.",
  "drill.town1FountainBatchimSingle.2.incorrect": "글자 아래를 보세요. 문에는 아래에 ㄴ이 있습니다.",
  "drill.town1FountainBatchimSingle.3.prompt": "어떤 글자에 받침이 없나요?",
  "drill.town1FountainBatchimSingle.3.correct": "나는 모음 아래 자음이 없습니다.",
  "drill.town1FountainBatchimSingle.3.incorrect": "받침은 아래에 있습니다. 나에는 아래 자음이 없습니다.",
  "npc.doubleFinalLearner.afterNote.line1": "분수에서 겹받침 예시를 연습하세요.",
  "npc.doubleFinalLearner.done.line1": "겹받침은 복습이 필요합니다. 지금은 단어마다 다르다는 것을 기억하세요.",
  "npc.doubleFinalLearner.intro.line1": "어떤 글자는 아래에 자음이 두 개 있습니다.",
  "npc.doubleFinalLearner.intro.line2": "항상 둘 다 들리지는 않습니다. 단어마다 첫 번째인지 두 번째인지 배웁니다.",
  "npc.doubleFinalLearner.locked.line1": "제 겹받침 노트 전에 첫 받침 단계를 연습하세요.",
  "npc.doubleFinalLearner.readNote.line1": "책장의 겹받침 노트를 읽고 분수로 돌아가세요.",
  "npc.finalSoundCoach.afterNote.line1": "이제 분수에서 끝 ㄴ 찾기를 연습하세요.",
  "npc.finalSoundCoach.done.line1": "이제 글자 아래의 첫 끝 자음을 찾을 수 있습니다.",
  "npc.finalSoundCoach.intro.line1": "끝소리 집에 오신 것을 환영합니다.",
  "npc.finalSoundCoach.intro.line2": "받침은 글자 아래에 놓인 자음입니다. 끝 ㄴ부터 시작하세요.",
  "npc.finalSoundCoach.locked.line1": "여기서 받침을 시작하기 전에 학교의 쌍자음 확인을 끝내세요.",
  "npc.finalSoundCoach.readNote.line1": "끝 ㄴ 책상 노트를 읽고 분수에서 연습하세요.",
  "npc.hangulTeacher.aspiratedBook.line1": "거센소리 책장을 읽으세요. ㅎ이 익숙한 자음에 숨을 더하는 모습을 보여 줍니다.",
  "npc.hangulTeacher.aspiratedDone.line1": "좋아요. 다음 읽기 단계는 학교 밖의 끝소리 집입니다.",
  "npc.hangulTeacher.aspiratedIntro.line1": "받침 전에 자음 가족이 하나 더 있습니다.",
  "npc.hangulTeacher.aspiratedIntro.line2": "ㅎ 소리는 숨을 더합니다. ㄱ에 그 숨이 더해지면 더 센 k 소리 ㅋ이 됩니다.",
  "npc.hangulTeacher.aspiratedIntro.line3": "거센소리 책장을 읽으면 분수가 그 글자들을 보여 줄 것입니다.",
  "npc.hangulTeacher.aspiratedPractice.line1": "분수가 거센소리 연습을 준비했습니다.",
  "object.aspiratedBookcase": "거센소리 책장",
  "object.aspiratedBookcase.locked.line1": "서 선생님이 먼저 특별한 숨소리 글자를 소개해야 합니다.",
  "object.batchimDoubleNotebook": "겹받침 노트",
  "object.batchimDoubleNotebook.locked.line1": "두 번째 학습자가 첫 받침 연습 뒤에 겹받침을 설명합니다.",
  "object.batchimSingleNotebook": "끝 ㄴ 노트",
  "object.batchimSingleNotebook.locked.line1": "끝소리 선생님이 먼저 받침을 소개해야 합니다.",
  "object.rivalGuesthouse": "끝소리 집",
  "object.rivalGuesthouse.door": "끝소리 집 문",
  "object.schoolBlackboard.locked.aspirated": "이 확인 전에 분수에서 거센소리를 연습하세요.",
  "object.soundFountain.locked.aspirated": "다음 자음 수업은 학교 안의 서 선생님에게 있습니다.",
  "object.soundFountain.locked.batchimDouble": "겹받침 노트를 보려면 끝소리 집으로 돌아가세요.",
  "object.soundFountain.locked.batchimSingle": "받침 연습을 시작하기 전에 끝소리 집을 방문하세요.",
  "quest.town1.aspiratedConsonants": "거센소리 자음",
  "quest.town1.aspiratedConsonants.book": "거센소리 책 읽기",
  "quest.town1.aspiratedConsonants.exam": "칠판 거센소리 통과",
  "quest.town1.aspiratedConsonants.practice": "분수 거센소리 통과",
  "quest.town1.aspiratedConsonants.theory": "서 선생님과 대화",
  "quest.town1.doubleBatchim": "겹받침",
  "quest.town1.doubleBatchim.book": "겹받침 노트 읽기",
  "quest.town1.doubleBatchim.practice": "분수 겹받침 통과",
  "quest.town1.doubleBatchim.theory": "겹받침 학습자와 대화",
  "quest.town1.singleBatchim": "첫 받침",
  "quest.town1.singleBatchim.book": "끝 ㄴ 노트 읽기",
  "quest.town1.singleBatchim.practice": "분수 끝 ㄴ 통과",
  "quest.town1.singleBatchim.theory": "끝소리 집 방문",
  "study.aspiratedConsonants.subtitle": "ㅎ의 숨이 더 센 자음 글자를 만드는 모습을 봅니다.",
  "study.aspiratedConsonants.title": "거센소리 자음",
  "study.doubleBatchim.subtitle": "겹받침은 단어마다 다릅니다. 첫 예시를 배워 보세요.",
  "study.doubleBatchim.title": "겹받침",
  "study.singleBatchim.subtitle": "받침은 글자 아래에 있는 자음입니다.",
  "study.singleBatchim.title": "첫 받침: 끝 ㄴ",
});

Object.assign(TEXT.nl, {
  "area.rivalGuesthouse": "Eindklankhuis",
  "drill.town1.choice.anj": "앉",
  "drill.town1.choice.b": "b",
  "drill.town1.choice.ch": "ch",
  "drill.town1.choice.chieutSign": "ㅊ",
  "drill.town1.choice.d": "d",
  "drill.town1.choice.dalk": "닭",
  "drill.town1.choice.finalK": "eind-k",
  "drill.town1.choice.finalN": "eind-n",
  "drill.town1.choice.finalP": "eind-p",
  "drill.town1.choice.firstFinal": "eerste eindklank",
  "drill.town1.choice.g": "g",
  "drill.town1.choice.gan": "간",
  "drill.town1.choice.gap": "값",
  "drill.town1.choice.hasBatchim": "Heeft batchim",
  "drill.town1.choice.h": "h",
  "drill.town1.choice.hieutSign": "ㅎ",
  "drill.town1.choice.j": "j",
  "drill.town1.choice.k": "k",
  "drill.town1.choice.kieukSign": "ㅋ",
  "drill.town1.choice.mun": "문",
  "drill.town1.choice.noBatchim": "Geen batchim",
  "drill.town1.choice.p": "p",
  "drill.town1.choice.pieupSign": "ㅍ",
  "drill.town1.choice.secondFinal": "tweede eindklank",
  "drill.town1.choice.t": "t",
  "drill.town1.choice.tieutSign": "ㅌ",
  "drill.town1.choice.wordDecides": "woord beslist",
  "drill.town1BlackboardAspirated.title": "Bordcontrole Aangeblazen Klanken",
  "drill.town1BlackboardAspirated.1.prompt": "Toets: welke klank hoort bij ㅋ?",
  "drill.town1BlackboardAspirated.1.correct": "ㅋ is de aangeblazen k-klank.",
  "drill.town1BlackboardAspirated.1.incorrect": "ㄱ plus de ㅎ-adem leidt naar het sterkere k-teken ㅋ.",
  "drill.town1BlackboardAspirated.2.prompt": "Toets: welk aangeblazen teken komt van ㄷ + ㅎ?",
  "drill.town1BlackboardAspirated.2.correct": "ㄷ met ㅎ wijst naar ㅌ.",
  "drill.town1BlackboardAspirated.2.incorrect": "De d-kant wordt het sterkere t-teken ㅌ.",
  "drill.town1BlackboardAspirated.3.prompt": "Toets: welk aangeblazen teken komt van ㅂ + ㅎ?",
  "drill.town1BlackboardAspirated.3.correct": "ㅂ met ㅎ wijst naar ㅍ.",
  "drill.town1BlackboardAspirated.3.incorrect": "De b-kant wordt het sterkere p-teken ㅍ.",
  "drill.town1FountainAspirated.title": "Fontein Aangeblazen Tekens",
  "drill.town1FountainAspirated.1.prompt": "Het boek toont ㄱ + ㅎ. Kies het aangeblazen teken.",
  "drill.town1FountainAspirated.1.correct": "ㄱ plus de ㅎ-adem wordt getoond door ㅋ, de k-klank.",
  "drill.town1FountainAspirated.1.incorrect": "Zoek ㅋ, het sterkere teken dat bij ㄱ hoort.",
  "drill.town1FountainAspirated.2.prompt": "Het boek toont ㄷ + ㅎ. Kies het aangeblazen teken.",
  "drill.town1FountainAspirated.2.correct": "ㄷ plus de ㅎ-adem wordt getoond door ㅌ.",
  "drill.town1FountainAspirated.2.incorrect": "Zoek ㅌ, het sterkere teken dat bij ㄷ hoort.",
  "drill.town1FountainAspirated.3.prompt": "Het boek toont ㅂ + ㅎ. Kies het aangeblazen teken.",
  "drill.town1FountainAspirated.3.correct": "ㅂ plus de ㅎ-adem wordt getoond door ㅍ.",
  "drill.town1FountainAspirated.3.incorrect": "Zoek ㅍ, het sterkere teken dat bij ㅂ hoort.",
  "drill.town1FountainAspirated.4.prompt": "Het boek toont ㅈ + ㅎ. Kies het aangeblazen teken.",
  "drill.town1FountainAspirated.4.correct": "ㅈ plus de ㅎ-adem wordt getoond door ㅊ.",
  "drill.town1FountainAspirated.4.incorrect": "Zoek ㅊ, het sterkere teken dat bij ㅈ hoort.",
  "drill.town1FountainBatchimDouble.title": "Fontein Dubbele Batchim",
  "drill.town1FountainBatchimDouble.1.prompt": "De notitie toont 앉 met ㄵ. Welke eindklank leer je in dit woord?",
  "drill.town1FountainBatchimDouble.1.correct": "앉 gebruikt in deze basislezing de eerste eindklank ㄴ.",
  "drill.town1FountainBatchimDouble.1.incorrect": "In dit eerste voorbeeld wijst ㄵ naar de eerste eindklank ㄴ.",
  "drill.town1FountainBatchimDouble.2.prompt": "De notitie toont 닭 met ㄺ. Welke eindklank leer je in dit woord?",
  "drill.town1FountainBatchimDouble.2.correct": "닭 gebruikt in deze basislezing de tweede eindklank ㄱ.",
  "drill.town1FountainBatchimDouble.2.incorrect": "In dit voorbeeld wijst ㄺ naar de tweede eindklank ㄱ.",
  "drill.town1FountainBatchimDouble.3.prompt": "Wat is het idee bij dubbele batchim?",
  "drill.town1FountainBatchimDouble.3.correct": "Het woord beslist welke eindmedeklinker je hoort.",
  "drill.town1FountainBatchimDouble.3.incorrect": "Raad niet alleen op vorm. Het woord beslist.",
  "drill.town1FountainBatchimSingle.title": "Fontein Eerste Batchim",
  "drill.town1FountainBatchimSingle.1.prompt": "Heeft 간 een medeklinker onder het blok?",
  "drill.town1FountainBatchimSingle.1.correct": "간 heeft ㄴ onder het blok, dus het heeft batchim.",
  "drill.town1FountainBatchimSingle.1.incorrect": "De onderste ㄴ is de eindmedeklinker.",
  "drill.town1FountainBatchimSingle.2.prompt": "Welke eindklank gebruikt 문?",
  "drill.town1FountainBatchimSingle.2.correct": "문 eindigt met eind-ㄴ, gelezen als eind-n.",
  "drill.town1FountainBatchimSingle.2.incorrect": "Kijk onder het blok: 문 heeft ㄴ onderaan.",
  "drill.town1FountainBatchimSingle.3.prompt": "Welk blok heeft geen batchim?",
  "drill.town1FountainBatchimSingle.3.correct": "나 heeft geen medeklinker onder de klinker.",
  "drill.town1FountainBatchimSingle.3.incorrect": "Batchim staat onderaan. 나 heeft geen onderste medeklinker.",
  "npc.doubleFinalLearner.afterNote.line1": "Oefen de dubbele-eindklankvoorbeelden bij de fontein.",
  "npc.doubleFinalLearner.done.line1": "Dubbele batchim vraagt herhaling. Onthoud nu dat het woord beslist.",
  "npc.doubleFinalLearner.intro.line1": "Sommige blokken hebben twee medeklinkers onderaan.",
  "npc.doubleFinalLearner.intro.line2": "Je hoort niet altijd beide. Per woord leer je of de eerste of tweede eindklank telt.",
  "npc.doubleFinalLearner.locked.line1": "Oefen het eerste batchimlevel voor mijn dubbele-eindklanknotities.",
  "npc.doubleFinalLearner.readNote.line1": "Lees de dubbele-eindklanknotitie op de boekenkast en ga dan naar de fontein.",
  "npc.finalSoundCoach.afterNote.line1": "Gebruik nu de fontein om eind-ㄴ te vinden.",
  "npc.finalSoundCoach.done.line1": "Je kunt nu de eerste eindmedeklinker onder een blok vinden.",
  "npc.finalSoundCoach.intro.line1": "Welkom in het Eindklankhuis.",
  "npc.finalSoundCoach.intro.line2": "Batchim is een medeklinker onder een lettergreepblok. Begin met eind-ㄴ.",
  "npc.finalSoundCoach.locked.line1": "Rond op school de controle van dubbele medeklinkers af voordat je hier batchim start.",
  "npc.finalSoundCoach.readNote.line1": "Lees de tafelnotitie over eind-ㄴ en oefen daarna bij de fontein.",
  "npc.hangulTeacher.aspiratedBook.line1": "Lees de boekenkast met aangeblazen klanken. Die toont hoe ㅎ adem toevoegt aan bekende medeklinkers.",
  "npc.hangulTeacher.aspiratedDone.line1": "Goed. De volgende leesstap is buiten school in het Eindklankhuis.",
  "npc.hangulTeacher.aspiratedIntro.line1": "Er is nog een medeklinkerfamilie voor batchim.",
  "npc.hangulTeacher.aspiratedIntro.line2": "De ㅎ-klank voegt adem toe. ㄱ met die adem wordt ㅋ, een sterkere k-klank.",
  "npc.hangulTeacher.aspiratedIntro.line3": "Lees de boekenkast met aangeblazen klanken; daarna toont de fontein die tekens.",
  "npc.hangulTeacher.aspiratedPractice.line1": "De fontein is klaar voor oefening met aangeblazen medeklinkers.",
  "object.aspiratedBookcase": "Boekenkast Aangeblazen Klanken",
  "object.aspiratedBookcase.locked.line1": "Juf Seo moet deze speciale ademtekens eerst introduceren.",
  "object.batchimDoubleNotebook": "Dubbele-Eindklanknotitie",
  "object.batchimDoubleNotebook.locked.line1": "De tweede leerling legt dubbele batchim uit na je eerste eindklankoefening.",
  "object.batchimSingleNotebook": "Eind-ㄴ-notitie",
  "object.batchimSingleNotebook.locked.line1": "De Eindklankcoach moet batchim eerst introduceren.",
  "object.rivalGuesthouse": "Eindklankhuis",
  "object.rivalGuesthouse.door": "Deur van het Eindklankhuis",
  "object.schoolBlackboard.locked.aspirated": "Oefen de aangeblazen tekens bij de fontein voor deze controle.",
  "object.soundFountain.locked.aspirated": "Juf Seo heeft de volgende medeklinkerles in de school.",
  "object.soundFountain.locked.batchimDouble": "Ga terug naar het Eindklankhuis voor de dubbele-batchimnotitie.",
  "object.soundFountain.locked.batchimSingle": "Bezoek het Eindklankhuis voordat je batchim oefent.",
  "quest.town1.aspiratedConsonants": "Aangeblazen Medeklinkers",
  "quest.town1.aspiratedConsonants.book": "Lees aangeblazen boek",
  "quest.town1.aspiratedConsonants.exam": "Haal aangeblazen bord",
  "quest.town1.aspiratedConsonants.practice": "Haal fonteinaangeblazen",
  "quest.town1.aspiratedConsonants.theory": "Praat met Juf Seo",
  "quest.town1.doubleBatchim": "Dubbele Batchim",
  "quest.town1.doubleBatchim.book": "Lees dubbele-eindklanknotitie",
  "quest.town1.doubleBatchim.practice": "Haal dubbele-batchimfontein",
  "quest.town1.doubleBatchim.theory": "Praat met dubbele-eindklankleerling",
  "quest.town1.singleBatchim": "Eerste Batchim",
  "quest.town1.singleBatchim.book": "Lees eind-ㄴ-notitie",
  "quest.town1.singleBatchim.practice": "Haal eind-ㄴ-fontein",
  "quest.town1.singleBatchim.theory": "Bezoek Eindklankhuis",
  "study.aspiratedConsonants.subtitle": "Zie hoe ㅎ-adem sterkere medeklinkertekens maakt.",
  "study.aspiratedConsonants.title": "Aangeblazen Medeklinkers",
  "study.doubleBatchim.subtitle": "Dubbele batchim hangt af van het woord. Leer elk eerste voorbeeld.",
  "study.doubleBatchim.title": "Dubbele Batchim",
  "study.singleBatchim.subtitle": "Batchim is een medeklinker onder een lettergreepblok.",
  "study.singleBatchim.title": "Eerste Batchim: eind-ㄴ",
});

Object.assign(TEXT.en, {
  "drill.town1.choice.jj": "jj",
  "drill.town1.choice.kk": "kk",
  "drill.town1.choice.naBlock": "나",
  "drill.town1.choice.pp": "pp",
  "drill.town1.choice.ss": "ss",
  "drill.town1.choice.ssangBieupSign": "ㅃ",
  "drill.town1.choice.ssangDigeutSign": "ㄸ",
  "drill.town1.choice.ssangGiyeokSign": "ㄲ",
  "drill.town1.choice.ssangJieutSign": "ㅉ",
  "drill.town1.choice.ssangSiotSign": "ㅆ",
  "drill.town1.choice.tt": "tt",
  "drill.town1BlackboardDoubleConsonants.title": "Blackboard Double Consonant Check",
  "drill.town1BlackboardDoubleConsonants.1.prompt": "Exam: Which sound fits ㄲ?",
  "drill.town1BlackboardDoubleConsonants.1.correct": "ㄲ is the double ㄱ sign, read here as kk.",
  "drill.town1BlackboardDoubleConsonants.1.incorrect": "Look for the tense doubled sound: ㄲ is kk.",
  "drill.town1BlackboardDoubleConsonants.2.prompt": "Exam: Which double sign comes from ㄷ + ㄷ?",
  "drill.town1BlackboardDoubleConsonants.2.correct": "ㄷ doubled becomes ㄸ.",
  "drill.town1BlackboardDoubleConsonants.2.incorrect": "Double the ㄷ shape to make ㄸ.",
  "drill.town1BlackboardDoubleConsonants.3.prompt": "Exam: Which double sign comes from ㅅ + ㅅ?",
  "drill.town1BlackboardDoubleConsonants.3.correct": "ㅅ doubled becomes ㅆ.",
  "drill.town1BlackboardDoubleConsonants.3.incorrect": "Two ㅅ signs together make ㅆ.",
  "drill.town1FountainDoubleConsonants.title": "Fountain Double Consonants",
  "drill.town1FountainDoubleConsonants.1.prompt": "The book shows ㄱ + ㄱ. Choose the double sign.",
  "drill.town1FountainDoubleConsonants.1.correct": "ㄱ doubled is ㄲ, practiced here as kk.",
  "drill.town1FountainDoubleConsonants.1.incorrect": "Look for two ㄱ strokes together: ㄲ.",
  "drill.town1FountainDoubleConsonants.2.prompt": "The book shows ㄷ + ㄷ. Choose the double sign.",
  "drill.town1FountainDoubleConsonants.2.correct": "ㄷ doubled is ㄸ, practiced here as tt.",
  "drill.town1FountainDoubleConsonants.2.incorrect": "Look for the doubled ㄷ shape: ㄸ.",
  "drill.town1FountainDoubleConsonants.3.prompt": "The book shows ㅂ + ㅂ. Choose the double sign.",
  "drill.town1FountainDoubleConsonants.3.correct": "ㅂ doubled is ㅃ, practiced here as pp.",
  "drill.town1FountainDoubleConsonants.3.incorrect": "Look for the doubled ㅂ shape: ㅃ.",
  "drill.town1FountainDoubleConsonants.4.prompt": "The book shows ㅅ + ㅅ. Choose the double sign.",
  "drill.town1FountainDoubleConsonants.4.correct": "ㅅ doubled is ㅆ, practiced here as ss.",
  "drill.town1FountainDoubleConsonants.4.incorrect": "Look for the doubled ㅅ shape: ㅆ.",
  "drill.town1FountainDoubleConsonants.5.prompt": "The book shows ㅈ + ㅈ. Choose the double sign.",
  "drill.town1FountainDoubleConsonants.5.correct": "ㅈ doubled is ㅉ, practiced here as jj.",
  "drill.town1FountainDoubleConsonants.5.incorrect": "Look for the doubled ㅈ shape: ㅉ.",
  "npc.hangulTeacher.doubleConsonantBook.line1": "Read the double consonant bookcase. It shows how familiar signs become tense double signs.",
  "npc.hangulTeacher.doubleConsonantDone.line1": "Good. You have now checked the school consonant alphabet. The next step is final sounds.",
  "npc.hangulTeacher.doubleConsonantIntro.line1": "One more school alphabet lesson remains.",
  "npc.hangulTeacher.doubleConsonantIntro.line2": "Some consonants can be doubled: ㄱ becomes ㄲ, and ㄷ becomes ㄸ.",
  "npc.hangulTeacher.doubleConsonantIntro.line3": "Read the double consonant bookcase, then practice those signs at the fountain.",
  "npc.hangulTeacher.doubleConsonantPractice.line1": "The fountain is ready for double consonant practice.",
  "npc.rivalDad": "Final Sound Coach",
  "npc.rivalStudent": "Double-Final Learner",
  "object.doubleConsonantBookcase": "Double Consonant Bookcase",
  "object.doubleConsonantBookcase.locked.line1": "Teacher Seo should introduce these doubled signs first.",
  "object.schoolBlackboard.locked.doubleConsonants": "Practice the double consonants at the fountain before this check.",
  "object.soundFountain.locked.doubleConsonants": "Teacher Seo has the final school alphabet lesson inside the school.",
  "quest.town1.doubleConsonants": "Double Consonants",
  "quest.town1.doubleConsonants.book": "Read double-consonant book",
  "quest.town1.doubleConsonants.exam": "Pass double-consonant blackboard",
  "quest.town1.doubleConsonants.practice": "Pass double-consonant fountain",
  "quest.town1.doubleConsonants.theory": "Talk to Teacher Seo",
  "quest.town1.readingBadge.ready": "Final sound practice complete",
  "study.aspiratedConsonants.entry.bieup": "ㅂ + ㅎ -> ㅍ p",
  "study.aspiratedConsonants.entry.digeut": "ㄷ + ㅎ -> ㅌ t",
  "study.aspiratedConsonants.entry.giyeok": "ㄱ + ㅎ -> ㅋ k",
  "study.aspiratedConsonants.entry.hieut": "ㅎ breath",
  "study.aspiratedConsonants.entry.jieut": "ㅈ + ㅎ -> ㅊ ch",
  "study.doubleBatchim.entry.anj": "ㄵ -> first ㄴ",
  "study.doubleBatchim.entry.dalk": "ㄺ -> second ㄱ",
  "study.doubleBatchim.entry.gap": "ㅄ -> first ㅂ",
  "study.doubleBatchim.entry.rule": "word decides",
  "study.doubleConsonants.entry.bieup": "ㅂ + ㅂ -> ㅃ pp",
  "study.doubleConsonants.entry.digeut": "ㄷ + ㄷ -> ㄸ tt",
  "study.doubleConsonants.entry.giyeok": "ㄱ + ㄱ -> ㄲ kk",
  "study.doubleConsonants.entry.jieut": "ㅈ + ㅈ -> ㅉ jj",
  "study.doubleConsonants.entry.siot": "ㅅ + ㅅ -> ㅆ ss",
  "study.doubleConsonants.subtitle": "See how familiar consonants double into tense signs.",
  "study.doubleConsonants.title": "Double Consonants",
  "study.singleBatchim.entry.gan": "bottom ㄴ -> final n",
  "study.singleBatchim.entry.mun": "bottom ㄴ -> final n",
  "study.singleBatchim.entry.na": "no bottom consonant",
});

Object.assign(TEXT.ko, {
  "drill.town1.choice.jj": "jj",
  "drill.town1.choice.kk": "kk",
  "drill.town1.choice.naBlock": "나",
  "drill.town1.choice.pp": "pp",
  "drill.town1.choice.ss": "ss",
  "drill.town1.choice.ssangBieupSign": "ㅃ",
  "drill.town1.choice.ssangDigeutSign": "ㄸ",
  "drill.town1.choice.ssangGiyeokSign": "ㄲ",
  "drill.town1.choice.ssangJieutSign": "ㅉ",
  "drill.town1.choice.ssangSiotSign": "ㅆ",
  "drill.town1.choice.tt": "tt",
  "drill.town1BlackboardDoubleConsonants.title": "칠판 쌍자음 확인",
  "drill.town1BlackboardDoubleConsonants.1.prompt": "시험: ㄲ에 맞는 소리는 무엇인가요?",
  "drill.town1BlackboardDoubleConsonants.1.correct": "ㄲ은 ㄱ을 두 번 쓴 글자로, 여기서는 kk로 연습합니다.",
  "drill.town1BlackboardDoubleConsonants.1.incorrect": "된소리 쌍자음을 찾으세요. ㄲ은 kk입니다.",
  "drill.town1BlackboardDoubleConsonants.2.prompt": "시험: ㄷ + ㄷ에서 나온 쌍자음은 무엇인가요?",
  "drill.town1BlackboardDoubleConsonants.2.correct": "ㄷ을 두 번 쓰면 ㄸ이 됩니다.",
  "drill.town1BlackboardDoubleConsonants.2.incorrect": "ㄷ 모양을 두 번 써서 ㄸ을 만듭니다.",
  "drill.town1BlackboardDoubleConsonants.3.prompt": "시험: ㅅ + ㅅ에서 나온 쌍자음은 무엇인가요?",
  "drill.town1BlackboardDoubleConsonants.3.correct": "ㅅ을 두 번 쓰면 ㅆ이 됩니다.",
  "drill.town1BlackboardDoubleConsonants.3.incorrect": "ㅅ 두 개가 함께 있으면 ㅆ입니다.",
  "drill.town1FountainDoubleConsonants.title": "분수 쌍자음",
  "drill.town1FountainDoubleConsonants.1.prompt": "책에 ㄱ + ㄱ이 보입니다. 쌍자음을 고르세요.",
  "drill.town1FountainDoubleConsonants.1.correct": "ㄱ을 두 번 쓰면 ㄲ이고, 여기서는 kk로 연습합니다.",
  "drill.town1FountainDoubleConsonants.1.incorrect": "ㄱ 두 개가 함께 있는 ㄲ을 찾으세요.",
  "drill.town1FountainDoubleConsonants.2.prompt": "책에 ㄷ + ㄷ이 보입니다. 쌍자음을 고르세요.",
  "drill.town1FountainDoubleConsonants.2.correct": "ㄷ을 두 번 쓰면 ㄸ이고, 여기서는 tt로 연습합니다.",
  "drill.town1FountainDoubleConsonants.2.incorrect": "ㄷ 모양이 두 번 있는 ㄸ을 찾으세요.",
  "drill.town1FountainDoubleConsonants.3.prompt": "책에 ㅂ + ㅂ이 보입니다. 쌍자음을 고르세요.",
  "drill.town1FountainDoubleConsonants.3.correct": "ㅂ을 두 번 쓰면 ㅃ이고, 여기서는 pp로 연습합니다.",
  "drill.town1FountainDoubleConsonants.3.incorrect": "ㅂ 모양이 두 번 있는 ㅃ을 찾으세요.",
  "drill.town1FountainDoubleConsonants.4.prompt": "책에 ㅅ + ㅅ이 보입니다. 쌍자음을 고르세요.",
  "drill.town1FountainDoubleConsonants.4.correct": "ㅅ을 두 번 쓰면 ㅆ이고, 여기서는 ss로 연습합니다.",
  "drill.town1FountainDoubleConsonants.4.incorrect": "ㅅ 모양이 두 번 있는 ㅆ을 찾으세요.",
  "drill.town1FountainDoubleConsonants.5.prompt": "책에 ㅈ + ㅈ이 보입니다. 쌍자음을 고르세요.",
  "drill.town1FountainDoubleConsonants.5.correct": "ㅈ을 두 번 쓰면 ㅉ이고, 여기서는 jj로 연습합니다.",
  "drill.town1FountainDoubleConsonants.5.incorrect": "ㅈ 모양이 두 번 있는 ㅉ을 찾으세요.",
  "npc.hangulTeacher.doubleConsonantBook.line1": "쌍자음 책장을 읽으세요. 익숙한 글자가 된소리 쌍자음이 되는 모습을 보여 줍니다.",
  "npc.hangulTeacher.doubleConsonantDone.line1": "좋아요. 이제 학교의 자음 알파벳을 확인했습니다. 다음은 끝소리입니다.",
  "npc.hangulTeacher.doubleConsonantIntro.line1": "학교 알파벳 수업이 하나 더 남았습니다.",
  "npc.hangulTeacher.doubleConsonantIntro.line2": "어떤 자음은 두 번 쓸 수 있습니다. ㄱ은 ㄲ이 되고, ㄷ은 ㄸ이 됩니다.",
  "npc.hangulTeacher.doubleConsonantIntro.line3": "쌍자음 책장을 읽고 분수에서 그 글자들을 연습하세요.",
  "npc.hangulTeacher.doubleConsonantPractice.line1": "분수가 쌍자음 연습을 준비했습니다.",
  "npc.rivalDad": "끝소리 선생님",
  "npc.rivalStudent": "겹받침 학습자",
  "object.doubleConsonantBookcase": "쌍자음 책장",
  "object.doubleConsonantBookcase.locked.line1": "서 선생님이 먼저 이 쌍자음을 소개해야 합니다.",
  "object.schoolBlackboard.locked.doubleConsonants": "이 확인 전에 분수에서 쌍자음을 연습하세요.",
  "object.soundFountain.locked.doubleConsonants": "학교 안의 서 선생님에게 마지막 학교 알파벳 수업이 있습니다.",
  "quest.town1.doubleConsonants": "쌍자음",
  "quest.town1.doubleConsonants.book": "쌍자음 책 읽기",
  "quest.town1.doubleConsonants.exam": "칠판 쌍자음 통과",
  "quest.town1.doubleConsonants.practice": "분수 쌍자음 통과",
  "quest.town1.doubleConsonants.theory": "서 선생님과 대화",
  "quest.town1.readingBadge.ready": "끝소리 연습 완료",
  "study.aspiratedConsonants.entry.bieup": "ㅂ + ㅎ -> ㅍ p",
  "study.aspiratedConsonants.entry.digeut": "ㄷ + ㅎ -> ㅌ t",
  "study.aspiratedConsonants.entry.giyeok": "ㄱ + ㅎ -> ㅋ k",
  "study.aspiratedConsonants.entry.hieut": "ㅎ 숨소리",
  "study.aspiratedConsonants.entry.jieut": "ㅈ + ㅎ -> ㅊ ch",
  "study.doubleBatchim.entry.anj": "ㄵ -> 첫 ㄴ",
  "study.doubleBatchim.entry.dalk": "ㄺ -> 둘째 ㄱ",
  "study.doubleBatchim.entry.gap": "ㅄ -> 첫 ㅂ",
  "study.doubleBatchim.entry.rule": "단어마다 다름",
  "study.doubleConsonants.entry.bieup": "ㅂ + ㅂ -> ㅃ pp",
  "study.doubleConsonants.entry.digeut": "ㄷ + ㄷ -> ㄸ tt",
  "study.doubleConsonants.entry.giyeok": "ㄱ + ㄱ -> ㄲ kk",
  "study.doubleConsonants.entry.jieut": "ㅈ + ㅈ -> ㅉ jj",
  "study.doubleConsonants.entry.siot": "ㅅ + ㅅ -> ㅆ ss",
  "study.doubleConsonants.subtitle": "익숙한 자음이 된소리 쌍자음이 되는 모습을 봅니다.",
  "study.doubleConsonants.title": "쌍자음",
  "study.singleBatchim.entry.gan": "아래 ㄴ -> 끝 n",
  "study.singleBatchim.entry.mun": "아래 ㄴ -> 끝 n",
  "study.singleBatchim.entry.na": "아래 자음 없음",
});

Object.assign(TEXT.nl, {
  "drill.town1.choice.jj": "jj",
  "drill.town1.choice.kk": "kk",
  "drill.town1.choice.naBlock": "나",
  "drill.town1.choice.pp": "pp",
  "drill.town1.choice.ss": "ss",
  "drill.town1.choice.ssangBieupSign": "ㅃ",
  "drill.town1.choice.ssangDigeutSign": "ㄸ",
  "drill.town1.choice.ssangGiyeokSign": "ㄲ",
  "drill.town1.choice.ssangJieutSign": "ㅉ",
  "drill.town1.choice.ssangSiotSign": "ㅆ",
  "drill.town1.choice.tt": "tt",
  "drill.town1BlackboardDoubleConsonants.title": "Bordcontrole Dubbele Medeklinkers",
  "drill.town1BlackboardDoubleConsonants.1.prompt": "Toets: welke klank hoort bij ㄲ?",
  "drill.town1BlackboardDoubleConsonants.1.correct": "ㄲ is het dubbele ㄱ-teken, hier gelezen als kk.",
  "drill.town1BlackboardDoubleConsonants.1.incorrect": "Zoek de gespannen dubbele klank: ㄲ is kk.",
  "drill.town1BlackboardDoubleConsonants.2.prompt": "Toets: welk dubbel teken komt van ㄷ + ㄷ?",
  "drill.town1BlackboardDoubleConsonants.2.correct": "Dubbele ㄷ wordt ㄸ.",
  "drill.town1BlackboardDoubleConsonants.2.incorrect": "Verdubbel de ㄷ-vorm om ㄸ te maken.",
  "drill.town1BlackboardDoubleConsonants.3.prompt": "Toets: welk dubbel teken komt van ㅅ + ㅅ?",
  "drill.town1BlackboardDoubleConsonants.3.correct": "Dubbele ㅅ wordt ㅆ.",
  "drill.town1BlackboardDoubleConsonants.3.incorrect": "Twee ㅅ-tekens samen maken ㅆ.",
  "drill.town1FountainDoubleConsonants.title": "Fontein Dubbele Medeklinkers",
  "drill.town1FountainDoubleConsonants.1.prompt": "Het boek toont ㄱ + ㄱ. Kies het dubbele teken.",
  "drill.town1FountainDoubleConsonants.1.correct": "Dubbele ㄱ is ㄲ, hier geoefend als kk.",
  "drill.town1FountainDoubleConsonants.1.incorrect": "Zoek twee ㄱ-strepen samen: ㄲ.",
  "drill.town1FountainDoubleConsonants.2.prompt": "Het boek toont ㄷ + ㄷ. Kies het dubbele teken.",
  "drill.town1FountainDoubleConsonants.2.correct": "Dubbele ㄷ is ㄸ, hier geoefend als tt.",
  "drill.town1FountainDoubleConsonants.2.incorrect": "Zoek de dubbele ㄷ-vorm: ㄸ.",
  "drill.town1FountainDoubleConsonants.3.prompt": "Het boek toont ㅂ + ㅂ. Kies het dubbele teken.",
  "drill.town1FountainDoubleConsonants.3.correct": "Dubbele ㅂ is ㅃ, hier geoefend als pp.",
  "drill.town1FountainDoubleConsonants.3.incorrect": "Zoek de dubbele ㅂ-vorm: ㅃ.",
  "drill.town1FountainDoubleConsonants.4.prompt": "Het boek toont ㅅ + ㅅ. Kies het dubbele teken.",
  "drill.town1FountainDoubleConsonants.4.correct": "Dubbele ㅅ is ㅆ, hier geoefend als ss.",
  "drill.town1FountainDoubleConsonants.4.incorrect": "Zoek de dubbele ㅅ-vorm: ㅆ.",
  "drill.town1FountainDoubleConsonants.5.prompt": "Het boek toont ㅈ + ㅈ. Kies het dubbele teken.",
  "drill.town1FountainDoubleConsonants.5.correct": "Dubbele ㅈ is ㅉ, hier geoefend als jj.",
  "drill.town1FountainDoubleConsonants.5.incorrect": "Zoek de dubbele ㅈ-vorm: ㅉ.",
  "npc.hangulTeacher.doubleConsonantBook.line1": "Lees de boekenkast met dubbele medeklinkers. Die toont hoe bekende tekens gespannen dubbele tekens worden.",
  "npc.hangulTeacher.doubleConsonantDone.line1": "Goed. Je hebt nu het schoolmedeklinkeralfabet gecontroleerd. De volgende stap is eindklanken.",
  "npc.hangulTeacher.doubleConsonantIntro.line1": "Er blijft nog een schoolalfabetles over.",
  "npc.hangulTeacher.doubleConsonantIntro.line2": "Sommige medeklinkers kun je verdubbelen: ㄱ wordt ㄲ, en ㄷ wordt ㄸ.",
  "npc.hangulTeacher.doubleConsonantIntro.line3": "Lees de boekenkast met dubbele medeklinkers en oefen die tekens daarna bij de fontein.",
  "npc.hangulTeacher.doubleConsonantPractice.line1": "De fontein is klaar voor oefening met dubbele medeklinkers.",
  "npc.rivalDad": "Eindklankcoach",
  "npc.rivalStudent": "Dubbele-Eindklankleerling",
  "object.doubleConsonantBookcase": "Boekenkast Dubbele Medeklinkers",
  "object.doubleConsonantBookcase.locked.line1": "Juf Seo moet deze dubbele tekens eerst introduceren.",
  "object.schoolBlackboard.locked.doubleConsonants": "Oefen de dubbele medeklinkers bij de fontein voor deze controle.",
  "object.soundFountain.locked.doubleConsonants": "Juf Seo heeft de laatste schoolalfabetles in de school.",
  "quest.town1.doubleConsonants": "Dubbele Medeklinkers",
  "quest.town1.doubleConsonants.book": "Lees dubbel-medeklinkerboek",
  "quest.town1.doubleConsonants.exam": "Haal dubbele-medeklinkerbord",
  "quest.town1.doubleConsonants.practice": "Haal dubbele-medeklinkerfontein",
  "quest.town1.doubleConsonants.theory": "Praat met Juf Seo",
  "quest.town1.readingBadge.ready": "Eindklankoefening klaar",
  "study.aspiratedConsonants.entry.bieup": "ㅂ + ㅎ -> ㅍ p",
  "study.aspiratedConsonants.entry.digeut": "ㄷ + ㅎ -> ㅌ t",
  "study.aspiratedConsonants.entry.giyeok": "ㄱ + ㅎ -> ㅋ k",
  "study.aspiratedConsonants.entry.hieut": "ㅎ adem",
  "study.aspiratedConsonants.entry.jieut": "ㅈ + ㅎ -> ㅊ ch",
  "study.doubleBatchim.entry.anj": "ㄵ -> eerste ㄴ",
  "study.doubleBatchim.entry.dalk": "ㄺ -> tweede ㄱ",
  "study.doubleBatchim.entry.gap": "ㅄ -> eerste ㅂ",
  "study.doubleBatchim.entry.rule": "woord beslist",
  "study.doubleConsonants.entry.bieup": "ㅂ + ㅂ -> ㅃ pp",
  "study.doubleConsonants.entry.digeut": "ㄷ + ㄷ -> ㄸ tt",
  "study.doubleConsonants.entry.giyeok": "ㄱ + ㄱ -> ㄲ kk",
  "study.doubleConsonants.entry.jieut": "ㅈ + ㅈ -> ㅉ jj",
  "study.doubleConsonants.entry.siot": "ㅅ + ㅅ -> ㅆ ss",
  "study.doubleConsonants.subtitle": "Zie hoe bekende medeklinkers gespannen dubbele tekens worden.",
  "study.doubleConsonants.title": "Dubbele Medeklinkers",
  "study.singleBatchim.entry.gan": "onderste ㄴ -> eind-n",
  "study.singleBatchim.entry.mun": "onderste ㄴ -> eind-n",
  "study.singleBatchim.entry.na": "geen onderste medeklinker",
});

Object.assign(TEXT.en, {
  "npc.guesthouseHost": "Guesthouse Host",
  "npc.guesthouseKid": "Guesthouse Kid",
  "npc.joon": "Joon",
  "npc.marketClerk": "Market Clerk",
  "npc.marketCustomer": "Market Customer",
  "npc.marketStocker": "Market Stocker",
  "npc.mina": "Mina",
  "npc.mrHan": "Mr. Han",
  "npc.sora": "Sora",
  "npc.teaCustomer": "Tea Customer",
  "npc.teaOwner": "Tea Owner",
  "npc.trailKeeper": "Trail Keeper",
  "npc.travelGuide": "Travel Guide",
  "npc.travelGuest": "Travel Guest",
  "npc.travelTrainee": "Travel Trainee",
});

Object.assign(TEXT.ko, {
  "npc.guesthouseHost": "게스트하우스 주인",
  "npc.guesthouseKid": "게스트하우스 아이",
  "npc.joon": "준",
  "npc.marketClerk": "시장 점원",
  "npc.marketCustomer": "시장 손님",
  "npc.marketStocker": "시장 정리원",
  "npc.mina": "미나",
  "npc.mrHan": "한 선생님",
  "npc.sora": "소라",
  "npc.teaCustomer": "찻집 손님",
  "npc.teaOwner": "찻집 주인",
  "npc.trailKeeper": "길지기",
  "npc.travelGuide": "여행 안내원",
  "npc.travelGuest": "여행 손님",
  "npc.travelTrainee": "여행 견습생",
});

Object.assign(TEXT.nl, {
  "npc.guesthouseHost": "Pensionhouder",
  "npc.guesthouseKid": "Pensionkind",
  "npc.joon": "Joon",
  "npc.marketClerk": "Marktverkoper",
  "npc.marketCustomer": "Marktklant",
  "npc.marketStocker": "Marktmedewerker",
  "npc.mina": "Mina",
  "npc.mrHan": "Meneer Han",
  "npc.sora": "Sora",
  "npc.teaCustomer": "Theeklant",
  "npc.teaOwner": "Theehuisbaas",
  "npc.trailKeeper": "Padwachter",
  "npc.travelGuide": "Reisgids",
  "npc.travelGuest": "Reisgast",
  "npc.travelTrainee": "Reisstagiair",
});

Object.assign(TEXT.en, {
  "object.actionPracticeSign": "Action Practice Sign",
  "object.actionPracticeSign.line1": "The sign pairs simple Korean action sentences with what people do.",
  "object.hangulBookshelf": "Hangul Bookcase",
  "object.hangulBookshelf.line1": "Thin booklets separate vowels, consonants, and final sounds.",
  "object.letterBlockTable": "Letter Block Table",
  "object.letterBlockTable.line1": "Loose letters wait to be combined into syllables.",
  "object.nameCardBoard": "Lost Name Card Board",
  "object.nameCardBoard.line1": "Three name cards are pinned beside simple self-introductions.",
  "object.patternDesk": "Pattern Desk",
  "object.patternDesk.line1": "The notes split simple Korean sentences into chunks.",
  "object.routeObjectStall": "Object Label Stall",
  "object.routeObjectStall.line1": "A small stall asks travelers to connect Korean object labels to things.",
  "object.soundFountain": "Sound Fountain",
  "object.soundFountain.line1": "A shallow fountain repeats simple Hangul sounds.",
  "object.speechBench": "Speaking Bench",
  "object.speechBench.line1": "Short polite sentences are carved into the bench.",
  "object.syllablePoster": "Syllable Block Poster",
  "object.syllablePoster.line1": "Hangul letters stack into square syllable blocks.",
  "object.syllablePoster.line2": "Most blocks begin with a consonant, then a vowel, and sometimes a final consonant.",
  "drill.progress": "{current}/{total}",
  "drill.complete": "Drill complete",
  "drill.score": "{correct}/{total} correct",
  "drill.alphabetBlocks.title": "Letter Block Forging",
  "drill.alphabetBlocks.1.prompt": "Forge ㅎ + ㅏ + ㄴ into one syllable block.",
  "drill.alphabetBlocks.1.choice.a": "한",
  "drill.alphabetBlocks.1.choice.b": "국",
  "drill.alphabetBlocks.1.choice.c": "어",
  "drill.alphabetBlocks.1.correct": "한 is built from ㅎ, ㅏ, and final ㄴ.",
  "drill.alphabetBlocks.1.incorrect": "Look for the block that starts with ㅎ and ends with ㄴ.",
  "drill.alphabetBlocks.2.prompt": "Forge ㄱ + ㅜ + ㄱ into one syllable block.",
  "drill.alphabetBlocks.2.choice.a": "구",
  "drill.alphabetBlocks.2.choice.b": "국",
  "drill.alphabetBlocks.2.choice.c": "문",
  "drill.alphabetBlocks.2.correct": "국 keeps ㄱ at the start and at the end.",
  "drill.alphabetBlocks.2.incorrect": "The final ㄱ is part of the block, so it needs batchim.",
  "drill.alphabetBlocks.3.prompt": "Combine 한 + 국 + 어. What word appears?",
  "drill.alphabetBlocks.3.choice.a": "한국어",
  "drill.alphabetBlocks.3.choice.b": "한글",
  "drill.alphabetBlocks.3.choice.c": "문",
  "drill.alphabetBlocks.3.correct": "한국어 is Korean language.",
  "drill.alphabetBlocks.3.incorrect": "Keep all three blocks in order: 한 + 국 + 어.",
  "drill.soundFountain.title": "Sound Fountain",
  "drill.soundFountain.1.prompt": "The ripple shows 가. Choose the matching Hangul.",
  "drill.soundFountain.1.choice.a": "가",
  "drill.soundFountain.1.choice.b": "나",
  "drill.soundFountain.1.choice.c": "다",
  "drill.soundFountain.1.choice.d": "라",
  "drill.soundFountain.1.correct": "가 starts with ㄱ and uses ㅏ.",
  "drill.soundFountain.1.incorrect": "Match the exact syllable shown by the ripple.",
  "drill.soundFountain.2.prompt": "The ripple shows 거. Choose the matching Hangul.",
  "drill.soundFountain.2.choice.a": "고",
  "drill.soundFountain.2.choice.b": "구",
  "drill.soundFountain.2.choice.c": "거",
  "drill.soundFountain.2.choice.d": "기",
  "drill.soundFountain.2.correct": "거 uses ㄱ with the vowel ㅓ.",
  "drill.soundFountain.2.incorrect": "The vowel shape matters: 거 uses ㅓ.",
  "drill.soundFountain.3.prompt": "The ripple shows 파. Choose the matching Hangul.",
  "drill.soundFountain.3.choice.a": "바",
  "drill.soundFountain.3.choice.b": "빠",
  "drill.soundFountain.3.choice.c": "카",
  "drill.soundFountain.3.choice.d": "파",
  "drill.soundFountain.3.correct": "파 uses ㅍ with ㅏ.",
  "drill.soundFountain.3.incorrect": "파 has the aspirated consonant ㅍ.",
  "drill.batchimBridge.title": "Batchim Bridge",
  "drill.batchimBridge.choice.no": "No batchim",
  "drill.batchimBridge.choice.yes": "Batchim",
  "drill.batchimBridge.1.prompt": "Does 가 have a final consonant?",
  "drill.batchimBridge.1.correct": "가 has no final consonant under the vowel.",
  "drill.batchimBridge.1.incorrect": "가 ends open, so there is no batchim.",
  "drill.batchimBridge.2.prompt": "Does 한 have a final consonant?",
  "drill.batchimBridge.2.correct": "한 has ㄴ at the bottom.",
  "drill.batchimBridge.2.incorrect": "The ㄴ under 한 is batchim.",
  "drill.batchimBridge.3.prompt": "Does 국 have a final consonant?",
  "drill.batchimBridge.3.correct": "국 has final ㄱ.",
  "drill.batchimBridge.3.incorrect": "The bottom ㄱ makes 국 a batchim block.",
  "drill.batchimBridge.4.prompt": "Does 나 have a final consonant?",
  "drill.batchimBridge.4.correct": "나 is open, so there is no batchim.",
  "drill.batchimBridge.4.incorrect": "나 has only ㄴ and ㅏ, with no bottom consonant.",
  "drill.sentenceBlocks.title": "Sentence Blocks",
  "drill.sentenceBlocks.1.prompt": "Split 저는 민수예요. into chunks.",
  "drill.sentenceBlocks.1.choice.a": "저는 / 민수예요",
  "drill.sentenceBlocks.1.choice.b": "저 / 는민수예요",
  "drill.sentenceBlocks.1.choice.c": "저는민 / 수예요",
  "drill.sentenceBlocks.1.correct": "저는 marks the speaker, then 민수예요 gives the name.",
  "drill.sentenceBlocks.1.incorrect": "Keep 저는 together as the first chunk.",
  "drill.sentenceBlocks.2.prompt": "Split 이건 책이에요. into chunks.",
  "drill.sentenceBlocks.2.choice.a": "이 / 건책이에요",
  "drill.sentenceBlocks.2.choice.b": "이건 / 책이에요",
  "drill.sentenceBlocks.2.choice.c": "이건책 / 이에요",
  "drill.sentenceBlocks.2.correct": "이건 points to this thing, then 책이에요 names it.",
  "drill.sentenceBlocks.2.incorrect": "The pointing chunk is 이건.",
  "drill.sentenceBlocks.3.prompt": "Which pattern introduces someone?",
  "drill.sentenceBlocks.3.choice.a": "저는 X예요.",
  "drill.sentenceBlocks.3.choice.b": "X이/가 있어요.",
  "drill.sentenceBlocks.3.choice.c": "X을/를 읽어요.",
  "drill.sentenceBlocks.3.correct": "저는 X예요 is the self-introduction pattern.",
  "drill.sentenceBlocks.3.incorrect": "Look for 저는 plus a name or role before 예요.",
  "drill.routeNames.title": "Lost Name Cards",
  "drill.routeNames.choice.minsu": "민수",
  "drill.routeNames.choice.jiu": "지우",
  "drill.routeNames.choice.hana": "하나",
  "drill.routeNames.1.prompt": "저는 지우예요. Which name card fits?",
  "drill.routeNames.1.correct": "지우 comes right before 예요.",
  "drill.routeNames.1.incorrect": "The name before 예요 is the card you need.",
  "drill.routeNames.2.prompt": "저는 민수예요. Which name card fits?",
  "drill.routeNames.2.correct": "민수 is the name in the sentence.",
  "drill.routeNames.2.incorrect": "Read the name right before 예요.",
  "drill.routeNames.3.prompt": "저는 하나예요. Which name card fits?",
  "drill.routeNames.3.correct": "하나 is the correct name card.",
  "drill.routeNames.3.incorrect": "The final name before 예요 is 하나.",
  "drill.objectLabels.title": "Object Labels",
  "drill.objectLabels.choice.book": "책",
  "drill.objectLabels.choice.water": "물",
  "drill.objectLabels.choice.bag": "가방",
  "drill.objectLabels.1.prompt": "이건 책이에요. Which object is being named?",
  "drill.objectLabels.1.correct": "책 means book.",
  "drill.objectLabels.1.incorrect": "Look after 이건 to find the object name.",
  "drill.objectLabels.2.prompt": "그건 물이에요. Which object is being named?",
  "drill.objectLabels.2.correct": "물 means water.",
  "drill.objectLabels.2.incorrect": "The object after 그건 is 물.",
  "drill.objectLabels.3.prompt": "저건 가방이에요. Which object is being named?",
  "drill.objectLabels.3.correct": "가방 means bag.",
  "drill.objectLabels.3.incorrect": "The distant object is named 가방.",
  "drill.actionPath.title": "Action Path",
  "drill.actionPath.choice.drinkWater": "drinks water",
  "drill.actionPath.choice.readBook": "reads a book",
  "drill.actionPath.choice.eatApple": "eats an apple",
  "drill.actionPath.1.prompt": "저는 책을 읽어요. What does the person do?",
  "drill.actionPath.1.correct": "책을 읽어요 means reads a book.",
  "drill.actionPath.1.incorrect": "읽어요 is the action. It means reads.",
  "drill.actionPath.2.prompt": "저는 물을 마셔요. What does the person do?",
  "drill.actionPath.2.correct": "물을 마셔요 means drinks water.",
  "drill.actionPath.2.incorrect": "마셔요 is the action. It means drinks.",
  "drill.actionPath.3.prompt": "저는 사과를 먹어요. What does the person do?",
  "drill.actionPath.3.correct": "사과를 먹어요 means eats an apple.",
  "drill.actionPath.3.incorrect": "먹어요 is the action. It means eats.",
});

Object.assign(TEXT.ko, {
  "object.actionPracticeSign": "동작 연습 표지판",
  "object.actionPracticeSign.line1": "간단한 한국어 동작 문장과 행동을 연결해 보는 표지판입니다.",
  "object.hangulBookshelf": "한글 책장",
  "object.hangulBookshelf.line1": "얇은 책자들이 모음, 자음, 받침 소리를 나누어 설명합니다.",
  "object.letterBlockTable": "글자 블록 탁자",
  "object.letterBlockTable.line1": "흩어진 글자들이 음절로 합쳐지기를 기다립니다.",
  "object.nameCardBoard": "잃어버린 이름표 게시판",
  "object.nameCardBoard.line1": "간단한 자기소개 옆에 이름표 세 장이 꽂혀 있습니다.",
  "object.patternDesk": "문장 패턴 책상",
  "object.patternDesk.line1": "메모에는 쉬운 한국어 문장이 덩어리로 나뉘어 있습니다.",
  "object.routeObjectStall": "사물 이름 가판대",
  "object.routeObjectStall.line1": "작은 가판대가 한국어 사물 이름과 물건을 연결하라고 합니다.",
  "object.soundFountain": "소리 분수",
  "object.soundFountain.line1": "얕은 분수가 쉬운 한글 소리를 반복합니다.",
  "object.speechBench": "말하기 벤치",
  "object.speechBench.line1": "짧고 공손한 문장이 벤치에 새겨져 있습니다.",
  "object.syllablePoster": "음절 블록 포스터",
  "object.syllablePoster.line1": "한글 글자는 네모난 음절 블록 안에 모입니다.",
  "object.syllablePoster.line2": "대부분의 블록은 자음, 모음, 때로는 마지막 자음으로 이루어집니다.",
  "drill.progress": "{current}/{total}",
  "drill.complete": "연습 완료",
  "drill.score": "{correct}/{total}개 정답",
  "drill.alphabetBlocks.title": "글자 블록 만들기",
  "drill.alphabetBlocks.1.prompt": "ㅎ + ㅏ + ㄴ을 하나의 음절 블록으로 만드세요.",
  "drill.alphabetBlocks.1.choice.a": "한",
  "drill.alphabetBlocks.1.choice.b": "국",
  "drill.alphabetBlocks.1.choice.c": "어",
  "drill.alphabetBlocks.1.correct": "한은 ㅎ, ㅏ, 마지막 ㄴ으로 만들어집니다.",
  "drill.alphabetBlocks.1.incorrect": "ㅎ으로 시작하고 ㄴ으로 끝나는 블록을 찾으세요.",
  "drill.alphabetBlocks.2.prompt": "ㄱ + ㅜ + ㄱ을 하나의 음절 블록으로 만드세요.",
  "drill.alphabetBlocks.2.choice.a": "구",
  "drill.alphabetBlocks.2.choice.b": "국",
  "drill.alphabetBlocks.2.choice.c": "문",
  "drill.alphabetBlocks.2.correct": "국은 처음과 끝에 ㄱ이 있습니다.",
  "drill.alphabetBlocks.2.incorrect": "마지막 ㄱ도 블록 안에 있으므로 받침이 필요합니다.",
  "drill.alphabetBlocks.3.prompt": "한 + 국 + 어를 합치면 어떤 단어가 되나요?",
  "drill.alphabetBlocks.3.choice.a": "한국어",
  "drill.alphabetBlocks.3.choice.b": "한글",
  "drill.alphabetBlocks.3.choice.c": "문",
  "drill.alphabetBlocks.3.correct": "한국어는 Korean language라는 뜻입니다.",
  "drill.alphabetBlocks.3.incorrect": "한 + 국 + 어 세 블록을 순서대로 유지하세요.",
  "drill.soundFountain.title": "소리 분수",
  "drill.soundFountain.1.prompt": "물결이 가를 보여 줍니다. 같은 한글을 고르세요.",
  "drill.soundFountain.1.choice.a": "가",
  "drill.soundFountain.1.choice.b": "나",
  "drill.soundFountain.1.choice.c": "다",
  "drill.soundFountain.1.choice.d": "라",
  "drill.soundFountain.1.correct": "가는 ㄱ으로 시작하고 ㅏ를 씁니다.",
  "drill.soundFountain.1.incorrect": "물결에 보이는 음절과 똑같은 것을 고르세요.",
  "drill.soundFountain.2.prompt": "물결이 거를 보여 줍니다. 같은 한글을 고르세요.",
  "drill.soundFountain.2.choice.a": "고",
  "drill.soundFountain.2.choice.b": "구",
  "drill.soundFountain.2.choice.c": "거",
  "drill.soundFountain.2.choice.d": "기",
  "drill.soundFountain.2.correct": "거는 ㄱ과 모음 ㅓ를 씁니다.",
  "drill.soundFountain.2.incorrect": "모양이 중요합니다. 거에는 ㅓ가 있습니다.",
  "drill.soundFountain.3.prompt": "물결이 파를 보여 줍니다. 같은 한글을 고르세요.",
  "drill.soundFountain.3.choice.a": "바",
  "drill.soundFountain.3.choice.b": "빠",
  "drill.soundFountain.3.choice.c": "카",
  "drill.soundFountain.3.choice.d": "파",
  "drill.soundFountain.3.correct": "파는 ㅍ과 ㅏ를 씁니다.",
  "drill.soundFountain.3.incorrect": "파에는 거센소리 자음 ㅍ이 있습니다.",
  "drill.batchimBridge.title": "받침 다리",
  "drill.batchimBridge.choice.no": "받침 없음",
  "drill.batchimBridge.choice.yes": "받침 있음",
  "drill.batchimBridge.1.prompt": "가에는 마지막 자음이 있나요?",
  "drill.batchimBridge.1.correct": "가에는 모음 아래 마지막 자음이 없습니다.",
  "drill.batchimBridge.1.incorrect": "가는 열린 소리로 끝나므로 받침이 없습니다.",
  "drill.batchimBridge.2.prompt": "한에는 마지막 자음이 있나요?",
  "drill.batchimBridge.2.correct": "한에는 아래쪽에 ㄴ이 있습니다.",
  "drill.batchimBridge.2.incorrect": "한 아래의 ㄴ이 받침입니다.",
  "drill.batchimBridge.3.prompt": "국에는 마지막 자음이 있나요?",
  "drill.batchimBridge.3.correct": "국에는 마지막 ㄱ이 있습니다.",
  "drill.batchimBridge.3.incorrect": "아래쪽 ㄱ 때문에 국은 받침이 있는 블록입니다.",
  "drill.batchimBridge.4.prompt": "나에는 마지막 자음이 있나요?",
  "drill.batchimBridge.4.correct": "나는 열린 소리라 받침이 없습니다.",
  "drill.batchimBridge.4.incorrect": "나는 ㄴ과 ㅏ만 있고 아래 자음이 없습니다.",
  "drill.sentenceBlocks.title": "문장 덩어리",
  "drill.sentenceBlocks.1.prompt": "저는 민수예요.를 덩어리로 나누세요.",
  "drill.sentenceBlocks.1.choice.a": "저는 / 민수예요",
  "drill.sentenceBlocks.1.choice.b": "저 / 는민수예요",
  "drill.sentenceBlocks.1.choice.c": "저는민 / 수예요",
  "drill.sentenceBlocks.1.correct": "저는은 말하는 사람을 표시하고, 민수예요는 이름을 줍니다.",
  "drill.sentenceBlocks.1.incorrect": "저는을 첫 번째 덩어리로 함께 두세요.",
  "drill.sentenceBlocks.2.prompt": "이건 책이에요.를 덩어리로 나누세요.",
  "drill.sentenceBlocks.2.choice.a": "이 / 건책이에요",
  "drill.sentenceBlocks.2.choice.b": "이건 / 책이에요",
  "drill.sentenceBlocks.2.choice.c": "이건책 / 이에요",
  "drill.sentenceBlocks.2.correct": "이건은 이것을 가리키고, 책이에요는 이름을 말합니다.",
  "drill.sentenceBlocks.2.incorrect": "가리키는 덩어리는 이건입니다.",
  "drill.sentenceBlocks.3.prompt": "누군가를 소개하는 패턴은 무엇인가요?",
  "drill.sentenceBlocks.3.choice.a": "저는 X예요.",
  "drill.sentenceBlocks.3.choice.b": "X이/가 있어요.",
  "drill.sentenceBlocks.3.choice.c": "X을/를 읽어요.",
  "drill.sentenceBlocks.3.correct": "저는 X예요는 자기소개 패턴입니다.",
  "drill.sentenceBlocks.3.incorrect": "저는과 이름이나 역할, 그리고 예요를 찾으세요.",
  "drill.routeNames.title": "잃어버린 이름표",
  "drill.routeNames.choice.minsu": "민수",
  "drill.routeNames.choice.jiu": "지우",
  "drill.routeNames.choice.hana": "하나",
  "drill.routeNames.1.prompt": "저는 지우예요. 어떤 이름표가 맞나요?",
  "drill.routeNames.1.correct": "지우가 예요 바로 앞에 있습니다.",
  "drill.routeNames.1.incorrect": "예요 앞의 이름이 필요한 이름표입니다.",
  "drill.routeNames.2.prompt": "저는 민수예요. 어떤 이름표가 맞나요?",
  "drill.routeNames.2.correct": "민수가 문장 안의 이름입니다.",
  "drill.routeNames.2.incorrect": "예요 바로 앞의 이름을 읽으세요.",
  "drill.routeNames.3.prompt": "저는 하나예요. 어떤 이름표가 맞나요?",
  "drill.routeNames.3.correct": "하나가 맞는 이름표입니다.",
  "drill.routeNames.3.incorrect": "예요 앞의 마지막 이름은 하나입니다.",
  "drill.objectLabels.title": "사물 이름표",
  "drill.objectLabels.choice.book": "책",
  "drill.objectLabels.choice.water": "물",
  "drill.objectLabels.choice.bag": "가방",
  "drill.objectLabels.1.prompt": "이건 책이에요. 어떤 물건을 말하나요?",
  "drill.objectLabels.1.correct": "책은 book입니다.",
  "drill.objectLabels.1.incorrect": "이건 뒤에서 물건 이름을 찾으세요.",
  "drill.objectLabels.2.prompt": "그건 물이에요. 어떤 물건을 말하나요?",
  "drill.objectLabels.2.correct": "물은 water입니다.",
  "drill.objectLabels.2.incorrect": "그건 뒤의 물건은 물입니다.",
  "drill.objectLabels.3.prompt": "저건 가방이에요. 어떤 물건을 말하나요?",
  "drill.objectLabels.3.correct": "가방은 bag입니다.",
  "drill.objectLabels.3.incorrect": "멀리 있는 물건의 이름은 가방입니다.",
  "drill.actionPath.title": "동작 길",
  "drill.actionPath.choice.drinkWater": "물을 마셔요",
  "drill.actionPath.choice.readBook": "책을 읽어요",
  "drill.actionPath.choice.eatApple": "사과를 먹어요",
  "drill.actionPath.1.prompt": "저는 책을 읽어요. 무엇을 하나요?",
  "drill.actionPath.1.correct": "책을 읽어요는 reads a book입니다.",
  "drill.actionPath.1.incorrect": "읽어요가 동작입니다. 읽는다는 뜻입니다.",
  "drill.actionPath.2.prompt": "저는 물을 마셔요. 무엇을 하나요?",
  "drill.actionPath.2.correct": "물을 마셔요는 drinks water입니다.",
  "drill.actionPath.2.incorrect": "마셔요가 동작입니다. 마신다는 뜻입니다.",
  "drill.actionPath.3.prompt": "저는 사과를 먹어요. 무엇을 하나요?",
  "drill.actionPath.3.correct": "사과를 먹어요는 eats an apple입니다.",
  "drill.actionPath.3.incorrect": "먹어요가 동작입니다. 먹는다는 뜻입니다.",
});

Object.assign(TEXT.nl, {
  "object.actionPracticeSign": "Actiebord",
  "object.actionPracticeSign.line1": "Het bord koppelt eenvoudige Koreaanse actiezinnen aan wat mensen doen.",
  "object.hangulBookshelf": "Hangulboekenkast",
  "object.hangulBookshelf.line1": "Dunne boekjes scheiden klinkers, medeklinkers en eindklanken.",
  "object.letterBlockTable": "Letterbloktafel",
  "object.letterBlockTable.line1": "Losse letters wachten om tot lettergrepen gecombineerd te worden.",
  "object.nameCardBoard": "Bord met verloren naamkaartjes",
  "object.nameCardBoard.line1": "Drie naamkaartjes hangen naast eenvoudige zelfvoorstellingen.",
  "object.patternDesk": "Patroonbureau",
  "object.patternDesk.line1": "De notities splitsen eenvoudige Koreaanse zinnen in blokken.",
  "object.routeObjectStall": "Objectlabelkraam",
  "object.routeObjectStall.line1": "Een kleine kraam vraagt reizigers Koreaanse labels aan dingen te koppelen.",
  "object.soundFountain": "Klankfontein",
  "object.soundFountain.line1": "Een lage fontein herhaalt eenvoudige Hangul-klanken.",
  "object.speechBench": "Spreekbankje",
  "object.speechBench.line1": "Korte beleefde zinnen zijn in het bankje gekerfd.",
  "object.syllablePoster": "Lettergreepblokposter",
  "object.syllablePoster.line1": "Hangulletters stapelen zich in vierkante lettergreepblokken.",
  "object.syllablePoster.line2": "De meeste blokken beginnen met een medeklinker, dan een klinker, en soms een eindmedeklinker.",
  "drill.progress": "{current}/{total}",
  "drill.complete": "Oefening klaar",
  "drill.score": "{correct}/{total} goed",
  "drill.alphabetBlocks.title": "Letterblok smeden",
  "drill.alphabetBlocks.1.prompt": "Smeed ㅎ + ㅏ + ㄴ tot een lettergreepblok.",
  "drill.alphabetBlocks.1.choice.a": "한",
  "drill.alphabetBlocks.1.choice.b": "국",
  "drill.alphabetBlocks.1.choice.c": "어",
  "drill.alphabetBlocks.1.correct": "한 is opgebouwd uit ㅎ, ㅏ en eind-ㄴ.",
  "drill.alphabetBlocks.1.incorrect": "Zoek het blok dat begint met ㅎ en eindigt met ㄴ.",
  "drill.alphabetBlocks.2.prompt": "Smeed ㄱ + ㅜ + ㄱ tot een lettergreepblok.",
  "drill.alphabetBlocks.2.choice.a": "구",
  "drill.alphabetBlocks.2.choice.b": "국",
  "drill.alphabetBlocks.2.choice.c": "문",
  "drill.alphabetBlocks.2.correct": "국 houdt ㄱ aan het begin en aan het einde.",
  "drill.alphabetBlocks.2.incorrect": "De laatste ㄱ hoort in het blok, dus er is batchim nodig.",
  "drill.alphabetBlocks.3.prompt": "Combineer 한 + 국 + 어. Welk woord verschijnt?",
  "drill.alphabetBlocks.3.choice.a": "한국어",
  "drill.alphabetBlocks.3.choice.b": "한글",
  "drill.alphabetBlocks.3.choice.c": "문",
  "drill.alphabetBlocks.3.correct": "한국어 betekent Koreaanse taal.",
  "drill.alphabetBlocks.3.incorrect": "Houd alle drie blokken op volgorde: 한 + 국 + 어.",
  "drill.soundFountain.title": "Klankfontein",
  "drill.soundFountain.1.prompt": "De rimpel toont 가. Kies dezelfde Hangul.",
  "drill.soundFountain.1.choice.a": "가",
  "drill.soundFountain.1.choice.b": "나",
  "drill.soundFountain.1.choice.c": "다",
  "drill.soundFountain.1.choice.d": "라",
  "drill.soundFountain.1.correct": "가 begint met ㄱ en gebruikt ㅏ.",
  "drill.soundFountain.1.incorrect": "Kies precies dezelfde lettergreep als in de rimpel.",
  "drill.soundFountain.2.prompt": "De rimpel toont 거. Kies dezelfde Hangul.",
  "drill.soundFountain.2.choice.a": "고",
  "drill.soundFountain.2.choice.b": "구",
  "drill.soundFountain.2.choice.c": "거",
  "drill.soundFountain.2.choice.d": "기",
  "drill.soundFountain.2.correct": "거 gebruikt ㄱ met de klinker ㅓ.",
  "drill.soundFountain.2.incorrect": "De klinkervorm telt: 거 gebruikt ㅓ.",
  "drill.soundFountain.3.prompt": "De rimpel toont 파. Kies dezelfde Hangul.",
  "drill.soundFountain.3.choice.a": "바",
  "drill.soundFountain.3.choice.b": "빠",
  "drill.soundFountain.3.choice.c": "카",
  "drill.soundFountain.3.choice.d": "파",
  "drill.soundFountain.3.correct": "파 gebruikt ㅍ met ㅏ.",
  "drill.soundFountain.3.incorrect": "파 heeft de aangeblazen medeklinker ㅍ.",
  "drill.batchimBridge.title": "Batchimbrug",
  "drill.batchimBridge.choice.no": "Geen batchim",
  "drill.batchimBridge.choice.yes": "Wel batchim",
  "drill.batchimBridge.1.prompt": "Heeft 가 een eindmedeklinker?",
  "drill.batchimBridge.1.correct": "가 heeft geen eindmedeklinker onder de klinker.",
  "drill.batchimBridge.1.incorrect": "가 eindigt open, dus er is geen batchim.",
  "drill.batchimBridge.2.prompt": "Heeft 한 een eindmedeklinker?",
  "drill.batchimBridge.2.correct": "한 heeft ㄴ onderaan.",
  "drill.batchimBridge.2.incorrect": "De ㄴ onder 한 is batchim.",
  "drill.batchimBridge.3.prompt": "Heeft 국 een eindmedeklinker?",
  "drill.batchimBridge.3.correct": "국 heeft eind-ㄱ.",
  "drill.batchimBridge.3.incorrect": "De onderste ㄱ maakt 국 een batchimblok.",
  "drill.batchimBridge.4.prompt": "Heeft 나 een eindmedeklinker?",
  "drill.batchimBridge.4.correct": "나 is open, dus er is geen batchim.",
  "drill.batchimBridge.4.incorrect": "나 heeft alleen ㄴ en ㅏ, zonder onderste medeklinker.",
  "drill.sentenceBlocks.title": "Zinsblokken",
  "drill.sentenceBlocks.1.prompt": "Splits 저는 민수예요. in blokken.",
  "drill.sentenceBlocks.1.choice.a": "저는 / 민수예요",
  "drill.sentenceBlocks.1.choice.b": "저 / 는민수예요",
  "drill.sentenceBlocks.1.choice.c": "저는민 / 수예요",
  "drill.sentenceBlocks.1.correct": "저는 markeert de spreker, daarna geeft 민수예요 de naam.",
  "drill.sentenceBlocks.1.incorrect": "Houd 저는 samen als eerste blok.",
  "drill.sentenceBlocks.2.prompt": "Splits 이건 책이에요. in blokken.",
  "drill.sentenceBlocks.2.choice.a": "이 / 건책이에요",
  "drill.sentenceBlocks.2.choice.b": "이건 / 책이에요",
  "drill.sentenceBlocks.2.choice.c": "이건책 / 이에요",
  "drill.sentenceBlocks.2.correct": "이건 wijst dit ding aan, daarna benoemt 책이에요 het.",
  "drill.sentenceBlocks.2.incorrect": "Het aanwijsblok is 이건.",
  "drill.sentenceBlocks.3.prompt": "Welk patroon stelt iemand voor?",
  "drill.sentenceBlocks.3.choice.a": "저는 X예요.",
  "drill.sentenceBlocks.3.choice.b": "X이/가 있어요.",
  "drill.sentenceBlocks.3.choice.c": "X을/를 읽어요.",
  "drill.sentenceBlocks.3.correct": "저는 X예요 is het zelfvoorstellingspatroon.",
  "drill.sentenceBlocks.3.incorrect": "Zoek 저는 plus een naam of rol voor 예요.",
  "drill.routeNames.title": "Verloren naamkaartjes",
  "drill.routeNames.choice.minsu": "민수",
  "drill.routeNames.choice.jiu": "지우",
  "drill.routeNames.choice.hana": "하나",
  "drill.routeNames.1.prompt": "저는 지우예요. Welk naamkaartje past?",
  "drill.routeNames.1.correct": "지우 staat direct voor 예요.",
  "drill.routeNames.1.incorrect": "De naam voor 예요 is het kaartje dat je nodig hebt.",
  "drill.routeNames.2.prompt": "저는 민수예요. Welk naamkaartje past?",
  "drill.routeNames.2.correct": "민수 is de naam in de zin.",
  "drill.routeNames.2.incorrect": "Lees de naam direct voor 예요.",
  "drill.routeNames.3.prompt": "저는 하나예요. Welk naamkaartje past?",
  "drill.routeNames.3.correct": "하나 is het juiste naamkaartje.",
  "drill.routeNames.3.incorrect": "De laatste naam voor 예요 is 하나.",
  "drill.objectLabels.title": "Objectlabels",
  "drill.objectLabels.choice.book": "책",
  "drill.objectLabels.choice.water": "물",
  "drill.objectLabels.choice.bag": "가방",
  "drill.objectLabels.1.prompt": "이건 책이에요. Welk object wordt benoemd?",
  "drill.objectLabels.1.correct": "책 betekent boek.",
  "drill.objectLabels.1.incorrect": "Kijk na 이건 om de objectnaam te vinden.",
  "drill.objectLabels.2.prompt": "그건 물이에요. Welk object wordt benoemd?",
  "drill.objectLabels.2.correct": "물 betekent water.",
  "drill.objectLabels.2.incorrect": "Het object na 그건 is 물.",
  "drill.objectLabels.3.prompt": "저건 가방이에요. Welk object wordt benoemd?",
  "drill.objectLabels.3.correct": "가방 betekent tas.",
  "drill.objectLabels.3.incorrect": "Het verre object heet 가방.",
  "drill.actionPath.title": "Actiepad",
  "drill.actionPath.choice.drinkWater": "drinkt water",
  "drill.actionPath.choice.readBook": "leest een boek",
  "drill.actionPath.choice.eatApple": "eet een appel",
  "drill.actionPath.1.prompt": "저는 책을 읽어요. Wat doet de persoon?",
  "drill.actionPath.1.correct": "책을 읽어요 betekent leest een boek.",
  "drill.actionPath.1.incorrect": "읽어요 is de actie. Het betekent leest.",
  "drill.actionPath.2.prompt": "저는 물을 마셔요. Wat doet de persoon?",
  "drill.actionPath.2.correct": "물을 마셔요 betekent drinkt water.",
  "drill.actionPath.2.incorrect": "마셔요 is de actie. Het betekent drinkt.",
  "drill.actionPath.3.prompt": "저는 사과를 먹어요. Wat doet de persoon?",
  "drill.actionPath.3.correct": "사과를 먹어요 betekent eet een appel.",
  "drill.actionPath.3.incorrect": "먹어요 is de actie. Het betekent eet.",
});

Object.assign(TEXT.en, {
  "area.town2": "Ireum City",
  "area.town2CityHall": "City Hall",
  "area.town2EastResidence": "East Residence",
  "area.town2Guesthouse": "Ireum Guesthouse",
  "area.town2InfoCenter": "Information Center",
  "area.town2LabelMuseum": "Label Museum",
  "area.town2LostFound": "Lost-and-Found Shop",
  "area.town2ReviewLibrary": "Review Library",
  "npc.town2ActionAttendant": "Action Attendant",
  "npc.town2ActionAttendant.line1": "The final action station asks you to find who reads, drinks, eats, or writes.",
  "npc.town2ActionAttendant.line2": "Watch the object chunk before the action at the end.",
  "npc.town2ActionCoach": "Action Coach",
  "npc.town2ActionCoach.line1": "Look around the park before using the action board.",
  "npc.town2ActionCoach.line2": "Each person shows one simple Korean action sentence.",
  "npc.town2AppleActor": "Apple Actor",
  "npc.town2AppleActor.line1": "저는 사과를 먹어요.",
  "npc.town2AppleActor.line2": "먹어요 is the action I am showing.",
  "npc.town2CityLeader": "City Leader",
  "npc.town2CityLeader.line1": "This hall will become the first full badge test.",
  "npc.town2CityLeader.line2": "For now, the rooms are laid out so each station has space for a later minigame.",
  "npc.town2EastResidentIndoor": "East Resident",
  "npc.town2EastResidentIndoor.line1": "The north road is quiet today.",
  "npc.town2EastResidentIndoor.line2": "The city hall will tell travelers when the next route is ready.",
  "npc.town2GateGreeter": "Gate Greeter",
  "npc.town2GateGreeter.line1": "Welcome to Ireum City.",
  "npc.town2GateGreeter.line2": "Follow the main road to the plaza, then visit the practice districts.",
  "npc.town2GuesthouseHost": "Guesthouse Host",
  "npc.town2GuesthouseHost.line1": "You can rest here between practice stops.",
  "npc.town2GuesthouseHost.line2": "If you are unsure, the city hall waits at the north plaza.",
  "npc.town2InfoClerk": "Information Clerk",
  "npc.town2InfoClerk.line1": "This center will check names and roles.",
  "npc.town2InfoClerk.line2": "Read the chunk before 예요 or 이에요.",
  "npc.town2LabelRunner": "Label Runner",
  "npc.town2LabelRunner.line1": "The labels keep moving around the plaza.",
  "npc.town2LabelRunner.line2": "Near, near you, and far away each need a different Korean pointer.",
  "npc.town2Librarian": "Review Librarian",
  "npc.town2Librarian.line1": "The shelves are reserved for reading and batchim review.",
  "npc.town2Librarian.line2": "Look for bottom consonants when a word feels closed.",
  "npc.town2LostChild": "Lost Child",
  "npc.town2LostChild.line1": "가방이 없어요.",
  "npc.town2LostChild.line2": "The search field is ready for a later missing-object event.",
  "npc.town2LostFoundOwner": "Lost-and-Found Owner",
  "npc.town2LostFoundOwner.line1": "This counter will become the presence and absence check.",
  "npc.town2LostFoundOwner.line2": "For now, the shelves show where the objects will be checked.",
  "npc.town2MuseumCurator": "Museum Curator",
  "npc.town2MuseumCurator.line1": "The museum is arranged by distance.",
  "npc.town2MuseumCurator.line2": "This, that near you, and that far away each has its own display.",
  "npc.town2NameAttendant": "Name Attendant",
  "npc.town2NameAttendant.line1": "The final name room will test self-introductions.",
  "npc.town2NameAttendant.line2": "Names and roles appear before 예요 or 이에요.",
  "npc.town2ObjectAttendant": "Object Attendant",
  "npc.town2ObjectAttendant.line1": "The final object room will test labels and distance words.",
  "npc.town2ObjectAttendant.line2": "Check whether the object is near, near the listener, or far away.",
  "npc.town2PlazaGuide": "Plaza Guide",
  "npc.town2PlazaGuide.line1": "This city's labels, names, objects, and actions are all being sorted.",
  "npc.town2PlazaGuide.line2": "The plaza connects every future practice station.",
  "npc.town2ReaderActor": "Reader Actor",
  "npc.town2ReaderActor.line1": "저는 책을 읽어요.",
  "npc.town2ReaderActor.line2": "읽어요 is the action I am showing.",
  "npc.town2ReadingAttendant": "Reading Attendant",
  "npc.town2ReadingAttendant.line1": "The final reading room will check Hangul and batchim.",
  "npc.town2ReadingAttendant.line2": "The shelves are placed for later reading tasks.",
  "npc.town2Resident": "Town Resident",
  "npc.town2Resident.line1": "저는 주민이에요.",
  "npc.town2Resident.line2": "City Hall is north of the plaza.",
  "npc.town2ReviewClerk": "Review Clerk",
  "npc.town2ReviewClerk.line1": "This table is reserved for mixed review.",
  "npc.town2ReviewClerk.line2": "Later it can test chunks, objects, presence, and actions together.",
  "npc.town2RoadGuard": "Road Guard",
  "npc.town2RoadGuard.line1": "The road to the next route is not ready yet.",
  "npc.town2RoadGuard.line2": "City Hall will eventually decide when travelers may continue.",
  "npc.town2SearchAttendant": "Search Attendant",
  "npc.town2SearchAttendant.line1": "The final search room will test 있어요 and 없어요.",
  "npc.town2SearchAttendant.line2": "The thing before 이 or 가 is what is present or missing.",
  "npc.town2WaterActor": "Water Actor",
  "npc.town2WaterActor.line1": "저는 물을 마셔요.",
  "npc.town2WaterActor.line2": "마셔요 is the action I am showing.",
  "npc.town2WriterActor": "Writer Actor",
  "npc.town2WriterActor.line1": "저는 이름을 써요.",
  "npc.town2WriterActor.line2": "써요 is the action I am showing.",
  "object.routeTrail2": "Trail 2 Road",
  "object.town2ActionParkBoard": "Action Park Board",
  "object.town2ActionParkBoard.line1": "This board is reserved for matching people to Korean action sentences.",
  "object.town2BadgePodium": "Badge Podium",
  "object.town2BadgePodium.line1": "A badge stand waits for the integrated Chapter 1 test.",
  "object.town2BatchimWall": "Batchim Wall",
  "object.town2BatchimWall.line1": "A wall chart marks words with final consonants.",
  "object.town2CentralReviewBoard": "Central Review Board",
  "object.town2CentralReviewBoard.line1": "The board lists the future review order: names, objects, presence, and actions.",
  "object.town2CityHall": "City Hall",
  "object.town2CityHall.door": "City Hall Door",
  "object.town2DistanceFar": "Far Object Marker",
  "object.town2DistanceFar.line1": "저건 points to something far away.",
  "object.town2DistanceMiddle": "Listener Object Marker",
  "object.town2DistanceMiddle.line1": "그건 points near the listener or to something already known.",
  "object.town2DistanceNear": "Near Object Marker",
  "object.town2DistanceNear.line1": "이건 points to something near the speaker.",
  "object.town2EastResidence": "East Residence",
  "object.town2EastResidence.door": "East Residence Door",
  "object.town2FamilyTable": "Family Table",
  "object.town2FamilyTable.line1": "A small table leaves room for later house dialogue.",
  "object.town2FarDisplay": "Far Display",
  "object.town2FarDisplay.line1": "The far display is reserved for 저건 practice.",
  "object.town2FinalActionStation": "Final Action Station",
  "object.town2FinalActionStation.line1": "This station will check action sentences.",
  "object.town2FinalNameStation": "Final Name Station",
  "object.town2FinalNameStation.line1": "This station will check names and roles.",
  "object.town2FinalObjectStation": "Final Object Station",
  "object.town2FinalObjectStation.line1": "This station will check object labels.",
  "object.town2FinalReadingStation": "Final Reading Station",
  "object.town2FinalReadingStation.line1": "This station will check Hangul reading.",
  "object.town2FinalSearchStation": "Final Search Station",
  "object.town2FinalSearchStation.line1": "This station will check presence and absence.",
  "object.town2Guestbook": "Guestbook",
  "object.town2Guestbook.line1": "The guestbook has space for Korean names.",
  "object.town2Guesthouse": "Ireum Guesthouse",
  "object.town2Guesthouse.door": "Ireum Guesthouse Door",
  "object.town2HiddenBagSpot": "Hidden Bag Spot",
  "object.town2HiddenBagSpot.line1": "A future search event can hide a bag here.",
  "object.town2HiddenBookSpot": "Hidden Book Spot",
  "object.town2HiddenBookSpot.line1": "A future search event can hide a book here.",
  "object.town2HiddenWaterSpot": "Hidden Water Spot",
  "object.town2HiddenWaterSpot.line1": "A future search event can hide water here.",
  "object.town2HintBookshelf": "Hint Bookshelf",
  "object.town2HintBookshelf.line1": "The shelf will hold reminders for 있어요, 없어요, and action verbs.",
  "object.town2InfoCenter": "Information Center",
  "object.town2InfoCenter.door": "Information Center Door",
  "object.town2LabelMuseum": "Label Museum",
  "object.town2LabelMuseum.door": "Label Museum Door",
  "object.town2LabelTray": "Label Tray",
  "object.town2LabelTray.line1": "Loose labels wait for later 이건, 그건, and 저건 practice.",
  "object.town2ListenerDisplay": "Listener Display",
  "object.town2ListenerDisplay.line1": "The middle display is reserved for 그건 practice.",
  "object.town2LostFound": "Lost-and-Found Shop",
  "object.town2LostFound.door": "Lost-and-Found Door",
  "object.town2LostFoundClipboard": "Lost-and-Found Clipboard",
  "object.town2LostFoundClipboard.line1": "The clipboard will list which object is present or missing.",
  "object.town2LostFoundCounter": "Lost-and-Found Counter",
  "object.town2LostFoundCounter.line1": "The counter is reserved for 있어요 and 없어요 checks.",
  "object.town2MuseumRuleSign": "Museum Rule Sign",
  "object.town2MuseumRuleSign.line1": "Near, listener-near, and far displays are separated for later practice.",
  "object.town2NameFormTable": "Name Form Table",
  "object.town2NameFormTable.line1": "Forms here will later match names and roles.",
  "object.town2NearDisplay": "Near Display",
  "object.town2NearDisplay.line1": "The near display is reserved for 이건 practice.",
  "object.town2ObjectLabelStall": "Object Label Stall",
  "object.town2ObjectLabelStall.line1": "The stall is reserved for future object-label practice.",
  "object.town2ObjectShelfApple": "Apple Shelf",
  "object.town2ObjectShelfApple.line1": "사과가 있어요 will belong here later.",
  "object.town2ObjectShelfBag": "Bag Shelf",
  "object.town2ObjectShelfBag.line1": "가방이 있어요 will belong here later.",
  "object.town2ObjectShelfBook": "Book Shelf",
  "object.town2ObjectShelfBook.line1": "책이 있어요 will belong here later.",
  "object.town2ObjectShelfWater": "Water Shelf",
  "object.town2ObjectShelfWater.line1": "물이 있어요 will belong here later.",
  "object.town2PracticeStage": "Practice Stage",
  "object.town2PracticeStage.line1": "The open stage leaves space for later action matching.",
  "object.town2ReadingDesk": "Reading Desk",
  "object.town2ReadingDesk.line1": "The desk is reserved for word-reading practice.",
  "object.town2ReadingShelf": "Reading Shelf",
  "object.town2ReadingShelf.line1": "The shelf is reserved for Hangul reading review.",
  "object.town2RegistrationCounter": "Registration Counter",
  "object.town2RegistrationCounter.line1": "The counter will later check 저는 X예요 patterns.",
  "object.town2ReviewLibrary": "Review Library",
  "object.town2ReviewLibrary.door": "Review Library Door",
  "object.town2ReviewTable": "Review Table",
  "object.town2ReviewTable.line1": "A table is reserved for a future mixed-review minigame.",
  "object.town2RoadMap": "Road Map",
  "object.town2RoadMap.line1": "The road map points north, but the next route is not implemented yet.",
  "object.town2RoleCardRack": "Role Card Rack",
  "object.town2RoleCardRack.line1": "Role cards such as student and teacher will be sorted here.",
  "object.town2RouteNote": "Route Note",
  "object.town2RouteNote.line1": "The note says the next road will open later.",
  "object.town2SearchBasket": "Search Basket",
  "object.town2SearchBasket.line1": "The basket marks the future missing-object search field.",
  "object.town2SpeechBench": "Sentence Bench",
  "object.town2SpeechBench.line1": "Short chunked sentences are marked here for later review.",
  "object.town2Trail2GateSign": "Trail 2 Gate Sign",
  "object.town2Trail2GateSign.line1": "North: future Trail 2. The road is not ready yet.",
  "object.town2WaitingLineSign": "Waiting Line Sign",
  "object.town2WaitingLineSign.line1": "Applicants will introduce themselves here in a later task.",
  "object.town2WelcomeSign": "Ireum City Welcome Sign",
  "sign.town2Welcome.line1": "Welcome to Ireum City.",
  "sign.town2Welcome.line2": "This town is laid out for names, object labels, presence, and actions.",
  "route.trail2.pending": "The next trail is beyond the city gate, but it is not ready yet.",
});

Object.assign(TEXT.ko, {
  "area.town2": "이름시",
  "area.town2CityHall": "시청",
  "area.town2EastResidence": "동쪽 집",
  "area.town2Guesthouse": "이름 게스트하우스",
  "area.town2InfoCenter": "정보 센터",
  "area.town2LabelMuseum": "라벨 박물관",
  "area.town2LostFound": "분실물 가게",
  "area.town2ReviewLibrary": "복습 도서관",
  "npc.town2ActionAttendant": "동작 담당자",
  "npc.town2ActionAttendant.line1": "마지막 동작 코너에서는 누가 읽고, 마시고, 먹고, 쓰는지 찾게 됩니다.",
  "npc.town2ActionAttendant.line2": "마지막 동작 앞의 목적어 덩어리를 보세요.",
  "npc.town2ActionCoach": "동작 코치",
  "npc.town2ActionCoach.line1": "동작 게시판을 쓰기 전에 공원을 둘러보세요.",
  "npc.town2ActionCoach.line2": "각 사람은 쉬운 한국어 동작 문장 하나를 보여 줍니다.",
  "npc.town2AppleActor": "사과 배우",
  "npc.town2AppleActor.line1": "저는 사과를 먹어요.",
  "npc.town2AppleActor.line2": "먹어요가 제가 보여 주는 동작입니다.",
  "npc.town2CityLeader": "시청 대표",
  "npc.town2CityLeader.line1": "이 홀은 첫 종합 배지 시험장이 될 예정입니다.",
  "npc.town2CityLeader.line2": "지금은 각 방에 나중 미니게임 자리를 마련해 두었습니다.",
  "npc.town2EastResidentIndoor": "동쪽 주민",
  "npc.town2EastResidentIndoor.line1": "오늘 북쪽 길은 조용해요.",
  "npc.town2EastResidentIndoor.line2": "다음 길이 준비되면 시청에서 여행자에게 알려 줄 거예요.",
  "npc.town2GateGreeter": "문 안내원",
  "npc.town2GateGreeter.line1": "이름시에 오신 것을 환영합니다.",
  "npc.town2GateGreeter.line2": "큰길을 따라 광장으로 가고, 연습 구역들을 둘러보세요.",
  "npc.town2GuesthouseHost": "게스트하우스 주인",
  "npc.town2GuesthouseHost.line1": "연습 사이에 여기서 쉬어도 됩니다.",
  "npc.town2GuesthouseHost.line2": "어디로 갈지 모르겠으면 북쪽 광장의 시청으로 가세요.",
  "npc.town2InfoClerk": "정보 직원",
  "npc.town2InfoClerk.line1": "이 센터는 이름과 역할을 확인할 예정입니다.",
  "npc.town2InfoClerk.line2": "예요나 이에요 앞의 덩어리를 읽으세요.",
  "npc.town2LabelRunner": "라벨 배달원",
  "npc.town2LabelRunner.line1": "라벨이 광장 여기저기로 계속 움직여요.",
  "npc.town2LabelRunner.line2": "가까운 것, 당신 가까이 있는 것, 먼 것은 각각 다른 한국어 표현이 필요합니다.",
  "npc.town2Librarian": "복습 사서",
  "npc.town2Librarian.line1": "이 선반들은 읽기와 받침 복습을 위해 비워 두었습니다.",
  "npc.town2Librarian.line2": "단어가 닫힌 느낌이면 아래 자음을 찾아보세요.",
  "npc.town2LostChild": "길 잃은 아이",
  "npc.town2LostChild.line1": "가방이 없어요.",
  "npc.town2LostChild.line2": "수색 들판은 나중 분실물 이벤트를 위해 준비되어 있어요.",
  "npc.town2LostFoundOwner": "분실물 주인",
  "npc.town2LostFoundOwner.line1": "이 카운터는 있음과 없음 확인 장소가 될 예정입니다.",
  "npc.town2LostFoundOwner.line2": "지금은 선반들이 물건을 확인할 자리를 보여 줍니다.",
  "npc.town2MuseumCurator": "박물관 큐레이터",
  "npc.town2MuseumCurator.line1": "박물관은 거리에 따라 정리되어 있습니다.",
  "npc.town2MuseumCurator.line2": "이것, 당신 근처의 그것, 멀리 있는 저것은 각각 다른 전시대에 있어요.",
  "npc.town2NameAttendant": "이름 담당자",
  "npc.town2NameAttendant.line1": "마지막 이름 방은 자기소개를 확인할 예정입니다.",
  "npc.town2NameAttendant.line2": "이름과 역할은 예요나 이에요 앞에 나옵니다.",
  "npc.town2ObjectAttendant": "사물 담당자",
  "npc.town2ObjectAttendant.line1": "마지막 사물 방은 라벨과 거리 표현을 확인할 예정입니다.",
  "npc.town2ObjectAttendant.line2": "물건이 가까운지, 듣는 사람 가까이인지, 먼지 확인하세요.",
  "npc.town2PlazaGuide": "광장 안내원",
  "npc.town2PlazaGuide.line1": "이 도시는 라벨, 이름, 물건, 동작을 정리하는 중입니다.",
  "npc.town2PlazaGuide.line2": "광장은 모든 미래 연습 장소와 연결됩니다.",
  "npc.town2ReaderActor": "읽기 배우",
  "npc.town2ReaderActor.line1": "저는 책을 읽어요.",
  "npc.town2ReaderActor.line2": "읽어요가 제가 보여 주는 동작입니다.",
  "npc.town2ReadingAttendant": "읽기 담당자",
  "npc.town2ReadingAttendant.line1": "마지막 읽기 방은 한글과 받침을 확인할 예정입니다.",
  "npc.town2ReadingAttendant.line2": "선반들은 나중 읽기 과제를 위해 놓여 있습니다.",
  "npc.town2Resident": "마을 주민",
  "npc.town2Resident.line1": "저는 주민이에요.",
  "npc.town2Resident.line2": "시청은 광장 북쪽에 있어요.",
  "npc.town2ReviewClerk": "복습 직원",
  "npc.town2ReviewClerk.line1": "이 탁자는 종합 복습을 위해 비워 두었습니다.",
  "npc.town2ReviewClerk.line2": "나중에는 덩어리, 물건, 있음, 동작을 함께 확인할 수 있습니다.",
  "npc.town2RoadGuard": "길 지킴이",
  "npc.town2RoadGuard.line1": "다음 길로 가는 도로는 아직 준비되지 않았어요.",
  "npc.town2RoadGuard.line2": "여행자가 계속 가도 되는 때를 시청에서 정할 거예요.",
  "npc.town2SearchAttendant": "수색 담당자",
  "npc.town2SearchAttendant.line1": "마지막 수색 방은 있어요와 없어요를 확인할 예정입니다.",
  "npc.town2SearchAttendant.line2": "이 또는 가 앞의 것이 있거나 없는 물건입니다.",
  "npc.town2WaterActor": "물 배우",
  "npc.town2WaterActor.line1": "저는 물을 마셔요.",
  "npc.town2WaterActor.line2": "마셔요가 제가 보여 주는 동작입니다.",
  "npc.town2WriterActor": "쓰기 배우",
  "npc.town2WriterActor.line1": "저는 이름을 써요.",
  "npc.town2WriterActor.line2": "써요가 제가 보여 주는 동작입니다.",
  "object.routeTrail2": "둘째 길로 가는 길",
  "object.town2ActionParkBoard": "동작 공원 게시판",
  "object.town2ActionParkBoard.line1": "이 게시판은 사람과 한국어 동작 문장을 연결하는 연습 자리를 남겨 둡니다.",
  "object.town2BadgePodium": "배지 받침대",
  "object.town2BadgePodium.line1": "1장 종합 시험을 위한 배지 받침대가 기다립니다.",
  "object.town2BatchimWall": "받침 벽",
  "object.town2BatchimWall.line1": "벽 표가 받침 있는 단어를 표시합니다.",
  "object.town2CentralReviewBoard": "중앙 복습 게시판",
  "object.town2CentralReviewBoard.line1": "게시판에는 이름, 물건, 있음, 동작 순서가 적혀 있습니다.",
  "object.town2CityHall": "시청",
  "object.town2CityHall.door": "시청 문",
  "object.town2DistanceFar": "먼 물건 표지",
  "object.town2DistanceFar.line1": "저건은 멀리 있는 것을 가리킵니다.",
  "object.town2DistanceMiddle": "듣는 사람 쪽 물건 표지",
  "object.town2DistanceMiddle.line1": "그건은 듣는 사람 가까이나 이미 아는 것을 가리킵니다.",
  "object.town2DistanceNear": "가까운 물건 표지",
  "object.town2DistanceNear.line1": "이건은 말하는 사람 가까이 있는 것을 가리킵니다.",
  "object.town2EastResidence": "동쪽 집",
  "object.town2EastResidence.door": "동쪽 집 문",
  "object.town2FamilyTable": "가족 식탁",
  "object.town2FamilyTable.line1": "작은 식탁은 나중 집 대화를 위한 자리를 남겨 둡니다.",
  "object.town2FarDisplay": "먼 전시대",
  "object.town2FarDisplay.line1": "먼 전시대는 저건 연습을 위해 비워 두었습니다.",
  "object.town2FinalActionStation": "마지막 동작 코너",
  "object.town2FinalActionStation.line1": "이 코너는 동작 문장을 확인할 예정입니다.",
  "object.town2FinalNameStation": "마지막 이름 코너",
  "object.town2FinalNameStation.line1": "이 코너는 이름과 역할을 확인할 예정입니다.",
  "object.town2FinalObjectStation": "마지막 사물 코너",
  "object.town2FinalObjectStation.line1": "이 코너는 사물 이름을 확인할 예정입니다.",
  "object.town2FinalReadingStation": "마지막 읽기 코너",
  "object.town2FinalReadingStation.line1": "이 코너는 한글 읽기를 확인할 예정입니다.",
  "object.town2FinalSearchStation": "마지막 수색 코너",
  "object.town2FinalSearchStation.line1": "이 코너는 있음과 없음을 확인할 예정입니다.",
  "object.town2Guestbook": "방명록",
  "object.town2Guestbook.line1": "방명록에는 한국어 이름을 쓸 자리가 있습니다.",
  "object.town2Guesthouse": "이름 게스트하우스",
  "object.town2Guesthouse.door": "이름 게스트하우스 문",
  "object.town2HiddenBagSpot": "숨은 가방 자리",
  "object.town2HiddenBagSpot.line1": "나중 수색 이벤트에서 여기에 가방을 숨길 수 있습니다.",
  "object.town2HiddenBookSpot": "숨은 책 자리",
  "object.town2HiddenBookSpot.line1": "나중 수색 이벤트에서 여기에 책을 숨길 수 있습니다.",
  "object.town2HiddenWaterSpot": "숨은 물 자리",
  "object.town2HiddenWaterSpot.line1": "나중 수색 이벤트에서 여기에 물을 숨길 수 있습니다.",
  "object.town2HintBookshelf": "힌트 책장",
  "object.town2HintBookshelf.line1": "이 책장에는 있어요, 없어요, 동작 동사 힌트가 들어갈 예정입니다.",
  "object.town2InfoCenter": "정보 센터",
  "object.town2InfoCenter.door": "정보 센터 문",
  "object.town2LabelMuseum": "라벨 박물관",
  "object.town2LabelMuseum.door": "라벨 박물관 문",
  "object.town2LabelTray": "라벨 쟁반",
  "object.town2LabelTray.line1": "흩어진 라벨들이 나중 이건, 그건, 저건 연습을 기다립니다.",
  "object.town2ListenerDisplay": "듣는 사람 쪽 전시대",
  "object.town2ListenerDisplay.line1": "가운데 전시대는 그건 연습을 위해 비워 두었습니다.",
  "object.town2LostFound": "분실물 가게",
  "object.town2LostFound.door": "분실물 가게 문",
  "object.town2LostFoundClipboard": "분실물 기록판",
  "object.town2LostFoundClipboard.line1": "기록판에는 어떤 물건이 있거나 없는지 적힐 예정입니다.",
  "object.town2LostFoundCounter": "분실물 카운터",
  "object.town2LostFoundCounter.line1": "카운터는 있어요와 없어요 확인을 위해 비워 두었습니다.",
  "object.town2MuseumRuleSign": "박물관 규칙 표지판",
  "object.town2MuseumRuleSign.line1": "가까운 것, 듣는 사람 가까운 것, 먼 것의 전시대가 나뉘어 있습니다.",
  "object.town2NameFormTable": "이름 양식 탁자",
  "object.town2NameFormTable.line1": "이 양식은 나중 이름과 역할을 연결합니다.",
  "object.town2NearDisplay": "가까운 전시대",
  "object.town2NearDisplay.line1": "가까운 전시대는 이건 연습을 위해 비워 두었습니다.",
  "object.town2ObjectLabelStall": "사물 라벨 가판대",
  "object.town2ObjectLabelStall.line1": "가판대는 나중 사물 라벨 연습을 위해 비워 두었습니다.",
  "object.town2ObjectShelfApple": "사과 선반",
  "object.town2ObjectShelfApple.line1": "사과가 있어요 문장은 나중 여기에 연결됩니다.",
  "object.town2ObjectShelfBag": "가방 선반",
  "object.town2ObjectShelfBag.line1": "가방이 있어요 문장은 나중 여기에 연결됩니다.",
  "object.town2ObjectShelfBook": "책 선반",
  "object.town2ObjectShelfBook.line1": "책이 있어요 문장은 나중 여기에 연결됩니다.",
  "object.town2ObjectShelfWater": "물 선반",
  "object.town2ObjectShelfWater.line1": "물이 있어요 문장은 나중 여기에 연결됩니다.",
  "object.town2PracticeStage": "연습 무대",
  "object.town2PracticeStage.line1": "열린 무대는 나중 동작 맞히기 자리를 남겨 둡니다.",
  "object.town2ReadingDesk": "읽기 책상",
  "object.town2ReadingDesk.line1": "책상은 단어 읽기 연습을 위해 비워 두었습니다.",
  "object.town2ReadingShelf": "읽기 선반",
  "object.town2ReadingShelf.line1": "선반은 한글 읽기 복습을 위해 비워 두었습니다.",
  "object.town2RegistrationCounter": "등록 카운터",
  "object.town2RegistrationCounter.line1": "카운터는 나중 저는 X예요 패턴을 확인합니다.",
  "object.town2ReviewLibrary": "복습 도서관",
  "object.town2ReviewLibrary.door": "복습 도서관 문",
  "object.town2ReviewTable": "복습 탁자",
  "object.town2ReviewTable.line1": "탁자는 나중 종합 복습 미니게임을 위해 비워 두었습니다.",
  "object.town2RoadMap": "길 지도",
  "object.town2RoadMap.line1": "길 지도는 북쪽을 가리키지만 다음 길은 아직 구현되지 않았습니다.",
  "object.town2RoleCardRack": "역할 카드 진열대",
  "object.town2RoleCardRack.line1": "학생과 선생님 같은 역할 카드를 여기에 정리할 예정입니다.",
  "object.town2RouteNote": "길 안내 메모",
  "object.town2RouteNote.line1": "메모에는 다음 길이 나중에 열린다고 적혀 있습니다.",
  "object.town2SearchBasket": "수색 바구니",
  "object.town2SearchBasket.line1": "바구니는 나중 분실물 수색 들판을 표시합니다.",
  "object.town2SpeechBench": "문장 벤치",
  "object.town2SpeechBench.line1": "짧게 나눈 문장들이 나중 복습을 위해 표시되어 있습니다.",
  "object.town2Trail2GateSign": "둘째 길 문 표지판",
  "object.town2Trail2GateSign.line1": "북쪽: 미래의 둘째 길. 도로는 아직 준비되지 않았습니다.",
  "object.town2WaitingLineSign": "대기 줄 표지판",
  "object.town2WaitingLineSign.line1": "나중 과제에서 신청자들이 여기서 자기소개를 합니다.",
  "object.town2WelcomeSign": "이름시 환영 표지판",
  "sign.town2Welcome.line1": "이름시에 오신 것을 환영합니다.",
  "sign.town2Welcome.line2": "이 도시는 이름, 사물 라벨, 있음, 동작을 연습하도록 배치되어 있습니다.",
  "route.trail2.pending": "다음 길은 도시 문 너머에 있지만 아직 준비되지 않았습니다.",
});

Object.assign(TEXT.nl, {
  "area.town2": "Naamstad",
  "area.town2CityHall": "Stadhuis",
  "area.town2EastResidence": "Oosthuis",
  "area.town2Guesthouse": "Naamstad Pension",
  "area.town2InfoCenter": "Informatiecentrum",
  "area.town2LabelMuseum": "Labelmuseum",
  "area.town2LostFound": "Gevonden Voorwerpen",
  "area.town2ReviewLibrary": "Herhalingsbibliotheek",
  "npc.town2ActionAttendant": "Actiebegeleider",
  "npc.town2ActionAttendant.line1": "Het laatste actiestation vraagt later wie leest, drinkt, eet of schrijft.",
  "npc.town2ActionAttendant.line2": "Let op het objectblok voor de actie aan het einde.",
  "npc.town2ActionCoach": "Actiecoach",
  "npc.town2ActionCoach.line1": "Kijk rond in het park voordat je het actiebord gebruikt.",
  "npc.town2ActionCoach.line2": "Elke persoon toont een eenvoudige Koreaanse actiezin.",
  "npc.town2AppleActor": "Appelacteur",
  "npc.town2AppleActor.line1": "저는 사과를 먹어요.",
  "npc.town2AppleActor.line2": "먹어요 is de actie die ik toon.",
  "npc.town2CityLeader": "Stadsleider",
  "npc.town2CityLeader.line1": "Deze hal wordt de eerste volledige badgetest.",
  "npc.town2CityLeader.line2": "Voor nu zijn de kamers klaargezet voor latere minigames.",
  "npc.town2EastResidentIndoor": "Oostbewoner",
  "npc.town2EastResidentIndoor.line1": "De noordweg is vandaag rustig.",
  "npc.town2EastResidentIndoor.line2": "Het stadhuis vertelt reizigers wanneer de volgende route klaar is.",
  "npc.town2GateGreeter": "Poortgids",
  "npc.town2GateGreeter.line1": "Welkom in Naamstad.",
  "npc.town2GateGreeter.line2": "Volg de hoofdweg naar het plein en bezoek daarna de oefengebieden.",
  "npc.town2GuesthouseHost": "Pensionhouder",
  "npc.town2GuesthouseHost.line1": "Je kunt hier rusten tussen oefenstops.",
  "npc.town2GuesthouseHost.line2": "Als je twijfelt, ligt het stadhuis aan het noordplein.",
  "npc.town2InfoClerk": "Informatiemedewerker",
  "npc.town2InfoClerk.line1": "Dit centrum controleert later namen en rollen.",
  "npc.town2InfoClerk.line2": "Lees het blok voor 예요 of 이에요.",
  "npc.town2LabelRunner": "Labelbezorger",
  "npc.town2LabelRunner.line1": "De labels bewegen steeds over het plein.",
  "npc.town2LabelRunner.line2": "Dichtbij, dichtbij jou en ver weg hebben elk een andere Koreaanse aanwijzer.",
  "npc.town2Librarian": "Herhalingsbibliothecaris",
  "npc.town2Librarian.line1": "De planken zijn gereserveerd voor lezen en batchimherhaling.",
  "npc.town2Librarian.line2": "Zoek onderste medeklinkers als een woord gesloten voelt.",
  "npc.town2LostChild": "Verdwaald Kind",
  "npc.town2LostChild.line1": "가방이 없어요.",
  "npc.town2LostChild.line2": "Het zoekveld is klaar voor een later vermist-objectevent.",
  "npc.town2LostFoundOwner": "Eigenaar Gevonden Voorwerpen",
  "npc.town2LostFoundOwner.line1": "Deze balie wordt de controle voor aanwezig en afwezig.",
  "npc.town2LostFoundOwner.line2": "Voor nu tonen de planken waar de objecten gecontroleerd worden.",
  "npc.town2MuseumCurator": "Museumcurator",
  "npc.town2MuseumCurator.line1": "Het museum is op afstand ingericht.",
  "npc.town2MuseumCurator.line2": "Dit, dat bij jou en dat ver weg hebben elk een eigen vitrine.",
  "npc.town2NameAttendant": "Naambegeleider",
  "npc.town2NameAttendant.line1": "De laatste naamkamer test later zelfvoorstellingen.",
  "npc.town2NameAttendant.line2": "Namen en rollen staan voor 예요 of 이에요.",
  "npc.town2ObjectAttendant": "Objectbegeleider",
  "npc.town2ObjectAttendant.line1": "De laatste objectkamer test later labels en afstandswoorden.",
  "npc.town2ObjectAttendant.line2": "Controleer of het object dichtbij, bij de luisteraar of ver weg is.",
  "npc.town2PlazaGuide": "Pleingids",
  "npc.town2PlazaGuide.line1": "Deze stad sorteert labels, namen, objecten en acties.",
  "npc.town2PlazaGuide.line2": "Het plein verbindt alle toekomstige oefenstations.",
  "npc.town2ReaderActor": "Leesacteur",
  "npc.town2ReaderActor.line1": "저는 책을 읽어요.",
  "npc.town2ReaderActor.line2": "읽어요 is de actie die ik toon.",
  "npc.town2ReadingAttendant": "Leesbegeleider",
  "npc.town2ReadingAttendant.line1": "De laatste leeskamer controleert later Hangul en batchim.",
  "npc.town2ReadingAttendant.line2": "De planken staan klaar voor latere leestaken.",
  "npc.town2Resident": "Stadsbewoner",
  "npc.town2Resident.line1": "저는 주민이에요.",
  "npc.town2Resident.line2": "Het stadhuis ligt noordelijk van het plein.",
  "npc.town2ReviewClerk": "Herhalingsmedewerker",
  "npc.town2ReviewClerk.line1": "Deze tafel is gereserveerd voor gemengde herhaling.",
  "npc.town2ReviewClerk.line2": "Later kan hij zinsblokken, objecten, aanwezigheid en acties samen testen.",
  "npc.town2RoadGuard": "Wegwachter",
  "npc.town2RoadGuard.line1": "De weg naar de volgende route is nog niet klaar.",
  "npc.town2RoadGuard.line2": "Het stadhuis bepaalt later wanneer reizigers verder mogen.",
  "npc.town2SearchAttendant": "Zoekbegeleider",
  "npc.town2SearchAttendant.line1": "De laatste zoekkamer test later 있어요 en 없어요.",
  "npc.town2SearchAttendant.line2": "Het ding voor 이 of 가 is aanwezig of afwezig.",
  "npc.town2WaterActor": "Wateracteur",
  "npc.town2WaterActor.line1": "저는 물을 마셔요.",
  "npc.town2WaterActor.line2": "마셔요 is de actie die ik toon.",
  "npc.town2WriterActor": "Schrijfacteur",
  "npc.town2WriterActor.line1": "저는 이름을 써요.",
  "npc.town2WriterActor.line2": "써요 is de actie die ik toon.",
  "object.routeTrail2": "Route naar Pad 2",
  "object.town2ActionParkBoard": "Actieparkbord",
  "object.town2ActionParkBoard.line1": "Dit bord is gereserveerd om mensen aan Koreaanse actiezinnen te koppelen.",
  "object.town2BadgePodium": "Badgepodium",
  "object.town2BadgePodium.line1": "Een badgepodium wacht op de gecombineerde test van hoofdstuk 1.",
  "object.town2BatchimWall": "Batchimmuur",
  "object.town2BatchimWall.line1": "Een wandkaart markeert woorden met eindmedeklinkers.",
  "object.town2CentralReviewBoard": "Centraal Herhalingsbord",
  "object.town2CentralReviewBoard.line1": "Het bord toont de latere volgorde: namen, objecten, aanwezigheid en acties.",
  "object.town2CityHall": "Stadhuis",
  "object.town2CityHall.door": "Stadhuisdeur",
  "object.town2DistanceFar": "Ver Objectmarkering",
  "object.town2DistanceFar.line1": "저건 wijst naar iets ver weg.",
  "object.town2DistanceMiddle": "Luisteraarobjectmarkering",
  "object.town2DistanceMiddle.line1": "그건 wijst nabij de luisteraar of naar iets bekends.",
  "object.town2DistanceNear": "Dichtbij Objectmarkering",
  "object.town2DistanceNear.line1": "이건 wijst naar iets dicht bij de spreker.",
  "object.town2EastResidence": "Oosthuis",
  "object.town2EastResidence.door": "Deur van het Oosthuis",
  "object.town2FamilyTable": "Familietafel",
  "object.town2FamilyTable.line1": "Een kleine tafel laat ruimte voor latere huisdialogen.",
  "object.town2FarDisplay": "Verre Vitrine",
  "object.town2FarDisplay.line1": "De verre vitrine is gereserveerd voor 저건-oefening.",
  "object.town2FinalActionStation": "Laatste Actiestation",
  "object.town2FinalActionStation.line1": "Dit station controleert later actiezinnen.",
  "object.town2FinalNameStation": "Laatste Naamstation",
  "object.town2FinalNameStation.line1": "Dit station controleert later namen en rollen.",
  "object.town2FinalObjectStation": "Laatste Objectstation",
  "object.town2FinalObjectStation.line1": "Dit station controleert later objectlabels.",
  "object.town2FinalReadingStation": "Laatste Leesstation",
  "object.town2FinalReadingStation.line1": "Dit station controleert later Hangul lezen.",
  "object.town2FinalSearchStation": "Laatste Zoekstation",
  "object.town2FinalSearchStation.line1": "Dit station controleert later aanwezigheid en afwezigheid.",
  "object.town2Guestbook": "Gastenboek",
  "object.town2Guestbook.line1": "Het gastenboek heeft ruimte voor Koreaanse namen.",
  "object.town2Guesthouse": "Naamstad Pension",
  "object.town2Guesthouse.door": "Deur van Naamstad Pension",
  "object.town2HiddenBagSpot": "Verborgen Tasplek",
  "object.town2HiddenBagSpot.line1": "Een later zoekevent kan hier een tas verbergen.",
  "object.town2HiddenBookSpot": "Verborgen Boekplek",
  "object.town2HiddenBookSpot.line1": "Een later zoekevent kan hier een boek verbergen.",
  "object.town2HiddenWaterSpot": "Verborgen Waterplek",
  "object.town2HiddenWaterSpot.line1": "Een later zoekevent kan hier water verbergen.",
  "object.town2HintBookshelf": "Hintboekenkast",
  "object.town2HintBookshelf.line1": "De plank krijgt later geheugensteuntjes voor 있어요, 없어요 en actiewerkwoorden.",
  "object.town2InfoCenter": "Informatiecentrum",
  "object.town2InfoCenter.door": "Deur van het Informatiecentrum",
  "object.town2LabelMuseum": "Labelmuseum",
  "object.town2LabelMuseum.door": "Deur van het Labelmuseum",
  "object.town2LabelTray": "Labeldienblad",
  "object.town2LabelTray.line1": "Losse labels wachten op latere 이건-, 그건- en 저건-oefening.",
  "object.town2ListenerDisplay": "Luisteraarvitrine",
  "object.town2ListenerDisplay.line1": "De middelste vitrine is gereserveerd voor 그건-oefening.",
  "object.town2LostFound": "Gevonden Voorwerpen",
  "object.town2LostFound.door": "Deur van Gevonden Voorwerpen",
  "object.town2LostFoundClipboard": "Klembord Gevonden Voorwerpen",
  "object.town2LostFoundClipboard.line1": "Het klembord vermeldt later welk object aanwezig of afwezig is.",
  "object.town2LostFoundCounter": "Balie Gevonden Voorwerpen",
  "object.town2LostFoundCounter.line1": "De balie is gereserveerd voor 있어요- en 없어요-controles.",
  "object.town2MuseumRuleSign": "Museumregelbord",
  "object.town2MuseumRuleSign.line1": "Dichtbij, bij de luisteraar en ver weg hebben aparte vitrines.",
  "object.town2NameFormTable": "Naamformuliertafel",
  "object.town2NameFormTable.line1": "Deze formulieren koppelen later namen en rollen.",
  "object.town2NearDisplay": "Dichtbij Vitrine",
  "object.town2NearDisplay.line1": "De dichtbij-vitrine is gereserveerd voor 이건-oefening.",
  "object.town2ObjectLabelStall": "Objectlabelkraam",
  "object.town2ObjectLabelStall.line1": "De kraam is gereserveerd voor latere objectlabeloefening.",
  "object.town2ObjectShelfApple": "Appelplank",
  "object.town2ObjectShelfApple.line1": "사과가 있어요 hoort hier later bij.",
  "object.town2ObjectShelfBag": "Tasplank",
  "object.town2ObjectShelfBag.line1": "가방이 있어요 hoort hier later bij.",
  "object.town2ObjectShelfBook": "Boekplank",
  "object.town2ObjectShelfBook.line1": "책이 있어요 hoort hier later bij.",
  "object.town2ObjectShelfWater": "Waterplank",
  "object.town2ObjectShelfWater.line1": "물이 있어요 hoort hier later bij.",
  "object.town2PracticeStage": "Oefenpodium",
  "object.town2PracticeStage.line1": "Het open podium laat ruimte voor later actiematchen.",
  "object.town2ReadingDesk": "Leesbureau",
  "object.town2ReadingDesk.line1": "Het bureau is gereserveerd voor woordleesoefening.",
  "object.town2ReadingShelf": "Leesplank",
  "object.town2ReadingShelf.line1": "De plank is gereserveerd voor Hangulherhaling.",
  "object.town2RegistrationCounter": "Registratiebalie",
  "object.town2RegistrationCounter.line1": "De balie controleert later 저는 X예요-patronen.",
  "object.town2ReviewLibrary": "Herhalingsbibliotheek",
  "object.town2ReviewLibrary.door": "Deur van de Herhalingsbibliotheek",
  "object.town2ReviewTable": "Herhalingstafel",
  "object.town2ReviewTable.line1": "Een tafel is gereserveerd voor een latere gemengde herhalingsminigame.",
  "object.town2RoadMap": "Routekaart",
  "object.town2RoadMap.line1": "De routekaart wijst naar het noorden, maar de volgende route is nog niet gebouwd.",
  "object.town2RoleCardRack": "Rollenkaartenrek",
  "object.town2RoleCardRack.line1": "Rolkaarten zoals student en leraar worden hier later gesorteerd.",
  "object.town2RouteNote": "Routebriefje",
  "object.town2RouteNote.line1": "Het briefje zegt dat de volgende weg later opent.",
  "object.town2SearchBasket": "Zoekmand",
  "object.town2SearchBasket.line1": "De mand markeert het latere zoekveld voor vermiste objecten.",
  "object.town2SpeechBench": "Zinsbankje",
  "object.town2SpeechBench.line1": "Korte opgesplitste zinnen staan hier voor latere herhaling.",
  "object.town2Trail2GateSign": "Poortbord Pad 2",
  "object.town2Trail2GateSign.line1": "Noord: toekomstig Pad 2. De weg is nog niet klaar.",
  "object.town2WaitingLineSign": "Wachtrijbord",
  "object.town2WaitingLineSign.line1": "Aanvragers stellen zich hier later voor.",
  "object.town2WelcomeSign": "Welkomstbord Naamstad",
  "sign.town2Welcome.line1": "Welkom in Naamstad.",
  "sign.town2Welcome.line2": "Deze stad is ingericht voor namen, objectlabels, aanwezigheid en acties.",
  "route.trail2.pending": "Het volgende pad ligt voorbij de stadspoort, maar is nog niet klaar.",
});

Object.assign(TEXT.en, {
  "dictionary.hangul.category.aspirated": "Aspirated Signs",
  "dictionary.hangul.category.basicConsonants": "Basic Consonants",
  "dictionary.hangul.category.basicVowels": "Basic Vowels",
  "dictionary.hangul.category.batchim": "Batchim",
  "dictionary.hangul.category.doubleConsonants": "Double Consonants",
  "dictionary.hangul.category.firstSyllables": "First Syllables",
  "dictionary.hangul.empty": "No entries seen yet.",
  "dictionary.hangul.page": "{page}/{pages}",
  "dictionary.hangul.panelSummary": "{seen}/{total} seen, {mastered} M",
  "dictionary.hangul.status.learning": "Learning",
  "dictionary.hangul.status.mastered": "Mastered",
  "dictionary.hangul.status.seen": "Seen",
  "dictionary.hangul.status.unseen": "Unseen",
  "dictionary.hangul.summary": "Seen {seen}/{total}  Mastered {mastered}/{total}",
  "dictionary.hangul.title": "Hangul Dictionary",
  "dictionary.hangul.unseenValue": "???",
  "drill.hangul.choice.literal": "{value}",
  "drill.hangul.feedback.correctBatchim": "{glyph}: {answer}.",
  "drill.hangul.feedback.correctMatch": "{glyph} matches {answer}.",
  "drill.hangul.feedback.correctSyllable": "{left} + {right} makes {glyph}, read {answer}.",
  "drill.hangul.feedback.correctTransform": "{base} becomes {glyph}, read {answer}.",
  "drill.hangul.feedback.incorrectBatchim": "Look under the block: {glyph}: {answer}.",
  "drill.hangul.feedback.incorrectMatch": "Correct match: {glyph} is {answer}.",
  "drill.hangul.feedback.incorrectSyllable": "Build it left to right: {left} + {right} makes {glyph}, read {answer}.",
  "drill.hangul.feedback.incorrectTransform": "The correct sign is {glyph}, read {answer}.",
  "drill.hangul.prompt.aspiratedToSign": "Which aspirated sign comes from {base} + ㅎ?",
  "drill.hangul.prompt.aspiratedToSound": "Which sound fits aspirated {glyph}?",
  "drill.hangul.prompt.batchimFinal": "Which final sound does {glyph} use?",
  "drill.hangul.prompt.batchimPresence": "Does {glyph} have batchim?",
  "drill.hangul.prompt.consonantToName": "Which letter name fits {glyph}?",
  "drill.hangul.prompt.doubleBatchimFinal": "For {glyph} with {cluster}, which final is used here?",
  "drill.hangul.prompt.doubleToSign": "Which double sign comes from {base} + {base}?",
  "drill.hangul.prompt.doubleToSound": "Which tense sound fits {glyph}?",
  "drill.hangul.prompt.syllableToSound": "Combine {left} + {right}. Choose how {glyph} reads.",
  "drill.hangul.prompt.vowelToSound": "Which sound name fits {glyph}?",
  "menu.dictionary": "Hangul Dictionary",
  "panel.hangulDex": "Hangul Dex",
});

Object.assign(TEXT.ko, {
  "dictionary.hangul.category.aspirated": "거센소리 글자",
  "dictionary.hangul.category.basicConsonants": "기본 자음",
  "dictionary.hangul.category.basicVowels": "기본 모음",
  "dictionary.hangul.category.batchim": "받침",
  "dictionary.hangul.category.doubleConsonants": "쌍자음",
  "dictionary.hangul.category.firstSyllables": "첫 음절",
  "dictionary.hangul.empty": "아직 본 항목이 없습니다.",
  "dictionary.hangul.page": "{page}/{pages}",
  "dictionary.hangul.panelSummary": "{seen}/{total} 봄, 숙달 {mastered}",
  "dictionary.hangul.status.learning": "연습 중",
  "dictionary.hangul.status.mastered": "숙달",
  "dictionary.hangul.status.seen": "봄",
  "dictionary.hangul.status.unseen": "미발견",
  "dictionary.hangul.summary": "봄 {seen}/{total}  숙달 {mastered}/{total}",
  "dictionary.hangul.title": "한글 도감",
  "dictionary.hangul.unseenValue": "???",
  "drill.hangul.choice.literal": "{value}",
  "drill.hangul.feedback.correctBatchim": "{glyph}: {answer}.",
  "drill.hangul.feedback.correctMatch": "{glyph}은/는 {answer}입니다.",
  "drill.hangul.feedback.correctSyllable": "{left} + {right}은/는 {glyph}이 되고 {answer}로 읽습니다.",
  "drill.hangul.feedback.correctTransform": "{base}에서 {glyph}이 되고 {answer}로 읽습니다.",
  "drill.hangul.feedback.incorrectBatchim": "글자 아래를 보세요: {glyph}: {answer}.",
  "drill.hangul.feedback.incorrectMatch": "맞는 답은 {glyph} = {answer}입니다.",
  "drill.hangul.feedback.incorrectSyllable": "왼쪽부터 보세요: {left} + {right}은/는 {glyph}, 읽기는 {answer}입니다.",
  "drill.hangul.feedback.incorrectTransform": "맞는 글자는 {glyph}, 읽기는 {answer}입니다.",
  "drill.hangul.prompt.aspiratedToSign": "{base} + ㅎ에서 나오는 거센소리 글자는 무엇인가요?",
  "drill.hangul.prompt.aspiratedToSound": "거센소리 {glyph}에 맞는 소리는 무엇인가요?",
  "drill.hangul.prompt.batchimFinal": "{glyph}은/는 어떤 끝소리를 쓰나요?",
  "drill.hangul.prompt.batchimPresence": "{glyph}에 받침이 있나요?",
  "drill.hangul.prompt.consonantToName": "{glyph}에 맞는 글자 이름은 무엇인가요?",
  "drill.hangul.prompt.doubleBatchimFinal": "{cluster}이 있는 {glyph}에서는 어떤 받침을 쓰나요?",
  "drill.hangul.prompt.doubleToSign": "{base} + {base}에서 나오는 쌍자음은 무엇인가요?",
  "drill.hangul.prompt.doubleToSound": "{glyph}에 맞는 된소리는 무엇인가요?",
  "drill.hangul.prompt.syllableToSound": "{left} + {right}을/를 합치세요. {glyph}은/는 어떻게 읽나요?",
  "drill.hangul.prompt.vowelToSound": "{glyph}에 맞는 소리 이름은 무엇인가요?",
  "menu.dictionary": "한글 도감",
  "panel.hangulDex": "한글 도감",
});

Object.assign(TEXT.nl, {
  "dictionary.hangul.category.aspirated": "Aangeblazen Tekens",
  "dictionary.hangul.category.basicConsonants": "Basismedeklinkers",
  "dictionary.hangul.category.basicVowels": "Basisklinkers",
  "dictionary.hangul.category.batchim": "Batchim",
  "dictionary.hangul.category.doubleConsonants": "Dubbele Medeklinkers",
  "dictionary.hangul.category.firstSyllables": "Eerste Lettergrepen",
  "dictionary.hangul.empty": "Nog geen items gezien.",
  "dictionary.hangul.page": "{page}/{pages}",
  "dictionary.hangul.panelSummary": "{seen}/{total} gezien, {mastered} B",
  "dictionary.hangul.status.learning": "Aan het leren",
  "dictionary.hangul.status.mastered": "Beheerst",
  "dictionary.hangul.status.seen": "Gezien",
  "dictionary.hangul.status.unseen": "Ongezien",
  "dictionary.hangul.summary": "Gezien {seen}/{total}  Beheerst {mastered}/{total}",
  "dictionary.hangul.title": "Hangulwoordenboek",
  "dictionary.hangul.unseenValue": "???",
  "drill.hangul.choice.literal": "{value}",
  "drill.hangul.feedback.correctBatchim": "{glyph}: {answer}.",
  "drill.hangul.feedback.correctMatch": "{glyph} hoort bij {answer}.",
  "drill.hangul.feedback.correctSyllable": "{left} + {right} maakt {glyph}, gelezen als {answer}.",
  "drill.hangul.feedback.correctTransform": "{base} wordt {glyph}, gelezen als {answer}.",
  "drill.hangul.feedback.incorrectBatchim": "Kijk onder het blok: {glyph}: {answer}.",
  "drill.hangul.feedback.incorrectMatch": "De juiste match is {glyph} = {answer}.",
  "drill.hangul.feedback.incorrectSyllable": "Bouw van links naar rechts: {left} + {right} maakt {glyph}, gelezen als {answer}.",
  "drill.hangul.feedback.incorrectTransform": "Het juiste teken is {glyph}, gelezen als {answer}.",
  "drill.hangul.prompt.aspiratedToSign": "Welk aangeblazen teken komt uit {base} + ㅎ?",
  "drill.hangul.prompt.aspiratedToSound": "Welke klank past bij aangeblazen {glyph}?",
  "drill.hangul.prompt.batchimFinal": "Welke eindklank gebruikt {glyph}?",
  "drill.hangul.prompt.batchimPresence": "Heeft {glyph} batchim?",
  "drill.hangul.prompt.consonantToName": "Welke letternaam past bij {glyph}?",
  "drill.hangul.prompt.doubleBatchimFinal": "Welke eindklank gebruik je hier voor {glyph} met {cluster}?",
  "drill.hangul.prompt.doubleToSign": "Welk dubbel teken komt uit {base} + {base}?",
  "drill.hangul.prompt.doubleToSound": "Welke gespannen klank past bij {glyph}?",
  "drill.hangul.prompt.syllableToSound": "Combineer {left} + {right}. Hoe lees je {glyph}?",
  "drill.hangul.prompt.vowelToSound": "Welke klanknaam past bij {glyph}?",
  "menu.dictionary": "Hangulwoordenboek",
  "panel.hangulDex": "Hangul Dex",
});

Object.assign(TEXT.en, {
  "menu.journal": "Quest Journal",
  "menu.words": "Word Dictionary",
  "dictionary.hangul.category.compoundVowels": "Compound Vowels",
  "journal.title": "Quest Journal",
  "journal.badges": "Badges",
  "journal.noBadges": "No badges yet",
  "journal.complete": "Complete",
  "journal.hint": "Next",
  "journal.chapter.town1": "Ch.1 Haneul Town",
  "journal.chapter.town2": "Ch.2 Name City",
  "journal.chapter.town3": "Ch.3 Number Market",
  "badge.firstWords": "First Words Badge",
  "badge.numbers": "Number Badge",
  "panel.badges": "Badges",
  "panel.words": "Words",
  "dictionary.words.title": "Word Dictionary",
  "dictionary.words.summary": "Seen {seen} - Mastered {mastered}/{total}",
  "dictionary.words.panelSummary": "{seen} seen - {mastered} done",
  "dictionary.words.empty": "No words found here yet. Keep exploring!",
  "dictionary.words.category.position": "Position & Place",
  "dictionary.words.category.nature": "Nature & Trail",
  "dictionary.words.category.numbersSino": "Sino Numbers",
  "dictionary.words.category.numbersNative": "Native Numbers",
  "dictionary.words.category.counters": "Counters",
  "dictionary.words.category.shopping": "Shopping & Money",
  "dictionary.words.category.food": "Food & Market",
  "dictionary.words.category.colors": "Colors",
  "dictionary.words.category.people": "People",
  "dictionary.words.category.cafe": "Cafe & Drinks",
  "settings.erase": "Erase Save",
  "settings.eraseArmed": "Press again to erase!",
  "drill.word.prompt.meaning": "What does {hangul} mean?",
  "drill.word.prompt.hangul": "Which word means \"{meaning}\"?",
  "drill.word.feedback.correct": "{hangul} = {meaning}.",
  "drill.word.feedback.incorrect": "Remember: {hangul} means {meaning}.",
  "drill.hangul.prompt.compoundCombine": "Which vowel comes from {left} + {right}?",
  "drill.hangul.prompt.soundToVowel": "Which vowel makes the sound \"{answer}\"?",
  "drill.hangul.prompt.nameToConsonant": "Which consonant is named {answer}?",
  "drill.hangul.prompt.readingToSyllable": "Which block reads \"{answer}\"?",
  "drill.word.prompt.priceToReading": "Read the price tag: {value}원",
  "drill.word.prompt.readingToPrice": "{reading} 원 - how much is that?",
  "drill.word.prompt.countPhrase": "{phrase} - how many?",
  "npc.guide.next": "Next goal: {objective} ({where})",
  "npc.guide.allDone": "Every task in this chapter is complete. The road onward is open!",
  "panel.where": "Where",
  "npc.mina.pool2.line1": "학교는 북서쪽에 있어요.",
  "npc.mina.pool2.line2": "The school is northwest - that is where reading begins.",
  "npc.joon.pool2.line1": "북쪽 길에서 다리를 건너요.",
  "npc.joon.pool2.line2": "Cross the creek bridge on the north trail and keep going straight.",
  "npc.sora.pool2.line1": "오늘은 하늘이 파란색이에요!",
  "npc.sora.pool2.line2": "Photographers love a blue-sky day like this.",
  "npc.mrHan.pool2.line1": "바다가 잔잔해요. 물이 차가워요.",
  "npc.mrHan.pool2.line2": "Calm sea today, but the water stays cold.",
  "npc.marketClerk.pool2.line1": "사과하고 물 있어요.",
  "npc.marketClerk.pool2.line2": "Apples and water in stock - just say 주세요 when you are ready.",
  "npc.teaOwner.pool2.line1": "차 한 잔 어때요?",
  "npc.teaOwner.pool2.line2": "One warm cup, and the road feels shorter.",
  "npc.trailKeeper.pool2.line1": "비가 오면 다리가 미끄러워요.",
  "npc.trailKeeper.pool2.line2": "When rain comes, those footboards get slippery.",
  "npc.town2GateGreeter.pool2.line1": "광장은 북쪽에 있어요.",
  "npc.town2GateGreeter.pool2.line2": "The plaza is just north - start at the review board.",
  "npc.town2LabelRunner.pool2.line1": "저건 박물관이에요!",
  "npc.town2LabelRunner.pool2.line2": "That far building is the Label Museum - 저건 points far away.",
  "npc.town2Resident.pool2.line1": "시청은 큰 갈색 지붕이에요.",
  "npc.town2Resident.pool2.line2": "City Hall is the big brown roof up north.",
  "npc.town2ReviewClerk.pool2.line1": "연습은 언제나 무료예요.",
  "npc.town2ReviewClerk.pool2.line2": "Practice is always free - exams are the spicy part.",
  "npc.town2ActionCoach.pool2.line1": "읽어요, 마셔요, 먹어요, 써요!",
  "npc.town2ActionCoach.pool2.line2": "Watch the actors first, then try the board.",
  "drill.trail2MirrorVowels.title": "Mirror Shrine: Compound Vowels",
  "drill.town3SinoNumbers.title": "Abacus: Sino-Korean Numbers",
  "drill.town3NativeNumbers.title": "Abacus: Native Korean Numbers",
  "drill.town3SinoExam.title": "Board Check: Sino Numbers",
  "drill.town3NativeExam.title": "Board Check: Native Numbers",
  "drill.town3MarketReview.title": "Market Review Board",
  "study.compoundVowels.title": "Compound Vowels",
  "study.compoundVowels.subtitle": "Two vowel shapes combine into one sound.",
  "study.sinoNumbers.title": "Sino-Korean Numbers",
  "study.sinoNumbers.subtitle": "Used for money, minutes, dates, and phone numbers.",
  "study.nativeNumbers.title": "Native Korean Numbers",
  "study.nativeNumbers.subtitle": "Used for counting things, people, and hours.",
  "study.counters.title": "Counters",
  "study.counters.subtitle": "Korean counts with native number + counter word.",
  "study.counters.entry.gae": "things (사과 두 개)",
  "study.counters.entry.myeong": "people (학생 세 명)",
  "study.counters.entry.mari": "animals (고양이 한 마리)",
  "study.counters.entry.byeong": "bottles (물 두 병)",
  "study.counters.entry.jan": "cups (차 한 잔)",
  "study.counters.entry.gwon": "books (책 네 권)",
  "study.counters.entry.sal": "years of age (다섯 살)",
  "quest.town2.arrival": "Arrive in Name City",
  "quest.town2.arrival.greet": "Talk to the gate greeter.",
  "quest.town2.identity": "Identity Office",
  "quest.town2.identity.pass": "Pass the registration task.",
  "quest.town2.lostFound": "Lost and Found",
  "quest.town2.lostFound.pass": "Pass the presence check.",
  "quest.town2.labels": "Label Museum",
  "quest.town2.labels.pass": "Pass the distance labels task.",
  "quest.town2.actions": "Action Park",
  "quest.town2.actions.pass": "Pass the action task.",
  "quest.town2.readingReview": "Reading Review",
  "quest.town2.readingReview.pass": "Pass the reading review.",
  "quest.town2.firstWordsBadge": "First Words Badge",
  "quest.town2.firstWordsBadge.podium": "Pass the badge exam at the City Hall podium.",
  "quest.trail2.mirrorVowels": "Mirror Shrine",
  "quest.trail2.mirrorVowels.theory": "Read the mirror shrine board.",
  "quest.trail2.mirrorVowels.practice": "Pass the mirror vowel practice.",
  "quest.trail2.location": "Where Is It?",
  "quest.trail2.location.pass": "Pass the location post drill.",
  "quest.trail2.also": "Me Too!",
  "quest.trail2.also.pass": "Pass the echo twins drill.",
  "quest.trail2.lostKey": "The Lost Key",
  "quest.trail2.lostKey.start": "Talk to the shrine keeper.",
  "quest.trail2.lostKey.find": "Search under the rocks for the key.",
  "quest.trail2.lostKey.return": "Return the key to the shrine keeper.",
  "quest.town3.sino": "Sino Numbers",
  "quest.town3.sino.theory": "Read the sino number board.",
  "quest.town3.sino.practice": "Pass abacus sino practice.",
  "quest.town3.sino.exam": "Pass the sino board check.",
  "quest.town3.native": "Native Numbers",
  "quest.town3.native.theory": "Read the native number board.",
  "quest.town3.native.practice": "Pass abacus native practice.",
  "quest.town3.native.exam": "Pass the native board check.",
  "quest.town3.counters": "Counters",
  "quest.town3.counters.theory": "Read the counter board.",
  "quest.town3.counters.practice": "Pass the counter stall drill.",
  "quest.town3.prices": "Market Prices",
  "quest.town3.prices.theory": "Read the plaza price board.",
  "quest.town3.prices.practice": "Pass the price reading drill.",
  "quest.town3.shoppingList": "Grandma's Shopping List",
  "quest.town3.shoppingList.help": "Help the grandma read her list.",
  "quest.town3.cafe": "Cafe Order",
  "quest.town3.cafe.order": "Order at the snack cafe counter.",
  "quest.town3.numberBadge": "Number Badge",
  "quest.town3.numberBadge.podium": "Pass the guild badge exam.",
  "npc.town2RoadGuard.noBadge1": "The north trail is open only to badge holders.",
  "npc.town2RoadGuard.noBadge2": "Pass the City Hall exam first. 시청에 가요!",
  "npc.town2RoadGuard.badge1": "That is the First Words Badge! The road is open.",
  "npc.town2RoadGuard.badge2": "Follow the mirror path north. 조심하세요!",
  "npc.town2CityLeader.intro1": "Our five station rooms test everything Chapter 1 taught.",
  "npc.town2CityLeader.intro2": "Pass all five stations, then face the badge podium.",
  "npc.town2CityLeader.ready1": "All stations passed! The podium in the center awaits you.",
  "npc.town2CityLeader.done1": "You carry the First Words Badge. The north road is yours.",
  "object.town2BadgePodium.locked.line1": "The podium is sealed. Five station lights are not all lit yet.",
  "route.trail2.locked": "A gate blocks the trail. Only First Words Badge holders may pass.",
  "route.trail3.pending": "The road north is still buried under market crates. Come back later.",
});

Object.assign(TEXT.ko, {
  "menu.journal": "퀘스트 일지",
  "menu.words": "단어 사전",
  "dictionary.hangul.category.compoundVowels": "복합 모음",
  "journal.title": "퀘스트 일지",
  "journal.badges": "배지",
  "journal.noBadges": "아직 배지가 없어요",
  "journal.complete": "완료",
  "journal.hint": "다음",
  "journal.chapter.town1": "1장 하늘 마을",
  "journal.chapter.town2": "2장 이름시",
  "journal.chapter.town3": "3장 숫자 시장",
  "badge.firstWords": "첫말 배지",
  "badge.numbers": "숫자 배지",
  "panel.badges": "배지",
  "panel.words": "단어",
  "dictionary.words.title": "단어 사전",
  "dictionary.words.summary": "본 단어 {seen} - 마스터 {mastered}/{total}",
  "dictionary.words.panelSummary": "{seen} 봄 - {mastered} 완료",
  "dictionary.words.empty": "아직 여기에는 단어가 없어요. 계속 탐험하세요!",
  "dictionary.words.category.position": "위치",
  "dictionary.words.category.nature": "자연과 길",
  "dictionary.words.category.numbersSino": "한자어 숫자",
  "dictionary.words.category.numbersNative": "고유어 숫자",
  "dictionary.words.category.counters": "단위 명사",
  "dictionary.words.category.shopping": "쇼핑과 돈",
  "dictionary.words.category.food": "음식과 시장",
  "dictionary.words.category.colors": "색깔",
  "dictionary.words.category.people": "사람",
  "dictionary.words.category.cafe": "카페와 음료",
  "settings.erase": "저장 지우기",
  "settings.eraseArmed": "지우려면 다시 누르세요!",
  "drill.word.prompt.meaning": "{hangul}은/는 무슨 뜻인가요?",
  "drill.word.prompt.hangul": "\"{meaning}\"을/를 뜻하는 단어는 무엇인가요?",
  "drill.word.feedback.correct": "{hangul} = {meaning}.",
  "drill.word.feedback.incorrect": "{hangul}은/는 {meaning}라는 뜻이에요.",
  "drill.hangul.prompt.compoundCombine": "{left} + {right}에서 나오는 모음은 무엇인가요?",
  "drill.hangul.prompt.soundToVowel": "\"{answer}\" 소리를 내는 모음은 무엇인가요?",
  "drill.hangul.prompt.nameToConsonant": "이름이 {answer}인 자음은 무엇인가요?",
  "drill.hangul.prompt.readingToSyllable": "\"{answer}\"로 읽는 글자는 무엇인가요?",
  "drill.word.prompt.priceToReading": "가격표를 읽으세요: {value}원",
  "drill.word.prompt.readingToPrice": "{reading} 원 - 얼마인가요?",
  "drill.word.prompt.countPhrase": "{phrase} - 몇 개인가요?",
  "npc.guide.next": "다음 목표: {objective} ({where})",
  "npc.guide.allDone": "이 장의 모든 과제를 끝냈어요. 다음 길이 열려 있어요!",
  "panel.where": "장소",
  "npc.mina.pool2.line1": "학교는 북서쪽에 있어요.",
  "npc.mina.pool2.line2": "읽기는 학교에서 시작해요.",
  "npc.joon.pool2.line1": "북쪽 길에서 다리를 건너요.",
  "npc.joon.pool2.line2": "개울 다리를 건너서 곧장 가세요.",
  "npc.sora.pool2.line1": "오늘은 하늘이 파란색이에요!",
  "npc.sora.pool2.line2": "사진가는 이런 파란 하늘을 좋아해요.",
  "npc.mrHan.pool2.line1": "바다가 잔잔해요. 물이 차가워요.",
  "npc.mrHan.pool2.line2": "오늘 바다는 잔잔하지만 물은 차가워요.",
  "npc.marketClerk.pool2.line1": "사과하고 물 있어요.",
  "npc.marketClerk.pool2.line2": "준비되면 주세요라고 말해 주세요.",
  "npc.teaOwner.pool2.line1": "차 한 잔 어때요?",
  "npc.teaOwner.pool2.line2": "따뜻한 차 한 잔이면 길이 짧게 느껴져요.",
  "npc.trailKeeper.pool2.line1": "비가 오면 다리가 미끄러워요.",
  "npc.trailKeeper.pool2.line2": "비가 오면 발판이 미끄러우니 조심하세요.",
  "npc.town2GateGreeter.pool2.line1": "광장은 북쪽에 있어요.",
  "npc.town2GateGreeter.pool2.line2": "광장은 바로 북쪽이에요. 복습 게시판부터 보세요.",
  "npc.town2LabelRunner.pool2.line1": "저건 박물관이에요!",
  "npc.town2LabelRunner.pool2.line2": "저 멀리 건물이 라벨 박물관이에요. 저건은 먼 것을 가리켜요.",
  "npc.town2Resident.pool2.line1": "시청은 큰 갈색 지붕이에요.",
  "npc.town2Resident.pool2.line2": "북쪽의 큰 갈색 지붕이 시청이에요.",
  "npc.town2ReviewClerk.pool2.line1": "연습은 언제나 무료예요.",
  "npc.town2ReviewClerk.pool2.line2": "연습은 공짜지만 시험은 매워요.",
  "npc.town2ActionCoach.pool2.line1": "읽어요, 마셔요, 먹어요, 써요!",
  "npc.town2ActionCoach.pool2.line2": "먼저 배우들을 보고 게시판에 도전하세요.",
  "drill.trail2MirrorVowels.title": "거울 사당: 복합 모음",
  "drill.town3SinoNumbers.title": "주판: 한자어 숫자",
  "drill.town3NativeNumbers.title": "주판: 고유어 숫자",
  "drill.town3SinoExam.title": "칠판 시험: 한자어 숫자",
  "drill.town3NativeExam.title": "칠판 시험: 고유어 숫자",
  "drill.town3MarketReview.title": "시장 복습 게시판",
  "study.compoundVowels.title": "복합 모음",
  "study.compoundVowels.subtitle": "두 모음이 합쳐져 하나의 소리가 됩니다.",
  "study.sinoNumbers.title": "한자어 숫자",
  "study.sinoNumbers.subtitle": "돈, 분, 날짜, 전화번호에 씁니다.",
  "study.nativeNumbers.title": "고유어 숫자",
  "study.nativeNumbers.subtitle": "물건, 사람, 시간을 셀 때 씁니다.",
  "study.counters.title": "단위 명사",
  "study.counters.subtitle": "고유어 숫자 + 단위 명사로 셉니다.",
  "study.counters.entry.gae": "물건 (사과 두 개)",
  "study.counters.entry.myeong": "사람 (학생 세 명)",
  "study.counters.entry.mari": "동물 (고양이 한 마리)",
  "study.counters.entry.byeong": "병 (물 두 병)",
  "study.counters.entry.jan": "잔 (차 한 잔)",
  "study.counters.entry.gwon": "책 (책 네 권)",
  "study.counters.entry.sal": "나이 (다섯 살)",
  "quest.town2.arrival": "이름시 도착",
  "quest.town2.arrival.greet": "문지기와 이야기하세요.",
  "quest.town2.identity": "정보 센터",
  "quest.town2.identity.pass": "등록 과제를 통과하세요.",
  "quest.town2.lostFound": "분실물 센터",
  "quest.town2.lostFound.pass": "있어요/없어요 과제를 통과하세요.",
  "quest.town2.labels": "라벨 박물관",
  "quest.town2.labels.pass": "이건/그건/저건 과제를 통과하세요.",
  "quest.town2.actions": "동작 공원",
  "quest.town2.actions.pass": "동작 과제를 통과하세요.",
  "quest.town2.readingReview": "읽기 복습",
  "quest.town2.readingReview.pass": "읽기 복습을 통과하세요.",
  "quest.town2.firstWordsBadge": "첫말 배지",
  "quest.town2.firstWordsBadge.podium": "시청 단상에서 배지 시험을 통과하세요.",
  "quest.trail2.mirrorVowels": "거울 사당",
  "quest.trail2.mirrorVowels.theory": "거울 사당 게시판을 읽으세요.",
  "quest.trail2.mirrorVowels.practice": "거울 모음 연습을 통과하세요.",
  "quest.trail2.location": "어디에 있어요?",
  "quest.trail2.location.pass": "위치 표지판 연습을 통과하세요.",
  "quest.trail2.also": "저도요!",
  "quest.trail2.also.pass": "메아리 쌍둥이 연습을 통과하세요.",
  "quest.trail2.lostKey": "잃어버린 열쇠",
  "quest.trail2.lostKey.start": "사당지기와 이야기하세요.",
  "quest.trail2.lostKey.find": "바위 아래에서 열쇠를 찾으세요.",
  "quest.trail2.lostKey.return": "열쇠를 사당지기에게 돌려주세요.",
  "quest.town3.sino": "한자어 숫자",
  "quest.town3.sino.theory": "한자어 숫자 게시판을 읽으세요.",
  "quest.town3.sino.practice": "주판 한자어 연습을 통과하세요.",
  "quest.town3.sino.exam": "한자어 칠판 시험을 통과하세요.",
  "quest.town3.native": "고유어 숫자",
  "quest.town3.native.theory": "고유어 숫자 게시판을 읽으세요.",
  "quest.town3.native.practice": "주판 고유어 연습을 통과하세요.",
  "quest.town3.native.exam": "고유어 칠판 시험을 통과하세요.",
  "quest.town3.counters": "단위 명사",
  "quest.town3.counters.theory": "단위 명사 게시판을 읽으세요.",
  "quest.town3.counters.practice": "단위 가게 연습을 통과하세요.",
  "quest.town3.prices": "시장 가격",
  "quest.town3.prices.theory": "광장 가격 게시판을 읽으세요.",
  "quest.town3.prices.practice": "가격 읽기 연습을 통과하세요.",
  "quest.town3.shoppingList": "할머니의 장보기",
  "quest.town3.shoppingList.help": "할머니가 목록을 읽도록 도와주세요.",
  "quest.town3.cafe": "카페 주문",
  "quest.town3.cafe.order": "간식 카페 카운터에서 주문하세요.",
  "quest.town3.numberBadge": "숫자 배지",
  "quest.town3.numberBadge.podium": "조합 배지 시험을 통과하세요.",
  "npc.town2RoadGuard.noBadge1": "북쪽 길은 배지가 있는 사람만 갈 수 있어요.",
  "npc.town2RoadGuard.noBadge2": "먼저 시청 시험을 통과하세요. 시청에 가요!",
  "npc.town2RoadGuard.badge1": "첫말 배지네요! 길이 열려 있어요.",
  "npc.town2RoadGuard.badge2": "거울 길을 따라 북쪽으로 가세요. 조심하세요!",
  "npc.town2CityLeader.intro1": "다섯 개의 시험실이 1장의 모든 내용을 확인해요.",
  "npc.town2CityLeader.intro2": "다섯 시험을 모두 통과한 뒤 단상에 도전하세요.",
  "npc.town2CityLeader.ready1": "모든 시험을 통과했어요! 가운데 단상이 기다려요.",
  "npc.town2CityLeader.done1": "첫말 배지를 가지고 있군요. 북쪽 길은 당신의 것이에요.",
  "object.town2BadgePodium.locked.line1": "단상이 잠겨 있어요. 다섯 개의 불이 아직 다 켜지지 않았어요.",
  "route.trail2.locked": "문이 길을 막고 있어요. 첫말 배지가 있어야 지나갈 수 있어요.",
  "route.trail3.pending": "북쪽 길은 아직 시장 상자에 묻혀 있어요. 나중에 다시 오세요.",
});

Object.assign(TEXT.nl, {
  "menu.journal": "Questdagboek",
  "menu.words": "Woordenboek",
  "dictionary.hangul.category.compoundVowels": "Samengestelde klinkers",
  "journal.title": "Questdagboek",
  "journal.badges": "Badges",
  "journal.noBadges": "Nog geen badges",
  "journal.complete": "Voltooid",
  "journal.hint": "Volgende",
  "journal.chapter.town1": "H.1 Haneulstad",
  "journal.chapter.town2": "H.2 Naamstad",
  "journal.chapter.town3": "H.3 Cijfermarkt",
  "badge.firstWords": "Eerste-Woorden-Badge",
  "badge.numbers": "Cijferbadge",
  "panel.badges": "Badges",
  "panel.words": "Woorden",
  "dictionary.words.title": "Woordenboek",
  "dictionary.words.summary": "Gezien {seen} - Beheerst {mastered}/{total}",
  "dictionary.words.panelSummary": "{seen} gezien - {mastered} klaar",
  "dictionary.words.empty": "Hier zijn nog geen woorden. Blijf verkennen!",
  "dictionary.words.category.position": "Positie & plaats",
  "dictionary.words.category.nature": "Natuur & pad",
  "dictionary.words.category.numbersSino": "Sino-getallen",
  "dictionary.words.category.numbersNative": "Inheemse getallen",
  "dictionary.words.category.counters": "Telwoorden",
  "dictionary.words.category.shopping": "Winkelen & geld",
  "dictionary.words.category.food": "Eten & markt",
  "dictionary.words.category.colors": "Kleuren",
  "dictionary.words.category.people": "Mensen",
  "dictionary.words.category.cafe": "Café & drankjes",
  "settings.erase": "Opslag wissen",
  "settings.eraseArmed": "Druk nogmaals om te wissen!",
  "drill.word.prompt.meaning": "Wat betekent {hangul}?",
  "drill.word.prompt.hangul": "Welk woord betekent \"{meaning}\"?",
  "drill.word.feedback.correct": "{hangul} = {meaning}.",
  "drill.word.feedback.incorrect": "Onthoud: {hangul} betekent {meaning}.",
  "drill.hangul.prompt.compoundCombine": "Welke klinker komt uit {left} + {right}?",
  "drill.hangul.prompt.soundToVowel": "Welke klinker maakt de klank \"{answer}\"?",
  "drill.hangul.prompt.nameToConsonant": "Welke medeklinker heet {answer}?",
  "drill.hangul.prompt.readingToSyllable": "Welk blok lees je als \"{answer}\"?",
  "drill.word.prompt.priceToReading": "Lees het prijskaartje: {value}원",
  "drill.word.prompt.readingToPrice": "{reading} 원 - hoeveel is dat?",
  "drill.word.prompt.countPhrase": "{phrase} - hoeveel?",
  "npc.guide.next": "Volgend doel: {objective} ({where})",
  "npc.guide.allDone": "Alle taken van dit hoofdstuk zijn klaar. De weg verder is open!",
  "panel.where": "Waar",
  "npc.mina.pool2.line1": "학교는 북서쪽에 있어요.",
  "npc.mina.pool2.line2": "De school ligt in het noordwesten - daar begint het lezen.",
  "npc.joon.pool2.line1": "북쪽 길에서 다리를 건너요.",
  "npc.joon.pool2.line2": "Steek de beekbrug op het noordpad over en ga rechtdoor.",
  "npc.sora.pool2.line1": "오늘은 하늘이 파란색이에요!",
  "npc.sora.pool2.line2": "Fotografen houden van zo'n blauwe lucht.",
  "npc.mrHan.pool2.line1": "바다가 잔잔해요. 물이 차가워요.",
  "npc.mrHan.pool2.line2": "Kalme zee vandaag, maar het water blijft koud.",
  "npc.marketClerk.pool2.line1": "사과하고 물 있어요.",
  "npc.marketClerk.pool2.line2": "Appels en water op voorraad - zeg maar 주세요 als je klaar bent.",
  "npc.teaOwner.pool2.line1": "차 한 잔 어때요?",
  "npc.teaOwner.pool2.line2": "Eén warm kopje en de weg voelt korter.",
  "npc.trailKeeper.pool2.line1": "비가 오면 다리가 미끄러워요.",
  "npc.trailKeeper.pool2.line2": "Als het regent worden die planken glad.",
  "npc.town2GateGreeter.pool2.line1": "광장은 북쪽에 있어요.",
  "npc.town2GateGreeter.pool2.line2": "Het plein is vlak naar het noorden - begin bij het herhalingsbord.",
  "npc.town2LabelRunner.pool2.line1": "저건 박물관이에요!",
  "npc.town2LabelRunner.pool2.line2": "Dat verre gebouw is het Labelmuseum - 저건 wijst ver weg.",
  "npc.town2Resident.pool2.line1": "시청은 큰 갈색 지붕이에요.",
  "npc.town2Resident.pool2.line2": "Het stadhuis is het grote bruine dak in het noorden.",
  "npc.town2ReviewClerk.pool2.line1": "연습은 언제나 무료예요.",
  "npc.town2ReviewClerk.pool2.line2": "Oefenen is altijd gratis - examens zijn het pittige deel.",
  "npc.town2ActionCoach.pool2.line1": "읽어요, 마셔요, 먹어요, 써요!",
  "npc.town2ActionCoach.pool2.line2": "Kijk eerst naar de acteurs en probeer dan het bord.",
  "drill.trail2MirrorVowels.title": "Spiegelschrijn: samengestelde klinkers",
  "drill.town3SinoNumbers.title": "Telraam: Sino-Koreaanse getallen",
  "drill.town3NativeNumbers.title": "Telraam: inheemse getallen",
  "drill.town3SinoExam.title": "Bordtoets: Sino-getallen",
  "drill.town3NativeExam.title": "Bordtoets: inheemse getallen",
  "drill.town3MarketReview.title": "Marktherhalingsbord",
  "study.compoundVowels.title": "Samengestelde klinkers",
  "study.compoundVowels.subtitle": "Twee klinkervormen worden één klank.",
  "study.sinoNumbers.title": "Sino-Koreaanse getallen",
  "study.sinoNumbers.subtitle": "Voor geld, minuten, datums en telefoonnummers.",
  "study.nativeNumbers.title": "Inheemse getallen",
  "study.nativeNumbers.subtitle": "Voor het tellen van dingen, mensen en uren.",
  "study.counters.title": "Telwoorden",
  "study.counters.subtitle": "Koreaans telt met inheems getal + telwoord.",
  "study.counters.entry.gae": "dingen (사과 두 개)",
  "study.counters.entry.myeong": "mensen (학생 세 명)",
  "study.counters.entry.mari": "dieren (고양이 한 마리)",
  "study.counters.entry.byeong": "flessen (물 두 병)",
  "study.counters.entry.jan": "kopjes (차 한 잔)",
  "study.counters.entry.gwon": "boeken (책 네 권)",
  "study.counters.entry.sal": "leeftijd (다섯 살)",
  "quest.town2.arrival": "Aankomst in Naamstad",
  "quest.town2.arrival.greet": "Praat met de poortwachter.",
  "quest.town2.identity": "Informatiecentrum",
  "quest.town2.identity.pass": "Haal de registratietaak.",
  "quest.town2.lostFound": "Gevonden voorwerpen",
  "quest.town2.lostFound.pass": "Haal de aanwezigheidstaak.",
  "quest.town2.labels": "Labelmuseum",
  "quest.town2.labels.pass": "Haal de afstandslabels-taak.",
  "quest.town2.actions": "Actiepark",
  "quest.town2.actions.pass": "Haal de actietaak.",
  "quest.town2.readingReview": "Leesherhaling",
  "quest.town2.readingReview.pass": "Haal de leesherhaling.",
  "quest.town2.firstWordsBadge": "Eerste-Woorden-Badge",
  "quest.town2.firstWordsBadge.podium": "Haal het badge-examen bij het stadhuispodium.",
  "quest.trail2.mirrorVowels": "Spiegelschrijn",
  "quest.trail2.mirrorVowels.theory": "Lees het bord bij de spiegelschrijn.",
  "quest.trail2.mirrorVowels.practice": "Haal de spiegelklinker-oefening.",
  "quest.trail2.location": "Waar is het?",
  "quest.trail2.location.pass": "Haal de locatiepaal-oefening.",
  "quest.trail2.also": "Ik ook!",
  "quest.trail2.also.pass": "Haal de echo-tweeling-oefening.",
  "quest.trail2.lostKey": "De verloren sleutel",
  "quest.trail2.lostKey.start": "Praat met de schrijnwachter.",
  "quest.trail2.lostKey.find": "Zoek onder de rotsen naar de sleutel.",
  "quest.trail2.lostKey.return": "Breng de sleutel terug naar de schrijnwachter.",
  "quest.town3.sino": "Sino-getallen",
  "quest.town3.sino.theory": "Lees het Sino-getallenbord.",
  "quest.town3.sino.practice": "Haal de telraam-Sino-oefening.",
  "quest.town3.sino.exam": "Haal de Sino-bordtoets.",
  "quest.town3.native": "Inheemse getallen",
  "quest.town3.native.theory": "Lees het inheemse-getallenbord.",
  "quest.town3.native.practice": "Haal de telraam-oefening.",
  "quest.town3.native.exam": "Haal de inheemse bordtoets.",
  "quest.town3.counters": "Telwoorden",
  "quest.town3.counters.theory": "Lees het telwoordenbord.",
  "quest.town3.counters.practice": "Haal de telwoord-oefening.",
  "quest.town3.prices": "Marktprijzen",
  "quest.town3.prices.theory": "Lees het prijzenbord op het plein.",
  "quest.town3.prices.practice": "Haal de prijslees-oefening.",
  "quest.town3.shoppingList": "Oma's boodschappenlijst",
  "quest.town3.shoppingList.help": "Help oma haar lijst te lezen.",
  "quest.town3.cafe": "Cafébestelling",
  "quest.town3.cafe.order": "Bestel bij de toonbank van het snackcafé.",
  "quest.town3.numberBadge": "Cijferbadge",
  "quest.town3.numberBadge.podium": "Haal het gilde-badge-examen.",
  "npc.town2RoadGuard.noBadge1": "Het noordpad is alleen open voor badgehouders.",
  "npc.town2RoadGuard.noBadge2": "Haal eerst het stadhuisexamen. 시청에 가요!",
  "npc.town2RoadGuard.badge1": "Dat is de Eerste-Woorden-Badge! De weg is open.",
  "npc.town2RoadGuard.badge2": "Volg het spiegelpad naar het noorden. 조심하세요!",
  "npc.town2CityLeader.intro1": "Onze vijf examenkamers toetsen alles uit hoofdstuk 1.",
  "npc.town2CityLeader.intro2": "Haal alle vijf stations en ga dan naar het podium.",
  "npc.town2CityLeader.ready1": "Alle stations gehaald! Het podium in het midden wacht.",
  "npc.town2CityLeader.done1": "Je draagt de Eerste-Woorden-Badge. De noordweg is van jou.",
  "object.town2BadgePodium.locked.line1": "Het podium is verzegeld. Nog niet alle vijf lampen branden.",
  "route.trail2.locked": "Een poort verspert het pad. Alleen badgehouders mogen door.",
  "route.trail3.pending": "De weg naar het noorden ligt nog vol marktkratten. Kom later terug.",
});

const settings = {
  primary: "en",
  secondary: "ko",
  speech: "ko",
};

const ui = {
  translationHeld: false,
  menuOpen: false,
  menuScreen: "main",
  menuIndex: 0,
  dictionaryCategoryIndex: 0,
  dictionaryPage: 0,
  wordCategoryIndex: 0,
  wordPage: 0,
  journalChapterIndex: 0,
  journalQuestIndex: 0,
  eraseArmed: false,
  quit: false,
};

const mainMenuItems = [
  { key: "menu.return", action: "return" },
  { key: "menu.journal", action: "journal" },
  { key: "menu.dictionary", action: "dictionary" },
  { key: "menu.words", action: "words" },
  { key: "menu.settings", action: "settings" },
  { key: "menu.quit", action: "quit" },
];

const settingsRows = ["primary", "secondary", "speech", "erase", "back"];

const DRILLS = {
  alphabetBlocks: {
    titleKey: "drill.alphabetBlocks.title",
    steps: [
      {
        promptKey: "drill.alphabetBlocks.1.prompt",
        choices: [
          "drill.alphabetBlocks.1.choice.a",
          "drill.alphabetBlocks.1.choice.b",
          "drill.alphabetBlocks.1.choice.c",
        ],
        answer: 0,
        correctKey: "drill.alphabetBlocks.1.correct",
        incorrectKey: "drill.alphabetBlocks.1.incorrect",
      },
      {
        promptKey: "drill.alphabetBlocks.2.prompt",
        choices: [
          "drill.alphabetBlocks.2.choice.a",
          "drill.alphabetBlocks.2.choice.b",
          "drill.alphabetBlocks.2.choice.c",
        ],
        answer: 1,
        correctKey: "drill.alphabetBlocks.2.correct",
        incorrectKey: "drill.alphabetBlocks.2.incorrect",
      },
      {
        promptKey: "drill.alphabetBlocks.3.prompt",
        choices: [
          "drill.alphabetBlocks.3.choice.a",
          "drill.alphabetBlocks.3.choice.b",
          "drill.alphabetBlocks.3.choice.c",
        ],
        answer: 0,
        correctKey: "drill.alphabetBlocks.3.correct",
        incorrectKey: "drill.alphabetBlocks.3.incorrect",
      },
    ],
  },
  soundFountain: {
    titleKey: "drill.soundFountain.title",
    steps: [
      {
        promptKey: "drill.soundFountain.1.prompt",
        choices: [
          "drill.soundFountain.1.choice.a",
          "drill.soundFountain.1.choice.b",
          "drill.soundFountain.1.choice.c",
          "drill.soundFountain.1.choice.d",
        ],
        answer: 0,
        correctKey: "drill.soundFountain.1.correct",
        incorrectKey: "drill.soundFountain.1.incorrect",
      },
      {
        promptKey: "drill.soundFountain.2.prompt",
        choices: [
          "drill.soundFountain.2.choice.a",
          "drill.soundFountain.2.choice.b",
          "drill.soundFountain.2.choice.c",
          "drill.soundFountain.2.choice.d",
        ],
        answer: 2,
        correctKey: "drill.soundFountain.2.correct",
        incorrectKey: "drill.soundFountain.2.incorrect",
      },
      {
        promptKey: "drill.soundFountain.3.prompt",
        choices: [
          "drill.soundFountain.3.choice.a",
          "drill.soundFountain.3.choice.b",
          "drill.soundFountain.3.choice.c",
          "drill.soundFountain.3.choice.d",
        ],
        answer: 3,
        correctKey: "drill.soundFountain.3.correct",
        incorrectKey: "drill.soundFountain.3.incorrect",
      },
    ],
  },
  town1FountainVowels: {
    titleKey: "drill.town1FountainVowels.title",
    completionFlags: ["town1.vowelPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainVowels.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.i",
        ],
        answer: 0,
        correctKey: "drill.town1FountainVowels.1.correct",
        incorrectKey: "drill.town1FountainVowels.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.2.prompt",
        choices: [
          "drill.town1.choice.o",
          "drill.town1.choice.eo",
          "drill.town1.choice.u",
          "drill.town1.choice.eu",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.2.correct",
        incorrectKey: "drill.town1FountainVowels.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.3.prompt",
        choices: [
          "drill.town1.choice.yo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
          "drill.town1.choice.eo",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.3.correct",
        incorrectKey: "drill.town1FountainVowels.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.4.prompt",
        choices: [
          "drill.town1.choice.eu",
          "drill.town1.choice.u",
          "drill.town1.choice.a",
          "drill.town1.choice.o",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.4.correct",
        incorrectKey: "drill.town1FountainVowels.4.incorrect",
      },
    ],
  },
  town1FountainConsonants: {
    titleKey: "drill.town1FountainConsonants.title",
    completionFlags: ["town1.consonantPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainConsonants.1.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 0,
        correctKey: "drill.town1FountainConsonants.1.correct",
        incorrectKey: "drill.town1FountainConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.2.prompt",
        choices: [
          "drill.town1.choice.digeut",
          "drill.town1.choice.nieun",
          "drill.town1.choice.rieul",
          "drill.town1.choice.giyeok",
        ],
        answer: 1,
        correctKey: "drill.town1FountainConsonants.2.correct",
        incorrectKey: "drill.town1FountainConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.3.prompt",
        choices: [
          "drill.town1.choice.siot",
          "drill.town1.choice.digeut",
          "drill.town1.choice.bieup",
          "drill.town1.choice.rieul",
        ],
        answer: 1,
        correctKey: "drill.town1FountainConsonants.3.correct",
        incorrectKey: "drill.town1FountainConsonants.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.4.prompt",
        choices: [
          "drill.town1.choice.mieum",
          "drill.town1.choice.bieup",
          "drill.town1.choice.nieun",
          "drill.town1.choice.siot",
        ],
        answer: 0,
        correctKey: "drill.town1FountainConsonants.4.correct",
        incorrectKey: "drill.town1FountainConsonants.4.incorrect",
      },
    ],
  },
  town1FountainReview: {
    titleKey: "drill.town1FountainReview.title",
    steps: [
      {
        promptKey: "drill.town1FountainReview.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
          "drill.town1.choice.eo",
        ],
        answer: 1,
        correctKey: "drill.town1FountainReview.1.correct",
        incorrectKey: "drill.town1FountainReview.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.2.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 1,
        correctKey: "drill.town1FountainReview.2.correct",
        incorrectKey: "drill.town1FountainReview.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.3.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.na",
          "drill.town1.choice.da",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1FountainReview.3.correct",
        incorrectKey: "drill.town1FountainReview.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.4.prompt",
        choices: [
          "drill.town1.choice.mu",
          "drill.town1.choice.no",
          "drill.town1.choice.gu",
          "drill.town1.choice.du",
        ],
        answer: 0,
        correctKey: "drill.town1FountainReview.4.correct",
        incorrectKey: "drill.town1FountainReview.4.incorrect",
      },
    ],
  },
  town1DeskSyllables: {
    titleKey: "drill.town1DeskSyllables.title",
    completionFlags: ["town1.firstSyllablePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1DeskSyllables.1.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.na",
          "drill.town1.choice.da",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.1.correct",
        incorrectKey: "drill.town1DeskSyllables.1.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.2.prompt",
        choices: [
          "drill.town1.choice.geo",
          "drill.town1.choice.neo",
          "drill.town1.choice.no",
          "drill.town1.choice.mu",
        ],
        answer: 1,
        correctKey: "drill.town1DeskSyllables.2.correct",
        incorrectKey: "drill.town1DeskSyllables.2.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.3.prompt",
        choices: [
          "drill.town1.choice.do",
          "drill.town1.choice.du",
          "drill.town1.choice.da",
          "drill.town1.choice.to",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.3.correct",
        incorrectKey: "drill.town1DeskSyllables.3.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.4.prompt",
        choices: [
          "drill.town1.choice.mu",
          "drill.town1.choice.gu",
          "drill.town1.choice.no",
          "drill.town1.choice.du",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.4.correct",
        incorrectKey: "drill.town1DeskSyllables.4.incorrect",
      },
    ],
  },
  town1BlackboardVowels: {
    titleKey: "drill.town1BlackboardVowels.title",
    completionFlags: ["town1.vowelExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardVowels.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardVowels.1.correct",
        incorrectKey: "drill.town1BlackboardVowels.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardVowels.2.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardVowels.2.correct",
        incorrectKey: "drill.town1BlackboardVowels.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardVowels.3.prompt",
        choices: [
          "drill.town1.choice.o",
          "drill.town1.choice.eu",
          "drill.town1.choice.u",
          "drill.town1.choice.i",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardVowels.3.correct",
        incorrectKey: "drill.town1BlackboardVowels.3.incorrect",
      },
    ],
  },
  town1BlackboardConsonants: {
    titleKey: "drill.town1BlackboardConsonants.title",
    completionFlags: ["town1.consonantExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardConsonants.1.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardConsonants.1.correct",
        incorrectKey: "drill.town1BlackboardConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardConsonants.2.prompt",
        choices: [
          "drill.town1.choice.digeut",
          "drill.town1.choice.nieun",
          "drill.town1.choice.rieul",
          "drill.town1.choice.siot",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardConsonants.2.correct",
        incorrectKey: "drill.town1BlackboardConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardConsonants.3.prompt",
        choices: [
          "drill.town1.choice.bieup",
          "drill.town1.choice.mieum",
          "drill.town1.choice.siot",
          "drill.town1.choice.rieul",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardConsonants.3.correct",
        incorrectKey: "drill.town1BlackboardConsonants.3.incorrect",
      },
    ],
  },
  town1BlackboardSyllables: {
    titleKey: "drill.town1BlackboardSyllables.title",
    completionFlags: ["town1.firstSyllablesPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardSyllables.1.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.geo",
          "drill.town1.choice.no",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardSyllables.1.correct",
        incorrectKey: "drill.town1BlackboardSyllables.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardSyllables.2.prompt",
        choices: [
          "drill.town1.choice.na",
          "drill.town1.choice.neo",
          "drill.town1.choice.geo",
          "drill.town1.choice.no",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardSyllables.2.correct",
        incorrectKey: "drill.town1BlackboardSyllables.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardSyllables.3.prompt",
        choices: [
          "drill.town1.choice.do",
          "drill.town1.choice.du",
          "drill.town1.choice.to",
          "drill.town1.choice.da",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardSyllables.3.correct",
        incorrectKey: "drill.town1BlackboardSyllables.3.incorrect",
      },
    ],
  },
  town1FountainAspirated: {
    titleKey: "drill.town1FountainAspirated.title",
    completionFlags: ["town1.aspiratedPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainAspirated.1.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 0,
        correctKey: "drill.town1FountainAspirated.1.correct",
        incorrectKey: "drill.town1FountainAspirated.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.2.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1FountainAspirated.2.correct",
        incorrectKey: "drill.town1FountainAspirated.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.3.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainAspirated.3.correct",
        incorrectKey: "drill.town1FountainAspirated.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.4.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 3,
        correctKey: "drill.town1FountainAspirated.4.correct",
        incorrectKey: "drill.town1FountainAspirated.4.incorrect",
      },
    ],
  },
  town1BlackboardAspirated: {
    titleKey: "drill.town1BlackboardAspirated.title",
    completionFlags: ["town1.aspiratedExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardAspirated.1.prompt",
        choices: [
          "drill.town1.choice.k",
          "drill.town1.choice.g",
          "drill.town1.choice.h",
          "drill.town1.choice.t",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardAspirated.1.correct",
        incorrectKey: "drill.town1BlackboardAspirated.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardAspirated.2.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardAspirated.2.correct",
        incorrectKey: "drill.town1BlackboardAspirated.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardAspirated.3.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardAspirated.3.correct",
        incorrectKey: "drill.town1BlackboardAspirated.3.incorrect",
      },
    ],
  },
  town1FountainDoubleConsonants: {
    titleKey: "drill.town1FountainDoubleConsonants.title",
    completionFlags: ["town1.doubleConsonantPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainDoubleConsonants.1.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangSiotSign",
        ],
        answer: 0,
        correctKey: "drill.town1FountainDoubleConsonants.1.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.2.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1FountainDoubleConsonants.2.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.3.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangSiotSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainDoubleConsonants.3.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.4.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangSiotSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainDoubleConsonants.4.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.4.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.5.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 3,
        correctKey: "drill.town1FountainDoubleConsonants.5.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.5.incorrect",
      },
    ],
  },
  town1BlackboardDoubleConsonants: {
    titleKey: "drill.town1BlackboardDoubleConsonants.title",
    completionFlags: ["town1.doubleConsonantExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.1.prompt",
        choices: [
          "drill.town1.choice.kk",
          "drill.town1.choice.k",
          "drill.town1.choice.g",
          "drill.town1.choice.h",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardDoubleConsonants.1.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.2.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardDoubleConsonants.2.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.3.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangSiotSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardDoubleConsonants.3.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.3.incorrect",
      },
    ],
  },
  town1FountainBatchimSingle: {
    titleKey: "drill.town1FountainBatchimSingle.title",
    completionFlags: ["town1.batchimSinglePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainBatchimSingle.1.prompt",
        choices: [
          "drill.town1.choice.hasBatchim",
          "drill.town1.choice.noBatchim",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimSingle.1.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimSingle.2.prompt",
        choices: [
          "drill.town1.choice.finalN",
          "drill.town1.choice.finalK",
          "drill.town1.choice.finalP",
          "drill.town1.choice.noBatchim",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimSingle.2.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimSingle.3.prompt",
        choices: [
          "drill.town1.choice.gan",
          "drill.town1.choice.mun",
          "drill.town1.choice.naBlock",
          "drill.town1.choice.gap",
        ],
        answer: 2,
        correctKey: "drill.town1FountainBatchimSingle.3.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.3.incorrect",
      },
    ],
  },
  town1FountainBatchimDouble: {
    titleKey: "drill.town1FountainBatchimDouble.title",
    completionFlags: ["town1.batchimDoublePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainBatchimDouble.1.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimDouble.1.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimDouble.2.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 1,
        correctKey: "drill.town1FountainBatchimDouble.2.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimDouble.3.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 2,
        correctKey: "drill.town1FountainBatchimDouble.3.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.3.incorrect",
      },
    ],
  },
  batchimBridge: {
    titleKey: "drill.batchimBridge.title",
    steps: [
      {
        promptKey: "drill.batchimBridge.1.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 0,
        correctKey: "drill.batchimBridge.1.correct",
        incorrectKey: "drill.batchimBridge.1.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.2.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 1,
        correctKey: "drill.batchimBridge.2.correct",
        incorrectKey: "drill.batchimBridge.2.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.3.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 1,
        correctKey: "drill.batchimBridge.3.correct",
        incorrectKey: "drill.batchimBridge.3.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.4.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 0,
        correctKey: "drill.batchimBridge.4.correct",
        incorrectKey: "drill.batchimBridge.4.incorrect",
      },
    ],
  },
  sentenceBlocks: {
    titleKey: "drill.sentenceBlocks.title",
    steps: [
      {
        promptKey: "drill.sentenceBlocks.1.prompt",
        choices: [
          "drill.sentenceBlocks.1.choice.a",
          "drill.sentenceBlocks.1.choice.b",
          "drill.sentenceBlocks.1.choice.c",
        ],
        answer: 0,
        correctKey: "drill.sentenceBlocks.1.correct",
        incorrectKey: "drill.sentenceBlocks.1.incorrect",
      },
      {
        promptKey: "drill.sentenceBlocks.2.prompt",
        choices: [
          "drill.sentenceBlocks.2.choice.a",
          "drill.sentenceBlocks.2.choice.b",
          "drill.sentenceBlocks.2.choice.c",
        ],
        answer: 1,
        correctKey: "drill.sentenceBlocks.2.correct",
        incorrectKey: "drill.sentenceBlocks.2.incorrect",
      },
      {
        promptKey: "drill.sentenceBlocks.3.prompt",
        choices: [
          "drill.sentenceBlocks.3.choice.a",
          "drill.sentenceBlocks.3.choice.b",
          "drill.sentenceBlocks.3.choice.c",
        ],
        answer: 0,
        correctKey: "drill.sentenceBlocks.3.correct",
        incorrectKey: "drill.sentenceBlocks.3.incorrect",
      },
    ],
  },
  routeNames: {
    titleKey: "drill.routeNames.title",
    steps: [
      {
        promptKey: "drill.routeNames.1.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 1,
        correctKey: "drill.routeNames.1.correct",
        incorrectKey: "drill.routeNames.1.incorrect",
      },
      {
        promptKey: "drill.routeNames.2.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 0,
        correctKey: "drill.routeNames.2.correct",
        incorrectKey: "drill.routeNames.2.incorrect",
      },
      {
        promptKey: "drill.routeNames.3.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 2,
        correctKey: "drill.routeNames.3.correct",
        incorrectKey: "drill.routeNames.3.incorrect",
      },
    ],
  },
  objectLabels: {
    titleKey: "drill.objectLabels.title",
    steps: [
      {
        promptKey: "drill.objectLabels.1.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 0,
        correctKey: "drill.objectLabels.1.correct",
        incorrectKey: "drill.objectLabels.1.incorrect",
      },
      {
        promptKey: "drill.objectLabels.2.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 1,
        correctKey: "drill.objectLabels.2.correct",
        incorrectKey: "drill.objectLabels.2.incorrect",
      },
      {
        promptKey: "drill.objectLabels.3.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 2,
        correctKey: "drill.objectLabels.3.correct",
        incorrectKey: "drill.objectLabels.3.incorrect",
      },
    ],
  },
  actionPath: {
    titleKey: "drill.actionPath.title",
    steps: [
      {
        promptKey: "drill.actionPath.1.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 1,
        correctKey: "drill.actionPath.1.correct",
        incorrectKey: "drill.actionPath.1.incorrect",
      },
      {
        promptKey: "drill.actionPath.2.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 0,
        correctKey: "drill.actionPath.2.correct",
        incorrectKey: "drill.actionPath.2.incorrect",
      },
      {
        promptKey: "drill.actionPath.3.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 2,
        correctKey: "drill.actionPath.3.correct",
        incorrectKey: "drill.actionPath.3.incorrect",
      },
    ],
  },
};

const STUDY_BOARDS = {
  basicVowels: {
    titleKey: "study.basicVowels.title",
    subtitleKey: "study.basicVowels.subtitle",
    entries: [
      { glyph: "ㅏ", name: "a" },
      { glyph: "ㅑ", name: "ya" },
      { glyph: "ㅓ", name: "eo" },
      { glyph: "ㅕ", name: "yeo" },
      { glyph: "ㅗ", name: "o" },
      { glyph: "ㅛ", name: "yo" },
      { glyph: "ㅜ", name: "u" },
      { glyph: "ㅠ", name: "yu" },
      { glyph: "ㅡ", name: "eu" },
      { glyph: "ㅣ", name: "i" },
    ],
  },
  basicConsonants: {
    titleKey: "study.basicConsonants.title",
    subtitleKey: "study.basicConsonants.subtitle",
    entries: [
      { glyph: "ㄱ", name: "giyeok" },
      { glyph: "ㄴ", name: "nieun" },
      { glyph: "ㄷ", name: "digeut" },
      { glyph: "ㄹ", name: "rieul" },
      { glyph: "ㅁ", name: "mieum" },
      { glyph: "ㅂ", name: "bieup" },
      { glyph: "ㅅ", name: "siot" },
      { glyph: "ㅇ", name: "ieung" },
      { glyph: "ㅈ", name: "jieut" },
      { glyph: "ㅊ", name: "chieut" },
      { glyph: "ㅋ", name: "kieuk" },
      { glyph: "ㅌ", name: "tieut" },
      { glyph: "ㅍ", name: "pieup" },
      { glyph: "ㅎ", name: "hieut" },
    ],
  },
  aspiratedConsonants: {
    titleKey: "study.aspiratedConsonants.title",
    subtitleKey: "study.aspiratedConsonants.subtitle",
    entries: [
      { glyph: "ㅎ", nameKey: "study.aspiratedConsonants.entry.hieut" },
      { glyph: "ㅋ", nameKey: "study.aspiratedConsonants.entry.giyeok" },
      { glyph: "ㅌ", nameKey: "study.aspiratedConsonants.entry.digeut" },
      { glyph: "ㅍ", nameKey: "study.aspiratedConsonants.entry.bieup" },
      { glyph: "ㅊ", nameKey: "study.aspiratedConsonants.entry.jieut" },
    ],
  },
  doubleConsonants: {
    titleKey: "study.doubleConsonants.title",
    subtitleKey: "study.doubleConsonants.subtitle",
    entries: [
      { glyph: "ㄲ", nameKey: "study.doubleConsonants.entry.giyeok" },
      { glyph: "ㄸ", nameKey: "study.doubleConsonants.entry.digeut" },
      { glyph: "ㅃ", nameKey: "study.doubleConsonants.entry.bieup" },
      { glyph: "ㅆ", nameKey: "study.doubleConsonants.entry.siot" },
      { glyph: "ㅉ", nameKey: "study.doubleConsonants.entry.jieut" },
    ],
  },
  singleBatchim: {
    titleKey: "study.singleBatchim.title",
    subtitleKey: "study.singleBatchim.subtitle",
    entries: [
      { glyph: "간", nameKey: "study.singleBatchim.entry.gan" },
      { glyph: "문", nameKey: "study.singleBatchim.entry.mun" },
      { glyph: "나", nameKey: "study.singleBatchim.entry.na" },
    ],
  },
  doubleBatchim: {
    titleKey: "study.doubleBatchim.title",
    subtitleKey: "study.doubleBatchim.subtitle",
    entries: [
      { glyph: "앉", nameKey: "study.doubleBatchim.entry.anj" },
      { glyph: "닭", nameKey: "study.doubleBatchim.entry.dalk" },
      { glyph: "값", nameKey: "study.doubleBatchim.entry.gap" },
      { glyph: "?", nameKey: "study.doubleBatchim.entry.rule" },
    ],
  },
  compoundVowels: {
    titleKey: "study.compoundVowels.title",
    subtitleKey: "study.compoundVowels.subtitle",
    entries: [
      { glyph: "ㅐ", name: "ae (ㅏ+ㅣ)" },
      { glyph: "ㅔ", name: "e (ㅓ+ㅣ)" },
      { glyph: "ㅒ", name: "yae (ㅑ+ㅣ)" },
      { glyph: "ㅖ", name: "ye (ㅕ+ㅣ)" },
      { glyph: "ㅘ", name: "wa (ㅗ+ㅏ)" },
      { glyph: "ㅙ", name: "wae (ㅗ+ㅐ)" },
      { glyph: "ㅚ", name: "oe (ㅗ+ㅣ)" },
      { glyph: "ㅝ", name: "wo (ㅜ+ㅓ)" },
      { glyph: "ㅞ", name: "we (ㅜ+ㅔ)" },
      { glyph: "ㅟ", name: "wi (ㅜ+ㅣ)" },
      { glyph: "ㅢ", name: "ui (ㅡ+ㅣ)" },
    ],
  },
  sinoNumbers: {
    titleKey: "study.sinoNumbers.title",
    subtitleKey: "study.sinoNumbers.subtitle",
    entries: [
      { glyph: "일", name: "1 (il)" },
      { glyph: "이", name: "2 (i)" },
      { glyph: "삼", name: "3 (sam)" },
      { glyph: "사", name: "4 (sa)" },
      { glyph: "오", name: "5 (o)" },
      { glyph: "육", name: "6 (yuk)" },
      { glyph: "칠", name: "7 (chil)" },
      { glyph: "팔", name: "8 (pal)" },
      { glyph: "구", name: "9 (gu)" },
      { glyph: "십", name: "10 (sip)" },
      { glyph: "백", name: "100 (baek)" },
      { glyph: "천", name: "1,000 (cheon)" },
      { glyph: "만", name: "10,000 (man)" },
    ],
  },
  nativeNumbers: {
    titleKey: "study.nativeNumbers.title",
    subtitleKey: "study.nativeNumbers.subtitle",
    entries: [
      { glyph: "하나", name: "1 (hana / 한)" },
      { glyph: "둘", name: "2 (dul / 두)" },
      { glyph: "셋", name: "3 (set / 세)" },
      { glyph: "넷", name: "4 (net / 네)" },
      { glyph: "다섯", name: "5 (daseot)" },
      { glyph: "여섯", name: "6 (yeoseot)" },
      { glyph: "일곱", name: "7 (ilgop)" },
      { glyph: "여덟", name: "8 (yeodeol)" },
      { glyph: "아홉", name: "9 (ahop)" },
      { glyph: "열", name: "10 (yeol)" },
    ],
  },
  counters: {
    titleKey: "study.counters.title",
    subtitleKey: "study.counters.subtitle",
    entries: [
      { glyph: "개", nameKey: "study.counters.entry.gae" },
      { glyph: "명", nameKey: "study.counters.entry.myeong" },
      { glyph: "마리", nameKey: "study.counters.entry.mari" },
      { glyph: "병", nameKey: "study.counters.entry.byeong" },
      { glyph: "잔", nameKey: "study.counters.entry.jan" },
      { glyph: "권", nameKey: "study.counters.entry.gwon" },
      { glyph: "살", nameKey: "study.counters.entry.sal" },
    ],
  },
};

const HANGUL_MASTERY_CORRECT_TARGET = 3;
const HANGUL_MASTERY_STREAK_TARGET = 2;
const HANGUL_SYLLABLE_BASE_CODE = 0xac00;
const HANGUL_VOWEL_STRIDE = 28;
const HANGUL_INITIAL_STRIDE = 588;

const HANGUL_BASIC_VOWELS = [
  { id: "hangul.vowel.a", category: "basicVowels", glyph: "ㅏ", answer: "a", vowelIndex: 0 },
  { id: "hangul.vowel.ya", category: "basicVowels", glyph: "ㅑ", answer: "ya", vowelIndex: 2 },
  { id: "hangul.vowel.eo", category: "basicVowels", glyph: "ㅓ", answer: "eo", vowelIndex: 4 },
  { id: "hangul.vowel.yeo", category: "basicVowels", glyph: "ㅕ", answer: "yeo", vowelIndex: 6 },
  { id: "hangul.vowel.o", category: "basicVowels", glyph: "ㅗ", answer: "o", vowelIndex: 8 },
  { id: "hangul.vowel.yo", category: "basicVowels", glyph: "ㅛ", answer: "yo", vowelIndex: 12 },
  { id: "hangul.vowel.u", category: "basicVowels", glyph: "ㅜ", answer: "u", vowelIndex: 13 },
  { id: "hangul.vowel.yu", category: "basicVowels", glyph: "ㅠ", answer: "yu", vowelIndex: 17 },
  { id: "hangul.vowel.eu", category: "basicVowels", glyph: "ㅡ", answer: "eu", vowelIndex: 18 },
  { id: "hangul.vowel.i", category: "basicVowels", glyph: "ㅣ", answer: "i", vowelIndex: 20 },
];

const HANGUL_COMPOUND_VOWELS = [
  { id: "hangul.compoundVowel.ae", category: "compoundVowels", glyph: "ㅐ", answer: "ae", vowelIndex: 1, parts: ["ㅏ", "ㅣ"] },
  { id: "hangul.compoundVowel.yae", category: "compoundVowels", glyph: "ㅒ", answer: "yae", vowelIndex: 3, parts: ["ㅑ", "ㅣ"] },
  { id: "hangul.compoundVowel.e", category: "compoundVowels", glyph: "ㅔ", answer: "e", vowelIndex: 5, parts: ["ㅓ", "ㅣ"] },
  { id: "hangul.compoundVowel.ye", category: "compoundVowels", glyph: "ㅖ", answer: "ye", vowelIndex: 7, parts: ["ㅕ", "ㅣ"] },
  { id: "hangul.compoundVowel.wa", category: "compoundVowels", glyph: "ㅘ", answer: "wa", vowelIndex: 9, parts: ["ㅗ", "ㅏ"] },
  { id: "hangul.compoundVowel.wae", category: "compoundVowels", glyph: "ㅙ", answer: "wae", vowelIndex: 10, parts: ["ㅗ", "ㅐ"] },
  { id: "hangul.compoundVowel.oe", category: "compoundVowels", glyph: "ㅚ", answer: "oe", vowelIndex: 11, parts: ["ㅗ", "ㅣ"] },
  { id: "hangul.compoundVowel.wo", category: "compoundVowels", glyph: "ㅝ", answer: "wo", vowelIndex: 14, parts: ["ㅜ", "ㅓ"] },
  { id: "hangul.compoundVowel.we", category: "compoundVowels", glyph: "ㅞ", answer: "we", vowelIndex: 15, parts: ["ㅜ", "ㅔ"] },
  { id: "hangul.compoundVowel.wi", category: "compoundVowels", glyph: "ㅟ", answer: "wi", vowelIndex: 16, parts: ["ㅜ", "ㅣ"] },
  { id: "hangul.compoundVowel.ui", category: "compoundVowels", glyph: "ㅢ", answer: "ui", vowelIndex: 19, parts: ["ㅡ", "ㅣ"] },
];

const HANGUL_BASIC_CONSONANTS = [
  { id: "hangul.consonant.giyeok", category: "basicConsonants", glyph: "ㄱ", answer: "giyeok", sound: "g", initialIndex: 0 },
  { id: "hangul.consonant.nieun", category: "basicConsonants", glyph: "ㄴ", answer: "nieun", sound: "n", initialIndex: 2 },
  { id: "hangul.consonant.digeut", category: "basicConsonants", glyph: "ㄷ", answer: "digeut", sound: "d", initialIndex: 3 },
  { id: "hangul.consonant.rieul", category: "basicConsonants", glyph: "ㄹ", answer: "rieul", sound: "r", initialIndex: 5 },
  { id: "hangul.consonant.mieum", category: "basicConsonants", glyph: "ㅁ", answer: "mieum", sound: "m", initialIndex: 6 },
  { id: "hangul.consonant.bieup", category: "basicConsonants", glyph: "ㅂ", answer: "bieup", sound: "b", initialIndex: 7 },
  { id: "hangul.consonant.siot", category: "basicConsonants", glyph: "ㅅ", answer: "siot", sound: "s", initialIndex: 9 },
  { id: "hangul.consonant.ieung", category: "basicConsonants", glyph: "ㅇ", answer: "ieung", sound: "", initialIndex: 11 },
  { id: "hangul.consonant.jieut", category: "basicConsonants", glyph: "ㅈ", answer: "jieut", sound: "j", initialIndex: 12 },
  { id: "hangul.consonant.chieut", category: "basicConsonants", glyph: "ㅊ", answer: "chieut", sound: "ch", initialIndex: 14 },
  { id: "hangul.consonant.kieuk", category: "basicConsonants", glyph: "ㅋ", answer: "kieuk", sound: "k", initialIndex: 15 },
  { id: "hangul.consonant.tieut", category: "basicConsonants", glyph: "ㅌ", answer: "tieut", sound: "t", initialIndex: 16 },
  { id: "hangul.consonant.pieup", category: "basicConsonants", glyph: "ㅍ", answer: "pieup", sound: "p", initialIndex: 17 },
  { id: "hangul.consonant.hieut", category: "basicConsonants", glyph: "ㅎ", answer: "hieut", sound: "h", initialIndex: 18 },
];

const HANGUL_ASPIRATED_SIGNS = [
  { id: "hangul.aspirated.kieuk", category: "aspirated", glyph: "ㅋ", answer: "k", base: "ㄱ", signName: "kieuk" },
  { id: "hangul.aspirated.tieut", category: "aspirated", glyph: "ㅌ", answer: "t", base: "ㄷ", signName: "tieut" },
  { id: "hangul.aspirated.pieup", category: "aspirated", glyph: "ㅍ", answer: "p", base: "ㅂ", signName: "pieup" },
  { id: "hangul.aspirated.chieut", category: "aspirated", glyph: "ㅊ", answer: "ch", base: "ㅈ", signName: "chieut" },
];

const HANGUL_DOUBLE_CONSONANTS = [
  { id: "hangul.double.ssangGiyeok", category: "doubleConsonants", glyph: "ㄲ", answer: "kk", base: "ㄱ", signName: "ssang giyeok", initialIndex: 1 },
  { id: "hangul.double.ssangDigeut", category: "doubleConsonants", glyph: "ㄸ", answer: "tt", base: "ㄷ", signName: "ssang digeut", initialIndex: 4 },
  { id: "hangul.double.ssangBieup", category: "doubleConsonants", glyph: "ㅃ", answer: "pp", base: "ㅂ", signName: "ssang bieup", initialIndex: 8 },
  { id: "hangul.double.ssangSiot", category: "doubleConsonants", glyph: "ㅆ", answer: "ss", base: "ㅅ", signName: "ssang siot", initialIndex: 10 },
  { id: "hangul.double.ssangJieut", category: "doubleConsonants", glyph: "ㅉ", answer: "jj", base: "ㅈ", signName: "ssang jieut", initialIndex: 13 },
];

const HANGUL_FIRST_SYLLABLE_CONSONANTS = HANGUL_BASIC_CONSONANTS.filter((item) =>
  ["giyeok", "nieun", "digeut", "rieul", "mieum", "bieup", "siot", "jieut", "hieut"].includes(item.answer),
);
const HANGUL_FIRST_SYLLABLE_VOWELS = HANGUL_BASIC_VOWELS.filter((item) =>
  ["a", "eo", "o", "u", "eu", "i"].includes(item.answer),
);

function composeHangulSyllable(consonant, vowel) {
  return String.fromCharCode(HANGUL_SYLLABLE_BASE_CODE + consonant.initialIndex * HANGUL_INITIAL_STRIDE + vowel.vowelIndex * HANGUL_VOWEL_STRIDE);
}

const HANGUL_FIRST_SYLLABLES = HANGUL_FIRST_SYLLABLE_CONSONANTS.flatMap((consonant) =>
  HANGUL_FIRST_SYLLABLE_VOWELS.map((vowel) => ({
    id: `hangul.syllable.${consonant.answer}.${vowel.answer}`,
    category: "firstSyllables",
    glyph: composeHangulSyllable(consonant, vowel),
    answer: `${consonant.sound}${vowel.answer}`,
    consonant,
    vowel,
  })),
);

const HANGUL_SINGLE_BATCHIM_ITEMS = [
  { id: "hangul.batchim.gan", category: "batchim", glyph: "간", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.mun", category: "batchim", glyph: "문", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.san", category: "batchim", glyph: "산", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.nun", category: "batchim", glyph: "눈", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.son", category: "batchim", glyph: "손", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.na", category: "batchim", glyph: "나", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
  { id: "hangul.batchim.ma", category: "batchim", glyph: "마", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
  { id: "hangul.batchim.uBlock", category: "batchim", glyph: "우", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
];

const HANGUL_DOUBLE_BATCHIM_ITEMS = [
  { id: "hangul.doubleBatchim.anj", category: "batchim", glyph: "앉", answer: "first final ㄴ", cluster: "ㄵ" },
  { id: "hangul.doubleBatchim.dalk", category: "batchim", glyph: "닭", answer: "second final ㄱ", cluster: "ㄺ" },
  { id: "hangul.doubleBatchim.gap", category: "batchim", glyph: "값", answer: "first final ㅂ", cluster: "ㅄ" },
];

const HANGUL_ALL_ITEMS = [
  ...HANGUL_BASIC_VOWELS,
  ...HANGUL_COMPOUND_VOWELS,
  ...HANGUL_BASIC_CONSONANTS,
  ...HANGUL_FIRST_SYLLABLES,
  ...HANGUL_ASPIRATED_SIGNS,
  ...HANGUL_DOUBLE_CONSONANTS,
  ...HANGUL_SINGLE_BATCHIM_ITEMS,
  ...HANGUL_DOUBLE_BATCHIM_ITEMS,
];

const HANGUL_ITEMS = Object.fromEntries(HANGUL_ALL_ITEMS.map((item) => [item.id, item]));

const HANGUL_DICTIONARY_CATEGORIES = [
  {
    id: "basicVowels",
    titleKey: "dictionary.hangul.category.basicVowels",
    itemIds: HANGUL_BASIC_VOWELS.map((item) => item.id),
  },
  {
    id: "compoundVowels",
    titleKey: "dictionary.hangul.category.compoundVowels",
    itemIds: HANGUL_COMPOUND_VOWELS.map((item) => item.id),
  },
  {
    id: "basicConsonants",
    titleKey: "dictionary.hangul.category.basicConsonants",
    itemIds: HANGUL_BASIC_CONSONANTS.map((item) => item.id),
  },
  {
    id: "firstSyllables",
    titleKey: "dictionary.hangul.category.firstSyllables",
    itemIds: HANGUL_FIRST_SYLLABLES.map((item) => item.id),
    encounteredOnly: true,
  },
  {
    id: "aspirated",
    titleKey: "dictionary.hangul.category.aspirated",
    itemIds: HANGUL_ASPIRATED_SIGNS.map((item) => item.id),
  },
  {
    id: "doubleConsonants",
    titleKey: "dictionary.hangul.category.doubleConsonants",
    itemIds: HANGUL_DOUBLE_CONSONANTS.map((item) => item.id),
  },
  {
    id: "batchim",
    titleKey: "dictionary.hangul.category.batchim",
    itemIds: [...HANGUL_SINGLE_BATCHIM_ITEMS, ...HANGUL_DOUBLE_BATCHIM_ITEMS].map((item) => item.id),
    encounteredOnly: true,
  },
];

const STUDY_BOARD_WORD_ITEMS = {
  sinoNumbers: [
    "word.il", "word.i", "word.sam", "word.sa", "word.o2",
    "word.yuk", "word.chil", "word.pal", "word.gu", "word.sip",
    "word.baek", "word.cheon", "word.man",
  ],
  nativeNumbers: [
    "word.hana", "word.dul", "word.set", "word.net", "word.daseot",
    "word.yeoseot", "word.ilgop", "word.yeodeol", "word.ahop", "word.yeol",
  ],
  counters: [
    "word.gae", "word.myeong", "word.mari", "word.byeong",
    "word.jan", "word.gwon", "word.sal",
  ],
};

const STUDY_BOARD_DICTIONARY_ITEMS = {
  basicVowels: HANGUL_BASIC_VOWELS.map((item) => item.id),
  compoundVowels: HANGUL_COMPOUND_VOWELS.map((item) => item.id),
  basicConsonants: HANGUL_BASIC_CONSONANTS.map((item) => item.id),
  aspiratedConsonants: HANGUL_ASPIRATED_SIGNS.map((item) => item.id),
  doubleConsonants: HANGUL_DOUBLE_CONSONANTS.map((item) => item.id),
  singleBatchim: ["hangul.batchim.gan", "hangul.batchim.mun", "hangul.batchim.na"],
  doubleBatchim: HANGUL_DOUBLE_BATCHIM_ITEMS.map((item) => item.id),
};

const TOWN1_FLAGS = {
  schoolEntered: "town1.schoolEntered",
  vowelMapRead: "town1.vowelMapRead",
  consonantMapRead: "town1.consonantMapRead",
  teacherIntroDone: "town1.teacherIntroDone",
  vowelPracticePassed1: "town1.vowelPracticePassed1",
  consonantPracticePassed1: "town1.consonantPracticePassed1",
  firstSyllablePracticePassed1: "town1.firstSyllablePracticePassed1",
  vowelExamPassed: "town1.vowelExamPassed",
  consonantExamPassed: "town1.consonantExamPassed",
  firstSyllablesPassed: "town1.firstSyllablesPassed",
  aspiratedIntroDone: "town1.aspiratedIntroDone",
  aspiratedBookRead: "town1.aspiratedBookRead",
  aspiratedPracticePassed1: "town1.aspiratedPracticePassed1",
  aspiratedExamPassed: "town1.aspiratedExamPassed",
  doubleConsonantIntroDone: "town1.doubleConsonantIntroDone",
  doubleConsonantBookRead: "town1.doubleConsonantBookRead",
  doubleConsonantPracticePassed1: "town1.doubleConsonantPracticePassed1",
  doubleConsonantExamPassed: "town1.doubleConsonantExamPassed",
  batchimSingleIntroDone: "town1.batchimSingleIntroDone",
  batchimSingleBookRead: "town1.batchimSingleBookRead",
  batchimSinglePracticePassed1: "town1.batchimSinglePracticePassed1",
  batchimDoubleIntroDone: "town1.batchimDoubleIntroDone",
  batchimDoubleBookRead: "town1.batchimDoubleBookRead",
  batchimDoublePracticePassed1: "town1.batchimDoublePracticePassed1",
};

const progress = {
  flags: new Set(),
  questLevels: {},
  dictionary: {},
  words: {},
};

const TOWN1_QUESTS = [
  {
    id: "basicVowels",
    titleKey: "quest.town1.basicVowels",
    steps: [
      { flag: TOWN1_FLAGS.vowelMapRead, objectiveKey: "quest.town1.basicVowels.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.vowelPracticePassed1, objectiveKey: "quest.town1.basicVowels.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.vowelExamPassed, objectiveKey: "quest.town1.basicVowels.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "basicConsonants",
    titleKey: "quest.town1.basicConsonants",
    steps: [
      { flag: TOWN1_FLAGS.consonantMapRead, objectiveKey: "quest.town1.basicConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.consonantPracticePassed1, objectiveKey: "quest.town1.basicConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.consonantExamPassed, objectiveKey: "quest.town1.basicConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "firstSyllables",
    titleKey: "quest.town1.firstSyllables",
    steps: [
      { flag: TOWN1_FLAGS.firstSyllablePracticePassed1, objectiveKey: "quest.town1.firstSyllables.practice", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.firstSyllablesPassed, objectiveKey: "quest.town1.firstSyllables.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "aspiratedConsonants",
    titleKey: "quest.town1.aspiratedConsonants",
    steps: [
      { flag: TOWN1_FLAGS.aspiratedIntroDone, objectiveKey: "quest.town1.aspiratedConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.aspiratedBookRead, objectiveKey: "quest.town1.aspiratedConsonants.book", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.aspiratedPracticePassed1, objectiveKey: "quest.town1.aspiratedConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.aspiratedExamPassed, objectiveKey: "quest.town1.aspiratedConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "doubleConsonants",
    titleKey: "quest.town1.doubleConsonants",
    steps: [
      { flag: TOWN1_FLAGS.doubleConsonantIntroDone, objectiveKey: "quest.town1.doubleConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.doubleConsonantBookRead, objectiveKey: "quest.town1.doubleConsonants.book", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.doubleConsonantPracticePassed1, objectiveKey: "quest.town1.doubleConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.doubleConsonantExamPassed, objectiveKey: "quest.town1.doubleConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "singleBatchim",
    titleKey: "quest.town1.singleBatchim",
    steps: [
      { flag: TOWN1_FLAGS.batchimSingleIntroDone, objectiveKey: "quest.town1.singleBatchim.theory", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimSingleBookRead, objectiveKey: "quest.town1.singleBatchim.book", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimSinglePracticePassed1, objectiveKey: "quest.town1.singleBatchim.practice", whereKey: "area.haneulTown" },
    ],
  },
  {
    id: "doubleBatchim",
    titleKey: "quest.town1.doubleBatchim",
    steps: [
      { flag: TOWN1_FLAGS.batchimDoubleIntroDone, objectiveKey: "quest.town1.doubleBatchim.theory", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimDoubleBookRead, objectiveKey: "quest.town1.doubleBatchim.book", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimDoublePracticePassed1, objectiveKey: "quest.town1.doubleBatchim.practice", whereKey: "area.haneulTown" },
    ],
  },
  {
    id: "readingBadge",
    titleKey: "quest.town1.readingBadge",
    steps: [
      { flag: TOWN1_FLAGS.batchimDoublePracticePassed1, objectiveKey: "quest.town1.readingBadge.ready", whereKey: "area.haneulTown" },
    ],
  },
];

const TOWN2_FLAGS = {
  arrived: "town2.arrived",
  mixedReviewPassed: "town2.mixedReviewPassed",
  identityPassed: "town2.identityPassed",
  lostFoundPassed: "town2.lostFoundPassed",
  labelsPassed: "town2.labelsPassed",
  actionsPassed: "town2.actionsPassed",
  readingReviewPassed: "town2.readingReviewPassed",
  finalBadgePassed: "town2.finalBadgePassed",
};

const TOWN2_QUESTS = [
  {
    id: "town2Arrival",
    titleKey: "quest.town2.arrival",
    steps: [{ flag: TOWN2_FLAGS.arrived, objectiveKey: "quest.town2.arrival.greet", whereKey: "area.town2" }],
  },
  {
    id: "town2Identity",
    titleKey: "quest.town2.identity",
    steps: [{ flag: TOWN2_FLAGS.identityPassed, objectiveKey: "quest.town2.identity.pass", whereKey: "area.town2InfoCenter" }],
  },
  {
    id: "town2LostFound",
    titleKey: "quest.town2.lostFound",
    steps: [{ flag: TOWN2_FLAGS.lostFoundPassed, objectiveKey: "quest.town2.lostFound.pass", whereKey: "area.town2LostFound" }],
  },
  {
    id: "town2Labels",
    titleKey: "quest.town2.labels",
    steps: [{ flag: TOWN2_FLAGS.labelsPassed, objectiveKey: "quest.town2.labels.pass", whereKey: "area.town2LabelMuseum" }],
  },
  {
    id: "town2Actions",
    titleKey: "quest.town2.actions",
    steps: [{ flag: TOWN2_FLAGS.actionsPassed, objectiveKey: "quest.town2.actions.pass", whereKey: "area.town2" }],
  },
  {
    id: "town2ReadingReview",
    titleKey: "quest.town2.readingReview",
    steps: [{ flag: TOWN2_FLAGS.readingReviewPassed, objectiveKey: "quest.town2.readingReview.pass", whereKey: "area.town2ReviewLibrary" }],
  },
  {
    id: "town2FirstWordsBadge",
    titleKey: "quest.town2.firstWordsBadge",
    steps: [{ flag: TOWN2_FLAGS.finalBadgePassed, objectiveKey: "quest.town2.firstWordsBadge.podium", whereKey: "area.town2CityHall" }],
  },
];

const TRAIL2_FLAGS = {
  mirrorBoardRead: "trail2.mirrorBoardRead",
  mirrorPracticePassed: "trail2.mirrorPracticePassed",
  locationPostsPassed: "trail2.locationPostsPassed",
  echoTwinsPassed: "trail2.echoTwinsPassed",
  keyQuestStarted: "trail2.keyQuestStarted",
  keyFound: "trail2.keyFound",
  keyReturned: "trail2.keyReturned",
};

const TOWN3_FLAGS = {
  arrived: "town3.arrived",
  sinoBoardRead: "town3.sinoBoardRead",
  sinoPracticePassed: "town3.sinoPracticePassed",
  sinoExamPassed: "town3.sinoExamPassed",
  nativeBoardRead: "town3.nativeBoardRead",
  nativePracticePassed: "town3.nativePracticePassed",
  nativeExamPassed: "town3.nativeExamPassed",
  counterBoardRead: "town3.counterBoardRead",
  countersPracticePassed: "town3.countersPracticePassed",
  priceBoardRead: "town3.priceBoardRead",
  pricesPracticePassed: "town3.pricesPracticePassed",
  shoppingListDone: "town3.shoppingListDone",
  cafeOrderDone: "town3.cafeOrderDone",
  numberBadgePassed: "town3.numberBadgePassed",
};

const CHAPTER3_QUESTS = [
  {
    id: "trail2MirrorVowels",
    titleKey: "quest.trail2.mirrorVowels",
    steps: [
      { flag: TRAIL2_FLAGS.mirrorBoardRead, objectiveKey: "quest.trail2.mirrorVowels.theory", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.mirrorPracticePassed, objectiveKey: "quest.trail2.mirrorVowels.practice", whereKey: "area.trail2" },
    ],
  },
  {
    id: "trail2Location",
    titleKey: "quest.trail2.location",
    steps: [{ flag: TRAIL2_FLAGS.locationPostsPassed, objectiveKey: "quest.trail2.location.pass", whereKey: "area.trail2" }],
  },
  {
    id: "trail2Also",
    titleKey: "quest.trail2.also",
    steps: [{ flag: TRAIL2_FLAGS.echoTwinsPassed, objectiveKey: "quest.trail2.also.pass", whereKey: "area.trail2" }],
  },
  {
    id: "trail2LostKey",
    titleKey: "quest.trail2.lostKey",
    steps: [
      { flag: TRAIL2_FLAGS.keyQuestStarted, objectiveKey: "quest.trail2.lostKey.start", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.keyFound, objectiveKey: "quest.trail2.lostKey.find", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.keyReturned, objectiveKey: "quest.trail2.lostKey.return", whereKey: "area.trail2" },
    ],
  },
  {
    id: "town3Sino",
    titleKey: "quest.town3.sino",
    steps: [
      { flag: TOWN3_FLAGS.sinoBoardRead, objectiveKey: "quest.town3.sino.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.sinoPracticePassed, objectiveKey: "quest.town3.sino.practice", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.sinoExamPassed, objectiveKey: "quest.town3.sino.exam", whereKey: "area.town3CountingHouse" },
    ],
  },
  {
    id: "town3Native",
    titleKey: "quest.town3.native",
    steps: [
      { flag: TOWN3_FLAGS.nativeBoardRead, objectiveKey: "quest.town3.native.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.nativePracticePassed, objectiveKey: "quest.town3.native.practice", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.nativeExamPassed, objectiveKey: "quest.town3.native.exam", whereKey: "area.town3CountingHouse" },
    ],
  },
  {
    id: "town3Counters",
    titleKey: "quest.town3.counters",
    steps: [
      { flag: TOWN3_FLAGS.counterBoardRead, objectiveKey: "quest.town3.counters.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.countersPracticePassed, objectiveKey: "quest.town3.counters.practice", whereKey: "area.town3" },
    ],
  },
  {
    id: "town3Prices",
    titleKey: "quest.town3.prices",
    steps: [
      { flag: TOWN3_FLAGS.priceBoardRead, objectiveKey: "quest.town3.prices.theory", whereKey: "area.town3" },
      { flag: TOWN3_FLAGS.pricesPracticePassed, objectiveKey: "quest.town3.prices.practice", whereKey: "area.town3" },
    ],
  },
  {
    id: "town3ShoppingList",
    titleKey: "quest.town3.shoppingList",
    steps: [{ flag: TOWN3_FLAGS.shoppingListDone, objectiveKey: "quest.town3.shoppingList.help", whereKey: "area.town3" }],
  },
  {
    id: "town3Cafe",
    titleKey: "quest.town3.cafe",
    steps: [{ flag: TOWN3_FLAGS.cafeOrderDone, objectiveKey: "quest.town3.cafe.order", whereKey: "area.town3SnackCafe" }],
  },
  {
    id: "town3NumberBadge",
    titleKey: "quest.town3.numberBadge",
    steps: [{ flag: TOWN3_FLAGS.numberBadgePassed, objectiveKey: "quest.town3.numberBadge.podium", whereKey: "area.town3GuildHall" }],
  },
];

const QUEST_CHAPTERS = [
  { id: "town1", titleKey: "journal.chapter.town1", sceneIds: ["town", "trail1"], quests: TOWN1_QUESTS },
  { id: "town2", titleKey: "journal.chapter.town2", sceneIds: ["town2"], quests: TOWN2_QUESTS },
  { id: "town3", titleKey: "journal.chapter.town3", sceneIds: ["trail2", "town3"], quests: CHAPTER3_QUESTS },
];

const BADGES = [
  { id: "firstWords", titleKey: "badge.firstWords", flag: TOWN2_FLAGS.finalBadgePassed },
  { id: "numbers", titleKey: "badge.numbers", flag: TOWN3_FLAGS.numberBadgePassed },
];

const WORD_MASTERY_CORRECT_TARGET = 3;
const WORD_MASTERY_STREAK_TARGET = 2;

const WORD_CATEGORY_IDS = [
  "position",
  "nature",
  "numbersSino",
  "numbersNative",
  "counters",
  "shopping",
  "food",
  "colors",
  "people",
  "cafe",
];

const WORD_ITEMS = {};

function registerWordItems(words = []) {
  words.forEach((word) => {
    if (!word || !word.id || !word.hangul) return;
    WORD_ITEMS[word.id] = {
      id: word.id,
      hangul: word.hangul,
      category: word.category || "people",
      translations: { en: word.en || word.hangul, nl: word.nl || word.en || word.hangul },
    };
  });
}

function wordItemsByCategory(categoryId) {
  return Object.values(WORD_ITEMS).filter((item) => item.category === categoryId);
}

function wordMeaning(item, language = settings.primary) {
  if (!item) return "";
  if (language === "ko") return item.hangul;
  return item.translations[language] || item.translations.en;
}

function hasProgressFlag(flag) {
  return progress.flags.has(flag);
}

function setProgressFlag(flag) {
  if (!flag || progress.flags.has(flag)) return false;
  progress.flags.add(flag);
  refreshQuestLevels();
  scheduleSave();
  return true;
}

function setProgressFlags(flags = []) {
  flags.forEach((flag) => setProgressFlag(flag));
}

function ensureHangulDictionaryEntry(itemId) {
  if (!HANGUL_ITEMS[itemId]) return null;
  if (!progress.dictionary[itemId]) {
    progress.dictionary[itemId] = {
      seen: false,
      attempts: 0,
      correct: 0,
      streak: 0,
      mastered: false,
    };
  }
  return progress.dictionary[itemId];
}

function markHangulItemSeen(itemId) {
  const entry = ensureHangulDictionaryEntry(itemId);
  if (!entry) return;
  entry.seen = true;
}

function markHangulItemsSeen(itemIds = []) {
  itemIds.forEach((itemId) => markHangulItemSeen(itemId));
}

function markStudyBoardHangulItemsSeen(studyBoardKey) {
  markHangulItemsSeen(STUDY_BOARD_DICTIONARY_ITEMS[studyBoardKey] || []);
}

function hangulStepSeenItemIds(step) {
  return [...(step.seenItemIds || []), ...(step.dictionaryItemIds || [])];
}

function hangulStepMasteryItemIds(step) {
  return step.masteryItemIds || step.dictionaryItemIds || [];
}

function recordHangulAnswer(itemIds = [], correct) {
  itemIds.forEach((itemId) => {
    const entry = ensureHangulDictionaryEntry(itemId);
    if (!entry) return;
    entry.seen = true;
    entry.attempts += 1;
    if (correct) {
      entry.correct += 1;
      entry.streak += 1;
    } else {
      entry.streak = 0;
    }
    entry.mastered = entry.correct >= HANGUL_MASTERY_CORRECT_TARGET && entry.streak >= HANGUL_MASTERY_STREAK_TARGET;
  });
  scheduleSave();
}

function hangulItemProgress(itemId) {
  return progress.dictionary[itemId] || null;
}

function hangulItemSeen(itemId) {
  return !!hangulItemProgress(itemId)?.seen;
}

function hangulItemMastered(itemId) {
  return !!hangulItemProgress(itemId)?.mastered;
}

function hangulDictionaryTotals(itemIds = HANGUL_ALL_ITEMS.map((item) => item.id)) {
  return itemIds.reduce(
    (totals, itemId) => {
      totals.total += 1;
      if (hangulItemSeen(itemId)) totals.seen += 1;
      if (hangulItemMastered(itemId)) totals.mastered += 1;
      return totals;
    },
    { total: 0, seen: 0, mastered: 0 },
  );
}

function hangulDictionarySummary() {
  const totals = hangulDictionaryTotals();
  return t("dictionary.hangul.summary", totals);
}

function hangulDictionaryPanelSummary() {
  const totals = hangulDictionaryTotals();
  return t("dictionary.hangul.panelSummary", totals);
}

function ensureWordEntry(wordId) {
  if (!WORD_ITEMS[wordId]) return null;
  if (!progress.words[wordId]) {
    progress.words[wordId] = {
      seen: false,
      attempts: 0,
      correct: 0,
      streak: 0,
      mastered: false,
    };
  }
  return progress.words[wordId];
}

function markWordSeen(wordId) {
  const entry = ensureWordEntry(wordId);
  if (!entry) return;
  entry.seen = true;
}

function markWordsSeen(wordIds = []) {
  wordIds.forEach((wordId) => markWordSeen(wordId));
}

function recordWordAnswer(wordIds = [], correct) {
  wordIds.forEach((wordId) => {
    const entry = ensureWordEntry(wordId);
    if (!entry) return;
    entry.seen = true;
    entry.attempts += 1;
    if (correct) {
      entry.correct += 1;
      entry.streak += 1;
    } else {
      entry.streak = 0;
    }
    entry.mastered = entry.correct >= WORD_MASTERY_CORRECT_TARGET && entry.streak >= WORD_MASTERY_STREAK_TARGET;
  });
  scheduleSave();
}

function wordProgressEntry(wordId) {
  return progress.words[wordId] || null;
}

function wordSeen(wordId) {
  return !!wordProgressEntry(wordId)?.seen;
}

function wordMastered(wordId) {
  return !!wordProgressEntry(wordId)?.mastered;
}

function wordDictionaryTotals(wordIds = Object.keys(WORD_ITEMS)) {
  return wordIds.reduce(
    (totals, wordId) => {
      totals.total += 1;
      if (wordSeen(wordId)) totals.seen += 1;
      if (wordMastered(wordId)) totals.mastered += 1;
      return totals;
    },
    { total: 0, seen: 0, mastered: 0 },
  );
}

function wordDictionaryPanelSummary() {
  const totals = wordDictionaryTotals();
  return t("dictionary.words.panelSummary", totals);
}

function wordDictionaryStatusKey(wordId) {
  const entry = wordProgressEntry(wordId);
  if (!entry?.seen) return "dictionary.hangul.status.unseen";
  if (entry.mastered) return "dictionary.hangul.status.mastered";
  if (entry.attempts > 0) return "dictionary.hangul.status.learning";
  return "dictionary.hangul.status.seen";
}

function earnedBadges() {
  return BADGES.filter((badge) => hasProgressFlag(badge.flag));
}

function badgePanelSummary() {
  return `${earnedBadges().length}/${BADGES.length}`;
}

function refreshQuestLevels() {
  QUEST_CHAPTERS.forEach((chapter) => {
    chapter.quests.forEach((quest) => {
      let level = 0;
      for (const step of quest.steps) {
        if (!hasProgressFlag(step.flag)) break;
        level += 1;
      }
      progress.questLevels[quest.id] = level;
    });
  });
}

function firstIncompleteQuest(quests) {
  for (const quest of quests) {
    const level = progress.questLevels[quest.id] || 0;
    if (level < quest.steps.length) {
      return {
        titleKey: quest.titleKey,
        objectiveKey: quest.steps[level].objectiveKey,
        whereKey: quest.steps[level].whereKey || null,
      };
    }
  }
  return null;
}

function chapterGuideLines(chapterId, introKey) {
  const chapter = QUEST_CHAPTERS.find((candidate) => candidate.id === chapterId);
  const status = chapter ? firstIncompleteQuest(chapter.quests) : null;
  if (!status) return [introKey, "npc.guide.allDone"];
  return [
    introKey,
    {
      key: "npc.guide.next",
      params: {
        objective: t(status.objectiveKey),
        where: status.whereKey ? t(status.whereKey) : t(chapter.titleKey),
      },
    },
  ];
}

function currentQuestStatus() {
  const sceneId = currentSceneId;
  const sceneChapter = QUEST_CHAPTERS.find((chapter) => chapter.sceneIds.some((id) => sceneId.startsWith(id)));
  if (sceneChapter) {
    const local = firstIncompleteQuest(sceneChapter.quests);
    if (local) return local;
  }

  for (const chapter of QUEST_CHAPTERS) {
    const status = firstIncompleteQuest(chapter.quests);
    if (status) return status;
  }

  const lastChapter = QUEST_CHAPTERS[QUEST_CHAPTERS.length - 1];
  const finalQuest = lastChapter.quests[lastChapter.quests.length - 1];
  return { titleKey: finalQuest.titleKey, objectiveKey: "journal.complete" };
}

const SAVE_KEY = "koreaAdventure.save";
const SAVE_VERSION = 1;
let saveTimer = null;
let saveLoaded = false;
let pendingPlayerState = null;

function saveAvailable() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch (error) {
    return false;
  }
}

function serializeSave() {
  return JSON.stringify({
    version: SAVE_VERSION,
    settings: { ...settings },
    flags: [...progress.flags],
    questLevels: { ...progress.questLevels },
    dictionary: progress.dictionary,
    words: progress.words,
    player: {
      sceneId: currentSceneId,
      x: player.tileX,
      y: player.tileY,
      dir: player.dir,
    },
  });
}

function persistSaveNow() {
  if (!saveAvailable() || !saveLoaded) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    window.localStorage.setItem(SAVE_KEY, serializeSave());
  } catch (error) {
    // Storage may be full or blocked; the game keeps running without saving.
  }
}

function scheduleSave() {
  if (!saveAvailable() || !saveLoaded) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistSaveNow, 500);
}

function loadSave() {
  saveLoaded = true;
  if (!saveAvailable()) return;

  let payload = null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    payload = JSON.parse(raw);
  } catch (error) {
    return;
  }
  if (!payload || payload.version !== SAVE_VERSION) return;

  const savedSettings = payload.settings || {};
  ["primary", "secondary", "speech"].forEach((key) => {
    if (LANGUAGES.some((language) => language.code === savedSettings[key])) {
      settings[key] = savedSettings[key];
    }
  });

  (payload.flags || []).forEach((flag) => {
    if (typeof flag === "string") progress.flags.add(flag);
  });
  Object.assign(progress.questLevels, payload.questLevels || {});
  Object.entries(payload.dictionary || {}).forEach(([itemId, entry]) => {
    if (HANGUL_ITEMS[itemId] && entry) progress.dictionary[itemId] = entry;
  });
  Object.entries(payload.words || {}).forEach(([wordId, entry]) => {
    if (WORD_ITEMS[wordId] && entry) progress.words[wordId] = entry;
  });

  if (payload.player && typeof payload.player.sceneId === "string") {
    pendingPlayerState = payload.player;
  }

  refreshQuestLevels();
}

function applySavedPlayerState() {
  if (!pendingPlayerState) return;
  const target = scenes[pendingPlayerState.sceneId];
  if (target) {
    const x = Math.min(Math.max(0, pendingPlayerState.x ?? 0), target.width - 1);
    const y = Math.min(Math.max(0, pendingPlayerState.y ?? 0), target.height - 1);
    const dir = DIRS[pendingPlayerState.dir] ? pendingPlayerState.dir : "down";
    if (!isBlockedInScene(target, x, y)) {
      changeScene(target.id, x, y, dir);
    }
  }
  pendingPlayerState = null;
}

function isBlockedInScene(scene, x, y) {
  const tile = scene.map[y]?.[x];
  if (!tile || SOLID_TILES.has(tile)) return true;
  if (scene.interactables.some((item) => item.solid && item.x === x && item.y === y)) return true;
  if (scene.npcs.some((npc) => npc.x === x && npc.y === y)) return true;
  if (scene.kind === "outdoor" && (scene.buildings || []).some((building) => isBuildingBlockedAt(building, x, y))) return true;
  return false;
}

function isBuildingBlockedAt(building, x, y) {
  if (x < building.x || x >= building.x + building.w || y < building.y || y >= building.y + building.h) {
    return false;
  }
  return !(x === building.doorX && y === building.doorY);
}

function eraseSaveAndReload() {
  if (saveAvailable()) {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      // Ignore storage errors during erase.
    }
  }
  saveLoaded = false;
  window.location.reload();
}

function resolveTown1FountainDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return "town1FountainVowels";
  if (!hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return "town1FountainConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return "town1FountainAspirated";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) return "town1FountainDoubleConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return "town1FountainBatchimSingle";
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoublePracticePassed1)) return "town1FountainBatchimDouble";
  return "town1FountainReview";
}

function resolveTown1FountainConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) return ["object.soundFountain.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantMapRead) && hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) {
    return ["object.soundFountain.locked.consonants"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed) && !hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) {
    return ["object.soundFountain.locked.aspirated"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed) && !hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) {
    return ["object.soundFountain.locked.doubleConsonants"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed) && !hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) {
    return ["object.soundFountain.locked.batchimSingle"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1) && !hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) {
    return ["object.soundFountain.locked.batchimDouble"];
  }
  return ["object.soundFountain.complete.line1"];
}

function resolveTown1DeskDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return null;
  return "town1DeskSyllables";
}

function resolveTown1DeskConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return ["object.studentDesk.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return ["object.studentDesk.locked.consonants"];
  return ["object.studentDesk.line1"];
}

function resolveTown1BlackboardDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelExamPassed)) return "town1BlackboardVowels";
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantExamPassed)) return "town1BlackboardConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) return "town1BlackboardSyllables";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return "town1BlackboardAspirated";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return "town1BlackboardDoubleConsonants";
  return null;
}

function resolveTown1BlackboardConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) return ["object.schoolBlackboard.locked.teacher"];
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return ["object.schoolBlackboard.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1) || !hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) {
    return ["object.schoolBlackboard.locked.consonants"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) return ["object.schoolBlackboard.locked.syllables"];
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return ["object.schoolBlackboard.locked.aspirated"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) {
    return ["object.schoolBlackboard.locked.doubleConsonants"];
  }
  return ["object.schoolBlackboard.complete.line1"];
}

function resolveTown1TeacherConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) {
    return ["npc.hangulTeacher.line1", "npc.hangulTeacher.line2", "npc.hangulTeacher.line3"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) {
    return [
      "npc.hangulTeacher.aspiratedIntro.line1",
      "npc.hangulTeacher.aspiratedIntro.line2",
      "npc.hangulTeacher.aspiratedIntro.line3",
    ];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) return ["npc.hangulTeacher.aspiratedBook.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return ["npc.hangulTeacher.aspiratedPractice.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) {
    return [
      "npc.hangulTeacher.doubleConsonantIntro.line1",
      "npc.hangulTeacher.doubleConsonantIntro.line2",
      "npc.hangulTeacher.doubleConsonantIntro.line3",
    ];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) return ["npc.hangulTeacher.doubleConsonantBook.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return ["npc.hangulTeacher.doubleConsonantPractice.line1"];
  return ["npc.hangulTeacher.doubleConsonantDone.line1"];
}

function resolveTown1TeacherProgressFlags() {
  const flags = [];
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) flags.push(TOWN1_FLAGS.teacherIntroDone);
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed) && !hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) {
    flags.push(TOWN1_FLAGS.aspiratedIntroDone);
  }
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed) && !hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) {
    flags.push(TOWN1_FLAGS.doubleConsonantIntroDone);
  }
  return flags;
}

function resolveTown1AspiratedBookBoard() {
  return hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone) ? "aspiratedConsonants" : null;
}

function resolveTown1AspiratedBookConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) return ["object.aspiratedBookcase.locked.line1"];
  return ["object.schoolBookshelf.line1"];
}

function resolveTown1AspiratedBookFlags() {
  return hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone) ? [TOWN1_FLAGS.aspiratedBookRead] : [];
}

function resolveTown1DoubleConsonantBookBoard() {
  return hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone) ? "doubleConsonants" : null;
}

function resolveTown1DoubleConsonantBookConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) return ["object.doubleConsonantBookcase.locked.line1"];
  return ["object.schoolBookshelf.line1"];
}

function resolveTown1DoubleConsonantBookFlags() {
  return hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone) ? [TOWN1_FLAGS.doubleConsonantBookRead] : [];
}

function resolveTown1FinalSoundCoachConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return ["npc.finalSoundCoach.locked.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) {
    return ["npc.finalSoundCoach.intro.line1", "npc.finalSoundCoach.intro.line2"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) return ["npc.finalSoundCoach.readNote.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return ["npc.finalSoundCoach.afterNote.line1"];
  return ["npc.finalSoundCoach.done.line1"];
}

function resolveTown1FinalSoundCoachProgressFlags() {
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed) && !hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) {
    return [TOWN1_FLAGS.batchimSingleIntroDone];
  }
  return [];
}

function resolveTown1DoubleFinalLearnerConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return ["npc.doubleFinalLearner.locked.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) {
    return ["npc.doubleFinalLearner.intro.line1", "npc.doubleFinalLearner.intro.line2"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) return ["npc.doubleFinalLearner.readNote.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoublePracticePassed1)) return ["npc.doubleFinalLearner.afterNote.line1"];
  return ["npc.doubleFinalLearner.done.line1"];
}

function resolveTown1DoubleFinalLearnerProgressFlags() {
  if (hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1) && !hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) {
    return [TOWN1_FLAGS.batchimDoubleIntroDone];
  }
  return [];
}

function resolveTown1BatchimSingleBoard() {
  return hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone) ? "singleBatchim" : null;
}

function resolveTown1BatchimSingleConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) return ["object.batchimSingleNotebook.locked.line1"];
  return ["npc.finalSoundCoach.readNote.line1"];
}

function resolveTown1BatchimSingleFlags() {
  return hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone) ? [TOWN1_FLAGS.batchimSingleBookRead] : [];
}

function resolveTown1BatchimDoubleBoard() {
  return hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone) ? "doubleBatchim" : null;
}

function resolveTown1BatchimDoubleConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) return ["object.batchimDoubleNotebook.locked.line1"];
  return ["npc.doubleFinalLearner.readNote.line1"];
}

function resolveTown1BatchimDoubleFlags() {
  return hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone) ? [TOWN1_FLAGS.batchimDoubleBookRead] : [];
}

refreshQuestLevels();

function mergeExternalDrillPacks() {
  const packs = window.KOREA_ADVENTURE_DRILL_PACKS || [];

  packs.forEach((pack) => {
    Object.entries(pack.text || {}).forEach(([language, entries]) => {
      if (!TEXT[language]) TEXT[language] = {};
      Object.assign(TEXT[language], entries);
    });

    Object.assign(DRILLS, pack.drills || {});
    registerWordItems(pack.words || []);
  });
}

mergeExternalDrillPacks();

function shuffledCopy(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function literalChoice(value) {
  return {
    id: `literal:${value}`,
    key: "drill.hangul.choice.literal",
    params: { value },
  };
}

function keyedChoice(key, params = {}) {
  return {
    id: `key:${key}:${JSON.stringify(params)}`,
    key,
    params,
  };
}

function choiceIdentity(choice) {
  if (typeof choice === "string") return `key:${choice}`;
  return choice.id || `key:${choice.key}:${JSON.stringify(choice.params || {})}`;
}

function createChoiceSet(correctChoice, candidateChoices, count = 4) {
  const choices = [correctChoice];
  const used = new Set([choiceIdentity(correctChoice)]);

  shuffledCopy(candidateChoices).forEach((choice) => {
    if (choices.length >= count) return;
    const id = choiceIdentity(choice);
    if (used.has(id)) return;
    choices.push(choice);
    used.add(id);
  });

  return { choices, answer: 0 };
}

function hangulPracticeScore(item) {
  const entry = hangulItemProgress(item.id);
  if (!entry?.seen) return -100;
  if (!entry.mastered) return entry.correct + entry.attempts * 0.25;
  return 100 + entry.correct + entry.attempts * 0.1;
}

function selectHangulPracticeItems(items, count) {
  return shuffledCopy(items)
    .sort((left, right) => hangulPracticeScore(left) - hangulPracticeScore(right))
    .slice(0, Math.min(count, items.length));
}

function createGeneratedHangulStep({
  item,
  promptKey,
  promptParams = {},
  correctChoice,
  candidateChoices,
  correctKey = "drill.hangul.feedback.correctMatch",
  incorrectKey = "drill.hangul.feedback.incorrectMatch",
  feedbackParams = {},
  seenItemIds = [],
  masteryItemIds = null,
  choiceCount = 4,
}) {
  const choiceSet = createChoiceSet(correctChoice, candidateChoices, choiceCount);
  return {
    promptKey,
    promptParams,
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey,
    correctParams: feedbackParams,
    incorrectKey,
    incorrectParams: feedbackParams,
    dictionaryItemIds: [item.id],
    seenItemIds,
    masteryItemIds: masteryItemIds || [item.id],
  };
}

function buildVowelQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.soundToVowel",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_BASIC_VOWELS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.vowelToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_BASIC_VOWELS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildConsonantQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.nameToConsonant",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_BASIC_CONSONANTS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.consonantToName",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_BASIC_CONSONANTS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildSyllableQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.readingToSyllable",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_FIRST_SYLLABLES.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctSyllable",
      incorrectKey: "drill.hangul.feedback.incorrectSyllable",
      feedbackParams: {
        glyph: item.glyph,
        left: item.consonant.glyph,
        right: item.vowel.glyph,
        answer: item.answer,
      },
      seenItemIds: [item.consonant.id, item.vowel.id],
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.syllableToSound",
    promptParams: { glyph: item.glyph, left: item.consonant.glyph, right: item.vowel.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_FIRST_SYLLABLES.map((candidate) => literalChoice(candidate.answer)),
    correctKey: "drill.hangul.feedback.correctSyllable",
    incorrectKey: "drill.hangul.feedback.incorrectSyllable",
    feedbackParams: {
      glyph: item.glyph,
      left: item.consonant.glyph,
      right: item.vowel.glyph,
      answer: item.answer,
    },
    seenItemIds: [item.consonant.id, item.vowel.id],
  });
}

function buildAspiratedQuestion(item) {
  if (Math.random() < 0.55) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.aspiratedToSign",
      promptParams: { base: item.base },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_ASPIRATED_SIGNS.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctTransform",
      incorrectKey: "drill.hangul.feedback.incorrectTransform",
      feedbackParams: { base: item.base, glyph: item.glyph, answer: item.answer },
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.aspiratedToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_ASPIRATED_SIGNS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildDoubleConsonantQuestion(item) {
  if (Math.random() < 0.55) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.doubleToSign",
      promptParams: { base: item.base },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_DOUBLE_CONSONANTS.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctTransform",
      incorrectKey: "drill.hangul.feedback.incorrectTransform",
      feedbackParams: { base: item.base, glyph: item.glyph, answer: item.answer },
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.doubleToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_DOUBLE_CONSONANTS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildSingleBatchimQuestion(item) {
  if (Math.random() < 0.45) {
    const correctKey = item.hasBatchim ? "drill.town1.choice.hasBatchim" : "drill.town1.choice.noBatchim";
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.batchimPresence",
      promptParams: { glyph: item.glyph },
      correctChoice: keyedChoice(correctKey),
      candidateChoices: [keyedChoice("drill.town1.choice.hasBatchim"), keyedChoice("drill.town1.choice.noBatchim")],
      correctKey: "drill.hangul.feedback.correctBatchim",
      incorrectKey: "drill.hangul.feedback.incorrectBatchim",
      feedbackParams: { glyph: item.glyph, answer: item.answer },
      choiceCount: 2,
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.batchimFinal",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.finalAnswer),
    candidateChoices: ["final n", "final k", "final p", "no batchim"].map((value) => literalChoice(value)),
    correctKey: "drill.hangul.feedback.correctBatchim",
    incorrectKey: "drill.hangul.feedback.incorrectBatchim",
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildDoubleBatchimQuestion(item) {
  const answerKey = item.answer.startsWith("first") ? "drill.town1.choice.firstFinal" : "drill.town1.choice.secondFinal";
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.doubleBatchimFinal",
    promptParams: { glyph: item.glyph, cluster: item.cluster },
    correctChoice: keyedChoice(answerKey),
    candidateChoices: [
      keyedChoice("drill.town1.choice.firstFinal"),
      keyedChoice("drill.town1.choice.secondFinal"),
      keyedChoice("drill.town1.choice.wordDecides"),
    ],
    correctKey: "drill.hangul.feedback.correctBatchim",
    incorrectKey: "drill.hangul.feedback.incorrectBatchim",
    feedbackParams: { glyph: item.glyph, answer: item.answer },
    choiceCount: 3,
  });
}

function buildCompoundVowelQuestion(item) {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.vowelToSound",
      promptParams: { glyph: item.glyph },
      correctChoice: literalChoice(item.answer),
      candidateChoices: HANGUL_COMPOUND_VOWELS.map((candidate) => literalChoice(candidate.answer)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }

  if (variant === 1) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.compoundCombine",
      promptParams: { left: item.parts[0], right: item.parts[1] },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_COMPOUND_VOWELS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }

  const consonant = shuffledCopy(
    HANGUL_BASIC_CONSONANTS.filter((candidate) => ["ieung", "giyeok", "nieun", "mieum"].includes(candidate.answer)),
  )[0];
  const syllable = composeHangulSyllable(consonant, item);
  const reading = `${consonant.sound}${item.answer}`;
  const candidateReadings = HANGUL_COMPOUND_VOWELS.map((candidate) =>
    literalChoice(`${consonant.sound}${candidate.answer}`),
  );
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.syllableToSound",
    promptParams: { left: consonant.glyph, right: item.glyph, glyph: syllable },
    correctChoice: literalChoice(reading),
    candidateChoices: candidateReadings,
    correctKey: "drill.hangul.feedback.correctSyllable",
    incorrectKey: "drill.hangul.feedback.incorrectSyllable",
    feedbackParams: { left: consonant.glyph, right: item.glyph, glyph: syllable, answer: reading },
  });
}

function buildHangulQuestionForItem(item) {
  if (item.category === "basicVowels") return buildVowelQuestion(item);
  if (item.category === "compoundVowels") return buildCompoundVowelQuestion(item);
  if (item.category === "basicConsonants") return buildConsonantQuestion(item);
  if (item.category === "firstSyllables") return buildSyllableQuestion(item);
  if (item.category === "aspirated") return buildAspiratedQuestion(item);
  if (item.category === "doubleConsonants") return buildDoubleConsonantQuestion(item);
  if (item.cluster) return buildDoubleBatchimQuestion(item);
  return buildSingleBatchimQuestion(item);
}

function generateHangulStepsFromPool(items, data) {
  const count = data.stepCount || Math.min(5, items.length);
  return selectHangulPracticeItems(items, count).map((item) => buildHangulQuestionForItem(item));
}

function town1ReviewItems() {
  const items = [];
  if (hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) items.push(...HANGUL_BASIC_VOWELS);
  if (hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) items.push(...HANGUL_BASIC_CONSONANTS);
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) items.push(...HANGUL_FIRST_SYLLABLES);
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) items.push(...HANGUL_ASPIRATED_SIGNS);
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) items.push(...HANGUL_DOUBLE_CONSONANTS);
  if (hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) items.push(...HANGUL_SINGLE_BATCHIM_ITEMS);
  if (hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) items.push(...HANGUL_DOUBLE_BATCHIM_ITEMS);
  return items.length ? items : HANGUL_BASIC_VOWELS;
}

function configureTown1HangulDrills() {
  Object.assign(DRILLS.town1FountainVowels, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_VOWELS, data),
  });
  Object.assign(DRILLS.town1BlackboardVowels, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_VOWELS, data),
  });
  Object.assign(DRILLS.town1FountainConsonants, {
    stepCount: 7,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1BlackboardConsonants, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1DeskSyllables, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_FIRST_SYLLABLES, data),
  });
  Object.assign(DRILLS.town1BlackboardSyllables, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_FIRST_SYLLABLES, data),
  });
  Object.assign(DRILLS.town1FountainAspirated, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_ASPIRATED_SIGNS, data),
  });
  Object.assign(DRILLS.town1BlackboardAspirated, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_ASPIRATED_SIGNS, data),
  });
  Object.assign(DRILLS.town1FountainDoubleConsonants, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1BlackboardDoubleConsonants, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1FountainBatchimSingle, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_SINGLE_BATCHIM_ITEMS, data),
  });
  Object.assign(DRILLS.town1FountainBatchimDouble, {
    stepCount: 3,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_BATCHIM_ITEMS, data),
  });
  Object.assign(DRILLS.town1FountainReview, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(town1ReviewItems(), data),
  });
}

configureTown1HangulDrills();

function wordPracticeScore(item) {
  const entry = wordProgressEntry(item.id);
  if (!entry?.seen) return -100;
  if (!entry.mastered) return entry.correct + entry.attempts * 0.25;
  return 100 + entry.correct + entry.attempts * 0.1;
}

function selectWordPracticeItems(items, count) {
  return shuffledCopy(items)
    .sort((left, right) => wordPracticeScore(left) - wordPracticeScore(right))
    .slice(0, Math.min(count, items.length));
}

function createGeneratedWordStep({ item, promptKey, promptParams, correctChoice, candidateChoices, feedbackParams }) {
  const choiceSet = createChoiceSet(correctChoice, candidateChoices, 4);
  return {
    promptKey,
    promptParams,
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: feedbackParams,
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: feedbackParams,
    wordIds: [item.id],
  };
}

function buildWordQuestion(item, pool) {
  const meaning = wordMeaning(item);
  const candidates = pool.filter((candidate) => candidate.id !== item.id);
  const showHangul = Math.random() < 0.5;

  if (showHangul) {
    return createGeneratedWordStep({
      item,
      promptKey: "drill.word.prompt.meaning",
      promptParams: { hangul: item.hangul },
      correctChoice: literalChoice(meaning),
      candidateChoices: candidates.map((candidate) => literalChoice(wordMeaning(candidate))),
      feedbackParams: { hangul: item.hangul, meaning },
    });
  }

  return createGeneratedWordStep({
    item,
    promptKey: "drill.word.prompt.hangul",
    promptParams: { meaning },
    correctChoice: literalChoice(item.hangul),
    candidateChoices: candidates.map((candidate) => literalChoice(candidate.hangul)),
    feedbackParams: { hangul: item.hangul, meaning },
  });
}

function generateWordStepsFromCategories(categoryIds, data) {
  const pool = categoryIds.flatMap((categoryId) => wordItemsByCategory(categoryId));
  if (!pool.length) return [];
  const count = data.stepCount || Math.min(5, pool.length);
  return selectWordPracticeItems(pool, count).map((item) => buildWordQuestion(item, pool));
}

const SINO_DIGIT_READINGS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const SINO_DIGIT_WORD_IDS = [null, "word.il", "word.i", "word.sam", "word.sa", "word.o2", "word.yuk", "word.chil", "word.pal", "word.gu"];
const SINO_UNITS = [
  [10000, "만", "word.man"],
  [1000, "천", "word.cheon"],
  [100, "백", "word.baek"],
  [10, "십", "word.sip"],
];
const PRICE_POOL = [100, 200, 300, 500, 700, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 7000, 7500, 8000, 9000, 10000, 12000, 15000, 20000, 23000, 30000, 50000];
const NATIVE_CONTRACTIONS = { "word.hana": "한", "word.dul": "두", "word.set": "세", "word.net": "네" };
const COUNT_NOUN_WORD_IDS = ["word.sagwa", "word.gyul", "word.podo", "word.banana", "word.ppang", "word.tteok", "word.gamja", "word.oi"];

function composeSinoReading(value) {
  let rest = value;
  let reading = "";
  const usedWordIds = new Set();

  for (const [unit, label, wordId] of SINO_UNITS) {
    const digit = Math.floor(rest / unit);
    if (digit > 0) {
      if (digit > 1) {
        reading += SINO_DIGIT_READINGS[digit];
        if (SINO_DIGIT_WORD_IDS[digit]) usedWordIds.add(SINO_DIGIT_WORD_IDS[digit]);
      }
      reading += label;
      usedWordIds.add(wordId);
      rest %= unit;
    }
  }
  if (rest > 0) {
    reading += SINO_DIGIT_READINGS[rest];
    if (SINO_DIGIT_WORD_IDS[rest]) usedWordIds.add(SINO_DIGIT_WORD_IDS[rest]);
  }

  return { reading, wordIds: [...usedWordIds] };
}

function formatPriceDigits(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buildSinoPriceStep() {
  const value = PRICE_POOL[Math.floor(Math.random() * PRICE_POOL.length)];
  const { reading, wordIds } = composeSinoReading(value);
  const distractorValues = shuffledCopy(PRICE_POOL.filter((candidate) => candidate !== value));
  const toReading = Math.random() < 0.5;

  if (toReading) {
    const choiceSet = createChoiceSet(
      literalChoice(reading),
      distractorValues.map((candidate) => literalChoice(composeSinoReading(candidate).reading)),
      4,
    );
    return {
      promptKey: "drill.word.prompt.priceToReading",
      promptParams: { value: formatPriceDigits(value) },
      choices: choiceSet.choices,
      answer: choiceSet.answer,
      correctKey: "drill.word.feedback.correct",
      correctParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
      incorrectKey: "drill.word.feedback.incorrect",
      incorrectParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
      wordIds,
    };
  }

  const choiceSet = createChoiceSet(
    literalChoice(`${formatPriceDigits(value)}원`),
    distractorValues.map((candidate) => literalChoice(`${formatPriceDigits(candidate)}원`)),
    4,
  );
  return {
    promptKey: "drill.word.prompt.readingToPrice",
    promptParams: { reading },
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
    wordIds,
  };
}

function buildNativeCountStep() {
  const nativePool = wordItemsByCategory("numbersNative");
  const numberItem = nativePool[Math.floor(Math.random() * nativePool.length)];
  const nounId = COUNT_NOUN_WORD_IDS[Math.floor(Math.random() * COUNT_NOUN_WORD_IDS.length)];
  const noun = WORD_ITEMS[nounId];
  const numberIndex = nativePool.indexOf(numberItem) + 1;
  const countForm = NATIVE_CONTRACTIONS[numberItem.id] || numberItem.hangul;
  const phrase = `${noun ? noun.hangul : "사과"} ${countForm} 개`;
  const digits = Array.from({ length: 10 }, (_, index) => String(index + 1));
  const choiceSet = createChoiceSet(
    literalChoice(String(numberIndex)),
    digits.filter((digit) => digit !== String(numberIndex)).map((digit) => literalChoice(digit)),
    4,
  );
  return {
    promptKey: "drill.word.prompt.countPhrase",
    promptParams: { phrase },
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: { hangul: phrase, meaning: String(numberIndex) },
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: { hangul: phrase, meaning: String(numberIndex) },
    wordIds: [numberItem.id, nounId, "word.gae"].filter((wordId) => WORD_ITEMS[wordId]),
  };
}

function generateSinoSteps(data) {
  const pool = wordItemsByCategory("numbersSino");
  const count = data.stepCount || 6;
  const queue = selectWordPracticeItems(pool, count);
  return Array.from({ length: count }, () => {
    if (Math.random() < 0.5 && queue.length) return buildWordQuestion(queue.shift(), pool);
    return buildSinoPriceStep();
  });
}

function generateNativeSteps(data) {
  const pool = wordItemsByCategory("numbersNative");
  const count = data.stepCount || 6;
  const queue = selectWordPracticeItems(pool, count);
  return Array.from({ length: count }, () => {
    if (Math.random() < 0.5 && queue.length) return buildWordQuestion(queue.shift(), pool);
    return buildNativeCountStep();
  });
}

function town3ReviewCategories() {
  const categories = ["position", "nature"];
  if (hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) categories.push("numbersSino");
  if (hasProgressFlag(TOWN3_FLAGS.nativeBoardRead)) categories.push("numbersNative");
  if (hasProgressFlag(TOWN3_FLAGS.counterBoardRead)) categories.push("counters");
  categories.push("shopping", "food", "colors", "people", "cafe");
  return categories;
}

function town2FinalStationsPassed() {
  return [
    TOWN2_FLAGS.identityPassed,
    TOWN2_FLAGS.lostFoundPassed,
    TOWN2_FLAGS.labelsPassed,
    TOWN2_FLAGS.actionsPassed,
    TOWN2_FLAGS.readingReviewPassed,
  ].every((flag) => hasProgressFlag(flag));
}

function resolveTown2RoadGuardConversation() {
  if (hasProgressFlag(TOWN2_FLAGS.finalBadgePassed)) {
    return ["npc.town2RoadGuard.badge1", "npc.town2RoadGuard.badge2"];
  }
  return ["npc.town2RoadGuard.noBadge1", "npc.town2RoadGuard.noBadge2"];
}

function resolveTown2CityLeaderConversation() {
  if (hasProgressFlag(TOWN2_FLAGS.finalBadgePassed)) {
    return ["npc.town2CityLeader.done1"];
  }
  if (town2FinalStationsPassed()) {
    return ["npc.town2CityLeader.ready1"];
  }
  return ["npc.town2CityLeader.intro1", "npc.town2CityLeader.intro2"];
}

function resolveTrail2KeeperConversation() {
  if (hasProgressFlag(TRAIL2_FLAGS.keyReturned)) {
    return ["npc.trail2Keeper.done1"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    setProgressFlag(TRAIL2_FLAGS.keyReturned);
    return ["npc.trail2Keeper.thanks1", "npc.trail2Keeper.thanks2"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted)) {
    return ["npc.trail2Keeper.hint1", "npc.trail2Keeper.hint2"];
  }
  setProgressFlag(TRAIL2_FLAGS.keyQuestStarted);
  return ["npc.trail2Keeper.start1", "npc.trail2Keeper.start2"];
}

function resolveTrail2KeyRockConversation() {
  if (!hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted) || hasProgressFlag(TRAIL2_FLAGS.keyReturned)) {
    return ["object.trail2KeyRock.idle"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    return ["object.trail2KeyRock.alreadyFound"];
  }
  setProgressFlag(TRAIL2_FLAGS.keyFound);
  return ["object.trail2KeyRock.found1", "object.trail2KeyRock.found2"];
}

function resolveTrail2EmptyRockConversation() {
  if (hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted) && !hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    return ["object.trail2EmptyRock.searching"];
  }
  return ["object.trail2EmptyRock.idle"];
}

function resolveTown3GrandmaConversation() {
  if (hasProgressFlag(TOWN3_FLAGS.shoppingListDone)) {
    return ["npc.town3Grandma.done1"];
  }
  return ["npc.town3Grandma.line1", "npc.town3Grandma.line2"];
}

function resolveTown3AbacusDrill() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return "town3SinoNumbers";
  if (!hasProgressFlag(TOWN3_FLAGS.nativeBoardRead)) return "town3SinoNumbers";
  if (!hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) return "town3NativeNumbers";
  return Math.random() < 0.5 ? "town3SinoNumbers" : "town3NativeNumbers";
}

function resolveTown3AbacusConversation() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) return ["object.town3AbacusDesk.locked"];
  return null;
}

function resolveTown3BlackboardDrill() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.sinoExamPassed)) return "town3SinoExam";
  if (!hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) return "town3NativeExam";
  return null;
}

function resolveTown3BlackboardConversation() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return ["object.town3PriceBlackboard.locked"];
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && !hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) {
    return ["object.town3PriceBlackboard.nextNative"];
  }
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) {
    return ["object.town3PriceBlackboard.done"];
  }
  return null;
}

function resolveTown3GuildLeaderConversation() {
  if (hasProgressFlag(TOWN3_FLAGS.numberBadgePassed)) {
    return ["npc.town3GuildLeader.done1"];
  }
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) {
    return ["npc.town3GuildLeader.ready1"];
  }
  return ["npc.town3GuildLeader.intro1", "npc.town3GuildLeader.intro2"];
}

function configureChapter3GeneratedDrills() {
  DRILLS.trail2MirrorVowels = {
    titleKey: "drill.trail2MirrorVowels.title",
    shuffleChoices: true,
    completionFlags: [TRAIL2_FLAGS.mirrorPracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_COMPOUND_VOWELS, data),
  };
  DRILLS.town3SinoNumbers = {
    titleKey: "drill.town3SinoNumbers.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.sinoPracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: generateSinoSteps,
  };
  DRILLS.town3NativeNumbers = {
    titleKey: "drill.town3NativeNumbers.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.nativePracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: generateNativeSteps,
  };
  DRILLS.town3SinoExam = {
    titleKey: "drill.town3SinoExam.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.sinoExamPassed],
    passCorrectCount: 6,
    stepCount: 7,
    generateSteps: generateSinoSteps,
  };
  DRILLS.town3NativeExam = {
    titleKey: "drill.town3NativeExam.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.nativeExamPassed],
    passCorrectCount: 6,
    stepCount: 7,
    generateSteps: generateNativeSteps,
  };
  DRILLS.town3MarketReview = {
    titleKey: "drill.town3MarketReview.title",
    shuffleChoices: true,
    stepCount: 6,
    generateSteps: (data) => generateWordStepsFromCategories(town3ReviewCategories(), data),
  };
  if (DRILLS.town3Prices) {
    Object.assign(DRILLS.town3Prices, {
      shuffleChoices: true,
      stepCount: 5,
      passCorrectCount: 4,
      generateSteps: (data) => Array.from({ length: data.stepCount || 5 }, () => buildSinoPriceStep()),
    });
  }
}

configureChapter3GeneratedDrills();

function selectDrillSteps(data) {
  if (typeof data.generateSteps === "function") return data.generateSteps(data);

  const steps = data.steps || [];
  const targetCount = Math.min(data.stepCount || steps.length, steps.length);
  if (targetCount <= 0) return [];

  const indexedSteps = steps.map((step, index) => ({ step, index }));
  const selected = [];
  const usedIndexes = new Set();
  const difficultyMix = data.difficultyMix || {};

  Object.entries(difficultyMix).forEach(([difficulty, count]) => {
    const candidates = shuffledCopy(
      indexedSteps.filter(({ step, index }) => step.difficulty === difficulty && !usedIndexes.has(index)),
    );

    candidates.slice(0, count).forEach(({ step, index }) => {
      selected.push(step);
      usedIndexes.add(index);
    });
  });

  if (selected.length < targetCount) {
    shuffledCopy(indexedSteps.filter(({ index }) => !usedIndexes.has(index)))
      .slice(0, targetCount - selected.length)
      .forEach(({ step, index }) => {
        selected.push(step);
        usedIndexes.add(index);
      });
  }

  return data.shuffleSteps === false ? selected : shuffledCopy(selected);
}

function prepareDrillStep(step, data) {
  const prepared = {
    ...step,
    choices: [...step.choices],
  };

  const shouldShuffleChoices = step.shuffleChoices ?? data.shuffleChoices;
  if (!shouldShuffleChoices) return prepared;

  const correctChoice = prepared.choices[prepared.answer];
  prepared.choices = shuffledCopy(prepared.choices);
  prepared.answer = prepared.choices.indexOf(correctChoice);

  return prepared;
}

function buildDrillRun(data) {
  return {
    ...data,
    steps: selectDrillSteps(data).map((step) => prepareDrillStep(step, data)),
  };
}

function createTileMap(width, height, fill = "grass") {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fill),
  );
}

function setMapTile(tileMap, x, y, type) {
  if (x < 0 || y < 0 || y >= tileMap.length || x >= tileMap[0].length) return;
  tileMap[y][x] = type;
}

function fillMapRect(tileMap, x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setMapTile(tileMap, xx, yy, type);
    }
  }
}

function createRouteTriggers({
  labelKey,
  fromX,
  toX,
  y,
  targetSceneId,
  targetX,
  targetY,
  targetDir,
  conversationKeys = null,
  requiredFlags = null,
  lockedConversationKeys = null,
}) {
  const centerX = Math.floor((fromX + toX) / 2);
  const triggers = [];

  for (let x = fromX; x <= toX; x += 1) {
    triggers.push({
      labelKey,
      x,
      y,
      solid: false,
      kind: "route",
      targetSceneId,
      targetX: targetX + (x - centerX),
      targetY,
      targetDir,
      conversationKeys,
      requiredFlags,
      lockedConversationKeys,
      hidden: x !== centerX,
    });
  }

  return triggers;
}

function createRectInteractions({
  labelKey,
  x,
  y,
  w,
  h,
  kind = "object",
  solid = true,
  conversationKeys = null,
  drillKey = null,
  drillResolver = null,
  conversationResolver = null,
  requiredFlags = null,
  lockedConversationKeys = null,
  studyBoardKey = null,
  studyBoardResolver = null,
  progressFlagOnStudyBoard = null,
  progressFlagsOnStudyBoardResolver = null,
}) {
  const interactions = [];

  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      interactions.push({
        labelKey,
        x: xx,
        y: yy,
        solid,
        kind,
        conversationKeys,
        drillKey,
        drillResolver,
        conversationResolver,
        requiredFlags,
        lockedConversationKeys,
        studyBoardKey,
        studyBoardResolver,
        progressFlagOnStudyBoard,
        progressFlagsOnStudyBoardResolver,
        hidden: true,
      });
    }
  }

  return interactions;
}

const map = createTileMap(WORLD_WIDTH, WORLD_HEIGHT, "grass");

const buildings = [
  {
    labelKey: "object.elementarySchool",
    sceneId: "elementarySchool",
    x: 3,
    y: 3,
    w: 9,
    h: 7,
    doorX: 7,
    doorY: 9,
    roof: "#c88942",
    trim: "#87542e",
  },
  {
    labelKey: "object.yourGuesthouse",
    sceneId: "yourGuesthouse",
    x: 5,
    y: 12,
    w: 6,
    h: 5,
    doorX: 7,
    doorY: 16,
    roof: COLORS.roofRed,
    trim: "#7d3137",
  },
  {
    labelKey: "object.rivalGuesthouse",
    sceneId: "rivalGuesthouse",
    x: 14,
    y: 12,
    w: 6,
    h: 5,
    doorX: 16,
    doorY: 16,
    roof: COLORS.roofBlue,
    trim: "#2e4e83",
  },
  {
    labelKey: "object.hanokTeaHouse",
    sceneId: "hanokTeaHouse",
    x: 27,
    y: 12,
    w: 7,
    h: 5,
    doorX: 30,
    doorY: 16,
    roof: COLORS.roofTeal,
    trim: "#287368",
  },
  {
    labelKey: "object.cornerMarket",
    sceneId: "cornerMarket",
    x: 29,
    y: 20,
    w: 7,
    h: 5,
    doorX: 32,
    doorY: 24,
    roof: COLORS.roofViolet,
    trim: "#5f4b86",
  },
  {
    labelKey: "object.travelCenter",
    sceneId: "travelCenter",
    x: 14,
    y: 4,
    w: 12,
    h: 7,
    doorX: 19,
    doorY: 10,
    roof: "#be6d39",
    trim: "#874a28",
    important: true,
  },
];

const townObjects = [
  { x: 13, y: 20, w: 3, h: 3, type: "soundFountain" },
  { x: 22, y: 19, w: 3, h: 1, type: "speechBench" },
];

const interactables = [
  { labelKey: "object.northRouteMarker", x: 22, y: 3, solid: true, kind: "sign" },
  { labelKey: "object.townWelcomeSign", x: 12, y: 21, solid: true, kind: "sign" },
  { labelKey: "object.beachNoticeBoard", x: 22, y: 25, solid: true, kind: "sign" },
  ...createRectInteractions({
    labelKey: "object.soundFountain",
    x: 13,
    y: 20,
    w: 3,
    h: 3,
    conversationKeys: ["object.soundFountain.line1"],
    drillResolver: resolveTown1FountainDrill,
    conversationResolver: resolveTown1FountainConversation,
  }),
  ...createRectInteractions({
    labelKey: "object.speechBench",
    x: 22,
    y: 19,
    w: 3,
    h: 1,
    conversationKeys: ["object.speechBench.line1"],
    drillKey: "sentenceBlocks",
  }),
  ...createRouteTriggers({
    labelKey: "object.routeNorth",
    fromX: 18,
    toX: 22,
    y: 0,
    targetSceneId: "trail1",
    targetX: 17,
    targetY: 52,
    targetDir: "up",
  }),
  { labelKey: "object.shoreline", x: 18, y: 27, solid: false, kind: "waterEdge" },
  ...buildings.map((building) => ({
    labelKey: `${building.labelKey}.door`,
    sceneId: building.sceneId,
    x: building.doorX,
    y: building.doorY,
    solid: false,
    kind: "door",
  })),
];

const npcs = [
  {
    nameKey: "npc.mina",
    x: 9,
    y: 21,
    dir: "down",
    nextTurn: 0,
    jacket: "#e48d3d",
    voiceGender: "female",
    voiceId: "mina",
    conversationPools: [
      ["npc.mina.line1", "npc.mina.line2"],
      ["npc.mina.pool2.line1", "npc.mina.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.joon",
    x: 24,
    y: 14,
    dir: "left",
    nextTurn: 0,
    jacket: "#4f8cc9",
    voiceGender: "male",
    voiceId: "joon",
    conversationPools: [
      ["npc.joon.line1", "npc.joon.line2"],
      ["npc.joon.pool2.line1", "npc.joon.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.sora",
    x: 35,
    y: 18,
    dir: "up",
    nextTurn: 0,
    jacket: "#8a6bb7",
    voiceGender: "female",
    voiceId: "sora",
    conversationPools: [
      ["npc.sora.line1", "npc.sora.line2"],
      ["npc.sora.pool2.line1", "npc.sora.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.mrHan",
    x: 17,
    y: 26,
    dir: "right",
    nextTurn: 0,
    jacket: "#497a4d",
    voiceGender: "male",
    voiceId: "mrHan",
    conversationPools: [
      ["npc.mrHan.line1", "npc.mrHan.line2"],
      ["npc.mrHan.pool2.line1", "npc.mrHan.pool2.line2"],
    ],
  },
];

const player = {
  tileX: 20,
  tileY: 18,
  px: 20 * TILE,
  py: 18 * TILE,
  dir: "down",
  moving: false,
  fromX: 20,
  fromY: 18,
  toX: 20,
  toY: 18,
  moveTime: 0,
  moveDuration: 0.145,
};

const movementInput = {
  held: new Set(),
  order: [],
  holdDelay: 0,
};

const scenes = {};
const SOLID_TILES = new Set([
  "water",
  "stone",
  "hedge",
  "tree",
  "ledge",
  "wall",
  "bed",
  "bookcase",
  "brochureRack",
  "chair",
  "counter",
  "cushion",
  "desk",
  "fish",
  "fridge",
  "mapBoard",
  "produce",
  "sink",
  "stove",
  "supplyShelf",
  "table",
  "teaTable",
  "tv",
]);

let currentSceneId = "town";
let cameraX = 0;
let cameraY = 0;
let dialog = null;
let drill = null;
let studyBoard = null;
let lastTime = performance.now();
let speechRetryTimer = null;

function activeLanguage() {
  return ui.translationHeld ? settings.secondary : settings.primary;
}

function t(key, params = {}, language = activeLanguage()) {
  const fallback = TEXT.en[key] || key;
  const template = TEXT[language]?.[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, paramKey) => params[paramKey] ?? "");
}

function uiText(ref, params = {}) {
  if (!ref) return "";
  if (typeof ref === "string") return t(ref, params);
  return t(ref.key, ref.params || params);
}

function languageName(code) {
  const language = LANGUAGES.find((candidate) => candidate.code === code);
  return language ? t(language.key) : code;
}

function textToSpeech() {
  return window.KOREA_ADVENTURE_TTS;
}

function speechSupported() {
  return !!textToSpeech()?.supported();
}

function speechLanguageOptions() {
  return textToSpeech()?.languageOptions(LANGUAGES) || [];
}

function normalizeSpeechLanguage() {
  return !!textToSpeech()?.normalizeLanguage(settings, LANGUAGES);
}

function speechLanguageName() {
  if (!normalizeSpeechLanguage()) return t("settings.speechUnavailable");
  return languageName(settings.speech);
}

function cycleSpeechLanguage(delta) {
  textToSpeech()?.cycleLanguage(settings, LANGUAGES, delta);
}

function speakDialogLine() {
  if (!dialog?.spoken) return;
  if (!speechSupported() || !normalizeSpeechLanguage()) {
    dialog.textVisible = true;
    dialog.speaking = false;
    return;
  }

  const text = dialogLineText(settings.speech);
  if (!text) {
    dialog.textVisible = true;
    dialog.speaking = false;
    return;
  }

  if (!textToSpeech().voices().length && !dialog.voiceRetry) {
    dialog.voiceRetry = true;
    clearTimeout(speechRetryTimer);
    speechRetryTimer = setTimeout(() => speakDialogLine(), 180);
    return;
  }

  dialog.voiceRetry = false;
  dialog.textVisible = false;
  dialog.speaking = true;
  dialog.speechToken = (dialog.speechToken || 0) + 1;
  const speechToken = dialog.speechToken;

  textToSpeech().speak({
    text,
    languageCode: settings.speech,
    voiceProfile: dialog.voiceProfile,
    onComplete: () => finishDialogSpeech(speechToken),
  });
}

function finishDialogSpeech(speechToken) {
  if (!dialog || dialog.speechToken !== speechToken) return;
  dialog.textVisible = true;
  dialog.speaking = false;
}

function stopSpeech() {
  clearTimeout(speechRetryTimer);
  textToSpeech()?.stop();
}

function musicTrack(key) {
  if (!key || !(key in MUSIC_TRACKS) || typeof Audio === "undefined") return null;

  if (!musicState.tracks[key]) {
    const track = new Audio(MUSIC_TRACKS[key]);
    track.loop = true;
    track.preload = "auto";
    track.volume = musicState.volume;
    musicState.tracks[key] = track;
  }

  return musicState.tracks[key];
}

function unlockMusic() {
  if (musicState.unlocked) return;
  musicState.unlocked = true;
  updateMusicForScene();
}

function updateMusicForScene() {
  if (!musicState.unlocked || ui.quit) return;

  const key = currentScene().musicKey;
  if (!key || key === musicState.currentKey) return;

  pauseCurrentMusic();

  const nextTrack = musicTrack(key);
  if (!nextTrack) return;

  musicState.currentKey = key;
  nextTrack.currentTime = 0;
  nextTrack.volume = musicState.volume;

  const playPromise = nextTrack.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      if (musicState.currentKey === key) musicState.currentKey = null;
      musicState.unlocked = false;
    });
  }
}

function pauseCurrentMusic() {
  if (!musicState.currentKey) return;

  const currentTrack = musicTrack(musicState.currentKey);
  if (currentTrack) {
    currentTrack.pause();
    currentTrack.currentTime = 0;
  }

  musicState.currentKey = null;
}

function currentScene() {
  return scenes[currentSceneId] || scenes.town;
}

function currentHeldDirection() {
  for (let i = movementInput.order.length - 1; i >= 0; i -= 1) {
    const code = movementInput.order[i];
    if (movementInput.held.has(code)) return keyToDir[code];
  }
  return null;
}

function clearMovementInput() {
  movementInput.held.clear();
  movementInput.order = [];
  movementInput.holdDelay = 0;
}

function setPlayerTile(x, y, dirName) {
  player.tileX = x;
  player.tileY = y;
  player.px = x * TILE;
  player.py = y * TILE;
  player.fromX = x;
  player.fromY = y;
  player.toX = x;
  player.toY = y;
  player.moveTime = 0;
  player.moving = false;
  player.dir = dirName;
}

function changeScene(sceneId, x, y, dirName) {
  scheduleSave();
  stopSpeech();
  currentSceneId = sceneId;
  if (sceneId === "elementarySchool") setProgressFlag(TOWN1_FLAGS.schoolEntered);
  dialog = null;
  studyBoard = null;
  ui.menuOpen = false;
  ui.quit = false;
  clearMovementInput();
  setPlayerTile(x, y, dirName);
  updateMusicForScene();
}

function setTile(x, y, type) {
  if (x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) return;
  map[y][x] = type;
}

function fillRectTiles(x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setTile(xx, yy, type);
    }
  }
}

function buildMap() {
  for (let x = 0; x < WORLD_WIDTH; x += 1) {
    setTile(x, 0, "stone");
    setTile(x, WORLD_HEIGHT - 1, "water");
  }

  for (let y = 0; y < WORLD_HEIGHT; y += 1) {
    setTile(0, y, "stone");
    setTile(WORLD_WIDTH - 1, y, "stone");
  }

  for (let x = 18; x <= 22; x += 1) {
    setTile(x, 0, "path");
    setTile(x, 1, "path");
    setTile(x, 2, "path");
  }

  fillRectTiles(18, 0, 5, 13, "path");
  fillRectTiles(11, 16, 19, 3, "path");
  fillRectTiles(18, 10, 3, 16, "path");
  fillRectTiles(6, 17, 6, 2, "path");
  fillRectTiles(15, 17, 6, 2, "path");
  fillRectTiles(28, 17, 5, 2, "path");
  fillRectTiles(31, 18, 3, 8, "path");
  fillRectTiles(13, 24, 19, 2, "path");

  fillRectTiles(1, 27, WORLD_WIDTH - 2, 7, "water");
  fillRectTiles(1, 25, WORLD_WIDTH - 2, 2, "sand");
  fillRectTiles(16, 25, 7, 2, "path");

  for (let x = 2; x < WORLD_WIDTH - 2; x += 1) {
    if (x < 17 || x > 23) setTile(x, 1, "hedge");
  }

  for (let y = 2; y < 25; y += 1) {
    if (y !== 13 && y !== 18) {
      setTile(1, y, "hedge");
      setTile(WORLD_WIDTH - 2, y, "hedge");
    }
  }

  const treeSpots = [
    [3, 4],
    [5, 4],
    [8, 5],
    [34, 4],
    [36, 5],
    [38, 7],
    [4, 9],
    [37, 10],
    [3, 19],
    [5, 22],
    [37, 23],
    [35, 26],
    [7, 26],
  ];
  for (const [x, y] of treeSpots) setTile(x, y, "tree");

  const flowerSpots = [
    [7, 8],
    [8, 8],
    [9, 8],
    [28, 7],
    [29, 7],
    [30, 7],
    [25, 21],
    [26, 21],
    [26, 22],
    [10, 24],
    [11, 24],
    [36, 14],
    [36, 15],
  ];
  for (const [x, y] of flowerSpots) setTile(x, y, "flowers");

  const ledges = [
    [3, 11],
    [4, 11],
    [5, 11],
    [12, 9],
    [13, 9],
    [26, 10],
    [27, 10],
    [34, 11],
    [35, 11],
    [23, 23],
    [24, 23],
    [25, 23],
  ];
  for (const [x, y] of ledges) setTile(x, y, "ledge");

  setTile(7, 9, "path");
  fillRectTiles(6, 10, 8, 2, "path");
  fillRectTiles(13, 11, 6, 1, "path");
}

function buildScenes() {
  scenes.town = {
    id: "town",
    kind: "outdoor",
    map,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    buildings,
    objects: townObjects,
    interactables,
    npcs,
    areaKey: "area.haneulTown",
    musicKey: "town1",
  };

  scenes.trail1 = createTrail1Scene();
  scenes.town2 = createTown2Scene();
  scenes.trail2 = createTrail2Scene();
  scenes.town3 = createTown3Scene();

  Object.assign(scenes, createInteriorScenes());
  Object.assign(scenes, createTown2InteriorScenes(scenes.town2.buildings));
  Object.assign(scenes, createTown3InteriorScenes(scenes.town3.buildings));
}

function buildTown2Map(town2Map, width, height) {
  for (let x = 0; x < width; x += 1) {
    setMapTile(town2Map, x, 0, "stone");
    setMapTile(town2Map, x, height - 1, "stone");
  }

  for (let y = 0; y < height; y += 1) {
    setMapTile(town2Map, 0, y, "stone");
    setMapTile(town2Map, width - 1, y, "stone");
  }

  const pathRects = [
    [22, 8, 5, 30],
    [10, 8, 33, 4],
    [15, 15, 18, 10],
    [4, 17, 18, 4],
    [26, 17, 18, 4],
    [5, 27, 22, 5],
    [33, 23, 11, 9],
    [38, 0, 5, 12],
    [8, 7, 3, 2],
    [9, 16, 3, 2],
    [8, 26, 3, 2],
    [36, 15, 3, 3],
    [17, 29, 3, 5],
    [37, 7, 3, 2],
  ];
  for (const rect of pathRects) fillMapRect(town2Map, ...rect, "path");

  fillMapRect(town2Map, 22, height - 1, 5, 1, "path");
  fillMapRect(town2Map, 38, 0, 5, 1, "path");

  const tallGrassPatches = [
    [6, 32, 11, 4],
    [2, 28, 5, 3],
    [28, 29, 5, 5],
  ];
  for (const patch of tallGrassPatches) fillMapRect(town2Map, ...patch, "tallGrass");

  fillMapRect(town2Map, 42, 32, 3, 3, "water");

  const hedgeSpots = [
    [2, 1], [3, 1], [4, 1], [12, 1], [13, 1], [33, 1], [34, 1],
    [45, 2], [45, 3], [45, 4], [45, 5], [2, 12], [2, 13], [2, 14],
    [45, 14], [45, 15], [45, 16], [2, 22], [2, 23], [2, 24],
    [45, 24], [45, 25], [45, 26], [18, 35], [19, 35], [28, 35], [29, 35],
  ];
  for (const [x, y] of hedgeSpots) setMapTile(town2Map, x, y, "hedge");

  const treeSpots = [
    [2, 3], [3, 5], [4, 3], [2, 6], [44, 6], [45, 8],
    [3, 31], [4, 34], [2, 35], [44, 29], [46, 31], [45, 35],
  ];
  for (const [x, y] of treeSpots) setMapTile(town2Map, x, y, "tree");

  const flowerSpots = [
    [14, 13], [15, 13], [16, 13], [31, 13], [32, 13],
    [13, 16], [34, 16], [14, 24], [33, 24], [21, 26],
    [22, 26], [27, 26], [28, 26], [35, 22], [36, 22],
    [41, 22], [42, 22], [36, 33], [37, 33], [39, 33],
  ];
  for (const [x, y] of flowerSpots) setMapTile(town2Map, x, y, "flowers");

  const ledges = [
    [6, 34], [7, 34], [16, 30], [27, 14], [28, 14], [29, 14],
    [43, 12], [44, 12], [30, 34], [31, 34],
  ];
  for (const [x, y] of ledges) setMapTile(town2Map, x, y, "ledge");
}

function createTown2Scene() {
  const width = 48;
  const height = 38;
  const town2Map = createTileMap(width, height, "grass");

  buildTown2Map(town2Map, width, height);

  const town2Buildings = [
    {
      labelKey: "object.town2CityHall",
      sceneId: "town2CityHall",
      x: 15,
      y: 2,
      w: 18,
      h: 7,
      doorX: 24,
      doorY: 8,
      roof: "#be6d39",
      trim: "#874a28",
      important: true,
    },
    {
      labelKey: "object.town2ReviewLibrary",
      sceneId: "town2ReviewLibrary",
      x: 5,
      y: 2,
      w: 8,
      h: 6,
      doorX: 9,
      doorY: 7,
      roof: COLORS.roofTeal,
      trim: "#287368",
    },
    {
      labelKey: "object.town2InfoCenter",
      sceneId: "town2InfoCenter",
      x: 5,
      y: 11,
      w: 10,
      h: 6,
      doorX: 10,
      doorY: 16,
      roof: COLORS.roofBlue,
      trim: "#2e4e83",
    },
    {
      labelKey: "object.town2LostFound",
      sceneId: "town2LostFound",
      x: 4,
      y: 22,
      w: 10,
      h: 5,
      doorX: 9,
      doorY: 26,
      roof: COLORS.roofViolet,
      trim: "#5f4b86",
    },
    {
      labelKey: "object.town2LabelMuseum",
      sceneId: "town2LabelMuseum",
      x: 32,
      y: 10,
      w: 11,
      h: 6,
      doorX: 37,
      doorY: 15,
      roof: COLORS.roofRed,
      trim: "#7d3137",
    },
    {
      labelKey: "object.town2Guesthouse",
      sceneId: "town2Guesthouse",
      x: 15,
      y: 25,
      w: 7,
      h: 5,
      doorX: 18,
      doorY: 29,
      roof: "#d18a3f",
      trim: "#8a5624",
    },
    {
      labelKey: "object.town2EastResidence",
      sceneId: "town2EastResidence",
      x: 34,
      y: 3,
      w: 7,
      h: 5,
      doorX: 37,
      doorY: 7,
      roof: "#6a9a72",
      trim: "#3f6948",
    },
  ];

  const town2Objects = [
    { x: 18, y: 19, w: 3, h: 2, type: "trailRestTable" },
    { x: 29, y: 19, w: 3, h: 2, type: "routeObjectStall" },
    { x: 17, y: 23, w: 3, h: 1, type: "speechBench" },
    { x: 7, y: 31, w: 3, h: 2, type: "trailRestTable" },
  ];

  const town2Interactables = [
    {
      labelKey: "object.town2WelcomeSign",
      x: 24,
      y: 34,
      solid: true,
      kind: "sign",
      conversationKeys: ["sign.town2Welcome.line1", "sign.town2Welcome.line2"],
    },
    {
      labelKey: "object.town2CentralReviewBoard",
      x: 16,
      y: 17,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2CentralReviewBoard.line1"],
      drillKey: "town2MixedReview",
    },
    {
      labelKey: "object.town2DistanceNear",
      x: 21,
      y: 22,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceNear.line1"],
    },
    {
      labelKey: "object.town2DistanceMiddle",
      x: 26,
      y: 18,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceMiddle.line1"],
    },
    {
      labelKey: "object.town2DistanceFar",
      x: 31,
      y: 16,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceFar.line1"],
    },
    {
      labelKey: "object.town2ActionParkBoard",
      x: 34,
      y: 24,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2ActionParkBoard.line1"],
      drillKey: "town2ActionPark",
    },
    {
      labelKey: "object.town2Trail2GateSign",
      x: 42,
      y: 3,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2Trail2GateSign.line1"],
    },
    ...createRectInteractions({
      labelKey: "object.town2ReviewTable",
      x: 18,
      y: 19,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2ReviewTable.line1"],
      drillKey: "town2MixedReview",
    }),
    ...createRectInteractions({
      labelKey: "object.town2ObjectLabelStall",
      x: 29,
      y: 19,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2ObjectLabelStall.line1"],
      drillKey: "town2DistanceLabels",
    }),
    ...createRectInteractions({
      labelKey: "object.town2SpeechBench",
      x: 17,
      y: 23,
      w: 3,
      h: 1,
      conversationKeys: ["object.town2SpeechBench.line1"],
      drillKey: "town2MixedReview",
    }),
    ...createRectInteractions({
      labelKey: "object.town2SearchBasket",
      x: 7,
      y: 31,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2SearchBasket.line1"],
      drillKey: "town2LostFound",
    }),
    {
      labelKey: "object.town2HiddenBookSpot",
      x: 8,
      y: 33,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenBookSpot.line1"],
      hidden: true,
    },
    {
      labelKey: "object.town2HiddenWaterSpot",
      x: 12,
      y: 34,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenWaterSpot.line1"],
      hidden: true,
    },
    {
      labelKey: "object.town2HiddenBagSpot",
      x: 15,
      y: 32,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenBagSpot.line1"],
      hidden: true,
    },
    ...createRouteTriggers({
      labelKey: "object.routeSouth",
      fromX: 22,
      toX: 26,
      y: height - 1,
      targetSceneId: "trail1",
      targetX: 17,
      targetY: 1,
      targetDir: "down",
    }),
    ...createRouteTriggers({
      labelKey: "object.routeTrail2",
      fromX: 38,
      toX: 42,
      y: 0,
      targetSceneId: "trail2",
      targetX: 17,
      targetY: 52,
      targetDir: "up",
      conversationKeys: ["route.trail2.pending"],
      requiredFlags: [TOWN2_FLAGS.finalBadgePassed],
      lockedConversationKeys: ["route.trail2.locked"],
    }),
    ...town2Buildings.map((building) => ({
      labelKey: `${building.labelKey}.door`,
      sceneId: building.sceneId,
      x: building.doorX,
      y: building.doorY,
      solid: false,
      kind: "door",
    })),
  ];

  const town2Npcs = [
    {
      nameKey: "npc.town2GateGreeter",
      x: 24,
      y: 35,
      dir: "down",
      nextTurn: 0,
      jacket: "#4f8cc9",
      voiceGender: "female",
      voiceId: "town2GateGreeter",
      conversationPools: [
        ["npc.town2GateGreeter.line1", "npc.town2GateGreeter.line2"],
        ["npc.town2GateGreeter.pool2.line1", "npc.town2GateGreeter.pool2.line2"],
      ],
      progressFlagOnTalk: TOWN2_FLAGS.arrived,
    },
    {
      nameKey: "npc.town2PlazaGuide",
      x: 20,
      y: 17,
      dir: "down",
      nextTurn: 0,
      jacket: "#a65d3e",
      voiceGender: "male",
      voiceId: "town2PlazaGuide",
      conversationResolver: () => chapterGuideLines("town2", "npc.town2PlazaGuide.line1"),
    },
    {
      nameKey: "npc.town2ReviewClerk",
      x: 18,
      y: 22,
      dir: "up",
      nextTurn: 0,
      jacket: "#6c9a50",
      voiceGender: "female",
      voiceId: "town2ReviewClerk",
      conversationPools: [
        ["npc.town2ReviewClerk.line1", "npc.town2ReviewClerk.line2"],
        ["npc.town2ReviewClerk.pool2.line1", "npc.town2ReviewClerk.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town2LabelRunner",
      x: 30,
      y: 22,
      dir: "left",
      nextTurn: 0,
      jacket: "#8a6bb7",
      voiceGender: "female",
      voiceId: "town2LabelRunner",
      conversationPools: [
        ["npc.town2LabelRunner.line1", "npc.town2LabelRunner.line2"],
        ["npc.town2LabelRunner.pool2.line1", "npc.town2LabelRunner.pool2.line2"],
      ],
      wander: true,
    },
    {
      nameKey: "npc.town2LostChild",
      x: 11,
      y: 28,
      dir: "down",
      nextTurn: 0,
      jacket: "#e2a843",
      voiceGender: "female",
      voiceId: "town2LostChild",
      conversationKeys: ["npc.town2LostChild.line1", "npc.town2LostChild.line2"],
      kind: "child",
    },
    {
      nameKey: "npc.town2ActionCoach",
      x: 36,
      y: 24,
      dir: "down",
      nextTurn: 0,
      jacket: "#497a4d",
      voiceGender: "male",
      voiceId: "town2ActionCoach",
      conversationPools: [
        ["npc.town2ActionCoach.line1", "npc.town2ActionCoach.line2"],
        ["npc.town2ActionCoach.pool2.line1", "npc.town2ActionCoach.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town2ReaderActor",
      x: 37,
      y: 29,
      dir: "left",
      nextTurn: 0,
      jacket: "#3f7fb1",
      voiceGender: "male",
      voiceId: "town2ReaderActor",
      conversationKeys: ["npc.town2ReaderActor.line1", "npc.town2ReaderActor.line2"],
    },
    {
      nameKey: "npc.town2WaterActor",
      x: 41,
      y: 27,
      dir: "left",
      nextTurn: 0,
      jacket: "#4c8f95",
      voiceGender: "female",
      voiceId: "town2WaterActor",
      conversationKeys: ["npc.town2WaterActor.line1", "npc.town2WaterActor.line2"],
      wander: true,
    },
    {
      nameKey: "npc.town2AppleActor",
      x: 35,
      y: 31,
      dir: "right",
      nextTurn: 0,
      jacket: "#b56b84",
      voiceGender: "female",
      voiceId: "town2AppleActor",
      conversationKeys: ["npc.town2AppleActor.line1", "npc.town2AppleActor.line2"],
    },
    {
      nameKey: "npc.town2WriterActor",
      x: 40,
      y: 31,
      dir: "up",
      nextTurn: 0,
      jacket: "#bd6e48",
      voiceGender: "male",
      voiceId: "town2WriterActor",
      conversationKeys: ["npc.town2WriterActor.line1", "npc.town2WriterActor.line2"],
    },
    {
      nameKey: "npc.town2RoadGuard",
      x: 42,
      y: 4,
      dir: "down",
      nextTurn: 0,
      jacket: "#5f7f9a",
      voiceGender: "male",
      voiceId: "town2RoadGuard",
      conversationResolver: resolveTown2RoadGuardConversation,
    },
    {
      nameKey: "npc.town2Resident",
      x: 35,
      y: 8,
      dir: "down",
      nextTurn: 0,
      jacket: "#b65c7a",
      voiceGender: "female",
      voiceId: "town2Resident",
      conversationPools: [
        ["npc.town2Resident.line1", "npc.town2Resident.line2"],
        ["npc.town2Resident.pool2.line1", "npc.town2Resident.pool2.line2"],
      ],
      wander: true,
    },
  ];

  return {
    id: "town2",
    kind: "outdoor",
    map: town2Map,
    width,
    height,
    buildings: town2Buildings,
    objects: town2Objects,
    interactables: town2Interactables,
    npcs: town2Npcs,
    areaKey: "area.town2",
    musicKey: "town2",
  };
}

function createTrail1Scene() {
  const width = 34;
  const height = 54;
  const trailMap = createTileMap(width, height, "grass");

  fillMapRect(trailMap, 0, 35, width, 3, "water");

  const tallGrassPatches = [
    [4, 43, 7, 5],
    [22, 39, 7, 6],
    [4, 25, 7, 8],
    [23, 27, 6, 5],
    [5, 10, 6, 5],
    [22, 5, 7, 6],
  ];
  for (const patch of tallGrassPatches) fillMapRect(trailMap, ...patch, "tallGrass");

  const pathRects = [
    [15, 49, 5, 5],
    [14, 42, 5, 8],
    [10, 39, 9, 4],
    [9, 30, 5, 10],
    [9, 30, 12, 4],
    [18, 24, 5, 9],
    [18, 21, 10, 4],
    [24, 14, 4, 9],
    [14, 12, 14, 4],
    [13, 6, 5, 8],
    [15, 0, 5, 7],
  ];
  for (const rect of pathRects) fillMapRect(trailMap, ...rect, "path");
  fillMapRect(trailMap, 9, 35, 5, 3, "bridge");

  for (let x = 0; x < width; x += 1) {
    if (x < 15 || x > 19) setMapTile(trailMap, x, 0, "tree");
    if (x < 15 || x > 19) setMapTile(trailMap, x, height - 1, "tree");
  }

  for (let y = 1; y < height - 1; y += 1) {
    setMapTile(trailMap, 0, y, "tree");
    setMapTile(trailMap, width - 1, y, "tree");
    if (y % 4 !== 0) {
      setMapTile(trailMap, 1, y, "hedge");
      setMapTile(trailMap, width - 2, y, "hedge");
    }
  }

  const treeSpots = [
    [3, 3],
    [6, 4],
    [28, 14],
    [30, 16],
    [3, 18],
    [6, 20],
    [28, 22],
    [30, 25],
    [4, 39],
    [6, 41],
    [27, 47],
    [30, 49],
  ];
  for (const [x, y] of treeSpots) setMapTile(trailMap, x, y, "tree");

  const ledges = [
    [5, 18],
    [6, 18],
    [7, 18],
    [8, 18],
    [20, 18],
    [21, 18],
    [22, 18],
    [23, 18],
    [24, 44],
    [25, 44],
    [26, 44],
    [27, 44],
  ];
  for (const [x, y] of ledges) setMapTile(trailMap, x, y, "ledge");

  const flowerSpots = [
    [7, 7],
    [8, 7],
    [25, 9],
    [26, 9],
    [5, 29],
    [6, 29],
    [24, 31],
    [25, 31],
    [28, 40],
    [29, 40],
  ];
  for (const [x, y] of flowerSpots) setMapTile(trailMap, x, y, "flowers");

  return {
    id: "trail1",
    kind: "outdoor",
    map: trailMap,
    width,
    height,
    buildings: [],
    objects: [
      { x: 9, y: 35, w: 5, h: 3, type: "trailBridge" },
      { x: 14, y: 0, w: 7, h: 2, type: "trailGate" },
      { x: 24, y: 26, w: 3, h: 2, type: "trailRestTable" },
      { x: 22, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    ],
    interactables: [
      { labelKey: "object.trailSouthSign", x: 20, y: 50, solid: true, kind: "sign", conversationKeys: ["sign.trailSouth.line1"] },
      { labelKey: "object.creekSign", x: 15, y: 33, solid: true, kind: "sign", conversationKeys: ["sign.creek.line1"], drillKey: "batchimBridge" },
      { labelKey: "object.trailNorthSign", x: 20, y: 3, solid: true, kind: "sign", conversationKeys: ["sign.trailNorth.line1"] },
      { labelKey: "object.nameCardBoard", x: 8, y: 31, solid: true, kind: "sign", conversationKeys: ["object.nameCardBoard.line1"], drillKey: "routeNames" },
      { labelKey: "object.actionPracticeSign", x: 23, y: 16, solid: true, kind: "sign", conversationKeys: ["object.actionPracticeSign.line1"], drillKey: "actionPath" },
      ...createRectInteractions({
        labelKey: "object.trailRestTable",
        x: 24,
        y: 26,
        w: 3,
        h: 2,
        conversationKeys: ["object.trailRestTable.line1"],
        drillKey: "presenceCheck",
      }),
      ...createRectInteractions({
        labelKey: "object.routeObjectStall",
        x: 22,
        y: 20,
        w: 3,
        h: 2,
        conversationKeys: ["object.routeObjectStall.line1"],
        drillKey: "objectLabels",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeSouth",
        fromX: 15,
        toX: 19,
        y: height - 1,
        targetSceneId: "town",
        targetX: 20,
        targetY: 1,
        targetDir: "down",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeTown2",
        fromX: 15,
        toX: 19,
        y: 0,
        targetSceneId: "town2",
        targetX: 24,
        targetY: 36,
        targetDir: "up",
        conversationKeys: ["route.town2.pending"],
      }),
    ],
    npcs: [
      {
        nameKey: "npc.trailKeeper",
        x: 8,
        y: 22,
        dir: "right",
        nextTurn: 0,
        jacket: "#a6633f",
        voiceGender: "male",
        voiceId: "trailKeeper",
        conversationPools: [
          ["npc.trailKeeper.line1", "npc.trailKeeper.line2"],
          ["npc.trailKeeper.pool2.line1", "npc.trailKeeper.pool2.line2"],
        ],
      },
    ],
    areaKey: "area.haneulTrail",
    musicKey: "trail1",
  };
}

function createTrail2Scene() {
  const width = 34;
  const height = 54;
  const trailMap = createTileMap(width, height, "grass");

  fillMapRect(trailMap, 15, 46, 5, 8, "path");
  fillMapRect(trailMap, 12, 40, 8, 6, "path");
  fillMapRect(trailMap, 12, 34, 5, 6, "path");
  fillMapRect(trailMap, 6, 26, 14, 8, "sand");
  fillMapRect(trailMap, 16, 20, 3, 8, "path");
  fillMapRect(trailMap, 16, 8, 3, 12, "path");
  fillMapRect(trailMap, 15, 1, 5, 9, "path");

  fillMapRect(trailMap, 24, 14, 7, 5, "water");
  fillMapRect(trailMap, 4, 12, 6, 6, "tallGrass");
  fillMapRect(trailMap, 22, 30, 6, 4, "tallGrass");
  fillMapRect(trailMap, 25, 44, 5, 4, "flowers");

  for (let x = 0; x < width; x += 1) {
    if (x < 15 || x > 19) {
      setMapTile(trailMap, x, 0, "tree");
      setMapTile(trailMap, x, height - 1, "tree");
    }
  }
  for (let y = 1; y < height - 1; y += 1) {
    setMapTile(trailMap, 0, y, "tree");
    setMapTile(trailMap, width - 1, y, "tree");
  }

  const treeSpots = [
    [4, 6], [8, 5], [24, 6], [28, 8], [6, 21], [26, 24],
    [4, 40], [7, 44], [26, 36], [29, 40], [10, 48], [24, 50],
  ];
  for (const [x, y] of treeSpots) setMapTile(trailMap, x, y, "tree");

  setMapTile(trailMap, 5, 30, "stone");
  setMapTile(trailMap, 8, 35, "stone");
  setMapTile(trailMap, 19, 31, "stone");

  return {
    id: "trail2",
    kind: "outdoor",
    map: trailMap,
    width,
    height,
    buildings: [],
    objects: [
      { x: 10, y: 28, w: 3, h: 2, type: "soundFountain" },
      { x: 25, y: 40, w: 3, h: 2, type: "trailRestTable" },
      { x: 13, y: 1, w: 9, h: 2, type: "trailGate" },
    ],
    interactables: [
      {
        labelKey: "object.trail2MirrorBoard",
        x: 15,
        y: 27,
        solid: true,
        kind: "sign",
        studyBoardKey: "compoundVowels",
        progressFlagOnStudyBoard: TRAIL2_FLAGS.mirrorBoardRead,
      },
      ...createRectInteractions({
        labelKey: "object.trail2MirrorPool",
        x: 10,
        y: 28,
        w: 3,
        h: 2,
        conversationKeys: ["object.trail2MirrorPool.locked"],
        drillResolver: () => (hasProgressFlag(TRAIL2_FLAGS.mirrorBoardRead) ? "trail2MirrorVowels" : null),
      }),
      {
        labelKey: "object.trail2LocationPost",
        x: 14,
        y: 41,
        solid: true,
        kind: "sign",
        conversationKeys: ["object.trail2LocationPost.line1"],
        drillKey: "trail2LocationPosts",
      },
      {
        labelKey: "object.trail2EchoSign",
        x: 23,
        y: 21,
        solid: true,
        kind: "sign",
        conversationKeys: ["object.trail2EchoSign.line1"],
        drillKey: "trail2EchoTwins",
      },
      {
        labelKey: "object.trail2KeyRock",
        x: 5,
        y: 30,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2KeyRockConversation,
      },
      {
        labelKey: "object.trail2EmptyRock",
        x: 8,
        y: 35,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2EmptyRockConversation,
      },
      {
        labelKey: "object.trail2EmptyRock",
        x: 19,
        y: 31,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2EmptyRockConversation,
      },
      ...createRectInteractions({
        labelKey: "object.trailRestTable",
        x: 25,
        y: 40,
        w: 3,
        h: 2,
        conversationKeys: ["object.trailRestTable.line1"],
      }),
      {
        labelKey: "object.trail2SouthSign",
        x: 20,
        y: 50,
        solid: true,
        kind: "sign",
        conversationKeys: ["sign.trail2South.line1"],
      },
      {
        labelKey: "object.trail2NorthSign",
        x: 20,
        y: 4,
        solid: true,
        kind: "sign",
        conversationKeys: ["sign.trail2North.line1"],
      },
      ...createRouteTriggers({
        labelKey: "object.routeSouth",
        fromX: 15,
        toX: 19,
        y: height - 1,
        targetSceneId: "town2",
        targetX: 40,
        targetY: 1,
        targetDir: "down",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeTown3",
        fromX: 15,
        toX: 19,
        y: 0,
        targetSceneId: "town3",
        targetX: 24,
        targetY: 37,
        targetDir: "up",
      }),
    ],
    npcs: [
      {
        nameKey: "npc.trail2Keeper",
        x: 8,
        y: 27,
        dir: "down",
        nextTurn: 0,
        jacket: "#7a6093",
        voiceGender: "female",
        voiceId: "trail2Keeper",
        conversationResolver: resolveTrail2KeeperConversation,
      },
      {
        nameKey: "npc.trail2EchoTwinA",
        x: 22,
        y: 22,
        dir: "right",
        nextTurn: 0,
        jacket: "#4f8cc9",
        voiceGender: "female",
        voiceId: "trail2EchoTwinA",
        kind: "child",
        conversationKeys: ["npc.trail2EchoTwinA.line1", "npc.trail2EchoTwinA.line2"],
      },
      {
        nameKey: "npc.trail2EchoTwinB",
        x: 24,
        y: 22,
        dir: "left",
        nextTurn: 0,
        jacket: "#5fa069",
        voiceGender: "female",
        voiceId: "trail2EchoTwinB",
        kind: "child",
        conversationKeys: ["npc.trail2EchoTwinB.line1", "npc.trail2EchoTwinB.line2"],
      },
      {
        nameKey: "npc.trail2Hiker",
        x: 17,
        y: 44,
        dir: "down",
        nextTurn: 0,
        jacket: "#b56b48",
        voiceGender: "male",
        voiceId: "trail2Hiker",
        wander: true,
        conversationPools: [
          ["npc.trail2Hiker.line1", "npc.trail2Hiker.line2"],
          ["npc.trail2Hiker.pool2.line1", "npc.trail2Hiker.pool2.line2"],
        ],
      },
    ],
    areaKey: "area.trail2",
    musicKey: "trail2",
  };
}

function createTown3Scene() {
  const width = 48;
  const height = 40;
  const town3Map = createTileMap(width, height, "grass");

  for (let x = 0; x < width; x += 1) {
    if (x < 22 || x > 26) {
      setMapTile(town3Map, x, 0, "stone");
      setMapTile(town3Map, x, height - 1, "stone");
    }
  }
  for (let y = 0; y < height; y += 1) {
    setMapTile(town3Map, 0, y, "stone");
    setMapTile(town3Map, width - 1, y, "stone");
  }

  fillMapRect(town3Map, 14, 13, 22, 11, "path");
  fillMapRect(town3Map, 22, 24, 5, 15, "path");
  fillMapRect(town3Map, 22, 1, 5, 12, "path");
  fillMapRect(town3Map, 6, 16, 8, 3, "path");
  fillMapRect(town3Map, 11, 10, 2, 6, "path");
  fillMapRect(town3Map, 25, 10, 3, 3, "path");
  fillMapRect(town3Map, 38, 10, 3, 6, "path");
  fillMapRect(town3Map, 36, 16, 8, 3, "path");
  fillMapRect(town3Map, 10, 33, 3, 2, "path");
  fillMapRect(town3Map, 13, 33, 9, 2, "path");
  fillMapRect(town3Map, 8, 19, 5, 4, "path");
  fillMapRect(town3Map, 15, 25, 6, 4, "path");
  fillMapRect(town3Map, 28, 25, 6, 4, "path");
  fillMapRect(town3Map, 36, 19, 5, 4, "path");

  const treeSpots = [
    [3, 4], [4, 12], [3, 24], [5, 36], [44, 4], [44, 22], [43, 36], [33, 31],
    [16, 5], [31, 2], [44, 13],
  ];
  for (const [x, y] of treeSpots) setMapTile(town3Map, x, y, "tree");

  const flowerSpots = [
    [14, 11], [15, 11], [34, 11], [35, 11], [16, 31], [17, 31], [30, 31], [31, 31],
  ];
  for (const [x, y] of flowerSpots) setMapTile(town3Map, x, y, "flowers");

  const town3Buildings = [
    {
      labelKey: "object.town3CountingHouse",
      sceneId: "town3CountingHouse",
      x: 6,
      y: 4,
      w: 10,
      h: 6,
      doorX: 11,
      doorY: 10,
      roof: COLORS.roofTeal,
      trim: "#287368",
      important: true,
    },
    {
      labelKey: "object.town3GuildHall",
      sceneId: "town3GuildHall",
      x: 20,
      y: 3,
      w: 12,
      h: 7,
      doorX: 26,
      doorY: 10,
      roof: COLORS.roofViolet,
      trim: "#5f4b86",
      important: true,
    },
    {
      labelKey: "object.town3SnackCafe",
      sceneId: "town3SnackCafe",
      x: 36,
      y: 5,
      w: 8,
      h: 5,
      doorX: 39,
      doorY: 10,
      roof: COLORS.roofRed,
      trim: "#7d3137",
    },
    {
      labelKey: "object.town3Guesthouse",
      sceneId: "town3Guesthouse",
      x: 8,
      y: 28,
      w: 7,
      h: 5,
      doorX: 11,
      doorY: 33,
      roof: "#d18a3f",
      trim: "#8a5624",
    },
  ];

  const town3Objects = [
    { x: 9, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    { x: 16, y: 26, w: 3, h: 2, type: "routeObjectStall" },
    { x: 29, y: 26, w: 3, h: 2, type: "routeObjectStall" },
    { x: 37, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    { x: 30, y: 14, w: 3, h: 2, type: "routeObjectStall" },
    { x: 17, y: 28, w: 3, h: 2, type: "trailRestTable" },
    { x: 19, y: 18, w: 3, h: 1, type: "speechBench" },
  ];

  const town3Interactables = [
    {
      labelKey: "object.town3WelcomeSign",
      x: 21,
      y: 35,
      solid: true,
      kind: "sign",
      conversationKeys: ["sign.town3Welcome.line1", "sign.town3Welcome.line2"],
    },
    {
      labelKey: "object.town3PriceBoard",
      x: 24,
      y: 12,
      solid: true,
      kind: "sign",
      studyBoardKey: "sinoNumbers",
      progressFlagOnStudyBoard: TOWN3_FLAGS.priceBoardRead,
    },
    {
      labelKey: "object.town3ReviewBoard",
      x: 17,
      y: 14,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town3ReviewBoard.line1"],
      drillKey: "town3MarketReview",
    },
    ...createRectInteractions({
      labelKey: "object.town3FishStall",
      x: 9,
      y: 20,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3FishStall.line1"],
      drillKey: "town3FishStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3FruitStall",
      x: 16,
      y: 26,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3FruitStall.line1"],
      drillKey: "town3FruitStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3ClothStall",
      x: 29,
      y: 26,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3ClothStall.line1"],
      drillKey: "town3ColorStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3CounterStall",
      x: 37,
      y: 20,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3CounterStall.line1"],
      drillKey: "town3CounterStall",
      requiredFlags: [TOWN3_FLAGS.counterBoardRead],
      lockedConversationKeys: ["object.town3CounterStall.locked"],
    }),
    ...createRectInteractions({
      labelKey: "object.town3PriceStall",
      x: 30,
      y: 14,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3PriceStall.line1"],
      drillKey: "town3Prices",
      requiredFlags: [TOWN3_FLAGS.priceBoardRead],
      lockedConversationKeys: ["object.town3PriceStall.locked"],
    }),
    ...createRectInteractions({
      labelKey: "object.town3GrandmaBasket",
      x: 17,
      y: 28,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3GrandmaBasket.line1"],
      drillKey: "town3ShoppingList",
    }),
    ...createRectInteractions({
      labelKey: "object.town3PlazaBench",
      x: 19,
      y: 18,
      w: 3,
      h: 1,
      conversationKeys: ["object.town3PlazaBench.line1"],
    }),
    ...createRouteTriggers({
      labelKey: "object.routeSouth",
      fromX: 22,
      toX: 26,
      y: height - 1,
      targetSceneId: "trail2",
      targetX: 17,
      targetY: 1,
      targetDir: "down",
    }),
    ...createRouteTriggers({
      labelKey: "object.routeTrail3",
      fromX: 22,
      toX: 26,
      y: 0,
      targetSceneId: "trail3",
      targetX: 17,
      targetY: 52,
      targetDir: "up",
      conversationKeys: ["route.trail3.pending"],
    }),
    ...town3Buildings.map((building) => ({
      labelKey: `${building.labelKey}.door`,
      sceneId: building.sceneId,
      x: building.doorX,
      y: building.doorY,
      solid: false,
      kind: "door",
    })),
  ];

  const town3Npcs = [
    {
      nameKey: "npc.town3GateGreeter",
      x: 24,
      y: 34,
      dir: "down",
      nextTurn: 0,
      jacket: "#4f8cc9",
      voiceGender: "male",
      voiceId: "town3GateGreeter",
      conversationKeys: ["npc.town3GateGreeter.line1", "npc.town3GateGreeter.line2"],
      progressFlagOnTalk: TOWN3_FLAGS.arrived,
    },
    {
      nameKey: "npc.town3PlazaGuide",
      x: 24,
      y: 16,
      dir: "down",
      nextTurn: 0,
      jacket: "#a65d3e",
      voiceGender: "female",
      voiceId: "town3PlazaGuide",
      conversationResolver: () => chapterGuideLines("town3", "npc.town3PlazaGuide.line1"),
    },
    {
      nameKey: "npc.town3FruitSeller",
      x: 17,
      y: 25,
      dir: "down",
      nextTurn: 0,
      jacket: "#c9554f",
      voiceGender: "female",
      voiceId: "town3FruitSeller",
      conversationPools: [
        ["npc.town3FruitSeller.line1", "npc.town3FruitSeller.line2"],
        ["npc.town3FruitSeller.pool2.line1", "npc.town3FruitSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3ClothSeller",
      x: 30,
      y: 25,
      dir: "down",
      nextTurn: 0,
      jacket: "#8a6bb7",
      voiceGender: "male",
      voiceId: "town3ClothSeller",
      conversationPools: [
        ["npc.town3ClothSeller.line1", "npc.town3ClothSeller.line2"],
        ["npc.town3ClothSeller.pool2.line1", "npc.town3ClothSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3FishSeller",
      x: 10,
      y: 19,
      dir: "down",
      nextTurn: 0,
      jacket: "#3f7fb1",
      voiceGender: "male",
      voiceId: "town3FishSeller",
      conversationPools: [
        ["npc.town3FishSeller.line1", "npc.town3FishSeller.line2"],
        ["npc.town3FishSeller.pool2.line1", "npc.town3FishSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3CounterCoach",
      x: 38,
      y: 19,
      dir: "down",
      nextTurn: 0,
      jacket: "#497a4d",
      voiceGender: "female",
      voiceId: "town3CounterCoach",
      conversationKeys: ["npc.town3CounterCoach.line1", "npc.town3CounterCoach.line2"],
    },
    {
      nameKey: "npc.town3Grandma",
      x: 20,
      y: 27,
      dir: "left",
      nextTurn: 0,
      jacket: "#b65c7a",
      voiceGender: "female",
      voiceId: "town3Grandma",
      conversationResolver: resolveTown3GrandmaConversation,
    },
    {
      nameKey: "npc.town3CountingKidA",
      x: 26,
      y: 20,
      dir: "right",
      nextTurn: 0,
      jacket: "#e2a843",
      voiceGender: "female",
      voiceId: "town3CountingKidA",
      kind: "child",
      wander: true,
      conversationPools: [
        ["npc.town3CountingKidA.line1", "npc.town3CountingKidA.line2"],
        ["npc.town3CountingKidA.pool2.line1", "npc.town3CountingKidA.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3CountingKidB",
      x: 28,
      y: 21,
      dir: "left",
      nextTurn: 0,
      jacket: "#5fa069",
      voiceGender: "male",
      voiceId: "town3CountingKidB",
      kind: "child",
      wander: true,
      conversationKeys: ["npc.town3CountingKidB.line1", "npc.town3CountingKidB.line2"],
    },
    {
      nameKey: "npc.town3Shopper",
      x: 33,
      y: 17,
      dir: "left",
      nextTurn: 0,
      jacket: "#b56b84",
      voiceGender: "female",
      voiceId: "town3Shopper",
      wander: true,
      conversationPools: [
        ["npc.town3Shopper.line1", "npc.town3Shopper.line2"],
        ["npc.town3Shopper.pool2.line1", "npc.town3Shopper.pool2.line2"],
      ],
    },
  ];

  return {
    id: "town3",
    kind: "outdoor",
    map: town3Map,
    width,
    height,
    buildings: town3Buildings,
    objects: town3Objects,
    interactables: town3Interactables,
    npcs: town3Npcs,
    areaKey: "area.town3",
    musicKey: "town3",
  };
}

function createTown3InteriorScenes(town3Buildings) {
  const bySceneId = Object.fromEntries(town3Buildings.map((building) => [building.sceneId, building]));

  const countingHouse = createInteriorScene({
    id: "town3CountingHouse",
    areaKey: "area.town3CountingHouse",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.town3CountingHouse,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(countingHouse, 2, 7, 16, 4, "carpetBlue");
  fillInteriorObject(countingHouse, 3, 2, 3, 1, "mapBoard", "object.town3SinoBoard", {
    studyBoardKey: "sinoNumbers",
    progressFlagOnStudyBoard: TOWN3_FLAGS.sinoBoardRead,
  });
  fillInteriorObject(countingHouse, 8, 2, 3, 1, "mapBoard", "object.town3NativeBoard", {
    studyBoardKey: "nativeNumbers",
    progressFlagOnStudyBoard: TOWN3_FLAGS.nativeBoardRead,
    requiredFlags: [TOWN3_FLAGS.sinoPracticePassed],
    lockedConversationKeys: ["object.town3NativeBoard.locked"],
  });
  fillInteriorObject(countingHouse, 13, 2, 2, 1, "bookcase", "object.town3CounterBoard", {
    studyBoardKey: "counters",
    progressFlagOnStudyBoard: TOWN3_FLAGS.counterBoardRead,
    requiredFlags: [TOWN3_FLAGS.nativePracticePassed],
    lockedConversationKeys: ["object.town3CounterBoard.locked"],
  });
  fillInteriorObject(countingHouse, 16, 2, 3, 1, "blackboard", "object.town3PriceBlackboard", {
    drillResolver: resolveTown3BlackboardDrill,
    conversationResolver: resolveTown3BlackboardConversation,
  });
  fillInteriorObject(countingHouse, 5, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  fillInteriorObject(countingHouse, 9, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  fillInteriorObject(countingHouse, 13, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusMaster",
    x: 10,
    y: 5,
    dir: "down",
    jacket: "#287368",
    voiceGender: "male",
    voiceId: "town3AbacusMaster",
    conversationKeys: ["npc.town3AbacusMaster.line1", "npc.town3AbacusMaster.line2"],
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusPupilA",
    x: 6,
    y: 10,
    dir: "up",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town3AbacusPupilA",
    kind: "child",
    conversationKeys: ["npc.town3AbacusPupilA.line1", "npc.town3AbacusPupilA.line2"],
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusPupilB",
    x: 14,
    y: 10,
    dir: "up",
    jacket: "#e2a843",
    voiceGender: "male",
    voiceId: "town3AbacusPupilB",
    kind: "child",
    conversationKeys: ["npc.town3AbacusPupilB.line1", "npc.town3AbacusPupilB.line2"],
  });

  const guildHall = createInteriorScene({
    id: "town3GuildHall",
    areaKey: "area.town3GuildHall",
    width: 18,
    height: 12,
    entryX: 9,
    returnBuilding: bySceneId.town3GuildHall,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(guildHall, 6, 5, 6, 3, "carpetRed");
  fillInteriorObject(guildHall, 7, 3, 4, 1, "counter", "object.town3BadgePodium", {
    conversationKeys: ["object.town3BadgePodium.line1"],
    drillKey: "town3NumberBadge",
    requiredFlags: [
      TOWN3_FLAGS.sinoExamPassed,
      TOWN3_FLAGS.nativeExamPassed,
      TOWN3_FLAGS.countersPracticePassed,
      TOWN3_FLAGS.pricesPracticePassed,
    ],
    lockedConversationKeys: ["object.town3BadgePodium.locked"],
  });
  fillInteriorObject(guildHall, 2, 6, 2, 1, "bookcase", "object.town3GuildLedger", {
    conversationKeys: ["object.town3GuildLedger.line1"],
  });
  addInteriorNpc(guildHall, {
    nameKey: "npc.town3GuildLeader",
    x: 9,
    y: 2,
    dir: "down",
    jacket: "#5f4b86",
    voiceGender: "female",
    voiceId: "town3GuildLeader",
    conversationResolver: resolveTown3GuildLeaderConversation,
  });
  addInteriorNpc(guildHall, {
    nameKey: "npc.town3GuildClerk",
    x: 4,
    y: 8,
    dir: "right",
    jacket: "#6c9a50",
    voiceGender: "male",
    voiceId: "town3GuildClerk",
    conversationKeys: ["npc.town3GuildClerk.line1", "npc.town3GuildClerk.line2"],
  });

  const snackCafe = createInteriorScene({
    id: "town3SnackCafe",
    areaKey: "area.town3SnackCafe",
    width: 14,
    height: 10,
    entryX: 7,
    returnBuilding: bySceneId.town3SnackCafe,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(snackCafe, 2, 5, 10, 3, "tatami");
  fillInteriorObject(snackCafe, 4, 2, 6, 1, "counter", "object.town3CafeCounter", {
    conversationKeys: ["object.town3CafeCounter.line1"],
    drillKey: "town3CafeOrder",
  });
  fillInteriorObject(snackCafe, 3, 6, 2, 2, "table", "object.town3CafeTable", {
    conversationKeys: ["object.town3CafeTable.line1"],
  });
  fillInteriorObject(snackCafe, 9, 6, 2, 2, "table", "object.town3CafeTable", {
    conversationKeys: ["object.town3CafeTable.line1"],
  });
  addInteriorNpc(snackCafe, {
    nameKey: "npc.town3Barista",
    x: 6,
    y: 1,
    dir: "down",
    jacket: "#7d3137",
    voiceGender: "female",
    voiceId: "town3Barista",
    conversationPools: [
      ["npc.town3Barista.line1", "npc.town3Barista.line2"],
      ["npc.town3Barista.pool2.line1", "npc.town3Barista.pool2.line2"],
    ],
  });
  addInteriorNpc(snackCafe, {
    nameKey: "npc.town3CafeCustomer",
    x: 6,
    y: 5,
    dir: "left",
    jacket: "#b56b48",
    voiceGender: "male",
    voiceId: "town3CafeCustomer",
    conversationKeys: ["npc.town3CafeCustomer.line1", "npc.town3CafeCustomer.line2"],
  });

  const town3Guesthouse = createInteriorScene({
    id: "town3Guesthouse",
    areaKey: "area.town3Guesthouse",
    width: 12,
    height: 9,
    entryX: 6,
    returnBuilding: bySceneId.town3Guesthouse,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(town3Guesthouse, 2, 4, 8, 3, "carpetGreen");
  placeInteriorObject(town3Guesthouse, 2, 2, "bed", "object.bed", {
    conversationKeys: ["object.town3GuesthouseBed.line1"],
  });
  fillInteriorObject(town3Guesthouse, 7, 4, 2, 2, "table", "object.familyTable", {
    conversationKeys: ["object.town3GuesthouseTable.line1"],
  });
  addInteriorNpc(town3Guesthouse, {
    nameKey: "npc.town3GuesthouseHost",
    x: 8,
    y: 2,
    dir: "down",
    jacket: "#8a5624",
    voiceGender: "male",
    voiceId: "town3GuesthouseHost",
    conversationKeys: ["npc.town3GuesthouseHost.line1", "npc.town3GuesthouseHost.line2"],
  });

  return {
    town3CountingHouse: countingHouse,
    town3GuildHall: guildHall,
    town3SnackCafe: snackCafe,
    town3Guesthouse: town3Guesthouse,
  };
}

function createInteriorScenes() {
  const bySceneId = Object.fromEntries(buildings.map((building) => [building.sceneId, building]));

  const elementarySchool = createInteriorScene({
    id: "elementarySchool",
    areaKey: "area.elementarySchool",
    width: 22,
    height: 16,
    entryX: 11,
    returnBuilding: bySceneId.elementarySchool,
  });
  fillInteriorObject(elementarySchool, 2, 1, 5, 1, "mapBoard", "object.consonantWallMap", {
    studyBoardKey: "basicConsonants",
    progressFlagOnStudyBoard: TOWN1_FLAGS.consonantMapRead,
  });
  fillInteriorObject(elementarySchool, 8, 1, 6, 1, "blackboard", "object.schoolBlackboard", {
    conversationKeys: ["object.schoolBlackboard.line1"],
    drillResolver: resolveTown1BlackboardDrill,
    conversationResolver: resolveTown1BlackboardConversation,
  });
  fillInteriorObject(elementarySchool, 15, 1, 5, 1, "mapBoard", "object.vowelWallMap", {
    studyBoardKey: "basicVowels",
    progressFlagOnStudyBoard: TOWN1_FLAGS.vowelMapRead,
  });
  fillInteriorObject(elementarySchool, 1, 4, 2, 3, "bookcase", "object.aspiratedBookcase", {
    conversationResolver: resolveTown1AspiratedBookConversation,
    studyBoardResolver: resolveTown1AspiratedBookBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1AspiratedBookFlags,
  });
  fillInteriorObject(elementarySchool, 19, 5, 2, 3, "bookcase", "object.doubleConsonantBookcase", {
    conversationResolver: resolveTown1DoubleConsonantBookConversation,
    studyBoardResolver: resolveTown1DoubleConsonantBookBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1DoubleConsonantBookFlags,
  });
  fillInteriorObject(elementarySchool, 9, 4, 5, 1, "teacherDesk", "object.teacherDesk", {
    conversationKeys: ["object.teacherDesk.line1"],
  });

  const studentDeskSpots = [
    [4, 8],
    [9, 8],
    [14, 8],
    [4, 11],
    [9, 11],
    [14, 11],
  ];
  for (const [deskX, deskY] of studentDeskSpots) {
    fillInteriorObject(elementarySchool, deskX, deskY, 2, 1, "studentDesk", "object.studentDesk", {
      conversationKeys: ["object.studentDesk.line1"],
      drillResolver: resolveTown1DeskDrill,
      conversationResolver: resolveTown1DeskConversation,
    });
    placeInteriorObject(elementarySchool, deskX, deskY + 1, "chair", "object.studentSeat", {
      solid: false,
    });
    placeInteriorObject(elementarySchool, deskX + 1, deskY + 1, "chair", "object.studentSeat", {
      solid: false,
    });
  }

  addInteriorNpc(elementarySchool, {
    nameKey: "npc.hangulTeacher",
    x: 11,
    y: 3,
    dir: "down",
    jacket: "#9b5f42",
    voiceGender: "female",
    voiceId: "hangulTeacher",
    conversationKeys: ["npc.hangulTeacher.line1", "npc.hangulTeacher.line2", "npc.hangulTeacher.line3"],
    conversationResolver: resolveTown1TeacherConversation,
    progressFlagsOnTalkResolver: resolveTown1TeacherProgressFlags,
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentA",
    x: 11,
    y: 6,
    dir: "up",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "schoolStudentA",
    conversationKeys: ["npc.schoolStudentA.line1", "npc.schoolStudentA.line2"],
    kind: "child",
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentB",
    x: 6,
    y: 10,
    dir: "right",
    jacket: "#d28a4d",
    voiceGender: "male",
    voiceId: "schoolStudentB",
    conversationKeys: ["npc.schoolStudentB.line1", "npc.schoolStudentB.line2"],
    kind: "child",
    wander: true,
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentC",
    x: 17,
    y: 12,
    dir: "left",
    jacket: "#7a6fb2",
    voiceGender: "female",
    voiceId: "schoolStudentC",
    conversationKeys: ["npc.schoolStudentC.line1", "npc.schoolStudentC.line2"],
    kind: "child",
    wander: true,
  });

  const yourGuesthouse = createInteriorScene({
    id: "yourGuesthouse",
    areaKey: "area.yourGuesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.yourGuesthouse,
  });
  fillInteriorTile(yourGuesthouse, 5, 7, 4, 2, "carpetRed");
  fillInteriorObject(yourGuesthouse, 2, 2, 2, 2, "bed", "object.bed");
  placeInteriorObject(yourGuesthouse, 2, 6, "tv", "object.tv");
  placeInteriorObject(yourGuesthouse, 10, 2, "fridge", "object.fridge");
  placeInteriorObject(yourGuesthouse, 11, 2, "sink", "object.sink");
  placeInteriorObject(yourGuesthouse, 12, 2, "stove", "object.stove");
  fillInteriorObject(yourGuesthouse, 5, 5, 2, 2, "table", "object.familyTable");
  placeInteriorObject(yourGuesthouse, 4, 5, "chair", "object.familyTable");
  placeInteriorObject(yourGuesthouse, 7, 6, "chair", "object.familyTable");
  addInteriorNpc(yourGuesthouse, {
    nameKey: "npc.guesthouseHost",
    x: 10,
    y: 6,
    dir: "left",
    jacket: "#b65c7a",
    voiceGender: "female",
    voiceId: "guesthouseHost",
    conversationKeys: ["npc.guesthouseHost.line1", "npc.guesthouseHost.line2"],
    wander: true,
  });
  addInteriorNpc(yourGuesthouse, {
    nameKey: "npc.guesthouseKid",
    x: 4,
    y: 8,
    dir: "down",
    jacket: "#e2a843",
    voiceGender: "female",
    voiceId: "guesthouseKid",
    conversationKeys: ["npc.guesthouseKid.line1", "npc.guesthouseKid.line2"],
    kind: "child",
    wander: true,
  });

  const rivalGuesthouse = createInteriorScene({
    id: "rivalGuesthouse",
    areaKey: "area.rivalGuesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.rivalGuesthouse,
  });
  fillInteriorTile(rivalGuesthouse, 4, 7, 6, 2, "carpetBlue");
  fillInteriorObject(rivalGuesthouse, 2, 2, 2, 2, "bed", "object.bed");
  placeInteriorObject(rivalGuesthouse, 9, 2, "desk", "object.batchimSingleNotebook", {
    conversationResolver: resolveTown1BatchimSingleConversation,
    studyBoardResolver: resolveTown1BatchimSingleBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1BatchimSingleFlags,
  });
  fillInteriorObject(rivalGuesthouse, 10, 2, 2, 1, "bookcase", "object.batchimDoubleNotebook", {
    conversationResolver: resolveTown1BatchimDoubleConversation,
    studyBoardResolver: resolveTown1BatchimDoubleBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1BatchimDoubleFlags,
  });
  placeInteriorObject(rivalGuesthouse, 3, 6, "tv", "object.tv");
  fillInteriorObject(rivalGuesthouse, 7, 5, 2, 2, "table", "object.familyTable");
  placeInteriorObject(rivalGuesthouse, 6, 6, "chair", "object.familyTable");
  placeInteriorObject(rivalGuesthouse, 9, 5, "chair", "object.familyTable");
  addInteriorNpc(rivalGuesthouse, {
    nameKey: "npc.rivalDad",
    x: 5,
    y: 5,
    dir: "right",
    jacket: "#5f7f9a",
    voiceGender: "male",
    voiceId: "rivalDad",
    conversationKeys: ["npc.rivalDad.line1", "npc.rivalDad.line2"],
    conversationResolver: resolveTown1FinalSoundCoachConversation,
    progressFlagsOnTalkResolver: resolveTown1FinalSoundCoachProgressFlags,
  });
  addInteriorNpc(rivalGuesthouse, {
    nameKey: "npc.rivalStudent",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#bd6e48",
    voiceGender: "male",
    voiceId: "rivalStudent",
    conversationKeys: ["npc.rivalStudent.line1", "npc.rivalStudent.line2"],
    conversationResolver: resolveTown1DoubleFinalLearnerConversation,
    progressFlagsOnTalkResolver: resolveTown1DoubleFinalLearnerProgressFlags,
    kind: "child",
  });

  const hanokTeaHouse = createInteriorScene({
    id: "hanokTeaHouse",
    areaKey: "area.hanokTeaHouse",
    width: 16,
    height: 12,
    entryX: 8,
    returnBuilding: bySceneId.hanokTeaHouse,
  });
  fillInteriorTile(hanokTeaHouse, 2, 4, 12, 5, "tatami");
  fillInteriorObject(hanokTeaHouse, 2, 2, 4, 1, "counter", "object.teaCounter", {
    conversationKeys: ["npc.teaOwner.line1", "npc.teaOwner.line2"],
  });
  fillInteriorObject(hanokTeaHouse, 4, 5, 2, 1, "teaTable", "object.teaTable");
  fillInteriorObject(hanokTeaHouse, 10, 5, 2, 1, "teaTable", "object.teaTable");
  fillInteriorObject(hanokTeaHouse, 7, 8, 2, 1, "teaTable", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 4, 4, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 5, 6, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 10, 4, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 11, 6, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 7, 7, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 8, 9, "cushion", "object.teaTable");
  addInteriorNpc(hanokTeaHouse, {
    nameKey: "npc.teaOwner",
    x: 3,
    y: 1,
    dir: "down",
    jacket: "#4b8f79",
    voiceGender: "female",
    voiceId: "teaOwner",
    conversationPools: [
      ["npc.teaOwner.line1", "npc.teaOwner.line2"],
      ["npc.teaOwner.pool2.line1", "npc.teaOwner.pool2.line2"],
    ],
  });
  addInteriorNpc(hanokTeaHouse, {
    nameKey: "npc.teaCustomer",
    x: 12,
    y: 7,
    dir: "left",
    jacket: "#8b6fb0",
    voiceGender: "female",
    voiceId: "teaCustomer",
    conversationKeys: ["npc.teaCustomer.line1", "npc.teaCustomer.line2"],
    wander: true,
  });

  const cornerMarket = createInteriorScene({
    id: "cornerMarket",
    areaKey: "area.cornerMarket",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.cornerMarket,
  });
  fillInteriorTile(cornerMarket, 2, 8, 14, 2, "carpetGreen");
  fillInteriorObject(cornerMarket, 2, 2, 3, 2, "produce", "object.produceShelf");
  fillInteriorObject(cornerMarket, 2, 6, 3, 1, "fish", "object.fishIcebox");
  fillInteriorObject(cornerMarket, 6, 2, 1, 4, "supplyShelf", "object.supplyShelf");
  fillInteriorObject(cornerMarket, 8, 2, 1, 4, "supplyShelf", "object.supplyShelf");
  fillInteriorObject(cornerMarket, 11, 3, 5, 1, "counter", "object.marketCounter", {
    conversationKeys: ["npc.marketClerk.line1", "npc.marketClerk.line2"],
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketClerk",
    x: 13,
    y: 2,
    dir: "down",
    jacket: "#3f7fb1",
    voiceGender: "female",
    voiceId: "marketClerk",
    conversationPools: [
      ["npc.marketClerk.line1", "npc.marketClerk.line2"],
      ["npc.marketClerk.pool2.line1", "npc.marketClerk.pool2.line2"],
    ],
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketStocker",
    x: 6,
    y: 7,
    dir: "down",
    jacket: "#6c9a50",
    voiceGender: "male",
    voiceId: "marketStocker",
    conversationKeys: ["npc.marketStocker.line1", "npc.marketStocker.line2"],
    wander: true,
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketCustomer",
    x: 12,
    y: 9,
    dir: "left",
    jacket: "#b56b84",
    voiceGender: "female",
    voiceId: "marketCustomer",
    conversationKeys: ["npc.marketCustomer.line1", "npc.marketCustomer.line2"],
    wander: true,
  });

  const travelCenter = createInteriorScene({
    id: "travelCenter",
    areaKey: "area.travelCenter",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.travelCenter,
  });
  fillInteriorTile(travelCenter, 4, 7, 12, 3, "carpetBlue");
  fillInteriorObject(travelCenter, 7, 3, 6, 1, "counter", "object.counter", {
    conversationKeys: ["npc.travelGuide.line1", "npc.travelGuide.line2"],
  });
  fillInteriorObject(travelCenter, 2, 1, 4, 1, "mapBoard", "object.syllablePoster", {
    conversationKeys: ["object.syllablePoster.line1", "object.syllablePoster.line2"],
  });
  fillInteriorObject(travelCenter, 15, 2, 2, 2, "brochureRack", "object.hangulBookshelf", {
    conversationKeys: ["object.hangulBookshelf.line1"],
  });
  fillInteriorObject(travelCenter, 5, 8, 2, 2, "table", "object.letterBlockTable", {
    conversationKeys: ["object.letterBlockTable.line1"],
    drillKey: "alphabetBlocks",
  });
  fillInteriorObject(travelCenter, 12, 8, 2, 2, "desk", "object.patternDesk", {
    conversationKeys: ["object.patternDesk.line1"],
    drillKey: "sentenceBlocks",
  });
  placeInteriorObject(travelCenter, 4, 8, "chair", "object.letterBlockTable");
  placeInteriorObject(travelCenter, 7, 9, "chair", "object.letterBlockTable");
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelGuide",
    x: 9,
    y: 2,
    dir: "down",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "travelGuide",
    conversationResolver: () => chapterGuideLines("town1", "npc.travelGuide.line1"),
  });
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelTrainee",
    x: 16,
    y: 6,
    dir: "left",
    jacket: "#4c8f95",
    voiceGender: "female",
    voiceId: "travelTrainee",
    conversationKeys: ["npc.travelTrainee.line1", "npc.travelTrainee.line2"],
    wander: true,
  });
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelGuest",
    x: 5,
    y: 10,
    dir: "up",
    jacket: "#7a6fb2",
    voiceGender: "male",
    voiceId: "travelGuest",
    conversationKeys: ["npc.travelGuest.line1", "npc.travelGuest.line2"],
    wander: true,
  });

  return {
    elementarySchool,
    yourGuesthouse,
    rivalGuesthouse,
    hanokTeaHouse,
    cornerMarket,
    travelCenter,
  };
}

function createTown2InteriorScenes(town2Buildings) {
  const bySceneId = Object.fromEntries(town2Buildings.map((building) => [building.sceneId, building]));

  const town2CityHall = createInteriorScene({
    id: "town2CityHall",
    areaKey: "area.town2CityHall",
    width: 26,
    height: 18,
    entryX: 13,
    returnBuilding: bySceneId.town2CityHall,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2CityHall, 10, 12, 7, 4, "carpetBlue");
  fillInteriorTile(town2CityHall, 2, 2, 6, 4, "carpetGreen");
  fillInteriorTile(town2CityHall, 10, 2, 6, 4, "carpetRed");
  fillInteriorTile(town2CityHall, 18, 2, 6, 4, "tatami");
  fillInteriorObject(town2CityHall, 11, 3, 4, 1, "counter", "object.town2BadgePodium", {
    conversationKeys: ["object.town2BadgePodium.line1"],
    drillKey: "town2FinalBadge",
    requiredFlags: [
      TOWN2_FLAGS.identityPassed,
      TOWN2_FLAGS.lostFoundPassed,
      TOWN2_FLAGS.labelsPassed,
      TOWN2_FLAGS.actionsPassed,
      TOWN2_FLAGS.readingReviewPassed,
    ],
    lockedConversationKeys: ["object.town2BadgePodium.locked.line1"],
  });
  fillInteriorObject(town2CityHall, 3, 3, 3, 1, "bookcase", "object.town2FinalReadingStation", {
    conversationKeys: ["object.town2FinalReadingStation.line1"],
    drillKey: "town2ReadingReview",
  });
  fillInteriorObject(town2CityHall, 11, 7, 3, 1, "desk", "object.town2FinalNameStation", {
    conversationKeys: ["object.town2FinalNameStation.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2CityHall, 19, 3, 3, 1, "table", "object.town2FinalObjectStation", {
    conversationKeys: ["object.town2FinalObjectStation.line1"],
    drillKey: "town2DistanceLabels",
  });
  fillInteriorObject(town2CityHall, 4, 11, 3, 1, "supplyShelf", "object.town2FinalSearchStation", {
    conversationKeys: ["object.town2FinalSearchStation.line1"],
    drillKey: "town2LostFound",
  });
  fillInteriorObject(town2CityHall, 18, 12, 4, 1, "desk", "object.town2FinalActionStation", {
    conversationKeys: ["object.town2FinalActionStation.line1"],
    drillKey: "town2ActionPark",
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2CityLeader",
    x: 13,
    y: 2,
    dir: "down",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "town2CityLeader",
    conversationResolver: resolveTown2CityLeaderConversation,
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ReadingAttendant",
    x: 6,
    y: 5,
    dir: "left",
    jacket: "#6c9a50",
    voiceGender: "female",
    voiceId: "town2ReadingAttendant",
    conversationKeys: ["npc.town2ReadingAttendant.line1", "npc.town2ReadingAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2NameAttendant",
    x: 15,
    y: 7,
    dir: "left",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town2NameAttendant",
    conversationKeys: ["npc.town2NameAttendant.line1", "npc.town2NameAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ObjectAttendant",
    x: 22,
    y: 5,
    dir: "left",
    jacket: "#8a6bb7",
    voiceGender: "male",
    voiceId: "town2ObjectAttendant",
    conversationKeys: ["npc.town2ObjectAttendant.line1", "npc.town2ObjectAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2SearchAttendant",
    x: 7,
    y: 12,
    dir: "left",
    jacket: "#e2a843",
    voiceGender: "female",
    voiceId: "town2SearchAttendant",
    conversationKeys: ["npc.town2SearchAttendant.line1", "npc.town2SearchAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ActionAttendant",
    x: 22,
    y: 13,
    dir: "left",
    jacket: "#497a4d",
    voiceGender: "male",
    voiceId: "town2ActionAttendant",
    conversationKeys: ["npc.town2ActionAttendant.line1", "npc.town2ActionAttendant.line2"],
  });

  const town2ReviewLibrary = createInteriorScene({
    id: "town2ReviewLibrary",
    areaKey: "area.town2ReviewLibrary",
    width: 16,
    height: 12,
    entryX: 8,
    returnBuilding: bySceneId.town2ReviewLibrary,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2ReviewLibrary, 2, 6, 12, 2, "carpetGreen");
  fillInteriorObject(town2ReviewLibrary, 2, 2, 4, 1, "bookcase", "object.town2ReadingShelf", {
    conversationKeys: ["object.town2ReadingShelf.line1"],
    drillKey: "town2ReadingReview",
  });
  fillInteriorObject(town2ReviewLibrary, 10, 2, 4, 1, "mapBoard", "object.town2BatchimWall", {
    conversationKeys: ["object.town2BatchimWall.line1"],
    drillKey: "batchimBridge",
  });
  fillInteriorObject(town2ReviewLibrary, 6, 7, 2, 2, "desk", "object.town2ReadingDesk", {
    conversationKeys: ["object.town2ReadingDesk.line1"],
    drillKey: "town2ReadingReview",
  });
  addInteriorNpc(town2ReviewLibrary, {
    nameKey: "npc.town2Librarian",
    x: 8,
    y: 4,
    dir: "down",
    jacket: "#6c9a50",
    voiceGender: "female",
    voiceId: "town2Librarian",
    conversationKeys: ["npc.town2Librarian.line1", "npc.town2Librarian.line2"],
  });

  const town2InfoCenter = createInteriorScene({
    id: "town2InfoCenter",
    areaKey: "area.town2InfoCenter",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.town2InfoCenter,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2InfoCenter, 4, 7, 10, 2, "carpetBlue");
  fillInteriorObject(town2InfoCenter, 5, 2, 8, 1, "counter", "object.town2RegistrationCounter", {
    conversationKeys: ["object.town2RegistrationCounter.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2InfoCenter, 6, 7, 3, 2, "table", "object.town2NameFormTable", {
    conversationKeys: ["object.town2NameFormTable.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2InfoCenter, 13, 5, 2, 3, "brochureRack", "object.town2RoleCardRack", {
    conversationKeys: ["object.town2RoleCardRack.line1"],
    drillKey: "town2IdentityOffice",
  });
  placeInteriorObject(town2InfoCenter, 3, 5, "mapBoard", "object.town2WaitingLineSign", {
    conversationKeys: ["object.town2WaitingLineSign.line1"],
  });
  addInteriorNpc(town2InfoCenter, {
    nameKey: "npc.town2InfoClerk",
    x: 9,
    y: 1,
    dir: "down",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town2InfoClerk",
    conversationKeys: ["npc.town2InfoClerk.line1", "npc.town2InfoClerk.line2"],
  });
  addInteriorNpc(town2InfoCenter, {
    nameKey: "npc.town2NameAttendant",
    x: 4,
    y: 8,
    dir: "right",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "town2InfoApplicant",
    conversationKeys: ["npc.town2NameAttendant.line1", "npc.town2NameAttendant.line2"],
  });

  const town2LostFound = createInteriorScene({
    id: "town2LostFound",
    areaKey: "area.town2LostFound",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.town2LostFound,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2LostFound, 3, 8, 12, 2, "carpetGreen");
  fillInteriorObject(town2LostFound, 5, 2, 8, 1, "counter", "object.town2LostFoundCounter", {
    conversationKeys: ["object.town2LostFoundCounter.line1"],
    drillKey: "town2LostFound",
  });
  placeInteriorObject(town2LostFound, 3, 4, "bookcase", "object.town2ObjectShelfBook", {
    conversationKeys: ["object.town2ObjectShelfBook.line1"],
  });
  placeInteriorObject(town2LostFound, 6, 4, "supplyShelf", "object.town2ObjectShelfWater", {
    conversationKeys: ["object.town2ObjectShelfWater.line1"],
  });
  placeInteriorObject(town2LostFound, 9, 4, "brochureRack", "object.town2ObjectShelfBag", {
    conversationKeys: ["object.town2ObjectShelfBag.line1"],
  });
  placeInteriorObject(town2LostFound, 12, 4, "produce", "object.town2ObjectShelfApple", {
    conversationKeys: ["object.town2ObjectShelfApple.line1"],
  });
  placeInteriorObject(town2LostFound, 14, 7, "mapBoard", "object.town2LostFoundClipboard", {
    conversationKeys: ["object.town2LostFoundClipboard.line1"],
    drillKey: "town2LostFound",
  });
  addInteriorNpc(town2LostFound, {
    nameKey: "npc.town2LostFoundOwner",
    x: 9,
    y: 1,
    dir: "down",
    jacket: "#8a6bb7",
    voiceGender: "female",
    voiceId: "town2LostFoundOwner",
    conversationKeys: ["npc.town2LostFoundOwner.line1", "npc.town2LostFoundOwner.line2"],
  });

  const town2LabelMuseum = createInteriorScene({
    id: "town2LabelMuseum",
    areaKey: "area.town2LabelMuseum",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.town2LabelMuseum,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2LabelMuseum, 2, 7, 16, 3, "tatami");
  fillInteriorObject(town2LabelMuseum, 3, 5, 3, 1, "table", "object.town2NearDisplay", {
    conversationKeys: ["object.town2NearDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 8, 5, 3, 1, "table", "object.town2ListenerDisplay", {
    conversationKeys: ["object.town2ListenerDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 14, 5, 3, 1, "table", "object.town2FarDisplay", {
    conversationKeys: ["object.town2FarDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 8, 9, 4, 1, "desk", "object.town2LabelTray", {
    conversationKeys: ["object.town2LabelTray.line1"],
    drillKey: "town2DistanceLabels",
  });
  placeInteriorObject(town2LabelMuseum, 16, 2, "mapBoard", "object.town2MuseumRuleSign", {
    conversationKeys: ["object.town2MuseumRuleSign.line1"],
  });
  addInteriorNpc(town2LabelMuseum, {
    nameKey: "npc.town2MuseumCurator",
    x: 10,
    y: 3,
    dir: "down",
    jacket: "#b65c7a",
    voiceGender: "female",
    voiceId: "town2MuseumCurator",
    conversationKeys: ["npc.town2MuseumCurator.line1", "npc.town2MuseumCurator.line2"],
  });

  const town2Guesthouse = createInteriorScene({
    id: "town2Guesthouse",
    areaKey: "area.town2Guesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.town2Guesthouse,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2Guesthouse, 4, 7, 6, 2, "carpetRed");
  fillInteriorObject(town2Guesthouse, 2, 2, 2, 2, "bed", "object.bed");
  fillInteriorObject(town2Guesthouse, 6, 5, 2, 2, "table", "object.town2Guestbook", {
    conversationKeys: ["object.town2Guestbook.line1"],
  });
  fillInteriorObject(town2Guesthouse, 10, 2, 2, 1, "bookcase", "object.town2HintBookshelf", {
    conversationKeys: ["object.town2HintBookshelf.line1"],
  });
  addInteriorNpc(town2Guesthouse, {
    nameKey: "npc.town2GuesthouseHost",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#bd6e48",
    voiceGender: "female",
    voiceId: "town2GuesthouseHost",
    conversationKeys: ["npc.town2GuesthouseHost.line1", "npc.town2GuesthouseHost.line2"],
  });

  const town2EastResidence = createInteriorScene({
    id: "town2EastResidence",
    areaKey: "area.town2EastResidence",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.town2EastResidence,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2EastResidence, 3, 6, 8, 2, "carpetGreen");
  fillInteriorObject(town2EastResidence, 3, 3, 4, 1, "mapBoard", "object.town2RoadMap", {
    conversationKeys: ["object.town2RoadMap.line1"],
  });
  fillInteriorObject(town2EastResidence, 6, 7, 2, 2, "table", "object.town2FamilyTable", {
    conversationKeys: ["object.town2FamilyTable.line1"],
  });
  placeInteriorObject(town2EastResidence, 10, 3, "desk", "object.town2RouteNote", {
    conversationKeys: ["object.town2RouteNote.line1"],
  });
  addInteriorNpc(town2EastResidence, {
    nameKey: "npc.town2EastResidentIndoor",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#5f7f9a",
    voiceGender: "male",
    voiceId: "town2EastResidentIndoor",
    conversationKeys: ["npc.town2EastResidentIndoor.line1", "npc.town2EastResidentIndoor.line2"],
  });

  return {
    town2CityHall,
    town2ReviewLibrary,
    town2InfoCenter,
    town2LostFound,
    town2LabelMuseum,
    town2Guesthouse,
    town2EastResidence,
  };
}

function createInteriorScene({
  id,
  areaKey,
  width,
  height,
  entryX,
  returnBuilding,
  returnSceneId = "town",
  musicKey = "town1",
}) {
  const scene = {
    id,
    kind: "interior",
    map: createInteriorMap(width, height, entryX),
    width,
    height,
    buildings: [],
    interactables: [],
    objects: [],
    npcs: [],
    areaKey,
    musicKey,
    entry: { x: entryX, y: height - 2, dir: "up" },
    exit: {
      x: entryX,
      y: height - 1,
      returnSceneId,
      returnX: returnBuilding.doorX,
      returnY: returnBuilding.doorY + 1,
      returnDir: "down",
    },
  };

  scene.interactables.push({
    labelKey: "object.exit",
    x: scene.exit.x,
    y: scene.exit.y,
    solid: false,
    kind: "exit",
  });

  return scene;
}

function createInteriorMap(width, height, exitX) {
  const interiorMap = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "floor"),
  );

  for (let x = 0; x < width; x += 1) {
    interiorMap[0][x] = "wall";
    interiorMap[height - 1][x] = x === exitX ? "exit" : "wall";
  }

  for (let y = 0; y < height; y += 1) {
    interiorMap[y][0] = "wall";
    interiorMap[y][width - 1] = "wall";
  }

  interiorMap[height - 1][exitX] = "exit";
  return interiorMap;
}

function fillInteriorTile(scene, x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx > 0 && yy > 0 && xx < scene.width - 1 && yy < scene.height - 1) {
        scene.map[yy][xx] = type;
      }
    }
  }
}

function placeInteriorObject(scene, x, y, type, labelKey, options = {}) {
  if (x <= 0 || y <= 0 || x >= scene.width - 1 || y >= scene.height - 1) return;
  scene.objects.push({ x, y, w: 1, h: 1, type });
  addInteriorObjectInteraction(scene, x, y, labelKey, options);
}

function fillInteriorObject(scene, x, y, w, h, type, labelKey, options = {}) {
  scene.objects.push({ x, y, w, h, type });
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx > 0 && yy > 0 && xx < scene.width - 1 && yy < scene.height - 1) {
        addInteriorObjectInteraction(scene, xx, yy, labelKey, options);
      }
    }
  }
}

function addInteriorObjectInteraction(scene, x, y, labelKey, options = {}) {
  scene.interactables.push({
    labelKey,
    x,
    y,
    solid: options.solid ?? true,
    kind: options.kind || "furniture",
    conversationKeys: options.conversationKeys || null,
    drillKey: options.drillKey || null,
    drillResolver: options.drillResolver || null,
    conversationResolver: options.conversationResolver || null,
    requiredFlags: options.requiredFlags || null,
    lockedConversationKeys: options.lockedConversationKeys || null,
    studyBoardKey: options.studyBoardKey || null,
    studyBoardResolver: options.studyBoardResolver || null,
    progressFlagOnStudyBoard: options.progressFlagOnStudyBoard || null,
    progressFlagsOnStudyBoardResolver: options.progressFlagsOnStudyBoardResolver || null,
  });
}

function addInteriorNpc(scene, npc) {
  scene.npcs.push({
    nextTurn: 0,
    kind: "adult",
    wander: false,
    voiceGender: "female",
    voiceId: npc.nameKey,
    ...npc,
  });
}

function resize() {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function tileAt(x, y) {
  const scene = currentScene();
  if (x < 0 || y < 0 || x >= scene.width || y >= scene.height) return "void";
  return scene.map[y][x];
}

function isBuildingDoor(building, x, y) {
  return x === building.doorX && y === building.doorY;
}

function isBuildingBlocked(x, y) {
  return currentScene().buildings.some((building) => {
    const inside =
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h;
    return inside && !isBuildingDoor(building, x, y);
  });
}

function isNpcAt(x, y) {
  return currentScene().npcs.some((npc) => npc.x === x && npc.y === y);
}

function isSolidInteractive(x, y) {
  return currentScene().interactables.some((item) => item.solid && item.x === x && item.y === y);
}

function isBlocked(x, y) {
  const tile = tileAt(x, y);
  if (tile === "void") return true;
  if (SOLID_TILES.has(tile)) return true;
  if (isBuildingBlocked(x, y)) return true;
  if (isNpcAt(x, y)) return true;
  if (isSolidInteractive(x, y)) return true;
  return false;
}

function getFacingTile() {
  const dir = DIRS[player.dir];
  return {
    x: player.tileX + dir.x,
    y: player.tileY + dir.y,
  };
}

function getInteractionTarget() {
  const scene = currentScene();
  const facing = getFacingTile();
  const spots = [
    { x: facing.x, y: facing.y },
    { x: player.tileX, y: player.tileY },
  ];

  for (const spot of spots) {
    const npc = scene.npcs.find((person) => person.x === spot.x && person.y === spot.y);
    if (npc) return { type: "npc", labelKey: npc.nameKey, npc };

    const item = scene.interactables.find((candidate) => candidate.x === spot.x && candidate.y === spot.y);
    if (item) return { type: item.kind, labelKey: item.labelKey, item };
  }

  const building = scene.buildings.find((place) => {
    const nearX = facing.x >= place.x && facing.x < place.x + place.w;
    const nearY = facing.y >= place.y && facing.y < place.y + place.h;
    return nearX && nearY;
  });
  if (building) return { type: "building", labelKey: building.labelKey, building };

  return null;
}

function hasRequiredProgress(source) {
  return (source.requiredFlags || []).every((flag) => hasProgressFlag(flag));
}

function resolveInteractionDrill(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.drillResolver === "function") return source.drillResolver();
  return source.drillKey || null;
}

function resolveInteractionStudyBoard(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.studyBoardResolver === "function") return source.studyBoardResolver();
  return source.studyBoardKey || null;
}

function resolveInteractionStudyBoardProgressFlags(source) {
  if (!source) return [];
  const flags = [];
  if (source.progressFlagOnStudyBoard) flags.push(source.progressFlagOnStudyBoard);
  if (typeof source.progressFlagsOnStudyBoardResolver === "function") {
    flags.push(...source.progressFlagsOnStudyBoardResolver());
  }
  return flags;
}

function resolveInteractionConversationKeys(source) {
  if (!source) return null;
  if (typeof source.conversationResolver === "function") return source.conversationResolver();
  if (!hasRequiredProgress(source) && source.lockedConversationKeys) return source.lockedConversationKeys;
  if (source.conversationPools?.length) {
    return source.conversationPools[Math.floor(Math.random() * source.conversationPools.length)];
  }
  return source.conversationKeys || null;
}

function toDialogLines(entries) {
  return entries.map((entry) => (typeof entry === "string" ? { key: entry } : entry));
}

function openDialogFor(target) {
  if (!target) return;
  stopSpeech();

  if (target.npc) {
    if (target.npc.progressFlagOnTalk) setProgressFlag(target.npc.progressFlagOnTalk);
    if (typeof target.npc.progressFlagsOnTalkResolver === "function") {
      setProgressFlags(target.npc.progressFlagsOnTalkResolver());
    }

    const npcDrillKey = resolveInteractionDrill(target.npc);
    if (npcDrillKey) {
      startDrill(npcDrillKey);
      return;
    }

    const opposite = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    target.npc.dir = opposite[player.dir];
    const conversationKeys = resolveInteractionConversationKeys(target.npc) || ["interaction.default"];
    dialog = {
      lines: toDialogLines(conversationKeys),
      index: 0,
      spoken: true,
      textVisible: false,
      speaking: false,
      speechToken: 0,
      voiceRetry: false,
      voiceProfile: {
        gender: target.npc.voiceGender,
        id: target.npc.voiceId || target.npc.nameKey,
        nameKey: target.npc.nameKey,
      },
    };
    speakDialogLine();
    return;
  }

  const itemStudyBoardKey = resolveInteractionStudyBoard(target.item);
  if (itemStudyBoardKey) {
    setProgressFlags(resolveInteractionStudyBoardProgressFlags(target.item));
    openStudyBoard(itemStudyBoardKey);
    return;
  }

  const itemDrillKey = resolveInteractionDrill(target.item);
  if (itemDrillKey) {
    startDrill(itemDrillKey);
    return;
  }

  const conversationKeys = resolveInteractionConversationKeys(target.item);
  if (conversationKeys) {
    dialog = {
      lines: toDialogLines(conversationKeys),
      index: 0,
      spoken: false,
      textVisible: true,
    };
    return;
  }

  dialog = {
    lines: [{ key: "interaction.default", targetKey: target.labelKey }],
    index: 0,
    spoken: false,
    textVisible: true,
  };
}

function openStudyBoard(studyBoardKey) {
  if (!STUDY_BOARDS[studyBoardKey]) return;
  stopSpeech();
  dialog = null;
  drill = null;
  studyBoard = studyBoardKey;
  markStudyBoardHangulItemsSeen(studyBoardKey);
  markWordsSeen(STUDY_BOARD_WORD_ITEMS[studyBoardKey] || []);
  scheduleSave();
  clearMovementInput();
}

function closeStudyBoard() {
  studyBoard = null;
  clearMovementInput();
}

function handleStudyBoardInput(event) {
  if (!studyBoard) return;
  if (event.code in keyToDir) {
    event.preventDefault();
    return;
  }
  if (event.code === "Space" || event.code === "Enter" || event.code === "Escape") {
    event.preventDefault();
    closeStudyBoard();
  }
}

function dialogLineText(language = activeLanguage()) {
  if (!dialog) return "";
  const line = dialog.lines[dialog.index];
  const params = { ...(line.params || {}) };
  if (line.targetKey) params.target = t(line.targetKey, {}, language);
  return t(line.key, params, language);
}

function dialogDisplayText() {
  if (!dialog) return "";
  return dialog.textVisible ? dialogLineText() : "";
}

function advanceDialog() {
  if (!dialog) return;
  if (dialog.spoken && !dialog.textVisible) {
    dialog.textVisible = true;
    return;
  }

  if (dialog.index < dialog.lines.length - 1) {
    stopSpeech();
    dialog.index += 1;
    dialog.textVisible = !dialog.spoken;
    dialog.speaking = false;
    dialog.voiceRetry = false;
    if (dialog.spoken) speakDialogLine();
    return;
  }
  dialog = null;
}

function startDrill(drillKey) {
  const data = DRILLS[drillKey];
  if (!data) return;
  const runData = buildDrillRun(data);
  if (!runData.steps.length) return;
  markHangulItemsSeen(runData.steps.flatMap((step) => hangulStepSeenItemIds(step)));
  markWordsSeen(runData.steps.flatMap((step) => step.wordIds || []));
  markWordsSeen(runData.wordIds || []);

  stopSpeech();
  dialog = null;
  drill = {
    key: drillKey,
    data: runData,
    index: 0,
    selected: 0,
    answered: false,
    complete: false,
    feedbackKey: null,
    feedbackParams: null,
    correctCount: 0,
    passed: false,
    completionApplied: false,
  };
  clearMovementInput();
}

function currentDrillData() {
  return drill ? drill.data : null;
}

function currentDrillStep() {
  const data = currentDrillData();
  if (!data || drill.complete) return null;
  return data.steps[drill.index] || null;
}

function closeDrill() {
  drill = null;
  clearMovementInput();
}

function advanceDrill() {
  const data = currentDrillData();
  if (!data) return;

  if (drill.index >= data.steps.length - 1) {
    completeDrillRun();
    return;
  }

  drill.index += 1;
  drill.selected = 0;
  drill.answered = false;
  drill.feedbackKey = null;
  drill.feedbackParams = null;
}

function drillPassThreshold(data) {
  return data.passCorrectCount ?? data.steps.length;
}

function drillRunPassed() {
  const data = currentDrillData();
  if (!data) return false;
  return drill.correctCount >= drillPassThreshold(data);
}

function completeDrillRun() {
  const data = currentDrillData();
  if (!data) return;

  drill.complete = true;
  drill.answered = false;
  drill.feedbackKey = null;
  drill.feedbackParams = null;
  drill.passed = drillRunPassed();

  if (!drill.completionApplied) {
    if (drill.passed) setProgressFlags(data.completionFlags || []);
    drill.completionApplied = true;
  }
}

function answerDrillStep() {
  const step = currentDrillStep();
  if (!step || drill.answered) return;

  const correct = drill.selected === step.answer;
  if (correct) drill.correctCount += 1;
  recordHangulAnswer(hangulStepMasteryItemIds(step), correct);
  recordWordAnswer(step.wordIds || [], correct);
  drill.answered = true;
  drill.feedbackKey = correct ? step.correctKey : step.incorrectKey;
  drill.feedbackParams = correct ? step.correctParams : step.incorrectParams;
}

function moveDrillCursor(delta) {
  const step = currentDrillStep();
  if (!step || drill.answered) return;

  const count = step.choices.length;
  drill.selected = (drill.selected + delta + count) % count;
}

function handleDrillInput(event) {
  if (!drill) return;

  const dir = keyToDir[event.code];
  if (dir === "up" || dir === "down" || dir === "left" || dir === "right") {
    event.preventDefault();
    moveDrillCursor(dir === "down" || dir === "right" ? 1 : -1);
    return;
  }

  if (event.code === "Escape") {
    event.preventDefault();
    closeDrill();
    return;
  }

  if (event.code !== "Space" && event.code !== "Enter") return;

  event.preventDefault();
  if (drill.complete) {
    closeDrill();
  } else if (drill.answered) {
    advanceDrill();
  } else {
    answerDrillStep();
  }
}

function toggleMainMenu() {
  ui.eraseArmed = false;
  if (ui.menuOpen) {
    ui.menuOpen = false;
    return;
  }

  ui.menuOpen = true;
  ui.menuScreen = "main";
  ui.menuIndex = 0;
}

function handleMenuInput(event) {
  const dir = keyToDir[event.code];

  if (ui.menuScreen === "dictionary") {
    handleDictionaryMenuInput(event, dir);
    return;
  }

  if (ui.menuScreen === "words") {
    handleWordMenuInput(event, dir);
    return;
  }

  if (ui.menuScreen === "journal") {
    handleJournalMenuInput(event, dir);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    ui.eraseArmed = false;
    moveMenuCursor(dir === "down" ? 1 : -1);
    return;
  }

  if (ui.menuScreen === "settings" && (dir === "left" || dir === "right")) {
    event.preventDefault();
    adjustCurrentSetting(dir === "right" ? 1 : -1);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    selectMenuItem();
  }
}

function handleWordMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    moveWordCategory(dir === "right" ? 1 : -1);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    moveWordPage(dir === "down" ? 1 : -1);
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "words");
  }
}

function moveWordCategory(delta) {
  const count = WORD_CATEGORY_IDS.length;
  ui.wordCategoryIndex = (ui.wordCategoryIndex + delta + count) % count;
  ui.wordPage = 0;
}

function moveWordPage(delta) {
  const categoryId = WORD_CATEGORY_IDS[ui.wordCategoryIndex];
  const totalRows = wordItemsByCategory(categoryId).length;
  const pages = Math.max(1, Math.ceil(totalRows / hangulDictionaryPageSize()));
  ui.wordPage = (ui.wordPage + delta + pages) % pages;
}

function handleJournalMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    const count = QUEST_CHAPTERS.length;
    ui.journalChapterIndex = (ui.journalChapterIndex + (dir === "right" ? 1 : -1) + count) % count;
    ui.journalQuestIndex = 0;
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    const chapter = QUEST_CHAPTERS[ui.journalChapterIndex];
    const count = chapter.quests.length;
    ui.journalQuestIndex = (ui.journalQuestIndex + (dir === "down" ? 1 : -1) + count) % count;
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "journal");
  }
}

function moveMenuCursor(delta) {
  const count = ui.menuScreen === "main" ? mainMenuItems.length : settingsRows.length;
  ui.menuIndex = (ui.menuIndex + delta + count) % count;
}

function selectMenuItem() {
  if (ui.menuScreen === "main") {
    const action = mainMenuItems[ui.menuIndex].action;
    if (action === "return") {
      ui.quit = false;
      ui.menuOpen = false;
      updateMusicForScene();
    } else if (action === "journal") {
      ui.menuScreen = "journal";
      ui.journalQuestIndex = 0;
    } else if (action === "dictionary") {
      ui.menuScreen = "dictionary";
      ui.dictionaryPage = 0;
    } else if (action === "words") {
      ui.menuScreen = "words";
      ui.wordPage = 0;
    } else if (action === "settings") {
      ui.menuScreen = "settings";
      ui.menuIndex = 0;
      ui.eraseArmed = false;
    } else if (action === "quit") {
      dialog = null;
      stopSpeech();
      pauseCurrentMusic();
      ui.quit = true;
      ui.menuOpen = false;
    }
    return;
  }

  const row = settingsRows[ui.menuIndex];
  if (row === "back") {
    ui.eraseArmed = false;
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "settings");
  } else if (row === "erase") {
    if (ui.eraseArmed) {
      eraseSaveAndReload();
    } else {
      ui.eraseArmed = true;
    }
  } else if (row === "speech") {
    cycleSpeechLanguage(1);
    scheduleSave();
  } else {
    cycleLanguage(row, 1);
    scheduleSave();
  }
}

function handleDictionaryMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    moveDictionaryCategory(dir === "right" ? 1 : -1);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    moveDictionaryPage(dir === "down" ? 1 : -1);
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "dictionary");
  }
}

function moveDictionaryCategory(delta) {
  const count = HANGUL_DICTIONARY_CATEGORIES.length;
  ui.dictionaryCategoryIndex = (ui.dictionaryCategoryIndex + delta + count) % count;
  ui.dictionaryPage = 0;
}

function moveDictionaryPage(delta) {
  const category = currentHangulDictionaryCategory();
  const totalRows = hangulDictionaryDisplayItemIds(category).length;
  const pages = Math.max(1, Math.ceil(totalRows / hangulDictionaryPageSize()));
  ui.dictionaryPage = (ui.dictionaryPage + delta + pages) % pages;
}

function adjustCurrentSetting(delta) {
  const row = settingsRows[ui.menuIndex];
  if (row === "primary" || row === "secondary") {
    cycleLanguage(row, delta);
    scheduleSave();
  } else if (row === "speech") {
    cycleSpeechLanguage(delta);
    scheduleSave();
  }
}

function cycleLanguage(settingName, delta) {
  const currentIndex = LANGUAGES.findIndex((language) => language.code === settings[settingName]);
  const nextIndex = (currentIndex + delta + LANGUAGES.length) % LANGUAGES.length;
  settings[settingName] = LANGUAGES[nextIndex].code;
}

function currentHangulDictionaryCategory() {
  return HANGUL_DICTIONARY_CATEGORIES[ui.dictionaryCategoryIndex] || HANGUL_DICTIONARY_CATEGORIES[0];
}

function hangulDictionaryDisplayItemIds(category) {
  const itemIds = (category?.itemIds || []).filter((itemId) => HANGUL_ITEMS[itemId]);
  if (!category?.encounteredOnly) return itemIds;
  return itemIds.filter((itemId) => hangulItemSeen(itemId));
}

function hangulDictionaryPageSize() {
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  return Math.max(4, Math.floor((window.innerHeight - 190) / rowHeight));
}

function hangulDictionaryStatusKey(itemId) {
  const entry = hangulItemProgress(itemId);
  if (!entry?.seen) return "dictionary.hangul.status.unseen";
  if (entry.mastered) return "dictionary.hangul.status.mastered";
  if (entry.attempts > 0) return "dictionary.hangul.status.learning";
  return "dictionary.hangul.status.seen";
}

function handleMovementPress(dirName) {
  if (ui.menuOpen || ui.quit || dialog || drill || studyBoard || player.moving) return;

  if (player.dir !== dirName) {
    player.dir = dirName;
    movementInput.holdDelay = 0.12;
    return;
  }

  movementInput.holdDelay = 0;
  beginMove(dirName);
}

function beginMove(dirName) {
  const dir = DIRS[dirName];
  const nextX = player.tileX + dir.x;
  const nextY = player.tileY + dir.y;
  player.dir = dirName;

  if (isBlocked(nextX, nextY)) return;

  player.moving = true;
  player.fromX = player.tileX;
  player.fromY = player.tileY;
  player.toX = nextX;
  player.toY = nextY;
  player.moveTime = 0;
}

function updatePlayer(dt) {
  if (player.moving) {
    player.moveTime += dt;
    const t = Math.min(player.moveTime / player.moveDuration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    player.px = lerp(player.fromX * TILE, player.toX * TILE, eased);
    player.py = lerp(player.fromY * TILE, player.toY * TILE, eased);

    if (t >= 1) {
      player.moving = false;
      player.tileX = player.toX;
      player.tileY = player.toY;
      player.px = player.tileX * TILE;
      player.py = player.tileY * TILE;
      if (handleStepTrigger()) return;
    }
    return;
  }

  processHeldMovement(dt);
}

function processHeldMovement(dt) {
  if (ui.menuOpen || ui.quit || dialog || drill || studyBoard || player.moving) return;

  const dir = currentHeldDirection();
  if (!dir) {
    movementInput.holdDelay = 0;
    return;
  }

  if (player.dir !== dir) {
    player.dir = dir;
    movementInput.holdDelay = 0.12;
    return;
  }

  if (movementInput.holdDelay > 0) {
    movementInput.holdDelay = Math.max(0, movementInput.holdDelay - dt);
    if (movementInput.holdDelay > 0) return;
  }

  beginMove(dir);
}

function handleStepTrigger() {
  const scene = currentScene();
  const item = scene.interactables.find(
    (candidate) => candidate.x === player.tileX && candidate.y === player.tileY,
  );

  if (item?.kind === "route" && item.targetSceneId) {
    if (!hasRequiredProgress(item)) {
      if (item.lockedConversationKeys && !dialog) {
        dialog = {
          lines: item.lockedConversationKeys.map((key) => ({ key })),
          index: 0,
          spoken: false,
          textVisible: true,
        };
      }
      return false;
    }
    const nextScene = scenes[item.targetSceneId];
    if (nextScene) {
      changeScene(
        nextScene.id,
        item.targetX ?? player.tileX,
        item.targetY ?? player.tileY,
        item.targetDir || player.dir,
      );
      return true;
    }
  }

  if (scene.kind === "outdoor" && item?.kind === "door" && item.sceneId) {
    const nextScene = scenes[item.sceneId];
    if (nextScene) {
      changeScene(nextScene.id, nextScene.entry.x, nextScene.entry.y, nextScene.entry.dir);
      return true;
    }
  }

  if (scene.kind === "interior" && item?.kind === "exit" && scene.exit) {
    changeScene(
      scene.exit.returnSceneId,
      scene.exit.returnX,
      scene.exit.returnY,
      scene.exit.returnDir,
    );
    return true;
  }

  return false;
}

function updateNpcs(now) {
  const dirs = Object.keys(DIRS);
  const scene = currentScene();
  for (const npc of scene.npcs) {
    if (!npc.nextTurn) {
      npc.nextTurn = now + randomBetween(1200, 3600);
    }
    if (now >= npc.nextTurn && !dialog && !drill && !studyBoard && !ui.menuOpen && !ui.quit) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      if (npc.wander && Math.random() > 0.45) {
        tryMoveNpc(scene, npc, dir);
      } else {
        npc.dir = dir;
      }
      npc.nextTurn = now + randomBetween(1800, 5200);
    }
  }
}

function tryMoveNpc(scene, npc, dirName) {
  const dir = DIRS[dirName];
  const nextX = npc.x + dir.x;
  const nextY = npc.y + dir.y;
  npc.dir = dirName;

  if (canNpcMoveTo(scene, npc, nextX, nextY)) {
    npc.x = nextX;
    npc.y = nextY;
  }
}

function canNpcMoveTo(scene, npc, x, y) {
  const tile = tileAt(x, y);
  if (tile === "void" || SOLID_TILES.has(tile) || tile === "exit") return false;
  if (scene.buildings.some((building) => {
    const inside =
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h;
    return inside && !isBuildingDoor(building, x, y);
  })) return false;
  if (scene.interactables.some((item) => item.solid && item.x === x && item.y === y)) return false;
  if (scene.npcs.some((other) => other !== npc && other.x === x && other.y === y)) return false;
  if (player.tileX === x && player.tileY === y) return false;
  return true;
}

function update(dt, now) {
  updatePlayer(dt);
  updateNpcs(now);
  updateCamera();
}

function updateCamera() {
  const scene = currentScene();
  const scenePixelWidth = scene.width * TILE;
  const scenePixelHeight = scene.height * TILE;

  if (scene.kind === "interior" && scenePixelWidth <= window.innerWidth) {
    cameraX = -(window.innerWidth - scenePixelWidth) / 2;
  } else {
    cameraX = player.px + TILE / 2 - window.innerWidth / 2;
  }

  if (scene.kind === "interior" && scenePixelHeight <= window.innerHeight) {
    cameraY = -(window.innerHeight - scenePixelHeight) / 2;
  } else {
    cameraY = player.py + TILE / 2 - window.innerHeight / 2;
  }
}

function draw() {
  const scene = currentScene();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = COLORS.void;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const startX = Math.floor(cameraX / TILE) - 1;
  const startY = Math.floor(cameraY / TILE) - 1;
  const endX = Math.ceil((cameraX + window.innerWidth) / TILE) + 1;
  const endY = Math.ceil((cameraY + window.innerHeight) / TILE) + 1;

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      drawTile(x, y);
    }
  }

  for (const building of scene.buildings) drawBuilding(building);
  if (scene.kind === "outdoor") drawOutdoorObjects(scene);
  drawInteractables();
  if (scene.kind === "interior") drawInteriorObjects(scene);

  const sortedCharacters = [...scene.npcs, player].sort((a, b) => {
    const ay = "tileY" in a ? a.tileY : a.y;
    const by = "tileY" in b ? b.tileY : b.y;
    return ay - by;
  });

  for (const character of sortedCharacters) {
    if (character === player) drawPlayer();
    else drawNpc(character);
  }

  drawInfoPanel();

  if (ui.quit) drawQuitScreen();
  if (dialog && !ui.quit) drawDialog(dialogDisplayText());
  if (studyBoard && !ui.quit) drawStudyBoard();
  if (drill && !ui.quit) drawDrill();
  if (ui.menuOpen) drawMenu();
}

function drawTile(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  const type = tileAt(tx, ty);

  if (type === "void") {
    ctx.fillStyle = COLORS.void;
    ctx.fillRect(x, y, TILE, TILE);
    return;
  }

  if (currentScene().kind === "interior") {
    drawInteriorTile(x, y, tx, ty, type);
    return;
  }

  if (type === "bridge") {
    drawWater(x, y, tx, ty);
    return;
  }

  if (
    type === "grass" ||
    type === "flowers" ||
    type === "tree" ||
    type === "hedge" ||
    type === "ledge" ||
    type === "tallGrass"
  ) {
    drawGrass(x, y, tx, ty);
  }

  if (type === "path") drawPath(x, y, tx, ty);
  if (type === "sand") drawSand(x, y, tx, ty);
  if (type === "water") drawWater(x, y, tx, ty);
  if (type === "stone") drawStone(x, y, tx, ty);
  if (type === "hedge") drawHedge(x, y, tx, ty);
  if (type === "tree") drawTreeTile(x, y, tx, ty);
  if (type === "flowers") drawFlowers(x, y, tx, ty);
  if (type === "tallGrass") drawTallGrass(x, y, tx, ty);
  if (type === "ledge") drawLedge(x, y);
}

function drawOutdoorObjects(scene) {
  const objects = [...(scene.objects || [])].sort(
    (a, b) => a.y + a.h - (b.y + b.h) || a.x - b.x,
  );

  for (const object of objects) {
    drawOutdoorObject(object);
  }
}

function drawOutdoorObject(object) {
  const x = Math.floor(object.x * TILE - cameraX);
  const y = Math.floor(object.y * TILE - cameraY);
  const w = object.w * TILE;
  const h = object.h * TILE;

  if (x + w < 0 || y + h < 0 || x > window.innerWidth || y > window.innerHeight) return;

  if (object.type === "trailBridge") {
    drawTrailBridgeObject(x, y, w, h);
    return;
  }

  if (object.type === "trailGate") {
    drawTrailGateObject(x, y, w, h);
    return;
  }

  if (object.type === "trailRestTable") {
    drawTrailRestTableObject(x, y, w, h);
    return;
  }

  if (object.type === "soundFountain") {
    drawSoundFountainObject(x, y, w, h);
    return;
  }

  if (object.type === "speechBench") {
    drawSpeechBenchObject(x, y, w, h);
    return;
  }

  if (object.type === "routeObjectStall") {
    drawRouteObjectStallObject(x, y, w, h);
  }
}

function drawInteriorObjects(scene) {
  const objects = [...(scene.objects || [])].sort(
    (a, b) => a.y + a.h - (b.y + b.h) || a.x - b.x,
  );

  for (const object of objects) {
    drawFurnitureObject(object);
  }
}

function drawInteriorTile(x, y, tx, ty, type) {
  if (type === "wall") {
    drawInteriorWall(x, y, tx, ty);
    return;
  }

  drawInteriorFloor(x, y, tx, ty);

  if (type === "tatami") drawMat(x, y, tx, ty, type, "#c9b86f", "#887b45");
  if (type === "carpetRed") drawMat(x, y, tx, ty, type, "#b85c54", "#7c3734");
  if (type === "carpetBlue") drawMat(x, y, tx, ty, type, "#5a82b4", "#36567d");
  if (type === "carpetGreen") drawMat(x, y, tx, ty, type, "#6f9a57", "#426436");
  if (type === "exit") drawInteriorExit(x, y);

  if (
    [
      "bed",
      "bookcase",
      "brochureRack",
      "chair",
      "counter",
      "cushion",
      "desk",
      "fish",
      "fridge",
      "mapBoard",
      "produce",
      "sink",
      "stove",
      "supplyShelf",
      "table",
      "teaTable",
      "tv",
    ].includes(type)
  ) {
    drawFurnitureTile(x, y, type, tx, ty);
  }
}

function drawInteriorFloor(x, y, tx, ty) {
  ctx.fillStyle = "#caa66f";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = (tx + ty) % 2 === 0 ? "#d6b77d" : "#bd945f";
  ctx.fillRect(x, y + TILE - 4, TILE, 4);
  if (seeded(tx, ty) > 0.64) {
    ctx.fillStyle = "#b48656";
    ctx.fillRect(x + 7, y + 12, 8, 2);
  }
}

function drawInteriorWall(x, y, tx, ty) {
  ctx.fillStyle = "#b99068";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#8d6849";
  ctx.fillRect(x, y + 21, TILE, 11);
  ctx.fillStyle = "#d8bd8a";
  ctx.fillRect(x + 3, y + 4, TILE - 6, 7);
  if (seeded(tx, ty) > 0.6) {
    ctx.fillStyle = "#6b4f3d";
    ctx.fillRect(x + 8, y + 23, 11, 3);
  }
}

function drawMat(x, y, tx, ty, type, fill, border) {
  const sameUp = tileAt(tx, ty - 1) === type;
  const sameDown = tileAt(tx, ty + 1) === type;
  const sameLeft = tileAt(tx - 1, ty) === type;
  const sameRight = tileAt(tx + 1, ty) === type;
  const leftInset = sameLeft ? 0 : 2;
  const rightInset = sameRight ? 0 : 2;
  const topInset = sameUp ? 0 : 2;
  const bottomInset = sameDown ? 0 : 2;

  ctx.fillStyle = fill;
  ctx.fillRect(
    x + leftInset,
    y + topInset,
    TILE - leftInset - rightInset,
    TILE - topInset - bottomInset,
  );

  ctx.fillStyle = border;
  if (!sameUp) ctx.fillRect(x + leftInset, y + 2, TILE - leftInset - rightInset, 3);
  if (!sameDown) ctx.fillRect(x + leftInset, y + TILE - 5, TILE - leftInset - rightInset, 3);
  if (!sameLeft) ctx.fillRect(x + 2, y + topInset, 3, TILE - topInset - bottomInset);
  if (!sameRight) ctx.fillRect(x + TILE - 5, y + topInset, 3, TILE - topInset - bottomInset);
}

function drawInteriorExit(x, y) {
  ctx.fillStyle = "#2b2020";
  ctx.fillRect(x + 5, y + 3, TILE - 10, TILE - 3);
  ctx.fillStyle = "#7a5130";
  ctx.fillRect(x + 9, y + 5, TILE - 18, TILE - 5);
  ctx.fillStyle = "#c79c55";
  ctx.fillRect(x + TILE - 13, y + 17, 3, 3);
}

function drawFurnitureObject(object) {
  const x = Math.floor(object.x * TILE - cameraX);
  const y = Math.floor(object.y * TILE - cameraY);
  const w = object.w * TILE;
  const h = object.h * TILE;

  if (x + w < 0 || y + h < 0 || x > window.innerWidth || y > window.innerHeight) return;

  if (object.type === "bed") {
    drawBedObject(x, y, w, h);
    return;
  }

  if (
    object.type === "table" ||
    object.type === "teaTable" ||
    object.type === "desk" ||
    object.type === "studentDesk" ||
    object.type === "teacherDesk"
  ) {
    drawTableObject(x, y, w, h, object.type);
    return;
  }

  if (object.type === "blackboard") {
    drawBlackboardObject(x, y, w, h);
    return;
  }

  if (object.type === "counter") {
    drawCounterObject(x, y, w, h);
    return;
  }

  if (object.type === "bookcase" || object.type === "brochureRack") {
    drawRackObject(x, y, w, h, object.type);
    return;
  }

  if (object.type === "mapBoard") {
    drawMapBoardObject(x, y, w, h);
    return;
  }

  for (let yy = 0; yy < object.h; yy += 1) {
    for (let xx = 0; xx < object.w; xx += 1) {
      drawFurnitureTile(
        x + xx * TILE,
        y + yy * TILE,
        object.type,
        object.x + xx,
        object.y + yy,
      );
    }
  }
}

function drawObjectShadow(x, y, w, h) {
  ctx.fillStyle = "rgba(36, 25, 18, 0.22)";
  ctx.fillRect(x + 4, y + h - 6, w - 8, 4);
}

function drawBedObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#87543f";
  ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
  ctx.fillStyle = "#5f392d";
  ctx.fillRect(x + 4, y + 4, w - 8, 8);
  ctx.fillStyle = "#f4e4c5";
  ctx.fillRect(x + 10, y + 11, w - 20, Math.max(10, Math.floor(h * 0.22)));
  ctx.fillStyle = "#6f90b9";
  ctx.fillRect(x + 10, y + Math.floor(h * 0.36), w - 20, h - Math.floor(h * 0.48));
  ctx.fillStyle = "#55789f";
  ctx.fillRect(x + 10, y + h - 18, w - 20, 6);
}

function drawTableObject(x, y, w, h, type) {
  drawObjectShadow(x, y, w, h);
  const topHeight = Math.max(8, Math.min(18, Math.floor(h * 0.34)));
  const bodyColor = type === "teaTable" ? "#7d5736" : type === "studentDesk" ? "#765432" : "#805535";
  const topColor =
    type === "desk" || type === "studentDesk" || type === "teacherDesk" ? "#c6975f" : "#b8804d";

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 6, y + topHeight + 5, w - 12, h - topHeight - 11);
  ctx.fillStyle = topColor;
  ctx.fillRect(x + 4, y + 5, w - 8, topHeight);
  ctx.fillStyle = "rgba(255, 236, 190, 0.35)";
  ctx.fillRect(x + 7, y + 7, w - 14, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 8, y + h - 10, 5, 7);
  ctx.fillRect(x + w - 13, y + h - 10, 5, 7);

  if (w > TILE) {
    ctx.fillRect(x + Math.floor(w / 2) - 2, y + h - 9, 4, 6);
  }

  if (type === "desk" || type === "studentDesk" || type === "teacherDesk") {
    ctx.fillStyle = "#f0e6bf";
    ctx.fillRect(x + 11, y + 8, Math.min(22, w - 22), 5);
    ctx.fillStyle = "#6d4e35";
    ctx.fillRect(x + w - 24, y + 9, 13, 3);
  }

  if (type === "studentDesk") {
    ctx.fillStyle = "#4d7fab";
    ctx.fillRect(x + w - 35, y + 8, 18, 7);
    ctx.fillStyle = "#f4d36b";
    ctx.fillRect(x + w - 32, y + 10, 12, 2);
  }

  if (type === "teacherDesk") {
    ctx.fillStyle = "#9b5f42";
    ctx.fillRect(x + w - 35, y + 8, 12, 8);
    ctx.fillStyle = "#f0e6bf";
    ctx.fillRect(x + 38, y + 8, 28, 6);
  }
}

function drawBlackboardObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#5c412c";
  ctx.fillRect(x + 3, y + 5, w - 6, h - 8);
  ctx.fillStyle = "#244d3a";
  ctx.fillRect(x + 7, y + 8, w - 14, h - 16);
  ctx.fillStyle = "#dfe8d8";
  ctx.font = `14px ${UI_FONT}`;
  ctx.textBaseline = "top";
  ctx.fillText("ㄱ + ㅏ", x + 14, y + 11);
  ctx.fillStyle = "#e6d9b6";
  ctx.fillRect(x + w - 42, y + h - 10, 28, 3);
}

function drawCounterObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 2, y + 7, w - 4, h - 8);
  ctx.fillStyle = "#c49352";
  ctx.fillRect(x + 2, y + 4, w - 4, 8);
  ctx.fillStyle = "rgba(255, 232, 176, 0.38)";
  ctx.fillRect(x + 6, y + 6, w - 12, 2);
  ctx.fillStyle = "#4a3322";
  ctx.fillRect(x + 5, y + h - 9, w - 10, 5);

  for (let xx = x + TILE; xx < x + w - 4; xx += TILE) {
    ctx.fillStyle = "rgba(52, 34, 22, 0.35)";
    ctx.fillRect(xx - 1, y + 12, 2, h - 21);
  }
}

function drawRackObject(x, y, w, h, type) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4d35";
  ctx.fillRect(x + 5, y + 3, w - 10, h - 6);
  ctx.fillStyle = "#4e3526";
  ctx.fillRect(x + 5, y + 3, w - 10, 5);

  for (let shelfY = y + 14; shelfY < y + h - 4; shelfY += 12) {
    ctx.fillStyle = "#b78550";
    ctx.fillRect(x + 7, shelfY, w - 14, 3);
  }

  const colors = type === "bookcase" ? ["#b54848", "#4d7fab", "#d6bd57"] : ["#f0e6bf", "#68a7bd", "#d28a58"];
  let slot = 0;
  for (let shelfY = y + 7; shelfY < y + h - 13; shelfY += 12) {
    for (let bookX = x + 9; bookX < x + w - 10; bookX += 7) {
      ctx.fillStyle = colors[slot % colors.length];
      ctx.fillRect(bookX, shelfY, 4, 8);
      slot += 1;
    }
  }
}

function drawMapBoardObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#544234";
  ctx.fillRect(x + 3, y + 5, w - 6, h - 10);
  ctx.fillStyle = "#d7c28a";
  ctx.fillRect(x + 7, y + 8, w - 14, h - 16);
  ctx.fillStyle = "#6fa05a";
  ctx.fillRect(x + 12, y + 12, Math.max(12, Math.floor(w * 0.22)), Math.max(5, h - 24));
  ctx.fillStyle = "#4a7fb0";
  ctx.fillRect(x + Math.floor(w * 0.58), y + 14, Math.max(12, Math.floor(w * 0.18)), 5);
  ctx.fillStyle = "#b46b4c";
  ctx.fillRect(x + Math.floor(w * 0.34), y + 18, Math.max(26, Math.floor(w * 0.3)), 3);
}

function drawFurnitureTile(x, y, type, tx, ty) {
  if (type === "bed") {
    ctx.fillStyle = "#87543f";
    ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    ctx.fillStyle = "#f4e4c5";
    ctx.fillRect(x + 7, y + 7, TILE - 14, 8);
    ctx.fillStyle = "#6f90b9";
    ctx.fillRect(x + 7, y + 16, TILE - 14, 9);
    return;
  }

  if (type === "table" || type === "teaTable" || type === "desk") {
    ctx.fillStyle = type === "teaTable" ? "#7d5736" : "#805535";
    ctx.fillRect(x + 5, y + 8, TILE - 10, 15);
    ctx.fillStyle = type === "desk" ? "#c6975f" : "#b8804d";
    ctx.fillRect(x + 4, y + 5, TILE - 8, 8);
    ctx.fillStyle = "#4b3322";
    ctx.fillRect(x + 8, y + 23, 4, 5);
    ctx.fillRect(x + TILE - 12, y + 23, 4, 5);
    if (type === "desk") {
      ctx.fillStyle = "#f0e6bf";
      ctx.fillRect(x + 9, y + 7, 11, 4);
    }
    return;
  }

  if (type === "chair" || type === "cushion") {
    ctx.fillStyle = type === "cushion" ? "#cf7967" : "#76512f";
    ctx.fillRect(x + 8, y + 12, TILE - 16, 13);
    ctx.fillStyle = type === "cushion" ? "#f0b3a3" : "#a97945";
    ctx.fillRect(x + 10, y + 10, TILE - 20, 6);
    return;
  }

  if (type === "tv") {
    ctx.fillStyle = "#303238";
    ctx.fillRect(x + 5, y + 8, TILE - 10, 16);
    ctx.fillStyle = "#7db5c9";
    ctx.fillRect(x + 8, y + 11, TILE - 16, 9);
    ctx.fillStyle = "#202124";
    ctx.fillRect(x + 12, y + 24, 8, 4);
    return;
  }

  if (type === "fridge" || type === "sink" || type === "stove") {
    ctx.fillStyle = type === "stove" ? "#2f3438" : "#e4e7df";
    ctx.fillRect(x + 6, y + 4, TILE - 12, TILE - 7);
    ctx.fillStyle = "#9aa8b6";
    ctx.fillRect(x + 8, y + 8, TILE - 16, 4);
    if (type === "sink") {
      ctx.fillStyle = "#6fb8d0";
      ctx.fillRect(x + 10, y + 15, TILE - 20, 8);
    }
    if (type === "stove") {
      ctx.fillStyle = "#d0d4d7";
      ctx.fillRect(x + 9, y + 10, 5, 5);
      ctx.fillRect(x + 18, y + 10, 5, 5);
      ctx.fillRect(x + 9, y + 20, 14, 3);
    }
    return;
  }

  if (type === "counter") {
    ctx.fillStyle = "#6f4b2d";
    ctx.fillRect(x + 2, y + 6, TILE - 4, 19);
    ctx.fillStyle = "#c49352";
    ctx.fillRect(x + 2, y + 4, TILE - 4, 6);
    ctx.fillStyle = "#4a3322";
    ctx.fillRect(x + 5, y + 23, TILE - 10, 4);
    return;
  }

  if (type === "produce" || type === "fish" || type === "supplyShelf") {
    ctx.fillStyle = "#76512e";
    ctx.fillRect(x + 4, y + 5, TILE - 8, 22);
    ctx.fillStyle = "#a57542";
    ctx.fillRect(x + 5, y + 10, TILE - 10, 3);
    ctx.fillRect(x + 5, y + 20, TILE - 10, 3);
    const itemColors =
      type === "produce"
        ? ["#5ca354", "#d06d4d", "#e0c34d"]
        : type === "fish"
          ? ["#88c5d6", "#eef2f1", "#5a8ca2"]
          : ["#d9c17a", "#8eb1c9", "#c7836a"];
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = itemColors[(tx + ty + i) % itemColors.length];
      ctx.fillRect(x + 7 + (i % 3) * 7, y + 13 + Math.floor(i / 3) * 9, 5, 5);
    }
    return;
  }

  if (type === "bookcase" || type === "brochureRack") {
    ctx.fillStyle = "#6f4d35";
    ctx.fillRect(x + 5, y + 3, TILE - 10, TILE - 6);
    ctx.fillStyle = "#b78550";
    ctx.fillRect(x + 7, y + 12, TILE - 14, 3);
    ctx.fillRect(x + 7, y + 22, TILE - 14, 3);
    const colors = type === "bookcase" ? ["#b54848", "#4d7fab", "#d6bd57"] : ["#f0e6bf", "#68a7bd", "#d28a58"];
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = colors[(tx + i) % colors.length];
      ctx.fillRect(x + 8 + i * 5, y + 6, 3, 6);
    }
    return;
  }

  if (type === "mapBoard") {
    ctx.fillStyle = "#544234";
    ctx.fillRect(x + 3, y + 5, TILE - 6, TILE - 10);
    ctx.fillStyle = "#d7c28a";
    ctx.fillRect(x + 6, y + 8, TILE - 12, TILE - 16);
    ctx.fillStyle = "#6fa05a";
    ctx.fillRect(x + 9, y + 12, 7, 5);
    ctx.fillStyle = "#4a7fb0";
    ctx.fillRect(x + 18, y + 16, 6, 4);
  }
}

function drawGrass(x, y, tx, ty) {
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = seeded(tx, ty) > 0.5 ? COLORS.grassLight : COLORS.grassDark;
  if (seeded(tx + 9, ty + 4) > 0.46) ctx.fillRect(x + 6, y + 9, 3, 2);
  if (seeded(tx + 2, ty + 8) > 0.58) ctx.fillRect(x + 20, y + 22, 4, 2);
}

function drawPath(x, y, tx, ty) {
  ctx.fillStyle = COLORS.path;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.pathDark;
  if (seeded(tx, ty) > 0.54) ctx.fillRect(x + 6, y + 8, 3, 3);
  if (seeded(tx + 3, ty + 11) > 0.6) ctx.fillRect(x + 22, y + 21, 4, 3);
}

function drawSand(x, y, tx, ty) {
  ctx.fillStyle = COLORS.sand;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.sandDark;
  if (seeded(tx, ty) > 0.45) ctx.fillRect(x + 8, y + 12, 10, 2);
  if (seeded(tx + 5, ty + 2) > 0.62) ctx.fillRect(x + 20, y + 23, 6, 2);
}

function drawWater(x, y, tx, ty) {
  ctx.fillStyle = COLORS.water;
  ctx.fillRect(x, y, TILE, TILE);
  const waveOffset = Math.floor((performance.now() / 260 + tx * 3 + ty) % 16);
  ctx.fillStyle = COLORS.waterLight;
  ctx.fillRect(x + waveOffset - 8, y + 10, 14, 3);
  ctx.fillRect(x + ((waveOffset + 11) % 20) - 4, y + 23, 12, 3);
  ctx.fillStyle = COLORS.waterDark;
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
}

function drawStone(x, y, tx, ty) {
  ctx.fillStyle = COLORS.stone;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.stoneDark;
  ctx.fillRect(x, y + 22, TILE, 10);
  ctx.fillStyle = "#aeb7bf";
  if (seeded(tx, ty) > 0.35) ctx.fillRect(x + 6, y + 6, 8, 4);
  if (seeded(tx + 4, ty + 5) > 0.62) ctx.fillRect(x + 20, y + 13, 7, 4);
}

function drawHedge(x, y, tx, ty) {
  ctx.fillStyle = COLORS.hedgeDark;
  ctx.fillRect(x + 2, y + 10, TILE - 4, 18);
  ctx.fillStyle = COLORS.hedge;
  ctx.fillRect(x + 4, y + 4, TILE - 8, 18);
  ctx.fillStyle = "#65b45d";
  if (seeded(tx, ty) > 0.5) ctx.fillRect(x + 9, y + 7, 6, 4);
  if (seeded(tx + 7, ty + 1) > 0.45) ctx.fillRect(x + 20, y + 13, 5, 4);
}

function drawTreeTile(x, y, tx, ty) {
  ctx.fillStyle = COLORS.trunk;
  ctx.fillRect(x + 13, y + 18, 7, 11);
  ctx.fillStyle = "#2f723b";
  ctx.fillRect(x + 7, y + 7, 20, 16);
  ctx.fillStyle = "#4e9f4a";
  ctx.fillRect(x + 5, y + 10, 24, 9);
  ctx.fillRect(x + 10, y + 3, 14, 9);
  ctx.fillStyle = "#78bd61";
  if (seeded(tx, ty) > 0.4) ctx.fillRect(x + 12, y + 6, 5, 4);
}

function drawFlowers(x, y, tx, ty) {
  const colors = ["#f1e35f", "#e9728d", "#ffffff"];
  for (let i = 0; i < 4; i += 1) {
    const px = x + 6 + ((tx * 11 + ty * 7 + i * 9) % 20);
    const py = y + 8 + ((tx * 5 + ty * 13 + i * 6) % 18);
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(px, py, 3, 3);
    ctx.fillStyle = COLORS.grassDark;
    ctx.fillRect(px + 1, py + 3, 1, 3);
  }
}

function drawTallGrass(x, y, tx, ty) {
  const colors = ["#4f8d3f", "#5fa24b", "#77b65b"];
  for (let i = 0; i < 9; i += 1) {
    const px = x + 3 + ((tx * 7 + ty * 11 + i * 5) % 25);
    const py = y + 8 + ((tx * 13 + ty * 3 + i * 7) % 18);
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(px, py, 3, 9);
    ctx.fillRect(px - 1, py + 4, 5, 2);
  }
}

function drawTrailBridgeObject(x, y, w, h) {
  ctx.fillStyle = "#6e4b2d";
  ctx.fillRect(x + 8, y + 6, w - 16, h - 12);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 12, y + 10, w - 24, h - 20);

  ctx.fillStyle = "#855a34";
  for (let yy = y + 14; yy < y + h - 12; yy += 10) {
    ctx.fillRect(x + 12, yy, w - 24, 2);
  }
  for (let xx = x + TILE; xx < x + w - TILE / 2; xx += TILE) {
    ctx.fillRect(xx, y + 10, 2, h - 20);
  }

  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 14, y + 4, 5, h - 8);
  ctx.fillRect(x + w - 19, y + 4, 5, h - 8);
  ctx.fillRect(x + 6, y + 8, w - 12, 4);
  ctx.fillRect(x + 6, y + h - 12, w - 12, 4);
}

function drawTrailGateObject(x, y, w, h) {
  ctx.fillStyle = "#5f5a4c";
  ctx.fillRect(x + 7, y + 7, 18, h - 4);
  ctx.fillRect(x + w - 25, y + 7, 18, h - 4);
  ctx.fillStyle = "#9a927b";
  ctx.fillRect(x + 10, y + 4, 12, 9);
  ctx.fillRect(x + w - 22, y + 4, 12, 9);

  ctx.fillStyle = "#6b4b2f";
  ctx.fillRect(x + 20, y + 12, w - 40, 9);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 25, y + 14, w - 50, 4);
}

function drawTrailRestTableObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 7, y + 13, w - 14, h - 22);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 5, y + 8, w - 10, 20);
  ctx.fillStyle = "rgba(255, 236, 190, 0.34)";
  ctx.fillRect(x + 10, y + 11, w - 20, 3);

  ctx.fillStyle = "#f0e6bf";
  ctx.fillRect(x + 15, y + 13, 30, 10);
  ctx.fillStyle = "#687c58";
  ctx.fillRect(x + 18, y + 16, 24, 2);
  ctx.fillRect(x + 18, y + 20, 18, 2);

  ctx.fillStyle = "#4f8cc9";
  ctx.fillRect(x + w - 44, y + 12, 12, 15);
  ctx.fillStyle = "#9fd0e0";
  ctx.fillRect(x + w - 41, y + 14, 6, 4);

  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + w - 25, y + 17, 7, 6);
  ctx.fillRect(x + w - 15, y + 17, 7, 6);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 14, y + h - 15, 6, 11);
  ctx.fillRect(x + w - 20, y + h - 15, 6, 11);
}

function drawSoundFountainObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#68727c";
  ctx.fillRect(x + 12, y + 18, w - 24, h - 36);
  ctx.fillStyle = "#9aa5ad";
  ctx.fillRect(x + 8, y + 14, w - 16, 10);
  ctx.fillRect(x + 8, y + h - 24, w - 16, 10);
  ctx.fillRect(x + 8, y + 14, 10, h - 28);
  ctx.fillRect(x + w - 18, y + 14, 10, h - 28);

  ctx.fillStyle = "#4f9cc9";
  ctx.fillRect(x + 20, y + 26, w - 40, h - 52);
  ctx.fillStyle = "#8fd3e8";
  ctx.fillRect(x + 28, y + 32, w - 56, 4);
  ctx.fillRect(x + 34, y + 46, w - 68, 3);

  ctx.fillStyle = "#f2e8c6";
  ctx.fillRect(x + w / 2 - 8, y + 10, 16, 12);
  ctx.fillStyle = "#2f5874";
  ctx.fillRect(x + w / 2 - 2, y + 22, 4, 24);
}

function drawSpeechBenchObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 6, y + 7, w - 12, 8);
  ctx.fillRect(x + 9, y + 18, w - 18, 7);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 8, y + 5, w - 16, 4);
  ctx.fillRect(x + 11, y + 16, w - 22, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 16, y + 23, 5, 9);
  ctx.fillRect(x + w - 21, y + 23, 5, 9);
}

function drawRouteObjectStallObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 5, y + 21, w - 10, h - 31);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 3, y + 15, w - 6, 12);

  const items = [
    ["#f0e6bf", x + 12, y + 18, 14, 10],
    ["#4f8cc9", x + 36, y + 17, 11, 13],
    ["#b65c48", x + 58, y + 19, 14, 10],
  ];
  for (const [fill, ix, iy, iw, ih] of items) {
    ctx.fillStyle = fill;
    ctx.fillRect(ix, iy, iw, ih);
  }

  ctx.fillStyle = "#7d3137";
  ctx.fillRect(x + 5, y + 5, w - 10, 8);
  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + 9, y + 7, w - 18, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 13, y + h - 14, 6, 10);
  ctx.fillRect(x + w - 19, y + h - 14, 6, 10);
}

function drawLedge(x, y) {
  ctx.fillStyle = "#b07845";
  ctx.fillRect(x, y + 8, TILE, 13);
  ctx.fillStyle = "#d3a061";
  ctx.fillRect(x, y + 6, TILE, 5);
  ctx.fillStyle = "#6d4f32";
  ctx.fillRect(x, y + 20, TILE, 5);
}

function drawBuilding(building) {
  const x = Math.floor(building.x * TILE - cameraX);
  const y = Math.floor(building.y * TILE - cameraY);
  const w = building.w * TILE;
  const h = building.h * TILE;

  if (x > window.innerWidth || y > window.innerHeight || x + w < 0 || y + h < 0) return;

  const roofHeight = building.important ? TILE * 2.4 : TILE * 2;
  const wallY = y + roofHeight - 5;
  const wallHeight = h - roofHeight + 5;

  ctx.fillStyle = "#58432d";
  ctx.fillRect(x + 6, y + 8, w - 12, roofHeight + 8);
  ctx.fillStyle = building.roof;
  ctx.fillRect(x + 2, y + 4, w - 4, roofHeight - 4);
  ctx.fillStyle = building.trim;
  ctx.fillRect(x + 2, y + roofHeight - 9, w - 4, 8);
  ctx.fillStyle = "#f3d56a";
  for (let tx = 0; tx < building.w; tx += 1) {
    if ((tx + building.x) % 2 === 0) ctx.fillRect(x + tx * TILE + 7, y + 12, 8, 6);
  }

  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(x + 12, wallY, w - 24, wallHeight);
  ctx.fillStyle = COLORS.wallShadow;
  ctx.fillRect(x + 12, wallY + wallHeight - 8, w - 24, 8);
  ctx.fillStyle = "#7c6f57";
  ctx.fillRect(x + 12, wallY, w - 24, 4);

  const doorX = Math.floor(building.doorX * TILE - cameraX);
  const doorY = Math.floor(building.doorY * TILE - cameraY);
  ctx.fillStyle = COLORS.door;
  ctx.fillRect(doorX + 5, doorY + 4, TILE - 10, TILE - 4);
  ctx.fillStyle = "#c69b55";
  ctx.fillRect(doorX + TILE - 11, doorY + 17, 3, 3);

  const windowY = wallY + 17;
  const leftWindowX = x + 25;
  const rightWindowX = x + w - 50;
  drawWindow(leftWindowX, windowY);
  if (rightWindowX - leftWindowX > 45) drawWindow(rightWindowX, windowY);

  if (building.important) {
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(x + w / 2 - 38, wallY + 2, 76, 13);
    ctx.fillStyle = "#f0eee2";
    ctx.fillRect(x + w / 2 - 32, wallY + 6, 64, 5);
  }
}

function drawWindow(x, y) {
  ctx.fillStyle = "#2c5575";
  ctx.fillRect(x, y, 24, 18);
  ctx.fillStyle = "#8fd0e8";
  ctx.fillRect(x + 4, y + 4, 16, 10);
  ctx.fillStyle = "#f8fff8";
  ctx.fillRect(x + 6, y + 4, 4, 10);
}

function drawInteractables() {
  for (const item of currentScene().interactables) {
    if (item.hidden) continue;
    if (item.kind === "sign") drawSign(item.x, item.y);
    if (item.kind === "route") drawRouteMarker(item.x, item.y);
    if (item.kind === "waterEdge") drawShoreMarker(item.x, item.y);
  }
}

function drawSign(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#76512e";
  ctx.fillRect(x + 14, y + 17, 5, 13);
  ctx.fillStyle = "#d9bd7a";
  ctx.fillRect(x + 5, y + 7, 22, 14);
  ctx.fillStyle = "#8b6236";
  ctx.fillRect(x + 5, y + 18, 22, 3);
  ctx.fillStyle = "#5a3d25";
  ctx.fillRect(x + 9, y + 11, 14, 2);
  ctx.fillRect(x + 9, y + 15, 10, 2);
}

function drawRouteMarker(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#d9bd7a";
  ctx.fillRect(x + 4, y + 2, TILE - 8, TILE - 4);
  ctx.fillStyle = COLORS.pathDark;
  ctx.fillRect(x + 11, y + 10, 10, 5);
  ctx.fillRect(x + 14, y + 7, 4, 12);
  ctx.fillStyle = COLORS.void;
  ctx.fillRect(x + 6, y, TILE - 12, 3);
}

function drawShoreMarker(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + 4, y + 10, 24, 4);
  ctx.fillRect(x + 10, y + 17, 18, 4);
}

function drawPlayer() {
  const x = Math.floor(player.px - cameraX);
  const y = Math.floor(player.py - cameraY);
  drawPerson(x, y, player.dir, {
    skin: "#b77955",
    hair: "#2a1f1d",
    hat: "#f4e6bd",
    jacket: "#d85d5d",
    pants: "#2f5f89",
    backpack: "#494e55",
    camera: true,
  });
}

function drawNpc(npc) {
  const x = Math.floor(npc.x * TILE - cameraX);
  const y = Math.floor(npc.y * TILE - cameraY);
  if (npc.kind === "child") {
    drawChild(x, y, npc.dir, {
      skin: "#bc7d58",
      hair: "#27211e",
      jacket: npc.jacket,
      pants: "#3e4a54",
    });
    return;
  }

  drawPerson(x, y, npc.dir, {
    skin: "#bc7d58",
    hair: "#27211e",
    hat: null,
    jacket: npc.jacket,
    pants: "#3e4a54",
    backpack: null,
    camera: false,
  });
}

function drawChild(x, y, dir, palette) {
  const childY = y + 5;
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(x + 9, childY + 22, 14, 4);

  ctx.fillStyle = palette.pants;
  ctx.fillRect(x + 10, childY + 18, 5, 7);
  ctx.fillRect(x + 17, childY + 18, 5, 7);
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x + 9, childY + 24, 7, 3);
  ctx.fillRect(x + 16, childY + 24, 7, 3);

  ctx.fillStyle = palette.jacket;
  ctx.fillRect(x + 9, childY + 10, 14, 10);
  ctx.fillStyle = "#f0eee2";
  if (dir === "down") ctx.fillRect(x + 14, childY + 11, 4, 8);

  ctx.fillStyle = palette.skin;
  ctx.fillRect(x + 11, childY + 4, 10, 9);
  if (dir === "left") ctx.fillRect(x + 9, childY + 7, 3, 4);
  if (dir === "right") ctx.fillRect(x + 20, childY + 7, 3, 4);

  ctx.fillStyle = palette.hair;
  if (dir === "up") ctx.fillRect(x + 10, childY + 3, 12, 9);
  else ctx.fillRect(x + 10, childY + 3, 12, 5);

  ctx.fillStyle = COLORS.black;
  if (dir === "down") {
    ctx.fillRect(x + 13, childY + 9, 2, 2);
    ctx.fillRect(x + 18, childY + 9, 2, 2);
  } else if (dir === "left") {
    ctx.fillRect(x + 11, childY + 9, 2, 2);
  } else if (dir === "right") {
    ctx.fillRect(x + 20, childY + 9, 2, 2);
  }
}

function drawPerson(x, y, dir, palette) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(x + 8, y + 25, 16, 5);

  const leftOffset = dir === "left" ? -2 : 0;
  const rightOffset = dir === "right" ? 2 : 0;

  if (palette.backpack && dir !== "down") {
    ctx.fillStyle = palette.backpack;
    ctx.fillRect(x + 8, y + 14, 16, 11);
  }

  ctx.fillStyle = palette.pants;
  ctx.fillRect(x + 9, y + 22, 5, 7);
  ctx.fillRect(x + 18, y + 22, 5, 7);
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x + 8, y + 28, 7, 3);
  ctx.fillRect(x + 17, y + 28, 7, 3);

  ctx.fillStyle = palette.jacket;
  ctx.fillRect(x + 8 + leftOffset + rightOffset, y + 13, 16, 11);
  ctx.fillStyle = "#f0eee2";
  if (dir === "down") ctx.fillRect(x + 14, y + 14, 4, 9);
  if (dir === "left") ctx.fillRect(x + 9, y + 15, 4, 7);
  if (dir === "right") ctx.fillRect(x + 19, y + 15, 4, 7);

  ctx.fillStyle = palette.skin;
  ctx.fillRect(x + 10, y + 6, 12, 10);
  if (dir === "left") ctx.fillRect(x + 8, y + 9, 4, 5);
  if (dir === "right") ctx.fillRect(x + 20, y + 9, 4, 5);

  ctx.fillStyle = palette.hair;
  if (dir === "up") ctx.fillRect(x + 9, y + 5, 14, 10);
  else ctx.fillRect(x + 9, y + 5, 14, 5);

  if (palette.hat) {
    ctx.fillStyle = palette.hat;
    ctx.fillRect(x + 7, y + 3, 18, 5);
    ctx.fillRect(x + 10, y + 0, 12, 4);
    if (dir === "down") ctx.fillRect(x + 11, y + 8, 10, 2);
  }

  ctx.fillStyle = COLORS.black;
  if (dir === "down") {
    ctx.fillRect(x + 12, y + 11, 2, 2);
    ctx.fillRect(x + 18, y + 11, 2, 2);
  } else if (dir === "left") {
    ctx.fillRect(x + 10, y + 11, 2, 2);
  } else if (dir === "right") {
    ctx.fillRect(x + 20, y + 11, 2, 2);
  }

  if (palette.camera) {
    ctx.fillStyle = "#1b1b1f";
    ctx.fillRect(x + 21, y + 17, 6, 5);
    ctx.fillStyle = "#9aa8b6";
    ctx.fillRect(x + 23, y + 18, 2, 2);
  }
}

function drawInfoPanel() {
  const questStatus = currentQuestStatus();
  const rows = [
    [t("panel.area"), t(currentScene().areaKey)],
    [t("panel.facing"), t(`direction.${player.dir}`)],
    [t("panel.tile"), `${player.tileX}, ${player.tileY}`],
    [t("panel.quest"), t(questStatus.titleKey)],
    [t("panel.questStep"), t(questStatus.objectiveKey)],
    [t("panel.where"), questStatus.whereKey ? t(questStatus.whereKey) : "-"],
    [t("panel.badges"), badgePanelSummary()],
    [t("panel.hangulDex"), hangulDictionaryPanelSummary()],
    [t("panel.words"), wordDictionaryPanelSummary()],
    [t("panel.primary"), languageName(settings.primary)],
    [t("panel.secondary"), languageName(settings.secondary)],
  ];
  const w = Math.min(230, Math.max(190, window.innerWidth - 28));
  const h = 54 + rows.length * 17 + 18;
  const x = Math.max(14, window.innerWidth - w - 14);
  const y = 14;

  drawUiBox(x, y, w, h);
  drawFittedText(t("game.title"), x + 18, y + 20, w - 36, 14, true);

  rows.forEach(([label, value], index) => {
    const rowY = y + 44 + index * 17;
    drawFittedText(`${label}:`, x + 18, rowY, 82, 12, false);
    drawFittedText(value, x + 104, rowY, w - 122, 12, false);
  });
}

function drawQuitScreen() {
  ctx.fillStyle = "rgba(10, 10, 14, 0.82)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const w = Math.min(420, window.innerWidth - 36);
  const h = 128;
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  drawUiBox(x, y, w, h);
  drawFittedText(t("quit.message"), x + 28, y + 38, w - 56, 20, true);
  drawFittedText(t("quit.subtext"), x + 28, y + 72, w - 56, 15, false);
}

function drawMenu() {
  if (ui.menuScreen === "dictionary") {
    drawHangulDictionaryMenu();
    return;
  }
  if (ui.menuScreen === "words") {
    drawWordDictionaryMenu();
    return;
  }
  if (ui.menuScreen === "journal") {
    drawJournalMenu();
    return;
  }
  if (ui.menuScreen === "settings") {
    drawSettingsMenu();
    return;
  }
  drawMainMenu();
}

function drawMainMenu() {
  const w = Math.min(250, window.innerWidth - 36);
  const h = 54 + mainMenuItems.length * 32;
  const x = Math.max(18, window.innerWidth - w - 18);
  const y = 18;
  drawUiBox(x, y, w, h);
  drawFittedText(t("menu.title"), x + 24, y + 22, w - 48, 16, true);

  mainMenuItems.forEach((item, index) => {
    const rowY = y + 52 + index * 32;
    drawMenuCursor(x + 18, rowY + 3, index === ui.menuIndex);
    drawFittedText(t(item.key), x + 42, rowY, w - 62, 16, false);
  });
}

function drawSettingsMenu() {
  const w = Math.min(392, window.innerWidth - 36);
  const h = 54 + settingsRows.length * 32 + 12;
  const x = Math.max(18, window.innerWidth - w - 18);
  const y = 18;
  drawUiBox(x, y, w, h);
  drawFittedText(t("settings.title"), x + 24, y + 22, w - 48, 16, true);

  const labels = [
    { label: t("settings.primary"), value: `< ${languageName(settings.primary)} >` },
    { label: t("settings.secondary"), value: `< ${languageName(settings.secondary)} >` },
    { label: t("settings.speech"), value: speechSupported() ? `< ${speechLanguageName()} >` : t("settings.speechUnavailable") },
    { label: ui.eraseArmed ? t("settings.eraseArmed") : t("settings.erase"), value: "" },
    { label: t("menu.back"), value: "" },
  ];

  labels.forEach((row, index) => {
    const rowY = y + 54 + index * 32;
    drawMenuCursor(x + 18, rowY + 3, index === ui.menuIndex);

    if (row.value) {
      drawFittedText(row.label, x + 42, rowY, Math.max(94, w * 0.42), 14, false);
      drawFittedText(row.value, x + Math.max(178, w * 0.5), rowY, w - Math.max(198, w * 0.5), 14, false);
    } else {
      drawFittedText(row.label, x + 42, rowY, w - 62, 14, false);
    }
  });
}

function drawWordDictionaryMenu() {
  const categoryId = WORD_CATEGORY_IDS[ui.wordCategoryIndex];
  const items = wordItemsByCategory(categoryId);
  const totals = wordDictionaryTotals(items.map((item) => item.id));
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const pageSize = hangulDictionaryPageSize();
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  ui.wordPage = Math.min(ui.wordPage, pages - 1);
  const pageStart = ui.wordPage * pageSize;
  const pageItems = items.slice(pageStart, pageStart + pageSize);
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 124 + Math.max(4, pageItems.length) * rowHeight + 40);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("dictionary.words.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(`dictionary.words.category.${categoryId}`), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);
  drawCenteredFittedText(t("dictionary.words.summary", totals), x + w / 2, y + 74, w - 60, 12, false);

  const pageLabel = t("dictionary.hangul.page", { page: ui.wordPage + 1, pages });
  drawFittedText(pageLabel, x + w - 76, y + 51, 52, 12, false);

  const rowsY = y + 104;
  if (!pageItems.length) {
    drawCenteredFittedText(t("dictionary.words.empty"), x + w / 2, rowsY + 20, w - 60, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  pageItems.forEach((item, index) => {
    const entry = wordProgressEntry(item.id);
    const seen = !!entry?.seen;
    const rowY = rowsY + index * rowHeight;
    const status = t(wordDictionaryStatusKey(item.id));
    const score = seen ? `${entry.correct}/${WORD_MASTERY_CORRECT_TARGET}` : "";
    const hangul = seen ? item.hangul : t("dictionary.hangul.unseenValue");
    const meaning = seen ? wordMeaning(item) : t("dictionary.hangul.unseenValue");

    ctx.fillStyle = index % 2 === 0 ? "rgba(255, 250, 240, 0.46)" : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);
    drawFittedText(hangul, x + 34, rowY, narrow ? 70 : 92, narrow ? 14 : 16, true);
    drawFittedText(meaning, x + (narrow ? 110 : 138), rowY, narrow ? w - 250 : w - 352, 13, false);
    drawFittedText(status, x + w - (narrow ? 130 : 170), rowY, narrow ? 82 : 108, 12, false);
    drawFittedText(score, x + w - 58, rowY, 32, 12, false);
  });

  drawDrillPulse(x + w - 42, y + h - 40);
}

function drawJournalMenu() {
  const chapter = QUEST_CHAPTERS[ui.journalChapterIndex];
  const quests = chapter.quests;
  ui.journalQuestIndex = Math.min(ui.journalQuestIndex, quests.length - 1);
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 150 + Math.max(4, quests.length) * rowHeight + 56);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("journal.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(chapter.titleKey), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);

  const badges = earnedBadges();
  const badgeText = badges.length
    ? `${t("journal.badges")}: ${badges.map((badge) => t(badge.titleKey)).join(" - ")}`
    : `${t("journal.badges")}: ${t("journal.noBadges")}`;
  drawCenteredFittedText(badgeText, x + w / 2, y + 74, w - 60, 12, false);

  const rowsY = y + 104;
  quests.forEach((quest, index) => {
    const level = progress.questLevels[quest.id] || 0;
    const total = quest.steps.length;
    const complete = level >= total;
    const rowY = rowsY + index * rowHeight;
    const selected = index === ui.journalQuestIndex;

    ctx.fillStyle = selected
      ? "rgba(192, 68, 68, 0.18)"
      : index % 2 === 0
        ? "rgba(255, 250, 240, 0.46)"
        : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);

    const mark = complete ? "O" : level > 0 ? "-" : " ";
    drawFittedText(`[${mark}]`, x + 32, rowY, 34, 13, complete);
    drawFittedText(t(quest.titleKey), x + 72, rowY, narrow ? w - 200 : w - 260, 13, selected);
    drawFittedText(`${Math.min(level, total)}/${total}`, x + w - 78, rowY, 44, 12, false);
  });

  const selectedQuest = quests[ui.journalQuestIndex];
  const selectedLevel = progress.questLevels[selectedQuest.id] || 0;
  const hintY = rowsY + quests.length * rowHeight + 14;
  let hintText = `${t("journal.hint")}: ${t("journal.complete")}`;
  if (selectedLevel < selectedQuest.steps.length) {
    const step = selectedQuest.steps[selectedLevel];
    const wherePart = step.whereKey ? ` - ${t(step.whereKey)}` : "";
    hintText = `${t("journal.hint")}: ${t(step.objectiveKey)}${wherePart}`;
  }
  drawFittedText(hintText, x + 28, hintY, w - 56, 12, false);

  drawDrillPulse(x + w - 42, y + h - 40);
}

function drawHangulDictionaryMenu() {
  const category = currentHangulDictionaryCategory();
  const itemIds = hangulDictionaryDisplayItemIds(category);
  const totals = hangulDictionaryTotals(category.itemIds);
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const pageSize = hangulDictionaryPageSize();
  const pages = Math.max(1, Math.ceil(itemIds.length / pageSize));
  ui.dictionaryPage = Math.min(ui.dictionaryPage, pages - 1);
  const pageStart = ui.dictionaryPage * pageSize;
  const pageItems = itemIds.slice(pageStart, pageStart + pageSize);
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 124 + Math.max(4, pageItems.length) * rowHeight + 40);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("dictionary.hangul.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(category.titleKey), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);
  drawCenteredFittedText(t("dictionary.hangul.summary", totals), x + w / 2, y + 74, w - 60, 12, false);

  const pageLabel = t("dictionary.hangul.page", { page: ui.dictionaryPage + 1, pages });
  drawFittedText(pageLabel, x + w - 76, y + 51, 52, 12, false);

  const rowsY = y + 104;
  if (!pageItems.length) {
    drawCenteredFittedText(t("dictionary.hangul.empty"), x + w / 2, rowsY + 20, w - 60, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  pageItems.forEach((itemId, index) => {
    const item = HANGUL_ITEMS[itemId];
    const entry = hangulItemProgress(itemId);
    const seen = !!entry?.seen;
    const rowY = rowsY + index * rowHeight;
    const status = t(hangulDictionaryStatusKey(itemId));
    const score = seen ? `${entry.correct}/${HANGUL_MASTERY_CORRECT_TARGET}` : "";
    const glyph = seen ? item.glyph : t("dictionary.hangul.unseenValue");
    const answer = seen ? item.answer : t("dictionary.hangul.unseenValue");

    ctx.fillStyle = index % 2 === 0 ? "rgba(255, 250, 240, 0.46)" : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);
    drawFittedText(glyph, x + 34, rowY, narrow ? 54 : 66, narrow ? 15 : 17, true);
    drawFittedText(answer, x + (narrow ? 92 : 112), rowY, narrow ? w - 232 : w - 326, 13, false);
    drawFittedText(status, x + w - (narrow ? 130 : 170), rowY, narrow ? 82 : 108, 12, false);
    drawFittedText(score, x + w - 58, rowY, 32, 12, false);
  });

  drawDrillPulse(x + w - 42, y + h - 40);
}

function drawDialog(text) {
  const margin = 18;
  const boxHeight = Math.min(150, Math.max(104, window.innerHeight * 0.22));
  const x = margin;
  const y = window.innerHeight - boxHeight - margin;
  const w = window.innerWidth - margin * 2;
  const h = boxHeight;

  drawUiBox(x, y, w, h);

  ctx.fillStyle = COLORS.text;
  ctx.font = `18px ${UI_FONT}`;
  ctx.textBaseline = "top";
  const lines = wrapText(text, w - 46, `18px ${UI_FONT}`);
  lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, x + 24, y + 30 + index * 24);
  });

  const pulse = text && Math.floor(performance.now() / 320) % 2 === 0;
  if (pulse) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + w - 34, y + h - 32, 10, 4);
    ctx.fillRect(x + w - 30, y + h - 28, 6, 4);
    ctx.fillRect(x + w - 28, y + h - 24, 2, 4);
  }
}

function drawStudyBoard() {
  const board = STUDY_BOARDS[studyBoard];
  if (!board) return;

  ctx.fillStyle = "rgba(10, 10, 14, 0.38)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const narrow = window.innerWidth < 520;
  const columns = board.entries.length > 12 ? (narrow ? 3 : 5) : (narrow ? 2 : 5);
  const rows = Math.ceil(board.entries.length / columns);
  const cellGap = narrow ? 8 : 12;
  const preferredCellHeight = narrow ? 58 : 72;
  const w = Math.min(760, window.innerWidth - 36);
  const gridW = w - 72;
  const h = Math.min(
    window.innerHeight - 36,
    132 + rows * preferredCellHeight + (rows - 1) * cellGap + 36,
  );
  const cellHeight = Math.max(
    narrow ? 48 : 56,
    Math.min(preferredCellHeight, (h - 168 - (rows - 1) * cellGap) / rows),
  );
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const innerX = x + 36;
  const innerY = y + 92;
  const cellWidth = (gridW - cellGap * (columns - 1)) / columns;

  drawStudyBoardFrame(x, y, w, h);
  drawCenteredFittedText(t(board.titleKey), x + w / 2, y + 28, w - 76, narrow ? 18 : 24, true);
  drawCenteredFittedText(t(board.subtitleKey), x + w / 2, y + 58, w - 86, narrow ? 12 : 15, false);

  board.entries.forEach((entry, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const cellX = innerX + column * (cellWidth + cellGap);
    const cellY = innerY + row * (cellHeight + cellGap);

    ctx.fillStyle = "#f4e7c4";
    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
    ctx.fillStyle = "#b28a55";
    ctx.fillRect(cellX, cellY, cellWidth, 3);
    ctx.fillRect(cellX, cellY + cellHeight - 3, cellWidth, 3);
    ctx.fillStyle = "#e1c993";
    ctx.fillRect(cellX, cellY, 3, cellHeight);
    ctx.fillRect(cellX + cellWidth - 3, cellY, 3, cellHeight);

    drawCenteredFittedText(
      entry.glyph,
      cellX + cellWidth / 2,
      cellY + Math.max(7, cellHeight * 0.12),
      cellWidth - 16,
      Math.min(narrow ? 24 : 30, cellHeight * 0.46),
      true,
    );
    drawCenteredFittedText(
      entry.nameKey ? t(entry.nameKey) : entry.name,
      cellX + cellWidth / 2,
      cellY + Math.max(30, cellHeight * 0.62),
      cellWidth - 12,
      Math.min(narrow ? 11 : 13, cellHeight * 0.22),
      false,
    );
  });

  drawDrillPulse(x + w - 46, y + h - 42);
}

function drawStudyBoardFrame(x, y, w, h) {
  ctx.fillStyle = "#3e2a1e";
  ctx.fillRect(x + 14, y + 6, w - 28, h - 12);
  ctx.fillStyle = "#8b5f35";
  ctx.fillRect(x + 8, y, w - 16, 12);
  ctx.fillRect(x + 8, y + h - 12, w - 16, 12);
  ctx.fillStyle = "#b7844a";
  ctx.fillRect(x + 2, y + 3, w - 4, 6);
  ctx.fillRect(x + 2, y + h - 9, w - 4, 6);
  ctx.fillStyle = "#ead7aa";
  ctx.fillRect(x + 22, y + 14, w - 44, h - 28);
  ctx.fillStyle = "#c0935c";
  ctx.fillRect(x + 30, y + 20, w - 60, 5);
  ctx.fillRect(x + 30, y + h - 25, w - 60, 4);
}

function drawDrill() {
  const data = currentDrillData();
  if (!data) return;

  ctx.fillStyle = "rgba(10, 10, 14, 0.32)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const step = currentDrillStep();
  const choiceCount = step?.choices.length || 0;
  const baseHeight = drill.complete ? 210 : 164 + choiceCount * 34 + (drill.answered ? 54 : 0);
  const w = Math.min(560, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, baseHeight);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;

  drawUiBox(x, y, w, h);
  drawFittedText(t(data.titleKey), x + 24, y + 22, w - 130, 18, true);
  drawFittedText(
    t("drill.progress", { current: Math.min(drill.index + 1, data.steps.length), total: data.steps.length }),
    x + w - 104,
    y + 25,
    78,
    13,
    false,
  );

  if (drill.complete) {
    drawFittedText(t("drill.complete"), x + 28, y + 68, w - 56, 20, true);
    drawFittedText(
      t("drill.score", { correct: drill.correctCount, total: data.steps.length }),
      x + 28,
      y + 104,
      w - 56,
      16,
      false,
    );
    drawFittedText(t(drill.passed ? "drill.passed" : "drill.retry"), x + 28, y + 134, w - 56, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  if (!step) return;

  const promptLines = wrapText(t(step.promptKey, step.promptParams || {}), w - 56, `18px ${UI_FONT}`);
  promptLines.slice(0, 3).forEach((line, index) => {
    drawFittedText(line, x + 28, y + 64 + index * 24, w - 56, 18, false);
  });

  const choicesY = y + 134;
  step.choices.forEach((choiceKey, index) => {
    const rowY = choicesY + index * 34;
    if (drill.answered && index === step.answer) {
      ctx.fillStyle = "rgba(63, 143, 69, 0.22)";
      ctx.fillRect(x + 24, rowY - 5, w - 48, 28);
    } else if (drill.answered && index === drill.selected) {
      ctx.fillStyle = "rgba(192, 68, 68, 0.18)";
      ctx.fillRect(x + 24, rowY - 5, w - 48, 28);
    }

    drawMenuCursor(x + 30, rowY + 1, !drill.answered && index === drill.selected);
    drawFittedText(uiText(choiceKey), x + 56, rowY, w - 86, 17, false);
  });

  if (drill.answered && drill.feedbackKey) {
    const feedbackY = choicesY + choiceCount * 34 + 12;
    drawFittedText(t(drill.feedbackKey, drill.feedbackParams || {}), x + 28, feedbackY, w - 56, 15, false);
    drawDrillPulse(x + w - 42, y + h - 40);
  }
}

function drawDrillPulse(x, y) {
  if (Math.floor(performance.now() / 320) % 2 !== 0) return;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y + 5, 10, 4);
  ctx.fillRect(x + 4, y + 9, 6, 4);
  ctx.fillRect(x + 7, y + 13, 3, 4);
}

function drawUiBox(x, y, w, h) {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
  ctx.fillStyle = COLORS.panelAccent;
  ctx.fillRect(x + 10, y + 10, w - 20, 5);
  ctx.fillStyle = COLORS.panelLine;
  ctx.fillRect(x + 10, y + h - 15, w - 20, 3);
}

function drawMenuCursor(x, y, active) {
  if (!active) return;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y + 5, 10, 4);
  ctx.fillRect(x + 4, y + 9, 6, 4);
  ctx.fillRect(x + 7, y + 13, 3, 4);
}

function drawFittedText(text, x, y, maxWidth, fontSize, bold) {
  let size = fontSize;
  const weight = bold ? "bold " : "";
  ctx.fillStyle = COLORS.text;
  ctx.textBaseline = "top";

  do {
    ctx.font = `${weight}${size}px ${UI_FONT}`;
    if (ctx.measureText(text).width <= maxWidth || size <= 9) break;
    size -= 1;
  } while (size > 9);

  ctx.fillText(text, x, y);
}

function drawCenteredFittedText(text, centerX, y, maxWidth, fontSize, bold) {
  let size = fontSize;
  const weight = bold ? "bold " : "";
  ctx.fillStyle = COLORS.text;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";

  do {
    ctx.font = `${weight}${size}px ${UI_FONT}`;
    if (ctx.measureText(text).width <= maxWidth || size <= 9) break;
    size -= 1;
  } while (size > 9);

  ctx.fillText(text, centerX, y);
  ctx.textAlign = "left";
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
    } else {
      if (line) lines.push(line);
      if (ctx.measureText(word).width > maxWidth) {
        lines.push(...breakLongWord(word, maxWidth));
        line = "";
      } else {
        line = word;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

function breakLongWord(word, maxWidth) {
  const pieces = [];
  let piece = "";
  for (const char of word) {
    const test = piece + char;
    if (ctx.measureText(test).width > maxWidth && piece) {
      pieces.push(piece);
      piece = char;
    } else {
      piece = test;
    }
  }
  if (piece) pieces.push(piece);
  return pieces;
}

function seeded(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt, now);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (!event.repeat) unlockMusic();

  if (event.code === "KeyT") {
    event.preventDefault();
    ui.translationHeld = true;
    return;
  }

  if (event.repeat && (event.code in keyToDir || event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    return;
  }

  if (drill) {
    handleDrillInput(event);
    return;
  }

  if (studyBoard) {
    handleStudyBoardInput(event);
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    toggleMainMenu();
    return;
  }

  if (ui.menuOpen) {
    handleMenuInput(event);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    if (dialog) advanceDialog();
    else if (!ui.quit) openDialogFor(getInteractionTarget());
    return;
  }

  if (event.code in keyToDir) {
    event.preventDefault();
    if (!movementInput.held.has(event.code)) {
      movementInput.held.add(event.code);
      movementInput.order = movementInput.order.filter((code) => code !== event.code);
      movementInput.order.push(event.code);
    }
    handleMovementPress(keyToDir[event.code]);
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "KeyT") {
    event.preventDefault();
    ui.translationHeld = false;
  }

  if (event.code in keyToDir) {
    event.preventDefault();
    movementInput.held.delete(event.code);
    movementInput.order = movementInput.order.filter((code) => code !== event.code);
    if (movementInput.held.size === 0) movementInput.holdDelay = 0;
  }
});

window.addEventListener("resize", resize);
if (speechSupported()) {
  const handleVoicesChanged = () => normalizeSpeechLanguage();
  textToSpeech().prepare(handleVoicesChanged);
}

window.addEventListener("beforeunload", () => {
  persistSaveNow();
});

buildMap();
buildScenes();
loadSave();
applySavedPlayerState();
resize();
requestAnimationFrame(loop);
