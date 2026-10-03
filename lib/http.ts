export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function json(
  data: unknown,
  status = 200,
  extra: Record<string, string> = {},
) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}
export function fail(error: unknown) {
  if (error instanceof HttpError)
    return json({ error: error.message }, error.status);
  console.error("API request failed", error);
  return json(
    { error: "The service is temporarily unavailable. Please try again." },
    503,
  );
}
export async function body(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new HttpError(403, "This request origin is not allowed.");
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "JSON content is required.");
  if (Number(request.headers.get("content-length") || 0) > 10000)
    throw new HttpError(413, "Request too large.");
  const text = await request.text();
  if (text.length > 10000) throw new HttpError(413, "Request too large.");
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new HttpError(400, "Expected a JSON object.");
  }
}
