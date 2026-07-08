# Cinematic Birthday Experience

A premium, QR-code-delivered interactive birthday journey — designed like a short emotional film rather than a normal website.

## Experience Flow

```
Night Sky Intro → Story Images → 5 Voice Messages → Suno Song → Sunrise Ending
```

| Scene | Description |
|-------|-------------|
| **Intro** | Photorealistic night sky, twinkling stars, typewriter text with keyboard sounds |
| **Story** | Full-screen images fade in one at a time with soft captions |
| **Voices** | 5 auto-playing audio messages with Web Audio visualizers — no buttons |
| **Song** | Full-screen cinematic music player with large animated visualizer |
| **Ending** | Golden sunrise scene with final emotional message |

## Quick Start (Replit)

1. Import this project into Replit
2. Click **Run** — serves on port 5000
3. Replace placeholder assets (see below)
4. Deploy as Static Deployment for QR code linking

## Replace Your Assets

### Images (`assets/images/`)

Replace the SVG placeholders with your real photos (JPG or PNG):

| File | Scene Caption |
|------|---------------|
| `her-smile.svg` → `her-smile.jpg` | Her smile that lights up every room |
| `the-day-we-met.svg` → `the-day-we-met.jpg` | The day we met |
| `memory-1.svg` → `memory-1.jpg` | Every laugh, every moment |
| `memory-2.svg` → `memory-2.jpg` | The adventures we shared |
| `memory-3.svg` → `memory-3.jpg` | Beautiful memories yet to come |

Update paths in `index.html` if you change extensions.

### Audio (`assets/audio/`)

Replace silent WAV placeholders with real recordings:

| File | Purpose |
|------|---------|
| `voice-1.wav` through `voice-5.wav` | Friend/family voice messages |
| `finale-song.wav` | Suno birthday song finale |

MP3 works too — update `src` attributes in `index.html`.

### Speaker Portraits (`assets/images/speakers/`)

Each voice message has its own feminine player skin with a portrait photo:

| File | Speaker | Skin Theme |
|------|---------|------------|
| `friend.svg` → `friend.jpg` | Your Best Friend | Rose blush |
| `mom.svg` → `mom.jpg` | Mom | Lavender dream |
| `sister.svg` → `sister.jpg` | Your Sister | Peach glow |
| `grandma.svg` → `grandma.jpg` | Grandma | Lilac whisper |
| `dad.svg` → `dad.jpg` | Dad | Champagne gold |

Replace SVG placeholders with real photos and update `portrait` paths in `js/app.js`.

Each skin includes: portrait ring, color-themed visualizer, play/pause/next controls, and progress bar.

## Local Development

```bash
cd cinematic-birthday
python3 -m http.server 8080
# Open http://localhost:8080
```

## Project Structure

```
cinematic-birthday/
├── index.html          # All 5 scenes
├── css/styles.css      # Premium cinematic styling
├── js/
│   ├── app.js          # State machine + auto-play logic
│   ├── visualizer.js   # Web Audio API visualizer
│   └── typewriter.js   # Typewriter + keyboard sounds
├── assets/
│   ├── images/         # Story photos
│   └── audio/          # Voice messages + finale song
└── .replit             # Replit config
```

## Audio Auto-Play Flow (No Buttons)

```
Message 1 plays
  ↓
"Another person wanted to tell you something..."
  ↓
Countdown: 3 → 2 → 1
  ↓
Message 2 plays
  ↓ (repeat)
Message 5 ends
  ↓
"That's everyone who wanted to speak to you..."
  ↓
Suno song starts
  ↓
Sunrise ending
```

## QR Code Deployment

After deploying on Replit:

1. Copy your deployed URL
2. Generate a QR code pointing to it (e.g. [qr-code-generator.com](https://www.qr-code-generator.com/))
3. Print or share the QR code

## Browser Notes

- Mobile browsers require a tap to unlock audio (handled automatically on first interaction)
- Works best in Chrome, Safari, and Firefox
- Designed for portrait mobile viewing via QR scan
