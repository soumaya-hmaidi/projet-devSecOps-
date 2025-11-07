import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-gradient-to-r from-gray-200 to-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2 rounded" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>

        {/* Recent Users Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Skeleton className="h-5 w-5 mr-2 rounded" />
              <Skeleton className="h-5 w-28" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded" />
            <Skeleton className="h-5 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
