import path from "path";
import { mkdir, writeFile } from "fs/promises";

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

function toPublicImageUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const baseUrl = String(process.env.IMAGE_PUBLIC_BASE_URL || "").trim().replace(/\/+$/, "");
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

function extractRemoteUrls(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.imageUrls,
    record.images,
    record.files,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const urls = candidate
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item === "object") {
            const row = item as Record<string, unknown>;
            const nested = row.url || row.imageUrl || row.path || row.location;
            return typeof nested === "string" ? nested : "";
          }
          return "";
        })
        .filter(Boolean);

      if (urls.length) {
        return urls.map(toPublicImageUrl);
      }
    }
  }

  const singleValue = record.url || record.imageUrl || record.path || record.location;
  return typeof singleValue === "string" ? [toPublicImageUrl(singleValue)] : [];
}

async function uploadToRemoteServer(files: File[]) {
  const uploadUrl = String(process.env.IMAGE_UPLOAD_API_URL || "").trim();
  const token = String(process.env.IMAGE_UPLOAD_API_TOKEN || "").trim();
  const fieldName = String(process.env.IMAGE_UPLOAD_FIELD_NAME || "images").trim();

  if (!uploadUrl) {
    throw new Error("IMAGE_UPLOAD_API_URL is not configured");
  }

  const formData = new FormData();
  files.forEach((file) => formData.append(fieldName, file));

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const responseText = await response.text();
  let payload: unknown = {};

  try {
    payload = responseText ? JSON.parse(responseText) : {};
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(
      (payload as Record<string, unknown>).error as string ||
        responseText ||
        "Remote image server rejected upload"
    );
  }

  const imageUrls = extractRemoteUrls(payload);
  if (!imageUrls.length) {
    throw new Error(
      responseText || "Remote image server did not return an image URL"
    );
  }

  return imageUrls;
}

async function uploadToLocalServer(files: File[]) {
  await mkdir(LOCAL_UPLOAD_DIRECTORY, { recursive: true });
  const imageUrls: string[] = [];

  for (const image of files) {
    const extension = ensureAllowedImage(image);
    const baseName = sanitizeFilename(path.parse(image.name || "product-image").name) || "product-image";
    const filename = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1000)}${extension}`;
    const filePath = path.join(LOCAL_UPLOAD_DIRECTORY, filename);
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, buffer);
    imageUrls.push(`/bracelets/${filename}`);
  }

  return imageUrls;
}

export async function uploadImages(files: File[]) {
  files.forEach(ensureAllowedImage);

  const uploadUrl = String(process.env.IMAGE_UPLOAD_API_URL || "").trim();
  if (uploadUrl) {
    return uploadToRemoteServer(files);
  }

  return uploadToLocalServer(files);
}
