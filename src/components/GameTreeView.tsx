import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import gameTreeData from '../data/gametree.json';

// Custom Decision Node (Diamond shape)
function DecisionNode({ data }: NodeProps) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <div className="w-32 h-32 rotate-45 bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-blue-400 shadow-lg shadow-blue-500/30 flex items-center justify-center">
        <div className="-rotate-45 text-center p-2">
          <div className="text-white font-bold text-sm leading-tight">{data.label}</div>
          {data.subtitle && (
            <div className="text-blue-200 text-xs mt-1">{data.subtitle}</div>
          )}
          {data.probability && (
            <div className="text-yellow-300 text-xs font-mono mt-1">
              P: {Math.round(data.probability * 100)}%
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
    </div>
  );
}

// Custom Response Node (Pentagon/Hexagon shape for Government)
function ResponseNode({ data }: NodeProps) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="w-36 h-20 bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-500 rounded-lg shadow-lg flex items-center justify-center clip-pentagon">
        <div className="text-center">
          <div className="text-red-400 font-bold text-xs uppercase tracking-wider">{data.label}</div>
          {data.subtitle && (
            <div className="text-gray-300 text-xs mt-1">{data.subtitle}</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

// Custom Outcome Node (Circle)
function OutcomeNode({ data }: NodeProps) {
  const getColors = () => {
    switch (data.outcome) {
      case 'win':
        return {
          bg: 'from-green-500 to-green-700',
          border: 'border-green-400',
          shadow: 'shadow-green-500/40',
          text: 'text-white',
        };
      case 'lose':
        return {
          bg: 'from-red-500 to-red-700',
          border: 'border-red-400',
          shadow: 'shadow-red-500/40',
          text: 'text-white',
        };
      default:
        return {
          bg: 'from-yellow-500 to-yellow-600',
          border: 'border-yellow-400',
          shadow: 'shadow-yellow-500/40',
          text: 'text-gray-900',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div
        className={`w-24 h-24 rounded-full bg-gradient-to-br ${colors.bg} border-3 ${colors.border} shadow-lg ${colors.shadow} flex items-center justify-center`}
      >
        <div className={`text-center px-2 ${colors.text}`}>
          <div className="font-bold text-xs leading-tight">{data.label}</div>
          {data.cascade && (
            <div className="text-xs mt-1 animate-pulse">CASCADE</div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

const nodeTypes = {
  decision: DecisionNode,
  response: ResponseNode,
  outcome: OutcomeNode,
};

export default function GameTreeView() {
  const nodes: Node[] = useMemo(
    () =>
      gameTreeData.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data,
        position: node.position,
      })),
    []
  );

  const edges: Edge[] = useMemo(
    () =>
      gameTreeData.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.animated || false,
        style: { stroke: edge.animated ? '#22c55e' : '#6b7280', strokeWidth: 2 },
        labelStyle: { fill: '#d1d5db', fontSize: 12, fontWeight: 600 },
        labelBgStyle: { fill: '#1f2937', fillOpacity: 0.9 },
        labelBgPadding: [4, 4] as [number, number],
        labelBgBorderRadius: 4,
      })),
    []
  );

  const onInit = useCallback(() => {
    console.log('Game Tree initialized');
  }, []);

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Litigation Game Tree</h2>
            <p className="text-gray-400 text-sm">
              Extensive-form decision tree showing defense moves and government responses
            </p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rotate-45 bg-blue-600 border border-blue-400"></div>
              <span className="text-gray-300 text-sm">Defense Decision</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-gray-700 border border-gray-500 rounded"></div>
              <span className="text-gray-300 text-sm">Govt Response</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-300 text-sm">Win</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span className="text-gray-300 text-sm">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-gray-300 text-sm">Lose</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Canvas */}
      <div style={{ height: '800px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={onInit}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          attributionPosition="bottom-left"
        >
          <Controls
            className="!bg-gray-800 !border-gray-600 !shadow-lg"
            showInteractive={false}
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#374151"
          />
        </ReactFlow>
      </div>

      {/* Footer Legend */}
      <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            <span className="text-green-400 font-semibold">Green lines</span> = Cascade triggers (win unlocks next move)
          </div>
          <div className="text-gray-400">
            Use mouse wheel to zoom | Drag to pan | Click nodes for details
          </div>
        </div>
      </div>
    </div>
  );
}
