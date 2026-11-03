export async function GET() {
  // Chat responses stream directly from the chat route. No Redis-backed
  // resumable stream store is configured on this Cloudflare deployment.
  return new Response(null, { status: 204 });
}
