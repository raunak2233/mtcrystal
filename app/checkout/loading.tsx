import { PageHeadingSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <PageHeadingSkeleton />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4 rounded-lg border bg-white p-6">
              <Skeleton className="h-7 w-48" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
            <div className="space-y-4 rounded-lg border bg-white p-6">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          </div>
          <div className="space-y-4 rounded-lg border bg-white p-6">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-11 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
