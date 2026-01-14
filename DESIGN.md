# DESIGN.md - Litigation Game Tree Architecture

**Project:** EDPA 24-376 Litigation Game Tree
**Created:** January 13, 2026
**Stack:** Vite + React + TypeScript + Tailwind CSS

---

## Core Design Pattern: Dual-Audience Architecture

This app serves two distinct audiences with different information needs from the same underlying data.

### View 1: Attorney View (Professional/External)
- **Audience:** Benjamin Cooper (attorney)
- **Purpose:** Clean, professional, billable-hours focused
- **Tone:** Conservative, court-appropriate
- **Shows:** Tasks, responsibilities, hours, costs, deadlines
- **Hides:** Probabilities, game theory, government responses, strategic speculation

### View 2: War Room View (Strategic/Internal)
- **Audience:** Alan Redmond (client/strategist)
- **Purpose:** Full tactical intelligence
- **Tone:** Aggressive, comprehensive
- **Shows:** Everything - probabilities, cascades, A-B-C-D responses, decision gates
- **Hides:** Nothing

---

## Data Architecture

### Separation of Concerns
```
src/data/
├── case.json      # Static case metadata (case number, dates, parties)
├── nodes.json     # Strategic moves (17 nodes with probabilities)
├── edges.json     # Connections between moves (for graph visualization)
├── responses.json # Government A-B-C-D response matrix
├── costs.json     # Phase/move cost breakdowns
└── timeline.json  # Chronological events
```

### Node Schema (Strategic Move)
```typescript
interface StrategicNode {
  id: string;                    // Unique identifier
  move: number;                  // Sequence (1-17)
  name: string;                  // Display name
  type: "motion" | "hearing" | "filing" | "conference";
  phase: 1 | 2 | 3;             // Which phase
  deadline: string;              // ISO date
  probability: number;           // 0-100 win probability
  hours: number;                 // Attorney hours
  cost: number;                  // Dollar cost
  clientDoes: string;            // Client responsibilities
  attorneyDoes: string;          // Attorney responsibilities
  govResponseA?: string;         // Best case govt response
  govResponseB?: string;         // Likely response
  govResponseC?: string;         // Aggressive response
  govResponseD?: string;         // Worst case response
  cascade?: string[];            // What this unlocks if won
  tags?: string[];               // Franks, Brady, Giglio, etc.
}
```

---

## Visual Design System

### Color Palette (Tailwind)
```
Phase 1 (Nuclear Filing):  blue-600    #2563eb
Phase 2 (Court Battle):    amber-600   #d97706
Phase 3 (Resolution):      green-600   #16a34a

High Probability (>70%):   green-500   #22c55e
Medium Probability (40-70%): amber-500 #f59e0b
Low Probability (<40%):    red-500     #ef4444

Background:                gray-900    #111827
Card Background:           gray-800    #1f2937
Text Primary:              white
Text Secondary:            gray-400    #9ca3af
```

### Typography
- Headers: Bold, larger sizes (text-2xl, text-xl)
- Body: Regular weight (text-sm, text-base)
- Monospace for: costs, probabilities, dates
- Font stack: System defaults (Tailwind default)

### Component Patterns

#### Card Pattern
```jsx
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
  <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
  {children}
</div>
```

#### Stat Box Pattern
```jsx
<div className="text-center">
  <div className="text-3xl font-bold text-blue-400">{value}</div>
  <div className="text-sm text-gray-400">{label}</div>
</div>
```

#### Phase Badge Pattern
```jsx
<span className={`px-2 py-1 rounded text-xs font-medium ${phaseColor}`}>
  Phase {phase}
</span>
```

#### Probability Indicator
```jsx
<div className="flex items-center gap-2">
  <div className={`w-3 h-3 rounded-full ${probabilityColor}`} />
  <span className="font-mono">{probability}%</span>
</div>
```

---

## Layout Architecture

### Attorney View Layout
```
┌─────────────────────────────────────────────────────┐
│  Header: Case Title + Toggle Button                 │
├─────────────────────────────────────────────────────┤
│  Summary Stats: Total Hours | Total Cost | Deadline │
├─────────────────────────────────────────────────────┤
│  Table: 10-Move Battle Plan                         │
│  ┌────┬──────────┬────────┬──────────┬─────┬──────┐ │
│  │ #  │ Action   │ CLIENT │ ATTORNEY │ Hrs │ Cost │ │
│  ├────┼──────────┼────────┼──────────┼─────┼──────┤ │
│  │ 1  │ Meet...  │ ...    │ ...      │ 2   │ $600 │ │
│  │ 2  │ ...      │ ...    │ ...      │ ... │ ...  │ │
│  └────┴──────────┴────────┴──────────┴─────┴──────┘ │
├─────────────────────────────────────────────────────┤
│  Phase Totals: Phase 1 | Phase 2 | Phase 3          │
└─────────────────────────────────────────────────────┘
```

