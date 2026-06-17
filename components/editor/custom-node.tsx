"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

/**
 * Custom node component for rendering canvas nodes.
 * Renders a simple bordered rectangle with the label centered.
 */
function CanvasNodeComponent({ data, selected }: NodeProps) {
  const label = (data as { label?: string }).label ?? "";
  const color = (data as { color?: string }).color ?? "#6366f1";

  return (
    <div
      className="flex items-center justify-center rounded-lg border-2 px-4 py-3 text-center transition-all"
      style={{
        borderColor: color,
        backgroundColor: `${color}15`,
        minWidth: "100px",
        minHeight: "60px",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-bg-surface !border-2 !border-border-default"
      />
      <span
        className="text-sm font-medium text-text-primary"
        style={{ color }}
      >
        {label || "New node"}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-bg-surface !border-2 !border-border-default"
      />
    </div>
  );
}

/**
 * Memoized custom node component
 */
export const CanvasNode = memo(CanvasNodeComponent);

// Define the node types map for React Flow
export const nodeTypes = {
  canvasNode: CanvasNode,
};