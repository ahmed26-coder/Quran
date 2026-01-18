"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { Mail, Lock, User, Eye, EyeOff, Moon } from "lucide-react"
import { account } from "@/lib/appwrite"
import { ID } from "appwrite"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

export default function SignupPage() {
  const router = useRouter()
  const { refreshUser, loginWithGoogle, loginWithFacebook } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast.error("كلمات المرور غير متطابقة!")
      return
    }
    setIsLoading(true)
    try {
      // Create user
      await account.create(
        ID.unique(),
        formData.email,
        formData.password,
        formData.name
      )

      // Create session
      await account.createEmailPasswordSession(formData.email, formData.password)

      await refreshUser()
      toast.success("تم إنشاء الحساب بنجاح!")
      router.push("/")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = formData.password ? (formData.password.length >= 8 ? "قوية" : "ضعيفة") : ""

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6 max-w-md">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className=" w-16 h-16 mb-3">
              <Image className="w-full h-full object-cover rounded-xl" src="/logo.jpg" priority alt="Logo" width={60} height={60} />
            </div>
            <h1 className="text-3xl font-bold">إنشاء حساب</h1>
            <p className="text-muted-foreground">انضم إلى مجتمع بوابة القرآن</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10 pl-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordStrength && (
                <p className={`text-xs ${passwordStrength === "قوية" ? "text-emerald-600" : "text-amber-600"}`}>
                  قوة كلمة المرور: {passwordStrength}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="أعد إدخال كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 rounded border-gray-300"
                required
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                أوافق على{" "}
                <Link href="/terms" className="text-emerald-600 hover:text-emerald-700">
                  شروط الخدمة
                </Link>{" "}
                و{" "}
                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? "جاري الإنشاء..." : "إنشاء حساب"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">أو</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="w-full bg-transparent" onClick={loginWithGoogle}>
                جوجل
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={loginWithFacebook}>
                فيسبوك
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center text-sm">
            <p className="text-muted-foreground">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