### War Room Layout
```
┌─────────────────────────────────────────────────────┐
│  Header: Case Title + Toggle Button                 │
├─────────────────────────────────────────────────────┤
│  Command Dashboard (4 columns)                      │
│  ┌───────────┬───────────┬───────────┬───────────┐  │
│  │ Win Index │ Total Hrs │ Total $   │ Target    │  │
│  │ 67%       │ 77        │ $23,100   │ Mar 17    │  │
│  └───────────┴───────────┴───────────┴───────────┘  │
├─────────────────────────────────────────────────────┤
│  Strategic Nodes Grid (3 columns)                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────┐ │
│  │ Franks Motion   │ │ Brady Motion    │ │ Tax... │ │
│  │ P(win): 65%     │ │ P(win): 80%     │ │ 85%    │ │
│  │ Phase 1         │ │ Phase 1         │ │ Ph 1   │ │
│  │ Govt A: ...     │ │ Govt A: ...     │ │ ...    │ │
│  │ Govt B: ...     │ │ Govt B: ...     │ │ ...    │ │
│  └─────────────────┘ └─────────────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│  Cascade Analysis                                   │
│  Franks Win → Suppress → Dismiss Wire → ...         │
├─────────────────────────────────────────────────────┤
│  Government Response Matrix (expandable)            │
└─────────────────────────────────────────────────────┘
```

---

## State Management

### Simple React State (No Redux needed)
```typescript
const [view, setView] = useState<'attorney' | 'warroom'>('attorney');
const [expandedNode, setExpandedNode] = useState<string | null>(null);
```

### Data Loading
```typescript
// Static imports for simplicity (data baked into build)
import caseData from './data/case.json';
import nodes from './data/nodes.json';
import costs from './data/costs.json';
```

---

## Responsive Behavior

- **Desktop (>1024px):** Full 3-column grid, all details visible
- **Tablet (768-1024px):** 2-column grid, summary stats stack
- **Mobile (<768px):** Single column, cards stack, table scrolls horizontally

---

## Key Design Decisions

### 1. Why Two Views Instead of Permission-Based?
- Simpler to maintain
- No auth required
- User controls what to share
- Attorney never accidentally sees speculation

### 2. Why Static JSON Instead of Database?
- Case data changes infrequently
- No server needed
- Can be hosted on GitHub Pages
- Version controlled with case files

### 3. Why Tailwind Instead of Component Library?
- Full design control
- Smaller bundle
- Matches legal document aesthetic (conservative, professional)
- Easy to customize colors per case

### 4. Why Dark Theme?
- War Room aesthetic
- Reduces eye strain during long sessions
- Professional appearance
- Better contrast for probability colors

---

## Future Enhancements

### Phase 2 Features
- [ ] Cytoscape.js swimlane visualization
- [ ] PDF export (html2pdf.js)
- [ ] Timeline view (horizontal Gantt)
- [ ] Node click → detail modal
- [ ] Real-time probability calculator

### Phase 3 Features
- [ ] Multiple case support
- [ ] Supabase backend for live updates
- [ ] Collaborative annotations
- [ ] Outcome tracking (predicted vs actual)

---

## File Structure
```
edpa-24376-litigation-tree/
├── DESIGN.md                 # This file
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── index.html
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main component + view toggle
│   ├── index.css             # Tailwind imports
│   ├── components/
│   │   ├── AttorneyView.tsx  # Clean table view
│   │   └── WarRoomView.tsx   # Full strategic view
│   └── data/
│       ├── case.json         # Case metadata
│       ├── nodes.json        # Strategic moves
│       ├── costs.json        # Cost breakdown
│       ├── edges.json        # Graph connections
│       ├── responses.json    # Govt response matrix
│       └── timeline.json     # Event timeline
└── dist/                     # Build output
```

---

## Reuse Instructions

To adapt this for another case:

1. Copy entire `edpa-24376-litigation-tree/` folder
2. Rename folder to new case number
3. Update `src/data/case.json` with new case details
4. Update `src/data/nodes.json` with new strategic moves
5. Update `src/data/costs.json` with new cost model
6. Run `npm install && npm run dev`

The design system, components, and architecture remain constant. Only the data changes.

---

**Design Pattern Name:** Dual-Audience Litigation Dashboard
**Suitable For:** Any multi-stakeholder case management where internal strategy differs from external communication.
