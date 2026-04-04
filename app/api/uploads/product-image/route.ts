import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { getSessionUser } from "@/lib/server/auth";
import { badRequest, forbidden, ok, serverError } from "@/lib/server/http";

const UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "bracelets");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user?.isAdmin) {
    return forbidden();
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("images")
      .concat(formData.getAll("image"))
      .filter((item): item is File => item instanceof File);

    if (!files.length) {
      return badRequest("Please choose an image to upload");
    }

    await mkdir(UPLOAD_DIRECTORY, { recursive: true });
    const imageUrls: string[] = [];

    for (const image of files) {
      if (!image.type.startsWith("image/")) {
        return badRequest("Only image files are allowed");
      }

      if (image.size > MAX_FILE_SIZE) {
        return badRequest("Each image must be 5 MB or smaller");
      }

      const originalName = image.name || "product-image";
      const parsed = path.parse(originalName);
      const extension = parsed.ext.toLowerCase();

      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return badRequest("Allowed formats: JPG, PNG, WEBP, GIF");
      }

      const baseName = sanitizeFilename(parsed.name) || "product-image";
      const filename = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1000)}${extension}`;
      const filePath = path.join(UPLOAD_DIRECTORY, filename);
      const buffer = Buffer.from(await image.arrayBuffer());

      await writeFile(filePath, buffer);
      imageUrls.push(`/bracelets/${filename}`);
    }

    return ok({
      imageUrl: imageUrls[0],
      imageUrls,
    });
  } catch (error) {
    console.error("Product image upload failed", error);
    return serverError("Unable to upload image");
  }
}
