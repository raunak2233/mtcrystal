import { HeroSkeleton, CardListSkeleton } from "@/components/page-skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSkeleton />
      <div className="container mx-auto px-4 py-12">
        <CardListSkeleton count={3} />
      </div>
    </div>
  );
}
