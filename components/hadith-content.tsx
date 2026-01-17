"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, ChevronDown, Copy, Loader2, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { ShareHadith } from "./share-hadith"

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

interface Hadith {
    id: number
    hadithArabic: string
    hadithEnglish?: string
    hadithNumber: string
    bookSlug: string
    status: string
    book?: {
        bookName: string
        bookSlug: string
    }
    chapter?: {
        chapterNumber: string
        chapterArabic: string
    }
    chapterName?: string
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

    // Separate states for Browse vs Search
    const [browseHadiths, setBrowseHadiths] = useState<Hadith[]>([])
    const [searchHadiths, setSearchHadiths] = useState<Hadith[]>([])

    const [activeTab, setActiveTab] = useState("browse")
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [expandedHadith, setExpandedHadith] = useState<number | null>(null)

    // Filters
    const [selectedBook, setSelectedBook] = useState("")
    const [selectedChapter, setSelectedChapter] = useState("")
    const [selectedStatus, setSelectedStatus] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    // Pagination
    const [browsePage, setBrowsePage] = useState(1)
    const [searchPage, setSearchPage] = useState(1)
    const [browseHasMore, setBrowseHasMore] = useState(true)
    const [searchHasMore, setSearchHasMore] = useState(true)

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
        if (!isLoadMore) setLoading(true)
        else setLoadingMore(true)

