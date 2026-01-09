"use client"

import dynamic from 'next/dynamic'
import { Skeleton } from './ui/skeleton'

const GlobalSearchComponent = dynamic(
    () => import('./global-search').then(mod => ({ default: mod.GlobalSearch })),
    {
        loading: () => (
            <div className="h-10 w-10 flex items-center justify-center">
                <Skeleton className="h-5 w-5 rounded-full" />
            </div>
        ),
        ssr: false
    }
)

export function GlobalSearchLazy() {
    return <GlobalSearchComponent />
}
