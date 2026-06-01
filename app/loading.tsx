import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8 space-y-8">
      <Skeleton className="h-[50vh] w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[50%]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
