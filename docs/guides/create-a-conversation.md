# How To Create A Conversation Challenge

Conversation challenges are dialog-embedded Korean reply checks. An NPC asks in Korean, and the player chooses a Korean-only answer inside the dialog box.

## Register The Challenge

Register from an engine/content file that loads after `src/core/interactions.js`:

```js
window.KA.story.registerConversation({
  id: "town5MarketGreeting",
  turns: [
    {
      say: "npc.town5Clerk.challenge1",
      choices: [
        { ko: "안녕하세요.", correct: true, replyKey: "npc.town5Clerk.challenge1.correct" },
        { ko: "아니요.", correct: false, replyKey: "npc.town5Clerk.challenge1.retry" },
      ],
    },
  ],
  onPass: ["town5.clerkGreetingPassed"],
  onFailKey: "npc.town5Clerk.challengeFail",
});
```

Rules:

- `say`, every `replyKey`, and `onFailKey` must have `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.
- Choice text is Korean-only literal text in `choice.ko`.
- Put the correct answer first only when that is pedagogically useful; the runtime does not shuffle choices.
- Keep `onPass` flags append-only and never rename shipped flags.
- Use `replyKey` for gentle feedback. After one wrong answer, the same turn repeats. After two wrong answers, the runtime shows `conversation.answer` with the correct Korean choice, marks the challenge failed, then advances to the fail line.

## Hook An NPC

Add `conversationChallengeId` to an NPC:

```js
{
  nameKey: "npc.town5Clerk",
  x: 8,
  y: 4,
  dir: "down",
  voiceGender: "female",
  voiceId: "town5Clerk",
  conversationChallengeId: "town5MarketGreeting",
}
```

You can also use a resolver when the challenge should depend on progress:

```js
conversationChallengeResolver: () =>
  hasProgressFlag("town5.clerkGreetingPassed") ? null : "town5MarketGreeting",
```

If the resolver returns `null`, the NPC falls back to its ordinary `conversationResolver`, `conversationPools`, or `conversationKeys`.

## Controls

- Up/down moves through reply choices.
- Space or Enter submits the selected reply.
- Space reveals spoken text before submitting when TTS is still hidden.

## Verification

Run:

```powershell
node --check <changed-file.js>
node tools/smoke-test.js
```

The smoke test includes E2 coverage for a perfect pass, a retry-then-pass, and a failed challenge.
