"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Copy, Loader2, RefreshCw, Quote, ExternalLink } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ShareSupplication } from "@/components/share-supplication"
import { SupplicationCard } from "@/components/supplication-card"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
}

// Define the API response type
interface AzkarResponse {
  zekr: string
  repeat: number
  translation?: string
  bless?: string
  source?: string
}

// Define available categories based on the API docs
const CATEGORIES = [
  { id: "morning", title: "أذكار الصباح", param: "m=true" },
  { id: "evening", title: "أذكار المساء", param: "e=true" },
  { id: "after_prayer", title: "أذكار بعد الصلاة", param: "as=true" },
  { id: "tasbih", title: "تسابيح", param: "t=true" },
  { id: "sleeping", title: "أذكار النوم", param: "bs=true" },
  { id: "waking_up", title: "أذكار الاستيقاظ", param: "wu=true" },
  { id: "quranic", title: "أدعية قرآنية", param: "qd=true" },
  { id: "prophets", title: "أدعية الأنبياء", param: "pd=true" },
]

export default function SupplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
      </div>
    }>
      <SupplicationsContent />
    </Suspense>
  )
}

function SupplicationsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id)
  const [azkarList, setAzkarList] = useState<AzkarResponse[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Set active category from URL on mount
  useEffect(() => {
    if (categoryParam) {
      const categoryExists = CATEGORIES.find(c => c.id === categoryParam)
      if (categoryExists) {
        setActiveCategory(categoryParam)
      }
    }
  }, [categoryParam])

  // Load progress from local storage
  useEffect(() => {
    const savedIndex = localStorage.getItem(`azkar-index-${activeCategory}`)
    if (savedIndex) {
      setCurrentIndex(parseInt(savedIndex, 10))
    } else {
      setCurrentIndex(0)
    }
  }, [activeCategory])

  // Save progress to local storage
  useEffect(() => {
    localStorage.setItem(`azkar-index-${activeCategory}`, currentIndex.toString())
  }, [currentIndex, activeCategory])


  const fetchAzkar = useCallback(async (categoryId: string) => {
    setLoading(true)
    setError(null)
    const category = CATEGORIES.find(c => c.id === categoryId)
    if (!category) return

    try {
      // Fetch all items with returning all=true
      const res = await fetch(`/api/proxy-azkar?${category.param}&json=true&all=true`, {
        cache: "no-store"
      })

      if (!res.ok) {
        throw new Error(`فشل في جلب الأذكار (${res.status})`)
      }

      const data: AzkarResponse[] = await res.json()
      setAzkarList(data)

      // Validation: Ensure current index is valid for new list
      const savedIndex = localStorage.getItem(`azkar-index-${categoryId}`)
      const idx = savedIndex ? parseInt(savedIndex, 10) : 0

      if (idx >= data.length) {
        setCurrentIndex(0)
      } else {
        setCurrentIndex(idx)
      }

    } catch (err: any) {
      console.error("Fetch azkar error:", err.message);
      setError(err.message || "حدث خطأ أثناء تحميل الأذكار.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on component mount or category change
  useEffect(() => {
    fetchAzkar(activeCategory)
  }, [activeCategory, fetchAzkar])

  const handleNext = () => {
    if (currentIndex < azkarList.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      // Loop back to start or handle completion
      setCurrentIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    localStorage.removeItem(`azkar-index-${activeCategory}`)
    // We might want to clear all repeats, but for now just the start index is enough or maybe iterate?
    // Clearing all repeats would require knowing all keys. We'll leave them as "history" or maybe clear on completion.
  }

  const currentZekr = azkarList[currentIndex]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-28 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl font-amiri text-emerald-800 dark:text-emerald-400">
                  الأدعية والأذكار
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  موسوعة شاملة من الأدعية والأذكار الصحيحة، متجددة وتفاعلية
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories & Content */}
        <section className="w-full pb-20 container px-4 md:px-6 -mt-10">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full max-w-5xl mx-auto space-y-8"
            dir="rtl"
          >
            <div className="sticky top-16 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4 md:mx-0 md:px-0 rounded-b-xl md:rounded-xl shadow-sm border md:border-none">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <TabsList className="w-full h-auto p-1 bg-transparent flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-2">
                  {CATEGORIES.map((category) => (
                    <motion.div key={category.id} variants={itemVariants}>
                      <TabsTrigger
                        value={category.id}
                        className="whitespace-nowrap rounded-full px-6 py-2.5 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent data-[state=inactive]:border-gray-200 dark:data-[state=inactive]:border-gray-800 transition-all duration-300"
                      >
                        {category.title}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </motion.div>
            </div>

            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                    <p className="mt-4 text-emerald-600 font-medium">جاري إحضار الأذكار...</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center space-y-4 py-10"
                  >
                    <p className="text-red-500">{error}</p>
                    <Button onClick={() => fetchAzkar(activeCategory)} variant="outline">إعادة المحاولة</Button>
                  </motion.div>
                ) : currentZekr ? (
                  <div className="w-full space-y-4">
                    <div className="flex justify-center items-center font-medium gap-2 mb-4 text-sm text-muted-foreground">
                      <span>الذكر {currentIndex + 1} من {azkarList.length}</span>
                    </div>
                    <SupplicationCard
                      key={`${activeCategory}-${currentIndex}`} // Force remount on change
                      zekr={currentZekr}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      storageKey={`azkar-repeat-${activeCategory}-${currentIndex}`}
                      onReset={handleReset}
                      showReset={currentIndex > 0}
                      hasPrevious={currentIndex > 0}
                      hasNext={currentIndex < azkarList.length - 1}
                    />
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </Tabs>
        </section>
      </main>

      <style jsx global>{`
        .font-amiri {
          font-family: var(--font-amiri), serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

import { ChevronLeft, ChevronRight } from "lucide-react"

