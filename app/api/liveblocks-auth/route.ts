import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getLiveblocksClient, getCursorColor, getRoomId } from "@/lib/liveblocks";
import { getCurrentProjectIdentity, userHasProjectAccess } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/liveblocks-auth
 *
 * Authenticate and authorize a user for a Liveblocks room.
 * Uses the project ID as the room identifier.
 *
 * Expected body:
 * {
 *   "projectId": "project-uuid"
 * }
 *
 * Returns:
 * - 200 with session token on success
 * - 401 if not authenticated
 * - 403 if no access to project
 * - 400 if missing projectId
 */
export async function POST(request: NextRequest) {
  // 1. Require Clerk authentication
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Get the current user's Clerk data
  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 3. Parse and validate request body
  let body: { projectId?: string };
  try {
    body = await request.json();
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const { projectId } = body;
  if (!projectId) {
    return new NextResponse("Missing projectId", { status: 400 });
  }

  // 4. Verify project access using the existing access helper
  const identity = await getCurrentProjectIdentity();
  const hasAccess = await userHasProjectAccess(projectId, identity);
  if (!hasAccess) {
    return new NextResponse("Forbidden - no access to project", { status: 403 });
  }

  // 5. Get the project name for room metadata
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  });

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  // 6. Get the Liveblocks client
  let liveblocks;
  try {
    liveblocks = getLiveblocksClient();
  } catch (error) {
    console.error("Liveblocks client error:", error);
    return new NextResponse(
      `Liveblocks configuration error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }

  // 7. Get or create the room
  const roomId = getRoomId(projectId);

  // Try to get the room, but don't fail if it doesn't exist
  // We'll create it if needed
  let roomExists = false;
  try {
    const room = await liveblocks.getRoom(roomId);
    roomExists = !!room;
  } catch (error) {
    // Room doesn't exist yet - we'll create it
    console.log("Room does not exist, will create:", roomId);
  }

  if (!roomExists) {
    try {
      await liveblocks.createRoom(roomId, {
        metadata: {
          projectId: projectId,
          projectName: project.name,
        },
        // No default access - all access is controlled via session.allow()
        defaultAccesses: [],
      });
      console.log("Created room:", roomId);
    } catch (error) {
      console.error("Error creating room:", error);
      return new NextResponse(
        `Error creating room: ${error instanceof Error ? error.message : "Unknown error"}`,
        { status: 500 }
      );
    }
  }

  // 8. Prepare the session with user info
  const cursorColor = getCursorColor(userId);
  const userInfo = {
    name: user.fullName || user.username || user.emailAddresses[0]?.emailAddress || "Anonymous",
    avatar: user.imageUrl || "",
    cursorColor: cursorColor,
  };

  const session = liveblocks.prepareSession(userId, {
    userInfo: userInfo,
  });

  // 9. Allow access to this specific project room
  // Using the exact room ID for access control
  session.allow(roomId, session.FULL_ACCESS);

  // 10. Authorize and return the session token
  let authResult;
  try {
    authResult = await session.authorize();
  } catch (error) {
    console.error("Authorization error:", error);
    return new NextResponse(
      `Authorization error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }

  const { status, body: responseBody } = authResult;

  return new NextResponse(responseBody, { status });
}