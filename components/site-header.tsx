"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Moon, Search } from "lucide-react"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { HijriDate } from "@/components/hijri-date"
import { GlobalSearchLazy } from "@/components/global-search-lazy"
import { useAuth } from "@/components/auth-provider"
import { LogOut, User as UserIcon } from "lucide-react"
import { avatars } from "@/lib/appwrite"

export function SiteHeader() {
  const { user, logout } = useAuth()
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpg" priority alt="Logo" width={32} height={32} className=" rounded-xl" />
            <span className="text-xl font-bold">بوابة القرآن</span>
          </Link>
          <HijriDate />
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-emerald-600">
            الرئيسية
          </Link>
          <Link href="/quran" className="text-sm font-medium transition-colors hover:text-emerald-600">
            القرآن الكريم
          </Link>
          <Link href="/sheikhs" className="text-sm font-medium transition-colors hover:text-emerald-600">
            الشيوخ
          </Link>
          <Link href="/supplications" className="text-sm font-medium transition-colors hover:text-emerald-600">
            الأدعية
          </Link>
          <Link href="/hadith" className="text-sm font-medium transition-colors hover:text-emerald-600">
            الأحاديث
          </Link>
          <Link href="/prayer-times" className="text-sm font-medium transition-colors hover:text-emerald-600">
            مواقيت الصلاة
          </Link>
          <Link href="/quiz" className="text-sm font-medium transition-colors hover:text-emerald-600">
            الاختبارات
          </Link>
          <Link href="/contact" className="text-sm font-medium transition-colors hover:text-emerald-600">
            اتصل بنا
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <GlobalSearchLazy />
          <ThemeToggle />
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                <div className="h-6 w-6 rounded-full overflow-hidden border border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  {(user.prefs as any)?.image || (user.prefs as any)?.avatar ? (
                    <Image
                      src={(user.prefs as any).image || (user.prefs as any).avatar}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={avatars.getInitials(user.name).toString()}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex bg-transparent" asChild>
                <Link href="/auth/login">تسجيل الدخول</Link>
              </Button>
              <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700" asChild>
                <Link href="/auth/signup">إنشاء حساب</Link>
              </Button>
            </>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
