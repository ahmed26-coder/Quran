import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    await resend.emails.send({
      from: "Quran App <ahmedadhem330@gmail.com>",
      to: email,
      subject: "شكراً لاشتراكك ❤️",
      html: `
        <h1>السلام عليكم</h1>
        <p>شكرًا لاشتراكك في موقع القرآن الكريم. سنخبرك عند الإطلاق إن شاء الله 🙏</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
