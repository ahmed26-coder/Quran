import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Globe,
  Heart,
  Award,
  Bookmark,
  Users,
  BookMarked,
  Handshake,
  Lightbulb,
  Target,
  Star,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">عن بوابة القرآن</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  منصة إسلامية حديثة تهدف إلى تقديم القرآن الكريم والتعاليم الإسلامية بطريقة سهلة وجذابة
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter">رؤيتنا ورسالتنا</h2>
                  <p className="text-muted-foreground">
                    تأسست بوابة القرآن بهدف تسهيل وصول المسلمين في جميع أنحاء العالم إلى القرآن الكريم والتعاليم
                    الإسلامية من خلال منصة رقمية حديثة وسهلة الاستخدام. نسعى لتقديم محتوى إسلامي أصيل وموثوق به بطريقة
                    تناسب العصر الحديث.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">أهدافنا</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>تسهيل الوصول إلى القرآن الكريم وتلاواته بجودة عالية</li>
                    <li>توفير مجموعة من الأدعية والأذكار الصحيحة للمسلمين في حياتهم اليومية</li>
                    <li>التعريف بالشيوخ والقراء المشهورين وتقديم تلاواتهم ومحاضراتهم</li>
                    <li>بناء مجتمع إسلامي رقمي يساعد المسلمين على التعلم والنمو الروحي</li>
                    <li>استخدام التكنولوجيا الحديثة لخدمة الدين الإسلامي ونشر تعاليمه</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[400px] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=رؤيتنا+ورسالتنا"
                    width={600}
                    height={400}
                    alt="رؤيتنا ورسالتنا"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">قصة بوابة القرآن</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  كيف بدأت رحلتنا في خدمة القرآن الكريم والمسلمين حول العالم
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">البدايات</h3>
                  <p className="text-muted-foreground">
                    بدأت فكرة بوابة القرآن في عام 2018 عندما لاحظ مجموعة من المطورين المسلمين الحاجة إلى منصة رقمية
                    حديثة تجمع بين التصميم الجميل وسهولة الاستخدام لتقديم القرآن الكريم والمحتوى الإسلامي. كانت الرؤية
                    هي إنشاء منصة تجمع بين الأصالة والمعاصرة، وتكون متاحة للجميع بغض النظر عن مكان تواجدهم.
                  </p>
                  <p className="text-muted-foreground">
                    بعد أشهر من البحث والتطوير، تم إطلاق النسخة الأولى من الموقع في رمضان 2019، وكانت تحتوي على القرآن
                    الكريم فقط مع إمكانية الاستماع إلى بعض التلاوات. ومع مرور الوقت، توسعت المنصة لتشمل المزيد من
                    الميزات والمحتوى.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">التطور والنمو</h3>
                  <p className="text-muted-foreground">
                    مع تزايد عدد المستخدمين، استمعنا إلى ملاحظاتهم واقتراحاتهم وعملنا على تحسين المنصة باستمرار. أضفنا
                    قسم الأدعية والأذكار، وقسم الشيوخ والقراء، وطورنا واجهة المستخدم لتكون أكثر سهولة وجاذبية.
                  </p>
                  <p className="text-muted-foreground">
                    في عام 2021، أطلقنا تطبيق الهاتف المحمول لبوابة القرآن، مما سمح للمستخدمين بالوصول إلى المحتوى في أي
                    وقت ومكان. وفي عام 2022، أضفنا ميزة مواقيت الصلاة والقبلة، وتوسعنا لدعم المزيد من اللغات لخدمة
                    المسلمين في جميع أنحاء العالم.
                  </p>
                </div>
              </div>
              <div className="mt-12 relative h-[300px] w-full overflow-hidden rounded-xl">
                <Image
                  src="/placeholder.svg?height=300&width=1000&text=رحلة+بوابة+القرآن"
                  width={1000}
                  height={300}
                  alt="رحلة بوابة القرآن"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
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

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">إنجازاتنا ومعالم رحلتنا</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  أبرز الإنجازات والمعالم التي حققناها منذ إطلاق بوابة القرآن
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <div className="space-y-8">
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-8 md:space-x-reverse">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 md:h-20 md:w-20">
                    <span className="text-xl font-bold md:text-2xl">2019</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">إطلاق بوابة القرآن</h3>
                    <p className="text-muted-foreground">
                      إطلاق النسخة الأولى من بوابة القرآن في شهر رمضان المبارك، مع توفير القرآن الكريم وبعض التلاوات.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-8 md:space-x-reverse">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 md:h-20 md:w-20">
                    <span className="text-xl font-bold md:text-2xl">2020</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">توسيع المحتوى والخدمات</h3>
                    <p className="text-muted-foreground">
                      إضافة قسم الأدعية والأذكار، وقسم الشيوخ والقراء، وتحسين واجهة المستخدم، والوصول إلى 100,000 مستخدم
                      شهرياً.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-8 md:space-x-reverse">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 md:h-20 md:w-20">
                    <span className="text-xl font-bold md:text-2xl">2021</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">إطلاق تطبيق الهاتف المحمول</h3>
                    <p className="text-muted-foreground">
                      إطلاق تطبيق بوابة القرآن للهواتف الذكية على نظامي Android و iOS، وتجاوز عدد المستخدمين 500,000
                      مستخدم شهرياً.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-8 md:space-x-reverse">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 md:h-20 md:w-20">
                    <span className="text-xl font-bold md:text-2xl">2022</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">دعم المزيد من اللغات والميزات</h3>
                    <p className="text-muted-foreground">
                      إضافة دعم لـ 10 لغات جديدة، وإطلاق ميزة مواقيت الصلاة والقبلة، والوصول إلى مليون مستخدم شهرياً.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-8 md:space-x-reverse">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 md:h-20 md:w-20">
                    <span className="text-xl font-bold md:text-2xl">2023</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">تطوير المنصة وتوسيع الشراكات</h3>
                    <p className="text-muted-foreground">
                      إعادة تصميم المنصة بالكامل، وإطلاق برنامج الشراكات مع المؤسسات الإسلامية، وتجاوز عدد المستخدمين 2
                      مليون مستخدم شهرياً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">شراكاتنا وتعاوناتنا</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  نفخر بالتعاون مع العديد من المؤسسات والمنظمات الإسلامية حول العالم
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                "مجمع الملك فهد لطباعة المصحف الشريف",
                "رابطة العالم الإسلامي",
                "الأزهر الشريف",
                "وزارة الشؤون الإسلامية السعودية",
                "مؤسسة محمد بن راشد آل مكتوم للمعرفة",
                "المنظمة الإسلامية للتربية والعلوم والثقافة",
              ].map((partner, i) => (
                <div key={i} className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg">
                    <Image
                      src={`/placeholder.svg?height=128&width=256&text=${partner.split(" ").slice(0, 2).join("+")}`}
                      width={256}
                      height={128}
                      alt={partner}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-center">{partner}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">آراء المستخدمين</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ما يقوله مستخدمو بوابة القرآن عن تجربتهم مع المنصة
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "أحمد محمد",
                  location: "مصر",
                  testimonial:
                    "بوابة القرآن هي أفضل منصة إسلامية استخدمتها. التصميم جميل وسهل الاستخدام، والمحتوى غني ومفيد. أستخدمها يومياً لقراءة القرآن والأذكار.",
                },
                {
                  name: "فاطمة علي",
                  location: "المملكة العربية السعودية",
                  testimonial:
                    "أحب تطبيق بوابة القرآن كثيراً. يساعدني على الالتزام بقراءة القرآن يومياً، والتذكير بمواقيت الصلاة مفيد جداً. شكراً لكم على هذا العمل الرائع.",
                },
                {
                  name: "عبد الله عمر",
                  location: "الإمارات العربية المتحدة",
                  testimonial:
                    "منصة متكاملة تجمع كل ما يحتاجه المسلم في مكان واحد. أستخدمها للقرآن والأدعية ومواقيت الصلاة. التطبيق سريع وموثوق، وأنصح به جميع المسلمين.",
                },
                {
                  name: "نورة محمد",
                  location: "الكويت",
                  testimonial:
                    "أشكركم على هذه المنصة الرائعة. ساعدتني كثيراً في حفظ القرآن والالتزام بالأذكار اليومية. الواجهة سهلة الاستخدام والمحتوى دقيق وموثوق.",
                },
                {
                  name: "محمد أحمد",
                  location: "الأردن",
                  testimonial:
                    "بوابة القرآن هي رفيقي اليومي. أستخدمها للاستماع إلى التلاوات أثناء التنقل، وللتذكير بمواقيت الصلاة. شكراً لكم على هذا المجهود الرائع.",
                },
                {
                  name: "سارة خالد",
                  location: "المغرب",
                  testimonial:
                    "منصة مميزة بتصميمها الجميل ومحتواها الثري. أحب خاصية البحث في القرآن والأدعية، وأستفيد كثيراً من المقالات الإسلامية. جزاكم الله خيراً.",
                },
              ].map((testimonial, i) => (
                <div key={i} className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="italic text-muted-foreground">"{testimonial.testimonial}"</p>
                  </div>
                  <div className="mt-auto pt-4 border-t">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">خططنا المستقبلية</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  نسعى دائماً للتطوير والتحسين لتقديم أفضل تجربة ممكنة للمستخدمين
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">توسيع نطاق اللغات</h3>
                    <p className="text-muted-foreground">
                      نعمل على إضافة المزيد من اللغات لتوسيع نطاق الوصول إلى المسلمين في جميع أنحاء العالم.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">تطوير تقنيات الذكاء الاصطناعي</h3>
                    <p className="text-muted-foreground">
                      نستثمر في تقنيات الذكاء الاصطناعي لتحسين تجربة البحث والتعلم في القرآن الكريم والعلوم الإسلامية.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">إطلاق منصة تعليمية</h3>
                    <p className="text-muted-foreground">
                      نخطط لإطلاق منصة تعليمية متكاملة لتعليم القرآن الكريم والعلوم الإسلامية بطرق تفاعلية وجذابة.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">تطوير المجتمع الإسلامي</h3>
                    <p className="text-muted-foreground">
                      نعمل على تطوير منصة اجتماعية للمسلمين للتواصل وتبادل المعرفة والخبرات في إطار إسلامي آمن ومفيد.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">كيف يمكنك المساهمة</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  طرق مختلفة للمساهمة في تطوير بوابة القرآن ودعم رسالتها
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">التبرع المالي</h3>
                  <p className="text-muted-foreground">
                    يمكنك دعم بوابة القرآن مالياً للمساهمة في تطويرها وتوسيع نطاق خدماتها.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">تبرع الآن</Button>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">التطوع</h3>
                  <p className="text-muted-foreground">
                    يمكنك التطوع بوقتك ومهاراتك في مجالات مختلفة مثل الترجمة، والتطوير، والتصميم، وإنتاج المحتوى.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">انضم كمتطوع</Button>
                </div>
              </div>
              <div className="flex flex-col space-y-4 rounded-lg border bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">المشاركة والنشر</h3>
                  <p className="text-muted-foreground">
                    يمكنك المساهمة بنشر بوابة القرآن ومشاركتها مع أصدقائك وعائلتك، وتقديم ملاحظاتك واقتراحاتك لتحسينها.
                  </p>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">شارك الآن</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
