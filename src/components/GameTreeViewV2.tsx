import { useState, useEffect } from 'react';
import { Gavel, Shield, Target, Zap, ChevronRight, ChevronDown, Menu, X, FileText, Book } from 'lucide-react';
import gameTreeData from '../data/gametree-v2.json';

// Motion Glossary Types
interface MotionCategory {
  id: string;
  name: string;
  description: string;
  phase: string;
}

interface MotionGlossaryItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  legalBasis: string;
  purpose: string;
  winProbability?: string;
  keyArguments?: string[];
  criticalEvidence?: string[];
  estimatedHours?: number;
  status?: string;
}

interface MotionsGlossaryData {
  categories: MotionCategory[];
  motions: MotionGlossaryItem[];
}

// Types
interface Counter {
  brief: string;
  full: string;
  nextAction: string;
}

interface GovtRebuttal {
  brief: string;
  full: string;
  authority?: string;
}

interface GovtCounter {
  ifWeFile: string;
  theirArgument: string;
  ourRebuttal: GovtRebuttal;
}

interface Response {
  probability: number;
  text: string;
  status?: string;
  counter: Counter;
  govtCounter?: GovtCounter;
}

interface Outcome {
  cascadeTo: string | null;
  probability: number;
  description: string;
}

interface MoveDetails {
  deadline: string;
  clientTask: string;
  attorneyTask: string;
  hours: number;
  cost?: number;
  probability: number;
  evidence: string[];
  minimumAcceptable?: string;
  requestedContinuance?: string;
}

interface Move {
  id: string;
  type: string;
  title: string;
  phase: string;
  details: MoveDetails;
  responses: {
    A: Response;
    B: Response;
    C: Response;
    D: Response;
  };
  outcomes: {
    win: Outcome;
    partial: Outcome;
    statusQuo: Outcome;
    lose: Outcome;
  };
}

// Color constants
const colors = {
  defense: '#1F4E79',
  response: '#6B7280',
  counter: '#7C3AED',
  win: '#0D9488',
  partial: '#D97706',
  statusQuo: '#9CA3AF',
  lose: '#991B1B',
  cascade: '#10B981',
  edge: '#D1D5DB',
};

