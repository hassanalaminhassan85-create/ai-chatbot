import { env } from "cloudflare:workers";
import { auth } from "@/app/(auth)/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });

  const { key: segments } = await params;
  const key = segments.join("/");
  if (!key.startsWith(`uploads/${session.user.id}/`)) {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.FILES.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "private, max-age=3600");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
