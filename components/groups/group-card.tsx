import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Receipt, Wallet } from "lucide-react";

interface Member {
  name: string;
  budget: number;
  spent: number;
}

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string;
    memberCount: number;
    totalExpenses: number;
    members?: Member[];
  };
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{group.name}</h3>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            <span>{group.memberCount}</span>
          </div>
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground">{group.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Receipt className="mr-1 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Budget</span>
          </div>
          <span className="font-medium">
            R{(group.memberCount * 800).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="mr-1 h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Per Person</span>
          </div>
          <span className="font-medium">R800.00</span>
        </div>
        {group.members && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Members:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {group.members.map((member, index) => (
                <div key={index} className="text-sm flex justify-between">
                  <span>{member.name}</span>
                  <span className="text-muted-foreground">R{member.budget}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button asChild className="w-full">
            <Link href={`/groups/${group.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}