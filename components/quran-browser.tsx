"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Type, Image as ImageIcon, Loader2, Info, ArrowRight, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfVerses: number
  revelationType: string
}

interface Ayah {
  number: number
  text: string
  numberInSurah: number
  juz: number
  manzil: number
  page: number
  ruku: number
  hizbQuarter: number
  sajda: boolean
}

interface QuranBrowserProps {
  surahs: Surah[]
}

const JUZS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `الجزء ${i + 1}`,
  description: `الجزء ${i + 1} من القرآن الكريم`
}))

export default function QuranBrowser({ surahs }: QuranBrowserProps) {
  // Main State
  const [readerMode, setReaderMode] = useState<"text" | "image">("image")

  // Selection State
  const [currentSurahNum, setCurrentSurahNum] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentJuz, setCurrentJuz] = useState<number>(1)

  // Data State
  const [surahContent, setSurahContent] = useState<Ayah[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{ type: 'surah' | 'ayah', item: any }[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Derived
  const activeSurah = useMemo(() => surahs.find(s => s.number === currentSurahNum), [surahs, currentSurahNum])

  // --- Persistence Handlers ---
  const saveState = useCallback((surah: number, page: number, juz: number, mode: "text" | "image") => {
    localStorage.setItem("quran-state", JSON.stringify({ surah, page, juz, readerMode: mode }))
  }, [])

  // --- Data Fetching ---

  const fetchSurahData = useCallback(async (num: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}`)
      const data = await res.json()
      if (data.code === 200) {
        setSurahContent(data.data.ayahs)
        return data.data.ayahs
      }
    } catch (error) {
      console.error("Failed to fetch surah", error)
    } finally {
      setIsLoading(false)
    }
    return []
  }, [])

  // --- Actions ---

  const handleSelectSurah = async (num: number) => {
    setCurrentSurahNum(num)
    const ayahs = await fetchSurahData(num)
    if (ayahs.length > 0) {
      const page = ayahs[0].page
      const juz = ayahs[0].juz
      setCurrentPage(page)
      setCurrentJuz(juz)
      saveState(num, page, juz, readerMode)
    }
  }

  const handleSelectJuz = async (juz: number) => {
    setCurrentJuz(juz)
    setIsLoading(true)
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/juz/${juz}`)
      const data = await res.json()
      if (data.code === 200) {
        const firstAyah = data.data.ayahs[0]
        const surahNum = firstAyah.surah.number
        const page = firstAyah.page

        setCurrentSurahNum(surahNum)
        setCurrentPage(page)
        await fetchSurahData(surahNum)
        saveState(surahNum, page, juz, readerMode)
      }
    } catch (error) {
      console.error("Failed to fetch juz info", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > 604) return
    setCurrentPage(page)
    setIsLoading(true)
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${page}`)
      const data = await res.json()
      if (data.code === 200) {
        const firstAyah = data.data.ayahs[0]
        const surahNum = firstAyah.surah.number
        const juz = firstAyah.juz

        setCurrentJuz(juz)
        if (surahNum !== currentSurahNum) {
          setCurrentSurahNum(surahNum)
          await fetchSurahData(surahNum)
        }
        saveState(surahNum, page, juz, readerMode)
      }
    } catch (error) {
      console.error("Failed to fetch page info", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReaderMode = (mode: "text" | "image") => {
    setReaderMode(mode)
    saveState(currentSurahNum, currentPage, currentJuz, mode)
  }

  // --- Search Logic ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      const results: { type: 'surah' | 'ayah', item: any }[] = []

      // 1. Surah Search (Local)
      const matchedSurahs = surahs.filter(s =>
        s.name.includes(searchQuery) ||
        s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.number.toString() === searchQuery
      ).slice(0, 5)

      matchedSurahs.forEach(s => results.push({ type: 'surah', item: s }))

      // 2. Ayah Search (API) - Only if query is long enough
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(searchQuery)}/all/quran-simple`)
          const data = await res.json()
          if (data.code === 200 && data.data.matches) {
            data.data.matches.slice(0, 10).forEach((m: any) => {
              results.push({ type: 'ayah', item: m })
            })
          }
        } catch (e) {
          console.error("Ayah search failed", e)
        }
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery, surahs])

  const handleSearchResultClick = async (result: { type: 'surah' | 'ayah', item: any }) => {
    if (result.type === 'surah') {
      await handleSelectSurah(result.item.number)
    } else {
      const ayah = result.item
      setCurrentSurahNum(ayah.surah.number)
      setCurrentPage(ayah.page)
      setCurrentJuz(ayah.juz)
      await fetchSurahData(ayah.surah.number)
      saveState(ayah.surah.number, ayah.page, ayah.juz, readerMode)
    }
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  // --- Effects ---

  // Initialization: Load from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem("quran-state")
    let initialSurah = 1
    let initialPage = 1
    let initialJuz = 1
    let initialMode: "text" | "image" = "image"

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        initialSurah = parsed.surah || 1
        initialPage = parsed.page || 1
        initialJuz = parsed.juz || 1
        initialMode = parsed.readerMode || "image"
      } catch (e) {
        console.error("Failed to parse saved state", e)
      }
    }

    setCurrentSurahNum(initialSurah)
    setCurrentPage(initialPage)
    setCurrentJuz(initialJuz)
    setReaderMode(initialMode)

    fetchSurahData(initialSurah).then(() => {
      setIsInitialized(true)
    })
  }, [fetchSurahData])

  return (
    <div className="w-full space-y-8 min-h-[800px]">

      <AnimatePresence mode="wait">
        <motion.div
          key="reader"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="space-y-6"
        >
          {/* Professional Reader Toolbar */}
          <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-2 border-emerald-100 dark:border-emerald-900/30 p-2 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-2 md:gap-3 flex-wrap flex-1 min-w-0">
              {/* Animated Search Section */}
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    width: isSearchOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '160px' : '280px') : '40px',
                    borderColor: isSearchOpen ? 'rgba(52, 211, 153, 0.4)' : 'transparent'
                  }}
                  className="flex items-center bg-muted/30 rounded-xl overflow-hidden border-2 transition-colors h-10 px-1"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchOpen(!isSearchOpen)
                      if (isSearchOpen) setSearchQuery("")
                    }}
                    className="rounded-lg h-8 w-8 shrink-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </Button>

                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1"
                    >
                      <Input
                        autoFocus
                        placeholder="ابحث عن سورة أو آية..."
                        className="border-none bg-transparent h-8 focus-visible:ring-0 text-sm p-0 shadow-none placeholder:text-muted-foreground/60"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && (searchQuery || isSearching) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-12 right-0 w-[300px] sm:w-[400px] bg-background border-2 border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1"
                    >
                      {isSearching ? (
                        <div className="p-4 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600 mb-2" />
                          <p className="text-sm text-muted-foreground">جاري البحث...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                          {searchResults.map((res, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSearchResultClick(res)}
                              className="flex items-center justify-between p-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl cursor-pointer group transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${res.type === 'surah' ? 'bg-emerald-100/50 text-emerald-700' : 'bg-blue-100/50 text-blue-700'}`}>
                                  {res.type === 'surah' ? <ArrowRight className="h-4 w-4" /> : <Type className="h-4 w-4" />}
                                </div>
                                <div>
                                  <p className="font-bold text-sm">
                                    {res.type === 'surah' ? res.item.name : `${res.item.surah.name} (${res.item.numberInSurah})`}
                                  </p>
                                  <p className="text-xs text-muted-foreground line-clamp-1 font-amiri">
                                    {res.type === 'surah' ? `سورة رقم ${res.item.number}` : res.item.text}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-[10px] opacity-50 group-hover:opacity-100">
                                {res.type === 'surah' ? 'سورة' : 'آية'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="p-8 text-center text-muted-foreground text-sm">لا توجد نتائج للبحث</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Separator orientation="vertical" className="h-8 hidden md:block shrink-0" />

              {/* Juz Selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-2 hidden lg:inline">الجزء</span>
                <Select value={currentJuz.toString()} onValueChange={(v) => handleSelectJuz(parseInt(v))}>
                  <SelectTrigger className="w-[110px] h-10 border-none shadow-none focus:ring-0 font-bold bg-muted/30 rounded-xl">
                    <SelectValue placeholder="الجزء" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {JUZS.map(j => (
                      <SelectItem key={j.id} value={j.id.toString()}>
                        الجزء {j.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Surah Selector */}
              <Select value={currentSurahNum.toString()} onValueChange={(v) => handleSelectSurah(parseInt(v))}>
                <SelectTrigger className="w-[180px] h-10 border-none shadow-none focus:ring-0 font-amiri text-lg font-bold bg-muted/30 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[400px]">
                  {surahs.map(s => (
                    <SelectItem key={s.number} value={s.number.toString()} className="font-amiri text-lg">
                      {s.number}. {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Separator orientation="vertical" className="h-8" />

              {/* Page Selector */}
              <Select value={currentPage.toString()} onValueChange={(v) => handlePageChange(parseInt(v))}>
                <SelectTrigger className="w-[90px] h-10 border-none shadow-none focus:ring-0 bg-muted/30 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Array.from({ length: 604 }, (_, i) => i + 1).map(p => (
                    <SelectItem key={p} value={p.toString()}>ص {p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-muted/50 p-1 rounded-xl flex items-center gap-1">
                <Button
                  variant={readerMode === "image" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleReaderMode("image")}
                  className="h-8 rounded-lg px-3"
                >
                  <ImageIcon className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">عرض المصحف</span>
                </Button>
                <Button
                  variant={readerMode === "text" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleReaderMode("text")}
                  className="h-8 rounded-lg px-3"
                >
                  <Type className="h-4 w-4 ml-2" />
                  <span className="hidden sm:inline">عرض النص</span>
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hidden sm:flex" title="معلومات السورة">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Reader Content Area */}
          <div className="relative min-h-[700px]">
            {isLoading || !isInitialized ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-3xl">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-emerald-700 font-medium animate-pulse">جاري تحميل الآيات المباركة...</p>
              </div>
            ) : null}

            <div className="bg-white dark:bg-card border-2 border-emerald-50 dark:border-emerald-950/20 rounded-3xl shadow-sm overflow-hidden min-h-[800px]">
              {readerMode === "text" ? (
                <div className="p-8 md:p-16 max-w-4xl mx-auto space-y-12">
                  {/* Header Decoration */}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent w-full" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-amiri text-emerald-900 dark:text-emerald-100">{activeSurah?.name}</h2>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Badge variant="outline">{activeSurah?.revelationType === "Meccan" ? "مكية" : "مدنية"}</Badge></span>
                      <span className="flex items-center gap-1"><Badge variant="outline">{activeSurah?.numberOfVerses} آية</Badge></span>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent w-full" />
                    </div>
                  </div>

                  {/* Basmala */}
                  {activeSurah?.number !== 1 && activeSurah?.number !== 9 && (
                    <div className="text-center py-6">
                      <p className="font-amiri text-3xl md:text-4xl text-emerald-800 dark:text-emerald-400">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </p>
                    </div>
                  )}

                  {/* Ayahs */}
                  <div className="font-amiri text-3xl md:text-4xl leading-[2.8] text-justify md:text-center text-emerald-950 dark:text-emerald-50" dir="rtl">
                    {surahContent.map((ayah) => (
                      <span key={ayah.number} className="inline group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg px-2 py-1 transition-all cursor-pointer">
                        {ayah.text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}
                        <span className="inline-flex items-center justify-center w-10 h-10 mx-2 align-middle text-sm border-2 border-emerald-200 rounded-full text-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 font-sans font-bold">
                          {ayah.numberInSurah}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative w-full min-h-[800px] flex flex-col items-center bg-[#fffdf5] dark:bg-[#1a1c1e]/10 py-10 px-4">
                  <div className="relative w-full max-w-[650px] aspect-[1/1.5] shadow-2xl rounded-lg overflow-hidden border">
                    <Image
                      src={`https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/master/${currentPage.toString().padStart(3, '0')}.png`}
                      alt={`الصفحة رقم ${currentPage}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Floating Controls for Image Mode */}
                  <div className="mt-12 flex items-center gap-6">
                    <Button
                      variant="outline"
                      size="lg"
                      disabled={currentPage >= 604}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="rounded-2xl border-2 hover:bg-emerald-50 hover:border-emerald-200 h-14 px-8 gap-4 font-bold"
                    >
                      <ChevronRight className="h-6 w-6" />
                      الصفحة التالية
                    </Button>

                    <div className="text-center px-4">
                      <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">الصفحة</p>
                      <p className="text-2xl font-bold">{currentPage}</p>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="rounded-2xl border-2 hover:bg-emerald-50 hover:border-emerald-200 h-14 px-8 gap-4 font-bold"
                    >
                      الصفحة السابقة
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        .font-amiri {
          font-family: var(--font-amiri), serif;
        }
      `}</style>
    </div>
  )
}
