import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';
import ApiForm from './ApiForm';
import { API, HttpMethod } from '@renderer/types';
import { cn } from '@renderer/utils/cn';

export interface ApiListProps {
  apis: API[];
  onCreateApi: (apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>) => void;
  onUpdateApi: (
    id: string,
    updates: Partial<Omit<API, 'id' | 'projectId' | 'createdAt'>>
  ) => void;
  onDeleteApi: (id: string) => void;
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  PATCH:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const ApiList = ({
  apis,
  onCreateApi,
  onUpdateApi,
  onDeleteApi,
}: ApiListProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingApi, setEditingApi] = useState<API | null>(null);
  const [expandedApiId, setExpandedApiId] = useState<string | null>(null);

  const handleCreateApi = (
    apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>
  ) => {
    onCreateApi(apiData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateApi = (
    apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>
  ) => {
    if (editingApi) {
      onUpdateApi(editingApi.id, apiData);
      setEditingApi(null);
    }
  };

  const handleDeleteApi = (id: string) => {
    if (confirm('Are you sure you want to delete this API?')) {
      onDeleteApi(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedApiId(expandedApiId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100">
          APIs
        </h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>+ New API</Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {apis.map((api) => {
          const isExpanded = expandedApiId === api.id;

          return (
            <Card key={api.id} className="p-4">
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => toggleExpand(api.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-semibold',
                        methodColors[api.method]
                      )}
                    >
                      {api.method}
                    </span>
                    <h3 className="font-semibold text-dark-900 dark:text-dark-100">
                      {api.name}
                    </h3>
                  </div>
                  <p className="text-sm text-dark-600 dark:text-dark-400 font-mono break-all">
                    {api.url}
                  </p>
                  {api.description && (
                    <p className="text-sm text-dark-500 dark:text-dark-500 mt-2">
                      {api.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingApi(api)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteApi(api.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-dark-200 dark:border-dark-700 space-y-3">
                  {api.headers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                        Headers:
                      </h4>
                      <div className="space-y-1">
                        {api.headers.map((header, index) => (
                          <div
                            key={index}
                            className="text-sm font-mono bg-dark-50 dark:bg-dark-900 p-2 rounded"
                          >
                            <span className="text-primary-600 dark:text-primary-400">
                              {header.key}
                            </span>
                            {': '}
                            <span className="text-dark-700 dark:text-dark-300">
                              {header.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {api.body && (
                    <div>
                      <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                        Request Body:
                      </h4>
                      <pre className="text-sm font-mono bg-dark-50 dark:bg-dark-900 p-3 rounded overflow-x-auto">
                        {api.body}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New API"
        size="lg"
      >
        <ApiForm
          onSubmit={handleCreateApi}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingApi}
        onClose={() => setEditingApi(null)}
        title="Edit API"
        size="lg"
      >
        {editingApi && (
          <ApiForm
            api={editingApi}
            onSubmit={handleUpdateApi}
            onCancel={() => setEditingApi(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default ApiList;
