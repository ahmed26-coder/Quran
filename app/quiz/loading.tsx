import { Skeleton } from "@/components/ui/skeleton"

export default function QuizLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="text-center space-y-2 mb-8">
          <Skeleton className="h-12 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>

        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}
