import { useState } from 'react';
import { Scale, Target, Calendar, Users, Gavel, ClipboardList, TrendingUp, ChevronDown, ChevronRight, LayoutDashboard, Briefcase, GitBranch, Clock, DollarSign, Percent, FileCheck, Sparkles } from 'lucide-react';
import LoginPage from './components/LoginPage';
import AttorneyView from './components/AttorneyView';
import DefenseTimeline from './components/DefenseTimeline';
import WarRoomView from './components/WarRoomView';
import GameTreeViewV2 from './components/GameTreeViewV2';
import ProgressView from './components/ProgressView';
import ForecastingView from './components/ForecastingView';
import AlanDeliverablesView from './components/AlanDeliverablesView';
import ComingFeaturesView from './components/ComingFeaturesView';
import caseData from './data/case.json';
import nodesData from './data/nodes.json';
import costsData from './data/costs.json';
import type { CaseData, NodesData, CostsData, ViewMode } from './types';

const typedCaseData = caseData as CaseData;
const typedNodesData = nodesData as NodesData;
const typedCostsData = costsData as unknown as CostsData;

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const today = new Date();
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getDaysFromEngagement(): number {
  const engagement = new Date(typedCaseData.engagement_start);
  const today = new Date();
  const diff = today.getTime() - engagement.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getCurrentPhase(): string {
  const daysSinceStart = getDaysFromEngagement();

  if (daysSinceStart <= 14) return 'Discovery/Taint';
  if (daysSinceStart <= 35) return 'Motion Battle';
  if (daysSinceStart <= 45) return 'Evidentiary Hearings';
  if (daysSinceStart <= 56) return 'Plea Negotiation';
  if (daysSinceStart <= 82) return 'Pretrial Prep';
  return 'Trial';
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('attorney');
  const [dashboardExpanded, setDashboardExpanded] = useState(true);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const daysToTarget = getDaysUntil(typedCaseData.target_date);
  const daysToTrial = getDaysUntil(typedCaseData.trial_date);
  const currentPhase = getCurrentPhase();
  const daysSinceEngagement = getDaysFromEngagement();

  // Calculate attorney hours and cost totals
  const totals = typedNodesData.nodes.reduce(
    (acc, node) => ({
      attorneyHoursMin: acc.attorneyHoursMin + node.attorney_hours_min,
      attorneyHoursMax: acc.attorneyHoursMax + node.attorney_hours_max,
      costMin: acc.costMin + node.estimated_cost_min,
      costMax: acc.costMax + node.estimated_cost_max,
    }),
    { attorneyHoursMin: 0, attorneyHoursMax: 0, costMin: 0, costMax: 0 }
  );

  const menuItems: { id: ViewMode; label: string; icon: typeof Scale }[] = [
    { id: 'attorney', label: 'Attorney View', icon: Briefcase },
    { id: 'timeline', label: 'Defense Timeline', icon: Calendar },
    { id: 'warroom', label: 'Strategy Timeline', icon: GitBranch },
    { id: 'gametree', label: 'Game Tree', icon: GitBranch },
    { id: 'progress', label: 'Progress & Planner', icon: ClipboardList },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
    { id: 'deliverables', label: 'Alan Deliverables', icon: FileCheck },
    { id: 'coming', label: 'Coming Features', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-72 bg-legal-navy text-white flex flex-col min-h-screen">
        {/* Logo/Header */}
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-legal-gold" />
            <div>
              <h1 className="font-bold text-lg">{typedCaseData.name}</h1>
              <p className="text-xs text-blue-200">{typedCaseData.docket}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Collapsible Section */}
        <div className="border-b border-blue-800">
          <button
            onClick={() => setDashboardExpanded(!dashboardExpanded)}
            className="w-full p-4 flex items-center justify-between hover:bg-blue-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-legal-gold" />
              <span className="font-semibold">Dashboard</span>
            </div>
            {dashboardExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {dashboardExpanded && (
            <div className="px-4 pb-4 space-y-3">
              {/* Target Date */}
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                  <Target className="w-4 h-4" />
                  TARGET DATE
                </div>
                <p className="font-bold text-lg">{formatDate(typedCaseData.target_date)}</p>
                <p className="text-xs text-blue-300">{daysToTarget} days</p>
                <p className="text-xs text-blue-400 mt-1 italic">Continuance negotiation ongoing</p>
              </div>

              {/* Trial Date */}
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                  <Gavel className="w-4 h-4" />
                  TRIAL DATE
                </div>
                <p className="font-bold text-lg">{formatDate(typedCaseData.trial_date)}</p>
                <p className="text-xs text-blue-300">{daysToTrial} days</p>
              </div>

              {/* Total Charges */}
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                  <Scale className="w-4 h-4" />
                  TOTAL CHARGES
                </div>
                <p className="font-bold text-lg">{typedCaseData.charges.total} Counts</p>
                <p className="text-xs text-blue-300">
                  {typedCaseData.charges.wire_fraud}WF, {typedCaseData.charges.tax_evasion}TE, {typedCaseData.charges.tax_failure}TF
                </p>
              </div>

              {/* Litigation Phases */}
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                  <Calendar className="w-4 h-4" />
                  LITIGATION PHASES
                </div>
                <p className="font-bold text-lg">7 Phases</p>
                <p className="text-xs text-blue-300">Day {daysSinceEngagement} from engagement</p>
              </div>

              {/* Defendant */}
              <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                  <Users className="w-4 h-4" />
                  DEFENDANT
                </div>
                <p className="font-bold text-lg">{typedCaseData.defendant}</p>
                <p className="text-xs text-blue-300">@${typedCaseData.attorney.hourly_rate}/hr</p>
              </div>

              <div className="border-t border-blue-700 pt-3 space-y-3">
                {/* Attorney Hours */}
                <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                    <Clock className="w-4 h-4" />
                    ATTORNEY HOURS
                  </div>
                  <p className="font-bold text-lg">{totals.attorneyHoursMin}-{totals.attorneyHoursMax}h</p>
                </div>

                {/* Estimated Cost */}
                <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                    <DollarSign className="w-4 h-4" />
                    ESTIMATED COST
                  </div>
                  <p className="text-sm text-blue-100">Without Trial: <span className="font-bold">$40,000-$50,000</span></p>
                  <p className="text-sm text-blue-100">With Trial: <span className="font-bold">$66,900-$95,850</span></p>
                </div>

                {/* Plea Probability */}
                <div className="bg-blue-800/30 rounded-lg p-3 border border-blue-400/30">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                    <Percent className="w-4 h-4" />
                    PLEA PROBABILITY
                  </div>
                  <p className="font-bold text-lg">TBD</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = viewMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-white text-legal-navy font-semibold shadow-lg'
                    : 'text-blue-200 hover:bg-blue-800/50 hover:text-white border-2 border-blue-400/40 hover:border-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-800 text-xs text-blue-300">
          <p className="font-semibold text-white">Hon. {typedCaseData.judge}</p>
          <p>{typedCaseData.court}</p>
          <p className="mt-2">{typedCaseData.attorney.name}</p>
          <p className="text-blue-400">{typedCaseData.attorney.firm}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Current Phase Banner */}
        <div className="bg-blue-600 text-white py-2 px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm">Current Phase:</span>
            <span className="font-bold">{currentPhase}</span>
            <span className="text-blue-200">|</span>
            <span className="text-sm">Day {daysSinceEngagement} from engagement</span>
          </div>
        </div>

        {/* Main Content */}
        <main className={`flex-1 p-6 overflow-auto ${viewMode === 'gametree' ? 'max-w-full' : 'max-w-7xl'}`}>
          {viewMode === 'attorney' ? (
            <AttorneyView
              nodes={typedNodesData.nodes}
              costs={typedCostsData}
              attorney={typedCaseData.attorney}
              currentPhase={currentPhase}
              engagementStart={typedCaseData.engagement_start}
            />
          ) : viewMode === 'timeline' ? (
            <DefenseTimeline nodes={typedNodesData.nodes} />
          ) : viewMode === 'warroom' ? (
            <WarRoomView
              nodes={typedNodesData.nodes}
              costs={typedCostsData}
              caseInfo={typedCaseData}
            />
          ) : viewMode === 'progress' ? (
            <ProgressView
              nodes={typedNodesData.nodes}
              currentPhase={currentPhase}
            />
          ) : viewMode === 'forecasting' ? (
            <ForecastingView
              nodes={typedNodesData.nodes}
              costs={typedCostsData}
            />
          ) : viewMode === 'deliverables' ? (
            <AlanDeliverablesView />
          ) : viewMode === 'coming' ? (
            <ComingFeaturesView />
          ) : (
            <GameTreeViewV2 />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-400 py-3 px-6">
          <div className="text-center text-sm">
            <p>EDPA 24-376 Litigation Platform | Privileged Attorney Work Product</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
