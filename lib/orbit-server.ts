import { getChatGPTUser } from "@/app/chatgpt-auth";
import { database } from "@/db/raw";
import { HttpError } from "./http";
export async function requireOwner() {
  const user = await getChatGPTUser();
  if (!user) throw new HttpError(401, "Sign in to access your workspace.");
  return user.userId;
}
export async function listProjects(owner: string) {
  return (
    await database()
      .prepare(
        "SELECT id,name,client,status,budget,due_date AS dueDate,notes,created_at AS createdAt,updated_at AS updatedAt FROM work_projects WHERE owner_id = ? ORDER BY created_at DESC",
      )
      .bind(owner)
      .all()
  ).results;
}
