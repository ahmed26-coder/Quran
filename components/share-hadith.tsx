"use client"

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Share2, Loader2, Link as LinkIcon, FileText, Image as ImageIcon, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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

interface ShareHadithProps {
    hadith: Hadith
    bookNameAr: string
}

export function ShareHadith({ hadith, bookNameAr }: ShareHadithProps) {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const templateRef = useRef<HTMLDivElement>(null)
    const [currentUrl, setCurrentUrl] = useState<string>("")

    useEffect(() => {
        setCurrentUrl(window.location.href)
    }, [])

    const generateImage = async () => {
        if (!templateRef.current) return null

        try {
            setIsGenerating(true)
            await new Promise(resolve => setTimeout(resolve, 500)) // Give more time for fonts/styles

            const dataUrl = await toPng(templateRef.current, {
                quality: 0.95,
                cacheBust: true,
                skipFonts: false,
                pixelRatio: 2, // Better quality
            })

            return dataUrl
        } catch (err) {
            console.error("Failed to generate image", err)
            return null
        } finally {
            setIsGenerating(false)
        }
    }

    // Generate preview when dialog opens
    useEffect(() => {
        if (isOpen && !previewUrl) {
            const createPreview = async () => {
                const url = await generateImage()
                if (url) setPreviewUrl(url)
            }
            createPreview()
        }
    }, [isOpen, previewUrl])

    const handleShareImage = async () => {
        const dataUrl = previewUrl || await generateImage()
        if (!dataUrl) {
            toast.error("فشل في إنشاء الصورة")
            return
        }

        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], "hadith.png", { type: "image/png" })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "بوابة القرآن - الأحاديث النبوية",
                    text: `حديث شريف من ${bookNameAr}`,
                    url: currentUrl,
                })
                setIsOpen(false)
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Share failed", err)
                    downloadFallback(dataUrl)
                }
            }
        } else {
            downloadFallback(dataUrl)
        }
    }

    const shareText = `"${hadith.hadithArabic}"\n\nالمصدر: ${bookNameAr}\nرقم الحديث: ${hadith.hadithNumber}\nالحالة: ${hadith.status === 'Sahih' ? 'صحيح' : hadith.status === 'Hasan' ? 'حسن' : (hadith.status === "Da'if" || hadith.status === "Da'eef") ? 'ضعيف' : hadith.status}\n\nبوابة القرآن: ${currentUrl}`

    const handleShareText = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "بوابة القرآن - الأحاديث النبوية",
                    text: shareText,
                })
                setIsOpen(false)
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Share failed", err)
                    copyToClipboard(shareText)
                }
            }
        } else {
            copyToClipboard(shareText)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("تم نسخ النص للمشاركة")
        setIsOpen(false)
    }

    const downloadFallback = (dataUrl: string) => {
        const link = document.createElement("a")
        link.download = "hadith.png"
        link.href = dataUrl
        link.click()
        toast.success("تم تحميل الصورة بنجاح")
        setIsOpen(false)
    }

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}&color=059669&bgcolor=ffffff`

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className=" rounded-full w-full sm:max-w-[200px] gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30">
                        <Share2 className="h-3.5 w-3.5" />
                        مشاركة
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-[94vw] sm:w-full sm:max-w-xl max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border-emerald-100 dark:border-emerald-900/30 p-4 sm:p-6" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-right text-emerald-900 dark:text-emerald-100 font-bold">مشاركة الحديث</DialogTitle>
                        <DialogDescription className="text-right">
                            اختر كيف ترغب في مشاركة هذا الحديث مع الآخرين
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 items-stretch">
                        {/* Image Preview Column */}
                        <div className="flex flex-col gap-3">
                            <span className="text-center font-bold text-sm text-emerald-800 dark:text-emerald-200">صورة مصممة</span>
                            <div
                                className="relative h-full aspect-[4/5] rounded-xl border-2 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-center cursor-pointer group"
                                onClick={handleShareImage}
                            >
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                                        <span className="text-xs text-emerald-600">جاري التحضير...</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors" />
                            </div>
                            <Button
                                onClick={handleShareImage}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
                            >
                                <ImageIcon className="h-4 w-4" />
                                مشاركة الصورة
                            </Button>
                        </div>

                        {/* Text Preview Column */}
                        <div className="flex flex-col gap-3">
                            <span className="text-center font-bold text-sm text-emerald-800 dark:text-emerald-200">نص فقط</span>
                            <div
                                className="relative h-full rounded-xl border-2 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50/30 dark:bg-emerald-950/10 p-4 cursor-pointer group flex flex-col"
                                onClick={handleShareText}
                            >
                                <div className="flex-1 overflow-auto scrollbar-none">
                                    <div className="text-[11px] leading-relaxed text-emerald-950 dark:text-emerald-100 whitespace-pre-wrap font-amiri italic">
                                        {shareText}
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors" />
                                <div className="mt-2 pt-2 border-t border-emerald-100/50 text-[10px] text-emerald-600 font-medium text-center">
                                    مع رابط مباشر للموقع
                                </div>
                            </div>
                            <Button
                                onClick={handleShareText}
                                variant="outline"
                                className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2 font-bold"
                            >
                                <FileText className="h-4 w-4" />
                                مشاركة النص
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hidden template for image generation */}
            <div className="fixed -left-[9999px] top-0">
                <div
                    ref={templateRef}
                    className="w-[600px] p-10 bg-white relative overflow-hidden flex flex-col items-center text-center"
                    dir="rtl"
                    style={{
                        fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
                        backgroundImage: "radial-gradient(circle at top right, #f0fdf4 0%, transparent 40%), radial-gradient(circle at bottom left, #f0fdf4 0%, transparent 40%)"
                    }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] opacity-50 -z-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-tr-[100%] opacity-50 -z-10" />

                    <div className="mb-8">
                        <div className="bg-emerald-100 p-4 rounded-full inline-block shadow-sm ring-1 ring-emerald-200">
                            <BookOpen className="h-8 w-8 text-emerald-700" />
                        </div>
                    </div>

                    <p className="text-3xl leading-[1.8] text-emerald-950 mb-8 font-amiri min-h-[100px]" style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}>
                        {hadith.hadithArabic}
                    </p>

                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-emerald-800 text-lg mb-8 w-full max-w-[90%] mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-emerald-700 font-bold mb-2">
                            <span className="bg-emerald-100/50 px-3 py-1 rounded-full text-sm">المصدر: {bookNameAr}</span>
                            <span className="bg-emerald-100/50 px-3 py-1 rounded-full text-sm">حديث رقم: {hadith.hadithNumber}</span>
                            <span className="bg-emerald-100/50 px-3 py-1 rounded-full text-sm">الحالة: {hadith.status === 'Sahih' ? 'صحيح' : hadith.status === 'Hasan' ? 'حسن' : (hadith.status === "Da'if" || hadith.status === "Da'eef") ? 'ضعيف' : hadith.status}</span>
                        </div>
                        {hadith.chapter?.chapterArabic && (
                            <div className="mt-2 text-md opacity-80 border-t border-emerald-200/50 pt-2 text-emerald-900">
                                <span className="font-bold">الفصل:</span> {hadith.chapter.chapterArabic}
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent mb-8" />

                    <div className="flex items-center justify-between w-full px-4 gap-6">
                        <div className="flex flex-col items-start gap-2 flex-1 text-right">
                            <div className="text-emerald-700 text-sm font-medium opacity-80 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" />
                                <span>بوابة القرآن - السنة النبوية</span>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                                    quranee.netlify.app
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="p-1 bg-white border border-emerald-100 rounded-lg shadow-sm">
                                <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold opacity-70">امسح للانتقال للموقع</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
