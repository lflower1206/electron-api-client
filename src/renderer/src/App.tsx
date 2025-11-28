import { useState } from 'react';
import { useApiClient } from '@renderer/hooks/useApiClient';
import Sidebar from '@renderer/components/Sidebar';
import ApiList from '@renderer/components/ApiList';
import EmptyState from '@renderer/components/EmptyState';
import DependencyGraph from '@renderer/components/DependencyGraph';

const App = () => {
  const {
    projects,
    selectedProjectId,
    selectedProject,
    createProject,
    updateProject,
    deleteProject,
    setSelectedProjectId,
    createApi,
    updateApi,
    deleteApi,
    getProjectApis,
  } = useApiClient();

  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  const projectApis = selectedProjectId
    ? getProjectApis(selectedProjectId)
    : [];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onCreateProject={createProject}
        onUpdateProject={(id, name, description) =>
          updateProject(id, { name, description })
        }
        onDeleteProject={deleteProject}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedProject ? (
          <div className="h-full flex flex-col">
            <div className="px-6 pt-6 pb-2 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {selectedProject.name}
              </h1>
              <div className="flex bg-neutral-200 dark:bg-neutral-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'graph'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Graph
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden p-6 pt-2">
              {viewMode === 'list' ? (
                <ApiList
                  apis={projectApis}
                  onCreateApi={(apiData) =>
                    createApi(selectedProjectId!, apiData)
                  }
                  onUpdateApi={updateApi}
                  onDeleteApi={deleteApi}
                />
              ) : (
                <DependencyGraph apis={projectApis} />
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={
              <svg
                className="w-24 h-24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            }
            title="No Project Selected"
            description="Select a project from the sidebar to view and manage its APIs, or create a new project to get started."
          />
        )}
      </div>
    </div>
  );
};

export default App;
