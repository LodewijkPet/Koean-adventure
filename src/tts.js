(function () {
  const LANGUAGE_TAGS = {
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

  const PROVIDERS = {
    edgeNaturalOnline: "edge-natural-online",
    genericNative: "generic-native",
    edgeDesktopFallback: "edge-desktop-fallback",
    browserFallback: "browser-fallback",
  };

  const config = {
    preferEdgeNaturalWhenOnline: true,
    genericNativeFallbackEnabled: true,
    demoEdgeDesktopFallbackEnabled: true,
  };

  function hasInternetConnection() {
    return typeof navigator === "undefined" || navigator.onLine !== false;
  }

  function supported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function voices() {
    return supported() ? window.speechSynthesis.getVoices() : [];
  }

  function voiceMatchesLanguage(voice, languageCode) {
    const voiceLang = String(voice.lang || "").toLowerCase();
    const tag = (LANGUAGE_TAGS[languageCode] || languageCode).toLowerCase();
    return voiceLang === tag || voiceLang.startsWith(`${languageCode.toLowerCase()}-`);
  }

  function voiceProvider(voice) {
    if (!voice) return PROVIDERS.browserFallback;

    const name = String(voice.name || "").toLowerCase();
    const isMicrosoft = name.includes("microsoft");
    const isEdgeNatural =
      isMicrosoft &&
      (name.includes("online") || name.includes("natural") || name.includes("neural"));

    if (isEdgeNatural) return PROVIDERS.edgeNaturalOnline;
    if (isMicrosoft && name.includes("desktop")) return PROVIDERS.edgeDesktopFallback;
    if (voice.localService === true) return PROVIDERS.genericNative;
    return PROVIDERS.browserFallback;
  }

  function providerEnabled(provider) {
    if (provider === PROVIDERS.edgeNaturalOnline) {
      return config.preferEdgeNaturalWhenOnline && hasInternetConnection();
    }
    if (provider === PROVIDERS.genericNative) return config.genericNativeFallbackEnabled;
    if (provider === PROVIDERS.edgeDesktopFallback) return config.demoEdgeDesktopFallbackEnabled;
    return true;
  }

  function bestVoice(languageCode, profile = {}) {
    const scoredVoices = voices()
      .filter((voice) => voiceMatchesLanguage(voice, languageCode))
      .filter((voice) => providerEnabled(voiceProvider(voice)))
      .map((voice) => ({
        voice,
        score: voiceScore(voice, languageCode, profile),
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

  function voiceScore(voice, languageCode, profile = {}) {
    const name = String(voice.name || "").toLowerCase();
    const lang = String(voice.lang || "").toLowerCase();
    const preferredTag = (LANGUAGE_TAGS[languageCode] || languageCode).toLowerCase();
    const provider = voiceProvider(voice);
    const allHints = Object.values(EDGE_NATURAL_VOICE_HINTS[languageCode] || {}).flat();
    let score = 0;

    if (lang === preferredTag) score += 12;
    if (provider === PROVIDERS.edgeNaturalOnline) score += hasInternetConnection() ? 70 : -100;
    if (provider === PROVIDERS.genericNative) score += 18;
    if (provider === PROVIDERS.edgeDesktopFallback) score += config.demoEdgeDesktopFallbackEnabled ? 6 : -100;
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

  function languageOptions(languages) {
    if (!supported()) return [];
    const availableVoices = voices();
    if (!availableVoices.length) return languages;

    const voicedLanguages = languages.filter(({ code }) =>
      availableVoices.some((voice) => voiceMatchesLanguage(voice, code) && providerEnabled(voiceProvider(voice))),
    );
    return voicedLanguages.length ? voicedLanguages : languages;
  }

  function normalizeLanguage(settings, languages) {
    const options = languageOptions(languages);
    if (!options.length) return false;
    if (!options.some((language) => language.code === settings.speech)) {
      settings.speech = options[0].code;
    }
    return true;
  }

  function cycleLanguage(settings, languages, delta) {
    const options = languageOptions(languages);
    if (!options.length) return;

    const currentIndex = Math.max(
      0,
      options.findIndex((language) => language.code === settings.speech),
    );
    const nextIndex = (currentIndex + delta + options.length) % options.length;
    settings.speech = options[nextIndex].code;
  }

  function speak({ text, languageCode, voiceProfile, onComplete }) {
    if (!supported() || !text) return null;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = bestVoice(languageCode, voiceProfile);

    utterance.lang = voice?.lang || LANGUAGE_TAGS[languageCode] || languageCode;
    utterance.voice = voice || null;
    utterance.rate = languageCode === "ko" ? 0.92 : 0.98;
    utterance.pitch = 1;
    utterance.onend = onComplete;
    utterance.onerror = onComplete;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    return {
      provider: voiceProvider(voice),
      voiceName: voice?.name || null,
      online: hasInternetConnection(),
    };
  }

  function stop() {
    if (supported()) window.speechSynthesis.cancel();
  }

  function prepare(onVoicesChanged) {
    if (!supported()) return;

    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    } else {
      window.speechSynthesis.onvoiceschanged = onVoicesChanged;
    }
  }

  function providerStatus(languageCode, profile = {}) {
    const voice = bestVoice(languageCode, profile);
    return {
      online: hasInternetConnection(),
      provider: voiceProvider(voice),
      voiceName: voice?.name || null,
      demoEdgeDesktopFallbackEnabled: config.demoEdgeDesktopFallbackEnabled,
      genericNativeFallbackEnabled: config.genericNativeFallbackEnabled,
    };
  }

  window.KOREA_ADVENTURE_TTS = {
    PROVIDERS,
    config,
    languageTags: LANGUAGE_TAGS,
    supported,
    voices,
    languageOptions,
    normalizeLanguage,
    cycleLanguage,
    speak,
    stop,
    prepare,
    providerStatus,
    hasInternetConnection,
  };
}());
