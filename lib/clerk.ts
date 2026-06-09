import { clerkClient } from "@clerk/nextjs/server";

interface ClerkUserInfo {
  name: string | null;
  imageUrl: string | null;
}

/**
 * Look up a Clerk user by email address.
 * Returns the user's name and avatar if found, null otherwise.
 */
export async function getClerkUserByEmail(email: string): Promise<ClerkUserInfo | null> {
  try {
    const client = await clerkClient();

    // Search for users by email using the Clerk backend API
    const users = await client.users.getUserList({
      emailAddress: [email],
      limit: 1,
    });

    if (users.data.length === 0) {
      return null;
    }

    const user = users.data[0];
    return {
      name: user.fullName ?? user.username ?? user.firstName ?? null,
      imageUrl: user.imageUrl ?? null,
    };
  } catch {
    // If Clerk API fails or user not found, return null
    return null;
  }
}