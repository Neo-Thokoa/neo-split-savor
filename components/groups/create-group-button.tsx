"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateGroupDialog } from "./create-group-dialog";

export function CreateGroupButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Group
      </Button>
      <CreateGroupDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}