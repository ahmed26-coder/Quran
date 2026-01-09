"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs pt-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">بوابة القرآن</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">إغلاق القائمة</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              الرئيسية
            </Link>
            <Link
              href="/quran"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              القرآن الكريم
            </Link>
            <Link
              href="/sheikhs"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              الشيوخ
            </Link>
            <Link
              href="/supplications"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              الأدعية
            </Link>
            <Link
              href="/about"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              عن الموقع
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              اتصل بنا
            </Link>
          </nav>
          <div className="flex flex-col gap-2 pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              تسجيل الدخول
            </Button>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => setOpen(false)}>
              إنشاء حساب
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
