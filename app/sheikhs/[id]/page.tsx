"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Volume2, Play, Bookmark, Share2, Heart, Download, ChevronDown, RotateCcw, RotateCw, Pause, SkipBack, SkipForward, X } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { useState, useEffect, useRef, use } from "react"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useAudioPlayer } from "@/components/audio-player-provider"

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

  // Use global audio player
  const { play, pause, resume, isPlaying, currentTrack } = useAudioPlayer()

  const [downloadingSurahs, setDownloadingSurahs] = useState<{ [key: number]: number }>({})
  const [abortControllers, setAbortControllers] = useState<{ [key: number]: AbortController }>({})
  const [bulkDownloadStatus, setBulkDownloadStatus] = useState<{ total: number, current: number, progress: number, isCancelled: boolean } | null>(null)

  const CircularProgress = ({ progress, size = 100, onCancel }: { progress: number, size?: number, onCancel?: () => void }) => {
    const strokeWidth = size * 0.05
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference
    const [isHovered, setIsHovered] = useState(false)

    return (
      <div
        className="relative flex items-center justify-center shrink-0 group"
        style={{ width: size, height: size }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 pointer-events-none"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-emerald-100/30 dark:text-emerald-950/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-emerald-500 dark:text-emerald-400 transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {isHovered && onCancel ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onCancel()
              }}
              className="flex items-center justify-center w-full h-full rounded-full bg-destructive text-white hover:bg-destructive/90 transition-all z-30 pointer-events-auto shadow-sm scale-110 active:scale-95"
            >
              <X className={`${size < 40 ? 'h-3 w-3' : 'h-5 w-5'}`} />
            </button>
          ) : (
            <span className={`${size < 40 ? 'text-[8px]' : 'text-[10px]'} font-bold text-emerald-700 dark:text-emerald-200 tabular-nums pointer-events-none`}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>
    )
  }

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
        console.error(" Error fetching sheikh data:", error)
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
    if (!selectedRecitation || !sheikh) return

    // Check if we are interacting with the currently active track
    if (currentTrack?.surahNumber === surah.id && currentTrack?.reciterId === parseInt(id) && currentTrack?.moshafId === selectedRecitation.id) {
      if (isPlaying) {
        pause()
      } else {
        resume()
      }
      return
    }

    const surahNum = String(surah.id).padStart(3, "0")
    const audioUrl = `${selectedRecitation.server}${surahNum}.mp3`

    // Create playlist from all available surahs
    const playlist = surahList.map(s => {
      const num = String(s.id).padStart(3, "0")
      return {
        url: `${selectedRecitation.server}${num}.mp3`,
        surahName: s.name,
        surahNumber: s.id,
        reciterName: sheikh.name,
        reciterId: parseInt(id),
        moshafId: selectedRecitation.id
      }
    })

    // Find the track to play
    const track = {
      url: audioUrl,
      surahName: surah.name,
      surahNumber: surah.id,
      reciterName: sheikh.name,
      reciterId: parseInt(id),
      moshafId: selectedRecitation.id
    }

    play(track, playlist)
  }

  const handleDownloadSurah = async (surahId: number, name?: string) => {
    if (!selectedRecitation) return
    const surahNum = String(surahId).padStart(3, "0")
    const audioUrl = `${selectedRecitation.server}${surahNum}.mp3`

    const controller = new AbortController()
    setAbortControllers(prev => ({ ...prev, [surahId]: controller }))

    try {
      setDownloadingSurahs(prev => ({ ...prev, [surahId]: 0 }))

      const response = await fetch(audioUrl, { signal: controller.signal })
      if (!response.ok) throw new Error('فشل التحميل')

      const contentLength = response.headers.get('content-length')
      const total = contentLength ? parseInt(contentLength, 10) : 0

      const reader = response.body?.getReader()
      if (!reader) throw new Error('فشل قراءة البيانات')

      let receivedLength = 0
      const chunks = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        chunks.push(value)
        receivedLength += value.length

        if (total) {
          const progress = (receivedLength / total) * 100
          setDownloadingSurahs(prev => ({ ...prev, [surahId]: progress }))
        }
      }

      const blob = new Blob(chunks)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${sheikh?.name} - ${name || 'سورة'}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Download cancelled for surah:", surahId)
      } else {
        console.error("Download error:", error)
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء محاولة تحميل السورة",
          variant: "destructive"
        })
      }
    } finally {
      setDownloadingSurahs(prev => {
        const newState = { ...prev }
        delete newState[surahId]
        return newState
      })
      setAbortControllers(prev => {
        const newState = { ...prev }
        delete newState[surahId]
        return newState
      })
    }
  }

  const handleCancelDownload = (surahId: number) => {
    if (abortControllers[surahId]) {
      abortControllers[surahId].abort()
      setDownloadingSurahs(prev => {
        const newState = { ...prev }
        delete newState[surahId]
        return newState
      })
      setAbortControllers(prev => {
        const newState = { ...prev }
        delete newState[surahId]
        return newState
      })
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownloadAllRecitations = async () => {
    if (!selectedRecitation || surahList.length === 0) return

    toast({
      title: "بدأ التحميل",
      description: `سيتم تحميل ${surahList.length} سورة في الخلفية`,
    })

    setBulkDownloadStatus({ total: surahList.length, current: 0, progress: 0, isCancelled: false })
    const statusRef = { isCancelled: false }
      ; (document as any)._bulkDownloadCancel = () => { statusRef.isCancelled = true }

    // Sequential download to avoid browser limits and heavy concurrent memory usage
    for (let i = 0; i < surahList.length; i++) {
      if (statusRef.isCancelled) break

      const surah = surahList[i]
      setBulkDownloadStatus(prev => {
        if (prev?.isCancelled) return prev
        return { ...prev!, current: i + 1, progress: ((i + 1) / surahList.length) * 100 }
      })
      await handleDownloadSurah(surah.id, surah.name)
    }

    setBulkDownloadStatus(null)
    delete (document as any)._bulkDownloadCancel
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
            <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative h-64 w-64 overflow-hidden rounded-full border-8 border-white shadow-2xl">
                  <Image
                    src="/id.jpg"
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
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">السيرة الذاتية</h2>
                  <p className="text-muted-foreground ">{sheikh?.bio || "قارئٌ للقرآن الكريم، سخّر صوته لخدمة كتاب الله، ملتزم بأحكام التجويد ونقل التلاوة كما أُنزلت، يجمع بين جمال الأداء وخشوع التلاوة، ليصل بالقرآن إلى القلوب قبل الآذان، سائلًا الله أن يجعل ما يقدّمه خالصًا لوجهه الكريم."}</p>
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
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleDownloadAllRecitations}
                              className="flex items-center gap-2 relative overflow-hidden h-10"
                              disabled={bulkDownloadStatus !== null}
                            >
                              {bulkDownloadStatus ? (
                                <>
                                  <div
                                    className="absolute inset-0 bg-emerald-500/10 transition-all duration-300"
                                    style={{ width: `${bulkDownloadStatus.progress}%` }}
                                  />
                                  <CircularProgress
                                    progress={bulkDownloadStatus.progress}
                                    size={24}
                                  />
                                  <span className="relative z-10 hidden sm:inline">جاري التحميل ({bulkDownloadStatus.current}/{bulkDownloadStatus.total})</span>
                                  <span className="relative z-10 sm:hidden">{bulkDownloadStatus.current}/{bulkDownloadStatus.total}</span>
                                </>
                              ) : (
                                <>
                                  <Download className="h-4 w-4" />
                                  <span>تحميل الكل</span>
                                </>
                              )}
                            </Button>
                            {bulkDownloadStatus && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-10 px-3"
                                onClick={() => {
                                  setBulkDownloadStatus(prev => prev ? { ...prev, isCancelled: true } : null)
                                  if ((document as any)._bulkDownloadCancel) {
                                    (document as any)._bulkDownloadCancel()
                                  }
                                  // Cancel active individual downloads
                                  Object.values(abortControllers).forEach(c => c.abort())
                                }}
                              >
                                <X className="h-4 w-4 ml-1" />
                                إلغاء الكل
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                          {surahList.map((surah: Surah) => (
                            <div
                              key={surah.id}
                              className="flex items-center justify-between bg-background p-3 rounded border hover:border-emerald-500 transition-colors"
                            >
                              <span className="text-sm font-medium">{surah.name}</span>
                              <div className="flex gap-2 items-center justify-center">
                                <Button
                                  size="sm"
                                  variant={currentTrack?.surahNumber === surah.id && currentTrack?.reciterId === parseInt(id) && currentTrack?.moshafId === selectedRecitation.id ? "default" : "outline"}
                                  onClick={() => handlePlaySurah(surah)}
                                  className={`flex items-center border-emerald-600 gap-2 h-8 px-3 ${currentTrack?.surahNumber === surah.id && currentTrack?.reciterId === parseInt(id) && currentTrack?.moshafId === selectedRecitation.id
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    }`}
                                >
                                  {currentTrack?.surahNumber === surah.id && currentTrack?.reciterId === parseInt(id) && currentTrack?.moshafId === selectedRecitation.id && isPlaying ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                  <span>{currentTrack?.surahNumber === surah.id && currentTrack?.reciterId === parseInt(id) && currentTrack?.moshafId === selectedRecitation.id && isPlaying ? "إيقاف" : "تشغيل"}</span>
                                </Button>
                                {downloadingSurahs[surah.id] !== undefined ? (
                                  <CircularProgress
                                    progress={downloadingSurahs[surah.id]}
                                    size={36}
                                    onCancel={() => handleCancelDownload(surah.id)}
                                  />
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDownloadSurah(surah.id, surah.name)}
                                    className="h-12 w-12 p-0"
                                  >
                                    <Download className="h-6 w-6" />
                                  </Button>
                                )}
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
    </div>
  )
}
