"use client";

import { useEffect, useState } from "react";
import { GroupCard } from "./group-card";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { useToast } from "@/hooks/use-toast";

interface Member {
  name: string;
  budget: number;
  spent: number;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  totalExpenses: number;
  members?: Member[];
}

export function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch("/api/groups");
        if (!response.ok) throw new Error("Failed to fetch groups");
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load groups",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (groups.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="group" />
        <EmptyPlaceholder.Title>No groups created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You haven&apos;t created any groups yet. Start by creating your first group.
        </EmptyPlaceholder.Description>
      </EmptyPlaceholder>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}