window.KA = window.KA || {};

let speechRetryTimer = null;

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

window.KA.speech = {
  supported: speechSupported,
  languageOptions: speechLanguageOptions,
  normalizeLanguage: normalizeSpeechLanguage,
  languageName: speechLanguageName,
  cycleLanguage: cycleSpeechLanguage,
  speakDialogLine,
  stop: stopSpeech,
};
