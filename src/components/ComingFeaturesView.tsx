import { Gavel, Building2, Users, Wrench, Clock } from 'lucide-react';

interface ComingFeature {
  id: string;
  title: string;
  description: string;
  details: string[];
  status: 'development' | 'research' | 'planned';
  assignee: string;
  icon: typeof Gavel;
}

const comingFeatures: ComingFeature[] = [
  {
    id: 'judge-analysis',
    title: 'Judge Analysis',
    description: 'Comprehensive analysis of Judge historical patterns and ruling tendencies',
    details: [
      '93 criminal cases analyzed',
      '12 tax-related cases reviewed',
      'Sentencing patterns and tendencies',
      'Motion ruling history',
      'Trial vs plea outcomes'
    ],
    status: 'research',
    assignee: 'Shannon',
    icon: Gavel
  },
  {
    id: 'edpa-doj-analysis',
    title: 'EDPA/DOJ Analysis',
    description: 'District-specific prosecution patterns and success rates',
    details: [
      'EDPA conviction rates by charge type',
      'DOJ prosecution patterns in similar cases',
      'Motion success rates in district',
      'Plea deal statistics',
      'Trial outcome analysis'
    ],
    status: 'research',
    assignee: 'Shannon',
    icon: Building2
  },
  {
    id: 'crawley-dalke',
    title: 'Crawley and Dalke Analysis',
    description: 'Co-defendant strategy coordination and case impact assessment',
    details: [
      'Co-defendant case status tracking',
      'Potential cooperation agreements',
      'Impact on client strategy',
      'Joint defense considerations',
      'Severance motion analysis'
    ],
    status: 'planned',
    assignee: 'Shannon',
    icon: Users
  }
];

function getStatusBadge(status: ComingFeature['status']) {
  switch (status) {
    case 'development':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          <Wrench className="w-3 h-3" />
          In Development
        </span>
      );
    case 'research':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          <Clock className="w-3 h-3" />
          Research Phase
        </span>
      );
    case 'planned':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          <Clock className="w-3 h-3" />
          Planned
        </span>
      );
  }
}

export default function ComingFeaturesView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Coming Features</h2>
          <p className="text-gray-300 text-sm">Advanced analysis modules in development</p>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 font-medium">
              Shannon is currently working on these analysis modules.
              Data collection and pattern analysis is ongoing.
            </p>
          </div>

          <div className="grid gap-6">
            {comingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Analysis Components:</h4>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-gray-400 mt-1">-</span>
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500">
                        Assigned to: <span className="font-medium text-gray-700">{feature.assignee}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Sources Note */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Data Sources</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">CourtListener</p>
            <p className="text-gray-500">EDPA historical case data</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">PACER</p>
            <p className="text-gray-500">Federal court records</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">DOJ Statistics</p>
            <p className="text-gray-500">Prosecution outcomes</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">Lexis Machina</p>
            <p className="text-gray-500">Legal analytics platform</p>
          </div>
        </div>
      </div>

      {/* Contact Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          For questions about these features or to contribute data, contact the development team.
          Analysis modules will be integrated as they become available.
        </p>
      </div>
    </div>
  );
}
