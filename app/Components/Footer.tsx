import { Facebook, Instagram, Linkedin, Moon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Button from './ui/Button'
import { footerLinks } from '@/Constents'

export default function Footer() {


  return (
    <footer className="w-full border-t bg-background border-gray-300 ">
      <div className="max-w-7xl xl:mx-auto mx-5">
        <div className="container flex flex-col gap-6 py-12 md:py-16 lg:flex-row lg:justify-between lg:py-20">
          <div className="flex flex-col gap-6 lg:max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <Moon className="h-10 w-10 text-emerald-600" />
              <span className="text-3xl font-bold">بوابة القرآن</span>
            </Link>
            <p className="text-base text-muted-foreground">
              منصة حديثة لاستكشاف القرآن الكريم والاستماع إلى الشيوخ المشهورين والوصول إلى الأدعية الصحيحة.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100089991578793&mibextid=ZbWKwL"
                target="_blank"
                className="text-muted-foreground hover:text-blue-600 transition transform hover:scale-110 duration-200"
              >
                <Facebook />
              </a>
              <a
                href="https://www.linkedin.com/posts/ahmed-adham-479334331_css-sass-webdevelopment-activity-7309695971397902336-ip3t?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFOFRJ0BxjlmgmtD2FB3FaA0_RMBH6CgVE4"
                target="_blank"
                className="text-muted-foreground hover:text-blue-500 transition transform hover:scale-110 duration-200"
              >
                <Linkedin />
              </a>
              <a
                href="https://www.instagram.com/ahmad_.shrara/profilecard/?igsh=Ym55YXl2eWN6em1x"
                target="_blank"
                className="text-muted-foreground hover:text-pink-500 transition transform hover:scale-110 duration-200"
              >
                <Instagram />
              </a>
            </div>
          </div>
          <div className="grid gap-10 grid-cols-2 md:grid-cols-4 lg:gap-10">
            {footerLinks.map((section, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-2xl font-bold">{section.title}</h3>
                <ul className="space-y-2 text-base font-medium">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href={link.href} className="text-muted-foreground hover:text-foreground hover:text-emerald-600">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">اشترك</h3>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-full rounded-md border-2 outline-none border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-emerald-600"
                />
                <div className=" w-full">
                  <Button highlighted={true} title='اشترك' />
                </div>
              </form>
              <p className="text-base text-muted-foreground">احصل على تحديثات حول الميزات والمحتوى الجديد.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:py-6">
            <p className="text-center text-sm text-muted-foreground md:text-right">
              © {new Date().getFullYear()} بوابة القرآن. جميع الحقوق محفوظة.
            </p>
            <p className="text-center text-sm text-muted-foreground md:text-left">صنع بحب للأمة الإسلامية</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
