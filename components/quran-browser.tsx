"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Search, ChevronLeft, ChevronRight, Type, Image as ImageIcon, Loader2, Info, ArrowRight, X, BookOpen, Minimize2, Maximize2 } from "lucide-react"
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
import { Slider } from "@/components/ui/slider"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import dynamic from "next/dynamic"

// --- Lazy Components ---

const TafseerDialog = dynamic(() => import("./quran/tafseer-dialog"), {
  loading: () => <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
})

const TafseerSheet = dynamic(() => import("./quran/tafseer-sheet"), {
  loading: () => <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
})

// --- Memoized Components ---

const AyahItem = React.memo(({
  ayah,
  fontSize,
  isTafseerMode = false
}: {
  ayah: Ayah,
  fontSize: number,
  isTafseerMode?: boolean
}) => {
  return (
    <span
      id={`ayah-${ayah.numberInSurah}`}
      className="inline group hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg px-1 transition-all cursor-pointer decoration-emerald-200/50 underline-offset-8"
    >
      {ayah.text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "")}
      <span
        className="inline-flex items-center justify-center mx-2 align-middle border-2 border-emerald-200 rounded-full text-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/20 font-sans font-bold"
        style={{
          width: `${fontSize * 1.1}px`,
          height: `${fontSize * 1.1}px`,
          fontSize: `${fontSize * 0.45}px`
        }}
      >
        {ayah.numberInSurah}
      </span>
    </span>
  )
})

AyahItem.displayName = "AyahItem"

