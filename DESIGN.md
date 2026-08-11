# 🎨 LingoSnap System Design Specification (`DESIGN.md`)

## 1. Product Vision & Concept

**Product**: LingoSnap  
**Core Concept**: *"Learn languages through one meaningful image."*

LingoSnap helps users build long-term foreign language vocabulary by connecting target words with visual situation anchors.

### Learning Paradigm Shift:
- **Traditional**: $\text{Word} \longrightarrow \text{Translation}$ (Rote memorization)
- **LingoSnap**: $\text{Image} \longrightarrow \text{Meaning} \longrightarrow \text{Word} \longrightarrow \text{Sentence}$ (Contextual visual anchoring)

---

## 2. 7-Step Learning Flow (MVP UX)

When a user opens a lesson, the app guides them through a step-by-step visual revelation flow:

```
[Step 1: Show Image Only]
"What is happening?"
        │
        ▼
[Step 2: Reveal Target Word] (e.g. "eat")
        │
        ▼
[Step 3: Show Native Meaning] (e.g. "먹다")
        │
        ▼
[Step 4: Play Pronunciation Audio] (BCP-47 TTS)
        │
        ▼
[Step 5: Show Example Sentence] (e.g. "I eat an apple.")
        │
        ▼
[Step 6: Practice Quiz Session] (3 Quiz Types)
        │
        ▼
[Step 7: Save SRS Progress & Next Review Schedule]
```

---

## 3. Lesson & Content Structure

A lesson consists of a curated set of situation-anchored vocabulary items grouped by real-life themes (e.g. *Daily Actions*, *Travel*, *Dining*).

### Example Lesson (*Daily Actions*):
- **Item 1**:
  - Image: Person running in a park
  - Word: `run`
  - Meaning: `달리다`
  - Sentence: `I run every morning.`
- **Item 2**:
  - Image: Child eating a fresh apple
  - Word: `eat`
  - Meaning: `먹다`
  - Sentence: `I eat breakfast.`

---

## 4. Image Strategy (MVP)

In MVP, each vocabulary item is paired with **one representative situation image** that clearly communicates **action** and **usage context**.

- `eat`: A child eating an apple
- `sleep`: A person sleeping peacefully in bed
- `open`: A person opening a wooden door

Images represent real-world usage rather than isolated dictionary noun icons.

---

## 5. Quiz System Design

The Quiz module reinforces memory retention through 3 distinct interactive question types:

1. **Image ➔ Word**: Display situation image; user selects the matching target word among 4 options.
2. **Word ➔ Image**: Display target word; user selects the correct situation image from 4 choices.
3. **Sentence Completion (Cloze Test)**: Display sentence with blank (e.g., `I ____ an apple.`) and select correct word (`eat`).

---


---

## 7. SRS Memory System

Every completed vocabulary item enters the Spaced Repetition System.

- **Variables**: Answer accuracy, repetition count, difficulty stage.
- **Intervals**: 1 day ➔ 3 days ➔ 7 days ➔ 14 days ➔ 30 days.
- **Goal**: Move short-term visual memories into permanent long-term memory.

---

## 8. Product Roadmap (Phased Approach)

- **MVP Phase 1**: Image Vocabulary Lessons, 7-step learning flow, 3 quiz types, Supabase SRS scheduling.
- **Phase 2 (AI Generation)**: AI example sentence generation, AI image generation prompts for content expansion.
- **Phase 3 (Personalization)**: User-uploaded custom photos & personal vocabulary collections.
- **Phase 4 (Interactive Learning)**: Interactive multi-object image hotspots and bounding box quizzes.

---

## 9. Non Goals (Explicit Exclusions)

Do **NOT** build or support:
- ❌ Partner matching system
- ❌ 1:1 Live chat or Messaging
- ❌ Social network feeds / Friends lists
- ❌ Real-time multiplayer matching
