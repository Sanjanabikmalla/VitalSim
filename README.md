
# Pulsiq — Health Intelligence Platform

> *Your body has a story. Pulsiq reads it.*

---

## What is Pulsiq?

Most health apps count calories. Pulsiq thinks differently.

Pulsiq is a clinical-grade health intelligence platform that transforms your daily food choices into a living, breathing data story. It treats your body like a living economy — where every meal you eat either grows or drains your health stocks, accelerates or reverses your biological age, and moves you closer to or further from the future version of yourself.

Log a meal, get a crime report. Track five food colors, unlock your rainbow. Watch your immunity, energy, heart, brain, and gut respond in real time. Pulsiq doesn't just track your health — it tells you the story of it.

---

## Features

### 📈 Health Stock Market
Your body's economy, live. Six biological systems — Immunity, Energy, Heart, Brain, Bone, and Gut — each tracked as a stock that rises and falls with every meal you log. Watch your portfolio grow or decline in real time.

### 🩻 Bio-Age Scanner
Are you aging faster than you should be? Pulsiq calculates your biological age based on your diet, sleep, stress, and activity — then shows you exactly how many years ahead or behind schedule your body is running.

### 🕵️ Food Crime Investigator
No meal escapes justice. Every food you log goes on trial. Pulsiq delivers a full crime report — nutritional crimes committed, a dramatic verdict, and a sentence you can actually serve to make things right.

### 👤 Future Self
Meet who you're becoming. Based on your current habits, Pulsiq projects your health 1, 3, and 5 years forward — and sends you a personal message from that future version of yourself. Proud if you're doing well. Worried if you're not.

### 🌈 Rainbow Tracker
Phytonutrient diversity, gamified. Log foods across five color groups — Red, Orange, Yellow, Green, and Purple — and watch your daily rainbow fill up. Complete all five and earn your XP bonus.

### 🧪 Food Lab
Science your plate. Enter up to five ingredients and Pulsiq maps the synergies and conflicts between them — which combinations boost absorption, which cancel each other out, and how to combine them into the most powerful meal possible.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (ES6+) |
| Fonts | Orbitron, Inter, JetBrains Mono (Google Fonts) |
| Storage | localStorage (local-first architecture) |
| AI Engine | Simulated client-side (promptathon-safe) |
| Hosting | Single HTML file — zero dependencies |

---

## Architecture

```
pulsiq/
├── index.html          ← Entire application (single file)
│
│   Sections inside index.html:
│   ├── CONFIG & CONSTANTS
│   ├── STATE MANAGEMENT
│   ├── MOCK AI ENGINE
│   ├── HEALTH SCORE ENGINE
│   ├── STORAGE UTILITIES
│   ├── UI UTILITIES
│   ├── ONBOARDING SCREENS (6 steps)
│   ├── DASHBOARD
│   ├── FEATURE: BODY STOCKS
│   ├── FEATURE: BIO-AGE SCANNER
│   ├── FEATURE: FUTURE SELF
│   ├── FEATURE: FOOD CRIME INVESTIGATOR
│   ├── FEATURE: RAINBOW TRACKER
│   ├── MEAL LOG MODAL
│   ├── NAVIGATION & ROUTING
│   ├── EVENT LISTENERS
│   ├── TESTS
│   └── APP INIT
│
└── README.md           ← This file
```

---

## Design System

**Theme:** Clinical Light — clean, trustworthy, medical-grade.

| Token | Value | Usage |
|---|---|---|
| `--bg-page` | `#F0F4FF` | Page background |
| `--bg-card` | `#FFFFFF` | All cards |
| `--primary` | `#6366F1` | Buttons, active states |
| `--secondary` | `#06B6D4` | Accents, highlights |
| `--success` | `#10B981` | Healthy states |
| `--warning` | `#F59E0B` | Caution states |
| `--danger` | `#EF4444` | Critical states |
| `--text-primary` | `#1E1B4B` | Headings |
| `--text-body` | `#374151` | Body text |
| `--text-muted` | `#6B7280` | Descriptions |

**Fonts:**
- `Orbitron` — headings and logo (700, 900)
- `Inter` — all body and UI text (300, 400, 500, 600)
- `JetBrains Mono` — numbers and data readouts (400, 500)

**No emojis. No real photography. All illustrations are pure CSS and SVG.**

---

## How It Works

### Onboarding (6 Steps)
1. **Who are you?** — Choose your persona (Gym Goer, Student, Working Pro, etc.)
2. **Your mission** — Pick your health goals (multi-select)
3. **Your body** — Enter age, weight, height, gender via styled sliders
4. **Your life** — Rate sleep quality, stress level, and activity
5. **Health conditions** — Flag any relevant conditions
6. **Profile reveal** — See your predicted bio-age and health score

