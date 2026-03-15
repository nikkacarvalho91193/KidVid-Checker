<div align="center">

```
 ██████╗██╗  ██╗██╗██╗     ██████╗ ███████╗ █████╗ ███████╗███████╗
██╔════╝██║  ██║██║██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔════╝
██║     ███████║██║██║     ██║  ██║███████╗███████║█████╗  █████╗  
██║     ██╔══██║██║██║     ██║  ██║╚════██║██╔══██║██╔══╝  ██╔══╝  
╚██████╗██║  ██║██║███████╗██████╔╝███████║██║  ██║██║     ███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝
```

# 🛡️ YouTube Content Safety Analyzer

**AI-powered video screening to keep children safe online**

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Powered by GPT](https://img.shields.io/badge/GPT--5-Powered-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Typed-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

---

*Helping parents make smarter, faster decisions about their children's screen time — powered by artificial intelligence.*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Overstimulation Analysis](#-overstimulation-analysis)
- [Safety Reports](#-safety-reports)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Screenshots & Flow](#-screenshots--flow)
- [Disclaimer](#-disclaimer)

---

## 🌟 Overview

Every parent has been there — your child asks to watch a YouTube video, and you're not sure if it's truly appropriate. Checking each video manually is time-consuming and unreliable.

**YouTube Content Safety Analyzer** solves this by combining the **YouTube Data API** with **GPT-5 AI** to instantly evaluate videos for:

- Age-appropriateness and content rating
- Overstimulation risk for young children
- Mature themes, violence, language, and scary content
- Alternative child-safe video suggestions

> 💡 Built as a first AI project — demonstrating real-world integration of LLMs into a full-stack web application.

---

## ✨ Features

### 🔍 Smart YouTube Search
```
┌─────────────────────────────────────────────────────┐
│  Search: [ dinosaurs for kids              🔍 Search ]│
│                                                       │
│  📹 Dinosaur Train S1E1    ✅ Safe  │  Age: All Ages  │
│  📹 Jurassic World Clip    ⚠️  Review│  Age: 10+      │
│  📹 Dino Dan Full Episode  ✅ Safe  │  Age: 4+        │
└─────────────────────────────────────────────────────┘
```
- Search YouTube directly within the app
- Results displayed as animated cards with thumbnails
- Real-time AI analysis per video
- Color-coded safety badges (green = safe, red = flag, gray = unanalyzed)

---

### 🤖 AI Content Analysis
Each video is analyzed by GPT-5 across multiple dimensions:

| Dimension | What's Checked |
|-----------|---------------|
| 🎯 **Age Rating** | All Ages / 7+ / 10+ / 13+ / Not for Children |
| 🧠 **AI Reasoning** | Plain-English explanation of the AI's decision |
| 🏷️ **Content Tags** | educational, cartoon, violence, scary, gaming, music, etc. |
| 📊 **Confidence Score** | 0–100% confidence bar showing AI certainty |
| ✅ **Appropriateness** | Binary safe/unsafe verdict with detailed reasoning |

---

### 🧠 Overstimulation Analysis

> *"Not all child-appropriate content is created equal."*

A unique feature that goes beyond simple content moderation — evaluating how mentally stimulating a video is for young children.

```
┌──────────────────────────────────────────────────────┐
│  🧠 OVERSTIMULATION ANALYSIS                         │
│  ⚠️  Decision support only — not medical advice      │
│                                                      │
│  Rating:     🟡 MODERATE                             │
│  Age Rec:    Best for school-age children 6+         │
│                                                      │
│  Detected Factors:                                   │
│  • Rapid scene changes                               │
│  • Energetic background music                        │
│  • Bright, high-contrast colors                      │
│                                                      │
│  "This video has fast pacing and energetic audio     │
│   that may be overwhelming for toddlers."            │
└──────────────────────────────────────────────────────┘
```

**Three overstimulation levels:**
- 🟢 **Low** — Calm pacing, suitable for all young children
- 🟡 **Moderate** — May be intense for toddlers; better for older kids
- 🔴 **High** — Fast cuts, loud audio, flashing visuals — limit for young children

**Factors analyzed:**
- Rapid scene changes or fast editing
- Loud or intense background music
- Bright, neon, or flashing visuals
- Repetitive phrasing or looping content
- Fast-paced narration or speech

---

### 🔄 Child-Safe Alternative Suggestions

When a video is flagged as inappropriate, the AI automatically suggests safer alternatives:

```
📚 Safer Alternatives Suggested:

  🔎 "educational dinosaur videos for kids"
     💡 Covers the same topic with age-appropriate content
     📺 Suggested: Crash Course Kids, PBS Kids, National Geographic Kids

  🔎 "Dinosaur Train full episodes"
     💡 A beloved educational series that makes learning fun
     📺 Suggested: PBS Kids, Wild Kratts
```

The AI knows about popular child-friendly channels including:
- **Educational:** Khan Academy Kids, PBS Kids, SciShow Kids, Crash Course Kids
- **Entertainment:** CoComelon, Ryan's World, Blippi, Pinkfong, Super Simple Songs
- **Science/Nature:** Wild Kratts, SmarterEveryDay, National Geographic Kids
- **Stories:** Storyline Online, Brightly Storytime

---

### 📄 Exportable Safety Reports

Generate and download a full safety report for any analyzed video:

```
════════════════════════════════════════════
       CHILDSAFE CONTENT ANALYSIS REPORT
════════════════════════════════════════════
Video: "Super Fun Slime for Kids!"
Channel: FunWithSlime
Analyzed: March 15, 2026

SAFETY VERDICT:  ✅ APPROPRIATE
AGE RATING:      All Ages
CONFIDENCE:      91%

CONTENT TAGS:    craft, educational, DIY, fun

AI REASONING:
This video features child-friendly craft activities
with calm narration and no inappropriate content...

OVERSTIMULATION: 🟡 MODERATE
Age Recommendation: Best for ages 5+
Factors: Upbeat background music, colorful visuals

════════════════════════════════════════════
```

- Plain-text `.txt` format for easy sharing
- Includes all analysis dimensions
- Timestamped for record-keeping
- Perfect for school settings, childcare providers, or parental controls

---

## 🔄 How It Works

```
User searches          YouTube API          GPT-5 AI Analysis
for a topic    ──▶    returns videos   ──▶   per video
     │                     │                      │
     │                     ▼                      ▼
     │             Video metadata:        Safety verdict
     │             • Title                Age rating
     │             • Description          Content tags
     │             • Channel              Confidence score
     │             • Tags                 Overstimulation
     │                                    Alternatives
     │                                         │
     └────────────────────────────────────────▶│
                                               ▼
                                    Results displayed
                                    in animated cards
                                    with full modal
                                    detail view
```

1. **Search** — Enter any keyword or topic
2. **Fetch** — YouTube Data API returns up to 10 videos
3. **Analyze** — Click "Analyze" on any card; GPT-5 evaluates the metadata
4. **Review** — Full analysis displayed in a detailed modal
5. **Export** — Download the report as a text file

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  React 18 + TypeScript  │  Tailwind CSS + shadcn/ui     │
│  TanStack Query         │  Framer Motion animations     │
│  Wouter routing         │  Lucide React icons           │
├─────────────────────────────────────────────────────────┤
│                     BACKEND                             │
│  Node.js + Express      │  Drizzle ORM                  │
│  PostgreSQL             │  Zod validation               │
├─────────────────────────────────────────────────────────┤
│                  AI & EXTERNAL APIs                     │
│  OpenAI GPT-5           │  YouTube Data API v3          │
│  Replit AI Integrations │                               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
youtube-safety-analyzer/
│
├── client/                     # React frontend
│   └── src/
│       ├── pages/
│       │   └── Home.tsx        # Main landing & search page
│       ├── components/
│       │   ├── VideoCard.tsx   # Video result card with analysis
│       │   └── AnalysisModal.tsx # Full analysis detail view
│       └── lib/
│           └── queryClient.ts  # API request helper
│
├── server/                     # Express backend
│   ├── routes.ts               # API route definitions
│   ├── storage.ts              # Database access layer
│   └── services/
│       ├── analyzer.ts         # GPT-5 AI analysis logic
│       └── youtube.ts          # YouTube API integration
│
├── shared/
│   └── schema.ts               # Shared types & DB schema (Drizzle)
│
└── attached_assets/            # Background images for landing page
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- YouTube Data API key
- OpenAI API key (via Replit AI Integrations)

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start the development server
npm run dev
```

The app runs on a single port — Express serves both the API and the Vite-built frontend.

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key |
| `SESSION_SECRET` | Express session secret |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key (via Replit) |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI base URL (via Replit) |

---

## 🖼️ Screenshots & Flow

### Landing Page
```
╔══════════════════════════════════════════════════════╗
║  [📸 child   ]                          [📸 kids   ] ║
║  [watching TV]   🛡️ ChildSafe          [w/ tablet ] ║
║                                                      ║
║         Is This YouTube Video Safe                   ║
║              for Your Child?                         ║
║                                                      ║
║  [ Search videos, channels, topics...   🔍 Search ] ║
║                                                      ║
║  ✨ AI Analysis  🧠 Overstimulation  📄 Reports      ║
║  🔄 Alternatives 🔒 Safe Defaults   📱 Mobile-Ready  ║
╚══════════════════════════════════════════════════════╝
```

### Video Results
```
╔══════════════════════════════════════════════════════╗
║ [Thumbnail] 🎬 Video Title Here              ✅ Safe ║
║             📺 ChannelName                          ║
║             Age: All Ages   Confidence: 94%          ║
║             [🔍 Analyze]  [📄 View Report]           ║
╠══════════════════════════════════════════════════════╣
║ [Thumbnail] 🎬 Another Video Title           ⚠️ Flag ║
║             📺 AnotherChannel                        ║
║             Age: 13+        Confidence: 87%          ║
║             [🔍 Analyze]  [📄 View Report]           ║
╚══════════════════════════════════════════════════════╝
```

---

## ⚠️ Disclaimer

> **This tool is designed to support parental decision-making — not replace it.**
>
> The overstimulation analysis feature is for **informational purposes only** and does **not** constitute medical advice. Every child is different. Always use your own judgment when determining what content is appropriate for your child.
>
> AI analysis is based on video metadata (title, description, channel, tags) and may not perfectly reflect actual video content. We recommend watching videos yourself when in doubt.

---

<div align="center">

**Made with ❤️ to help keep kids safe online**

*My First AI Project — combining the power of GPT-5 with real-world parenting needs*

</div>
