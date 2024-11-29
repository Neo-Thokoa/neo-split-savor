import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { WalletCards } from "lucide-react";

export const metadata: Metadata = {
  title: "Create an account - SplitSavor Savy",
  description: "Create an account to get started",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <WalletCards className="h-8 w-8" />
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <AuthForm type="register" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Already have an account? Sign In
        </Link>
      </p>
    </div>
  );
}