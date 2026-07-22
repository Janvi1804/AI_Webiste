export const workspaceModules = ["projects", "tasks", "customers", "leads", "meetings"] as const;
export type WorkspaceModule = (typeof workspaceModules)[number];
export type Project = { id:string; name:string; client:string|null; description:string|null; status:string; start_date:string|null; due_date:string|null; budget:number|null; progress:number; priority:string; archived_at:string|null; created_at:string };
export type Task = { id:string; title:string; project_id:string|null; assignee_id:string|null; due_date:string|null; status:string; priority:string; description:string|null; labels:string[]; completed_at:string|null; created_at:string };
export type Customer = { id:string; name:string; company:string|null; email:string|null; phone:string|null; tags:string[]; notes:string|null; assigned_owner_id:string|null; created_at:string };
export type Lead = { id:string; name:string; company:string|null; email:string|null; phone:string|null; stage:string; source:string|null; notes:string|null; assigned_owner_id:string|null; estimated_value:number|null; follow_up_date:string|null; tags:string[]; created_at:string };
export type WorkspaceRecords = { projects:Project[]; tasks:Task[]; customers:Customer[]; leads:Lead[] };
