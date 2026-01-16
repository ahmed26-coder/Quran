"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import { Share2, Download, Loader2, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Quote } from "lucide-react"

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
    const templateRef = useRef<HTMLDivElement>(null)

    const generateImage = async () => {
        if (!templateRef.current) return null

        try {
            setIsGenerating(true)
            // Small delay to ensure styles are applied
            await new Promise(resolve => setTimeout(resolve, 100))

            const dataUrl = await toPng(templateRef.current, {
                quality: 0.95,
                cacheBust: true,
            })

            return dataUrl
        } catch (err) {
            console.error("Failed to generate image", err)
            toast.error("فشل في إنشاء الصورة")
            return null
        } finally {
            setIsGenerating(false)
        }
    }

    const handleShare = async () => {
        const dataUrl = await generateImage()
        if (!dataUrl) return

        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], "zekr.png", { type: "image/png" })

        if (navigator.share && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: "ذكر من بوابة القرآن",
                    text: `${zekr.zekr}\n\nالمصدر: ${zekr.source || "غير متوفر"}\nاقرأ المزيد على: ${window.location.origin}`,
                })
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

    const downloadFallback = (dataUrl: string) => {
        const link = document.createElement("a")
        link.download = "zekr.png"
        link.href = dataUrl
        link.click()
        toast.success("تم تحميل الصورة بنجاح")
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                disabled={isGenerating}
                className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30"
            >
                {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Share2 className="h-4 w-4" />
                )}
                مشاركة
            </Button>

            {/* Hidden Global Styles for the template to ensure fonts are loaded correctly in image */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap');
      `}</style>

            {/* Hidden template for image generation */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none">
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
                    <div className="flex flex-col items-center gap-3">
                        <div className="text-emerald-700 text-sm font-medium opacity-80 flex items-center gap-2">
                            <LinkIcon className="h-3 w-3" />
                            <span>{zekr.source || "بوابة القرآن"}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <div className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-sm">
                                quranee.netlify.app
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
