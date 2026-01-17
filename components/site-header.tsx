import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Moon, Search } from "lucide-react"
import Image from "next/image"
import { MobileNav } from "@/components/mobile-nav"
import { HijriDate } from "@/components/hijri-date"
import { GlobalSearchLazy } from "@/components/global-search-lazy"

export function SiteHeader() {
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
          <Button variant="outline" className="hidden md:flex bg-transparent">
            تسجيل الدخول
          </Button>
          <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">إنشاء حساب</Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
