import { z } from "zod";
export const statuses = ["Planning", "Active", "Completed"] as const;
export const projectInput = z
  .object({
    name: z.string().trim().min(2).max(80),
    client: z.string().trim().min(2).max(80),
    status: z.enum(statuses),
    budget: z.number().int().min(0).max(100000000),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine(
        (s) =>
          !Number.isNaN(Date.parse(s)) &&
          new Date(s).toISOString().slice(0, 10) === s,
        "Enter a valid date",
      ),
    notes: z.string().trim().max(2000).default(""),
  })
  .strict();
export type WorkProject = {
  id: string;
  name: string;
  client: string;
  status: (typeof statuses)[number];
  budget: number;
  dueDate: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
};
export const sampleProjects: WorkProject[] = [
  {
    id: "sample-1",
    name: "Studio website",
    client: "Fictional · Auren Studio",
    status: "Active",
    budget: 240000,
    dueDate: "2026-11-15",
    notes: "Responsive business website and enquiry experience.",
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: "sample-2",
    name: "Shop experience",
    client: "Fictional · Form Supply",
    status: "Active",
    budget: 380000,
    dueDate: "2026-11-28",
    notes: "Catalog, product pages and simulated checkout.",
    createdAt: 2,
    updatedAt: 2,
  },
  {
    id: "sample-3",
    name: "Brand landing page",
    client: "Fictional · North & Co.",
    status: "Planning",
    budget: 150000,
    dueDate: "2026-12-10",
    notes: "A single-page concept for a fictional brand.",
    createdAt: 3,
    updatedAt: 3,
  },
  {
    id: "sample-4",
    name: "Workspace prototype",
    client: "Personal · Orbit",
    status: "Completed",
    budget: 0,
    dueDate: "2026-10-01",
    notes: "Internal study project with no commercial revenue.",
    createdAt: 4,
    updatedAt: 4,
  },
];
export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(cents / 100);
