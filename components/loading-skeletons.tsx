import { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'

export function QuranBrowserSkeleton() {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </div>
    )
}

export function SheikhsListSkeleton() {
    return (
        <div className="container mx-auto p-4">
            <Skeleton className="h-12 w-64 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-48 rounded-full mx-auto" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export function SupplicationsSkeleton() {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Skeleton className="h-12 w-64 mb-6" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            ))}
        </div>
    )
}
