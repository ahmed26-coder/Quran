import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AudioPlayerProvider } from "@/components/audio-player-provider"
import { PersistentAudioPlayer } from "@/components/persistent-audio-player"
import { Tajawal, Amiri } from "next/font/google"
import { Footer } from "@/components/footer"

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
  preload: true,
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
  preload: true,
})


export const metadata = {
  metadataBase: new URL("https://quranee.netlify.app/"),
  title: {
    default: "بوابة القرآن - موقع إسلامي حديث",
    template: "%s | بوابة القرآن"
  },
  description: "منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.",
  keywords: ["القرآن الكريم", "تلاوات", "شيوخ", "أدعية", "مصحف", "إسلام"],
  authors: [{ name: "بوابة القرآن" }],
  creator: "بوابة القرآن",
  publisher: "بوابة القرآن",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    title: "بوابة القرآن - موقع إسلامي حديث",
    description: "منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.",
    siteName: "بوابة القرآن",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
      },
      {
        url: "/logo.jpg",
        width: 400,
        height: 400,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "بوابة القرآن - موقع إسلامي حديث",
    description: "منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
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
          <AudioPlayerProvider>
            {children}
            <Footer />
            <PersistentAudioPlayer />
          </AudioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
