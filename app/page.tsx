"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Heart, ChevronLeft, Moon, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { motion, Variants } from "framer-motion"

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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center space-y-4"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    استكشف القرآن الكريم والتعاليم الإسلامية
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    استمع إلى تلاوات القرآن من شيوخ مشهورين، واقرأ الأدعية، واستكشف القرآن الكريم بواجهة حديثة وجميلة.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/quran">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      قراءة القرآن <ChevronLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sheikhs">
                    <Button variant="outline">
                      استكشف القراء <ChevronLeft className="mr-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[300px] lg:h-[400px] xl:h-[500px] overflow-hidden rounded-xl"
              >
                <Image
                  src="/images/mosque_hero.png"
                  width={600}
                  height={500}
                  alt="مصحف وروحانيات"
                  className="object-cover w-full h-full"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 right-0 p-6 text-white">
                  <p className="text-xl font-medium">ابدأ رحلتك الروحانية اليوم</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-28">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm dark:bg-emerald-800/30">
                  المميزات
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  كل ما تحتاجه لدراساتك الإسلامية
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  توفر منصتنا موارد شاملة للمسلمين الباحثين عن المعرفة والنمو الروحي.
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl items-center gap-3 py-12 lg:grid-cols-4 lg:gap-4"
            >
              <motion.div variants={itemVariants} className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <BookOpen className="h-12 w-12 text-emerald-600" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">استكشاف القرآن</h3>
                    <p className="text-muted-foreground">
                      اقرأ واستمع وادرس القرآن الكريم مع ترجمات متعددة وموارد التفسير.
                    </p>
                  </div>
                </div>
                <Link href="/quran">
                  <Button variant="outline" className="w-full">
                    استكشف القرآن
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <Users className="h-12 w-12 text-emerald-600" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">شيوخ مشهورون</h3>
                    <p className="text-muted-foreground">
                      استمع إلى تلاوات ومحاضرات من علماء وقراء محترمين من جميع أنحاء العالم.
                    </p>
                  </div>
                </div>
                <Link href="/sheikhs">
                  <Button variant="outline" className="w-full">
                    عرض الشيوخ
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <Heart className="h-12 w-12 text-emerald-600" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">الأدعية اليومية</h3>
                    <p className="text-muted-foreground">
                      الوصول إلى مجموعة من الأدعية الصحيحة لمختلف المناسبات والاحتياجات.
                    </p>
                  </div>
                </div>
                <Link href="/supplications">
                  <Button variant="outline" className="w-full">
                    عرض الأدعية
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-sm h-full hover:shadow-md transition-shadow">
                <div className="flex flex-col space-y-4">
                  <Clock className="h-12 w-12 text-emerald-600" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">مواقيت الصلاة</h3>
                    <p className="text-muted-foreground">
                      متابعة دقيقة لمواقيت الصلاة حسب موقعك الجغرافي الحالي.
                    </p>
                  </div>
                </div>
                <Link href="/prayer-times">
                  <Button variant="outline" className="w-full">
                    عرض المواقيت
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">الشيوخ المميزون</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  استمع إلى تلاوات من هؤلاء القراء المشهورين للقرآن الكريم
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                { id: 1, name: "الشيخ عبد الباسط عبد الصمد" },
                { id: 2, name: "الشيخ عبد الرحمن السديس" },
                { id: 3, name: "الشيخ مشاري راشد العفاسي" },
              ].map((sheikh) => (
                <motion.div key={sheikh.id} variants={itemVariants}>
                  <Link href={`/sheikhs/${sheikh.id}`} className="group">
                    <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                      <div className="relative h-40 w-40 mx-auto overflow-hidden rounded-full border-4 border-emerald-50 shadow-lg group-hover:border-emerald-200 transition-colors">
                        <Image
                          src={`/images/reciter_${(sheikh.id % 2) + 1}.png`}
                          width={160}
                          height={160}
                          alt={sheikh.name}
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                      <div className="space-y-2 text-center">
                        <h3 className="text-xl font-bold group-hover:text-emerald-600">{sheikh.name}</h3>
                        <p className="text-sm text-muted-foreground">قارئ مشهور بصوت جميل وتجويد مثالي</p>
                      </div>
                      <Button variant="ghost" className="mt-auto group-hover:text-emerald-600">
                        عرض الملف الشخصي <ChevronLeft className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <Link href="/sheikhs">
                <Button variant="outline">عرض جميع الشيوخ</Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">الأدعية اليومية</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  أدعية صحيحة لمختلف المناسبات
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2"
            >
              {[
                { id: "morning", title: "أذكار الصباح" },
                { id: "evening", title: "أذكار المساء" },
                { id: "after_prayer", title: "أذكار بعد الصلاة" },
                { id: "sleeping", title: "أذكار النوم" },
              ].map((category) => (
                <motion.div key={category.id} variants={itemVariants} className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{category.title}</h3>
                    <p className="text-muted-foreground">مجموعة من الأدعية الصحيحة {category.title}</p>
                  </div>
                  <Link href={`/supplications?category=${category.id}`}>
                    <Button variant="outline" className="w-full">
                      عرض المجموعة
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <Link href="/supplications">
                <Button variant="outline">عرض جميع الأدعية</Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/10 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center space-y-4"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">انضم إلى مجتمعنا</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    تواصل مع إخوانك المسلمين، وشارك الأفكار، وانمو روحياً معاً.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">سجل الآن</Button>
                  <Button variant="outline">تعرف على المزيد</Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center"
              >
                <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src="/images/community_discussion.png"
                    width={500}
                    height={300}
                    alt="المجتمع الإسلامي"
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
