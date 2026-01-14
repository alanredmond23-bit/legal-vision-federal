import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Circle, GripVertical, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Node {
  id: number;
  title: string;
  phase: string;
  deadline: string;
  day_from_start?: number;
  client_task: string;
  attorney_task: string;
  status?: 'todo' | 'in_progress' | 'done';
}

interface ProgressViewProps {
  nodes: Node[];
  currentPhase: string;
}

type TaskStatus = 'todo' | 'in_progress' | 'done';

interface Task {
  id: number;
  nodeId: number;
  title: string;
  phase: string;
  deadline: string;
  type: 'client' | 'attorney';
  description: string;
  status: TaskStatus;
}

export default function ProgressView({ nodes, currentPhase }: ProgressViewProps) {
  const { attorney } = useUser();
  const STORAGE_KEY = `edpa-24376-progress-${attorney}`;

  // Convert nodes to tasks (both client and attorney tasks)
  const createInitialTasks = (): Task[] => nodes.flatMap((node, idx) => [
    {
      id: idx * 2,
      nodeId: node.id,
      title: `${node.title} - Client`,
      phase: node.phase,
      deadline: node.deadline,
      type: 'client' as const,
      description: node.client_task,
      status: 'todo' as TaskStatus
    },
    {
      id: idx * 2 + 1,
      nodeId: node.id,
      title: `${node.title} - Attorney`,
      phase: node.phase,
      deadline: node.deadline,
      type: 'attorney' as const,
      description: node.attorney_task,
      status: 'todo' as TaskStatus
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from localStorage on mount or when attorney changes
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.tasks || createInitialTasks());
      } catch {
        setTasks(createInitialTasks());
      }
    } else {
      setTasks(createInitialTasks());
    }
  }, [nodes, attorney, STORAGE_KEY]);

  // Save to localStorage when tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        tasks,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [tasks]);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [filterPhase, setFilterPhase] = useState<string>('all');

  const phases = ['all', ...new Set(nodes.map(n => n.phase))];

  const filteredTasks = filterPhase === 'all'
    ? tasks
    : tasks.filter(t => t.phase === filterPhase);

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (newStatus: TaskStatus) => {
    if (draggedTask) {
      setTasks(prev => prev.map(t =>
        t.id === draggedTask.id ? { ...t, status: newStatus } : t
      ));
      setDraggedTask(null);
    }
  };

  const toggleExpand = (taskId: number) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const moveTask = (taskId: number, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const isExpanded = expandedTasks.has(task.id);
    const isClient = task.type === 'client';
    const isTrialPhase = task.phase === 'Trial';

    return (
      <div
        draggable
        onDragStart={() => handleDragStart(task)}
        className={`bg-white rounded-lg border-2 p-3 cursor-move hover:shadow-md transition-all ${
          isClient ? 'border-l-blue-500' : 'border-l-purple-500'
        } border-l-4 ${isTrialPhase ? 'opacity-60 bg-gray-100' : ''}`}
      >
        <div className="flex items-start gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleExpand(task.id)} className="flex-shrink-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isClient ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {isClient ? 'Client' : 'Attorney'}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 text-sm mt-1 truncate">{task.title.replace(' - Client', '').replace(' - Attorney', '')}</h4>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">{task.phase}</p>
              {isTrialPhase && (
                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  If Necessary
                </span>
              )}
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700">{task.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Deadline: {new Date(task.deadline).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>

                {/* Quick move buttons */}
                <div className="flex gap-2 mt-3">
                  {task.status !== 'todo' && (
                    <button
                      onClick={() => moveTask(task.id, 'todo')}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      → To Do
                    </button>
                  )}
                  {task.status !== 'in_progress' && (
                    <button
                      onClick={() => moveTask(task.id, 'in_progress')}
                      className="text-xs px-2 py-1 bg-yellow-100 hover:bg-yellow-200 rounded"
                    >
                      → In Progress
                    </button>
                  )}
                  {task.status !== 'done' && (
                    <button
                      onClick={() => moveTask(task.id, 'done')}
                      className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 rounded"
                    >
                      → Done
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const Column = ({
    title,
    tasks,
    status,
    icon: Icon,
    bgColor,
    borderColor
  }: {
    title: string;
    tasks: Task[];
    status: TaskStatus;
    icon: typeof Circle;
    bgColor: string;
    borderColor: string;
  }) => (
    <div
      className={`flex-1 rounded-xl ${bgColor} p-4 min-h-[500px]`}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(status)}
    >
      <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${borderColor}`}>
        <Icon className="w-5 h-5" />
        <h3 className="font-bold text-gray-900">{title}</h3>
        <span className="ml-auto bg-white px-2 py-0.5 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Progress & Planner</h2>
            <p className="text-sm text-gray-500">Kanban board - drag and drop tasks between columns</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Current Phase:</span>
              <span className="font-semibold text-blue-600">{currentPhase}</span>
            </div>

            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              {phases.map(phase => (
                <option key={phase} value={phase}>
                  {phase === 'all' ? 'All Phases' : phase}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">
              {doneTasks.length} of {filteredTasks.length} tasks complete ({Math.round((doneTasks.length / filteredTasks.length) * 100) || 0}%)
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(doneTasks.length / filteredTasks.length) * 100 || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4">
        <Column
          title="To Do"
          tasks={todoTasks}
          status="todo"
          icon={Circle}
          bgColor="bg-gray-100"
          borderColor="border-gray-300"
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="in_progress"
          icon={Clock}
          bgColor="bg-yellow-50"
          borderColor="border-yellow-300"
        />
        <Column
          title="Done"
          tasks={doneTasks}
          status="done"
          icon={CheckCircle2}
          bgColor="bg-green-50"
          borderColor="border-green-300"
        />
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <h4 className="font-medium text-gray-900 mb-3">Task Types</h4>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span className="text-sm text-gray-600">Client Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded" />
            <span className="text-sm text-gray-600">Attorney Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
