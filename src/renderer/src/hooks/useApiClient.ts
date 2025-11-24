import { useState, useCallback } from 'react';
import { Project, API } from '@renderer/types';

export const useApiClient = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [apis, setApis] = useState<API[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Project operations
    const createProject = useCallback((name: string, description: string) => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            description,
            createdAt: new Date().toISOString(),
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
    }, []);

    const updateProject = useCallback((id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === id ? { ...project, ...updates } : project
            )
        );
    }, []);

    const deleteProject = useCallback((id: string) => {
        setProjects((prev) => prev.filter((project) => project.id !== id));
        setApis((prev) => prev.filter((api) => api.projectId !== id));
        if (selectedProjectId === id) {
            setSelectedProjectId(null);
        }
    }, [selectedProjectId]);

    // API operations
    const createApi = useCallback((
        projectId: string,
        apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>
    ) => {
        const newApi: API = {
            id: crypto.randomUUID(),
            projectId,
            ...apiData,
            createdAt: new Date().toISOString(),
        };
        setApis((prev) => [...prev, newApi]);
        return newApi;
    }, []);

    const updateApi = useCallback((id: string, updates: Partial<Omit<API, 'id' | 'projectId' | 'createdAt'>>) => {
        setApis((prev) =>
            prev.map((api) =>
                api.id === id ? { ...api, ...updates } : api
            )
        );
    }, []);

    const deleteApi = useCallback((id: string) => {
        setApis((prev) => prev.filter((api) => api.id !== id));
    }, []);

    // Get APIs for a specific project
    const getProjectApis = useCallback((projectId: string) => {
        return apis.filter((api) => api.projectId === projectId);
    }, [apis]);

    // Get selected project
    const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;

    return {
        // State
        projects,
        apis,
        selectedProjectId,
        selectedProject,

        // Project operations
        createProject,
        updateProject,
        deleteProject,
        setSelectedProjectId,

        // API operations
        createApi,
        updateApi,
        deleteApi,
        getProjectApis,
    };
};
