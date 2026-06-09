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

const SPEECH_LANGUAGE_TAGS = {
  en: "en-US",
  ko: "ko-KR",
  nl: "nl-NL",
};

const EDGE_NATURAL_VOICE_HINTS = {
  en: {
    female: ["aria", "jenny", "michelle", "emma", "ava"],
    male: ["guy", "davis", "tony", "brian", "andrew"],
  },
  ko: {
    female: ["sunhi"],
    male: ["injoon"],
  },
  nl: {
    female: ["fenna", "colette"],
    male: ["maarten"],
  },
};

const MUSIC_TRACKS = {
  intro: "Intro.mp3",
  town1: "Town1.mp3",
  town2: "Town2.mp3",
  trail1: "Trail1.mp3",
  trail2: "Trail2.mp3",
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
  quit: false,
};

const mainMenuItems = [
  { key: "menu.return", action: "return" },
  { key: "menu.settings", action: "settings" },
  { key: "menu.quit", action: "quit" },
];

const settingsRows = ["primary", "secondary", "speech", "back"];

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
};

function mergeExternalDrillPacks() {
  const packs = window.KOREA_ADVENTURE_DRILL_PACKS || [];

  packs.forEach((pack) => {
    Object.entries(pack.text || {}).forEach(([language, entries]) => {
      if (!TEXT[language]) TEXT[language] = {};
      Object.assign(TEXT[language], entries);
    });

    Object.assign(DRILLS, pack.drills || {});
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

function selectDrillSteps(data) {
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
    drillKey: "soundFountain",
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
    conversationKeys: ["npc.mina.line1", "npc.mina.line2"],
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
    conversationKeys: ["npc.joon.line1", "npc.joon.line2"],
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
    conversationKeys: ["npc.sora.line1", "npc.sora.line2"],
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
    conversationKeys: ["npc.mrHan.line1", "npc.mrHan.line2"],
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

function languageName(code) {
  const language = LANGUAGES.find((candidate) => candidate.code === code);
  return language ? t(language.key) : code;
}

function speechSupported() {
  return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

function speechLanguageOptions() {
  if (!speechSupported()) return [];
  const voices = speechVoices();
  if (!voices.length) return LANGUAGES;

  const voicedLanguages = LANGUAGES.filter(({ code }) =>
    voices.some((voice) => voiceMatchesLanguage(voice, code)),
  );
  return voicedLanguages.length ? voicedLanguages : LANGUAGES;
}

function speechVoices() {
  return speechSupported() ? window.speechSynthesis.getVoices() : [];
}

function voiceMatchesLanguage(voice, languageCode) {
  const voiceLang = voice.lang.toLowerCase();
  const tag = (SPEECH_LANGUAGE_TAGS[languageCode] || languageCode).toLowerCase();
  return voiceLang === tag || voiceLang.startsWith(`${languageCode.toLowerCase()}-`);
}

function bestSpeechVoice(languageCode, profile = {}) {
  const scoredVoices = speechVoices()
    .filter((voice) => voiceMatchesLanguage(voice, languageCode))
    .map((voice) => ({
      voice,
      score: speechVoiceScore(voice, languageCode, profile),
      genderScore: voiceGenderScore(voice, languageCode, profile.gender),
    }));

  if (!scoredVoices.length) return null;

  const genderedVoices = profile.gender
    ? scoredVoices.filter((candidate) => candidate.genderScore > 0)
    : [];
  const candidates = genderedVoices.length ? genderedVoices : scoredVoices;
  candidates.sort((a, b) => b.score - a.score);

  const bestScore = candidates[0].score;
  const bestCandidates = candidates.filter((candidate) => candidate.score >= bestScore - 4);
  const personaIndex = stableHash(profile.id || profile.nameKey || "") % bestCandidates.length;
  return bestCandidates[personaIndex].voice;
}

function speechVoiceScore(voice, languageCode, profile = {}) {
  const name = String(voice.name || "").toLowerCase();
  const lang = String(voice.lang || "").toLowerCase();
  const preferredTag = (SPEECH_LANGUAGE_TAGS[languageCode] || languageCode).toLowerCase();
  const allHints = Object.values(EDGE_NATURAL_VOICE_HINTS[languageCode] || {}).flat();
  let score = 0;

  if (lang === preferredTag) score += 12;
  if (name.includes("microsoft")) score += 20;
  if (name.includes("online")) score += 35;
  if (name.includes("natural")) score += 50;
  if (name.includes("neural")) score += 45;
  if (name.includes("online (natural)")) score += 40;
  if (voice.localService === false) score += 12;
  if (allHints.some((hint) => name.includes(hint))) score += 10;
  if (profile.gender) score += voiceGenderScore(voice, languageCode, profile.gender);
  if (name.includes("desktop")) score -= 25;

  return score;
}

function voiceGenderScore(voice, languageCode, gender) {
  if (!gender) return 0;

  const name = String(voice.name || "").toLowerCase();
  const hints = EDGE_NATURAL_VOICE_HINTS[languageCode]?.[gender] || [];
  const oppositeGender = gender === "male" ? "female" : "male";
  const oppositeHints = EDGE_NATURAL_VOICE_HINTS[languageCode]?.[oppositeGender] || [];
  let score = 0;

  if (hints.some((hint) => name.includes(hint))) score += 80;
  if (oppositeHints.some((hint) => name.includes(hint))) score -= 80;
  if (name.includes(gender)) score += 25;
  if (name.includes(oppositeGender)) score -= 25;

  return score;
}

function stableHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function normalizeSpeechLanguage() {
  const options = speechLanguageOptions();
  if (!options.length) return false;
  if (!options.some((language) => language.code === settings.speech)) {
    settings.speech = options[0].code;
  }
  return true;
}

function speechLanguageName() {
  if (!normalizeSpeechLanguage()) return t("settings.speechUnavailable");
  return languageName(settings.speech);
}

function cycleSpeechLanguage(delta) {
  const options = speechLanguageOptions();
  if (!options.length) return;

  const currentIndex = Math.max(
    0,
    options.findIndex((language) => language.code === settings.speech),
  );
  const nextIndex = (currentIndex + delta + options.length) % options.length;
  settings.speech = options[nextIndex].code;
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

  if (!speechVoices().length && !dialog.voiceRetry) {
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

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = bestSpeechVoice(settings.speech, dialog.voiceProfile);

  utterance.lang = voice?.lang || SPEECH_LANGUAGE_TAGS[settings.speech] || settings.speech;
  utterance.voice = voice || null;
  utterance.rate = settings.speech === "ko" ? 0.92 : 0.98;
  utterance.pitch = 1;
  utterance.onend = () => finishDialogSpeech(speechToken);
  utterance.onerror = () => finishDialogSpeech(speechToken);

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function finishDialogSpeech(speechToken) {
  if (!dialog || dialog.speechToken !== speechToken) return;
  dialog.textVisible = true;
  dialog.speaking = false;
}

function stopSpeech() {
  clearTimeout(speechRetryTimer);
  if (speechSupported()) window.speechSynthesis.cancel();
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
  stopSpeech();
  currentSceneId = sceneId;
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

  Object.assign(scenes, createInteriorScenes());
  Object.assign(scenes, createTown2InteriorScenes(scenes.town2.buildings));
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
      conversationKeys: ["npc.town2GateGreeter.line1", "npc.town2GateGreeter.line2"],
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
      conversationKeys: ["npc.town2PlazaGuide.line1", "npc.town2PlazaGuide.line2"],
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
      conversationKeys: ["npc.town2ReviewClerk.line1", "npc.town2ReviewClerk.line2"],
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
      conversationKeys: ["npc.town2LabelRunner.line1", "npc.town2LabelRunner.line2"],
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
      conversationKeys: ["npc.town2ActionCoach.line1", "npc.town2ActionCoach.line2"],
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
      conversationKeys: ["npc.town2RoadGuard.line1", "npc.town2RoadGuard.line2"],
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
      conversationKeys: ["npc.town2Resident.line1", "npc.town2Resident.line2"],
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
        conversationKeys: ["npc.trailKeeper.line1", "npc.trailKeeper.line2"],
      },
    ],
    areaKey: "area.haneulTrail",
    musicKey: "trail1",
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
  });
  fillInteriorObject(elementarySchool, 8, 1, 6, 1, "blackboard", "object.schoolBlackboard", {
    conversationKeys: ["object.schoolBlackboard.line1"],
  });
  fillInteriorObject(elementarySchool, 15, 1, 5, 1, "mapBoard", "object.vowelWallMap", {
    studyBoardKey: "basicVowels",
  });
  fillInteriorObject(elementarySchool, 1, 4, 2, 3, "bookcase", "object.schoolBookshelf", {
    conversationKeys: ["object.schoolBookshelf.line1"],
  });
  fillInteriorObject(elementarySchool, 19, 5, 2, 3, "bookcase", "object.schoolBookshelf", {
    conversationKeys: ["object.schoolBookshelf.line1"],
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
    conversationKeys: ["npc.hangulTeacher.line1", "npc.hangulTeacher.line2"],
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
  placeInteriorObject(rivalGuesthouse, 9, 2, "desk", "object.desk");
  fillInteriorObject(rivalGuesthouse, 10, 2, 2, 1, "bookcase", "object.bookcase");
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
    kind: "child",
    wander: true,
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
    conversationKeys: ["npc.teaOwner.line1", "npc.teaOwner.line2"],
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
    conversationKeys: ["npc.marketClerk.line1", "npc.marketClerk.line2"],
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
    conversationKeys: ["npc.travelGuide.line1", "npc.travelGuide.line2"],
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
    conversationKeys: ["npc.town2CityLeader.line1", "npc.town2CityLeader.line2"],
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
    studyBoardKey: options.studyBoardKey || null,
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

function openDialogFor(target) {
  if (!target) return;
  stopSpeech();

  if (target.npc) {
    if (target.npc.drillKey) {
      startDrill(target.npc.drillKey);
      return;
    }

    const opposite = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    target.npc.dir = opposite[player.dir];
    dialog = {
      lines: target.npc.conversationKeys.map((key) => ({ key })),
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

  if (target.item?.studyBoardKey) {
    openStudyBoard(target.item.studyBoardKey);
    return;
  }

  if (target.item?.drillKey) {
    startDrill(target.item.drillKey);
    return;
  }

  if (target.item?.conversationKeys) {
    dialog = {
      lines: target.item.conversationKeys.map((key) => ({ key })),
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
    correctCount: 0,
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
    drill.complete = true;
    drill.answered = false;
    drill.feedbackKey = null;
    return;
  }

  drill.index += 1;
  drill.selected = 0;
  drill.answered = false;
  drill.feedbackKey = null;
}

function answerDrillStep() {
  const step = currentDrillStep();
  if (!step || drill.answered) return;

  const correct = drill.selected === step.answer;
  if (correct) drill.correctCount += 1;
  drill.answered = true;
  drill.feedbackKey = correct ? step.correctKey : step.incorrectKey;
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

  if (dir === "up" || dir === "down") {
    event.preventDefault();
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
    } else if (action === "settings") {
      ui.menuScreen = "settings";
      ui.menuIndex = 0;
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
    ui.menuScreen = "main";
    ui.menuIndex = 1;
  } else if (row === "speech") {
    cycleSpeechLanguage(1);
  } else {
    cycleLanguage(row, 1);
  }
}

function adjustCurrentSetting(delta) {
  const row = settingsRows[ui.menuIndex];
  if (row === "primary" || row === "secondary") {
    cycleLanguage(row, delta);
  } else if (row === "speech") {
    cycleSpeechLanguage(delta);
  }
}

function cycleLanguage(settingName, delta) {
  const currentIndex = LANGUAGES.findIndex((language) => language.code === settings[settingName]);
  const nextIndex = (currentIndex + delta + LANGUAGES.length) % LANGUAGES.length;
  settings[settingName] = LANGUAGES[nextIndex].code;
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
  const w = Math.min(230, Math.max(190, window.innerWidth - 28));
  const h = 138;
  const x = Math.max(14, window.innerWidth - w - 14);
  const y = 14;

  drawUiBox(x, y, w, h);
  drawFittedText(t("game.title"), x + 18, y + 20, w - 36, 14, true);

  const rows = [
    [t("panel.area"), t(currentScene().areaKey)],
    [t("panel.facing"), t(`direction.${player.dir}`)],
    [t("panel.tile"), `${player.tileX}, ${player.tileY}`],
    [t("panel.primary"), languageName(settings.primary)],
    [t("panel.secondary"), languageName(settings.secondary)],
  ];

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
    { label: t("menu.back"), value: "" },
  ];

  labels.forEach((row, index) => {
    const rowY = y + 54 + index * 32;
    drawMenuCursor(x + 18, rowY + 3, index === ui.menuIndex);

    if (index < labels.length - 1) {
      drawFittedText(row.label, x + 42, rowY, Math.max(94, w * 0.42), 14, false);
      drawFittedText(row.value, x + Math.max(178, w * 0.5), rowY, w - Math.max(198, w * 0.5), 14, false);
    } else {
      drawFittedText(row.label, x + 42, rowY, w - 62, 14, false);
    }
  });
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
      entry.name,
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
  const baseHeight = drill.complete ? 178 : 164 + choiceCount * 34 + (drill.answered ? 54 : 0);
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
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  if (!step) return;

  const promptLines = wrapText(t(step.promptKey), w - 56, `18px ${UI_FONT}`);
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
    drawFittedText(t(choiceKey), x + 56, rowY, w - 86, 17, false);
  });

  if (drill.answered && drill.feedbackKey) {
    const feedbackY = choicesY + choiceCount * 34 + 12;
    drawFittedText(t(drill.feedbackKey), x + 28, feedbackY, w - 56, 15, false);
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
  window.speechSynthesis.getVoices();
  const handleVoicesChanged = () => normalizeSpeechLanguage();
  if (typeof window.speechSynthesis.addEventListener === "function") {
    window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
  } else {
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
  }
}

buildMap();
buildScenes();
resize();
requestAnimationFrame(loop);
