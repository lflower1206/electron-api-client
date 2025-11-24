import { useState, useCallback } from 'react';
import type { Connection, EdgeChange, NodeChange } from '@xyflow/react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowNode {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
}
interface FlowEdge {
  id: string;
  source: string;
  target: string;
}
const initialNodes: FlowNode[] = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges: FlowEdge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

const Flow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange<FlowNode>[]) =>
      setNodes((nodesSnapshot) => {
        return applyNodeChanges(changes, nodesSnapshot);
      }),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<FlowEdge>[]) =>
      setEdges((edgesSnapshot) => {
        return applyEdgeChanges(changes, edgesSnapshot);
      }),
    []
  );
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((edgesSnapshot) => {
        return addEdge(connection, edgesSnapshot);
      }),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};

export default Flow;
