"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  readResponse,
  projectsResponse,
  mutationResponse,
} from "@/lib/api-client";
import {
  Orbit,
  Plus,
  Search,
  Pencil,
  Trash2,
  FolderKanban,
  Wallet,
  CheckCircle2,
  Clock3,
  Layers3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { sampleProjects, statuses, money, type WorkProject } from "@/lib/orbit";
import { useWebTool } from "@/lib/webmcp";
const blank = {
  name: "",
  client: "",
  status: "Planning" as WorkProject["status"],
  budget: "0",
  dueDate: "",
  notes: "",
};
export function Dashboard({
  preview,
  userName,
  loginUrl,
  logoutUrl,
}: {
  preview: boolean;
  userName?: string;
  loginUrl: string;
  logoutUrl: string;
}) {
  const [items, setItems] = useState<WorkProject[]>(
    preview ? sampleProjects : [],
  );
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<WorkProject | null>(null);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/orbit/projects");
      const d = await readResponse(r, projectsResponse);
      setItems(d.projects);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!preview) void load();
  }, [preview, load]);
  const filtered = items.filter(
    (p) =>
      (status === "All" || p.status === status) &&
      `${p.name} ${p.client}`.toLowerCase().includes(search.toLowerCase()),
  );
  const stats = {
    total: items.length,
    active: items.filter((p) => p.status === "Active").length,
    completed: items.filter((p) => p.status === "Completed").length,
    budget: items.reduce((n, p) => n + p.budget, 0),
  };
  useWebTool(
    useMemo(
      () => ({
        name: "read_visible_projects",
        description:
          "Read the projects currently visible in the Orbit table without modifying data.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute: (input: unknown) => {
          if (!input || typeof input !== "object" || Object.keys(input).length)
            throw new Error("Expected an empty object");
          return {
            preview,
            projects: filtered.map(({ id, name, status, budget }) => ({
              id,
              name,
              status,
              budgetCents: budget,
            })),
          };
        },
      }),
      [filtered, preview],
    ),
  );
  function openProject(p?: WorkProject) {
    if (preview) return;
    setEditing(p?.id ?? null);
    setForm(
      p
        ? {
            name: p.name,
            client: p.client,
            status: p.status,
            budget: String(p.budget / 100),
            dueDate: p.dueDate,
            notes: p.notes,
          }
        : blank,
    );
    setFormError("");
    setModal(true);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setFormError("");
    try {
      const r = await fetch(
        editing ? `/api/orbit/projects/${editing}` : "/api/orbit/projects",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            budget: Math.round(Number(form.budget) * 100),
          }),
        },
      );
      await readResponse(r, mutationResponse);
      setModal(false);
      setNotice(editing ? "Project updated." : "Project created.");
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save project.");
    } finally {
      setSaving(false);
    }
  }
  async function remove() {
    if (!deleting || saving) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/orbit/projects/${deleting.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      await readResponse(r, mutationResponse);
      setDeleting(null);
      setNotice("Project deleted.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete project.");
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }
  return (
    <>
      <header className="orbit-top wrap">
        <a href="/demos/orbit" className="orbit-brand">
          <Orbit />
          orbit
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "#687795",
              letterSpacing: 0,
            }}
          >
            workspace
          </span>
        </a>
        <nav aria-label="Workspace navigation">
          <a href="/demos/orbit" aria-current={preview ? "page" : undefined}>
            Overview demo
          </a>
          <a
            href="/demos/orbit/workspace"
            aria-current={!preview ? "page" : undefined}
          >
            My workspace
          </a>
        </nav>
        <a
          className="button ghost"
          style={{ color: "#315ee8", borderColor: "#cfdbf5", fontSize: 12 }}
          href="/"
        >
          Portfolio
        </a>
      </header>
      <main id="main" className="orbit-content wrap">
        <div className="orbit-heading">
          <div>
            <p className="eyebrow">PROJECT MANAGEMENT</p>
            <h1>
              A little clarity.
              <br className="sr-only" /> A lot of progress.
            </h1>
            <p>
              {preview
                ? "A snapshot of a fictional creative workspace."
                : "Your projects, priorities and next steps."}
            </p>
          </div>
          {preview ? (
            <a
              className="button blue"
              href={userName ? "/demos/orbit/workspace" : loginUrl}
              target={userName ? undefined : "_top"}
            >
              <Plus size={16} />
              Create a project
            </a>
          ) : (
            <button className="button blue" onClick={() => openProject()}>
              <Plus size={16} />
              New project
            </button>
          )}
        </div>
        {preview && (
          <aside className="orbit-notice">
            <p>
              Sample workspace · All projects and amounts below are fictional.
            </p>
            <a
              href={userName ? "/demos/orbit/workspace" : loginUrl}
              target={userName ? undefined : "_top"}
            >
              {userName ? "Open my workspace" : "Try your own workspace"}
            </a>
          </aside>
        )}
        {error && (
          <div role="alert" className="error-message">
            {error}{" "}
            <button className="text-button" onClick={() => void load()}>
              Try again
            </button>
          </div>
        )}
        {notice && (
          <p role="status" className="feedback" style={{ marginBottom: 20 }}>
            {notice}
          </p>
        )}
        <section className="stats-grid" aria-label="Project statistics">
          {[
            {
              label: "Total projects",
              value: stats.total,
              sub: "Across your workspace",
              icon: FolderKanban,
            },
            {
              label: "In progress",
              value: stats.active,
              sub: "Currently active",
              icon: Clock3,
            },
            {
              label: "Completed",
              value: stats.completed,
              sub: "Marked as complete",
              icon: CheckCircle2,
            },
            {
              label: "Planned budget",
              value: money(stats.budget),
              sub: "Demo estimates · not revenue",
              icon: Wallet,
            },
          ].map((s) => (
            <article key={s.label} className="stat-card">
              <div className="stat-label">
                {s.label}
                <s.icon size={16} />
              </div>
              <strong>{s.value}</strong>
              <p>{s.sub}</p>
            </article>
          ))}
        </section>
        <section className="orbit-middle">
          <div className="surface chart-surface">
            <h2>Where things stand</h2>
            <p>Project count by current status</p>
            <div
              className="status-chart"
              role="img"
              aria-label={statuses
                .map(
                  (s) => `${s}: ${items.filter((p) => p.status === s).length}`,
                )
                .join(", ")}
            >
              {statuses.map((s, i) => {
                const count = items.filter((p) => p.status === s).length;
                return (
                  <div key={s} className="chart-col">
                    <span>{count}</span>
                    <div
                      className="bar"
                      style={{
                        height: `${Math.max(2, (count / Math.max(items.length, 1)) * 120)}px`,
                        background: ["#a7b8e9", "#315ee8", "#9ac1af"][i],
                      }}
                    />
                    <span>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="surface">
            <h2>Workspace essentials</h2>
            {[
              [
                "One place for the details",
                "Keep scope, budgets and due dates together.",
              ],
              ["A clear next step", "Move work from planning to completion."],
              [
                "Your data, your workspace",
                "Authenticated records stay separate by user.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="focus-item">
                <div className="focus-icon">
                  <Layers3 size={16} />
                </div>
                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="surface projects-surface">
          <div className="table-toolbar">
            <h2>
              Projects{" "}
              <span
                style={{
                  color: "#7c88a0",
                  fontSize: 13,
                  fontWeight: 400,
                  marginLeft: 8,
                }}
              >
                {filtered.length}
              </span>
            </h2>
            <div className="table-controls">
              <label className="search-box">
                <Search size={17} />
                <span className="sr-only">Search projects</span>
                <input
                  placeholder="Search projects…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Filter projects by status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["All", ...statuses].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "All" ? "All statuses" : s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
            <p role="status" className="loading-message">
              Loading your workspace…
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Project / client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Due date</TableHead>
                  {!preview && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="pl-6 py-5 project-title-cell">
                      {p.name}
                      <small>{p.client}</small>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`status-pill status-${p.status.toLowerCase()}`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>{money(p.budget)}</TableCell>
                    <TableCell>
                      {new Date(p.dueDate + "T12:00:00Z").toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        },
                      )}
                    </TableCell>
                    {!preview && (
                      <TableCell>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            aria-label={`Edit ${p.name}`}
                            onClick={() => openProject(p)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="icon-button"
                            aria-label={`Delete ${p.name}`}
                            onClick={() => setDeleting(p)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && !filtered.length && (
            <div className="empty-state">
              <h2>
                {items.length
                  ? "No matching projects"
                  : "Your workspace starts here"}
              </h2>
              <p>
                {items.length
                  ? "Try a different search or status."
                  : "Create your first demo project to see your overview take shape."}
              </p>
              {!items.length && !preview && (
                <button
                  className="button blue"
                  style={{ marginTop: 22 }}
                  onClick={() => openProject()}
                >
                  Create first project
                </button>
              )}
            </div>
          )}
        </section>
        <div className="orbit-account">
          {userName ? (
            <>
              <span>Signed in as {userName}</span>
              <a href={logoutUrl} target="_top">
                Sign out
              </a>
            </>
          ) : (
            <span>Public read-only preview</span>
          )}
          <span>Personal demo · No real client data</span>
        </div>
      </main>
      <Dialog
        open={modal}
        onOpenChange={(o) => {
          if (!saving) setModal(o);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit project" : "New project"}
            </DialogTitle>
            <DialogDescription>
              Add a project to your private demonstration workspace. Use
              fictional information.
            </DialogDescription>
          </DialogHeader>
          <form className="form-stack dialog-form" onSubmit={save}>
            <label className="field">
              Project name
              <input
                required
                minLength={2}
                maxLength={80}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="field">
              Client or label
              <input
                required
                minLength={2}
                maxLength={80}
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                placeholder="Fictional client / personal"
              />
            </label>
            <div className="form-row">
              <label className="field">
                Budget (USD)
                <input
                  required
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </label>
              <label className="field">
                Due date
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="field">
              <span id="status-label">Status</span>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as WorkProject["status"] })
                }
              >
                <SelectTrigger
                  aria-labelledby="status-label"
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="field">
              Notes
              <textarea
                maxLength={2000}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </label>
            {formError && (
              <p className="error-message" role="alert">
                {formError}
              </p>
            )}
            <div className="dialog-buttons">
              <button
                className="text-button"
                type="button"
                disabled={saving}
                onClick={() => setModal(false)}
              >
                Cancel
              </button>
              <button className="button blue" disabled={saving}>
                {saving ? "Saving…" : "Save project"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o && !saving) setDeleting(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this demo project?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deleting?.name}” will be removed from your workspace. This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>
              Keep project
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                void remove();
              }}
            >
              {saving ? "Deleting…" : "Delete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
