"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { useFavorites } from "@/hooks/use-favorites"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Heart, BookOpen, FileText, User, Quote, Trash2 } from "lucide-react"
import { SheikhCard } from "@/components/sheikh-card"
import { HadithCard } from "@/components/hadith-card"
import { SupplicationCard } from "@/components/supplication-card"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAudioPlayer } from "@/components/audio-player-provider"
import { Play, Pause, Volume2 } from "lucide-react"

const AyahCard = ({ item }: { item: any }) => {
    const { removeFavorite } = useFavorites()
    const ayah = item.data

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group"
        >
            <Card className="relative overflow-hidden border-emerald-100 dark:border-emerald-900/30 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {ayah.surahName} - آية {ayah.numberInSurah}

                            <span className="text-xs text-emerald-700  px-1">
                                - صفحة {ayah.page}
                            </span>
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            className=" flex items-center gap-2 border-2 border-red-500 z-10 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            onClick={() => removeFavorite(item.id, "ayah")}
                        >
                            <Trash2 className="h-4 w-4" />
                            حذف
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 text-center">
                    <p className="font-amiri text-2xl md:text-3xl leading-[2.2] text-emerald-950 dark:text-emerald-50 py-4">
                        {ayah.text}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

const RecitationCard = ({ item }: { item: any }) => {
    const { removeFavorite } = useFavorites()
    const { play, pause, resume, isPlaying, currentTrack } = useAudioPlayer()
    const recitation = item.data

    const isCurrentTrack = currentTrack?.reciterId === recitation.sheikhId &&
        currentTrack?.surahNumber === recitation.surahId &&
        currentTrack?.moshafId === recitation.moshafId

    const handlePlay = () => {
        if (isCurrentTrack) {
            if (isPlaying) pause()
            else resume()
        } else {
            const track = {
                url: `${recitation.server}${String(recitation.surahId).padStart(3, "0")}.mp3`,
                surahName: recitation.surahName,
                surahNumber: recitation.surahId,
                reciterName: recitation.sheikhName,
                reciterId: recitation.sheikhId,
                moshafId: recitation.moshafId
            }
            play(track, [track]) // Play single track for now
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group"
        >
            <Card className="relative overflow-hidden border-emerald-100 dark:border-emerald-900/30 hover:shadow-md transition-all">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 z-10 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => removeFavorite(item.id, "recitation")}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center p-4 gap-4">
                    <div className="flex-shrink-0">
                        <Button
                            size="icon"
                            className={`rounded-full h-12 w-12 ${isCurrentTrack && isPlaying ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"}`}
                            onClick={handlePlay}
                        >
                            {isCurrentTrack && isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                        </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                سورة {recitation.surahName}
                            </Badge>
                        </div>
                        <h3 className="font-bold text-lg truncate text-foreground">{recitation.sheikhName}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                            تلاوة عطرة
                        </p>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export default function FavoritesPage() {
    const { favorites, isLoaded, removeFavorite } = useFavorites()
    const { play, pause, resume, isPlaying, currentTrack } = useAudioPlayer()
    const [activeTab, setActiveTab] = useState("all")

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </main>
            </div>
        )
    }

    const filteredFavorites = activeTab === "all"
        ? favorites
        : favorites.filter(f => f.type === activeTab)

    // Reverse to show newest first
    const displayFavorites = [...filteredFavorites].reverse()

    const renderContent = () => {
        if (displayFavorites.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-60">
                    <Heart className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-2xl font-bold text-muted-foreground">لا توجد عناصر في المفضلة</h3>
                    <p className="text-muted-foreground">قم بإضافة الآيات، الأحاديث، الأدعية، أو الشيوخ إلى قائمتك</p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {displayFavorites.map((item) => (
                        <motion.div
                            key={`${item.type}-${item.id}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={item.type === 'supplication' ? "md:col-span-2 lg:col-span-3" : ""}
                        >
                            {/* Render based on type */}
                            {item.type === 'ayah' && <AyahCard item={item} />}
                            {item.type === 'sheikh' && (
                                <div className="relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 left-2 z-10 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded-full"
                                        onClick={() => removeFavorite(item.id, "sheikh")}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <SheikhCard sheikh={item.data} />
                                </div>
                            )}
                            {item.type === 'recitation' && <RecitationCard item={item} />}
                            {item.type === 'hadith' && (
                                <HadithCard
                                    hadith={{
                                        id: item.data.id,
                                        hadithArabic: item.data.text,
                                        hadithNumber: item.data.number,
                                        bookSlug: "", // Not stored, maybe optional
                                        status: item.data.grade,
                                        chapterName: item.data.chapter
                                    } as any}
                                    index={0}
                                    isExpanded={false}
                                    onToggle={() => { }}
                                    onCopy={(txt) => navigator.clipboard.writeText(txt)}
                                    bookNameAr={item.data.source}
                                />
                            )}
                            {item.type === 'supplication' && (
                                <div className="max-w-2xl mx-auto w-full">
                                    <SupplicationCard
                                        id={item.id}
                                        zekr={{
                                            zekr: item.data.text,
                                            repeat: item.data.count || 1,
                                            translation: item.data.translation,
                                            category: item.data.category
                                        }}
                                        viewOnly={true}
                                        hasPrevious={false}
                                        hasNext={false}
                                        showReset={false}
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-background">
            <SiteHeader />
            <main className="flex-1 container py-8 px-4 md:px-8">
                <div className="flex flex-col space-y-8">
                    <div className="flex items-center gap-3 border-b pb-6">
                        <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-full">
                            <Heart className="h-6 w-6 text-red-500 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">المفضلة</h1>
                            <p className="text-muted-foreground">
                                {favorites.length} عنصر محفوظ
                            </p>
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8" dir="rtl">
                        <TabsList className="bg-white/50 dark:bg-muted/50 p-1 h-auto flex flex-wrap justify-start border rounded-xl w-full sm:w-auto">
                            {[
                                { id: 'all', label: 'الكل', icon: null },
                                { id: 'ayah', label: 'الآيات', icon: BookOpen },
                                { id: 'hadith', label: 'الأحاديث', icon: FileText },
                                { id: 'supplication', label: 'الأدعية', icon: Quote },
                                { id: 'sheikh', label: 'القراء', icon: User },
                                { id: 'recitation', label: 'التلاوات', icon: Volume2 },
                            ].map((tab) => {
                                const count = tab.id === 'all' ? favorites.length : favorites.filter(f => f.type === tab.id).length;
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="gap-2 px-4 py-2 rounded-lg data-[state=active]:bg-emerald-600 data-[state=active]:text-white group relative"
                                    >
                                        {tab.icon && <tab.icon className="h-4 w-4" />}
                                        <span>{tab.label}</span>
                                        <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
                                            {count}
                                        </span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        <TabsContent value={activeTab} className="mt-0">
                            {renderContent()}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}
