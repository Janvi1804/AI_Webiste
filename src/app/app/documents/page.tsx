import { ResourceWorkspace } from "@/components/workspace/resource-workspace";
export default function Page(){ return <ResourceWorkspace resource="documents" />; }
import { redirect } from "next/navigation";
export default function DocumentsPage(){ redirect("/app"); }
