import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LoadingDashboard = ({ variant = "admin" }) => {
  const isTeacher = variant === "teacher";
  const isStudent = variant === "student";
  const isAdmin = variant === "admin";

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Skeleton for Teacher */}
      {isTeacher && (
        <div className="w-64 border-r bg-card hidden md:block h-screen fixed left-0 top-0">
          <div className="p-6 space-y-6">
            <div className="h-8 w-32 bg-muted animate-pulse rounded" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full bg-muted animate-pulse rounded"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col ${isTeacher ? "md:pl-64" : ""}`}>
        {/* Navbar Skeleton for Admin/Student */}
        {!isTeacher && (
          <div className="border-b bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded mr-2" />
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`p-8 ${
            !isTeacher ? "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8" : ""
          }`}
        >
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          </div>

          {/* Admin Layout */}
          {isAdmin && (
            <>
              {/* Quick Stats Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                          <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="w-12 h-12 bg-muted animate-pulse rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Management Sections Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="border-b border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-5 w-5 bg-muted animate-pulse rounded mr-2" />
                          <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-9 w-28 bg-muted animate-pulse rounded" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {[...Array(2)].map((_, j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                              <div className="ml-3 space-y-2">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 h-4 w-32 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Teacher/Student Layout (Profile + Details) */}
          {(isTeacher || isStudent) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card Skeleton */}
              <Card className="lg:col-span-1">
                <CardHeader className="border-b border-border">
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-muted animate-pulse rounded-full mb-3" />
                    <div className="h-6 w-40 bg-muted animate-pulse rounded mb-2" />
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b border-border"
                      >
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Details Section Skeleton */}
              <Card className="lg:col-span-2">
                <CardHeader className="border-b border-border">
                  <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Mimic blocks of content */}
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[...Array(2)].map((_, j) => (
                            <div
                              key={j}
                              className="h-32 bg-muted animate-pulse rounded-lg"
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingDashboard;
