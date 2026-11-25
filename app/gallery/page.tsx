import { readPages } from "@/lib/server/store";
import { StoredPage } from "@/components/stored-page";
import { GalleryClient } from "@/components/gallery-client";

export default async function GalleryPage() {
  const pages = await readPages();
  const stored = pages.find((page) => page.id === "gallery");

  if (stored) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StoredPage page={stored} />
      </div>
    );
  }

  return <GalleryClient />;
}
