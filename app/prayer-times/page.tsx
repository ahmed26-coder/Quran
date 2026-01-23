"use client"

import { useState, useEffect, useCallback } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Search, Loader2, Calendar, Navigation } from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface PrayerTimings {
    Fajr: string
    Sunrise: string
    Dhuhr: string
    Asr: string
    Maghrib: string
    Isha: string
    [key: string]: string
}

interface AladhanData {
    timings: PrayerTimings
    date: {
        readable: string
        hijri: {
            date: string
            day: string
            month: { ar: string }
            year: string
        }
    }
    meta: {
        timezone: string
        method: { name: string }
    }
}

const PRAYER_NAMES: Record<string, string> = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
}

export default function PrayerTimesPage() {
    const [data, setData] = useState<AladhanData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [searchMode, setSearchMode] = useState(false)

    const fetchByCoords = useCallback(async (lat: number, lng: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=4`, {
                cache: "force-cache"
            })
            const json = await res.json()
            if (json.code === 200) {
                setData(json.data)
            } else {
                throw new Error("فشل في جلب البيانات")
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchByCity = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!city || !country) return
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`, {
                cache: "force-cache"
            })
            const json = await res.json()
            if (json.code === 200) {
                setData(json.data)
            } else {
                throw new Error("لم يتم العثور على المدينة المطلوبة")
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
                () => {
                    // Fallback to Cairo if geolocation fails
                    setCity("Cairo")
                    setCountry("Egypt")
                    setSearchMode(true)
                }
            )
        } else {
            setCity("Cairo")
            setCountry("Egypt")
            setSearchMode(true)
        }
    }, [fetchByCoords])

    useEffect(() => {
        if (city && country && !data && loading) {
            fetchByCity()
        }
    }, [city, country, data, loading])

    const formatTo12Hour = (time: string) => {
        if (!time) return { time: "", period: "" }
        const [hours, minutes] = time.split(":").map(Number)
        const period = hours >= 12 ? "م" : "ص"
        const hour12 = hours % 12 || 12
        return {
            time: `${hour12}:${minutes.toString().padStart(2, "0")}`,
            period
        }
    }

    const [nextPrayer, setNextPrayer] = useState<{ name: string, time: string, remaining: string } | null>(null)

    useEffect(() => {
        if (!data) return

        const timer = setInterval(() => {
            const now = new Date()
            const currentTotalMinutes = now.getHours() * 60 + now.getMinutes()

            const timesList = Object.entries(PRAYER_NAMES).map(([key, name]) => {
                const [h, m] = data.timings[key].split(":").map(Number)
                return { key, name, totalMinutes: h * 60 + m }
            })

            // Find the next prayer
            let next = timesList.find(p => p.totalMinutes > currentTotalMinutes)

            // If all prayers today have passed, the next one is Fajr tomorrow
            if (!next) {
                next = timesList[0] // Fajr
            }

            // Calculate remaining time
            let diff = next.totalMinutes - currentTotalMinutes
            if (diff < 0) diff += 24 * 60 // If it's tomorrow's Fajr

            const hours = Math.floor(diff / 60)
            const minutes = diff % 60
            const seconds = 59 - now.getSeconds()

            setNextPrayer({
                name: next.name,
                time: data.timings[next.key],
                remaining: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [data])

    return (
        <div className="flex flex-col min-h-screen bg-emerald-50/30 dark:bg-background">
            <SiteHeader />
            <main className="flex-1 container px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-emerald-800 dark:text-emerald-400">
                                مواقيت الصلاة
                            </h1>
                            <p className="text-muted-foreground md:text-xl">
                                أوقات الصلاة الدقيقة بناءً على موقعك الجغرافي
                            </p>
                        </motion.div>

                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <Button
                                variant={searchMode ? "outline" : "default"}
                                onClick={() => {
                                    setSearchMode(false)
                                    navigator.geolocation.getCurrentPosition((pos) => fetchByCoords(pos.coords.latitude, pos.coords.longitude))
                                }}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                <Navigation className="h-4 w-4" />
                                استخدام موقعي الحالي
                            </Button>
                            <Button
                                variant={searchMode ? "default" : "outline"}
                                onClick={() => setSearchMode(true)}
                                className="gap-2"
                            >
                                <Search className="h-4 w-4" />
                                بحث عن مدينة
                            </Button>
                        </div>

                        <AnimatePresence>
                            {searchMode && (
                                <motion.form
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onSubmit={fetchByCity}
                                    className="flex flex-col sm:flex-row gap-2 w-full max-w-md pt-4"
                                >
                                    <Input
                                        placeholder="المدينة (مثلاً: Cairo)"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="الدولة (مثلاً: Egypt)"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                        بحث
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
                            <p className="mt-4 text-emerald-600 font-medium">جاري تحديث المواقيت...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 text-center text-red-600">
                            <p>{error}</p>
                            <Button variant="link" onClick={() => setSearchMode(true)}>جرب البحث اليدوي</Button>
                        </div>
                    ) : data && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Date & Location Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-emerald-100 dark:border-emerald-900/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                            <Calendar className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">التاريخ</p>
                                            <p className="font-bold">{data.date.readable}</p>
                                            <p className="text-xs text-emerald-600">{data.date.hijri.date} {data.date.hijri.month.ar} </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-emerald-100 dark:border-emerald-900/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                                    <CardContent className="flex items-center gap-4 pt-6">
                                        <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                                            <MapPin className="h-6 w-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">الموقع والمنطقة الزمنية</p>
                                            <p className="font-bold">{data.meta.timezone}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Prayer Times Grid */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
                            >
                                {Object.entries(PRAYER_NAMES).map(([key, name]) => (
                                    <motion.div key={key} variants={itemVariants}>
                                        <Card className="relative overflow-hidden group hover:border-emerald-500 transition-colors">
                                            <CardHeader className="p-4 text-center pb-2">
                                                <Clock className="h-8 w-8 mx-auto text-emerald-600 group-hover:scale-110 transition-transform" />
                                                <CardTitle className="text-sm font-medium mt-2">{name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 text-center">
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <p className="text-3xl font-bold font-mono text-emerald-950 dark:text-emerald-50">
                                                        {formatTo12Hour(data.timings[key]).time}
                                                    </p>
                                                    <span className="text-2xl font-medium text-emerald-600">
                                                        {formatTo12Hour(data.timings[key]).period}
                                                    </span>
                                                </div>
                                            </CardContent>
                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Next Prayer Highlight (Optional but good for UX) */}
                            <div className="bg-emerald-600 text-white rounded-2xl p-8 text-center shadow-xl shadow-emerald-600/20">
                                <h2 className="text-2xl font-bold mb-2">الصلاة القادمة: {nextPrayer?.name}</h2>
                                <p className="text-emerald-100 opacity-80 mb-4">حافظ على صلاتك لتطمئن نفسك</p>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="inline-flex items-center gap-3 bg-white/20 px-8 py-3 rounded-full backdrop-blur-md">
                                        <Clock className="h-6 w-6" />
                                        <span className="text-3xl font-bold font-mono tracking-widest">{nextPrayer?.remaining}</span>
                                    </div>
                                    <div className="inline-flex items-center ">
                                        <span className="text-xl font-bold">تقبل الله منا ومنكم صالح الأعمال</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        .font-amiri {
          font-family: 'Amiri', serif;
        }
      `}</style>
        </div>
    )
}
