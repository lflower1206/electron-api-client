import { useState, FormEvent } from 'react';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import { API, HttpMethod, Header } from '@renderer/types';

export interface ApiFormProps {
  api?: API;
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

const ApiForm = ({ api, onSubmit, onCancel }: ApiFormProps) => {
  const [name, setName] = useState(api?.name || '');
  const [method, setMethod] = useState<HttpMethod>(api?.method || 'GET');
  const [url, setUrl] = useState(api?.url || '');
  const [headers, setHeaders] = useState<Header[]>(
    api?.headers || [{ key: '', value: '' }]
  );
  const [body, setBody] = useState(api?.body || '');
  const [description, setDescription] = useState(api?.description || '');
  const [errors, setErrors] = useState<{
    name?: string;
    url?: string;
    body?: string;
  }>({});

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
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

      <div className="flex justify-end gap-3 pt-4">
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
