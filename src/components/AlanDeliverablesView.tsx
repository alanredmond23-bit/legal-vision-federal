import { CheckCircle, Circle, Clock, FileText, FolderOpen, AlertTriangle } from 'lucide-react';

interface Deliverable {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'in_progress' | 'pending';
  dueDate?: string;
  category: 'documents' | 'financial' | 'communications' | 'evidence';
}

const deliverables: Deliverable[] = [
  {
    id: '1',
    title: 'Personal Financial Records',
    description: 'Bank statements, tax returns, investment accounts for relevant years',
    status: 'in_progress',
    dueDate: 'Jan 25, 2026',
    category: 'financial'
  },
  {
    id: '2',
    title: 'Business Documentation',
    description: 'Corporate records, contracts, employment agreements',
    status: 'pending',
    dueDate: 'Jan 30, 2026',
    category: 'documents'
  },
  {
    id: '3',
    title: 'Email Communications',
    description: 'Relevant email threads and correspondence',
    status: 'in_progress',
    category: 'communications'
  },
  {
    id: '4',
    title: 'Timeline of Events',
    description: 'Detailed chronology of key events and decisions',
    status: 'complete',
    category: 'documents'
  },
  {
    id: '5',
    title: 'Witness Contact List',
    description: 'Potential character witnesses and their contact information',
    status: 'pending',
    dueDate: 'Feb 5, 2026',
    category: 'evidence'
  },
  {
    id: '6',
    title: 'Employment Records',
    description: 'W-2s, 1099s, pay stubs, employment contracts',
    status: 'pending',
    dueDate: 'Feb 1, 2026',
    category: 'financial'
  },
  {
    id: '7',
    title: 'Attorney-Client Privileged Notes',
    description: 'Notes from meetings with previous counsel',
    status: 'complete',
    category: 'documents'
  },
  {
    id: '8',
    title: 'Exculpatory Evidence List',
    description: 'Documents and evidence supporting defense',
    status: 'in_progress',
    category: 'evidence'
  }
];

function getStatusIcon(status: Deliverable['status']) {
  switch (status) {
    case 'complete':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'in_progress':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'pending':
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
}

function getStatusLabel(status: Deliverable['status']) {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
      return 'Pending';
  }
}

function getCategoryIcon(category: Deliverable['category']) {
  switch (category) {
    case 'documents':
      return <FileText className="w-4 h-4" />;
    case 'financial':
      return <FolderOpen className="w-4 h-4" />;
    case 'communications':
      return <FileText className="w-4 h-4" />;
    case 'evidence':
      return <AlertTriangle className="w-4 h-4" />;
  }
}

export default function AlanDeliverablesView() {
  const completeCount = deliverables.filter(d => d.status === 'complete').length;
  const inProgressCount = deliverables.filter(d => d.status === 'in_progress').length;
  const pendingCount = deliverables.filter(d => d.status === 'pending').length;

  const categories = ['documents', 'financial', 'communications', 'evidence'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Client Deliverables</h2>
          <p className="text-gray-300 text-sm">Required documents and materials from client</p>
        </div>

        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">{completeCount}</div>
              <div className="text-sm text-green-600">Complete</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-700">{inProgressCount}</div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-gray-700">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round((completeCount / deliverables.length) * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${(completeCount / deliverables.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deliverables by Category */}
      {categories.map(category => {
        const categoryDeliverables = deliverables.filter(d => d.category === category);
        if (categoryDeliverables.length === 0) return null;

        return (
          <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-100 px-6 py-3 border-b">
              <div className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <h3 className="font-semibold text-gray-800 capitalize">{category}</h3>
                <span className="text-sm text-gray-500">({categoryDeliverables.length} items)</span>
              </div>
            </div>

            <div className="divide-y">
              {categoryDeliverables.map(deliverable => (
                <div key={deliverable.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(deliverable.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{deliverable.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          deliverable.status === 'complete'
                            ? 'bg-green-100 text-green-700'
                            : deliverable.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getStatusLabel(deliverable.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                      {deliverable.dueDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Due: <span className="font-medium">{deliverable.dueDate}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Instructions</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>Please gather all requested documents as soon as possible</li>
          <li>Contact attorney with any questions about specific items</li>
          <li>All documents are protected by attorney-client privilege</li>
          <li>Secure delivery methods will be provided for sensitive materials</li>
        </ul>
      </div>
    </div>
  );
}
