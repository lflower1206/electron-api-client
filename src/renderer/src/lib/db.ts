import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Project, API } from '../types';

interface ApiClientDB extends DBSchema {
  projects: {
    key: string;
    value: Project;
    indexes: { 'by-date': string };
  };
  apis: {
    key: string;
    value: API;
    indexes: { 'by-project': string; 'by-date': string };
  };
}

const DB_NAME = 'api-client-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ApiClientDB>> | null = null;

export const initDB = (): Promise<IDBPDatabase<ApiClientDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<ApiClientDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Projects store
        const projectStore = db.createObjectStore('projects', {
          keyPath: 'id',
        });
        projectStore.createIndex('by-date', 'createdAt');

        // APIs store
        const apiStore = db.createObjectStore('apis', { keyPath: 'id' });
        apiStore.createIndex('by-project', 'projectId');
        apiStore.createIndex('by-date', 'createdAt');
      },
    });
  }
  return dbPromise!;
};

// Project operations
export const getProjects = async (): Promise<Project[]> => {
  const db = await initDB();
  return db.getAllFromIndex('projects', 'by-date');
};

export const createProject = async (project: Project): Promise<Project> => {
  const db = await initDB();
  await db.put('projects', project);
  return project;
};

export const updateProject = async (project: Project): Promise<void> => {
  const db = await initDB();
  await db.put('projects', project);
};

export const deleteProject = async (id: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(['projects', 'apis'], 'readwrite');

  // Delete project
  await tx.objectStore('projects').delete(id);

  // Delete associated APIs
  const apiStore = tx.objectStore('apis');
  const index = apiStore.index('by-project');
  let cursor = await index.openCursor(id);

  while (cursor) {
    await cursor.delete();
    cursor = await cursor.continue();
  }

  await tx.done;
};

// API operations
export const getApis = async (): Promise<API[]> => {
  const db = await initDB();
  return db.getAllFromIndex('apis', 'by-date');
};

export const getProjectApis = async (projectId: string): Promise<API[]> => {
  const db = await initDB();
  return db.getAllFromIndex('apis', 'by-project', projectId);
};

export const createApi = async (api: API): Promise<API> => {
  const db = await initDB();
  await db.put('apis', api);
  return api;
};

export const updateApi = async (api: API): Promise<void> => {
  const db = await initDB();
  await db.put('apis', api);
};

export const deleteApi = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('apis', id);
};
