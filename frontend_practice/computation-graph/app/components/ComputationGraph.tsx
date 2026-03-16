"use client";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { VarNode, OpNode } from "./CustomNodes";

const nodeTypes = { var: VarNode, op: OpNode };

const nodes: Node[] = [
  // Input variables
  {
    id: "x",
    type: "var",
    position: { x: 0, y: 300 },
    data: { label: "x", subtitle: "input", color: "#3b82f6" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "y",
    type: "var",
    position: { x: 0, y: 450 },
    data: { label: "y", subtitle: "input", color: "#3b82f6" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "b",
    type: "var",
    position: { x: 350, y: 100 },
    data: { label: "b", subtitle: "bias", color: "#3b82f6" },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  },
  // Operations
  {
    id: "mul",
    type: "op",
    position: { x: 200, y: 360 },
    data: { label: "\u00d7" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "add",
    type: "op",
    position: { x: 400, y: 360 },
    data: { label: "+" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  // Intermediate
  {
    id: "z",
    type: "var",
    position: { x: 600, y: 360 },
    data: { label: "z" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  // Sigmoid
  {
    id: "sigma",
    type: "op",
    position: { x: 800, y: 360 },
    data: { label: "\u03c3" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  // Output
  {
    id: "L",
    type: "var",
    position: { x: 1000, y: 360 },
    data: { label: "L", subtitle: "output", color: "#ef4444" },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];

const edges: Edge[] = [
  { id: "x-mul", source: "x", target: "mul", animated: true },
  { id: "y-mul", source: "y", target: "mul", animated: true },
  {
    id: "mul-add",
    source: "mul",
    target: "add",
    label: "x \u00b7 y",
    animated: true,
  },
  {
    id: "b-add",
    source: "b",
    target: "add",
    sourceHandle: undefined,
    animated: true,
  },
  {
    id: "add-z",
    source: "add",
    target: "z",
    label: "x \u00b7 y + b",
    animated: true,
  },
  { id: "z-sigma", source: "z", target: "sigma", animated: true },
  { id: "sigma-L", source: "sigma", target: "L", animated: true },
];

export default function ComputationGraph() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "#64748b" },
          labelStyle: { fontSize: 14, fontWeight: 600 },
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
