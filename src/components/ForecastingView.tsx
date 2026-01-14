import { AlertTriangle, TrendingUp, Calculator, BarChart3 } from 'lucide-react';
import type { Node, CostsData } from '../types';

interface ForecastingViewProps {
  nodes: Node[];
  costs: CostsData;
}

function getProbabilityClass(prob: number): string {
  if (prob >= 0.7) return 'prob-high';
  if (prob >= 0.4) return 'prob-medium';
  return 'prob-low';
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

export default function ForecastingView({ nodes, costs }: ForecastingViewProps) {
  // Calculate cumulative costs by phase
  const phaseOrder = ['Discovery/Taint', 'Motion Battle', 'Evidentiary Hearings', 'Plea Negotiation', 'Pretrial Prep', 'Trial'];
  let cumulativeMin = 0;
  let cumulativeMax = 0;
  const cumulativeCostsByPhase = phaseOrder.map(phaseName => {
    const phase = costs.phases[phaseName];
    if (phase) {
      cumulativeMin += phase.estimated_cost_min;
      cumulativeMax += phase.estimated_cost_max;
    }
    return {
      phase: phaseName,
      min: cumulativeMin,
      max: cumulativeMax,
      phaseMin: phase?.estimated_cost_min || 0,
      phaseMax: phase?.estimated_cost_max || 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Cost Forecasting */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            <h2 className="text-xl font-bold">Cost Forecasting</h2>
          </div>
          <p className="text-gray-300 text-sm">Budget planning by scenario and phase</p>
        </div>

        <div className="p-6">
          {/* Best/Expected/Worst Case */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-400">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Best Case
              </h4>
              <p className="text-sm text-gray-600 mb-3">Case dropped or dismissed early</p>
              <div className="text-3xl font-mono font-bold text-green-700">
                {costs.summary.minimum_cost !== null ? `$${costs.summary.minimum_cost.toLocaleString()}` : 'TBD'}
              </div>
              <p className="text-xs text-gray-500 mt-2">Discovery + Motion phases only</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-400">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Expected Case
              </h4>
              <p className="text-sm text-gray-600 mb-3">Plea before or after target date</p>
              <div className="text-3xl font-mono font-bold text-yellow-700">
                ${costs.summary.expected_value?.toLocaleString() ?? 'TBD'}
              </div>
              <p className="text-xs text-gray-500 mt-2">Weighted average of all scenarios</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-400">
              <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Worst Case
              </h4>
              <p className="text-sm text-gray-600 mb-3">Full trial to verdict</p>
              <div className="text-3xl font-mono font-bold text-red-700">
                {costs.summary.maximum_cost !== null ? `$${costs.summary.maximum_cost.toLocaleString()}` : 'TBD'}
              </div>
              <p className="text-xs text-gray-500 mt-2">All phases including trial</p>
            </div>
          </div>

          {/* Cumulative Cost by Phase */}
          <h4 className="font-bold text-gray-800 mb-4">Cumulative Cost by Phase</h4>
          <div className="space-y-3">
            {cumulativeCostsByPhase.map((item, idx) => {
              const maxCost = costs.summary.maximum_cost || 100000;
              const percentMax = maxCost > 0 ? (item.max / maxCost) * 100 : 0;
              const isTrialPhase = item.phase === 'Trial';

              return (
                <div key={item.phase} className={`${isTrialPhase ? 'opacity-60' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`phase-badge ${getPhaseClass(item.phase)}`}>
                        {item.phase}
                      </span>
                      {isTrialPhase && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          If Necessary
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold">
                        ${item.min.toLocaleString()}-${item.max.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        (+${item.phaseMin.toLocaleString()}-${item.phaseMax.toLocaleString()})
                      </span>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isTrialPhase
                          ? 'bg-gray-400'
                          : idx === 0
                            ? 'bg-blue-500'
                            : idx === 1
                              ? 'bg-purple-500'
                              : idx === 2
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                      }`}
                      style={{ width: `${percentMax}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Probability Overview Panel */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Probability Analysis</h2>
          </div>
          <p className="text-gray-300 text-sm">Success likelihood for each strategic action</p>
        </div>

        <div className="p-6">
          {/* Probability Bars */}
          <div className="space-y-2">
            {nodes.map((node) => {
              const isTrialPhase = node.phase === 'Trial';
              return (
                <div key={node.id} className={`flex items-center gap-4 ${isTrialPhase ? 'opacity-60' : ''}`}>
                  <div className="w-8 text-right font-mono text-sm text-gray-500">
                    {node.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-48 truncate text-sm font-medium">
                        {node.title}
                        {isTrialPhase && <span className="text-xs text-gray-400 ml-1">(If Necessary)</span>}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isTrialPhase
                              ? 'bg-gray-400'
                              : node.probability >= 0.7
                                ? 'bg-green-500'
                                : node.probability >= 0.4
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                          }`}
                          style={{ width: `${node.probability * 100}%` }}
                        />
                      </div>
                      <div className={`w-16 text-right font-bold ${isTrialPhase ? 'text-gray-400' : getProbabilityClass(node.probability)}`}>
                        {Math.round(node.probability * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>High (70%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500" />
              <span>Medium (40-69%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>Low (&lt;40%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
