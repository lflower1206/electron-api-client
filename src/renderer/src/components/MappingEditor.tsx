import { useState, useEffect } from 'react';
import { API, Mapping } from '../types';

interface MappingEditorProps {
  currentApi: API;
  availableApis: API[]; // Should be the list of dependencies
  onUpdate: (mappings: Mapping[]) => void;
}

const MappingEditor = ({
  currentApi,
  availableApis,
  onUpdate,
}: MappingEditorProps) => {
  const [mappings, setMappings] = useState<Mapping[]>(
    currentApi.mappings || []
  );

  useEffect(() => {
    setMappings(currentApi.mappings || []);
  }, [currentApi.mappings]);

  const handleAddMapping = () => {
    if (availableApis.length === 0) return;
    const newMapping: Mapping = {
      sourceApiId: availableApis[0].id,
      sourceField: '',
      targetField: '',
    };
    const updatedMappings = [...mappings, newMapping];
    setMappings(updatedMappings);
    onUpdate(updatedMappings);
  };

  const handleRemoveMapping = (index: number) => {
    const updatedMappings = mappings.filter((_, i) => i !== index);
    setMappings(updatedMappings);
    onUpdate(updatedMappings);
  };

  const handleUpdateMapping = (
    index: number,
    field: keyof Mapping,
    value: string
  ) => {
    const updatedMappings = mappings.map((mapping, i) =>
      i === index ? { ...mapping, [field]: value } : mapping
    );
    setMappings(updatedMappings);
    onUpdate(updatedMappings);
  };

  if (availableApis.length === 0) {
    return (
      <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
        No dependencies available. Add dependencies to chain requests.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-neutral-900 dark:text-white">
          Response Mappings
        </h3>
        <button
          onClick={handleAddMapping}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Mapping
        </button>
      </div>

      {mappings.length === 0 ? (
        <div className="text-sm text-neutral-500 dark:text-neutral-400 italic">
          No mappings defined.
        </div>
      ) : (
        <div className="space-y-2">
          {mappings.map((mapping, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 bg-neutral-50 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    Source API
                  </label>
                  <select
                    value={mapping.sourceApiId}
                    onChange={(e) =>
                      handleUpdateMapping(index, 'sourceApiId', e.target.value)
                    }
                    className="w-full text-sm p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                  >
                    {availableApis.map((api) => (
                      <option key={api.id} value={api.id}>
                        {api.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Source Field (e.g. body.token)
                    </label>
                    <input
                      type="text"
                      value={mapping.sourceField}
                      onChange={(e) =>
                        handleUpdateMapping(
                          index,
                          'sourceField',
                          e.target.value
                        )
                      }
                      placeholder="body.token"
                      className="w-full text-sm p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Target Field (e.g. headers.Auth)
                    </label>
                    <input
                      type="text"
                      value={mapping.targetField}
                      onChange={(e) =>
                        handleUpdateMapping(
                          index,
                          'targetField',
                          e.target.value
                        )
                      }
                      placeholder="headers.Authorization"
                      className="w-full text-sm p-1.5 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveMapping(index)}
                className="text-neutral-400 hover:text-red-500 mt-6"
                title="Remove mapping"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MappingEditor;
