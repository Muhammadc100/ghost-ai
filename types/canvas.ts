/**
 * Data structure for canvas nodes.
 * Represents a component or service in the system architecture.
 */
export interface CanvasNodeData extends Record<string, unknown> {
  /** Display label for the node */
  label: string;
  /** Node color for visual identification */
  color: string;
  /** Node shape (rectangle, circle, etc.) */
  shape: "rectangle" | "circle" | "diamond";
}

/**
 * Initial empty state for the canvas.
 */
export const initialCanvasState = {
  nodes: [],
  edges: [],
};