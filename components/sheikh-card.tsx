"use client"

import { memo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Heart } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { cn } from "@/lib/utils"

export const SheikhCard = memo(({ sheikh }: { sheikh: any }) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites()
    const isFav = isFavorite(sheikh.id, "sheikh")

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isFav) {
            removeFavorite(sheikh.id, "sheikh")
        } else {
            addFavorite({
                type: "sheikh",
                id: sheikh.id,
                data: {
                    id: sheikh.id,
                    name: sheikh.name,
                    bio: sheikh.bio, // Ensure these exist in the source object or are optional
                },
            })
        }
    }

    return (
        <Link href={`/sheikhs/${sheikh.id}`} className="group relative block">
            <div className="flex flex-col space-y-4 rounded-lg group-hover:border-emerald-400 border bg-background p-6 shadow-sm transition-all hover:shadow-md relative">

                {/* Favorite Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-2 left-2 z-10 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm",
                        isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                    )}
                    onClick={handleFavorite}
                >
                    <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
                </Button>

                {/* Avatar */}
                <div className="relative h-48 w-48 mx-auto flex items-center justify-center rounded-full border-4 border-emerald-50 shadow-xl group-hover:border-emerald-200 transition-all duration-300 bg-emerald-100 text-4xl font-bold text-emerald-700">
                    {sheikh.name
                        ? sheikh.name
                            .split(" ")
                            .map((word: string) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()
                        : "قارئ"}
                </div>

                <div className="space-y-2 text-center">
                    <h3 className="text-xl font-bold group-hover:text-emerald-600">{sheikh.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {sheikh.moshaf?.[0]?.name || "قارئ قرآن كريم"}
                    </p>
                </div>

                <Button variant="ghost" className="mt-auto group-hover:text-emerald-600 w-full justify-center">
                    عرض الملف الشخصي <ChevronLeft className="mr-2 h-4 w-4" />
                </Button>
            </div>
        </Link>
    )
})

SheikhCard.displayName = "SheikhCard"
