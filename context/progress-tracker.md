# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Database (Prisma)

## Current Goal

- Set up Prisma with Project models, Prisma client singleton, and first migration

## Completed

- (Previous: Authentication with Clerk)
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

- Add canvas and node rendering components

## Open Questions

- None.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Add context needed to resume work in the next session.