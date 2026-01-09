"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Volume2, Play, Bookmark, Share2, Heart, Download, ChevronDown, RotateCcw, RotateCw, Pause, SkipBack, SkipForward, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { useState, useEffect, useRef, use } from "react"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Surah {
  id: number
  name: string
}

export default function SheikhDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const [sheikh, setSheikh] = useState<any>(null)
  const [recitations, setRecitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRecitation, setSelectedRecitation] = useState<any>(null)
  const [expandedRecitation, setExpandedRecitation] = useState<number | null>(null)
  const [surahList, setSurahList] = useState<Surah[]>([])

  const allSurahs: Surah[] = [
    { id: 1, name: "الفاتحة" },
    { id: 2, name: "البقرة" },
    { id: 3, name: "آل عمران" },
    { id: 4, name: "النساء" },
    { id: 5, name: "المائدة" },
    { id: 6, name: "الأنعام" },
    { id: 7, name: "الأعراف" },
    { id: 8, name: "الأنفال" },
    { id: 9, name: "التوبة" },
    { id: 10, name: "يونس" },
    { id: 11, name: "هود" },
    { id: 12, name: "يوسف" },
    { id: 13, name: "الرعد" },
    { id: 14, name: "إبراهيم" },
    { id: 15, name: "الحجر" },
    { id: 16, name: "النحل" },
    { id: 17, name: "الإسراء" },
    { id: 18, name: "الكهف" },
    { id: 19, name: "مريم" },
    { id: 20, name: "طه" },
    { id: 21, name: "الأنبياء" },
    { id: 22, name: "الحج" },
    { id: 23, name: "المؤمنون" },
    { id: 24, name: "النور" },
    { id: 25, name: "الفرقان" },
    { id: 26, name: "الشعراء" },
    { id: 27, name: "النمل" },
    { id: 28, name: "القصص" },
    { id: 29, name: "العنكبوت" },
    { id: 30, name: "الروم" },
    { id: 31, name: "لقمان" },
    { id: 32, name: "السجدة" },
    { id: 33, name: "الأحزاب" },
    { id: 34, name: "سبأ" },
    { id: 35, name: "فاطر" },
    { id: 36, name: "يس" },
    { id: 37, name: "الصافات" },
    { id: 38, name: "ص" },
    { id: 39, name: "الزمر" },
    { id: 40, name: "غافر" },
    { id: 41, name: "فصلت" },
    { id: 42, name: "الشورى" },
    { id: 43, name: "الزخرف" },
    { id: 44, name: "الدخان" },
    { id: 45, name: "الجاثية" },
    { id: 46, name: "الأحقاف" },
    { id: 47, name: "محمد" },
    { id: 48, name: "الفتح" },
    { id: 49, name: "الحجرات" },
    { id: 50, name: "ق" },
    { id: 51, name: "الذاريات" },
    { id: 52, name: "الطور" },
    { id: 53, name: "النجم" },
    { id: 54, name: "القمر" },
    { id: 55, name: "الرحمن" },
    { id: 56, name: "الواقعة" },
    { id: 57, name: "الحديد" },
    { id: 58, name: "المجادلة" },
    { id: 59, name: "الحشر" },
    { id: 60, name: "الممتحنة" },
    { id: 61, name: "الصف" },
    { id: 62, name: "الجمعة" },
    { id: 63, name: "المنافقون" },
    { id: 64, name: "التغابن" },
    { id: 65, name: "الطلاق" },
    { id: 66, name: "التحريم" },
    { id: 67, name: "الملك" },
    { id: 68, name: "القلم" },
    { id: 69, name: "الحاقة" },
    { id: 70, name: "المعارج" },
    { id: 71, name: "نوح" },
    { id: 72, name: "الجن" },
    { id: 73, name: "المزمل" },
    { id: 74, name: "المدثر" },
    { id: 75, name: "القيامة" },
    { id: 76, name: "الإنسان" },
    { id: 77, name: "المرسلات" },
    { id: 78, name: "النبأ" },
    { id: 79, name: "النازعات" },
    { id: 80, name: "عبس" },
    { id: 81, name: "التكوير" },
    { id: 82, name: "الإنفطار" },
    { id: 83, name: "المطففين" },
    { id: 84, name: "الانشقاق" },
    { id: 85, name: "البروج" },
    { id: 86, name: "الطارق" },
    { id: 87, name: "الأعلى" },
    { id: 88, name: "الغاشية" },
    { id: 89, name: "الفجر" },
    { id: 90, name: "البلد" },
    { id: 91, name: "الشمس" },
    { id: 92, name: "الليل" },
    { id: 93, name: "الضحى" },
    { id: 94, name: "الشرح" },
    { id: 95, name: "التين" },
    { id: 96, name: "العلق" },
    { id: 97, name: "القدر" },
    { id: 98, name: "البينة" },
    { id: 99, name: "الزلزلة" },
    { id: 100, name: "العاديات" },
    { id: 101, name: "القارعة" },
    { id: 102, name: "التكاثر" },
    { id: 103, name: "العصر" },
    { id: 104, name: "الهمزة" },
    { id: 105, name: "الفيل" },
    { id: 106, name: "قريش" },
    { id: 107, name: "الماعون" },
    { id: 108, name: "الكوثر" },
    { id: 109, name: "الكافرون" },
    { id: 110, name: "النصر" },
    { id: 111, name: "المسد" },
    { id: 112, name: "الإخلاص" },
    { id: 113, name: "الفلق" },
    { id: 114, name: "الناس" },
  ]

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<{ url: string, surahName: string, surahId: number } | null>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchSheikhData = async () => {
      try {
        const response = await fetch(`https://mp3quran.net/api/v3/reciters?language=ar&reciter=${id}`)
        const data = await response.json()

        if (data.reciters && data.reciters.length > 0) {
          const sheikhData = data.reciters[0]
          setSheikh(sheikhData)

          if (sheikhData.moshaf && sheikhData.moshaf.length > 0) {
            setRecitations(sheikhData.moshaf)
            setSelectedRecitation(sheikhData.moshaf[0])
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching sheikh data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSheikhData()
  }, [id])

  const { toast } = useToast()

  const handleShare = async () => {
    const shareData = {
      title: `تلاوات القارئ ${sheikh?.name}`,
      text: `استمع إلى أجمل تلاوات ${sheikh?.name} على تطبيق القرآن الكريم`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "تم نسخ الرابط",
          description: "يمكنك الآن مشاركة الرابط مع الآخرين",
        })
      }
    } catch (err) {
      console.error("Error sharing:", err)
    }
  }

  const handleRecitationSelect = (recitation: any) => {
    setSelectedRecitation(recitation)
    setExpandedRecitation(recitation.id)

    if (recitation.surah_list) {
      const surahIds = recitation.surah_list.split(",").map((id: string) => Number.parseInt(id))
      const availableSurahs = allSurahs.filter((surah) => surahIds.includes(surah.id))
      setSurahList(availableSurahs)
    }
  }

  const handlePlaySurah = (surah: Surah) => {
    if (!selectedRecitation) return
    const surahNum = String(surah.id).padStart(3, "0")
    const audioUrl = `${selectedRecitation.server}${surahNum}.mp3`

    if (currentAudio?.url === audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause()
      } else {
        audioRef.current?.play()
      }
      return
    }

    setCurrentAudio({ url: audioUrl, surahName: surah.name, surahId: surah.id })
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setProgress(value[0])
    }
  }

  const skipTime = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount))
    }
  }

  const handleDownloadSurah = (surahId: number, name?: string) => {
    if (!selectedRecitation) return
    const surahNum = String(surahId).padStart(3, "0")
    const audioUrl = `${selectedRecitation.server}${surahNum}.mp3`
    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${sheikh?.name} - ${name || 'سورة'}.mp3`
    link.click()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownloadAllRecitations = async () => {
    if (!selectedRecitation || surahList.length === 0) return

    // يمكن إضافة مكتبة مثل jszip لتحميل عدة ملفات
    // للآن، سنعرض رسالة للمستخدم
    alert(`سيتم تحميل ${surahList.length} سورة. هذا قد يستغرق بعض الوقت.`)

    for (const surah of surahList) {
      setTimeout(() => {
        handleDownloadSurah(surah.id, surah.name)
      }, 500)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-64 w-64 overflow-hidden rounded-full border-8 border-white shadow-2xl">
                  <Image
                    src={`/images/reciter_${(id ? parseInt(id) % 2 : 0) + 1}.png`}
                    width={256}
                    height={256}
                    alt={sheikh?.name || "قارئ"}
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">مشاركة</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{sheikh?.name}</h1>
                <p className="text-muted-foreground">{sheikh?.country || "قارئ قرآن كريم"}</p>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">السيرة الذاتية</h2>
                  <p className="text-muted-foreground">{sheikh?.bio || "قارئ قرآن كريم متميز"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">التلاوات المتاحة</h2>
            <div className="space-y-4">
              {recitations.length > 0 ? (
                recitations.map((recitation: any) => (
                  <div key={recitation.id} className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleRecitationSelect(recitation)}
                      className="w-full flex items-center justify-between p-4 bg-background hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4 text-right">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                          <Volume2 className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{recitation.name}</h3>
                          <p className="text-sm text-muted-foreground">عدد السور: {recitation.surah_total}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${expandedRecitation === recitation.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {expandedRecitation === recitation.id && (
                      <div className="bg-muted/50 p-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-right">السور المتاحة ({surahList.length})</h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              alert(`سيتم تحميل ${surahList.length} سورة. هذا قد يستغرق بعض الوقت.`)
                              for (const surah of surahList) {
                                setTimeout(() => {
                                  const surahNum = String(surah.id).padStart(3, "0")
                                  const audioUrl = `${selectedRecitation.server}${surahNum}.mp3`
                                  const link = document.createElement("a")
                                  link.href = audioUrl
                                  link.download = `${sheikh.name} - ${surah.name}.mp3`
                                  link.click()
                                }, 500)
                              }
                            }}
                            className="flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            تحميل الكل
                          </Button>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                          {surahList.map((surah: Surah) => (
                            <div
                              key={surah.id}
                              className="flex items-center justify-between bg-background p-3 rounded border hover:border-emerald-500 transition-colors"
                            >
                              <span className="text-sm font-medium">{surah.name}</span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant={currentAudio?.surahId === surah.id ? "default" : "outline"}
                                  onClick={() => handlePlaySurah(surah)}
                                  className="flex items-center gap-2 h-8 px-3"
                                >
                                  {currentAudio?.surahId === surah.id && isPlaying ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                  <span>{currentAudio?.surahId === surah.id && isPlaying ? "إيقاف" : "تشغيل"}</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownloadSurah(surah.id, surah.name)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">لا توجد تلاوات متاحة</p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Persistent Audio Player Bar */}
      <AnimatePresence>
        {currentAudio && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-emerald-100 dark:border-emerald-900/30 p-4 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-4 md:gap-8">
              {/* Surah Info */}
              <div className="flex items-center gap-4 w-full md:w-auto min-w-[150px]">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Volume2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm truncate">{currentAudio.surahName}</h4>
                  <p className="text-xs text-muted-foreground truncate">{sheikh?.name}</p>
                </div>
              </div>

              {/* Controls & Progress */}
              <div className="flex flex-col flex-1 w-full gap-2">
                <div className="flex items-center justify-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => skipTime(-10)} className="rounded-full">
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => {
                      if (isPlaying) audioRef.current?.pause()
                      else audioRef.current?.play()
                    }}
                    className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 mr-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => skipTime(10)} className="rounded-full">
                    <RotateCw className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right">{formatTime(progress)}</span>
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="flex-1"
                  />
                  <span className="text-[10px] tabular-nums text-muted-foreground w-8">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Additional Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {
                  const link = document.createElement("a")
                  link.href = currentAudio.url
                  link.download = `${sheikh.name} - ${currentAudio.surahName}.mp3`
                  link.click()
                }}>
                  <Download className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCurrentAudio(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
