import { database } from "@/db/raw";
import { body, fail, HttpError, json } from "@/lib/http";
import { projectInput } from "@/lib/orbit";
import { requireOwner } from "@/lib/orbit-server";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const owner = await requireOwner();
    const { id } = await params;
    const parsed = projectInput.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        400,
        parsed.error.issues.map((i) => i.message).join(" "),
      );
    const p = parsed.data;
    const result = await database()
      .prepare(
        "UPDATE work_projects SET name=?,client=?,status=?,budget=?,due_date=?,notes=?,updated_at=? WHERE id=? AND owner_id=?",
      )
      .bind(
        p.name,
        p.client,
        p.status,
        p.budget,
        p.dueDate,
        p.notes,
        Date.now(),
        id,
        owner,
      )
      .run();
    if (!result.meta.changes) throw new HttpError(404, "Project not found.");
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const owner = await requireOwner();
    await body(request);
    const { id } = await params;
    const result = await database()
      .prepare("DELETE FROM work_projects WHERE id=? AND owner_id=?")
      .bind(id, owner)
      .run();
    if (!result.meta.changes) throw new HttpError(404, "Project not found.");
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
