import { Skeleton } from "@/components/ui/skeleton";

/** Shared by the route-level loading.tsx and the dashboard's own fetch state. */
export function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="space-y-3 lg:hidden">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex gap-2 overflow-hidden lg:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-28 flex-shrink-0 rounded-full" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[248px,minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="space-y-2 rounded-3xl bg-slate-950 p-4">
              <Skeleton className="mx-2 mb-4 h-8 w-24 bg-slate-800" />
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-2xl bg-slate-800" />
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-3xl" />
              ))}
            </div>

            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
