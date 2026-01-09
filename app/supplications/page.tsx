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
  const [zekr, setZekr] = useState<AzkarResponse | null>(null)
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


  const fetchZekr = useCallback(async (categoryId: string) => {
    setLoading(true)
    setError(null)
    const category = CATEGORIES.find(c => c.id === categoryId)
    if (!category) return

    // Use our local proxy to avoid CORS issues
    try {
      const res = await fetch(`/api/proxy-azkar?${category.param}&json=true`, {
        cache: "no-store"
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Proxy returned error:", res.status, errData);
        throw new Error(`فشل في جلب الذكر (${res.status})`)
      }

      const data: AzkarResponse = await res.json()
      setZekr(data)
    } catch (err: any) {
      console.error("Fetch zekr error:", err.message);
      setError(err.message || "حدث خطأ أثناء تحميل الذكر، يرجى المحاولة مرة أخرى.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch on component mount or category change
  useEffect(() => {
    fetchZekr(activeCategory)
  }, [activeCategory, fetchZekr])

  const handleRefresh = () => {
    fetchZekr(activeCategory)
  }

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
                    <p className="mt-4 text-emerald-600 font-medium">جاري إحضار ذكر جديد...</p>
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
                    <Button onClick={handleRefresh} variant="outline">إعادة المحاولة</Button>
                  </motion.div>
                ) : zekr ? (
                  <SupplicationCard zekr={zekr} onRefresh={handleRefresh} />
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

function SupplicationCard({ zekr, onRefresh }: { zekr: AzkarResponse; onRefresh: () => void }) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(zekr.zekr)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <motion.div
      key={zekr.zekr} // Key helps Framer Motion animate between different zekrs
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="w-full max-w-2xl mx-auto overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50 shadow-xl bg-white/50 dark:bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-emerald-50/50 dark:bg-emerald-950/20 pb-6 pt-6 text-center border-b border-emerald-100 dark:border-emerald-900/30">
          <div className="flex justify-center mb-4">
            <div className="bg-white dark:bg-background p-3 rounded-full shadow-sm ring-1 ring-emerald-100 dark:ring-emerald-900">
              <Quote className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          {zekr.repeat && zekr.repeat > 1 && (
            <div className="mb-2">
              <Badge variant="outline" className="bg-background/80 backdrop-blur border-emerald-200 text-emerald-700 px-3 py-1">
                تكرار: {zekr.repeat} مرات
              </Badge>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-8 pb-8 px-6 md:px-10 text-center space-y-9">
          <p className="text-2xl gap-5 md:text-3xl lg:text-4xl leading-[2.2] font-amiri text-emerald-950 dark:text-emerald-50">
            {zekr.zekr}
          </p>

          {zekr.translation && (
            <p className="text-muted-foreground my-3 text-sm md:text-base italic dir-ltr">
              {zekr.translation}
            </p>
          )}

          {zekr.bless && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 text-sm md:text-base text-blue-800 dark:text-blue-300">
              <span className="font-semibold ml-1">✨ الفضل:</span> {zekr.bless}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 px-6 bg-muted/20 border-t">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <ExternalLink className="h-3 w-3" />
            <span>{zekr.source || "المصدر غير متوفر"}</span>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className={`flex-1 md:flex-none gap-2 ${isCopied ? "border-emerald-500 text-emerald-600" : ""}`}
            >
              {isCopied ? "تم النسخ" : "نسخ النص"}
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              onClick={onRefresh}
              size="sm"
              className="flex-1 md:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              ذكر آخر
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
