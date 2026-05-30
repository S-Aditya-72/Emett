# 🕵️‍♂️ Emett: Evidence-Backed GTM Intelligence

**Turn public web signals into verified, account-level GTM intelligence.**

Emett is an AI-powered Go-To-Market intelligence platform that helps sales and growth teams detect early signs of customer pain from the open web. Instead of relying only on stale lead databases or generic website intent, Emett monitors public developer communities, competitor discussions, and market signals to generate evidence-backed account briefs.

The goal is simple: help GTM teams understand **which accounts may be experiencing pain, why the timing matters, and what action should be taken next** — without deanonymizing individual users or relying on invasive tracking.

---

## 🛑 The Problem

Traditional GTM tools often rely on broad macro-signals such as job postings, funding announcements, tech-stack data, or website visits. These signals are useful, but they are often delayed, generic, or disconnected from the actual pain buyers are experiencing.

In many B2B markets, real intent appears earlier in public conversations:

* Developers discussing vendor lock-in
* Teams complaining about pricing changes
* Engineers sharing migration difficulties
* Users raising issues around latency, reliability, or API limits
* Companies appearing repeatedly across public technical discussions

These signals are valuable, but they are scattered, noisy, and difficult for sales teams to monitor manually.

---

## 💡 The Solution

Emett converts scattered public web activity into structured, privacy-safe GTM intelligence.

It does not attempt to identify anonymous users or expose personal identities. Instead, it focuses on **account-level intelligence**: detecting company-level pain signals, scoring confidence, adding context, and generating human-reviewed GTM recommendations.

### Core Workflow

**Scout**
Searches the live web for public discussions related to a competitor, pain point, or market trigger.

**Extract**
Identifies relevant pain signals from sources such as Reddit, GitHub, Hacker News, forums, and public web pages.

**Resolve**
Maps signals to company-level context where possible, while avoiding deanonymization of individual users.

**Remember**
Uses persistent memory to connect repeated signals from the same account over time.

**Brief**
Generates an evidence-backed GTM intelligence brief with the detected pain, source context, confidence level, and recommended next step.

---

## 🛠️ Architecture & Tech Stack

Emett uses a polyglot architecture with a Next.js frontend, Firebase real-time database, Bright Data-powered live web access, LangChain-based orchestration, and a Python memory sidecar.

### Core Infrastructure

* **Frontend:** Next.js 14, React, Tailwind CSS
* **Database:** Firebase Firestore
* **Real-Time UI:** Firestore `onSnapshot` listeners
* **AI Orchestration:** LangChain.js
* **Memory Service:** Python FastAPI microservice with Cognee
* **Web Data Layer:** Bright Data SERP API / Web Unlocker / Scraper tooling
* **LLM Provider:** AI/ML API using OpenAI-compatible endpoints

---

## 🏆 Sponsor Technology Integrations

### 🌐 Bright Data — Live Web Access

Bright Data powers Emett’s live web intelligence layer.

Emett uses Bright Data to search and access public web sources where early market signals appear, including developer communities, public discussions, and competitor-related pages.

Possible uses include:

* Searching public forums and developer communities
* Accessing JavaScript-rendered or bot-protected pages
* Extracting relevant public signals from noisy web results
* Supporting real-time GTM research workflows

### 🧠 AI/ML API — Intelligence Layer

The AI/ML API powers Emett’s reasoning and extraction pipeline.

Emett uses LLM calls to:

* Parse unstructured web snippets
* Extract pain points and company-level signals
* Convert noisy web data into structured JSON
* Score signal relevance and confidence
* Generate privacy-safe GTM briefings

LangChain.js is used to orchestrate the multi-step agent workflow.

### 💾 Cognee — Account Memory

Cognee is integrated as a Python FastAPI sidecar for persistent account memory.

When Emett detects a new signal, it can query historical account memory to understand whether the same account has shown related pain before. This allows Emett to build a more complete account narrative over time.

For example:

* Week 1: Account shows pricing concerns
* Week 2: Account shows migration frustration
* Week 3: Emett upgrades the account to a stronger intent signal

This memory layer helps Emett move beyond one-time scraping and toward continuous account intelligence.

---

## ⚙️ How It Works

### 1. User Input

A GTM user enters their product, a competitor, and target pain points.

Example:

```text
Product: Supabase
Competitor: Firebase
Pain Points: vendor lock-in, pricing unpredictability, relational data limitations
```

### 2. Live Web Search

