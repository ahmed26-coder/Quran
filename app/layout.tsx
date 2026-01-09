import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Tajawal, Amiri } from "next/font/google"
import { Footer } from "@/components/footer"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
})

export const metadata = {
  title: "بوابة القرآن - موقع إسلامي حديث",
  description: "منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${amiri.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
