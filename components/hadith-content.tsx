"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, ChevronDown, Copy, Loader2, RefreshCcw, X } from "lucide-react"
import { toast } from "sonner"
import { ShareHadith } from "./share-hadith"
import { HadithCard, Hadith } from "./hadith-card"

const API_KEY = "$2y$10$IOGpW6bsmPsFE46DIkmqeS1bNCKmOVlk0Jd9ts8BX2EhGJ7fI8"
const API_BASE_URL = "https://www.hadithapi.com/public/api"

const BOOK_NAMES_AR: Record<string, string> = {
    "sahih-bukhari": "صحيح البخاري",
    "sahih-muslim": "صحيح مسلم",
    "al-tirmidhi": "جامع الترمذي",
    "abu-dawood": "سنن أبي داود",
    "ibn-e-majah": "سنن ابن ماجه",
    "sunan-nasai": "سنن النسائي",
    "mishkat": "مشكاة المصابيح",
    "musnad-ahmad": "مسند أحمد",
    "al-silsila-sahiha": "السلسلة الصحيحة"
}

const getArabicBookName = (slug: string, fallback: string) => {
    return BOOK_NAMES_AR[slug] || fallback
}

// Arabic Text Normalization Utility
const normalizeArabic = (text: string) => {
    if (!text) return ""
    return text
        .replace(/[\u064B-\u0652]/g, "") // Remove Tashkeel (diacritics)
        .replace(/[أإآ]/g, "ا")             // Normalize Alephs
        .replace(/ى/g, "ي")               // Normalize Yaa
        .replace(/ة/g, "ه")               // Normalize Taa Marbuta
        .trim()
}



interface Book {
    bookSlug: string
    bookName: string
    hadiths_count: string
}

interface Chapter {
    id: number
    chapterNumber: string
    chapterArabic: string
}

