"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Heart, ChevronLeft, Moon, Clock, Handshake, Lightbulb, Award, Bookmark, BookMarked, Globe } from "lucide-react"
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
                  src="/quran.jpg"
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
                { id: 106, name: "الشيخ محمد الطبلاوي" },
                { id: 112, name: "الشيخ محمد صديق المنشاوي" },
                { id: 118, name: "الشيخ محمود خليل الحصري" },
              ].map((sheikh) => (
                <motion.div key={sheikh.id} variants={itemVariants}>
                  <Link href={`/sheikhs/${sheikh.id}`} className="group">
                    <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
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

        <section className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">قيمنا ومبادئنا</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  المبادئ التي نلتزم بها في عملنا وخدمتنا للمجتمع الإسلامي
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">الأصالة والموثوقية</h3>
                    <p className="text-muted-foreground">
                      نلتزم بتقديم محتوى إسلامي أصيل وموثوق به، مستمد من مصادر معتمدة ومراجع موثوقة.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">الشمولية والتنوع</h3>
                    <p className="text-muted-foreground">
                      نسعى لخدمة جميع المسلمين بمختلف خلفياتهم وثقافاتهم ولغاتهم، ونحترم التنوع في الآراء والمذاهب
                      الإسلامية.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">الابتكار والتطوير</h3>
                    <p className="text-muted-foreground">
                      نؤمن بأهمية الابتكار والتطوير المستمر لتقديم أفضل تجربة ممكنة للمستخدمين، مع الحفاظ على الأصالة
                      الإسلامية.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Handshake className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">التعاون والمشاركة</h3>
                    <p className="text-muted-foreground">
                      نشجع التعاون والمشاركة المجتمعية، ونرحب بمساهمات المستخدمين واقتراحاتهم لتحسين المنصة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">خدماتنا</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  نقدم مجموعة متنوعة من الخدمات لمساعدة المسلمين في رحلتهم الروحانية
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <BookOpen className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">القرآن الكريم</h3>
                  <p className="text-muted-foreground">
                    قراءة القرآن الكريم مع التفسير والترجمة، والاستماع إلى تلاوات بأصوات مختلفة من قراء مشهورين.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Users className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">الشيوخ والقراء</h3>
                  <p className="text-muted-foreground">
                    التعرف على الشيوخ والقراء المشهورين، والاستماع إلى تلاواتهم ومحاضراتهم، ومعرفة سيرهم الذاتية.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Heart className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">الأدعية والأذكار</h3>
                  <p className="text-muted-foreground">
                    مجموعة من الأدعية والأذكار الصحيحة لمختلف المناسبات والأوقات، مع النص العربي والترجمة والنطق.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Globe className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">مواقيت الصلاة</h3>
                  <p className="text-muted-foreground">
                    معرفة مواقيت الصلاة حسب موقعك الجغرافي، مع إمكانية ضبط الإشعارات للتذكير بأوقات الصلاة.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <BookMarked className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">المدونة الإسلامية</h3>
                  <p className="text-muted-foreground">
                    مقالات ومواضيع إسلامية متنوعة تتناول مختلف جوانب الدين الإسلامي، كتبها علماء ومختصون.
                  </p>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <Bookmark className="h-12 w-12 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">الأسئلة الشائعة</h3>
                  <p className="text-muted-foreground">
                    إجابات على الأسئلة الشائعة حول الإسلام والعبادات والمعاملات، مدعومة بالأدلة من القرآن والسنة.
                  </p>
                </div>
              </div>
            </div>
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
                    شارك الأفكار، وانمُ روحيًا معنا، وكن جزءًا من مجتمعٍ يجمع القلوب على طاعة الله، نتشارك فيه العلم، ونتواصى بالحق، ونقوّي إيماننا معًا.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">سجل الآن</Button>
                  <Button variant="outline" asChild>
                    <Link href="#features">تعرّف على المزيد</Link>
                  </Button>

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
                    src="/home.jpg"
                    width={500}
                    height={300}
                    loading="lazy"
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