        try {
            const params: Record<string, string | number> = {
                paginate: 15,
                page: isLoadMore ? browsePage + 1 : 1
            }
            if (selectedBook) params.book = selectedBook
            if (selectedChapter) params.chapter = selectedChapter
            if (selectedStatus) params.status = selectedStatus

            const data = await fetchFromAPI("hadiths", params)
            const newItems = data.hadiths?.data || []

            if (isLoadMore) {
                setBrowseHadiths(prev => [...prev, ...newItems])
                setBrowsePage(prev => prev + 1)
            } else {
                setBrowseHadiths(newItems)
                setBrowsePage(1)
            }

            setBrowseHasMore(!!data.hadiths?.next_page_url)
        } catch (error) {
            console.error(error)
            toast.error("خطأ في جلب الأحاديث")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const searchHadithsAction = async (isLoadMore = false) => {
        if (!searchQuery.trim()) return

        if (!isLoadMore) setLoading(true)
        else setLoadingMore(true)

        try {
            const params = {
                hadithArabic: searchQuery,
                paginate: 15,
                page: isLoadMore ? searchPage + 1 : 1
            }
            const data = await fetchFromAPI("hadiths", params)
            const newItems = data.hadiths?.data || []

            if (isLoadMore) {
                setSearchHadiths(prev => [...prev, ...newItems])
                setSearchPage(prev => prev + 1)
            } else {
                setSearchHadiths(newItems)
                setSearchPage(1)
            }

            setSearchHasMore(!!data.hadiths?.next_page_url)
        } catch (error) {
            toast.error("خطأ أثناء البحث")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    // --- Effects ---
    useEffect(() => { loadBooks() }, [])

    useEffect(() => {
        if (selectedBook) {
            loadChapters(selectedBook)
            setBrowseHadiths([]) // Clear current to show loading
            loadHadiths()
        }
    }, [selectedBook, selectedChapter, selectedStatus])

    // Initial load for browse
    useEffect(() => {
        if (activeTab === "browse" && browseHadiths.length === 0 && !selectedBook) {
            loadHadiths()
        }
    }, [activeTab])

    // --- UI Helpers ---
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("تم نسخ الحديث بنجاح")
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "sahih": return "bg-emerald-500 hover:bg-emerald-600"
            case "hasan": return "bg-amber-500 hover:bg-amber-600"
            case "da'if": return "bg-rose-500 hover:bg-rose-600"
            default: return "bg-slate-500"
        }
    }

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

    const renderHadithCard = (hadith: Hadith, index: number) => (
        <motion.div
            key={`${hadith.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index % 15 * 0.05 }}
        >
            <Card className="hover:shadow-lg transition-all duration-300 border-emerald-100/50 dark:border-emerald-900/20 overflow-hidden group">
                <CardHeader
                    className="cursor-pointer select-none"
                    onClick={() => setExpandedHadith(expandedHadith === index ? null : index)}
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2 text-right" dir="rtl">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={`${getStatusColor(hadith.status)} text-white border-0`}>
                                    {hadith.status === 'Sahih' ? 'صحيح' : hadith.status === 'Hasan' ? 'حسن' : (hadith.status === "Da'if" || hadith.status === "Da'eef") ? 'ضعيف' : hadith.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">#{hadith.hadithNumber}</span>
                            </div>
                            <CardTitle className="text-xl leading-relaxed font-amiri font-bold text-foreground/90 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {hadith.hadithArabic}
                            </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm pt-2">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {getArabicBookName(hadith.bookSlug, hadith.book?.bookName || hadith.bookSlug)}
                                </span>
                                <span className="text-muted-foreground/50">|</span>
                                <span className="truncate max-w-[200px]">{hadith.chapter?.chapterArabic || hadith.chapterName}</span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <div className="flex items-center gap-3 px-4 py-4 border-t border-emerald-50 dark:border-emerald-900/20">
                    <Button variant="secondary" size="sm" onClick={() => copyToClipboard(hadith.hadithArabic)} className="gap-2 rounded-full w-full sm:max-w-[200px] px-4 hover:bg-emerald-100 dark:hover:bg-emerald-900/30">
                        <Copy className="h-3.5 w-3.5" />
                        نسخ
                    </Button>
                    <ShareHadith
                        hadith={hadith}
                        bookNameAr={getArabicBookName(hadith.bookSlug, hadith.book?.bookName || hadith.bookSlug)}
                    />
                </div>
            </Card>
        </motion.div>
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
                                    placeholder="ابحث بالنص العربي للحديث..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && searchHadithsAction()}
                                    className="w-full h-14 border-0 pr-12 text-lg focus-visible:ring-0 rounded-xl"
                                />
                                <Button
                                    onClick={() => { setActiveTab("search"); searchHadithsAction(); }}
                                    className="ml-2 mr-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-10 px-6"
                                >
                                    بحث
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Tabs */}
            <section className="container px-4 py-8 mx-auto mb-20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b">
                        <TabsList className="bg-emerald-50/50 dark:bg-emerald-950/20 p-1 rounded-xl h-auto">
                            <TabsTrigger value="browse" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-900/50 data-[state=active]:shadow-sm">
                                <BookOpen className="h-4 w-4 ml-2" />
                                تصفح الكتب
                            </TabsTrigger>
                            <TabsTrigger value="search" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-emerald-900/50 data-[state=active]:shadow-sm">
                                <Search className="h-4 w-4 ml-2" />
                                نتائج البحث
                            </TabsTrigger>
                        </TabsList>

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

                    <TabsContent value="browse">
                        {loading ? renderSkeletons() : (
                            <div className="grid gap-6">
                                {browseHadiths.map((h, i) => renderHadithCard(h, i))}
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
                        {searchQuery && !loading && searchHadiths.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl border border-dashed text-foreground">
                                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                <h3 className="text-xl font-bold">عذراً، لم نجد نتائج</h3>
                                <p className="text-muted-foreground mt-2">جرب البحث بكلمات أخرى أو اختر كتاباً محدداً</p>
                            </div>
                        ) : loading ? renderSkeletons() : (
                            <div className="grid gap-6">
                                {searchHadiths.map((h, i) => renderHadithCard(h, i))}
                                {searchHadiths.length > 0 && searchHasMore && (
                                    <div className="flex justify-center pt-8">
                                        <Button
                                            onClick={() => searchHadithsAction(true)}
                                            disabled={loadingMore}
                                            className="rounded-full px-12 h-12 bg-white dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 border transition-all shadow-sm"
                                        >
                                            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <RefreshCcw className="h-4 w-4 ml-2" />}
                                            تحميل المزيد من النتائج
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                        {!searchQuery && (
                            <div className="text-center py-20">
                                <p className="text-muted-foreground">ابدأ بالبحث عن حديث لعرض النتائج هنا</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
