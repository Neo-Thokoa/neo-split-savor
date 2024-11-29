import { Card } from "@/components/ui/card";
import { 
  Clock, 
  SplitSquareVertical, 
  CreditCard, 
  Users, 
  Shield, 
  Smartphone 
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Track expenses as they happen with instant updates for all group members."
  },
  {
    icon: SplitSquareVertical,
    title: "Smart Splitting",
    description: "Split bills equally or customize amounts for each person."
  },
  {
    icon: CreditCard,
    title: "Instant Settlement",
    description: "See who owes what and settle up with just a few taps."
  },
  {
    icon: Users,
    title: "Group Management",
    description: "Create and manage multiple groups for different occasions."
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Your financial data is encrypted and secure."
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access your expenses anywhere, anytime on any device."
  }
];

export function FeatureSection() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to manage group expenses
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}