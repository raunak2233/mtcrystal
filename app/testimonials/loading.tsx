import { HeroSkeleton, CardListSkeleton } from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSkeleton />
      <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
        <CardListSkeleton count={1} />
        <CardListSkeleton count={1} />
        <CardListSkeleton count={1} />
      </div>
    </div>
  );
}
