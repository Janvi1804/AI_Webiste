export const workspaceModules = ["projects", "tasks", "customers", "leads", "meetings", "documents", "support_requests"] as const;
export type WorkspaceModule = (typeof workspaceModules)[number];
export type WorkspaceRecord = { id:string; name?:string; title?:string; subject?:string; status?:string; stage?:string; created_at:string; [key:string]:unknown };
