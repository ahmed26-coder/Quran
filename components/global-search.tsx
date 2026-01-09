"use client"

import * as React from "react"
import { useState, useEffect, useCallback, memo } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, User, BookOpen, ArrowRight } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Reciter {
    id: number
    name: string
}

interface Surah {
    number: number
    name: string
}

interface SearchResult {
    verse_key: string
    text: string
    verse_id: number
}

function GlobalSearchComponent() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [reciters, setReciters] = useState<Reciter[]>([])
    const [surahs, setSurahs] = useState<Surah[]>([])
    const [verses, setVerses] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Fetch reciters and surahs once
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch reciters
                const recitersRes = await fetch("https://mp3quran.net/api/v3/reciters?language=ar")
                const recitersData = await recitersRes.json()
                if (recitersData.reciters) {
                    setReciters(recitersData.reciters)
                }

                // Fetch surahs
                const surahsRes = await fetch("http://api.alquran.cloud/v1/surah")
                const surahsData = await surahsRes.json()
                if (surahsData.data) {
                    setSurahs(surahsData.data)
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
            }
        }
        fetchData()
    }, [])

    // Debounced verse search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setVerses([])
                return
            }

            setIsLoading(true)
            try {
                const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=10`)
                const data = await res.json()
                if (data.search && data.search.results) {
                    setVerses(data.search.results)
                }
            } catch (error) {
                console.error("Verse search failed", error)
            } finally {
                setIsLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const filteredReciters = reciters
        .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)

    const handleSelectReciter = (id: number) => {
        setOpen(false)
        router.push(`/sheikhs/${id}`)
    }

    const handleSelectVerse = (verseKey: string) => {
        const [surah, ayah] = verseKey.split(":")
        setOpen(false)
        router.push(`/quran?surah=${surah}&ayah=${ayah}`)
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="text-emerald-600"
            >
                <Search className="h-5 w-5" />
                <span className="sr-only">بحث</span>
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                commandProps={{ shouldFilter: false }}
            >
                <CommandInput
                    placeholder="ابحث عن قارئ أو آية..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList className="max-h-[450px] overflow-y-auto">
                    {isLoading && (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                            <span className="mr-2 text-sm text-muted-foreground">جاري البحث...</span>
                        </div>
                    )}

                    {!isLoading && query.length > 0 && filteredReciters.length === 0 && verses.length === 0 && (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            لا توجد نتائج للبحث عن "{query}"
                        </div>
                    )}

                    {filteredReciters.length > 0 && (
                        <CommandGroup heading="القراء">
                            {filteredReciters.map((reciter) => (
                                <CommandItem
                                    key={`reciter-${reciter.id}`}
                                    value={reciter.name}
                                    onSelect={() => handleSelectReciter(reciter.id)}
                                    className="flex items-center justify-between p-2 sm:p-3 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100/50 text-emerald-700 shrink-0">
                                            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        </div>
                                        <span className="font-bold text-sm sm:text-base truncate">{reciter.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] sm:text-[10px] shrink-0">قارئ</Badge>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {verses.length > 0 && (
                        <CommandGroup heading="الآيات">
                            {verses.map((verse) => (
                                <CommandItem
                                    key={`verse-${verse.verse_id}`}
                                    value={verse.text}
                                    onSelect={() => handleSelectVerse(verse.verse_key)}
                                    className="flex flex-col items-start gap-1.5 sm:gap-2 p-2 sm:p-4 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-950/10 border-b last:border-0 border-border/40"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center justify-between gap-1.5 sm:gap-2 flex-wrap">
                                            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground bg-muted/50 px-1 sm:px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <BookOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                {verse.verse_key}
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                                {(() => {
                                                    const surahNum = parseInt(verse.verse_key.split(':')[0])
                                                    const surah = surahs.find((s: Surah) => s.number === surahNum)
                                                    return surah?.name || ''
                                                })()}
                                            </span>
                                        </div>
                                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 opacity-0 group-aria-selected:opacity-100 transition-opacity shrink-0" />
                                    </div>
                                    <p className="font-amiri text-base sm:text-xl leading-relaxed text-right w-full text-emerald-950 dark:text-emerald-50" dir="rtl">
                                        {verse.text}
                                    </p>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export const GlobalSearch = memo(GlobalSearchComponent)
