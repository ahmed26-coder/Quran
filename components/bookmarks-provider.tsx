"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { BookmarkItem, BookmarkData } from "@/types/bookmarks"
import { databases, storage } from "@/lib/appwrite"
import { useAuth } from "@/components/auth-provider"
import { ID, Query } from "appwrite"
import { toast } from "sonner"

import { LoginRequiredDialog } from "@/components/login-required-dialog"

interface BookmarksContextType {
    bookmarks: BookmarkItem[]
    isLoaded: boolean
    addBookmark: (data: BookmarkData, imageFile?: File) => Promise<void>
    removeBookmark: (bookmarkId: string) => Promise<void>
    isBookmarked: (surahNum: number, ayahNum: number) => boolean
    getBookmark: (surahNum: number, ayahNum: number) => BookmarkItem | undefined
    openLoginModal: () => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6970d96b000f94329ee0"
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BOOKMARKS_COLLECTION_ID || "bookmarks"
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BOOKMARK_IMAGES_BUCKET_ID || "69723556001c65959e73"

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const isAppwriteConfigured = !!DATABASE_ID && !!COLLECTION_ID

    // Load bookmarks
    useEffect(() => {
        const loadBookmarks = async () => {
            if (!user || !isAppwriteConfigured) {
                setBookmarks([])
                setIsLoaded(true)
                return
            }

            try {
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("user_id", user.$id)]
                )

                const loadedBookmarks = response.documents.map(doc => ({
                    id: `${doc.surah_number}:${doc.ayah_number}`,
                    data: {
                        surahNumber: doc.surah_number,
                        ayahNumber: doc.ayah_number,
                        surahName: doc.surah_name,
                        ayahText: doc.ayah_text,
                        note: doc.note,
                        imageId: doc.image_id
                    },
                    timestamp: new Date(doc.$createdAt).getTime(),
                    $id: doc.$id
                }))

                setBookmarks(loadedBookmarks)
            } catch (error: any) {
                console.error("Failed to load bookmarks:", error)
            } finally {
                setIsLoaded(true)
            }
        }

        loadBookmarks()
    }, [user, isAppwriteConfigured])

    const openLoginModal = () => setIsLoginModalOpen(true)

    const addBookmark = useCallback(async (data: BookmarkData, imageFile?: File) => {
        if (!user) {
            setIsLoginModalOpen(true)
            return
        }

        if (!isAppwriteConfigured) {
            toast.error("إعدادات Appwrite غير مكتملة")
            return
        }

        try {
            let imageId = undefined
            if (imageFile) {
                const uploadResponse = await storage.createFile(BUCKET_ID, ID.unique(), imageFile)
                imageId = uploadResponse.$id
            }

            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    user_id: user.$id,
                    surah_number: data.surahNumber,
                    ayah_number: data.ayahNumber,
                    surah_name: data.surahName,
                    ayah_text: data.ayahText,
                    note: data.note || "",
                    image_id: imageId || ""
                }
            )

            const newBookmark: BookmarkItem = {
                id: `${data.surahNumber}:${data.ayahNumber}`,
                data: { ...data, imageId },
                timestamp: Date.now(),
                $id: response.$id
            }

            setBookmarks(prev => [newBookmark, ...prev])
            toast.success("تم حفظ علامة التلاوة")
        } catch (error) {
            console.error("Failed to add bookmark:", error)
            toast.error("فشل في حفظ العلامة. تأكد من إعدادات Appwrite")
        }
    }, [user, isAppwriteConfigured])

    const removeBookmark = useCallback(async (bookmarkId: string) => {
        if (!user) {
            setIsLoginModalOpen(true)
            return
        }

        const bookmark = bookmarks.find(b => b.id === bookmarkId)
        if (!bookmark || !bookmark.$id) return

        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, bookmark.$id)

            if (bookmark.data.imageId) {
                try {
                    await storage.deleteFile(BUCKET_ID, bookmark.data.imageId)
                } catch (e) {
                    console.error("Failed to delete image from storage:", e)
                }
            }

            setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
            toast.success("تم حذف علامة التلاوة")
        } catch (error) {
            console.error("Failed to remove bookmark:", error)
            toast.error("فشل في حذف العلامة")
        }
    }, [bookmarks, user])

    const isBookmarked = useCallback((surahNum: number, ayahNum: number) => {
        return bookmarks.some(b => b.data.surahNumber === surahNum && b.data.ayahNumber === ayahNum)
    }, [bookmarks])

    const getBookmark = useCallback((surahNum: number, ayahNum: number) => {
        return bookmarks.find(b => b.data.surahNumber === surahNum && b.data.ayahNumber === ayahNum)
    }, [bookmarks])

    return (
        <BookmarksContext.Provider value={{ bookmarks, isLoaded, addBookmark, removeBookmark, isBookmarked, getBookmark, openLoginModal }}>
            {children}
            <LoginRequiredDialog
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                title="تسجيل الدخول مطلوب"
                description="يرجى تسجيل الدخول أو إنشاء حساب لحفظ علامات التلاوة ومزامنتها سحابياً."
            />
        </BookmarksContext.Provider>
    )
}

export function useBookmarks() {
    const context = useContext(BookmarksContext)
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarksProvider")
    }
    return context
}
