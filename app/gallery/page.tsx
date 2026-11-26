import { readContent } from "@/lib/server/store";
import { GalleryClient } from "@/components/gallery-client";

export default async function GalleryPage() {
  const content = await readContent();

  return (
    <GalleryClient
      title={content["gallery.hero.title"]}
      subtitle={content["gallery.hero.subtitle"]}
    />
  );
}
