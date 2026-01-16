"use client"

import { useEffect, useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Share2, Loader2, Link as LinkIcon, FileText, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Quote } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ShareSupplicationProps {
    zekr: {
        zekr: string
        source?: string
        translation?: string
        bless?: string
    }
}

export function ShareSupplication({ zekr }: ShareSupplicationProps) {
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
            await new Promise(resolve => setTimeout(resolve, 200)) // Slight delay for fonts/styles

            const dataUrl = await toPng(templateRef.current, {
                quality: 0.95,
                cacheBust: true,
                skipFonts: false,
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
        // Use existing preview if available, otherwise generate
        const dataUrl = previewUrl || await generateImage()
        if (!dataUrl) {
            toast.error("فشل في إنشاء الصورة")
            return
        }

        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], "zekr.png", { type: "image/png" })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "بوابة القرآن",
                    text: `بوابة القرآن: اقرأ الذكر كاملًا من هنا`,
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

    const shareText = `"${zekr.zekr}"\n\n${zekr.bless ? `الفضل: ${zekr.bless}\n\n` : ""}بوابة القرآن: ${currentUrl}`

    const handleShareText = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "بوابة القرآن",
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
        link.download = "zekr.png"
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
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30"
                        >
                            <Share2 className="h-4 w-4" />
                            مشاركة
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="w-[94vw] sm:w-full sm:max-w-xl max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border-emerald-100 dark:border-emerald-900/30 p-4 sm:p-6" dir="rtl">
                    <DialogHeader className="">
                        <DialogTitle className="text-right text-emerald-900 dark:text-emerald-100">خيارات المشاركة</DialogTitle>
                        <DialogDescription className="text-right">
                            اختر كيف ترغب في مشاركة هذا الذكر مع الآخرين
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 items-stretch">
                        {/* Image Preview Column */}
                        <div className="flex flex-col gap-3">
                            <span className="text-center font-bold text-sm text-emerald-800 dark:text-emerald-200">صورة مصممة</span>
                            <div
                                className="relative h-full rounded-xl border-2 border-emerald-100 dark:border-emerald-900/30 overflow-hidden bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-center cursor-pointer group"
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


            {/* Hidden Global Styles for the template to ensure fonts are loaded correctly in image */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap');
      `}</style>

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
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100%] opacity-50 -z-10" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-tr-[100%] opacity-50 -z-10" />

                    {/* Icon */}
                    <div className="mb-8">
                        <div className="bg-emerald-100 p-4 rounded-full inline-block shadow-sm ring-1 ring-emerald-200">
                            <Quote className="h-8 w-8 text-emerald-700" />
                        </div>
                    </div>

                    {/* Zekr Text */}
                    <p
                        className="text-3xl leading-[1.8] text-emerald-950 mb-8 font-amiri"
                        style={{ fontFamily: "var(--font-amiri), 'Amiri', serif" }}
                    >
                        {zekr.zekr}
                    </p>

                    {/* Blessings/Benefit */}
                    {zekr.bless && (
                        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-emerald-800 text-lg mb-8 max-w-[90%] mx-auto">
                            <span className="font-bold underline decoration-emerald-200 underline-offset-4 ml-1">الفضل:</span>
                            <span className="opacity-90">{zekr.bless}</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent mb-8" />

                    {/* Footer Info */}
                    <div className="flex items-center justify-between w-full px-4 gap-6">
                        <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="text-emerald-700 text-sm font-medium opacity-80 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" />
                                <span>{zekr.source || "بوابة القرآن"}</span>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                                    quranee.netlify.app
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
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