export function HadithContent() {
    // --- States ---
    const [books, setBooks] = useState<Book[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])

    // Unified state for both Browse & Search
    const [browseHadiths, setBrowseHadiths] = useState<Hadith[]>([])

    const [activeTab, setActiveTab] = useState("browse")
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [expandedHadith, setExpandedHadith] = useState<number | null>(null)
    const [isPending, startTransition] = useTransition()

    // Filters
    const [selectedBook, setSelectedBook] = useState("")
    const [selectedChapter, setSelectedChapter] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

    // Pagination
    const [browsePage, setBrowsePage] = useState(1)
    const [browseHasMore, setBrowseHasMore] = useState(true)

    // --- API Helpers ---
    const fetchFromAPI = useCallback(async (endpoint: string, params: Record<string, string | number> = {}) => {
        const queryParams = new URLSearchParams({ apiKey: API_KEY, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) }).toString()
        const response = await fetch(`${API_BASE_URL}/${endpoint}?${queryParams}`)
        const data = await response.json()
        // API returns 404 when no results are found, which we handle as an empty state
        if (data.status !== 200 && data.status !== 404) throw new Error(data.message || "Failed to fetch")
        return data
    }, [])

    // --- Actions ---
    const loadBooks = async () => {
        try {
            const data = await fetchFromAPI("books")
            // Filter out books that have 0 hadiths according to the API
            const availableBooks = (data.books || []).filter((b: Book) => parseInt(b.hadiths_count) > 0)
            setBooks(availableBooks)
        } catch (error) {
            toast.error("حدث خطأ أثناء جلب قائمة الكتب")
        }
    }

    const loadChapters = async (bookSlug: string) => {
        if (!bookSlug) return
        try {
            const data = await fetchFromAPI(`${bookSlug}/chapters`)
            setChapters(data.chapters || [])
        } catch (error) {
            toast.error("حدث خطأ أثناء جلب الفصول")
        }
    }

    const loadHadiths = async (isLoadMore = false) => {
        // Only show full loading state if we have NO data to show
        if (!isLoadMore && browseHadiths.length === 0) {
            setLoading(true)
        }

        if (isLoadMore) setLoadingMore(true)

        try {
            const params: Record<string, string | number> = {
                paginate: 15,
                page: isLoadMore ? browsePage + 1 : 1
            }
            if (selectedBook && selectedBook !== "none") params.book = selectedBook
            if (selectedChapter && selectedChapter !== "none") params.chapter = selectedChapter
            if (selectedStatus && selectedStatus !== "none") params.status = selectedStatus
            if (debouncedSearchQuery) {
                params.hadithArabic = normalizeArabic(debouncedSearchQuery)
            }

            const data = await fetchFromAPI("hadiths", params)
            const newItems = data.hadiths?.data || []

            // Use transition to prioritize UI responsiveness during render updates
            startTransition(() => {
                if (isLoadMore) {
                    setBrowseHadiths(prev => [...prev, ...newItems])
                    setBrowsePage(prev => prev + 1)
                } else {
                    setBrowseHadiths(newItems)
                    setBrowsePage(1)
                }
                setBrowseHasMore(!!data.hadiths?.next_page_url)
            })
        } catch (error) {
            console.error(error)
            toast.error("خطأ في جلب الأحاديث")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }


    // --- Effects ---
    useEffect(() => { loadBooks() }, [])

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 600)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        if (selectedBook && selectedBook !== "none") {
            loadChapters(selectedBook)
        } else {
            setChapters([])
        }
        loadHadiths()
    }, [selectedBook, selectedChapter, selectedStatus, debouncedSearchQuery])

    // Initial load for browse
    useEffect(() => {
        if (activeTab === "browse" && browseHadiths.length === 0 && !selectedBook && !debouncedSearchQuery) {
            loadHadiths()
        }
    }, [activeTab])

    // --- UI Helpers ---
    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("تم نسخ الحديث بنجاح")
    }, [])

    // Memoized handleToggle to prevent re-creation
    const handleToggleExpand = useCallback((id: number) => {
        setExpandedHadith(prev => prev === id ? null : id)
    }, [])

    const renderSkeletons = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-20 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <section className="relative w-full py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-emerald-50/50 dark:bg-emerald-950/20 -z-10" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                <div className="container px-4 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center text-center space-y-8"
                    >
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl pb-4 font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-200">
                                الأحاديث النبوية الشريفة
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                موسوعة رقمية متكاملة لحديث رسول الله ﷺ، تتيح لك البحث والتصفح في أصح الكتب والمصادر الإسلامية.
                            </p>
                        </div>

                        <div className="w-full max-w-2xl relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
                            <div className="relative flex items-center bg-background rounded-xl border border-input shadow-sm">
                                <Search className="absolute right-4 h-5 w-5 text-emerald-500" />
                                <Input
                                    type="text"
                                    placeholder="ابحث بالنص العربي للحديث (مثال: إنما الأعمال)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 border-0 pr-12 text-lg focus-visible:ring-0 rounded-xl"
                                />
                                {searchQuery && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSearchQuery("")}
                                        className="h-8 w-8 ml-2 text-muted-foreground hover:text-emerald-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Tabs */}
            <section className="container px-4 py-8 mx-auto mb-20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b">
                        {activeTab === "browse" && (
                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                <Select
                                    value={selectedBook}
                                    onValueChange={(value) => {
                                        setSelectedBook(value)
                                        setSelectedChapter("")
                                    }}
                                >
                                    <SelectTrigger className="w-full md:w-[180px] bg-background border-emerald-100 dark:border-emerald-900/30">
                                        <SelectValue placeholder="-- كل الكتب --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- كل الكتب --</SelectItem>
                                        {books.map((b) => (
                                            <SelectItem key={b.bookSlug} value={b.bookSlug}>
                                                {getArabicBookName(b.bookSlug, b.bookName)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedChapter}
                                    onValueChange={(value) => setSelectedChapter(value === "none" ? "" : value)}
                                    disabled={!selectedBook}
                                >
                                    <SelectTrigger className="w-full md:w-[220px] bg-background border-emerald-100 dark:border-emerald-900/30">
                                        <SelectValue placeholder="-- كل الفصول --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- كل الفصول --</SelectItem>
                                        {chapters.map((c) => (
                                            <SelectItem key={c.id} value={c.chapterNumber}>
                                                {c.chapterArabic}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedStatus}
                                    onValueChange={(value) => setSelectedStatus(value === "none" ? "" : value)}
                                >
                                    <SelectTrigger className="w-full md:w-[150px] bg-background border-emerald-100 dark:border-emerald-900/30">
                                        <SelectValue placeholder="-- كل الدرجات --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- كل الدرجات --</SelectItem>
                                        <SelectItem value="Sahih">صحيح</SelectItem>
                                        <SelectItem value="Hasan">حسن</SelectItem>
                                        <SelectItem value="Da'if">ضعيف</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <TabsContent value="browse" className="relative min-h-[400px]">
                        {(loading && browseHadiths.length === 0) ? renderSkeletons() : (
                            <div className={`grid gap-6 transition-opacity duration-300`}>
                                {browseHadiths.map((h, i) => (
                                    <HadithCard
                                        key={`${h.id}-${i}`}
                                        hadith={h}
                                        index={i}
                                        isExpanded={expandedHadith === i}
                                        onToggle={() => handleToggleExpand(i)}
                                        onCopy={copyToClipboard}
                                        bookNameAr={getArabicBookName(h.bookSlug, h.book?.bookName || h.bookSlug)}
                                    />
                                ))}
                                {browseHadiths.length > 0 && browseHasMore && (
                                    <div className="flex justify-center pt-8">
                                        <Button
                                            onClick={() => loadHadiths(true)}
                                            disabled={loadingMore}
                                            className="rounded-full px-12 h-12 bg-white dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 border transition-all shadow-sm"
                                        >
                                            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCcw className="h-4 w-4 ml-2" />}
                                            عرض المزيد من الأحاديث
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="search">
                        {debouncedSearchQuery && !loading && browseHadiths.length === 0 ? (
                            <div className="text-center py-20 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-3xl border border-dashed border-emerald-200 dark:border-emerald-800 text-foreground">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-bold">عذراً، لم نجد نتائج للبحث</h3>
                                <p className="text-muted-foreground mt-2">جرب البحث بكلمات أخرى أو تغيير إعدادات الفلترة</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 relative min-h-[200px]">
                                {browseHadiths.map((h, i) => (
                                    <HadithCard
                                        key={`${h.id}-${i}`}
                                        hadith={h}
                                        index={i}
                                        isExpanded={expandedHadith === i}
                                        onToggle={() => handleToggleExpand(i)}
                                        onCopy={copyToClipboard}
                                        bookNameAr={getArabicBookName(h.bookSlug, h.book?.bookName || h.bookSlug)}
                                    />
                                ))}
                                {browseHadiths.length > 0 && browseHasMore && (
                                    <div className="flex justify-center pt-8">
                                        <Button
                                            onClick={() => loadHadiths(true)}
                                            disabled={loadingMore}
                                            className="rounded-full px-12 h-12 bg-white dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 border transition-all shadow-sm"
                                        >
                                            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCcw className="h-4 w-4 ml-2" />}
                                            عرض المزيد من النتائج
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        {!debouncedSearchQuery && (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground italic">اكتب أي كلمة للبحث في الأحاديث...</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
