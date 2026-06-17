// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Cursor position for real-time cursors
      cursor: { x: number; y: number } | null;
      // Whether the user is thinking (e.g., AI is generating)
      isThinking: boolean;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // We'll add storage types when implementing canvas
      // Example: nodes and edges for React Flow
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // User display name
        name: string;
        // User avatar URL
        avatar: string;
        // Cursor color for this user
        cursorColor: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {
      // Events for canvas interactions
    };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Thread metadata if needed
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Room info for the project
    };
  }
}

export {};