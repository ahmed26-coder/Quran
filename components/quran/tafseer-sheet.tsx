import * as React from "react"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { type TafseerText, type TafseerSource } from "@/lib/tafseer-api"

interface TafseerSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    tafseerName?: string
    tafseerRange: { surah: string, start: number, end: number } | null
    isFetching: boolean
    tafseerData: TafseerText[]
    currentPage: number
    activeSurahName?: string
    readerMode: "text" | "image"
}

export default function TafseerSheet({
    open,
    onOpenChange,
    tafseerName,
    tafseerRange,
    isFetching,
    tafseerData,
    currentPage,
    activeSurahName,
    readerMode
}: TafseerSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 rounded-full"
                        onClick={() => onOpenChange(false)}
                    >
                        <X className="h-10 w-10" />
                    </Button>
                    <SheetTitle className="text-2xl font-bold text-center pt-4">
                        {tafseerName || "التفسير"}
                    </SheetTitle>
                    <SheetDescription className="text-center">
                        {tafseerRange ? (
                            <span className="block mt-1 font-amiri text-lg font-normal text-muted-foreground">
                                {tafseerRange.surah} • من الآية {tafseerRange.start} إلى {tafseerRange.end}
                            </span>
                        ) : (
                            readerMode === "image" ? `الصفحة ${currentPage}` : `سورة ${activeSurahName}`
                        )}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {isFetching ? (
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
    )
}
