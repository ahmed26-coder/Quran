"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { ShareHadith } from "./share-hadith"
import { useFavorites } from "@/hooks/use-favorites"
import { Heart } from "lucide-react"

export interface Hadith {
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

interface HadithCardProps {
    hadith: Hadith
    index: number
    isExpanded: boolean
    onToggle: () => void
    onCopy: (text: string) => void
    bookNameAr: string
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case "sahih":
            return "bg-emerald-500 hover:bg-emerald-600"
        case "hasan":
            return "bg-amber-500 hover:bg-amber-600"
        case "da'if":
        case "da'eef":
            return "bg-rose-500 hover:bg-rose-600"
        default:
            return "bg-slate-500"
    }
}

export const HadithCard = memo(function HadithCard({
    hadith,
    index,
    isExpanded,
    onToggle,
    onCopy,
    bookNameAr,
}: HadithCardProps) {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites()
    const isFav = isFavorite(hadith.id, "hadith")

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFav) {
            removeFavorite(hadith.id, "hadith")
        } else {
            addFavorite({
                type: "hadith",
                id: hadith.id,
                data: {
                    id: hadith.id,
                    text: hadith.hadithArabic,
                    source: bookNameAr,
                    number: hadith.hadithNumber,
                    grade: hadith.status,
                    chapter: hadith.chapter?.chapterArabic || hadith.chapterName
                }
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 15) * 0.05 }}
        >
            <Card className="hover:shadow-lg transition-all duration-300 border-emerald-100/50 dark:border-emerald-900/20 overflow-hidden group">
                <CardHeader className="cursor-pointer select-none" onClick={onToggle}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2 text-right" dir="rtl">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className={`${getStatusColor(hadith.status)} text-white border-0`}>
                                    {hadith.status === "Sahih" || hadith.status === "sahih"
                                        ? "صحيح"
                                        : hadith.status === "Hasan"
                                            ? "حسن"
                                            : hadith.status === "Da'if" || hadith.status === "Da'eef"
                                                ? "ضعيف"
                                                : hadith.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground font-mono">#{hadith.hadithNumber}</span>
                            </div>
                            <CardTitle className="text-xl leading-relaxed font-amiri font-bold text-foreground/90 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {hadith.hadithArabic}
                            </CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm pt-2">
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    {bookNameAr}
                                </span>
                                <span className="text-muted-foreground/50">|</span>
                                <span className="truncate max-w-[200px]">
                                    {hadith.chapter?.chapterArabic || hadith.chapterName}
                                </span>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <div className="flex items-center gap-3 px-4 py-4 border-t border-emerald-50 dark:border-emerald-900/20">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={` rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20 ${isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground/90 border-2 border-muted-foreground/20 hover:border-emerald-50 hover:text-red-500"
                            }`}
                        onClick={handleFavorite}
                    >
                        <Heart className={`h-5 w-5 ${isFav ? "fill-current" : ""}`} />
                        المفضلة
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            onCopy(hadith.hadithArabic)
                        }}
                        className="gap-2 rounded-full w-full sm:max-w-[200px] px-4 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    >
                        <Copy className="h-3.5 w-3.5" />
                        نسخ
                    </Button>
                    <div onClick={(e) => e.stopPropagation()}>
                        <ShareHadith hadith={hadith as any} bookNameAr={bookNameAr} />
                    </div>
                </div>
            </Card>
        </motion.div>
    )
})
