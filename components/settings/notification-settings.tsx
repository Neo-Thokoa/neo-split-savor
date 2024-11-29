"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    expenseAlerts: true,
    budgetReminders: true,
    groupUpdates: true,
  });

  async function handleSave() {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications and updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="text-sm text-muted-foreground">
              Receive updates via email
            </span>
          </Label>
          <Switch
            id="email-notifications"
            checked={settings.emailNotifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, emailNotifications: checked }))
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="expense-alerts" className="flex flex-col space-y-1">
            <span>Expense Alerts</span>
            <span className="text-sm text-muted-foreground">
              Get notified when new expenses are added
            </span>
          </Label>
          <Switch
            id="expense-alerts"
            checked={settings.expenseAlerts}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, expenseAlerts: checked }))
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="budget-reminders" className="flex flex-col space-y-1">
            <span>Budget Reminders</span>
            <span className="text-sm text-muted-foreground">
              Receive alerts when approaching budget limits
            </span>
          </Label>
          <Switch
            id="budget-reminders"
            checked={settings.budgetReminders}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, budgetReminders: checked }))
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="group-updates" className="flex flex-col space-y-1">
            <span>Group Updates</span>
            <span className="text-sm text-muted-foreground">
              Get notified about group activity and changes
            </span>
          </Label>
          <Switch
            id="group-updates"
            checked={settings.groupUpdates}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, groupUpdates: checked }))
            }
            disabled={isLoading}
          />
        </div>

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}