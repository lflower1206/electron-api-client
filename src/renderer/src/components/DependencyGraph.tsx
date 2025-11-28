import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { API } from '../types';

interface DependencyGraphProps {
  apis: API[];
}

const DependencyGraph = ({ apis }: DependencyGraphProps) => {
  // Transform APIs to nodes and edges
  const currentNodes = useMemo(() => {
    return apis.map((api, index) => ({
      id: api.id,
      position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 100 },
      data: { label: api.name },
      style: {
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '10px',
        width: 180,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow:
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    }));
  }, [apis]);

  const currentEdges = useMemo(() => {
    return apis.flatMap((api) =>
      (api.dependencies || []).map((depId) => ({
        id: `${depId} -${api.id} `,
        source: depId,
        target: api.id,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#6b7280' },
        animated: true,
      }))
    );
  }, [apis]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={currentNodes}
        edges={currentEdges}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
