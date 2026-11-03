import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";

const FileSchema = z.object({
  file: z.instanceof(Blob)
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size should be less than 5MB",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "File type should be JPEG or PNG",
    }),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!request.body) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validated = FileSchema.safeParse({ file });
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.issues.map((issue) => issue.message).join(", ") },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120) || "upload";
    const key = `uploads/${session.user.id}/${crypto.randomUUID()}-${safeName}`;
    await env.FILES.put(key, await file.arrayBuffer(), {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: `inline; filename="${safeName}"`,
      },
      customMetadata: { ownerId: session.user.id },
    });

    const url = `/api/files/${key.split("/").map(encodeURIComponent).join("/")}`;
    return NextResponse.json({
      url,
      pathname: key,
      contentType: file.type,
      contentDisposition: `inline; filename="${safeName}"`,
    });
  } catch (error) {
    console.error("R2 upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
