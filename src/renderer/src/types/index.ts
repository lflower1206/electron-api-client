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
}
