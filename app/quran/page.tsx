import QuranBrowser from "@/components/quran-browser"
import { SiteHeader } from "@/components/site-header"

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfVerses: number
  revelationType: string
}

export const dynamic = "force-dynamic"

async function getSurahs() {
  try {
    const res = await fetch("http://api.alquran.cloud/v1/surah", {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    if (!res.ok) {
      throw new Error(`Failed to fetch surahs: ${res.status}`)
    }
    return res.json()
  } catch (error) {
    console.error("Error fetching surahs:", error)
    return null
  }
}

export default async function QuranPage({ searchParams }: { searchParams: Promise<{ surah?: string, ayah?: string }> }) {
  const params = await searchParams
  const data = await getSurahs()
  const surahs: Surah[] = data?.data || []
  const hasError = !data

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6 text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">القرآن الكريم</h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              اقرأ واستمع وادرس القرآن الكريم مع ترجمات متعددة وموارد التفسير.
            </p>
          </div>
        </section>

        <section className="w-full pb-12">
          <div className="container px-4 md:px-6">
            {hasError ? (
              <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-xl border border-red-100 dark:border-red-900/30 text-center space-y-4">
                <p className="text-red-600 font-medium text-lg">عذراً، حدث خطأ أثناء تحميل بيانات السورة.</p>
                <p className="text-muted-foreground text-sm">يرجى التحقق من اتصال الإنترنت أو المحاولة مرة أخرى لاحقاً.</p>
              </div>
            ) : (
              <QuranBrowser
                surahs={surahs}
                initialSurah={params.surah ? parseInt(params.surah) : undefined}
                initialAyah={params.ayah ? parseInt(params.ayah) : undefined}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
