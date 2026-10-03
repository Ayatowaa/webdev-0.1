"use client";
import { useEffect } from "react";
type Tool = {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: unknown) => unknown | Promise<unknown>;
  annotations?: { readOnlyHint: boolean; untrustedContentHint: boolean };
};
export function useWebTool(tool: Tool) {
  useEffect(() => {
    const context = (
      document as Document & {
        modelContext?: {
          registerTool: (
            tool: Tool,
            options: { signal: AbortSignal },
          ) => void | Promise<void>;
        };
      }
    ).modelContext;
    if (!context) return;
    const controller = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(tool, { signal: controller.signal }),
      ).catch(() => {});
    } catch {}
    return () => controller.abort();
  }, [tool]);
}
