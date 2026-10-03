import { database } from "@/db/raw";
import { body, fail, HttpError, json } from "@/lib/http";
import { projectInput } from "@/lib/orbit";
import { listProjects, requireOwner } from "@/lib/orbit-server";
export async function GET() {
  try {
    return json({ projects: await listProjects(await requireOwner()) });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(request: Request) {
  try {
    const owner = await requireOwner();
    const parsed = projectInput.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        400,
        parsed.error.issues.map((i) => i.message).join(" "),
      );
    const p = parsed.data;
    const id = crypto.randomUUID();
    const now = Date.now();
    const result = await database()
      .prepare(
        "INSERT INTO work_projects(id,owner_id,name,client,status,budget,due_date,notes,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM work_projects WHERE owner_id=?) < 100",
      )
      .bind(
        id,
        owner,
        p.name,
        p.client,
        p.status,
        p.budget,
        p.dueDate,
        p.notes,
        now,
        now,
        owner,
      )
      .run();
    if (!result.meta.changes)
      throw new HttpError(
        409,
        "Demo limit reached: 100 projects per workspace.",
      );
    return json({ project: { id, ...p, createdAt: now, updatedAt: now } }, 201);
  } catch (e) {
    return fail(e);
  }
}
