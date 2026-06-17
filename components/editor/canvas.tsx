"use client";

import { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  ReactFlowProvider,
  BackgroundVariant,
  type Node,
  type ReactFlowInstance,
  type NodeChange,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { Cursors } from "@liveblocks/react-flow";
import { ShapePanel, type ShapeType } from "@/components/editor/shape-panel";
import { nodeTypes } from "@/components/editor/custom-node";

/**
 * Properties for the Canvas component
 */
interface CanvasProps {
  /** The project ID used to derive the Liveblocks room */
  projectId: string;
}

/**
 * Shape payload from drag event
 */
interface ShapePayload {
  shape: ShapeType;
  width: number;
  height: number;
}

/**
 * Counter for generating unique node IDs
 */
let nodeIdCounter = 0;

/**
 * Generate a unique node ID
 */
function generateNodeId(shape: string): string {
  const timestamp = Date.now();
  nodeIdCounter++;
  return `${shape}-${timestamp}-${nodeIdCounter}`;
}

/**
 * Inner canvas component that has access to Liveblocks context
 */
function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Local state for React Flow nodes and edges
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<unknown[]>([]);

  // Handle changes from React Flow
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    []
  );

  const onEdgesChange = useCallback(() => {
    // Placeholder for edge changes
  }, []);

  const onConnect = useCallback(() => {
    // Placeholder for connections
  }, []);

  const onDelete = useCallback(() => {
    // Placeholder for deletion
  }, []);

  // Handle drag over the canvas
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // Handle drop on the canvas
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const payload = event.dataTransfer.getData("application/x-ghost-canvas");
      if (!payload) return;

      let shapeData: ShapePayload;
      try {
        shapeData = JSON.parse(payload);
      } catch {
        return;
      }

      // Convert screen position to canvas coordinates
      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      // Create new node with shape data
      const newNode: Node = {
        id: generateNodeId(shapeData.shape),
        type: "canvasNode",
        position,
        data: {
          label: "",
          color: "#6366f1",
          shape: shapeData.shape,
        },
      };

      // Add node to local state
      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  return (
    <div
      className="relative h-full w-full"
      ref={reactFlowWrapper}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges as never}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange as never}
        onConnect={onConnect as never}
        onDelete={onDelete as never}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-bg-surface"
      >
        <Cursors />
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="var(--color-border-default)"
        />
        <MiniMap
          nodeColor="#6366f1"
          maskColor="rgb(0, 0, 0, 0.1)"
          className="!bg-bg-surface"
        />
      </ReactFlow>

      {/* Shape panel toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <ShapePanel />
      </div>
    </div>
  );
}

/**
 * Loading fallback component
 */
function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-accent-primary" />
        <p className="text-sm text-text-muted">Loading canvas...</p>
      </div>
    </div>
  );
}

/**
 * The main Canvas component with Liveblocks and React Flow integration.
 * This replaces the placeholder canvas with a collaborative canvas.
 */
export function Canvas({ projectId }: CanvasProps) {
  const roomId = `project:${projectId}`;

  return (
    <LiveblocksProvider
      authEndpoint={async () => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        if (!response.ok) {
          throw new Error("Failed to authenticate with Liveblocks");
        }
        return response.json();
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          isThinking: false,
        }}
      >
        <ReactFlowProvider>
          <ClientSideSuspense fallback={<Loading />}>
            {() => <CanvasInner />}
          </ClientSideSuspense>
        </ReactFlowProvider>
      </RoomProvider>
    </LiveblocksProvider>
  );
}