import { useApiClient } from '@renderer/hooks/useApiClient';
import Sidebar from '@renderer/components/Sidebar';
import ApiList from '@renderer/components/ApiList';
import EmptyState from '@renderer/components/EmptyState';

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

  const projectApis = selectedProjectId ? getProjectApis(selectedProjectId) : [];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        onCreateProject={createProject}
        onUpdateProject={(id, name, description) => updateProject(id, { name, description })}
        onDeleteProject={deleteProject}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedProject ? (
          <div className="h-full p-6">
            <ApiList
              apis={projectApis}
              onCreateApi={(apiData) => createApi(selectedProjectId!, apiData)}
              onUpdateApi={updateApi}
              onDeleteApi={deleteApi}
            />
          </div>
        ) : (
          <EmptyState
            icon={
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
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

