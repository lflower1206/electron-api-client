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
        if (confirm('Are you sure you want to delete this project? All associated APIs will be deleted.')) {
            onDeleteProject(id);
        }
    };

    return (
        <div className="w-64 h-full bg-dark-50 dark:bg-dark-900 border-r border-dark-200 dark:border-dark-700 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-dark-200 dark:border-dark-700">
                <h1 className="text-xl font-bold text-dark-900 dark:text-dark-100 mb-4">
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
            <div className="flex-1 overflow-y-auto p-2">
                {projects.length === 0 ? (
                    <div className="text-center text-dark-500 dark:text-dark-500 text-sm mt-8 px-4">
                        No projects yet. Create one to get started!
                    </div>
                ) : (
                    <div className="space-y-1">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className={cn(
                                    'group relative p-3 rounded-lg cursor-pointer transition-all',
                                    'hover:bg-dark-100 dark:hover:bg-dark-800',
                                    selectedProjectId === project.id
                                        ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                                        : 'border border-transparent'
                                )}
                                onClick={() => onSelectProject(project.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-dark-900 dark:text-dark-100 truncate">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-xs text-dark-600 dark:text-dark-400 mt-1 line-clamp-2">
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
                                            className="p-1 hover:bg-dark-200 dark:hover:bg-dark-700 rounded text-dark-600 dark:text-dark-400"
                                            title="Edit project"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProject(project.id, e)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
                                            title="Delete project"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
