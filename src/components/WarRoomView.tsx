import { useState } from 'react';
import { TrendingUp, GitBranch, ChevronDown, ChevronRight } from 'lucide-react';
import type { Node, CostsData, CaseData } from '../types';
import { useUser } from '../context/UserContext';

interface WarRoomViewProps {
  nodes: Node[];
  costs: CostsData;
  caseInfo: CaseData;
}

function getProbabilityClass(prob: number): string {
  if (prob >= 0.7) return 'prob-high';
  if (prob >= 0.4) return 'prob-medium';
  return 'prob-low';
}

function getProbabilityBg(prob: number): string {
  if (prob >= 0.7) return 'bg-green-100 border-green-300';
  if (prob >= 0.4) return 'bg-yellow-100 border-yellow-300';
  return 'bg-red-100 border-red-300';
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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function WarRoomView({ nodes, costs: _costs, caseInfo }: WarRoomViewProps) {
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const { attorneyInfo } = useUser();

  const phases = ['all', 'Discovery/Taint', 'Motion Battle', 'Evidentiary Hearings', 'Plea Negotiation', 'Pretrial Prep', 'Trial'];

  const filteredNodes = selectedPhase === 'all'
    ? nodes
    : nodes.filter(n => n.phase === selectedPhase);

  // Calculate cascade probabilities
  const cascadeProbabilities = nodes.reduce((acc, node, index) => {
    const prevProb = index === 0 ? 1 : acc[index - 1];
    acc.push(prevProb * node.probability);
    return acc;
  }, [] as number[]);

  return (
    <div className="space-y-6">
      {/* Attorney Advisory Header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-800 font-medium text-center italic">
          Strategy determined in consultation with {attorneyInfo.name}
        </p>
      </div>

      {/* Continuance Negotiation - PROMINENT FLASH */}
      <div className="bg-amber-100 border-2 border-amber-400 rounded-lg p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
          </span>
          <span className="font-bold text-amber-900 text-lg">{attorneyInfo.shortName.toUpperCase()} CONTINUANCE NEGOTIATION ACTIVE</span>
        </div>
        <p className="text-amber-800 mt-2 text-sm">
          Currently negotiating with federal prosecutors for additional preparation time. Status updates pending.
        </p>
      </div>

      {/* Probability Disclaimer */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
        <p className="text-red-800 font-bold text-sm">
          NOTE: Win probabilities have NOT yet been determined.
        </p>
        <p className="text-red-700 text-sm mt-2">
          Probabilities will be calculated using: <span className="font-semibold">Lexis Machina probability modeling</span>,
          Judge historical rulings, DOJ response patterns, and <span className="font-semibold">Bayesian analysis</span>.
          See strategy spreadsheets for methodology. Outcomes are not guaranteed.
        </p>
      </div>

      {/* Probability Model Explanations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-indigo-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Probability Models Explained</h2>
          <p className="text-indigo-200 text-sm">How we calculate win rates (coming soon)</p>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">Lexis Machina</h4>
            <p className="text-sm text-blue-800">
              Legal analytics platform that analyzes millions of federal cases to identify patterns in judge rulings,
              case outcomes, and litigation timelines. Provides data-driven probability estimates.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">Bayesian Analysis</h4>
            <p className="text-sm text-green-800">
              Statistical method that updates probability estimates as new evidence emerges.
              Combines prior knowledge with current case developments for dynamic predictions.
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-bold text-purple-900 mb-2">Judge Historical Rulings</h4>
            <p className="text-sm text-purple-800">
              Analysis of this specific judge's past decisions on similar motions and case types.
              Includes 93 criminal cases and 12 tax-related cases in their history.
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-bold text-orange-900 mb-2">DOJ Response Patterns</h4>
            <p className="text-sm text-orange-800">
              Historical analysis of how the Department of Justice typically responds to specific
              defense strategies. Helps predict prosecution tactics and negotiation positions.
            </p>
          </div>
        </div>
      </div>

      {/* Government Response Matrix */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            <h2 className="text-xl font-bold">Government Response Matrix</h2>
          </div>
          <p className="text-gray-300 text-sm">Anticipated prosecution responses to each defense action</p>
        </div>

        <div className="p-4">
          {/* Phase Filter */}
          <div className="mb-4 flex gap-2 flex-wrap">
            {phases.map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedPhase === phase
                    ? 'bg-gray-800 text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {phase === 'all' ? 'All Phases' : phase}
              </button>
            ))}
          </div>

          {/* Response Cards */}
          <div className="space-y-3">
            {filteredNodes.map((node) => {
              const isTrialPhase = node.phase === 'Trial';
              return (
                <div
                  key={node.id}
                  className={`border rounded-lg overflow-hidden ${isTrialPhase ? 'bg-gray-100 border-gray-300 opacity-60' : getProbabilityBg(node.probability)}`}
                >
                  {/* Node Header */}
                  <button
                    onClick={() => setExpandedNode(expandedNode === node.id ? null : node.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-gray-500 w-8">
                        #{node.id}
                      </span>
                      <span className={`phase-badge ${getPhaseClass(node.phase)}`}>
                        {node.phase}
                      </span>
                      <span className={`font-semibold ${isTrialPhase ? 'text-gray-500' : ''}`}>
                        {node.title}
                      </span>
                      {isTrialPhase && (
                        <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">
                          If Necessary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{formatDate(node.deadline)}</span>
                      <span className={`font-bold ${isTrialPhase ? 'text-gray-400' : getProbabilityClass(node.probability)}`}>
                        {Math.round(node.probability * 100)}%
                      </span>
                      {expandedNode === node.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedNode === node.id && (
                    <div className="px-4 pb-4 bg-white/70">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className={`p-3 rounded border ${isTrialPhase ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                          <h4 className={`font-semibold mb-1 ${isTrialPhase ? 'text-gray-600' : 'text-blue-800'}`}>Client Task</h4>
                          <p className={`text-sm ${isTrialPhase ? 'text-gray-500' : 'text-blue-700'}`}>{node.client_task}</p>
                        </div>
                        <div className={`p-3 rounded border ${isTrialPhase ? 'bg-gray-100 border-gray-200' : 'bg-purple-50 border-purple-200'}`}>
                          <h4 className={`font-semibold mb-1 ${isTrialPhase ? 'text-gray-600' : 'text-purple-800'}`}>Attorney Task</h4>
                          <p className={`text-sm ${isTrialPhase ? 'text-gray-500' : 'text-purple-700'}`}>{node.attorney_task}</p>
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-800 mb-2">
                        Government Response Scenarios
                      </h4>
                      <div className="response-grid">
                        <div className="response-item response-a">
                          <span className="font-bold text-green-700">A (Favorable):</span>
                          <p className="text-sm">{node.govt_responses.A}</p>
                        </div>
                        <div className="response-item response-b">
                          <span className="font-bold text-blue-700">B (Neutral):</span>
                          <p className="text-sm">{node.govt_responses.B}</p>
                        </div>
                        <div className="response-item response-c">
                          <span className="font-bold text-yellow-700">C (Challenging):</span>
                          <p className="text-sm">{node.govt_responses.C}</p>
                        </div>
                        <div className="response-item response-d">
                          <span className="font-bold text-red-700">D (Adverse):</span>
                          <p className="text-sm">{node.govt_responses.D}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-4 text-sm text-gray-600">
                        <span>Attorney Hours: {node.attorney_hours_min}-{node.attorney_hours_max}h</span>
                        <span>Travel: {node.travel_hours}h</span>
                        <span>Cost: ${node.estimated_cost_min.toLocaleString()}-${node.estimated_cost_max.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cascade Analysis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-bold">Cascade Analysis</h2>
          </div>
          <p className="text-gray-300 text-sm">Cumulative probability of reaching each milestone</p>
        </div>

        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200" />

            {/* Milestones */}
            <div className="space-y-4">
              {nodes.map((node, index) => {
                const cascadeProb = cascadeProbabilities[index];
                const isTrialPhase = node.phase === 'Trial';
                return (
                  <div key={node.id} className={`flex items-center gap-4 relative ${isTrialPhase ? 'opacity-60' : ''}`}>
                    {/* Timeline Dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-4 z-10 ${
                        isTrialPhase
                          ? 'bg-gray-400 border-gray-200'
                          : cascadeProb >= 0.5
                            ? 'bg-green-500 border-green-200'
                            : cascadeProb >= 0.2
                              ? 'bg-yellow-500 border-yellow-200'
                              : 'bg-red-500 border-red-200'
                      }`}
                      style={{ marginLeft: '16px' }}
                    />

                    {/* Content */}
                    <div className={`flex-1 flex items-center gap-4 p-3 rounded-lg ${isTrialPhase ? 'bg-gray-100' : 'bg-gray-50'}`}>
                      <span className="font-mono text-sm text-gray-500 w-8">#{node.id}</span>
                      <span className={`phase-badge ${getPhaseClass(node.phase)}`}>{node.phase}</span>
                      <span className={`flex-1 font-medium ${isTrialPhase ? 'text-gray-500' : ''}`}>
                        {node.title}
                        {isTrialPhase && <span className="text-xs text-gray-400 ml-2">(If Necessary)</span>}
                      </span>
                      <div className="text-right">
                        <div className={`font-bold ${isTrialPhase ? 'text-gray-400' : getProbabilityClass(cascadeProb)}`}>
                          {Math.round(cascadeProb * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">cascade</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Charges Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Charge Analysis</h2>
          <p className="text-gray-300 text-sm">{caseInfo.charges.total} total counts at stake</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-4xl font-bold text-red-700">{caseInfo.charges.conspiracy}</div>
              <div className="text-sm text-red-600">Conspiracy</div>
              <div className="text-xs text-gray-500">18 U.S.C. 371</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-4xl font-bold text-orange-700">{caseInfo.charges.wire_fraud}</div>
              <div className="text-sm text-orange-600">Wire Fraud</div>
              <div className="text-xs text-gray-500">18 U.S.C. 1343</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-700">{caseInfo.charges.tax_evasion}</div>
              <div className="text-sm text-purple-600">Tax Evasion</div>
              <div className="text-xs text-gray-500">26 U.S.C. 7201</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-700">{caseInfo.charges.tax_failure}</div>
              <div className="text-sm text-blue-600">Tax Failure to File</div>
              <div className="text-xs text-gray-500">26 U.S.C. 7203</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
