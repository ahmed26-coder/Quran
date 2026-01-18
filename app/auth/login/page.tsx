"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { Mail, Lock, Eye, EyeOff, Moon } from "lucide-react"
import { account } from "@/lib/appwrite"
import { toast } from "sonner"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const router = useRouter()
  const { refreshUser, loginWithGoogle, loginWithFacebook } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await account.createEmailPasswordSession(email, password)
      await refreshUser()
      toast.success("تم تسجيل الدخول بنجاح!")
      router.push("/")
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container px-4 md:px-6 max-w-md">
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <div className=" w-16 h-16 mb-3">
              <Image src="/logo.jpg" priority alt="Logo" width={60} height={60} className=" rounded-xl w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold">تسجيل الدخول</h1>
            <p className="text-muted-foreground">أهلاً بك في بوابة القرآن</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300" />
                <span>تذكرني</span>
              </label>
              <Link href="#" className="text-sm text-emerald-600 hover:text-emerald-700">
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? "جاري التحميل..." : "تسجيل الدخول"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">أو</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              ليس لديك حساب؟{" "}
              <Link href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
