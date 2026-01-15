"use client"

import { useState, useEffect, use } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

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

interface QuizSession {
    questions: Question[]
    userAnswers: { [key: number]: number }
    currentQuestionIndex: number
    score: number
    isFinished: boolean
}

export default function QuizSessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()

    const [session, setSession] = useState<QuizSession | null>(null)
    const [loading, setLoading] = useState(true)

    // Load session from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem(`quiz_session_${id}`)
        if (savedSession) {
            setSession(JSON.parse(savedSession))
            setLoading(false)
        } else {
            // If no session found, redirect back to setup
            router.push("/quiz")
        }
    }, [id, router])

    // Save session to localStorage whenever it changes
    useEffect(() => {
        if (session) {
            localStorage.setItem(`quiz_session_${id}`, JSON.stringify(session))
        }
    }, [session, id])

    if (loading || !session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="text-lg font-medium">جاري تحميل الاختبار...</p>
            </div>
        )
    }

    const { questions, userAnswers, currentQuestionIndex, score, isFinished } = session

    const handleAnswerSelect = (optionIndex: number) => {
        setSession({
            ...session,
            userAnswers: {
                ...userAnswers,
                [currentQuestionIndex]: optionIndex,
            },
        })
    }

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setSession({
                ...session,
                currentQuestionIndex: currentQuestionIndex + 1,
            })
        } else {
            finishQuiz()
        }
    }

    const finishQuiz = () => {
        let correctCount = 0
        questions.forEach((question, index) => {
            const selectedAnswerIndex = userAnswers[index]
            if (selectedAnswerIndex !== undefined && question.answers[selectedAnswerIndex].t === 1) {
                correctCount++
            }
        })
        const finalScore = Math.round((correctCount / questions.length) * 100)
        setSession({
            ...session,
            score: finalScore,
            isFinished: true,
        })
    }

    const restartQuiz = () => {
        localStorage.removeItem(`quiz_session_${id}`)
        router.push("/quiz")
    }

    if (isFinished) {
        return (
            <div className="min-h-screen flex flex-col bg-background">

                <SiteHeader />
                <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                    <div className="space-y-6 text-center">
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="pt-12 pb-12">
                                <div className="space-y-4">
                                    <div className="text-6xl font-bold text-emerald-600">{score}%</div>
                                    <h2 className="text-3xl font-bold">تم إنهاء الاختبار</h2>
                                    <p className="text-lg text-muted-foreground">لقد أجبت على جميع الأسئلة بنجاح</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-right">ملخص النتائج</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-right">
                                <div className="flex justify-between">
                                    <span className="font-semibold">إجمالي الأسئلة:</span>
                                    <span>{questions.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">الإجابات الصحيحة:</span>
                                    <span className="text-emerald-600">{Math.round((score / 100) * questions.length)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">الإجابات الخاطئة:</span>
                                    <span className="text-red-600">
                                        {questions.length - Math.round((score / 100) * questions.length)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-semibold">النسبة المئوية:</span>
                                    <span className="font-bold text-emerald-600">{score}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                {score >= 80 && (
                                    <div className="text-center space-y-2">
                                        <div className="text-5xl">🎉</div>
                                        <p className="text-xl font-semibold text-green-600">ممتاز جداً!</p>
                                        <p className="text-muted-foreground">أداء رائع، مستوى معرفتك عالي جداً</p>
                                    </div>
                                )}
                                {score >= 60 && score < 80 && (
                                    <div className="text-center space-y-2">
                                        <div className="text-5xl">👏</div>
                                        <p className="text-xl font-semibold text-blue-600">جيد!</p>
                                        <p className="text-muted-foreground">أداء جيد، حاول المزيد من الاختبارات</p>
                                    </div>
                                )}
                                {score >= 40 && score < 60 && (
                                    <div className="text-center space-y-2">
                                        <div className="text-5xl">📚</div>
                                        <p className="text-xl font-semibold text-yellow-600">متوسط</p>
                                        <p className="text-muted-foreground">استمر في التعلم والمراجعة</p>
                                    </div>
                                )}
                                {score < 40 && (
                                    <div className="text-center space-y-2">
                                        <div className="text-5xl">💪</div>
                                        <p className="text-xl font-semibold text-orange-600">تحتاج مراجعة</p>
                                        <p className="text-muted-foreground">لا تستسلم، حاول مرة أخرى</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid md:grid-cols-2 gap-3">
                            <Button className=" bg-emerald-600 hover:bg-emerald-700 text-white" onClick={restartQuiz} size="lg">
                                اختبار جديد
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/">العودة للرئيسية</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SiteHeader />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-emerald-600">اختبار إسلامي</h1>
                    <p className="text-lg text-muted-foreground">اختبر معلوماتك الدينية</p>
                </div>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">
                                السؤال {currentQuestionIndex + 1} من {questions.length}
                            </span>
                            <span className="text-muted-foreground">
                                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <div
                                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-right text-xl">{questions[currentQuestionIndex].q}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {questions[currentQuestionIndex].answers.map((option, index) => (
                                <Button
                                    key={index}
                                    variant={userAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`w-full h-auto p-4 text-right justify-start ${userAnswers[currentQuestionIndex] === index ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                                        }`}
                                >
                                    <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
                                    {option.answer}
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex gap-3 justify-between">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setSession({
                                    ...session,
                                    currentQuestionIndex: Math.max(0, currentQuestionIndex - 1),
                                })
                            }
                            disabled={currentQuestionIndex === 0}
                        >
                            السؤال السابق
                        </Button>
                        <Button
                            onClick={nextQuestion}
                            disabled={userAnswers[currentQuestionIndex] === undefined}
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            {currentQuestionIndex === questions.length - 1 ? "إنهاء الاختبار" : "السؤال التالي"}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
