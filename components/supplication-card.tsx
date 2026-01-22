"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quote, ChevronRight, RefreshCw, ChevronLeft, Copy, Heart } from "lucide-react"
import { ShareSupplication } from "@/components/share-supplication"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

// Define the type here or allow passing it in if already defined elsewhere
interface AzkarResponse {
    zekr: string
    repeat: number
    translation?: string
    bless?: string
    source?: string
    category?: string // Add category to the props if available
}

interface SupplicationCardProps {
    zekr: AzkarResponse
    id?: string // Added ID prop for consistency
    onNext?: () => void
    onPrevious?: () => void
    storageKey?: string
    onReset?: () => void
    showReset?: boolean
    hasPrevious?: boolean
    hasNext?: boolean
    viewOnly?: boolean // For Favorites Page (no next/prev navigation interaction logic needed)
}

export function SupplicationCard({
    zekr,
    id,
    onNext,
    onPrevious,
    storageKey,
    onReset,
    showReset,
    hasPrevious,
    hasNext,
    viewOnly = false
}: SupplicationCardProps) {
    const [isCopied, setIsCopied] = useState(false)
    const [currentRepeat, setCurrentRepeat] = useState(0)

    const { isFavorite, addFavorite, removeFavorite } = useFavorites()
    // Generate a unique-ish ID for the zekr since API doesn't provide one.
    // Use the passed ID if available (from favorites page), otherwise calculate it.
    const supplicationId = id || btoa(unescape(encodeURIComponent(zekr.zekr.slice(0, 50) + (zekr.category || ""))))
    const isFav = isFavorite(supplicationId, "supplication")

    // Initialize repeat count from storage
    useEffect(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey)
            if (saved) {
                setCurrentRepeat(parseInt(saved, 10))
            } else {
                setCurrentRepeat(0)
            }
        }
    }, [storageKey])

    const handleCopy = () => {
        navigator.clipboard.writeText(zekr.zekr)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleInteraction = () => {
        if (viewOnly) return

        const target = zekr.repeat || 1

        // If it has repetitions
        if (target > 1) {
            const nextVal = currentRepeat + 1
            setCurrentRepeat(nextVal)
            if (storageKey) localStorage.setItem(storageKey, nextVal.toString())

            if (nextVal >= target) {
                // Completed repetitions, move to next after short delay
                setTimeout(() => {
                    if (storageKey) localStorage.removeItem(storageKey) // Clear repeat progress for this item
                    if (onNext) onNext()
                }, 300)
            }
        } else {
            // No repetitions, just go next
            if (onNext) onNext()
        }
    }

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFav) {
            removeFavorite(supplicationId, "supplication")
        } else {
            addFavorite({
                type: "supplication",
                id: supplicationId,
                data: {
                    id: supplicationId,
                    text: zekr.zekr,
                    category: zekr.category || "General",
                    count: zekr.repeat,
                    translation: zekr.translation
                }
            })
        }
    }

    // Calculate progress for button text
    const target = zekr.repeat || 1
    const isCompleted = currentRepeat >= target
    const buttonText = target > 1
        ? `${currentRepeat}/${target}`
        : "ذكر آخر"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="w-full max-w-2xl mx-auto overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50 shadow-xl bg-white/50 dark:bg-card/50 backdrop-blur-sm relative">
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

                <CardContent
                    className={cn(
                        "pt-8 pb-8 px-6 md:px-10 text-center space-y-9 select-none active:scale-[0.99] transition-transform",
                        !viewOnly && "cursor-pointer"
                    )}
                    onClick={handleInteraction}
                >
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
                    <div className=" hidden sm:flex flex-col gap-1">
                        <ShareSupplication zekr={zekr} />
                    </div>

                    {!viewOnly && (
                        <div className="flex items-center gap-1 w-full sm:w-auto justify-center mt-2 sm:mt-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onPrevious}
                                disabled={!hasPrevious}
                                className="h-9 w-9 rounded-full border border-emerald-400 text-emerald-500 hover:text-emerald-700 dark:border-emerald-900"
                                title="السابق"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Button
                                onClick={handleInteraction}
                                size="sm"
                                disabled={isCompleted && target > 1}
                                className="flex-1 sm:flex-none gap-2 bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]"
                            >
                                {buttonText}
                                {target <= 1 && <RefreshCw className="h-4 w-4" />}
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onNext}
                                disabled={!hasNext}
                                className="h-9 w-9 rounded-full border border-emerald-400 text-emerald-500 hover:text-emerald-700 dark:border-emerald-900"
                                title="التالي"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            {showReset && (
                                <Button variant="ghost" size="sm" onClick={onReset} className="hidden sm:block h-9 px-3 text-xs border text-muted-foreground hover:text-red-600">
                                    إعادة البدء
                                </Button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            className={`gap-2 ${isCopied ? "border-emerald-500 text-emerald-600" : ""}`}
                        >
                            {isCopied ? "تم النسخ" : "نسخ النص"}
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                "rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/20",
                                isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground/90 border-2 border-muted-foreground/20 hover:text-red-500"
                            )}
                            onClick={handleFavorite}
                        >
                            المفضلة
                            <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
                        </Button>
                        <div className="flex sm:hidden flex-col gap-1">
                            <ShareSupplication zekr={zekr} />
                        </div>
                        {showReset && !viewOnly && (
                            <Button variant="ghost" size="sm" onClick={onReset} className="sm:hidden h-9 px-3 text-xs border text-muted-foreground hover:text-red-600">
                                إعادة البدء
                            </Button>
                        )}
                        {/* View Only Remove Button is better handled outside or integrated?
                            For now, the heart button is sufficient.
                          */}
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
