import { readPages } from "@/lib/server/store";
import { ok } from "@/lib/server/http";

export async function GET() {
  const pages = await readPages();
  return ok({ pages });
}
