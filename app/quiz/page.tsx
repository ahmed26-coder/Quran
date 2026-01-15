"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Category {
  name: string
}

interface Answer {
  answer: string
  t: number
}

interface Question {
  id: number
  q: string
  answers: Answer[]
  category: string
  topic: string
}

export default function QuizPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)

  const levels = ["سهل", "متوسط", "صعب"]

  // جلب البيانات من الـ API الرئيسي واستخراج الفئات
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://islamicquiz.i8x.net/api/questions?limit=6000")
        const data = await response.json()
        const fetchedQuestions = data.questions || []
        setAllQuestions(fetchedQuestions)

        // استخراج الفئات الفريدة
        const uniqueCategories = Array.from(new Set(fetchedQuestions.map((q: Question) => q.category))) as string[]
        setCategories(uniqueCategories.filter(Boolean))
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [])

  // بدء الاختبار
  const startQuiz = async () => {
    let filteredQuestions = [...allQuestions]

    // تصفية حسب الفئة
    if (selectedCategory && selectedCategory !== "all") {
      filteredQuestions = filteredQuestions.filter((q: Question) => q.category === selectedCategory)
    }

    // خلط الأسئلة واختيار العدد المطلوب
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, questionCount)

    // إنشاء ID فريد للجلسة
    const sessionId = Math.random().toString(36).substring(2, 15)

    // حفظ بيانات الجلسة في localStorage
    const sessionData = {
      questions: selected,
      userAnswers: {},
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false
    }

    localStorage.setItem(`quiz_session_${sessionId}`, JSON.stringify(sessionData))

    // الانتقال إلى صفحة الاختبار
    router.push(`/quiz/${sessionId}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-emerald-600">اختبار إسلامي</h1>
            <p className="text-lg text-muted-foreground">اختبر معلوماتك الدينية</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* اختيار الفئة */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">اختر الفئة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" || selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full justify-center ${selectedCategory === "all" || selectedCategory === null ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                >
                  جميع الفئات
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full justify-center ${selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                      }`}
                  >
                    {category}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* اختيار المستوى */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">اختر المستوى</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedLevel === "all" ? "default" : "outline"}
                  onClick={() => setSelectedLevel("all")}
                  className={`w-full justify-center ${selectedLevel === "all" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                    }`}
                >
                  جميع المستويات
                </Button>
                {levels.map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full justify-center ${selectedLevel === level ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                  >
                    {level}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* اختيار عدد الأسئلة */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">عدد الأسئلة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                style={{
                  backgroundImage: `linear-gradient(to left, #059669 ${((questionCount - 5) / 45) * 100}%, #e2e8f0 ${((questionCount - 5) / 45) * 100}%)`,
                }}
              />
              <div className="text-center text-lg text-emerald-600 font-semibold">{questionCount} سؤال</div>
            </CardContent>
          </Card>

          {/* زر البدء */}
          <Button
            onClick={startQuiz}
            disabled={loading}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg text-white"
          >
            {loading ? "جاري التحميل..." : "ابدأ الاختبار"}
          </Button>
        </div>
      </main>
    </div>
  )
}
