import { Skeleton } from "@/components/ui/skeleton";

export const CommentCardSkeleton = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="space-y-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index}>
            <div className="bg-card rounded-xl border p-4 shadow-sm">
              <div className="flex gap-3">
                <Skeleton className="bg-muted size-8 rounded-full"></Skeleton>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="bg-muted h-4 w-24 rounded"></Skeleton>
                    <Skeleton className="bg-muted h-3 w-16 rounded"></Skeleton>
                  </div>
                  <Skeleton className="bg-muted h-4 w-full rounded"></Skeleton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
