import { PageHeadingSkeleton } from "@/components/page-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <PageHeadingSkeleton />
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <div className="space-y-3 rounded-2xl border bg-white p-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-4 rounded-2xl border bg-white p-6">
            <Skeleton className="h-7 w-52" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-11 w-full rounded-md" />
              ))}
            </div>
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
