import { AlertTriangle, ChevronDown } from 'lucide-react';
import type { Node } from '../types';

interface DefenseTimelineProps {
  nodes: Node[];
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export default function DefenseTimeline({ nodes }: DefenseTimelineProps) {
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

  // Group nodes by phase
  const nodesByPhase = nodes.reduce((acc, node) => {
    if (!acc[node.phase]) {
      acc[node.phase] = [];
    }
    acc[node.phase].push(node);
    return acc;
  }, {} as Record<string, Node[]>);

  const phaseOrder = [
    'Discovery/Taint',
    'Motion Battle',
    'Evidentiary Hearings',
    'Plea Negotiation',
    'Pretrial Prep',
    'Trial'
  ];

  return (
    <div className="space-y-6">
      {/* Phase Flow Overview - TOP RIGHT */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-indigo-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Phase Strategy Overview</h2>
          <p className="text-indigo-200 text-sm">What must happen at each phase for optimal outcome</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Discovery/Taint */}
            <div className="p-4 bg-blue-50 border-2 border-blue-400 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <h4 className="font-bold text-blue-900">Discovery/Taint</h4>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">WIN HERE</span>
              </div>
              <p className="text-sm text-blue-800">
                <span className="font-semibold">For 100% outcome:</span> File comprehensive Rule 16 demand within 24 hours of appearance.
                Request all Brady/Giglio materials. Document all taint team interactions. Identify Groff source contamination.
                Preserve all privilege claims. If government delays, motion to compel immediately.
              </p>
            </div>

            {/* Motion Battle */}
            <div className="p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <h4 className="font-bold text-yellow-900">Motion Battle</h4>
                <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">KEY PHASE</span>
              </div>
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">For 100% outcome:</span> File suppression motions attacking wire evidence foundation.
                Move to sever tax counts from fraud counts. Exclude all 404(b) prior acts evidence.
                Each motion must cite specific constitutional violations and supporting case law.
              </p>
            </div>

            {/* Evidentiary Hearings */}
            <div className="p-4 bg-cyan-50 border-2 border-cyan-400 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
                <h4 className="font-bold text-cyan-900">Evidentiary Hearings</h4>
              </div>
              <p className="text-sm text-cyan-800">
                <span className="font-semibold">For 100% outcome:</span> Present Franks challenge with documented warrant defects.
                Cross-examine affiant on misrepresentations. Argue suppression of all illegally obtained evidence.
                Build record for appeal on every evidentiary ruling.
              </p>
            </div>

            {/* Plea Negotiation */}
            <div className="p-4 bg-green-50 border-2 border-green-400 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <h4 className="font-bold text-green-900">Plea Negotiation</h4>
              </div>
              <p className="text-sm text-green-800">
                <span className="font-semibold">For 100% outcome:</span> Leverage suppression wins to negotiate reduced charges.
                Demand dismissal of weakened counts. Negotiate guidelines departure. Get cooperation credit without
                full cooperation. Target date: decision by March 18.
              </p>
            </div>

            {/* Pretrial Prep */}
            <div className="p-4 bg-orange-50 border-2 border-orange-400 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <h4 className="font-bold text-orange-900">Pretrial Prep</h4>
              </div>
              <p className="text-sm text-orange-800">
                <span className="font-semibold">For 100% outcome:</span> Prepare jury selection strategy targeting educated,
                business-savvy jurors. Finalize exhibit list excluding suppressed evidence. Lock in favorable
                jury instructions. Complete witness preparation.
              </p>
            </div>

            {/* Trial */}
            <div className="p-4 bg-gray-100 border border-gray-300 rounded-xl opacity-70">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                <h4 className="font-bold text-gray-700">Trial (If Necessary)</h4>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Goal:</span> This phase should be avoided through successful pre-trial strategy.
                If trial proceeds, attack government witnesses on cross, present alternative theory of events,
                preserve all appellate issues.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Defense Timeline with Workflow Sidebar */}
      <div className="flex gap-6">
        {/* Main Timeline */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-legal-navy text-white px-6 py-4">
            <h2 className="text-xl font-bold">Defense Timeline</h2>
            <p className="text-blue-200 text-sm">Client vs. Attorney Task Allocation by Phase</p>
          </div>

          <div className="overflow-x-auto">
          {phaseOrder.map(phaseName => {
            const phaseNodes = nodesByPhase[phaseName];
            if (!phaseNodes || phaseNodes.length === 0) return null;

            const isTrialPhase = phaseName === 'Trial';

            return (
              <div key={phaseName} className={isTrialPhase ? 'bg-gray-100 opacity-60' : ''}>
                {/* Phase Header */}
                <div className={`px-6 py-3 border-b ${isTrialPhase ? 'bg-gray-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`phase-badge ${getPhaseClass(phaseName)}`}>
                      {phaseName}
                    </span>
                    <span className="text-sm text-gray-600">
                      {phaseNodes.length} actions
                    </span>
                    {isTrialPhase && (
                      <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        If Necessary
                      </span>
                    )}
                  </div>
                </div>

                {/* Phase Tasks Table */}
                <table className="legal-table">
                  <thead>
                    <tr className={isTrialPhase ? 'bg-gray-200' : ''}>
                      <th className="w-16">Day</th>
                      <th className="w-48">Action</th>
                      <th className="w-24">Deadline</th>
                      <th className="w-1/4">CLIENT TASK</th>
                      <th className="w-1/4">ATTORNEY TASK</th>
                      <th className="w-20 text-center">Hours</th>
                      <th className="w-28 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {phaseNodes.map((node) => (
                      <tr key={node.id} className={`${node.id === 12 ? 'bg-yellow-50' : ''} ${isTrialPhase ? 'bg-gray-50' : ''}`}>
                        <td className="font-mono font-bold text-gray-500">
                          Day {node.day_from_start}
                        </td>
                        <td>
                          <div className={`font-semibold ${isTrialPhase ? 'text-gray-500' : 'text-gray-900'}`}>
                            {node.title}
                          </div>
                          {node.id === 12 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                              DECISION GATE
                            </span>
                          )}
                        </td>
                        <td className="font-mono text-sm">{formatDate(node.deadline)}</td>
                        <td className="text-sm">
                          <div className={`p-2 rounded border-l-2 ${isTrialPhase ? 'bg-gray-100 border-gray-400' : 'bg-blue-50 border-blue-400'}`}>
                            {node.client_task}
                          </div>
                        </td>
                        <td className="text-sm">
                          <div className={`p-2 rounded border-l-2 ${isTrialPhase ? 'bg-gray-100 border-gray-400' : 'bg-purple-50 border-purple-400'}`}>
                            {node.attorney_task}
                          </div>
                        </td>
                        <td className="text-center">
                          <div className="font-semibold">{node.attorney_hours_min}-{node.attorney_hours_max}h</div>
                          {node.travel_hours > 0 && (
                            <div className="text-xs text-gray-500">+{node.travel_hours}h travel</div>
                          )}
                        </td>
                        <td className="text-right font-mono font-semibold">
                          ${node.estimated_cost_min.toLocaleString()}-${node.estimated_cost_max.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Totals Footer */}
        <div className="bg-gray-100 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700">TOTAL ALL PHASES:</span>
            <div className="flex gap-8">
              <span className="font-semibold">{totals.attorneyHoursMin}-{totals.attorneyHoursMax}h attorney + {totals.travelHours}h travel</span>
              <span className="font-mono font-bold text-lg">${totals.costMin.toLocaleString()}-${totals.costMax.toLocaleString()}</span>
            </div>
          </div>
        </div>
        </div>

        {/* Workflow Sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h3 className="text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wide">Phase Flow</h3>
            <div className="flex flex-col items-center space-y-2">
              {/* Discovery/Taint - Larger */}
              <div className="w-full p-3 bg-blue-100 border-2 border-blue-500 rounded-lg text-center">
                <span className="text-sm font-bold text-blue-800">Discovery/Taint</span>
                <p className="text-xs text-blue-600 mt-1">WIN HERE</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />

              {/* Motion Battle - Larger, Yellow */}
              <div className="w-full p-3 bg-yellow-100 border-2 border-yellow-500 rounded-lg text-center">
                <span className="text-sm font-bold text-yellow-800">Motion Battle</span>
                <p className="text-xs text-yellow-600 mt-1">KEY PHASE</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />

              {/* Evidentiary Hearings */}
              <div className="w-full p-2 bg-cyan-50 border border-cyan-400 rounded-lg text-center">
                <span className="text-xs font-semibold text-cyan-800">Evidentiary Hearings</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />

              {/* Plea Negotiation */}
              <div className="w-full p-2 bg-green-50 border border-green-400 rounded-lg text-center">
                <span className="text-xs font-semibold text-green-800">Plea Negotiation</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />

              {/* Pretrial Prep */}
              <div className="w-full p-2 bg-orange-50 border border-orange-400 rounded-lg text-center">
                <span className="text-xs font-semibold text-orange-800">Pretrial Prep</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />

              {/* Trial - Dimmed */}
              <div className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-center opacity-60">
                <span className="text-xs font-semibold text-gray-600">Trial</span>
                <p className="text-[10px] text-gray-500">If Necessary</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
