import { useState } from 'react';
import { Project } from '@renderer/types';
import Button from './ui/Button';
import Modal from './ui/Modal';
import ProjectForm from './ProjectForm';
import { cn } from '@renderer/utils/cn';

export interface SidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onUpdateProject: (id: string, name: string, description: string) => void;
  onDeleteProject: (id: string) => void;
}

const Sidebar = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}: SidebarProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = (name: string, description: string) => {
    onCreateProject(name, description);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (name: string, description: string) => {
    if (editingProject) {
      onUpdateProject(editingProject.id, name, description);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        'Are you sure you want to delete this project? All associated APIs will be deleted.'
      )
    ) {
      onDeleteProject(id);
    }
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
          API Client
        </h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full"
          size="sm"
        >
          + New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-3">
        {projects.length === 0 ? (
          <div className="text-center text-neutral-500 dark:text-neutral-500 text-sm mt-8 px-4">
            No projects yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={cn(
                  'group relative p-3.5 rounded-xl cursor-pointer transition-all duration-200',
                  'hover:bg-neutral-50 dark:hover:bg-neutral-800',
                  selectedProjectId === project.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 shadow-sm'
                    : 'border border-transparent'
                )}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate text-sm">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Actions (visible on hover) */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingProject(project);
                      }}
                      className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-400 transition-colors"
                      title="Edit project"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 transition-colors"
                      title="Delete project"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit Project"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleUpdateProject}
            onCancel={() => setEditingProject(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
