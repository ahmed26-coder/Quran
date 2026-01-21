"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { Client, Databases, ID } from "appwrite"
import { toast } from "sonner"

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("696bf0f30026eca12bd2")

const databases = new Databases(client)

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    // Map existing IDs to simpler state keys if needed, or just use the IDs directly if they match
    // IDs in JSX: first-name, last-name, email, phone, subject, message
    // DB keys: firstName, lastName, email, phone, subject, message

    let key = id
    if (id === "first-name") key = "firstName"
    if (id === "last-name") key = "lastName"

    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await databases.createDocument(
        "6970d96b000f94329ee0", // Database ID
        "messages", // Collection ID - Assumed based on context, user can update if different
        ID.unique(),
        formData
      )
      toast.success("تم إرسال رسالتك بنجاح", {
        description: "سنقوم بالرد عليك في أقرب وقت ممكن."
      })
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      })
    } catch (error) {
      console.error("Contact form error:", error)
      toast.error("حدث خطأ أثناء الإرسال", {
        description: "يرجى المحاولة مرة أخرى لاحقًا."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">اتصل بنا</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  نحن هنا للإجابة على أسئلتكم واستقبال اقتراحاتكم. لا تترددوا في التواصل معنا.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter">معلومات الاتصال</h2>
                  <p className="text-muted-foreground">
                    يمكنكم التواصل معنا من خلال وسائل الاتصال التالية أو عبر نموذج الاتصال.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">ahmedadhem330@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">الهاتف</h3>
                      <p className="text-muted-foreground">+201016626452</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">العنوان</h3>
                      <p className="text-muted-foreground">القاهرة، جمهورية مصر العربية</p>
                    </div>
                  </div>
                </div>

                <div className="relative h-[300px] w-full overflow-hidden rounded-xl">
                  <Image
                    src="/contact.jpg"
                    width={600}
                    height={300}
                    alt="خريطة الموقع"
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold">ساعات العمل</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">الأحد - الخميس</p>
                      <p className="text-muted-foreground">9:00 ص - 5:00 م</p>
                    </div>
                    <div>
                      <p className="font-medium">الجمعة - السبت</p>
                      <p className="text-muted-foreground">مغلق</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter">أرسل لنا رسالة</h2>
                  <p className="text-muted-foreground">يرجى ملء النموذج أدناه وسنقوم بالرد عليكم في أقرب وقت ممكن.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        الاسم الأول
                      </label>
                      <Input
                        id="first-name"
                        placeholder="أدخل اسمك الأول"
                        className="w-full"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        الاسم الأخير
                      </label>
                      <Input
                        id="last-name"
                        placeholder="أدخل اسمك الأخير"
                        className="w-full"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      البريد الإلكتروني
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="أدخل بريدك الإلكتروني"
                      className="w-full"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2 text-right">
                    <label htmlFor="phone" className="text-sm font-medium">
                      رقم الهاتف
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="أدخل رقم هاتفك"
                      className="w-full text-right "
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      الموضوع
                    </label>
                    <Input
                      id="subject"
                      placeholder="أدخل موضوع الرسالة"
                      className="w-full"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      الرسالة
                    </label>
                    <Textarea
                      id="message"
                      placeholder="اكتب رسالتك هنا"
                      className="min-h-[150px] w-full"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                    <Send className="ml-2 h-4 w-4" /> {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">الأسئلة الشائعة</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  إجابات على الأسئلة الأكثر شيوعاً
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
              {[
                {
                  question: "كيف يمكنني الاشتراك في النشرة الإخبارية؟",
                  answer:
                    "يمكنك الاشتراك في النشرة الإخبارية من خلال إدخال بريدك الإلكتروني في نموذج الاشتراك الموجود في أسفل الصفحة الرئيسية.",
                },
                {
                  question: "هل يمكنني تنزيل التلاوات للاستماع إليها دون اتصال بالإنترنت؟",
                  answer:
                    "نعم، يمكنك تنزيل التلاوات للاستماع إليها دون اتصال بالإنترنت من خلال النقر على زر التنزيل بجوار التلاوة.",
                },
                {
                  question: "كيف يمكنني المساهمة في الموقع؟",
                  answer:
                    "يمكنك المساهمة في الموقع من خلال إرسال اقتراحاتك أو تصحيحاتك عبر نموذج الاتصال، أو من خلال الانضمام إلى فريق المتطوعين.",
                },
                {
                  question: "هل التطبيق متاح على الهواتف الذكية؟",
                  answer:
                    "نعم، التطبيق متاح للتنزيل على أجهزة Android و iOS. يمكنك تنزيله من متجر التطبيقات الخاص بجهازك.",
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border bg-background p-6 shadow-sm">
                  <h3 className="text-xl font-bold">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
