import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import { AwsClient } from "aws4fetch";

const LOCAL_UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "bracelets");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function sanitizeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureAllowedImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Each image must be 5 MB or smaller");
  }

  const extension = path.extname(file.name || "").toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    throw new Error("Allowed formats: JPG, PNG, WEBP, GIF");
  }

  return extension;
}

function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.R2_BUCKET?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

function buildFilename(image: File, extension: string) {
  const baseName = sanitizeFilename(path.parse(image.name || "product-image").name) || "product-image";
  return `${baseName}-${Date.now()}-${randomUUID().slice(0, 8)}${extension}`;
}

async function uploadToR2(files: File[], config: NonNullable<ReturnType<typeof getR2Config>>) {
  const client = new AwsClient({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    service: "s3",
    region: "auto",
  });
  const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucket}`;

  return Promise.all(
    files.map(async (image) => {
      const key = `products/${buildFilename(image, ensureAllowedImage(image))}`;
      const response = await client.fetch(`${endpoint}/${key}`, {
        method: "PUT",
        body: await image.arrayBuffer(),
        headers: {
          "Content-Type": image.type,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
      if (!response.ok) {
        throw new Error(`R2 upload failed (${response.status}): ${await response.text()}`);
      }
      return `${config.publicUrl}/${key}`;
    })
  );
}

async function uploadToLocalServer(files: File[]) {
  await mkdir(LOCAL_UPLOAD_DIRECTORY, { recursive: true });
  const imageUrls: string[] = [];

  for (const image of files) {
    const extension = ensureAllowedImage(image);
    const filename = buildFilename(image, extension);
    const filePath = path.join(LOCAL_UPLOAD_DIRECTORY, filename);
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, buffer);
    imageUrls.push(`/bracelets/${filename}`);
  }

  return imageUrls;
}

export async function uploadImages(files: File[]) {
  files.forEach(ensureAllowedImage);

  const r2 = getR2Config();
  if (r2) {
    return uploadToR2(files, r2);
  }

  // ponytail: local disk only works in dev; Vercel's filesystem is ephemeral.
  return uploadToLocalServer(files);
}
