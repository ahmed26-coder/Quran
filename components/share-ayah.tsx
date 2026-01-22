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

interface Ayah {
    number: number
    text: string
    numberInSurah: number
    juz: number
    page: number
}

interface Surah {
    number: number
    name: string
    englishName: string
}

interface ShareAyahProps {
    ayah: Ayah
    surah: Surah
    trigger?: React.ReactNode
}

export function ShareAyah({ ayah, surah, trigger }: ShareAyahProps) {
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
            await new Promise(resolve => setTimeout(resolve, 500))

            const dataUrl = await toPng(templateRef.current, {
                quality: 0.95,
                cacheBust: true,
                skipFonts: false,
                pixelRatio: 2,
            })

            return dataUrl
        } catch (err) {
            console.error("Failed to generate image", err)
            return null
        } finally {
            setIsGenerating(false)
        }
    }

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
        const file = new File([blob], "ayah.png", { type: "image/png" })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "بوابة القرآن - القرآن الكريم",
                    text: `آية من سورة ${surah.name}`,
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

    const cleanAyahText = ayah.text.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "").trim()

    const shareText = `"${cleanAyahText}"\n\nسورة ${surah.name} - الآية ${ayah.numberInSurah}\nالجزء ${ayah.juz} - الصفحة ${ayah.page}\n\nبوابة القرآن: ${currentUrl}`

    const handleShareText = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "بوابة القرآن - القرآن الكريم",
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
        link.download = "ayah.png"
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
                    {trigger || (
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-white dark:bg-gray-900 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-md shadow-lg font-bold text-base px-6"
                        >
                            <Share2 className="h-5 w-5" />
                            مشاركة
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="w-[94vw] sm:w-full sm:max-w-xl max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl bg-white dark:bg-zinc-950 border-emerald-100 dark:border-emerald-900/30 p-4 sm:p-6" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-right text-emerald-900 dark:text-emerald-100 font-bold text-xl">مشاركة الآية</DialogTitle>
                        <DialogDescription className="text-right text-base">
                            اختر كيف ترغب في مشاركة هذه الآية مع الآخرين
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

            {/* Hidden template for image generation - MATCHING REFERENCE DESIGN */}
            <div className="fixed -left-[9999px] top-0">
                <div
                    ref={templateRef}
                    className="w-[800px] h-auto flex flex-col"
                    dir="rtl"
                    style={{
                        fontFamily: "Amiri, serif",
                        backgroundColor: "#ffffff",
                        backgroundImage: `
              radial-gradient(circle at top right, #f0fdf4 0%, transparent 45%),
              radial-gradient(circle at bottom left, #ecfdf5 0%, transparent 45%)
            `,
                    }}
                >
                    {/* ===== Top Decorative Surah Banner ===== */}
                    <div className="px-6 pt-8">
                        <svg viewBox="0 0 560 90" className="w-full h-[90px]">
                            {/* Outer frame */}
                            <rect
                                x="10"
                                y="15"
                                width="540"
                                height="60"
                                rx="10"
                                fill="none"
                                stroke="#6ee7b7"
                                strokeWidth="2"
                            />

                            {/* Inner frame */}
                            <rect
                                x="25"
                                y="25"
                                width="510"
                                height="40"
                                rx="6"
                                fill="none"
                                stroke="#a7f3d0"
                                strokeWidth="1.2"
                            />

                            {/* Left ornament */}
                            <g transform="translate(60,45)">
                                <circle r="10" fill="none" stroke="#059669" strokeWidth="1.5" />
                                <circle r="4" fill="#059669" />
                            </g>

                            {/* Right ornament */}
                            <g transform="translate(500,45)">
                                <circle r="10" fill="none" stroke="#059669" strokeWidth="1.5" />
                                <circle r="4" fill="#059669" />
                            </g>

                            {/* Surah name */}
                            <text
                                x="280"
                                y="52"
                                textAnchor="middle"
                                fontSize="30"
                                fill="#022c22"
                                fontWeight="bold"
                            >
                                {surah.name}
                            </text>
                        </svg>
                    </div>

                    {/* ===== Basmala ===== */}
                    <div className="mt-3 text-center">
                        <p
                            className="text-[34px] tracking-wide"
                            style={{
                                color: "#047857",
                                fontWeight: 400,
                            }}
                        >
                            ﷽
                        </p>
                    </div>

                    {/* ===== Ayah Text ===== */}
                    <div className="flex max-w-[720px] mx-auto items-center justify-center px-8 mt-6">
                        <div
                            className="text-center leading-[1.55] text-[42px]"
                            style={{ color: "#022c22" }}
                        >
                            {cleanAyahText}

                            <div className="relative inline-flex items-center justify-center ms-3 align-middle text-emerald-600">
                                <span
                                    className="leading-none select-none"
                                    style={{
                                        fontSize: "60px",
                                        fontFamily: "Amiri, serif"
                                    }}
                                >
                                    ۝
                                </span>
                                <span
                                    className="absolute font-bold font-sans"
                                    style={{
                                        fontSize: "20px",
                                        color: "currentColor",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -42%)",
                                    }}
                                >
                                    {ayah.numberInSurah}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ===== Footer ===== */}
                    <div
                        className="pb-6 mt-3 text-center text-sm"
                        style={{ color: "#064e3b", opacity: 0.8 }}
                    >
                        الجزء {ayah.juz} • الصفحة {ayah.page}
                    </div>
                    <div className=" flex justify-center items-center w-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-200 to-transparent mb-8" />

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
