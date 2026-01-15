"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Type, Image as ImageIcon, Loader2, Info, ArrowRight, X, BookOpen } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { fetchAvailableTafseers, fetchTafseerForAyahs, type TafseerSource, type TafseerText } from "@/lib/tafseer-api"

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
  initialSurah?: number
  initialAyah?: number
}

const JUZS = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `الجزء ${i + 1}`,
  description: `الجزء ${i + 1} من القرآن الكريم`
}))

export default function QuranBrowser({ surahs, initialSurah, initialAyah }: QuranBrowserProps) {
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

  // Tafseer State
  const [isTafseerDialogOpen, setIsTafseerDialogOpen] = useState(false)
  const [isTafseerSheetOpen, setIsTafseerSheetOpen] = useState(false)
  const [availableTafseers, setAvailableTafseers] = useState<TafseerSource[]>([])
  const [selectedTafseerId, setSelectedTafseerId] = useState<number | string | null>(null)
  const [tafseerData, setTafseerData] = useState<TafseerText[]>([])
  const [tafseerRange, setTafseerRange] = useState<{ surah: string, start: number, end: number } | null>(null)
  const [isFetchingTafseer, setIsFetchingTafseer] = useState(false)

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

  // --- Tafseer Logic ---
  const handleTafseerButtonClick = () => {
    setIsTafseerDialogOpen(true)
  }

  const handleTafseerSelect = async (tafseerId: number | string) => {
    setSelectedTafseerId(tafseerId)
    setIsTafseerDialogOpen(false)
    setIsFetchingTafseer(true)
    setIsTafseerSheetOpen(true)
    setTafseerData([])

    try {
      // Get all ayahs on current page
      let ayahsToFetch: Array<{ surahNumber: number; ayahNumber: number }> = []

      if (readerMode === "text") {
        // In text mode, use current surah content
        ayahsToFetch = surahContent.map(ayah => ({
          surahNumber: currentSurahNum,
          ayahNumber: ayah.numberInSurah
        }))
      } else {
        // In image mode, fetch page data to get all ayahs on the page
        const res = await fetch(`https://api.alquran.cloud/v1/page/${currentPage}`)
        const data = await res.json()
        if (data.code === 200) {
          ayahsToFetch = data.data.ayahs.map((ayah: any) => ({
            surahNumber: ayah.surah.number,
            ayahNumber: ayah.numberInSurah
          }))
        }
      }

      if (ayahsToFetch.length > 0) {
        // Calculate range info
        const first = ayahsToFetch[0]
        const last = ayahsToFetch[ayahsToFetch.length - 1]

        // Fetch surah name for the range info (might be different from activeSurah in image mode if page spans surahs)
        // For simplicity, we use the surah of the first ayah. 
        // In a perfect world we might handle multi-surah pages better, but this is a good start.
        const surahName = activeSurah?.number === first.surahNumber ? activeSurah.name :
          surahs.find(s => s.number === first.surahNumber)?.name || "السورة"

        setTafseerRange({
          surah: surahName,
          start: first.ayahNumber,
          end: last.ayahNumber
        })
      }

      const tafseers = await fetchTafseerForAyahs(tafseerId, ayahsToFetch)
      setTafseerData(tafseers)
    } catch (error) {
      console.error("Failed to fetch tafseer:", error)
    } finally {
      setIsFetchingTafseer(false)
    }
  }

  // --- Effects ---

  // Load available tafseers on mount
  useEffect(() => {
    const loadTafseers = async () => {
      try {
        const tafseers = await fetchAvailableTafseers()
        setAvailableTafseers(tafseers)
      } catch (error) {
        console.error("Failed to load tafseers:", error)
      }
    }
    loadTafseers()
  }, [])

  // Initialization: Load from props or localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem("quran-state")
    let initialSurahNum = initialSurah || 1
    let initialPageNum = 1
    let initialJuzNum = 1
    let initialMode: "text" | "image" = "image"

    const initialize = async () => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (!initialSurah) initialSurahNum = parsed.surah || 1
          initialPageNum = parsed.page || 1
          initialJuzNum = parsed.juz || 1
          if (!initialAyah) initialMode = parsed.readerMode || "image"
        } catch (e) {
          console.error("Failed to parse saved state", e)
        }
      }

      // If initialAyah is provided, find its page
      if (initialAyah && initialSurah) {
        try {
          const res = await fetch(`https://api.alquran.cloud/v1/ayah/${initialSurah}:${initialAyah}`)
          const data = await res.json()
          if (data.code === 200) {
            initialPageNum = data.data.page
            initialJuzNum = data.data.juz
          }
        } catch (e) {
          console.error("Failed to fetch initial ayah info", e)
        }
      }

      setCurrentSurahNum(initialSurahNum)
      setCurrentPage(initialPageNum)
      setCurrentJuz(initialJuzNum)
      setReaderMode(initialMode)

      await fetchSurahData(initialSurahNum)
      setIsInitialized(true)
    }

    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSurah, initialAyah])

  // Scroll to Ayah logic
  useEffect(() => {
    if (isInitialized && initialAyah && readerMode === "text") {
      const element = document.getElementById(`ayah-${initialAyah}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.classList.add("bg-emerald-100", "dark:bg-emerald-900/40")
        setTimeout(() => {
          element.classList.remove("bg-emerald-100", "dark:bg-emerald-900/40")
        }, 3000)
      }
    }
  }, [isInitialized, initialAyah, readerMode])

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

              <Button
                variant="outline"
                size="sm"
                className="h-10 w-auto sm:px-4 items-center rounded-xl flex"
                title="عرض التفسير"
                onClick={handleTafseerButtonClick}
              >
                <BookOpen className="h-4 w-4 sm:ml-2" />
                <span className="hidden sm:inline">عرض التفسير</span>
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
                    <div className="text-center py-3 md:py-8">
                      <p className="font-amiri text-3xl md:text-4xl text-emerald-800 dark:text-emerald-400">
                        بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                      </p>
                    </div>
                  )}

                  {/* Ayahs */}
                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-4 md:p-8 rounded-2xl bg-white/50 dark:bg-black/5 border border-emerald-50 dark:border-emerald-900/10 shadow-inner">
                    <div className="font-amiri text-xl md:text-3xl lg:text-4xl leading-[3.5] md:leading-[3.5] text-justify text-emerald-950 dark:text-emerald-50" dir="rtl">
                      {surahContent.map((ayah) => (
                        <span
                          key={ayah.number}
                          id={`ayah-${ayah.numberInSurah}`}
                          className="inline group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg px-1 transition-all cursor-pointer decoration-emerald-200/50 underline-offset-8"
                        >
                          {ayah.text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}
                          <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 mx-2 align-middle text-sm md:text-base border-2 border-emerald-200 rounded-full text-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 font-sans font-bold">
                            {ayah.numberInSurah}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full min-h-[800px] flex flex-col items-center bg-[#fffdf5] dark:bg-[#1a1c1e]/10 py-10 px-4">
                  <div className="relative bg-[#fffdf5] w-full max-w-[650px] aspect-[1/1.5] shadow-2xl rounded-lg overflow-hidden border">
                    <Image
                      src={`https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/master/${currentPage.toString().padStart(3, '0')}.png`}
                      alt={`الصفحة رقم ${currentPage}`}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>

                  {/* Floating Controls for Image Mode */}
                  <div className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-semibold bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-md"
                    >
                      <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden sm:inline">الصفحة السابقة</span>
                      <span className="sm:hidden">السابقة</span>
                    </Button>

                    <div className="flex flex-col items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium">الصفحة</span>
                      <span className="text-xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-300">{currentPage}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === 604}
                      className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base font-semibold bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl shadow-md"
                    >
                      <span className="hidden sm:inline">الصفحة التالية</span>
                      <span className="sm:hidden">التالية</span>
                      <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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

      {/* Tafseer Selection Dialog */}
      <Dialog open={isTafseerDialogOpen} onOpenChange={setIsTafseerDialogOpen}>
        <DialogContent className="w-[95%] px-3 sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">اختر التفسير</DialogTitle>
            <DialogDescription className="text-center">
              اختر مصدر التفسير الذي تريد عرضه للصفحة الحالية
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
            {availableTafseers.length === 0 ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600 mb-2" />
                <p className="text-sm text-muted-foreground">جاري تحميل التفاسير...</p>
              </div>
            ) : (
              availableTafseers.map((tafseer) => (
                <Button
                  key={tafseer.id}
                  variant="outline"
                  className="h-auto py-4 px-6 justify-start text-right hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 hover:border-emerald-300 transition-all"
                  onClick={() => handleTafseerSelect(tafseer.id)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <span className="font-bold text-lg">{tafseer.name}</span>
                    {tafseer.author && (
                      <span className="text-sm text-muted-foreground">{tafseer.author}</span>
                    )}
                  </div>
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tafseer Display Sheet */}
      <Sheet open={isTafseerSheetOpen} onOpenChange={setIsTafseerSheetOpen}>
        <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-12 w-12 rounded-full"
              onClick={() => setIsTafseerSheetOpen(false)}
            >
              <X className="h-10 w-10" />
            </Button>
            <SheetTitle className="text-2xl font-bold text-center pt-4">
              {availableTafseers.find(t => t.id === selectedTafseerId)?.name || "التفسير"}
            </SheetTitle>
            <SheetDescription className="text-center">
              {tafseerRange ? (
                <span className="block mt-1 font-amiri text-lg font-normal text-muted-foreground">
                  {tafseerRange.surah} • من الآية {tafseerRange.start} إلى {tafseerRange.end}
                </span>
              ) : (
                readerMode === "image" ? `الصفحة ${currentPage}` : `سورة ${activeSurah?.name}`
              )}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {isFetchingTafseer ? (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-emerald-600 mb-4" />
                <p className="text-emerald-700 font-medium">جاري تحميل التفسير...</p>
              </div>
            ) : tafseerData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لا يوجد تفسير متاح</p>
              </div>
            ) : (
              tafseerData.map((tafseer, index) => (
                <Card key={index} className="overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/30">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-emerald-600 text-white px-3 py-1">
                        الآية {tafseer.ayah_number}
                      </Badge>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <p className="font-amiri text-xl leading-relaxed text-justify" dir="rtl">
                        {tafseer.text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
