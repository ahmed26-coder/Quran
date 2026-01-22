"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { useBookmarks } from "@/components/bookmarks-provider"
import { BookmarkItem } from "@/types/bookmarks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Calendar, Trash2, ExternalLink, MessageSquare, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function BookmarksPage() {
    const { bookmarks, removeBookmark, isLoaded } = useBookmarks()

    if (!isLoaded) {
        return (
            <div className="flex flex-col min-h-screen">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse text-emerald-600 font-medium font-amiri text-2xl">جاري التحميل...</div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50 dark:bg-gray-950/50">
            <SiteHeader />
            <main className="flex-1 container px-4 md:px-6 py-12">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 border-b pb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400 font-amiri">علامات التلاوة</h1>
                        <p className="text-muted-foreground">آياتك المحفوظة مع ملاحظاتك وصورك الخاصة.</p>
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-emerald-100 dark:border-emerald-800/20 shadow-sm">
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-full text-emerald-600 mb-4">
                                <Bookmark className="h-12 w-12" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">لا توجد علامات تلاوة بعد</h2>
                            <p className="text-muted-foreground text-center max-w-sm mb-6">
                                يمكنك حفظ أي آية أثناء القراءة وإضافة ملاحظاتك الخاصة عليها لتجدها هنا.
                            </p>
                            <Link href="/quran">
                                <Button className="bg-emerald-600 hover:bg-emerald-700">ابدأ القراءة</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {bookmarks.map((bookmark) => (
                                <BookmarkCard key={bookmark.$id} bookmark={bookmark} onRemove={() => removeBookmark(bookmark.id)} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

function BookmarkCard({ bookmark, onRemove }: { bookmark: BookmarkItem; onRemove: () => void }) {
    const { data, timestamp } = bookmark

    return (
        <Card className="overflow-hidden border-2 border-emerald-100 dark:border-emerald-800/30 hover:shadow-lg transition-all duration-300 group rounded-2xl flex flex-col h-full bg-white dark:bg-gray-900/50">
            <CardHeader className="bg-emerald-50/50 dark:bg-emerald-900/10 border-b pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                        <Bookmark className="h-4 w-4 fill-current" />
                        <CardTitle className="text-lg font-amiri">سورة {data.surahName}</CardTitle>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(timestamp, 'PPP', { locale: ar })}
                    </div>
                </div>
                <CardDescription className="text-emerald-600 font-medium">الآية رقم {data.ayahNumber}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                <blockquote className="font-amiri text-xl text-emerald-950 dark:text-emerald-50 text-center leading-relaxed border-r-4 border-emerald-500 pr-4 italic">
                    {data.ayahText}
                </blockquote>

                {data.note && (
                    <div className="bg-muted/50 p-3 rounded-xl border relative">
                        <MessageSquare className="h-3 w-3 absolute -top-1.5 -right-1 text-muted-foreground bg-white dark:bg-gray-800 rounded-full" />
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{data.note}</p>
                    </div>
                )}

                {data.imageId && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm mt-2">
                        <Image
                            src={`https://nyc.cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BOOKMARK_IMAGES_BUCKET_ID || '69723556001c65959e73'}/files/${data.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "696bf0f30026eca12bd2" }`}
                            alt="Attached image"
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                <div className="mt-auto pt-4 flex gap-2">
                    <Link href={`/quran?surah=${data.surahNumber}&ayah=${data.ayahNumber}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                            <ExternalLink className="h-4 w-4" />
                            فتح في المصحف
                        </Button>
                    </Link>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl px-2">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                    سيتم حذف علامة التلاوة هذه نهائياً.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex gap-2">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={onRemove} className="bg-red-500 hover:bg-red-600">حذف</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
