import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LawyerListCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-48" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 mt-1 rounded" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}