The Next.js backend triggers the agent workflow. Bright Data is used to search and access relevant public web sources.

### 3. Signal Extraction

The AI pipeline extracts public pain signals, source context, company mentions, and relevance indicators.

### 4. Privacy-Safe Resolution

Emett focuses on account-level context. It does not attempt to deanonymize Reddit, GitHub, Hacker News, or forum users.

### 5. Memory Check

The system queries the Cognee memory service to check whether the account has appeared in previous signals.

### 6. Real-Time Delivery

The final GTM intelligence brief is saved to Firebase Firestore. The React dashboard updates instantly using real-time listeners.

---

## 📊 Example Intelligence Brief

```json
{
  "account": "ExampleCorp",
  "painDetected": "Developers discussing migration friction and limitations in their current backend workflow",
  "sourceType": "Public developer discussion",
  "competitorMentioned": "Firebase",
  "confidence": "Medium",
  "whyNow": "Recent public discussion indicates active frustration around backend flexibility and data modeling",
  "recommendedAction": "Review account fit and prepare a privacy-safe messaging angle around SQL flexibility and portability",
  "privacyMode": "Account-level only"
}
```

---

## 🛡️ Privacy & Compliance

Emett is designed as a privacy-safe intelligence tool.

The platform does **not** attempt to deanonymize individual users from Reddit, GitHub, Hacker News, or other public communities. It does not convert anonymous comments into personal identities.

Instead, Emett focuses on:

* Publicly available web signals
* Account-level context
* Evidence-backed briefs
* Confidence scoring
* Human-reviewed GTM action
* Compliant outreach guidance

This makes Emett suitable for teams that want useful market intelligence without surveillance-like behavior.

---

## 🚀 Running Emett Locally

Because Emett uses both a Next.js app and a Python memory service, you need to run two processes.

---

## 1. Set Up Environment Variables

Create a `.env.local` file inside the `Emett/` project directory.

```env
# AI/ML API
OPENAI_API_KEY="your-aiml-api-key"
OPENAI_BASE_URL="https://api.aimlapi.com/v1"

# Bright Data
BRIGHT_DATA_BEARER_TOKEN="your-bright-data-token"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

An `.env.example` file is included as a reference.

---

## 2. Start the Cognee Memory Server

Ensure Python 3.10+ is installed.

From the `Emett/` project directory:

```bash
# Create a virtual environment
python -m venv .venv
```

Activate the virtual environment:

```bash
# macOS/Linux
source .venv/bin/activate
```

```powershell
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install cognee fastapi uvicorn python-dotenv
```

Start the memory microservice:

```bash
python -m uvicorn cognee_server:app --port 8000
```

The memory service will run at:

```text
http://localhost:8000
```

---

## 3. Start the Next.js App

In a separate terminal, from the `Emett/` project directory:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🧩 Project Structure

```text
Emett/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── trigger-agent/
│   │   │   └── webhooks/
│   │   ├── dashboard/
│   │   │   ├── [campaignId]/
│   │   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── AccountSignalCard.tsx
│   │   ├── CampaignForm.tsx
│   │   └── DeleteCampaignButton.tsx
│   ├── lib/
│   │   ├── agents/
│   │   ├── firebase/
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── cognee_server.py
├── .env.example
├── .gitignore
├── LICENSE
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

Generated folders and local-only files such as `node_modules/`, `.next/`, `.venv/`, `__pycache__/`, `.env.local`, and `tsconfig.tsbuildinfo` should not be committed.

---

## 🎯 Why Emett Matters

GTM teams need better ways to understand market timing. Public web signals often reveal pain before traditional intent platforms capture it, but those signals are fragmented and hard to operationalize.

Emett helps teams move from raw web noise to structured intelligence:

```text
Public signal → Account context → Memory check → Confidence score → GTM brief
```

This turns live web data into a practical decision layer for sales, growth, and competitive intelligence teams.

---

## 🔮 Future Improvements

* Stronger source attribution and evidence trails
* More advanced confidence scoring
* CRM integrations
* Scheduled monitoring campaigns
* Additional public source types
* Team workspaces
* Better account memory visualization
* Privacy review workflow before outreach
* Deployment-ready background worker for longer-running agent tasks

---

## 📌 Summary

Emett is a privacy-safe, memory-powered GTM intelligence platform that turns public web signals into evidence-backed account briefs.

It combines Bright Data, LangChain, Firebase, AI/ML API, and Cognee to help GTM teams detect real market pain, understand account timing, and act with context.
