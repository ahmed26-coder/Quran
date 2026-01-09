"use client"

import { useState, useEffect } from "react"

export function HijriDate() {
  const [hijriDate, setHijriDate] = useState<string>("")

  useEffect(() => {
    // استخلاص التاريخ الهجري باستخدام Intl API (تقويم أم القرى)
    const calculateHijriDate = () => {
      const today = new Date()
      const formatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      setHijriDate(formatter.format(today))
    }

    calculateHijriDate()

    // تحديث التاريخ كل منتصف ليل
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const timeUntilMidnight = tomorrow.getTime() - now.getTime()
    const timer = setTimeout(() => {
      calculateHijriDate()
      // وضع interval متكرر كل 24 ساعة
      setInterval(calculateHijriDate, 24 * 60 * 60 * 1000)
    }, timeUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  return <div className="text-sm text-muted-foreground">{hijriDate}</div>
}
