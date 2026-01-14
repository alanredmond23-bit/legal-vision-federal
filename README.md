# EDPA 24-376 Litigation Game Tree

Strategic litigation planning tool for **United States v. Redmond** (EDPA 24-376).

## Overview

This React application provides two views for managing litigation strategy:

1. **Attorney View** - Simplified 10-move battle plan with client/attorney task allocation
2. **War Room View** - Full strategic analysis with government response matrix and cascade probabilities

## Case Information

- **Docket**: EDPA 24-376
- **Court**: U.S. District Court, Eastern District of Pennsylvania
- **Judge**: Hon. Jeffrey L. Schmehl
- **Target Date**: March 17, 2026
- **Trial Date**: April 1, 2026
- **Total Charges**: 27 counts (1 conspiracy, 19 wire fraud, 4 tax evasion, 3 tax failure to file)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd edpa-24376-litigation-tree
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

### Option 1: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist/` folder to the `gh-pages` branch:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 3: Deploy with gh-pages package

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```

3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

## Project Structure

```
edpa-24376-litigation-tree/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types.ts
│   ├── components/
│   │   ├── AttorneyView.tsx
│   │   └── WarRoomView.tsx
│   └── data/
│       ├── case.json
│       ├── nodes.json
│       └── costs.json
└── README.md
```

## Features

### Attorney View
- 10-move battle plan through target date
- Client vs Attorney task columns
- Hours and cost tracking
- Phase breakdown with budget allocation
- Cost scenario analysis (plea vs trial)

### War Room View
- Probability analysis for each move
- Government response matrix (A/B/C/D scenarios)
- Cascade probability analysis
- Decision gate tracking
- Charge breakdown

## Legal Notice

**PRIVILEGED AND CONFIDENTIAL**

This application contains attorney work product prepared in anticipation of litigation. The contents are protected by attorney-client privilege and work product doctrine.

Do not distribute outside authorized personnel.

---

Generated for strategic planning purposes in EDPA 24-376.
