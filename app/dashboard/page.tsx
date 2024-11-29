"use client";

import { useEffect } from "react";
import { GroupList } from "@/components/groups/group-list";
import { CreateGroupButton } from "@/components/groups/create-group-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { toast } = useToast();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Groups"
        text="Create and manage your expense sharing groups."
      >
        <CreateGroupButton />
      </DashboardHeader>
      <div className="grid gap-8">
        <GroupList />
      </div>
    </DashboardShell>
  );
}