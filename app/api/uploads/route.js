import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { forbidden, isAdminRequest } from "@/lib/cms";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return forbidden();
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "Image file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "Upload a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
  }

  const extension = path.extname(file.name || "").toLowerCase() || ".jpg";
  const safeName = `admin-${Date.now()}-${Math.random().toString(16).slice(2, 8)}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "house");
  const uploadPath = path.join(uploadDir, safeName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(uploadPath, bytes);

  return Response.json({
    message: "Image uploaded.",
    url: `/uploads/house/${safeName}`
  });
}
