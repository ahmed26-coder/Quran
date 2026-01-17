export default function HadithLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 bg-muted animate-pulse" />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <div className="h-12 bg-muted animate-pulse rounded" />
              <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-10 bg-muted animate-pulse rounded w-1/2" />
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container px-4 md:px-6 space-y-6">
            <div className="h-40 bg-muted animate-pulse rounded" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
