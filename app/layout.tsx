import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "بوابة القرآن",
  description: "بوابة القرآن هي منصة إسلامية شاملة تهدف إلى تقريب المسلمين من كتاب الله وسنة نبيه، من خلال تجربة حديثة وميسّرة. تُمكّنك المنصة من: الاستماع لتلاوات خاشعة من نخبة قراء العالم الإسلامي. تصفح سور القرآن الكريم بسهولة مع الترجمة والتفسير. الوصول إلى أدعية نبوية وأذكار مأثورة صحيحة مصنّفة حسب المناسبات. الاستفادة من محتوى تعليمي لتعلم التجويد وتحسين التلاوة. نسعى لأن تكون بوابتك اليومية للتدبّر، الذكر، والتقرب من الله في كل وقت ومكان.",
  icons: {
    icon: "/Yourspiritualjourney.webp",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#000',
                width: "300px",
                color: '#0f0',
                fontSize: '16px',
                margin: "auto",
              },
              className: 'custom-toast',
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
