"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { FavoriteItem } from "@/types/favorites"
import { databases } from "@/lib/appwrite"
import { useAuth } from "@/components/auth-provider"
import { ID, Query } from "appwrite"
import { toast } from "sonner"
import { LoginRequiredDialog } from "@/components/login-required-dialog"

interface FavoritesContextType {
    favorites: FavoriteItem[]
    isLoaded: boolean
    addFavorite: (item: Omit<FavoriteItem, "timestamp">) => Promise<void>
    removeFavorite: (id: string | number, type: FavoriteItem["type"]) => Promise<void>
    isFavorite: (id: string | number, type: FavoriteItem["type"]) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "6970d96b000f94329ee0"
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID || "favorites"
const STORAGE_KEY = "quran-favorites"

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth()
    const [favorites, setFavorites] = useState<FavoriteItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    // Load favorites
    useEffect(() => {
        const loadFavorites = async () => {
            setIsLoaded(false)
            if (user) {
                try {
                    const response = await databases.listDocuments(
                        DATABASE_ID,
                        COLLECTION_ID,
                        [Query.equal("user_id", user.$id)]
                    )
                    const cloudFavorites = response.documents.map(doc => ({
                        type: doc.type,
                        id: doc.item_id,
                        data: JSON.parse(doc.data),
                        timestamp: new Date(doc.$createdAt).getTime(),
                        $id: doc.$id // Store Appwrite doc ID for deletion
                    } as FavoriteItem & { $id: string }))
                    setFavorites(cloudFavorites)
                } catch (error) {
                    console.error("Failed to load favorites from Appwrite:", error)
                    toast.error("فشل في تحميل المفضلة من السحابة")
                }
            } else {
                // Load from localStorage for guests
                try {
                    const stored = localStorage.getItem(STORAGE_KEY)
                    if (stored) {
                        setFavorites(JSON.parse(stored))
                    } else {
                        setFavorites([])
                    }
                } catch (error) {
                    console.error("Failed to load favorites from localStorage:", error)
                }
            }
            setIsLoaded(true)
        }

        loadFavorites()
    }, [user])

    const addFavorite = useCallback(async (item: Omit<FavoriteItem, "timestamp">) => {
        if (!user) {
            setIsLoginModalOpen(true)
            return
        }

        const recitationId = item.id.toString()
        const newItemData = JSON.stringify(item.data)

        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    user_id: user.$id,
                    type: item.type,
                    item_id: recitationId,
                    data: newItemData
                }
            )

            const newItem: FavoriteItem & { $id: string } = {
                ...item,
                timestamp: Date.now(),
                $id: response.$id
            } as any

            setFavorites(prev => [newItem, ...prev])
            toast.success("تمت الإضافة إلى المفضلة")
        } catch (error: any) {
            console.error("Appwrite Add Favorite Error:", error)
            toast.error("فشل في الإضافة للمفضلة")
        }
    }, [user])

    const removeFavorite = useCallback(async (id: string | number, type: FavoriteItem["type"]) => {
        const itemToRemove = favorites.find(f => String(f.id) === String(id) && f.type === type) as any

        if (user && itemToRemove?.$id) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, itemToRemove.$id)
                setFavorites(prev => prev.filter(f => !(String(f.id) === String(id) && f.type === type)))
                toast.success("تم الحذف من المفضلة")
            } catch (error) {
                console.error("Appwrite Remove Favorite Error:", error)
                toast.error("فشل في حذف المفضل")
            }
        } else if (!user) {
            // Local removal for guests if they had any
            setFavorites(prev => {
                const updated = prev.filter(f => !(String(f.id) === String(id) && f.type === type))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
                toast.success("تم الحذف من المفضلة")
                return updated
            })
        }
    }, [user, favorites])

    const isFavorite = useCallback((id: string | number, type: FavoriteItem["type"]) => {
        return favorites.some(f => String(f.id) === String(id) && f.type === type)
    }, [favorites])

    return (
        <FavoritesContext.Provider value={{ favorites, isLoaded, addFavorite, removeFavorite, isFavorite }}>
            {children}
            <LoginRequiredDialog isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider")
    }
    return context
}
