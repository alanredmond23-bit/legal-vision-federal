import { Clock, DollarSign, Calendar, CheckCircle, AlertTriangle, FileText, Search, FolderOpen } from 'lucide-react';
import type { Node, CostsData } from '../types';

interface AttorneyViewProps {
  nodes: Node[];
  costs: CostsData;
  attorney: {
    name: string;
    firm: string;
    hourly_rate: number;
    travel_time_hours: number;
  };
  currentPhase?: string;
  engagementStart?: string;
}

function getPhaseClass(phase: string): string {
  const phaseMap: Record<string, string> = {
    'Discovery/Taint': 'phase-discovery',
    'Motion Battle': 'phase-motions',
    'Evidentiary Hearings': 'phase-hearings',
    'Plea Negotiation': 'phase-negotiation',
    'Pretrial Prep': 'phase-preparation',
    'Trial': 'phase-trial',
  };
  return phaseMap[phase] || 'bg-gray-100 text-gray-800';
}

export default function AttorneyView({ nodes, costs, attorney }: AttorneyViewProps) {
  // Calculate totals
  const totals = nodes.reduce(
    (acc, node) => ({
      attorneyHoursMin: acc.attorneyHoursMin + node.attorney_hours_min,
      attorneyHoursMax: acc.attorneyHoursMax + node.attorney_hours_max,
      travelHours: acc.travelHours + node.travel_hours,
      costMin: acc.costMin + node.estimated_cost_min,
      costMax: acc.costMax + node.estimated_cost_max,
    }),
    { attorneyHoursMin: 0, attorneyHoursMax: 0, travelHours: 0, costMin: 0, costMax: 0 }
  );

  // Case Resolution Scenarios - What "winning" looks like at each phase
  // Same total fee regardless of when case resolves, but fewer hours = higher effective rate
  const resolutionScenarios = [
    {
      phase: 'Phase 1',
      resolution: 'Dismissal',
      outcome: 'Government dismisses case',
      reason: 'Brady/Giglio violations, discovery failures, or prosecutorial misconduct force dismissal',
      totalFee: 45000,
      estimatedHours: 50,
      effectiveRate: 900,
      tier: 'optimal'
    },
    {
      phase: 'Phase 2',
      resolution: 'Motion Victory',
      outcome: 'Charges dropped',
      reason: 'Successful suppression motions eliminate key evidence; government cannot proceed',
      totalFee: 45000,
      estimatedHours: 85,
      effectiveRate: 529,
      tier: 'excellent'
    },
    {
      phase: 'Phase 3',
      resolution: 'Evidentiary Collapse',
      outcome: 'Case dismissed or reduced',
      reason: 'Evidentiary hearings expose fatal weaknesses; government offers dismissal or minimal plea',
      totalFee: 45000,
      estimatedHours: 110,
      effectiveRate: 409,
      tier: 'good'
    },
    {
      phase: 'Phase 4',
      resolution: 'Favorable Plea',
      outcome: 'No incarceration',
      reason: 'Negotiated resolution with probation, diversion, or deferred adjudication - no jail time',
      totalFee: 45000,
      estimatedHours: 130,
      effectiveRate: 346,
      tier: 'standard'
    },
    {
      phase: 'Phase 5-6',
      resolution: 'Trial Acquittal',
      outcome: 'Jury verdict: Not Guilty',
      reason: 'Full trial results in acquittal on all counts or hung jury forcing dismissal',
      totalFee: 45000,
      estimatedHours: 175,
      effectiveRate: 257,
      tier: 'extended'
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-1 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Litigation Phases</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-500">{nodes.length} Total Actions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Attorney Hours</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totals.attorneyHoursMin}-{totals.attorneyHoursMax}</p>
          <p className="text-sm text-gray-500">+ {totals.travelHours} travel hours</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Estimated Cost</span>
          </div>
          <p className="text-sm text-gray-700">Without Trial: <span className="font-bold text-gray-900">$40,000-$50,000</span></p>
          <p className="text-sm text-gray-700">With Trial: <span className="font-bold text-gray-900">$66,900-$95,850</span></p>
          <p className="text-xs text-gray-500 mt-1">@ ${attorney.hourly_rate}/hr</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Plea Probability</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">TBD</p>
          <p className="text-sm text-gray-500">Before Target Date</p>
        </div>
      </div>

      {/* Key Evidence Status */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-legal-navy text-white px-6 py-4">
          <h2 className="text-xl font-bold">Key Evidence Status</h2>
          <p className="text-blue-200 text-sm">Critical materials for defense strategy</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* HAVE Column */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-100 px-4 py-3 border-b border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-800">HAVE (Ready)</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {costs.evidence_status.have.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <FileText className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{item.item}</p>
                      {item.status && (
                        <span className="text-xs text-green-600 font-medium">{item.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEED Column */}
            <div className="border rounded-lg overflow-hidden border-red-200">
              <div className="bg-red-100 px-4 py-3 border-b border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-800">NEED (Urgent Action)</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {costs.evidence_status.need.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <Search className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{item.item}</p>
                      {item.action && (
                        <span className="text-xs text-red-600 font-bold">{item.action}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOCATE Column */}
            <div className="border rounded-lg overflow-hidden border-yellow-200">
              <div className="bg-yellow-100 px-4 py-3 border-b border-yellow-200">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-yellow-800">LOCATE (Client Possession)</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {costs.evidence_status.locate.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <FolderOpen className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">{item.item}</p>
                      {item.location && (
                        <span className="text-xs text-yellow-700">{item.location}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Cost Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Phase Cost Breakdown</h2>
          <p className="text-gray-300 text-sm">Budget allocation by litigation phase</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(costs.phases).map(([phaseName, phase]) => (
              <div
                key={phaseName}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  phaseName === 'Trial' ? 'bg-gray-50 opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`phase-badge ${getPhaseClass(phaseName)}`}>
                    {phaseName}
                  </span>
                  {phaseName === 'Trial' && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      If Necessary
                    </span>
                  )}
                </div>
                <div className="font-mono font-bold text-lg mb-2">
                  ${phase.estimated_cost_min.toLocaleString()}-${phase.estimated_cost_max.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>{phase.total_attorney_hours_min}-{phase.total_attorney_hours_max}h attorney</span>
                  <span>{phase.total_travel_hours}h travel</span>
                  <span>{phase.moves.length} actions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Potential Outcomes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Potential Outcomes</h2>
          <p className="text-gray-300 text-sm">Probability assessment</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-5 gap-4">
            {costs.outcomes.map((outcome, idx) => {
              const colors = [
                'border-green-500 bg-green-50',
                'border-blue-500 bg-blue-50',
                'border-yellow-500 bg-yellow-50',
                'border-orange-500 bg-orange-50',
                'border-red-500 bg-red-50',
              ];

              return (
                <div
                  key={idx}
                  className={`border-2 rounded-lg p-4 ${colors[idx]}`}
                >
                  <h3 className="font-bold text-gray-900 mb-2">{outcome.name}</h3>
                  <div className="text-center py-3">
                    <span className="text-3xl font-bold">
                      {outcome.probability !== null ? `${Math.round(outcome.probability * 100)}%` : 'TBD'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{outcome.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Case Resolution Economics - Right Side */}
      <div className="w-96 flex-shrink-0">
        <div className="sticky top-6 space-y-4">
          {/* Explanation Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-legal-navy text-white px-5 py-4">
              <h3 className="font-bold text-lg">Case Resolution Economics</h3>
              <p className="text-blue-200 text-sm mt-1">How early wins affect effective compensation</p>
            </div>
            <div className="p-5 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                The agreed fee for this matter is <span className="font-bold">$45,000</span> regardless of when the case resolves.
                However, your <span className="font-semibold">effective hourly rate</span> varies significantly based on
                <span className="font-semibold"> when</span> we achieve a favorable outcome.
              </p>
              <p className="text-sm text-gray-600 mt-3 italic">
                Earlier resolution = fewer billable hours = higher effective rate per hour worked.
              </p>
            </div>
          </div>

          {/* Resolution Scenarios */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-5 py-3 bg-gray-100 border-b border-gray-200">
              <span className="font-semibold text-gray-800 text-sm">If We Win At Each Phase</span>
            </div>

            <div className="divide-y divide-gray-100">
              {resolutionScenarios.map((scenario, idx) => {
                const tierStyles: Record<string, { bg: string; border: string; badge: string; rate: string }> = {
                  optimal: { bg: 'bg-green-50', border: 'border-l-green-500', badge: 'bg-green-600 text-white', rate: 'text-green-700' },
                  excellent: { bg: 'bg-emerald-50', border: 'border-l-emerald-500', badge: 'bg-emerald-600 text-white', rate: 'text-emerald-700' },
                  good: { bg: 'bg-blue-50', border: 'border-l-blue-500', badge: 'bg-blue-600 text-white', rate: 'text-blue-700' },
                  standard: { bg: 'bg-gray-50', border: 'border-l-gray-400', badge: 'bg-gray-500 text-white', rate: 'text-gray-700' },
                  extended: { bg: 'bg-gray-50', border: 'border-l-gray-300', badge: 'bg-gray-400 text-white', rate: 'text-gray-600' },
                };
                const style = tierStyles[scenario.tier];

                return (
                  <div
                    key={idx}
                    className={`p-4 border-l-4 ${style.bg} ${style.border}`}
                  >
                    {/* Phase & Resolution Type */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${style.badge}`}>
                          {scenario.phase}
                        </span>
                        <span className="font-semibold text-gray-900">{scenario.resolution}</span>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${style.rate}`}>
                          ${scenario.effectiveRate}/hr
                        </p>
                      </div>
                    </div>

                    {/* Outcome */}
                    <p className="text-sm font-medium text-gray-800">{scenario.outcome}</p>

                    {/* Reason */}
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{scenario.reason}</p>

                    {/* Hours Estimate */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Est. {scenario.estimatedHours} hours to resolution
                      </span>
                      <span className="text-gray-500">
                        ${scenario.totalFee.toLocaleString()} total fee
                      </span>
                    </div>

                    {/* Visual Rate Indicator */}
                    <div className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            scenario.tier === 'optimal' ? 'bg-green-500' :
                            scenario.tier === 'excellent' ? 'bg-emerald-500' :
                            scenario.tier === 'good' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${(scenario.effectiveRate / 900) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Implication */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-5">
              <h4 className="font-semibold text-gray-900 mb-2">Strategic Implication</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Aggressive early-phase litigation—particularly discovery motions and
                suppression filings—offers the highest return on attorney time investment.
                A Phase 1 or 2 victory delivers the same compensation with
                <span className="font-semibold"> 60-70% fewer hours</span> than a full trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
