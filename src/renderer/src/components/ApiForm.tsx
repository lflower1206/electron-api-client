import { useState, FormEvent } from 'react';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import MappingEditor from './MappingEditor';
import { API, HttpMethod, Header, Mapping } from '@renderer/types';

export interface ApiFormProps {
  api?: API;
  availableApis?: API[]; // List of other APIs in the project
  onSubmit: (apiData: Omit<API, 'id' | 'projectId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const httpMethods: { value: HttpMethod; label: string }[] = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' },
  { value: 'PATCH', label: 'PATCH' },
];

const ApiForm = ({
  api,
  availableApis = [],
  onSubmit,
  onCancel,
}: ApiFormProps) => {
  const [name, setName] = useState(api?.name || '');
  const [method, setMethod] = useState<HttpMethod>(api?.method || 'GET');
  const [url, setUrl] = useState(api?.url || '');
  const [headers, setHeaders] = useState<Header[]>(
    api?.headers || [{ key: '', value: '' }]
  );
  const [body, setBody] = useState(api?.body || '');
  const [description, setDescription] = useState(api?.description || '');
  const [dependencies, setDependencies] = useState<string[]>(
    api?.dependencies || []
  );
  const [mappings, setMappings] = useState<Mapping[]>(api?.mappings || []);
  const [errors, setErrors] = useState<{
    name?: string;
    url?: string;
    body?: string;
  }>({});

  // Filter out self from available APIs to avoid circular dependency (simple check)
  const validDependencies = availableApis.filter((a) => a.id !== api?.id);

  // Get selected dependency objects
  const selectedDependencyApis = validDependencies.filter((a) =>
    dependencies.includes(a.id)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: { name?: string; url?: string; body?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'API name is required';
    }
    if (!url.trim()) {
      newErrors.url = 'URL is required';
    }

    // Validate JSON body if provided
    if (
      body.trim() &&
      (method === 'POST' || method === 'PUT' || method === 'PATCH')
    ) {
      try {
        JSON.parse(body);
      } catch {
        newErrors.body = 'Invalid JSON format';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Filter out empty headers
    const validHeaders = headers.filter((h) => h.key.trim() && h.value.trim());

    onSubmit({
      name,
      method,
      url,
      headers: validHeaders,
      body,
      description,
      dependencies,
      mappings,
    });
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const updateHeader = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const toggleDependency = (apiId: string) => {
    setDependencies((prev) =>
      prev.includes(apiId)
        ? prev.filter((id) => id !== apiId)
        : [...prev, apiId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="API Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Get User Profile"
          error={errors.name}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="HTTP Method"
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            options={httpMethods}
          />

          <Input
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/users/1"
            error={errors.url}
          />
        </div>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300">
            Headers
          </label>
          <Button type="button" size="sm" variant="ghost" onClick={addHeader}>
            + Add Header
          </Button>
        </div>

        <div className="space-y-2">
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={header.key}
                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                placeholder="Header name"
                className="flex-1"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                placeholder="Header value"
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeHeader(index)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      </div>

      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <Textarea
          label="Request Body (JSON)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{\n  "key": "value"\n}'
          rows={6}
          error={errors.body}
          className="font-mono text-sm"
        />
      )}

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="A brief description of this API..."
        rows={3}
      />

      {/* Dependencies Section */}
      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
          Dependencies (Chain Requests)
        </label>
        {validDependencies.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            No other APIs available to depend on.
          </p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-neutral-200 dark:border-neutral-700 rounded bg-neutral-50 dark:bg-neutral-800">
            {validDependencies.map((depApi) => (
              <label
                key={depApi.id}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={dependencies.includes(depApi.id)}
                  onChange={() => toggleDependency(depApi.id)}
                  className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">{depApi.name}</span>
                <span className="text-xs text-neutral-500">
                  ({depApi.method})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Mappings Section */}
      {dependencies.length > 0 && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <MappingEditor
            currentApi={{ ...api!, mappings } as API}
            availableApis={selectedDependencyApis}
            onUpdate={setMappings}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {api ? 'Update API' : 'Create API'}
        </Button>
      </div>
    </form>
  );
};

export default ApiForm;
