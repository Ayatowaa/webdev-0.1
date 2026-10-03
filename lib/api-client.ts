import { z } from "zod";
const errorSchema = z.object({ error: z.string() });
export async function readResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  const data: unknown = await response.json();
  if (!response.ok) {
    const error = errorSchema.safeParse(data);
    throw new Error(
      error.success ? error.data.error : "The request could not be completed.",
    );
  }
  return schema.parse(data);
}
export const okResponse = z.object({ ok: z.boolean() });
export const mutationResponse = z.object({
  project: z.unknown().optional(),
  ok: z.boolean().optional(),
});
export const cartResponse = z.object({
  items: z.array(
    z.object({ productId: z.string(), quantity: z.number().int().positive() }),
  ),
  total: z.number().int().nonnegative(),
});
export const orderResponse = z.object({
  order: z.object({ id: z.string(), total: z.number().int().nonnegative() }),
  simulated: z.literal(true),
});
export const projectsResponse = z.object({
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      client: z.string(),
      status: z.enum(["Planning", "Active", "Completed"]),
      budget: z.number(),
      dueDate: z.string(),
      notes: z.string(),
      createdAt: z.number(),
      updatedAt: z.number(),
    }),
  ),
});
