import { PageHeadingSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <PageHeadingSkeleton />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-4 rounded-lg border bg-white p-4">
                <Skeleton className="h-24 w-24 flex-shrink-0 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-9 w-32 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-lg border bg-white p-6">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
