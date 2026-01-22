"use client"

import { useAuth } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Mail, User as UserIcon, LogOut, Heart, Bookmark } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Card>
              <CardHeader className="flex flex-col items-center space-y-4 pt-8">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2 text-center">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const UserInitials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-emerald-600">الملف الشخصي</h1>
            <p className="text-muted-foreground">استعرض وحدث معلومات حسابك</p>
          </div>

          <Card className="border-emerald-100 dark:border-emerald-900/50 shadow-lg">
            <CardHeader className="flex flex-col items-center space-y-4 pt-8 pb-8 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/10 dark:to-transparent">
              <Avatar className="h-28 w-28 border-4 border-white dark:border-gray-950 shadow-md">
                <AvatarImage src={(user.prefs as any)?.avatar || (user.prefs as any)?.image} alt={user.name} />
                <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-700">
                  {UserInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground flex items-center justify-center gap-1.5 direction-ltr">
                  <span dir="ltr">{user.email}</span>
                  <Mail className="h-3.5 w-3.5" />
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">تاريخ الانضمام</p>
                    <p className="font-medium">{formatDate(user.$createdAt)}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">حالة الحساب</p>
                    <p className="font-medium flex items-center gap-2">
                      {user.emailVerification ? (
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          موثق
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400">نشط</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/favorites">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 border-emerald-100 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/10 rounded-2xl group transition-all">
                    <div className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold">المفضلة</span>
                    <p className="text-xs text-muted-foreground">عرض العناصر التي تم حفظها</p>
                  </Button>
                </Link>

                <Link href="/bookmarks">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 border-emerald-100 font-bold hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/10 rounded-2xl group transition-all">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                      <Bookmark className="h-5 w-5 fill-current" />
                    </div>
                    <span className="font-bold">علامات التلاوة</span>
                    <p className="text-xs text-muted-foreground">ملاحظاتك وصور آياتك</p>
                  </Button>
                </Link>
              </div>

              <div className="border bg-card rounded-2xl p-6 space-y-4 shadow-sm border-emerald-50 dark:border-emerald-900/20">
                <h3 className="font-bold text-lg border-b pb-2 text-emerald-800 dark:text-emerald-400">تفاصيل الحساب</h3>
                <div className="grid gap-y-4 text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                    <span className="text-muted-foreground">الاسم الكامل</span>
                    <span className="font-medium text-lg">{user.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                    <span className="text-muted-foreground">البريد الإلكتروني</span>
                    <span className="font-medium text-lg">{user.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-8 justify-center">
              <Button variant="outline" asChild className="w-full sm:w-auto rounded-xl">
                <Link href="/">العودة للرئيسية</Link>
              </Button>
              <Button variant="destructive" onClick={logout} className="w-full sm:w-auto gap-2 rounded-xl">
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}