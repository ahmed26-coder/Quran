"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, LogOut, User as UserIcon } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/components/auth-provider"
import { avatars } from "@/lib/appwrite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">فتح القائمة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs pt-5">
        <SheetTitle className="sr-only">قائمة التصفح</SheetTitle>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold flex items-center gap-2  "><Image src="/logo.jpg" priority alt="Logo" width={32} height={32} className=" rounded-xl" />بوابة القرآن</span>
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
              href="/hadith"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              الأحاديث
            </Link>
            <Link
              href="/quiz"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              الاختبارات
            </Link>
            <Link
              href="/prayer-times"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              مواقيت الصلاة
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium transition-colors hover:text-emerald-600"
              onClick={() => setOpen(false)}
            >
              اتصل بنا
            </Link>
          </nav>
          <div className="flex flex-col gap-4 pt-6 border-t mt-auto">
            {user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-14 w-full justify-start rounded-xl p-0 px-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/10">
                      <div className="flex items-center bg-emerald-50 dark:bg-emerald-900/10 py-1 px-2 rounded-md gap-3 w-full">
                        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          {(user.prefs as any)?.image || (user.prefs as any)?.avatar ? (
                            <Image
                              src={(user.prefs as any).image || (user.prefs as any).avatar}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <Image
                              src={avatars.getInitials(user.name).toString()}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 truncate max-w-[150px]">{user.name}</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">{user.email}</span>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 left-0" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer" asChild onClick={() => setOpen(false)}>
                        <Link href="/profile" className="flex items-center cursor-pointer">
                          <UserIcon className="ml-2 h-4 w-4" />
                          <span>الملف الشخصي</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="ml-2 h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild onClick={() => setOpen(false)}>
                  <Link href="/auth/login">تسجيل الدخول</Link>
                </Button>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700" asChild onClick={() => setOpen(false)}>
                  <Link href="/auth/signup">إنشاء حساب</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
