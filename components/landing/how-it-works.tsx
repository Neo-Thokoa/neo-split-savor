import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const steps = [
  {
    title: "Create a Group",
    description: "Start by creating a group and inviting your friends to join."
  },
  {
    title: "Add Expenses",
    description: "Add expenses as they happen. We'll keep track of who paid what."
  },
  {
    title: "Split Automatically",
    description: "Expenses are automatically split based on your preferences."
  },
  {
    title: "Settle Up",
    description: "See balances at a glance and settle up with ease."
  }
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 relative">
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2 mt-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}