const ReaderContent = React.memo(({
  pageContent,
  fontSize,
  currentSurahNum,
  activeSurah,
  currentPage,
  handlePageChange
}: {
  pageContent: Ayah[],
  fontSize: number,
  currentSurahNum: number,
  activeSurah: any,
  currentPage: number,
  handlePageChange: (page: number) => void
}) => {
  const groupedAyahs = useMemo(() => {
    return Object.entries(
      pageContent.reduce((acc: Record<number, Ayah[]>, ayah) => {
        const sNum = (ayah as any).surah?.number || currentSurahNum
        if (!acc[sNum]) acc[sNum] = []
        acc[sNum].push(ayah)
        return acc
      }, {})
    )
  }, [pageContent, currentSurahNum])

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div
        className="font-amiri text-justify leading-[2.5] text-emerald-950 dark:text-emerald-50 space-y-8"
        dir="rtl"
        style={{ fontSize: `${fontSize}px` }}
      >
        {groupedAyahs.map(([sNum, ayahs]) => {
          const surahInfo = (ayahs[0] as any).surah || activeSurah
          const showBasmala = parseInt(sNum) !== 1 && parseInt(sNum) !== 9 && ayahs[0].numberInSurah === 1

          return (
            <div key={sNum} className="space-y-6">
              <div className="text-center py-4">
                <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400 font-amiri border-y-2 border-emerald-100 dark:border-emerald-900/30 py-2 inline-block px-8 rounded-full">
                  سورة {surahInfo.name}
                </h3>
              </div>

              {showBasmala && (
                <div className="text-center py-4">
                  <p className="font-amiri text-emerald-800 dark:text-emerald-400 opacity-90" style={{ fontSize: `${fontSize * 1.2}px` }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              <div className="max-h-none overflow-visible">
                {ayahs.map((ayah) => (
                  <AyahItem key={ayah.number} ayah={ayah} fontSize={fontSize} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Page Navigation Controls */}
      <div className="mt-8 sm:mt-12 flex items-center justify-center gap-3 sm:gap-6">
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
  )
})

ReaderContent.displayName = "ReaderContent"

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
  const [pageContent, setPageContent] = useState<Ayah[]>([])
  const [fontSize, setFontSize] = useState<number>(24)
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

  // Toolbar State
  const [isToolbarMinimized, setIsToolbarMinimized] = useState(false)

  // Derived
  const activeSurah = useMemo(() => surahs.find(s => s.number === currentSurahNum), [surahs, currentSurahNum])

  // --- Persistence Handlers ---
  const saveState = useCallback((surah: number, page: number, juz: number, mode: "text" | "image", size: number) => {
    localStorage.setItem("quran-state", JSON.stringify({ surah, page, juz, readerMode: mode, fontSize: size }))
  }, [])

  // --- In-Memory Cache ---
  const apiCache = React.useRef<Record<string, any>>({})

  const fetchWithCache = useCallback(async (key: string, fetcher: () => Promise<any>) => {
    if (apiCache.current[key]) return apiCache.current[key]
    const data = await fetcher()
    if (data) apiCache.current[key] = data
    return data
  }, [])

  // --- Data Fetching ---

  const fetchSurahData = useCallback(async (num: number) => {
    setIsLoading(true)
    try {
      const data = await fetchWithCache(`surah-${num}`, async () => {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}`)
        const json = await res.json()
        return json.code === 200 ? json.data.ayahs : null
      })
      if (data) {
        setSurahContent(data)
        return data
      }
    } catch (error) {
      console.error("Failed to fetch surah", error)
    } finally {
      setIsLoading(false)
    }
    return []
  }, [fetchWithCache])

  const fetchPageData = useCallback(async (page: number) => {
    setIsLoading(true)
    try {
      const data = await fetchWithCache(`page-${page}`, async () => {
        const res = await fetch(`https://api.alquran.cloud/v1/page/${page}`)
        const json = await res.json()
        return json.code === 200 ? json.data.ayahs : null
      })
      if (data) {
        setPageContent(data)
        return data
      }
    } catch (error) {
      console.error("Failed to fetch page content", error)
    } finally {
      setIsLoading(false)
    }
    return []
  }, [fetchWithCache])

  // --- Actions ---

  const handleSelectSurah = async (num: number) => {
    setCurrentSurahNum(num)
    const ayahs = await fetchSurahData(num)
    if (ayahs.length > 0) {
      const page = ayahs[0].page
      const juz = ayahs[0].juz
      setCurrentPage(page)
      setCurrentJuz(juz)
      await fetchPageData(page)
      saveState(num, page, juz, readerMode, fontSize)
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
        await fetchPageData(page)
        saveState(surahNum, page, juz, readerMode, fontSize)
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
        await fetchPageData(page)
        saveState(surahNum, page, juz, readerMode, fontSize)
      }
    } catch (error) {
      console.error("Failed to fetch page info", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReaderMode = (mode: "text" | "image") => {
    setReaderMode(mode)
    saveState(currentSurahNum, currentPage, currentJuz, mode, fontSize)
  }

  const toggleToolbar = () => {
    const newState = !isToolbarMinimized
    setIsToolbarMinimized(newState)
    localStorage.setItem("quran-toolbar-minimized", String(newState))
  }

  const handleFontSizeChange = (value: number[]) => {
    const newSize = value[0]
    setFontSize(newSize)
    saveState(currentSurahNum, currentPage, currentJuz, readerMode, newSize)
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
      await fetchPageData(ayah.page)
      saveState(ayah.surah.number, ayah.page, ayah.juz, readerMode, fontSize)
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

  // Initialization: Load from props or localStorage
  useEffect(() => {
    const saved = localStorage.getItem("quran-state")
    let initialSurahNum = initialSurah || 1
    let initialPageNum = 1
    let initialJuzNum = 1
    let initialMode: "text" | "image" = "image"
    let initialFontSize = 24

    // Load minimized state
    const savedMinimized = localStorage.getItem("quran-toolbar-minimized")
    if (savedMinimized === "true") setIsToolbarMinimized(true)

    const initialize = async () => {
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (!initialSurah) initialSurahNum = parsed.surah || 1
          initialPageNum = parsed.page || 1
          initialJuzNum = parsed.juz || 1
          if (!initialAyah) initialMode = parsed.readerMode || "image"
          initialFontSize = parsed.fontSize || 24
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
      setFontSize(initialFontSize)

      await fetchSurahData(initialSurahNum)
      await fetchPageData(initialPageNum)
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
          <div className={`sticky top-16 z-30 bg-background/95 backdrop-blur-xl border-2 border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-lg transition-all duration-300 ${isToolbarMinimized ? 'p-2 w-fit mx-auto' : 'p-3'}`}>

            {!isToolbarMinimized ? (
              // MAXIMIZED VIEW
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                <div className="flex sm:hidden relative w-full transition-all duration-300">
                  <div className="flex items-center bg-background rounded-xl overflow-hidden border-2 border-emerald-400/40 transition-colors h-10 px-1 w-full ring-2 ring-emerald-500/20">
                    <div className="rounded-lg h-8 w-8 flex items-center justify-center shrink-0">
                      <Search className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="ابحث في القرآن..."
                        className="border-none bg-transparent h-8 focus-visible:ring-0 text-sm p-0 shadow-none placeholder:text-muted-foreground/60 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                        className="rounded-lg h-8 w-8 shrink-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Search Results Dropdown - Independent of isSearchOpen for mobile */}
                  <AnimatePresence>
                    {(searchQuery || isSearching) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 left-0 right-0 w-full bg-background border-2 border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 space-y-1"
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
                {/* Top Row: Search & Selectors */}
                <div className="flex items-center gap-2 w-full md:w-auto md:flex-1 min-w-0">
                  {/* Animated Search Section */}
                  <div className=" hidden sm:flex relative shrink-0">
                    <motion.div
                      initial={false}
                      animate={{
                        width: isSearchOpen ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : '280px') : '40px',
                        position: isSearchOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 'absolute' : 'relative',
                        zIndex: 20,
                        borderColor: isSearchOpen ? 'rgba(52, 211, 153, 0.4)' : 'transparent'
                      }}
                      className={`flex items-center bg-muted/30 rounded-xl overflow-hidden border-2 transition-colors h-10 px-1 ${isSearchOpen && typeof window !== 'undefined' && window.innerWidth < 640 ? 'left-0 right-0 w-full bg-background ring-2 ring-emerald-500/20' : ''}`}
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
                          className="flex-1 min-w-[200px]"
                        >
                          <Input
                            autoFocus
                            placeholder="ابحث..."
                            className="border-none bg-transparent h-8 focus-visible:ring-0 text-sm p-0 shadow-none placeholder:text-muted-foreground/60 w-full"
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

                  {/* Selectors - Scrollable on mobile */}
                  <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide mask-fade-md">
                    {/* Juz Selector */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Select value={currentJuz.toString()} onValueChange={(v) => handleSelectJuz(parseInt(v))}>
                        <SelectTrigger className="w-[85px] sm:w-[110px] h-10 border-none shadow-none focus:ring-0 font-bold bg-muted/30 rounded-xl px-2">
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

                    <Separator orientation="vertical" className="h-6 hidden sm:block" />

                    {/* Surah Selector */}
                    <Select value={currentSurahNum.toString()} onValueChange={(v) => handleSelectSurah(parseInt(v))}>
                      <SelectTrigger className=" w-fit max-w-40 flex-1 h-10 border-none shadow-none focus:ring-0 font-amiri text-base sm:text-lg font-bold bg-muted/30 rounded-xl px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-fit">
                        {surahs.map(s => (
                          <SelectItem key={s.number} value={s.number.toString()} className="font-amiri w-fit text-lg">
                            {s.number}. {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="h-6 hidden sm:block" />

                    {/* Page Selector */}
                    <Select value={currentPage.toString()} onValueChange={(v) => handlePageChange(parseInt(v))}>
                      <SelectTrigger className=" w-[75px] sm:w-[90px] h-10 border-none shadow-none focus:ring-0 bg-muted/30 rounded-xl px-2 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {Array.from({ length: 604 }, (_, i) => i + 1).map(p => (
                          <SelectItem key={p} value={p.toString()}>ص {p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="md:hidden w-full bg-border/40" />

                {/* Bottom Row (Mobile): Toggles & Actions */}
                <div className="flex items-center justify-between w-full md:w-auto gap-2">
                  <div className="bg-muted/50 p-1 rounded-xl flex items-center gap-1">
                    <Button
                      variant={readerMode === "image" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleReaderMode("image")}
                      className="h-9 rounded-lg px-3 flex-1 sm:flex-none"
                    >
                      <ImageIcon className="h-4 w-4 md:ml-2" />
                      <span className="hidden md:inline">مصحف</span>
                    </Button>
                    <Button
                      variant={readerMode === "text" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => toggleReaderMode("text")}
                      className="h-9 rounded-lg px-3 flex-1 sm:flex-none"
                    >
                      <Type className="h-4 w-4 md:ml-2" />
                      <span className="hidden md:inline">نص</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 px-3 items-center rounded-xl flex border-emerald-200 dark:border-emerald-800"
                      title="عرض التفسير"
                      onClick={handleTafseerButtonClick}
                    >
                      <BookOpen className="h-4 w-4 md:ml-2" />
                      <span className="hidden md:inline">التفسير</span>
                    </Button>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 px-3 items-center rounded-xl flex border-emerald-200 dark:border-emerald-800"
                          title="حجم الخط"
                        >
                          <Type className="h-4 w-4 md:ml-2" />
                          <span className="inline text-xs font-bold">{fontSize} حجم الخط</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-60 p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">حجم الخط</span>
                            <span className="text-sm font-bold text-emerald-600">{fontSize}px</span>
                          </div>
                          <Slider
                            value={[fontSize]}
                            onValueChange={handleFontSizeChange}
                            min={16}
                            max={64}
                            step={1}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="ghost"
                      size="sm"
                      className=" sm:hidden h-10 w-10 rounded-xl p-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-muted-foreground"
                      title="تصغير الشريط"
                      onClick={toggleToolbar}
                    >
                      <Minimize2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // MINIMIZED VIEW
              <div className="flex items-center gap-3 px-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-xl p-0 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  title="تكبير الشريط"
                  onClick={toggleToolbar}
                >
                  <Maximize2 className="h-5 w-5 text-emerald-600" />
                </Button>

                <div className="h-6 w-px bg-border/60" />

                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="font-amiri text-lg text-emerald-800 dark:text-emerald-300">
                    {readerMode === 'image' || activeSurah ? activeSurah?.name : 'القرآن الكريم'}
                  </span>
                  <span className="text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md text-xs">
                    ص {currentPage}
                  </span>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= 604}
                    className="h-8 w-8 rounded-lg"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 w-8 rounded-lg"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Reader Content Area */}
          <div className="relative min-h-[700px]">
            {isLoading || !isInitialized ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 rounded-3xl">
                <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
                <p className="text-emerald-700 font-medium animate-pulse">جاري تحميل الآيات المباركة...</p>
              </div>
            ) : null}

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                const threshold = 80 // px
                if (info.offset.x > threshold) {
                  // Swipe Right -> Next Page
                  if (currentPage < 604) handlePageChange(currentPage + 1)
                } else if (info.offset.x < -threshold) {
                  // Swipe Left -> Previous Page
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }
              }}
              className="bg-white dark:bg-card border-2 border-emerald-50 dark:border-emerald-950/20 rounded-3xl shadow-sm overflow-hidden min-h-auto cursor-grab active:cursor-grabbing touch-pan-y"
            >
              {readerMode === "text" ? (
                <ReaderContent
                  pageContent={pageContent}
                  fontSize={fontSize}
                  currentSurahNum={currentSurahNum}
                  activeSurah={activeSurah}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              ) : (
                <div className="relative w-full h-auto flex flex-col items-center bg-[#fffdf5] dark:bg-[#1a1c1e]/10 py-10 px-4">
                  <div className="relative bg-[#fffdf5] h-auto w-full max-w-[650px] aspect-[1/1.5] shadow-2xl rounded-lg overflow-hidden border">
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
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx global>{`
        .font-amiri {
          font-family: var(--font-amiri), serif;
        }
      `}</style>

      <TafseerDialog
        open={isTafseerDialogOpen}
        onOpenChange={setIsTafseerDialogOpen}
        availableTafseers={availableTafseers}
        onSelect={handleTafseerSelect}
      />

      <TafseerSheet
        open={isTafseerSheetOpen}
        onOpenChange={setIsTafseerSheetOpen}
        tafseerName={availableTafseers.find(t => t.id === selectedTafseerId)?.name}
        tafseerRange={tafseerRange}
        isFetching={isFetchingTafseer}
        tafseerData={tafseerData}
        currentPage={currentPage}
        activeSurahName={activeSurah?.name}
        readerMode={readerMode}
      />
    </div>
  )
}
