"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Home, Compass, Search, Book } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center relative overflow-hidden px-4">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4"
                    >
                        <div className="relative inline-block">
                            <span className="text-9xl font-extrabold text-emerald-600/10 drop-shadow-sm select-none">404</span>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border-2 border-emerald-100 dark:border-emerald-900/50 shadow-xl backdrop-blur-sm">
                                    <Search className="w-12 h-12 text-emerald-600 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-foreground">عذراً، الصفحة غير موجودة</h1>
                        <p className="text-xl text-muted-foreground font-amiri leading-relaxed max-w-md mx-auto">
                            "وَعَسَى أَن تَكْرَهُوا شَيْئاً وَهُوَ خَيْرٌ لَّكُمْ"
                            <br />
                            <span className="text-sm opacity-70">ربما ضللت الطريق، ولكن كل الطرق تؤدي إلى الخير بإذن الله.</span>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto"
                    >
                        <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 shadow-lg shadow-emerald-600/20 group">
                            <Link href="/">
                                <Home className="ml-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                العودة للرئيسية
                            </Link>
                        </Button>

                        <Button asChild variant="outline" size="lg" className="border-2 border-emerald-100 dark:border-emerald-900/50 rounded-2xl h-14 bg-white/50 dark:bg-card/50 backdrop-blur-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/10 group">
                            <Link href="/quran">
                                <Book className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                                تصفح المصحف
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" size="lg" className="sm:col-span-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 rounded-2xl h-14">
                            <Link href="/contact" className="flex items-center">
                                <Compass className="ml-2 h-5 w-5" />
                                هل تعتقد أن هناك خطأ؟ تواصل معنا
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Decorative Islamic Pattern */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.03] pointer-events-none">
                        <Image src="/pattern.svg" alt="" width={400} height={400} className="dark:invert" />
                    </div>
                </div>
            </main>

            <style jsx global>{`
        .font-amiri {
          font-family: var(--font-amiri), serif;
        }
      `}</style>
        </div>
    )
}
