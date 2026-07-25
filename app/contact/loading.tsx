import { HeroSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSkeleton />
      <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex gap-4 rounded-lg border bg-white p-6">
              <Skeleton className="h-12 w-12 flex-shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5 rounded-lg border bg-white p-8 lg:col-span-2">
          <Skeleton className="h-8 w-56" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
