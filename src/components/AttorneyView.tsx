import { Clock, DollarSign, Calendar, CheckCircle, AlertTriangle, FileText, Search, FolderOpen, TrendingUp, Trophy, Zap } from 'lucide-react';
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

  // Early Win Incentive Data - Shows effective $/hour at each phase
  const earlyWinIncentives = [
    {
      phase: 'Phase 1',
      name: 'Discovery Win',
      payment: 40000,
      hours: 45,
      effectiveRate: 889,
      description: 'Case dismissed on discovery/Brady violations',
      highlight: true,
      emoji: '🏆'
    },
    {
      phase: 'Phase 2',
      name: 'Motion Victory',
      payment: 42000,
      hours: 75,
      effectiveRate: 560,
      description: 'Key counts dismissed via motions',
      highlight: true,
      emoji: '⚡'
    },
    {
      phase: 'Phase 3',
      name: 'Evidentiary Win',
      payment: 44000,
      hours: 100,
      effectiveRate: 440,
      description: 'Evidence suppressed, case weakened',
      highlight: false,
      emoji: '📋'
    },
    {
      phase: 'Phase 4',
      name: 'Plea Deal',
      payment: 46000,
      hours: 120,
      effectiveRate: 383,
      description: 'Favorable plea negotiated',
      highlight: false,
      emoji: '🤝'
    },
    {
      phase: 'Phase 5-6',
      name: 'Trial Prep/Trial',
      payment: 50000,
      hours: 165,
      effectiveRate: 303,
      description: 'Full trial preparation and execution',
      highlight: false,
      emoji: '⚖️'
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

      {/* Early Win Incentive Panel - Right Side */}
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-6 space-y-4">
          {/* Header Card */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Early Win Bonus</h3>
                <p className="text-green-100 text-sm">Higher $/hr for faster wins</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 mt-3">
              <p className="text-sm text-green-100">Win early = Same pay, fewer hours</p>
              <p className="text-2xl font-bold mt-1">Up to $889/hr</p>
            </div>
          </div>

          {/* Phase Breakdown */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
            <div className="bg-green-50 px-4 py-3 border-b border-green-200">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Effective Rate by Phase</span>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {earlyWinIncentives.map((incentive, idx) => (
                <div
                  key={idx}
                  className={`p-4 ${incentive.highlight ? 'bg-gradient-to-r from-green-50 to-emerald-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{incentive.emoji}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          incentive.highlight
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {incentive.phase}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mt-1">{incentive.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{incentive.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        incentive.highlight ? 'text-green-600' : 'text-gray-700'
                      }`}>
                        ${incentive.effectiveRate}
                      </p>
                      <p className="text-xs text-gray-500">per hour</p>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      ${incentive.payment.toLocaleString()} total
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{incentive.hours} hrs
                    </span>
                  </div>

                  {/* Progress bar showing relative hourly rate */}
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          incentive.highlight
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                            : 'bg-gray-400'
                        }`}
                        style={{ width: `${(incentive.effectiveRate / 889) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Zap className="w-5 h-5" />
              <span className="font-bold">Strategy Focus</span>
            </div>
            <p className="text-sm text-amber-700 mt-2">
              Phase 1 & 2 wins maximize your effective hourly rate.
              <span className="font-bold"> Focus early motions!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
