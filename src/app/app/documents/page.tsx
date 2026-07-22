import { ResourceWorkspace } from "@/components/workspace/resource-workspace";

/** Documents has a single route export; do not combine this with the former redirect page. */
export default function DocumentsPage() {
  return <ResourceWorkspace resource="documents" />;
}
