import { useState, useCallback, useEffect } from 'react';
import { Project, API } from '@renderer/types';
import * as db from '@renderer/lib/db';

interface UseApiClientReturn {
  // State
  projects: Project[];
  apis: API[];
  selectedProjectId: string | null;
  selectedProject: Project | null;

  // Project operations
  createProject: (name: string, description: string) => Promise<Project>;
  updateProject: (
    id: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt'>>
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<string | null>>;

  // API operations
  createApi: (
    projectId: string,
    apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>
  ) => Promise<API>;
  updateApi: (
    id: string,
    updates: Partial<Omit<API, 'id' | 'projectId' | 'createdAt'>>
  ) => Promise<void>;
  deleteApi: (id: string) => Promise<void>;
  getProjectApis: (projectId: string) => API[];
}

export const useApiClient = (): UseApiClientReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [apis, setApis] = useState<API[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  // Load initial data
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const [loadedProjects, loadedApis] = await Promise.all([
          db.getProjects(),
          db.getApis(),
        ]);
        setProjects(loadedProjects);
        setApis(loadedApis);
      } catch (error) {
        console.error('Failed to load data from DB:', error);
      }
    };
    loadData();
  }, []);

  // Project operations
  const createProject = useCallback(
    async (name: string, description: string) => {
      const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        description,
        createdAt: new Date().toISOString(),
      };

      await db.createProject(newProject);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    },
    []
  );

  const updateProject = useCallback(
    async (id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
      const projectToUpdate = projects.find((p) => p.id === id);
      if (!projectToUpdate) return;

      const updatedProject = { ...projectToUpdate, ...updates };
      await db.updateProject(updatedProject);

      setProjects((prev) =>
        prev.map((project) => (project.id === id ? updatedProject : project))
      );
    },
    [projects]
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await db.deleteProject(id);

      setProjects((prev) => prev.filter((project) => project.id !== id));
      setApis((prev) => prev.filter((api) => api.projectId !== id));

      if (selectedProjectId === id) {
        setSelectedProjectId(null);
      }
    },
    [selectedProjectId]
  );

  // API operations
  const createApi = useCallback(
    async (
      projectId: string,
      apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>
    ) => {
      const newApi: API = {
        id: crypto.randomUUID(),
        projectId,
        ...apiData,
        createdAt: new Date().toISOString(),
      };

      await db.createApi(newApi);
      setApis((prev) => [...prev, newApi]);
      return newApi;
    },
    []
  );

  const updateApi = useCallback(
    async (
      id: string,
      updates: Partial<Omit<API, 'id' | 'projectId' | 'createdAt'>>
    ) => {
      const apiToUpdate = apis.find((a) => a.id === id);
      if (!apiToUpdate) return;

      const updatedApi = { ...apiToUpdate, ...updates };
      await db.updateApi(updatedApi);

      setApis((prev) => prev.map((api) => (api.id === id ? updatedApi : api)));
    },
    [apis]
  );

  const deleteApi = useCallback(async (id: string) => {
    await db.deleteApi(id);
    setApis((prev) => prev.filter((api) => api.id !== id));
  }, []);

  // Get APIs for a specific project
  const getProjectApis = useCallback(
    (projectId: string) => {
      return apis.filter((api) => api.projectId === projectId);
    },
    [apis]
  );

  // Get selected project
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;

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
