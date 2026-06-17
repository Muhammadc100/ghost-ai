# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- None (complete)

## Current Goal

- None

## Completed

- (Previous: Shape Panel)
- Created components/editor/shape-panel.tsx with draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon)
- Created components/editor/custom-node.tsx with CanvasNode component for rendering
- Updated canvas.tsx with drag-and-drop handling for creating new nodes
- Added ShapePanel toolbar at bottom-center of canvas
- Build passes
- (Previous: Base Canvas)
- Created types/canvas.ts with CanvasNodeData interface (label, color, shape)
- Created components/editor/canvas.tsx with LiveblocksProvider, RoomProvider, ClientSideSuspense
- Integrated useLiveblocksFlow from @liveblocks/react-flow
- Added ReactFlow with Background (dots), MiniMap, Cursors, fitView
- Updated editor-workspace-client.tsx to use the Canvas component
- Build passes
- (Previous: Liveblocks Setup)
- Updated liveblocks.config.ts with Presence (cursor, isThinking) and UserMeta (name, avatar, cursorColor)
- Created lib/liveblocks.ts with cached client, getCursorColor() helper, and getRoomId() helper
- Created POST /api/liveblocks-auth route with Clerk auth, project access verification, and room creation
- Added LIVEBLOCKS_SECRET_KEY and NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY to .env.local
- Build passes
- (Previous: Share Dialog)
- Fixed editor workspace client wiring to match current project action hook and dialog props
- Created API route: GET /api/projects/[projectId]/collaborators - lists collaborators with Clerk enrichment
- Created API route: POST /api/projects/[projectId]/collaborators - invite by email (owner only)
- Created API route: DELETE /api/projects/[projectId]/collaborators - remove collaborator (owner only)
- Created lib/clerk.ts with getClerkUserByEmail() for Clerk user enrichment
- Created lib/collaborators.ts with getEnrichedCollaborators() server helper
- Created components/editor/share-dialog.tsx with:
  - Copy project link with "Copied!" feedback
  - Invite by email (owners only)
  - View/remove collaborators (owners only)
  - Read-only view for collaborators
  - Clerk name/avatar enrichment when available
- Updated workspace-client.tsx with share dialog integration
- Build passes
- (Previous: Workspace Editor)
- Created lib/project-access.ts with getCurrentUser() and getProjectWithAccess() helpers
- Created components/editor/access-denied.tsx with centered layout, lock icon, message, and link to /editor
- Created app/editor/[projectId]/page.tsx as server component with access checks
- Unauthenticated users redirect to /sign-in
- Non-existent or unauthorized projects show AccessDenied
- Created workspace-client.tsx with full-viewport layout
- Created workspace-sidebar.tsx that shows projects and highlights current one
- Workspace navbar shows project name, share button, and AI chat toggle
- Canvas placeholder with dark background and centered message
- Right sidebar placeholder for future AI chat
- Build passes with no TypeScript errors
- (Previous: Project APIs)
- Wired editor home sidebar and dialogs to real project API
- Created lib/data.ts with getProjects() for server-side data fetching
- Created useProjectActions hook with API integration (POST/PATCH/DELETE)
- Create dialog generates unique slug suffix, calls POST /api/projects, navigates to workspace
- Rename dialog pre-fills current name, calls PATCH /api/projects/[id], updates state on success
- Delete dialog calls DELETE /api/projects/[id], redirects to /editor if deleting active workspace
- Editor page is now server component that fetches data and passes to client component
- Build passes
- (Previous: Authentication with Clerk)
- Created Project API routes: GET/POST /api/projects, PATCH/DELETE /api/projects/[projectId]
- Owner checks enforced for rename/delete (403 for non-owners)
- Unauthenticated requests return 401
- Build passes with API routes
- Created prisma/schema.prisma with Project and ProjectCollaborator models
- Added ProjectStatus enum (DRAFT, ARCHIVED)
- Created lib/prisma.ts with cached singleton (uses PostgreSQL driver adapter)
- Created Prisma Postgres database via create-db CLI
- Ran initial migration (prisma/migrations/20260603150550_init)
- Generated Prisma client to app/generated/prisma
- Build passes with Prisma integration
- Installed and configured shadcn/ui
- Added UI components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- Installed lucide-react
- Created lib/utils.ts with cn() helper
- Configured dark-only theme in globals.css
- Created EditorNavbar component (components/editor/editor-navbar.tsx)
- Created ProjectSidebar component (components/editor/project-sidebar.tsx)
- Dialog pattern ready (uses existing shadcn Dialog with custom color tokens)
- Installed @clerk/ui
- Created proxy.ts for route protection
- Wrapped root layout with ClerkProvider using dark theme
- Created sign-in page (app/sign-in/page.tsx) with two-panel layout
- Created sign-up page (app/sign-up/page.tsx) with two-panel layout
- Added auth redirect in root page (/ → /editor if authenticated, /sign-in if not)
- Added UserButton to EditorNavbar
- Created editor page (app/editor/page.tsx) with navbar and sidebar
- Build passes
- Editor home screen with heading, description, and New Project button
- Created useProjectDialogs hook for managing dialog/form/loading state
- Create Project dialog with name input and live slug preview
- Rename Project dialog with auto-focus and Enter submission
- Delete Project dialog with destructive confirmation
- Sidebar project items with rename/delete actions (owned projects only)
- Sidebar hides actions for shared projects
- Mobile backdrop closes sidebar on tap

## In Progress

- None.

## Next Up

- Implement canvas functionality with React Flow (nodes, edges, drag/drop)

## Open Questions

- None.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.
