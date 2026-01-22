"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bookmark, X, Loader2, Image as ImageIcon } from "lucide-react"
import { useBookmarks } from "@/components/bookmarks-provider"
import Image from "next/image"

interface BookmarkDialogProps {
    isOpen: boolean
    onClose: () => void
    ayahData: {
        surahNumber: number
        ayahNumber: number
        surahName: string
        ayahText: string
    } | null
}

export function BookmarkDialog({ isOpen, onClose, ayahData }: BookmarkDialogProps) {
    const { addBookmark, getBookmark, removeBookmark } = useBookmarks()
    const [note, setNote] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [existingBookmark, setExistingBookmark] = useState<any>(null)

    useEffect(() => {
        if (isOpen && ayahData) {
            const existing = getBookmark(ayahData.surahNumber, ayahData.ayahNumber)
            if (existing) {
                setExistingBookmark(existing)
                setNote(existing.data.note || "")
            } else {
                setExistingBookmark(null)
                setNote("")
                setImageFile(null)
                setImagePreview(null)
            }
        }
    }, [isOpen, ayahData, getBookmark])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async () => {
        if (!ayahData) return
        setIsSubmitting(true)
        try {
            await addBookmark({
                ...ayahData,
                note
            }, imageFile || undefined)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!existingBookmark) return
        setIsSubmitting(true)
        try {
            await removeBookmark(existingBookmark.id)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col p-0 overflow-hidden rounded-2xl" dir="rtl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                        <Bookmark className="h-5 w-5 fill-current" />
                        علامة تلاوة
                    </DialogTitle>
                    <DialogDescription className="text-right">
                        إضافة ملاحظة أو صورة لهذه الآية الكريمة لسهولة الرجوع إليها.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                    {ayahData && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/20">
                            <p className="font-amiri text-xl text-emerald-950 dark:text-emerald-50 leading-relaxed text-center">
                                {ayahData.ayahText}
                            </p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 text-center font-medium">
                                {ayahData.surahName} - آية {ayahData.ayahNumber}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-sm font-bold pr-1">ملاحظاتك</Label>
                            <Textarea
                                id="note"
                                placeholder="اكتب شيئاً هنا..."
                                className=" resize-none rounded-xl border-2 focus-visible:ring-emerald-500"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold pr-1">صورة اختيارية</Label>
                            <div className="flex flex-col items-center gap-4">
                                {imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 shadow-sm group">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            onClick={() => {
                                                setImageFile(null)
                                                setImagePreview(null)
                                            }}
                                            className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full flex flex-col items-center justify-center gap-2 py-10 border-2 border-dashed border-emerald-100 dark:border-emerald-800/30 rounded-2xl cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-900/5 transition-colors group">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="h-6 w-6" />
                                        </div>
                                        <span className="text-sm font-bold">اضغط لرفع صورة</span>
                                        <span className="text-xs text-muted-foreground">JPG, PNG, WebP (بحد أقصى 5MB)</span>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex sm:flex-row-reverse gap-2 p-6 border-t bg-emerald-50/30 dark:bg-emerald-900/5">
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none rounded-xl font-bold px-8 h-11"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ"}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="flex-1 sm:flex-none rounded-xl h-11"
                    >
                        إلغاء
                    </Button>
                    {existingBookmark && (
                        <Button
                            variant="destructive"
                            className="mr-auto rounded-xl h-11"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            حذف
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
