import { z } from "zod";
import bcrypt from "bcryptjs";

// Schema definitions
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  image: z.string().optional(),
  budget: z.number().default(800),
});

export const expenseSchema = z.object({
  id: z.string(),
  title: z.string(),
  amount: z.number(),
  description: z.string().optional(),
  paidBy: z.string(),
  date: z.string(),
  splitType: z.enum(["EQUAL", "PERCENTAGE", "EXACT"]),
  participants: z.array(z.object({
    userId: z.string(),
    amount: z.number(),
    isPaid: z.boolean().default(false),
  })),
});

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  members: z.array(userSchema),
  expenses: z.array(expenseSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Group = z.infer<typeof groupSchema>;
export type Expense = z.infer<typeof expenseSchema>;

// Initialize default data
const defaultMembers = [
  { id: "1", name: "Neo Thokoa", email: "neo@example.com", budget: 800 },
  { id: "2", name: "Lizzy Strydom", email: "lizzy@example.com", budget: 800 },
  { id: "3", name: "Jason Klaaste", email: "jason@example.com", budget: 800 },
  { id: "4", name: "Zakes Manyoni", email: "zakes@example.com", budget: 800 },
  { id: "5", name: "Kenny Madi", email: "kenny@example.com", budget: 800 },
  { id: "6", name: "Tolu Adesina", email: "tolu@example.com", budget: 800 },
  { id: "7", name: "Jon-Felipe Rodriguez", email: "jon@example.com", budget: 800 },
  { id: "8", name: "Innocent Munyadziwa", email: "innocent@example.com", budget: 800 },
  { id: "9", name: "Masekhanyane Moeketsi", email: "masekhanyane@example.com", budget: 800 },
  { id: "10", name: "Alex Chassay", email: "alex@example.com", budget: 800 },
];

const defaultGroup: Group = {
  id: "1",
  name: "Weekend Getaway",
  description: "Group weekend trip to Cape Town",
  members: defaultMembers,
  expenses: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Storage service
export const storage = {
  initialize() {
    if (typeof window === "undefined") return;
    
    const groups = localStorage.getItem("groups");
    if (!groups) {
      localStorage.setItem("groups", JSON.stringify([defaultGroup]));
    }

    const users = localStorage.getItem("users");
    if (!users) {
      localStorage.setItem("users", JSON.stringify(defaultMembers));
    }
  },

  getUsers(): User[] {
    if (typeof window === "undefined") return defaultMembers;
    
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : defaultMembers;
  },

  getGroups(): Group[] {
    if (typeof window === "undefined") return [defaultGroup];
    
    const groups = localStorage.getItem("groups");
    return groups ? JSON.parse(groups) : [defaultGroup];
  },

  getGroup(id: string): Group | undefined {
    const groups = this.getGroups();
    return groups.find(group => group.id === id);
  },

  addExpense(groupId: string, expense: Omit<Expense, "id">) {
    const groups = this.getGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) return false;

    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substr(2, 9),
    };

    groups[groupIndex].expenses.push(newExpense);
    groups[groupIndex].updatedAt = new Date().toISOString();

    // Update member budgets
    const updatedMembers = groups[groupIndex].members.map(member => {
      const participation = newExpense.participants.find(p => p.userId === member.id);
      if (participation) {
        return {
          ...member,
          budget: member.budget - participation.amount
        };
      }
      return member;
    });

    groups[groupIndex].members = updatedMembers;
    
    localStorage.setItem("groups", JSON.stringify(groups));
    return true;
  },

  deleteExpense(groupId: string, expenseId: string) {
    const groups = this.getGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);
    
    if (groupIndex === -1) return false;

    const expense = groups[groupIndex].expenses.find(e => e.id === expenseId);
    if (!expense) return false;

    // Refund the expense amounts to member budgets
    const updatedMembers = groups[groupIndex].members.map(member => {
      const participation = expense.participants.find(p => p.userId === member.id);
      if (participation) {
        return {
          ...member,
          budget: member.budget + participation.amount
        };
      }
      return member;
    });

    groups[groupIndex].members = updatedMembers;
    groups[groupIndex].expenses = groups[groupIndex].expenses.filter(e => e.id !== expenseId);
    groups[groupIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem("groups", JSON.stringify(groups));
    return true;
  },

  createGroup(group: Omit<Group, "id" | "createdAt" | "updatedAt" | "expenses">) {
    const groups = this.getGroups();
    const newGroup: Group = {
      ...group,
      id: Math.random().toString(36).substr(2, 9),
      expenses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    groups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(groups));
    return newGroup;
  },

  async createUser(userData: { email: string; password: string; name?: string }) {
    const users = this.getUsers();
    const exists = users.find(u => u.email === userData.email);
    
    if (exists) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name || userData.email.split("@")[0],
      password: hashedPassword,
      budget: 800,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
  },
};