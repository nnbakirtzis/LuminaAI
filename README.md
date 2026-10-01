<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Lumina Careers

**Deciding your future shouldn't be a guessing game.**

Lumina is an AI-powered job finder that goes beyond keyword matching. Instead of dumping a list of postings on you, it analyzes each opportunity for fit, salary outlook, and long-term career value—so you can make the right move, not just the next one.

## What it does

- **Smart job search** — Tell Lumina what you're looking for (role, location, salary, work style) and optionally upload your resume. It finds and ranks opportunities that actually match your goals.
- **Market intelligence** — Optional deeper analysis covers labor-market competitiveness, salary forecasts, and where a role could take your career over time.
- **Resume tailoring** — Generate a version of your resume tuned to a specific job, based only on what's already in your CV—nothing invented.
- **Real Value** — Compare what a salary offer really means between locations, accounting for cost of living and purchasing power.
- **Live progress** — Watch the search unfold in real time as specialized AI agents work through each step.

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Setup

```bash
npm install
```

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Sign-in uses a local demo auth flow for development.

## Project structure

```
LuminaAI/
├── components/          # UI components
├── context/             # React context (auth)
├── pages/               # Routes (Home, About, Pricing, FAQ, Login)
├── services/            # AI agents and auth logic
├── utils/               # Input sanitization for agent prompts
└── README.md
```

## Privacy

Your resume is processed to generate match scores and tailored versions—it is not sold to recruiters or third parties. See the in-app FAQ for more detail.

## License

This project is open source. See repository settings for license details.