// Defense Node Component
function DefenseNode({
  move,
  isExpanded,
  onToggle,
  onSelect,
  isSelected,
  animationDelay,
  hasBeenClicked
}: {
  move: Move;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  isSelected: boolean;
  animationDelay: number;
  hasBeenClicked: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  if (!isVisible) return null;

  return (
    <div
      className={`transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => { onToggle(); onSelect(); }}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 min-w-[280px]
            ${isSelected
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          style={{ borderLeftColor: colors.defense, borderLeftWidth: '4px' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.defense }}
          >
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-bold text-gray-900">{move.title}</h3>
            <p className="text-sm text-gray-500">Click to reveal govt responses</p>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {/* Click Here Indicator */}
        {!hasBeenClicked && (
          <span className="text-xs font-bold text-blue-600 animate-pulse whitespace-nowrap bg-blue-50 px-2 py-1 rounded border border-blue-200">
            click here
          </span>
        )}
        {hasBeenClicked && (
          <span className="text-xs text-green-600 font-medium">
            Reviewed
          </span>
        )}
      </div>
    </div>
  );
}

// Response Node Component (ABCD Stacked)
function ResponseNode({
  responses,
  expandedResponse,
  onResponseClick,
  isVisible
}: {
  responses: { A: Response; B: Response; C: Response; D: Response };
  expandedResponse: string | null;
  onResponseClick: (key: string) => void;
  isVisible: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const responseKeys = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className={`ml-6 mt-4 transition-all duration-300 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      {/* Connecting line */}
      <div className="absolute -mt-4 ml-6 w-0.5 h-4 bg-gray-300" />

      <div
        className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 max-w-md"
        style={{ borderLeftColor: colors.response, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5" style={{ color: colors.response }} />
          <span className="font-semibold text-gray-700">Government Responses</span>
        </div>

        <div className="space-y-2">
          {responseKeys.map((key) => {
            const response = responses[key];
            const isExpanded = expandedResponse === key;
            const isDimmed = expandedResponse && expandedResponse !== key;

            return (
              <button
                key={key}
                onClick={() => onResponseClick(key)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                  isExpanded
                    ? 'border-purple-400 bg-purple-50 shadow-md'
                    : isDimmed
                    ? 'border-gray-200 bg-gray-100 opacity-40'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                    isExpanded ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {key}
                  </span>
                  <span className="text-xs text-gray-500 mt-0.5">
                    (TBD)
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">{response.text}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Counter Node Component
function CounterNode({
  counter,
  responseKey,
  isVisible
}: {
  counter: Counter;
  responseKey: string;
  isVisible: boolean;
}) {
  const [show, setShow] = useState(false);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
      setShowFull(false);
    }
  }, [isVisible]);

  if (!isVisible || !show) return null;

  return (
    <div className={`ml-10 mt-3 transition-all duration-300 ${show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div
        className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 max-w-sm"
        style={{ borderLeftColor: colors.counter, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5" style={{ color: colors.counter }} />
          <span className="font-semibold text-purple-900">Our Counter-Punch</span>
          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
            vs {responseKey}
          </span>
        </div>

        <p className="text-sm text-purple-800 font-medium">{counter.brief}</p>

        {!showFull ? (
          <button
            onClick={() => setShowFull(true)}
            className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
          >
            Show full playbook →
          </button>
        ) : (
          <div className="mt-3 pt-3 border-t border-purple-200">
            <p className="text-sm text-purple-700">{counter.full}</p>
            <p className="text-xs text-purple-500 mt-2">
              Next: <span className="font-medium">{counter.nextAction}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Outcome Node Component
function OutcomeNode({
  outcomes,
  cascadeTo: _cascadeTo,
  isVisible
}: {
  outcomes: { win: Outcome; partial: Outcome; statusQuo: Outcome; lose: Outcome };
  cascadeTo?: string | null;
  isVisible: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible]);

  if (!isVisible || !show) return null;

  const outcomeConfig = [
    { key: 'win', label: 'Win', color: colors.win, data: outcomes.win },
    { key: 'partial', label: 'Partial', color: colors.partial, data: outcomes.partial },
    { key: 'statusQuo', label: 'Status Quo', color: colors.statusQuo, data: outcomes.statusQuo },
    { key: 'lose', label: 'Lose', color: colors.lose, data: outcomes.lose },
  ];

  return (
    <div className={`ml-12 mt-4 transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">Possible Outcomes</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {outcomeConfig.map(({ key, label, color, data }) => (
          <div
            key={key}
            className="px-3 py-2 rounded-lg text-white text-xs font-medium flex flex-col items-center"
            style={{ backgroundColor: color }}
          >
            <span>{label}</span>
            <span className="text-[10px] opacity-80">TBD</span>
            {data.cascadeTo && (
              <span className="text-[10px] mt-1 flex items-center gap-1">
                <Zap className="w-3 h-3" /> CASCADE
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Motions Glossary Modal Component
function MotionsGlossaryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const glossaryData = gameTreeData.motionsGlossary as MotionsGlossaryData;
  const categories = glossaryData?.categories || [];
  const allMotions = glossaryData?.motions || [];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMotion, setSelectedMotion] = useState<MotionGlossaryItem | null>(null);

  const filteredMotions = selectedCategory === 'all'
    ? allMotions
    : allMotions.filter(m => m.category === selectedCategory);

  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'preflight': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
      'discovery-taint': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
      'attack-counts-1': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
      'attack-counts-2': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
      'attack-counts-3': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      'oversight-press': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      'conditional': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    };
    return colorMap[categoryId] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg"><Book className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold">Motions & Filings Glossary</h2>
              <p className="text-blue-200 text-sm">{allMotions.length} Legal Instruments | {categories.length} Categories</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-6 h-6" /></button>
        </div>

        {/* Category Tabs */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedMotion(null); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All ({allMotions.length})
            </button>
            {categories.map((cat) => {
              const count = allMotions.filter(m => m.category === cat.id).length;
              const colors = getCategoryColor(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedMotion(null); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? `${colors.bg} ${colors.text} shadow-md border ${colors.border}`
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Motion List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto bg-gray-50 p-3">
            {selectedCategory !== 'all' && (
              <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Category</p>
                <p className="text-sm text-gray-900 font-semibold">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {categories.find(c => c.id === selectedCategory)?.description}
                </p>
              </div>
            )}
            {filteredMotions.map((motion) => {
              const colors = getCategoryColor(motion.category);
              return (
                <button
                  key={motion.id}
                  onClick={() => setSelectedMotion(motion)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                    selectedMotion?.id === motion.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <FileText className={`w-4 h-4 mt-0.5 ${selectedMotion?.id === motion.id ? 'text-blue-200' : 'text-blue-600'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-sm block truncate">{motion.shortName}</span>
                      {motion.winProbability && (
                        <span className={`text-xs ${selectedMotion?.id === motion.id ? 'text-blue-200' : 'text-green-600'}`}>
                          Win: {motion.winProbability}
                        </span>
                      )}
                      {selectedCategory === 'all' && (
                        <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${selectedMotion?.id === motion.id ? 'bg-white/20' : colors.bg + ' ' + colors.text}`}>
                          {categories.find(c => c.id === motion.category)?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Motion Details */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedMotion ? (
              <div className="space-y-5">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedMotion.name}</h3>
                      <p className="text-sm text-blue-600 font-medium mt-1">{selectedMotion.shortName}</p>
                    </div>
                    {selectedMotion.winProbability && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase">Win Probability</p>
                        <p className="text-2xl font-bold text-green-600">{selectedMotion.winProbability}</p>
                      </div>
                    )}
                  </div>
                  {selectedMotion.status && (
                    <div className={`mt-3 px-3 py-2 rounded-lg ${
                      selectedMotion.status.includes('CRITICAL') || selectedMotion.status.includes('FIRST') || selectedMotion.status.includes('THE MOTION')
                        ? 'bg-red-100 border border-red-300 text-red-800'
                        : selectedMotion.status.includes('HIGHEST') || selectedMotion.status.includes('WIN')
                        ? 'bg-green-100 border border-green-300 text-green-800'
                        : 'bg-amber-100 border border-amber-300 text-amber-800'
                    }`}>
                      <p className="font-semibold text-sm">{selectedMotion.status}</p>
                    </div>
                  )}
                </div>

                {/* Legal Basis */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Book className="w-4 h-4" />Legal Basis
                  </h4>
                  <p className="text-blue-800 font-mono text-sm">{selectedMotion.legalBasis}</p>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600">{selectedMotion.description}</p>
                </div>

                {/* Purpose */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />Strategic Purpose
                  </h4>
                  <p className="text-green-800">{selectedMotion.purpose}</p>
                </div>

                {/* Key Arguments */}
                {selectedMotion.keyArguments && selectedMotion.keyArguments.length > 0 && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />Key Arguments
                    </h4>
                    <ul className="space-y-1">
                      {selectedMotion.keyArguments.map((arg, i) => (
                        <li key={i} className="text-purple-800 text-sm flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          {arg}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Critical Evidence */}
                {selectedMotion.criticalEvidence && selectedMotion.criticalEvidence.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />Critical Evidence Needed
                    </h4>
                    <ul className="space-y-1">
                      {selectedMotion.criticalEvidence.map((ev, i) => (
                        <li key={i} className="text-amber-800 text-sm flex items-start gap-2">
                          <span className="text-amber-400 mt-1">•</span>
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hours Estimate */}
                {selectedMotion.estimatedHours && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-medium">Estimated Hours:</span>
                    <span className="px-2 py-1 bg-gray-100 rounded font-semibold">{selectedMotion.estimatedHours} hrs</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Select a motion to view details</p>
                  <p className="text-sm mt-1">Choose from {filteredMotions.length} motions in this category</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">EDPA 24-376 | Defense Motion Library | Categorized by Phase</span>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
}

// All 5 Phases View Component
function All5PhasesView({
  onPhaseSelect,
  onMoveSelect
}: {
  onPhaseSelect: (phaseId: string) => void;
  onMoveSelect: (move: Move) => void;
}) {
  const allMoves = gameTreeData.moves as Move[];

  // 5 core phases (skip preflight and trial)
  const corePhases = [
    { id: 'phase-1', name: 'Discovery/Taint', color: 'blue' },
    { id: 'phase-2', name: 'Motion Battle', color: 'purple' },
    { id: 'phase-3', name: 'Evidentiary Hearings', color: 'cyan' },
    { id: 'phase-4', name: 'Plea Negotiation', color: 'green' },
    { id: 'phase-5', name: 'Pretrial Prep', color: 'orange' },
  ];

  const getPhaseColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      cyan: 'border-cyan-500 bg-cyan-50',
      green: 'border-green-500 bg-green-50',
      orange: 'border-orange-500 bg-orange-50',
    };
    return colorMap[color] || 'border-gray-500 bg-gray-50';
  };

  const getHeaderColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      cyan: 'bg-cyan-600',
      green: 'bg-green-600',
      orange: 'bg-orange-600',
    };
    return colorMap[color] || 'bg-gray-600';
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All 5 Litigation Phases</h2>
        <p className="text-gray-600">Click any phase header to drill down, or any motion to see details</p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {corePhases.map((phaseInfo) => {
          const phaseMoves = allMoves.filter(m => m.phase === phaseInfo.id);

          return (
            <div
              key={phaseInfo.id}
              className={`rounded-xl border-2 ${getPhaseColor(phaseInfo.color)} overflow-hidden`}
            >
              {/* Phase Header */}
              <button
                onClick={() => onPhaseSelect(phaseInfo.id)}
                className={`w-full ${getHeaderColor(phaseInfo.color)} text-white p-3 hover:opacity-90 transition-opacity`}
              >
                <h3 className="font-bold text-sm">{phaseInfo.name}</h3>
                <p className="text-xs opacity-80">{phaseMoves.length} motions</p>
              </button>

              {/* Phase Moves */}
              <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                {phaseMoves.map((move) => (
                  <button
                    key={move.id}
                    onClick={() => onMoveSelect(move)}
                    className="w-full text-left p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Gavel className="w-3 h-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-900 truncate">{move.title}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">4 responses</span>
                      <span className="text-[10px] font-semibold text-gray-500">
                        TBD win
                      </span>
                    </div>
                  </button>
                ))}
                {phaseMoves.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4">No motions in this phase</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Overview Map View Component
function OverviewMapView({
  onPhaseSelect
}: {
  onPhaseSelect: (phaseId: string) => void;
}) {
  const allMoves = gameTreeData.moves as Move[];

  // Calculate metrics for each phase
  const corePhases = [
    { id: 'phase-1', name: 'Discovery/Taint', shortName: 'DISCOVERY', color: 'blue', row: 0, col: 0 },
    { id: 'phase-2', name: 'Motion Battle', shortName: 'MOTIONS', color: 'purple', row: 0, col: 1 },
    { id: 'phase-3', name: 'Evidentiary Hearings', shortName: 'HEARINGS', color: 'cyan', row: 0, col: 2 },
    { id: 'phase-4', name: 'Plea Negotiation', shortName: 'PLEA', color: 'green', row: 1, col: 0 },
    { id: 'phase-5', name: 'Pretrial Prep', shortName: 'PRETRIAL', color: 'orange', row: 1, col: 2 },
  ];

  const getPhaseMetrics = (phaseId: string) => {
    const phaseMoves = allMoves.filter(m => m.phase === phaseId);
    const motionCount = phaseMoves.length;
    // Each move has 4 responses (A/B/C/D), each with a counter
    const counterCount = motionCount * 4;
    // Average win probability
    const avgWinProb = phaseMoves.length > 0
      ? phaseMoves.reduce((sum, m) => sum + m.outcomes.win.probability, 0) / phaseMoves.length
      : 0;

    return { motionCount, counterCount, avgWinProb };
  };

  const getCardColor = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; header: string }> = {
      blue: { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-900', header: 'bg-blue-600' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-900', header: 'bg-purple-600' },
      cyan: { bg: 'bg-cyan-50', border: 'border-cyan-400', text: 'text-cyan-900', header: 'bg-cyan-600' },
      green: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-900', header: 'bg-green-600' },
      orange: { bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-900', header: 'bg-orange-600' },
    };
    return colorMap[color] || { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-900', header: 'bg-gray-600' };
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Strategic Overview Map</h2>
        <p className="text-gray-600">Click any phase to explore in detail</p>
      </div>

      {/* Flow Diagram */}
      <div className="relative">
        {/* Row 1: Discovery → Motions → Hearings */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {corePhases.filter(p => p.row === 0).map((phaseInfo, idx) => {
            const metrics = getPhaseMetrics(phaseInfo.id);
            const colors = getCardColor(phaseInfo.color);

            return (
              <div key={phaseInfo.id} className="flex items-center">
                <button
                  onClick={() => onPhaseSelect(phaseInfo.id)}
                  className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 w-48 hover:shadow-lg transition-all hover:scale-105`}
                >
                  <div className={`${colors.header} text-white text-xs font-bold px-2 py-1 rounded mb-3 text-center`}>
                    {phaseInfo.shortName}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Motions:</span>
                      <span className={`font-bold ${colors.text}`}>{metrics.motionCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Counters:</span>
                      <span className={`font-bold ${colors.text}`}>{metrics.counterCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Win %:</span>
                      <span className="font-bold text-gray-500">TBD</span>
                    </div>
                  </div>
                </button>
                {idx < 2 && (
                  <div className="mx-2 flex items-center text-gray-400">
                    <div className="w-8 h-0.5 bg-gray-300" />
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connecting arrows down */}
        <div className="flex justify-between px-24 mb-4">
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-0.5 h-8 bg-gray-300" />
            <ChevronDown className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <div className="w-0.5 h-8 bg-gray-300" />
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {/* Row 2: Plea - Resolution Zone - Pretrial */}
        <div className="flex items-center justify-center gap-6 px-12">
          {/* Plea Card */}
          {(() => {
            const pleaPhase = corePhases.find(p => p.id === 'phase-4');
            if (!pleaPhase) return null;
            const metrics = getPhaseMetrics(pleaPhase.id);
            const colors = getCardColor(pleaPhase.color);
            return (
              <button
                onClick={() => onPhaseSelect(pleaPhase.id)}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 w-48 hover:shadow-lg transition-all hover:scale-105`}
              >
                <div className={`${colors.header} text-white text-xs font-bold px-2 py-1 rounded mb-3 text-center`}>
                  {pleaPhase.shortName}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Motions:</span>
                    <span className={`font-bold ${colors.text}`}>{metrics.motionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Counters:</span>
                    <span className={`font-bold ${colors.text}`}>{metrics.counterCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Win %:</span>
                    <span className="font-bold text-gray-500">TBD</span>
                  </div>
                </div>
              </button>
            );
          })()}

          {/* Center Arrow */}
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-0.5 bg-gray-300" />
            <ChevronRight className="w-5 h-5" />
          </div>

          {/* Resolution Zone Indicator */}
          <div className="bg-gradient-to-b from-amber-50 to-amber-100 border-2 border-dashed border-amber-400 rounded-xl p-4 w-36 text-center">
            <div className="text-amber-600 text-xs font-bold uppercase tracking-wide mb-2">Resolution</div>
            <div className="text-amber-800 text-lg font-bold">Window</div>
            <div className="text-amber-600 text-xs mt-1">Settlement opportunities</div>
          </div>

          {/* Center Arrow */}
          <div className="flex items-center text-gray-400">
            <div className="w-8 h-0.5 bg-gray-300" />
            <ChevronRight className="w-5 h-5" />
          </div>

          {/* Pretrial Card */}
          {(() => {
            const pretrialPhase = corePhases.find(p => p.id === 'phase-5');
            if (!pretrialPhase) return null;
            const metrics = getPhaseMetrics(pretrialPhase.id);
            const colors = getCardColor(pretrialPhase.color);
            return (
              <button
                onClick={() => onPhaseSelect(pretrialPhase.id)}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 w-48 hover:shadow-lg transition-all hover:scale-105`}
              >
                <div className={`${colors.header} text-white text-xs font-bold px-2 py-1 rounded mb-3 text-center`}>
                  {pretrialPhase.shortName}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Motions:</span>
                    <span className={`font-bold ${colors.text}`}>{metrics.motionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Counters:</span>
                    <span className={`font-bold ${colors.text}`}>{metrics.counterCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Win %:</span>
                    <span className="font-bold text-gray-500">TBD</span>
                  </div>
                </div>
              </button>
            );
          })()}
        </div>

        {/* Total Summary */}
        <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allMoves.filter(m => m.phase !== 'phase-0' && m.phase !== 'phase-6').length}
              </p>
              <p className="text-sm text-gray-600">Total Motions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {allMoves.filter(m => m.phase !== 'phase-0' && m.phase !== 'phase-6').length * 4}
              </p>
              <p className="text-sm text-gray-600">Counter Strategies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-500">
                TBD
              </p>
              <p className="text-sm text-gray-600">Average Win Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Side Panel Component
function SidePanel({
  selectedMove,
  phase,
  onPhaseChange,
  isOpen,
  onToggle
}: {
  selectedMove: Move | null;
  phase: string;
  onPhaseChange: (phase: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const phases = gameTreeData.phases;
  const tutorial = gameTreeData.tutorial;

  return (
    <>
      {/* Toggle button when closed - BLUE with CLICK HERE */}
      {!isOpen && (
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
          <span className="text-xs font-bold text-blue-600 mb-1 animate-pulse whitespace-nowrap">CLICK HERE</span>
          <button
            onClick={onToggle}
            className="bg-blue-600 hover:bg-blue-700 border-2 border-blue-400 rounded-l-lg p-3 shadow-lg transition-all ring-2 ring-blue-300 ring-offset-1"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-[400px] bg-white border-l border-gray-200 shadow-xl transition-transform duration-300 z-40 overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-gray-900">Litigation Game Tree</h2>
            <p className="text-xs text-gray-500">EDPA 24-376 Defense Strategy</p>
          </div>
          <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Horizontal Phase Progress Bar - with subtle indicator */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
              Phase Progress
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            </span>
            <span className="text-xs text-gray-500">{phases.findIndex(p => p.id === phase) + 1} of {phases.length}</span>
          </div>
          <div className="flex gap-1">
            {phases.map((p, idx) => {
              const isActive = p.id === phase;
              const isPast = phases.findIndex(ph => ph.id === phase) > idx;
              const isCurrentPhase = p.id === 'phase-0';
              return (
                <button
                  key={p.id}
                  onClick={() => onPhaseChange(p.id)}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 relative group
                    ${isActive ? 'bg-blue-600 ring-2 ring-blue-300 ring-offset-1' : ''}
                    ${isPast ? 'bg-green-500' : ''}
                    ${!isActive && !isPast ? 'bg-gray-300 hover:bg-gray-400' : ''}
                    ${isCurrentPhase && isActive ? 'animate-pulse' : ''}
                  `}
                  title={p.name}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {p.name.replace('Phase ', 'P')}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-500">
            <span>Preflight</span>
            <span>Oversight</span>
          </div>
        </div>

        {/* Glowing START HERE Button */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
          <button
            onClick={() => onPhaseChange('phase-0')}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2
              ${phase === 'phase-0'
                ? 'bg-emerald-600 shadow-lg shadow-emerald-300'
                : 'bg-emerald-500 hover:bg-emerald-600 animate-pulse shadow-lg shadow-emerald-200'
              }
            `}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            {phase === 'phase-0' ? 'VIEWING PREFLIGHT' : 'START HERE - PREFLIGHT ACTIVE'}
          </button>

          {/* Bill Rush Continuance - PROMINENT FLASH */}
          <div className="mt-3 p-3 bg-amber-100 border-2 border-amber-400 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="font-bold text-amber-800 text-sm">BILL RUSH CONTINUANCE</span>
            </div>
            <p className="text-xs text-amber-700 mt-1 font-semibold">
              Negotiating with feds - Continuance discussion ACTIVE
            </p>
          </div>
        </div>

        {/* Phase Selector Dropdown - EMPHASIZED */}
        <div className="p-4 border-b border-gray-200 relative bg-gradient-to-r from-blue-50 to-indigo-50">
          <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            SELECT PHASE
            <span className="text-xs font-normal text-blue-600">(click to navigate)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-0 rounded-lg border-2 border-blue-400 animate-pulse pointer-events-none" />
            <select
              value={phase}
              onChange={(e) => onPhaseChange(e.target.value)}
              className="w-full p-2 border-2 border-blue-400 rounded-lg bg-white text-sm relative z-10 font-semibold"
            >
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {phases.find(p => p.id === phase)?.dateRange}
          </p>
          <p className="text-xs text-blue-600 mt-1 font-medium">
            {phases.find(p => p.id === phase)?.description}
          </p>
        </div>

        {/* Tutorial */}
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-3">How to Use This Tree</h3>
          <ol className="space-y-2">
            {tutorial.steps.filter(step => step.number !== 5).map((step) => (
              <li key={step.number} className="flex gap-2 text-sm">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                  {step.number > 5 ? step.number - 1 : step.number}
                </span>
                <div>
                  <span className="font-medium text-blue-900">{step.title}</span>
                  <p className="text-blue-700 text-xs">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Red Warning about Placeholders */}
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-bold">
              Win rates are placeholders - actual probabilities TBD
            </p>
            <p className="text-xs text-red-700 mt-1">
              Probabilities will be calculated using Lexis Machina, Judge analysis, and DOJ patterns.
            </p>
          </div>

          {/* Motions/Filings Mix-and-Match */}
          <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-bold">Strategy Builder:</span> Use the <span className="font-semibold">Motions/Filings</span> button
              to mix-and-match legal instruments for your defense strategy.
            </p>
          </div>
        </div>

        {/* Selected Node Details */}
        {selectedMove ? (
          <div className="p-4">
            <h3 className="font-bold text-gray-900 text-lg mb-4">{selectedMove.title}</h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Deadline</span>
                <p className="text-gray-900 font-medium">
                  {new Date(selectedMove.details.deadline).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Client Task</span>
                <p className="text-sm text-gray-700">{selectedMove.details.clientTask}</p>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Attorney Task</span>
                <p className="text-sm text-gray-700">{selectedMove.details.attorneyTask}</p>
              </div>

              <div className="flex gap-6">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Hours</span>
                  <p className="text-xl font-bold text-gray-900">{selectedMove.details.hours}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">Success Rate</span>
                  <p className="text-xl font-bold text-gray-500">TBD</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Evidence Needed</span>
                <ul className="mt-1 space-y-1">
                  {selectedMove.details.evidence.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>Click a defense move to see details</p>
          </div>
        )}

        {/* Collapse button */}
        <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            onClick={onToggle}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            Collapse Panel <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

// Main Component
export default function GameTreeViewV2() {
  const [phase, setPhase] = useState('phase-0');
  const [expandedMoves, setExpandedMoves] = useState<Set<string>>(new Set());
  const [expandedResponses, setExpandedResponses] = useState<Record<string, string | null>>({});
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [treeViewMode, setTreeViewMode] = useState<'single' | 'all5' | 'map'>('single');
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [motionsModalOpen, setMotionsModalOpen] = useState(false);
  const [clickedMoves, setClickedMoves] = useState<Set<string>>(new Set());

  const motionsCount = ((gameTreeData.motionsGlossary as MotionsGlossaryData)?.motions || []).length;

  // Filter moves by phase
  const phaseMoves = (gameTreeData.moves as Move[]).filter(m => m.phase === phase);

  // Loading animation
  useEffect(() => {
    setIsLoading(true);
    setLoadProgress(0);
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + 10;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  const toggleMove = (moveId: string) => {
    // Track that this move has been clicked
    setClickedMoves(prev => new Set(prev).add(moveId));

    setExpandedMoves(prev => {
      const next = new Set(prev);
      if (next.has(moveId)) {
        next.delete(moveId);
      } else {
        next.add(moveId);
      }
      return next;
    });
  };

  const toggleResponse = (moveId: string, responseKey: string) => {
    setExpandedResponses(prev => ({
      ...prev,
      [moveId]: prev[moveId] === responseKey ? null : responseKey
    }));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Motions Glossary Modal */}
      <MotionsGlossaryModal isOpen={motionsModalOpen} onClose={() => setMotionsModalOpen(false)} />

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Litigation Game Tree</h2>
            <p className="text-sm text-gray-500">
              Interactive decision tree showing defense moves and government responses
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Motions/Filings Available Box - with glow */}
            <button
              onClick={() => setMotionsModalOpen(true)}
              className="relative px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 ring-2 ring-blue-400 ring-offset-2 animate-pulse"
            >
              <Book className="w-4 h-4" />
              <span>Motions/Filings</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{motionsCount}</span>
            </button>

            {/* View Mode Toggle - with click here indicator */}
            <div className="flex flex-col items-center">
              <span className="text-xs text-blue-600 font-semibold mb-1 animate-pulse">(click here)</span>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg ring-2 ring-blue-400/50">
                <button
                  onClick={() => setTreeViewMode('single')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    treeViewMode === 'single' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Single Phase
                </button>
                <button
                  onClick={() => setTreeViewMode('all5')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    treeViewMode === 'all5' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                All 5 Phases
              </button>
              <button
                onClick={() => setTreeViewMode('map')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  treeViewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview Map
              </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.defense }} />
                <span>Defense</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.response }} />
                <span>Govt</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.counter }} />
                <span>Counter</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.win }} />
                <span>Win</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Bar */}
      {isLoading && (
        <div className="px-6 py-2 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-sm text-blue-700">Loading {gameTreeData.phases.find(p => p.id === phase)?.name}...</span>
              <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-100"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <span className="text-sm text-blue-700">{loadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`p-6 transition-all duration-300 ${sidePanelOpen ? 'mr-[400px]' : ''}`}>
        {!isLoading && treeViewMode === 'single' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {phaseMoves.map((move, index) => {
              const isExpanded = expandedMoves.has(move.id);
              const currentResponse = expandedResponses[move.id];

              return (
                <div
                  key={move.id}
                  className=""
                >
                  {/* Defense Node */}
                  <DefenseNode
                    move={move}
                    isExpanded={isExpanded}
                    onToggle={() => toggleMove(move.id)}
                    onSelect={() => setSelectedMove(move)}
                    isSelected={selectedMove?.id === move.id}
                    animationDelay={index * 500}
                    hasBeenClicked={clickedMoves.has(move.id)}
                  />

                  {/* Response Node */}
                  <ResponseNode
                    responses={move.responses}
                    expandedResponse={currentResponse}
                    onResponseClick={(key) => toggleResponse(move.id, key)}
                    isVisible={isExpanded}
                  />

                  {/* Counter Node */}
                  {currentResponse && (
                    <CounterNode
                      counter={move.responses[currentResponse as keyof typeof move.responses].counter}
                      responseKey={currentResponse}
                      isVisible={!!currentResponse}
                    />
                  )}

                  {/* Outcome Node */}
                  <OutcomeNode
                    outcomes={move.outcomes}
                    cascadeTo={move.outcomes.win.cascadeTo}
                    isVisible={!!currentResponse}
                  />

                  {/* Cascade Indicator */}
                  {move.outcomes.win.cascadeTo && currentResponse && (
                    <div className="ml-12 mt-3 flex items-center gap-2 text-green-600 animate-pulse">
                      <div className="w-8 h-0.5 bg-green-500" />
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-medium">
                        Win cascades to: {phaseMoves.find(m => m.id === move.outcomes.win.cascadeTo)?.title || move.outcomes.win.cascadeTo}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Continue to Next Phase Prompt */}
            {phaseMoves.length > 0 && (() => {
              const phaseClickedCount = phaseMoves.filter(m => clickedMoves.has(m.id)).length;
              const allPhaseMovesClicked = phaseClickedCount > 0;

              return (
                <div className={`mt-8 p-4 rounded-xl text-center ${
                  allPhaseMovesClicked
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}>
                  {!allPhaseMovesClicked ? (
                    <>
                      <p className="text-gray-600 font-semibold mb-2">Click at least one defense node above to continue</p>
                      <p className="text-sm text-gray-500">Review defense moves before proceeding to next phase</p>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-800 font-semibold mb-2">Ready to continue? ({phaseClickedCount}/{phaseMoves.length} moves reviewed)</p>
                      <button
                        onClick={() => {
                          const phases = gameTreeData.phases;
                          const currentIdx = phases.findIndex(p => p.id === phase);
                          if (currentIdx < phases.length - 1) {
                            setPhase(phases[currentIdx + 1].id);
                          }
                        }}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                      >
                        Continue to Next Phase
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* All 5 Phases View */}
        {!isLoading && treeViewMode === 'all5' && (
          <All5PhasesView
            onPhaseSelect={(phaseId) => {
              setPhase(phaseId);
              setTreeViewMode('single');
            }}
            onMoveSelect={setSelectedMove}
          />
        )}

        {/* Overview Map View */}
        {!isLoading && treeViewMode === 'map' && (
          <OverviewMapView
            onPhaseSelect={(phaseId) => {
              setPhase(phaseId);
              setTreeViewMode('single');
            }}
          />
        )}
      </div>

      {/* Side Panel */}
      <SidePanel
        selectedMove={selectedMove}
        phase={phase}
        onPhaseChange={setPhase}
        isOpen={sidePanelOpen}
        onToggle={() => setSidePanelOpen(!sidePanelOpen)}
      />

      {/* Footer */}
      <div className={`border-t border-gray-200 bg-gray-50 px-6 py-3 transition-all duration-300 ${sidePanelOpen ? 'mr-[400px]' : ''}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>
            <span className="font-medium text-green-600">Response Preparedness:</span> Every government move has a prepared counter-punch
          </span>
          <span>EDPA 24-376 | Target: March 17, 2026</span>
        </div>
      </div>
    </div>
  );
}
