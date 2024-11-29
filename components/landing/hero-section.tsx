"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WalletCards, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center space-y-8 py-20"
    >
      <div className="flex items-center space-x-2">
        <WalletCards className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
          SplitSavor Savy
        </h1>
      </div>
      
      <p className="max-w-[600px] text-muted-foreground text-lg sm:text-xl">
        Split expenses with friends effortlessly. Track group spending, manage budgets, 
        and settle up with ease.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[600px]">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button size="lg" className="w-full group">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="pt-8">
        <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          Learn more about our features →
        </Link>
      </div>
    </motion.div>
  );
}