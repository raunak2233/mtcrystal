import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 py-16">
      <div className="container mx-auto space-y-4 px-4 text-center">
        <Skeleton className="mx-auto h-10 w-64 sm:h-12 sm:w-80" />
        <Skeleton className="mx-auto h-5 w-full max-w-2xl" />
        <Skeleton className="mx-auto h-5 w-2/3 max-w-xl" />
      </div>
    </div>
  );
}

export function PageHeadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-9 w-56 sm:h-10 sm:w-72" />
      <Skeleton className="h-5 w-full max-w-md" />
    </div>
  );
}

export function FilterRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-24 rounded-md" />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-lg border bg-white">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border bg-white p-6">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function CatalogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <PageHeadingSkeleton />
        <FilterRowSkeleton />
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
