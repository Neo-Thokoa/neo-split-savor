import { GroupPage } from "@/components/groups/group-page";
import { storage } from "@/lib/storage";

// This is required for static site generation with dynamic routes
export function generateStaticParams() {
  // Get all group IDs for static generation
  if (typeof window === "undefined") {
    return [{ groupId: "1" }]; // Default group
  }
  const groups = storage.getGroups();
  return groups.map((group) => ({
    groupId: group.id,
  }));
}

export default function GroupPageRoute({ params }: { params: { groupId: string } }) {
  return <GroupPage groupId={params.groupId} />;
}