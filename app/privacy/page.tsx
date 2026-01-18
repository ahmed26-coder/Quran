'use client'

import { SiteHeader } from "@/components/site-header"
import { Shield, Lock, Eye, Database } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">سياسة الخصوصية</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  نحن نلتزم بحماية خصوصيتك وحقوقك الشخصية. اطلع على كيفية جمع واستخدام بياناتك
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

              {/* 1. المقدمة */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <span className="text-emerald-700 font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">مقدمة</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      بوابة القرآن ("الموقع"، "نحن"، "ملكيتنا") تحترم خصوصية المستخدمين ("أنت"، "المستخدم"). تشرح هذه السياسة كيف نجمع ونستخدم ونحمي بيانات المستخدمين على موقعنا وتطبيقاتنا.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. البيانات التي نجمعها */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <Database className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">البيانات التي نجمعها</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">البيانات التي تزودنا بها</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>بيانات الحساب (الاسم، البريد الإلكتروني، كلمة المرور)</li>
                          <li>بيانات الملف الشخصي (الصورة الرمزية، السيرة الذاتية)</li>
                          <li>بيانات الاتصال (الهاتف، العنوان)</li>
                          <li>محتوى المستخدم (التعليقات، الآراء، الآيات المحفوظة)</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">البيانات التي نجمعها تلقائياً</h3>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>عنوان IP الخاص بك</li>
                          <li>نوع المتصفح ونظام التشغيل</li>
                          <li>صفحات الويب التي تزورها</li>
                          <li>المدة التي تقضيها على الموقع</li>
                          <li>البيانات الجغرافية التقريبية</li>
                          <li>ملفات التتبع (Cookies)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. كيفية استخدام البيانات */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <Eye className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">كيفية استخدام البيانات</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>إنشاء وإدارة حسابك على الموقع</li>
                      <li>توفير الخدمات والمحتوى المخصص</li>
                      <li>تحسين تجربة المستخدم والموقع</li>
                      <li>التواصل معك بشأن التحديثات والمميزات الجديدة</li>
                      <li>فهم استخدامك للموقع لأغراض إحصائية</li>
                      <li>الامتثال للقوانين واللوائح المعمول بها</li>
                      <li>منع الاحتيال والأنشطة غير المشروعة</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. حماية البيانات */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex-shrink-0">
                    <Lock className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">حماية البيانات</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      نحن نستخدم تقنيات التشفير والحماية المتقدمة (SSL/TLS) لحماية بيانات المستخدمين. ومع ذلك، لا يمكن ضمان أمان البيانات بنسبة 100% عبر الإنترنت.
                    </p>
                    <div>
                      <h3 className="font-semibold mb-2">إجراءات الأمان:</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>تشفير البيانات الحساسة</li>
                        <li>الحماية بكلمة مرور قوية</li>
                        <li>مراقبة الأنشطة المريبة</li>
                        <li>حد الوصول إلى البيانات على أساس الحاجة</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. ملفات التتبع */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">ملفات التتبع والبكسل</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نستخدم ملفات التتبع (Cookies) وصور البكسل لتتبع تفضيلاتك، وتذكر معلومات تسجيل دخولك، وتحليل أنماط الاستخدام. يمكنك تعطيل ملفات التتبع في إعدادات متصفحك.
                </p>
              </div>

              {/* 6. مشاركة البيانات */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">مشاركة البيانات</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  لن نبيع أو نؤجر بيانات المستخدمين الشخصية. ومع ذلك، قد نشاركها في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>مع الشركاء المخولين الذين يساعدوننا في تشغيل الموقع</li>
                  <li>عند الامتثال لالتزامات قانونية أو حكومية</li>
                  <li>لحماية حقوقنا وسلامة المستخدمين</li>
                  <li>في حالة الاندماج أو بيع الشركة</li>
                </ul>
              </div>

              {/* 7. حقوق المستخدم */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">حقوق المستخدم</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>الوصول إلى بيانات المستخدم الخاصة بك</li>
                  <li>تصحيح أو تحديث بيانات المستخدم غير الدقيقة</li>
                  <li>حذف حسابك والبيانات الشخصية</li>
                  <li>الاعتراض على معالجة بيانات المستخدم</li>
                  <li>الحصول على نسخة من بيانات المستخدم الخاصة بك</li>
                </ul>
              </div>

              {/* 8. الاتصال بنا */}
              <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/10 p-6 space-y-3">
                <h2 className="text-xl font-bold">هل لديك أسئلة حول الخصوصية؟</h2>
                <p className="text-muted-foreground">
                  إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يرجى التواصل معنا عبر البريد الإلكتروني: <strong>ahmedadhem330@gmail.com</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
