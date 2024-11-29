"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function ErrorCard() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errors: { [key: string]: string } = {
    default: "An error occurred. Please try again.",
    configuration: "There is a problem with the server configuration.",
    accessdenied: "You do not have permission to sign in.",
    verification: "The verification code has expired or has already been used.",
  };

  const errorMessage = error && error in errors ? errors[error] : errors.default;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Authentication Error</CardTitle>
        </div>
        <CardDescription>There was a problem signing you in.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      </CardContent>
    </Card>
  );
}