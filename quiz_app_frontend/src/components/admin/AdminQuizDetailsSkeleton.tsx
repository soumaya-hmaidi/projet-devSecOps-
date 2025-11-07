import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminQuizDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Information Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Skeleton className="h-12 w-12 mx-auto mb-4 rounded" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto mb-4" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Attempts Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Skeleton className="h-12 w-12 mx-auto mb-4 rounded" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto mb-4" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center space-y-2">
                  <Skeleton className="h-8 w-12 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