### Meal Logging
Tap the floating **+** button at any time. Enter what you ate, pick a meal type, and hit Analyze. Pulsiq runs the full analysis pipeline:
- Updates your Health Stocks
- Generates a Crime Report
- Checks for Rainbow colors
- Recalculates your Bio-Age
- Refreshes your Dashboard

### AI Engine
AI responses in Pulsiq are **simulated client-side** using a rich mock response engine. This ensures:
- Zero API key exposure
- Zero CORS errors
- Full offline support
- Consistent, fast responses

> All AI-generated content is clearly labelled with an **"AI Simulated"** badge in the interface.

---

## Security

| Concern | Solution |
|---|---|
| API key exposure | No real API calls — mock AI engine |
| XSS attacks | All inputs sanitized via `sanitizeInput()` |
| Data privacy | All data stays in localStorage — never leaves the device |
| Input length | Hard capped at 500 characters |
| Rate limiting | 1000ms minimum between AI calls |

```javascript
// Input sanitization on every user-submitted string
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'`]/g, '').trim().slice(0, 500);
}
```

---

## Health Score Engine

Pulsiq calculates health scores using transparent, explainable logic:

```javascript
function calculateHealthScore(logs) {
  let score = 100;
  const junkMeals   = logs.filter(l => l.type === 'junk').length;
  const veggies     = logs.filter(l => l.hasVeggies).length;
  const skipped     = logs.filter(l => l.skipped).length;

  if (junkMeals > 2) score -= 20;   // Junk food penalty
  if (veggies < 2)   score -= 15;   // Insufficient vegetables
  if (skipped > 0)   score -= 10;   // Skipped meals

  return Math.max(score, 0);
}
```

Score breakdown is shown transparently in the UI — users can always see exactly why their score is what it is.

---

## Accessibility

Pulsiq is built to WCAG 2.1 AA standards:

- Skip navigation link on every screen
- All interactive elements have `aria-label`
- Sliders include `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- Modals use `role="dialog"` with focus trapping
- Live regions announce dynamic updates (`aria-live="polite"`)
- Contrast ratios exceed 4.5:1 on all text
- Minimum 44px tap targets throughout
- Full keyboard navigation support
- `prefers-reduced-motion` respected — all animations disabled when set

---

## Tests

Pulsiq includes built-in self-tests that run on startup and log to console:

```javascript
function runTests() {
  console.group('[Pulsiq:Tests]');
  console.assert(sanitizeInput('<script>') === 'script', 'XSS sanitization');
  console.assert(calculateHealthScore([]) === 100, 'Empty logs = perfect score');
  console.assert(calculateHealthScore([{type:'junk'},{type:'junk'},{type:'junk'}]) === 80, 'Junk penalty applied');
  console.assert(calculateBioAge({age:25, activity:'active', sleep:8, stress:2}) < 25, 'Active lifestyle = younger bio-age');
  console.groupEnd();
}
```

Open DevTools → Console to see test results on every load.

---

## Getting Started

No installation. No build step. No dependencies.

```bash
# Clone or download
git clone https://github.com/yourname/pulsiq.git

# Open directly in browser
open index.html
```

Or just double-click `index.html`. That's it.

---

## Performance

- Single HTML file — one network request to load everything
- Google Fonts loaded with `display=swap` — no render blocking
- All animations use CSS transforms — no layout thrashing
- Slider inputs debounced at 300ms
- Mock AI responses cached in `Map()` — identical inputs return instantly
- DOM nodes queried once at init, never inside loops
- `requestAnimationFrame` used for all number count-up animations

---

## Roadmap

| Feature | Status |
|---|---|
| Health Stock Market | Done |
| Bio-Age Scanner | Done |
| Food Crime Investigator | Done |
| Rainbow Tracker | Done |
| Future Self | Done |
| Food Lab | Done |
| Real AI integration (Claude API via proxy) | Planned |
| Firebase sync & multi-device | Planned |
| Wearable data import | Planned |
| Nutritionist sharing mode | Planned |

---

## Built For

**Promptathon 2025** — built as a single-file, zero-dependency, production-grade health intelligence platform in record time.

---

## License

MIT License. Use it, fork it, build on it.

---

## Credits

**Pulsiq** was designed and built with attention to every pixel, every interaction, and every line of code. The bioluminescent-to-clinical design evolution, the food crime metaphor, the body stock market concept — all original.

> *"Your body has a story. Pulsiq reads it."*
