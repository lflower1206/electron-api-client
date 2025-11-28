export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Header {
  key: string;
  value: string;
}

export interface Mapping {
  sourceApiId: string;
  sourceField: string; // e.g., "body.token", "headers.Authorization"
  targetField: string; // e.g., "headers.Authorization", "body.userId"
}

export interface API {
  id: string;
  projectId: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  description: string;
  createdAt: string;
  dependencies?: string[]; // List of parent API IDs
  mappings?: Mapping[];
}
