import { ProductGridSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-6 h-10 w-40 rounded-md" />

        <div className="mb-12 grid gap-8 rounded-lg bg-white p-6 shadow-md md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-20 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-5 w-full" />
              ))}
            </div>
            <div className="flex gap-3 border-t pt-4">
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 flex-1 rounded-md" />
            </div>
          </div>
        </div>

        <Skeleton className="mb-6 h-8 w-56" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
