"use client";

import { Square, Circle, Diamond, Pill, Hexagon, Cylinder } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Available shape types for canvas nodes
 */
export type ShapeType = "rectangle" | "circle" | "diamond" | "pill" | "cylinder" | "hexagon";

/**
 * Configuration for each shape type
 */
interface ShapeConfig {
  type: ShapeType;
  icon: React.ComponentType<{ className?: string }>;
  defaultWidth: number;
  defaultHeight: number;
}

/**
 * Shape configurations with their default sizes
 */
const SHAPES: ShapeConfig[] = [
  { type: "rectangle", icon: Square, defaultWidth: 180, defaultHeight: 80 },
  { type: "circle", icon: Circle, defaultWidth: 100, defaultHeight: 100 },
  { type: "diamond", icon: Diamond, defaultWidth: 120, defaultHeight: 120 },
  { type: "pill", icon: Pill, defaultWidth: 160, defaultHeight: 60 },
  { type: "cylinder", icon: Cylinder, defaultWidth: 100, defaultHeight: 100 },
  { type: "hexagon", icon: Hexagon, defaultWidth: 120, defaultHeight: 100 },
];

/**
 * Props for ShapePanel component
 */
interface ShapePanelProps {
  className?: string;
}

/**
 * A floating pill-shaped toolbar at the bottom-center of the canvas.
 * Contains draggable icon buttons for different shapes.
 */
export function ShapePanel({ className }: ShapePanelProps) {
  const handleDragStart = (
    e: React.DragEvent,
    shape: ShapeConfig
  ) => {
    const payload = JSON.stringify({
      shape: shape.type,
      width: shape.defaultWidth,
      height: shape.defaultHeight,
    });
    e.dataTransfer.setData("application/x-ghost-canvas", payload);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border-subtle bg-bg-surface/95 px-2 py-1.5 shadow-lg backdrop-blur-xl",
        className
      )}
    >
      {SHAPES.map((shape) => {
        const Icon = shape.icon;
        return (
          <button
            key={shape.type}
            draggable
            onDragStart={(e) => handleDragStart(e, shape)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-bg-elevated hover:scale-110 active:scale-95"
            title={shape.type}
          >
            <Icon className="h-5 w-5 text-text-secondary" />
          </button>
        );
      })}
    </div>
  );
}

/**
 * Get default dimensions for a shape type
 */
export function getDefaultDimensions(shape: ShapeType): { width: number; height: number } {
  const config = SHAPES.find((s) => s.type === shape);
  if (config) {
    return { width: config.defaultWidth, height: config.defaultHeight };
  }
  return { width: 180, height: 80 };
}