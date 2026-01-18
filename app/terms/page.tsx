'use client'

import { SiteHeader } from "@/components/site-header"
import { BookOpen, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <BookOpen className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">شروط الخدمة</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  اقرأ شروط وأحكام استخدام بوابة القرآن قبل استخدام الموقع والخدمات
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full bg-white py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto space-y-12">
              {/* آخر تحديث */}
              <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/10 p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>آخر تحديث:</strong> {new Date().toLocaleDateString('ar-EG')}
                </p>
              </div>

              {/* 1. المقدمة والاتفاق */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <span className="text-emerald-700 font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">المقدمة والاتفاق</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      بواستخدامك لموقع بوابة القرآن وتطبيقاتنا، فأنت توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات مهمة.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. الاستخدام المسموح به */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">الاستخدام المسموح به</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">يسمح لك باستخدام الموقع للأغراض الشخصية والتعليمية فقط. يحق لك:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>مشاهدة القرآن الكريم والاستماع إلى التلاوات</li>
                      <li>قراءة الأدعية والأذكار</li>
                      <li>الوصول إلى معلومات الشيوخ والقراء</li>
                      <li>حفظ والعلامات على الآيات والأدعية</li>
                      <li>مشاركة المحتوى مع الآخرين</li>
                      <li>استخدام الموقع لأغراض تعليمية وروحانية</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. الاستخدام غير المسموح به */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <XCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">الاستخدام غير المسموح به</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">لا يسمح بما يلي:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>نسخ أو توزيع محتوى الموقع دون إذن</li>
                      <li>استخدام الموقع لأغراض تجارية أو تسويقية</li>
                      <li>نشر محتوى مسيء أو تطرف ديني</li>
                      <li>محاولة اختراق الموقع أو الأنظمة</li>
                      <li>نشر معلومات شخصية للآخرين دون موافقة</li>
                      <li>استخدام محتوى الموقع في أنشطة غير قانونية</li>
                      <li>إرسال بريد مزعج أو فيروسات</li>
                      <li>انتحال شخصية مستخدم آخر</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. حقوق الملكية الفكرية */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">حقوق الملكية الفكرية</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  جميع المحتوى على الموقع، بما في ذلك النصوص والرسومات والشعارات والبيانات، محمي بموجب قوانين حقوق الملكية الفكرية. لا يسمح بنسخ أو تعديل أو توزيع أي محتوى دون الحصول على إذن مكتوب منا.
                </p>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>ملاحظة خاصة:</strong> محتوى القرآن الكريم متاح للاستخدام الشخصي والتعليمي وفقاً للقوانين الإسلامية والدولية.
                  </p>
                </div>
              </div>

              {/* 5. حسابات المستخدم */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">حسابات المستخدم</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  عند إنشاء حساب على الموقع، توافق على:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>تقديم معلومات دقيقة وكاملة</li>
                  <li>تحديث معلوماتك إذا تغيرت</li>
                  <li>الحفاظ على سرية كلمة المرور الخاصة بك</li>
                  <li>تحمل مسؤولية جميع الأنشطة على حسابك</li>
                  <li>إخطار الموقع فوراً بأي استخدام غير مصرح به</li>
                </ul>
              </div>

              {/* 6. المسؤولية والتنصل */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">المسؤولية والتنصل</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      الموقع يُقدم "كما هو" دون ضمانات من أي نوع. نحن لا نضمن:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                      <li>خلو الموقع من الأخطاء أو المشاكل</li>
                      <li>توفر الموقع بشكل مستمر</li>
                      <li>دقة المحتوى</li>
                      <li>عدم انقطاع الخدمة</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      لن نكون مسؤولين عن أي خسائر أو أضرار ناتجة عن استخدام الموقع، بما في ذلك خسائر البيانات أو الأرباح أو الأضرار غير المباشرة.
                    </p>
                  </div>
                </div>
              </div>

              {/* 7. المحتوى الذي ينشره المستخدم */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">المحتوى الذي ينشره المستخدم</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  من خلال نشر محتوى على الموقع، فأنت تمنحنا رخصة عامة لاستخدام هذا المحتوى. أنت تتحمل المسؤولية الكاملة عن أي محتوى تنشره، ويجب أن يكون:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>دقيقاً وخالياً من الأخطاء</li>
                  <li>محترماً وليس مسيئاً</li>
                  <li>غير منتهك لحقوق الآخرين</li>
                  <li>متوافقاً مع الشروط الإسلامية والقوانين المعمول بها</li>
                </ul>
              </div>

              {/* 8. التعديلات على الموقع */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">التعديلات على الموقع</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نحتفظ بالحق في تعديل أو إلغاء أو تحديث أي جزء من الموقع في أي وقت دون إشعار مسبق. كما نحتفظ بالحق في إيقاف الموقع أو إغلاق أي ميزات.
                </p>
              </div>

              {/* 9. القانون واختصاص المحكمة */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">القانون واختصاص المحكمة</h2>
                <p className="text-muted-foreground leading-relaxed">
                  تحكم هذه الشروط والأحكام بموجب قوانين المملكة العربية السعودية والقوانين الدولية المعمول بها. أي نزاع سينظر فيه اختصاص المحاكم المختصة.
                </p>
              </div>

              {/* 10. الاتصال بنا */}
              <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/10 p-6 space-y-3">
                <h2 className="text-xl font-bold">هل لديك أسئلة حول الشروط؟</h2>
                <p className="text-muted-foreground">
                  إذا كان لديك أي أسئلة حول شروط الخدمة، يرجى التواصل معنا عبر البريد الإلكتروني: <strong>ahmedadhem330@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
