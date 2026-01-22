"use client"

import { useState, useEffect, memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

import { SheikhCard } from "@/components/sheikh-card"

export default function SheikhsPage() {
  const [sheikhs, setSheikhs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSheikhs = async () => {
      try {
        const response = await fetch("https://mp3quran.net/api/v3/reciters?language=ar")
        const data = await response.json()
        console.log("API Response:", data)

        if (data.reciters) {
          setSheikhs(data.reciters)
        }
      } catch (error) {
        console.error(" Error fetching sheikhs:", error)
        setSheikhs([
          {
            id: 1,
            name: "الشيخ عبد الله بصفر",
            country: "المملكة العربية السعودية",
            bio: "قارئ قرآن مشهور معروف بصوته الجميل وتجويده الدقيق.",
            specialties: ["تلاوة القرآن", "التجويد"],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSheikhs()
  }, [])

  const filteredSheikhs = sheikhs.filter(
    (sheikh) =>
      sheikh.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheikh.country?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">الشيوخ والقراء المشهورون</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  استكشف الملفات الشخصية واستمع إلى تلاوات من علماء وقراء القرآن المحترمين من جميع أنحاء العالم.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="relative">
                  <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="ابحث عن الشيوخ..."
                    className="w-full bg-background pr-8 rounded-md border border-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            {loading ? (
              <div className="text-center text-muted-foreground">جاري تحميل البيانات...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredSheikhs.map((sheikh) => (
                  <SheikhCard key={sheikh.id} sheikh={sheikh} />
                ))}
              </div>

            )}
          </div>
        </section>

        <section className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">هل ترغب في المساهمة؟</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  هل أنت شيخ أو قارئ؟ انضم إلى منصتنا لمشاركة معرفتك وتلاواتك مع المجتمع.
                </p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">اتصل بنا</Button>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
