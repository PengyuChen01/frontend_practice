"use client";

import { Handle, Position } from "@xyflow/react";

export function VarNode({
  data,
}: {
  data: { label: string; subtitle?: string; color?: string };
}) {
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Left} />
      <div
        className="flex items-center justify-center rounded-full border-2 border-slate-400 bg-white text-xl font-semibold"
        style={{ width: 64, height: 64 }}
      >
        {data.label}
      </div>
      {data.subtitle && (
        <span
          className="mt-1 text-xs font-medium"
          style={{ color: data.color ?? "#64748b" }}
        >
          {data.subtitle}
        </span>
      )}
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
}

export function OpNode({ data }: { data: { label: string } }) {
  return (
    <div className="flex items-center justify-center">
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Top} id="top" />
      <div
        className="flex items-center justify-center rounded-md border-2 border-slate-500 bg-slate-100 text-xl font-bold"
        style={{ width: 56, height: 56 }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
