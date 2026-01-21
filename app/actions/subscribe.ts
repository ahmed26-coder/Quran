"use server";

import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// If you don't have a key yet, get one from https://resend.com
// Initialize Resend with API key from environment variables
// If you don't have a key yet, get one from https://resend.com

export async function sendWelcomeEmail(email: string) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.warn("RESEND_API_KEY is not set. Email will not be sent.");
        return { success: false, error: "Email service not configured" };
    }

    const resend = new Resend(apiKey);

    try {
        // Note: 'onboarding@resend.dev' works for testing if you send to your own authenticated email
        // For production, you need to verify a domain on Resend
        const { data, error } = await resend.emails.send({
            from: 'Quran App <onboarding@resend.dev>',
            to: email,
            subject: 'مرحبًا بك في قائمة تحديثات منصه بوابه القرآن الكريم',
            html: `
        <div dir="rtl" style="font-family: system-ui, -apple-system, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #059669; text-align: center;">مرحبًا بك!</h1>
          <p style="font-size: 16px; line-height: 1.6;">شكرًا لاشتراكك في القائمة البريدية لمنصه بوابه القرآن الكريم.</p>
          <p style="font-size: 16px; line-height: 1.6;">نحن سعداء بانضمامك إلينا. ستصلك آخر التحديثات والميزات الجديدة والمحتوى الحصري أولاً بأول.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="font-size: 14px; color: #666; text-align: center;">مع تحيات،<br>فريق منصه بوابه القرآن الكريم</p>
        </div>
      `,
        });

        if (error) {
            console.error("Resend error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email" };
    }
}
