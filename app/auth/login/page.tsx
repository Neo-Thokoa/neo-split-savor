import { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { WalletCards } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - SplitSavor Savy",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <WalletCards className="h-8 w-8" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      <AuthForm type="login" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/auth/register"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </div>
  );
}