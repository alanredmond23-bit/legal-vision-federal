export interface CaseData {
  name: string;
  docket: string;
  court: string;
  judge: string;
  defendant: string;
  attorney: {
    name: string;
    firm: string;
    hourly_rate: number;
    travel_time_hours: number;
  };
  target_date: string;
  trial_date: string;
  engagement_start: string;
  charges: {
    total: number;
    conspiracy: number;
    wire_fraud: number;
    tax_evasion: number;
    tax_failure: number;
  };
}

export interface Node {
  id: number;
  title: string;
  phase: string;
  day_from_start: number;
  deadline: string;
  client_task: string;
  attorney_task: string;
  attorney_hours_min: number;
  attorney_hours_max: number;
  travel_hours: number;
  estimated_cost_min: number;
  estimated_cost_max: number;
  probability: number;
  govt_responses: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface NodesData {
  engagement_start: string;
  nodes: Node[];
}

export interface PhaseData {
  moves: number[];
  total_attorney_hours_min: number;
  total_attorney_hours_max: number;
  total_travel_hours: number;
  estimated_cost_min: number;
  estimated_cost_max: number;
  description: string;
}

export interface ScenarioData {
  name: string;
  phases_included: string[];
  probability: number | null;
  estimated_total_min: number;
  estimated_total_max: number;
  description: string;
}

export interface MotionPriorityGroup {
  label: string;
  motions: string[];
}

export interface EvidenceItem {
  item: string;
  status?: string;
  action?: string;
  location?: string;
}

export interface EvidenceStatus {
  have: EvidenceItem[];
  need: EvidenceItem[];
  locate: EvidenceItem[];
}

export interface OutcomeData {
  name: string;
  probability: number | null;
  description: string;
}

export interface CostsData {
  attorney: {
    name: string;
    hourly_rate: number;
    travel_rate: number;
  };
  phases: Record<string, PhaseData>;
  scenarios: Record<string, ScenarioData>;
  summary: {
    total_moves: number;
    total_attorney_hours_min: number;
    total_attorney_hours_max: number;
    total_travel_hours: number;
    minimum_cost: number;
    maximum_cost: number;
    expected_value: number | null;
  };
  motion_priority_groups: Record<string, MotionPriorityGroup>;
  evidence_status: EvidenceStatus;
  outcomes: OutcomeData[];
}

export type ViewMode = 'attorney' | 'timeline' | 'warroom' | 'gametree' | 'progress' | 'forecasting' | 'deliverables' | 'coming';

export interface TaskStatus {
  nodeId: number;
  status: 'todo' | 'in_progress' | 'done';
}

export interface ProgressState {
  tasks: TaskStatus[];
  lastUpdated: string;
}
