export const demoWorkspaceId = process.env.NEXT_PUBLIC_DEMO_WORKSPACE_ID ?? process.env.VITE_DEMO_WORKSPACE_ID ?? "00000000-0000-4000-8000-000000000001";
export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || process.env.VITE_DEMO_MODE === "true";
