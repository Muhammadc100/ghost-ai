import { Liveblocks } from "@liveblocks/node";
import { cache } from "react";

// Cursor color palette - consistent colors for user cursors
const CURSOR_COLORS = [
  "#F87171", // Red
  "#FB923C", // Orange
  "#FBBF24", // Amber
  "#A3E635", // Lime
  "#4ADE80", // Green
  "#2DD4BF", // Teal
  "#38BDF8", // Sky
  "#818CF8", // Indigo
  "#C084FC", // Purple
  "#F472B6", // Pink
];

/**
 * Maps a user ID to a consistent cursor color from the fixed palette.
 * Uses a simple hash to deterministically pick a color.
 */
export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index];
}

/**
 * Creates a new Liveblocks node client.
 * This should be used server-side for auth and room management.
 */
function createLiveblocksClient() {
  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secretKey) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set");
  }

  return new Liveblocks({
    secret: secretKey,
  });
}

/**
 * Cached singleton instance of the Liveblocks client.
 * This ensures we don't create multiple client instances.
 */
const getCachedClient = cache(() => {
  return createLiveblocksClient();
});

/**
 * Get the Liveblocks client instance.
 * Use this for server-side operations (auth, room management).
 */
export function getLiveblocksClient() {
  return getCachedClient();
}

/**
 * Create a Liveblocks room ID from a project ID.
 * Room IDs follow the pattern: project:{projectId}
 */
export function getRoomId(projectId: string): string {
  return `project:${projectId}`;
}