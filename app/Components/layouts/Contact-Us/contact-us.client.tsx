"use client";
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Send } from "lucide-react";
import Button from "../../ui/Button";
import ContactText from "./contact-us.chunks";

export function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.from('Contact').insert([
      {
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        subject,
        message,
      },
    ]);

    if (error) {
        alert('حدث خطأ: ' + error.message);
    } else {
        alert('تم إرسال الرسالة بنجاح ✅');
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setSubject('');
        setMessage('');
    }
};

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <ContactText />
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">أرسل لنا رسالة</h2>
              <p className="text-base font-medium">يرجى ملء النموذج أدناه وسنقوم بالرد عليكم في أقرب وقت ممكن.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 mt-2">
                  <p className="text-xl font-medium">الاسم الأول</p>
                  <input
                    className="w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3"
                    type="text"
                    placeholder="أدخل اسمك الأول"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2 mt-2">
                  <p className="text-xl font-medium">الاسم الأخير</p>
                  <input
                    className="w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3"
                    type="text"
                    placeholder="أدخل اسمك الأخير"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <p className="text-xl font-medium">البريد الإلكتروني</p>
                <input
                  className="w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2 mt-2">
                <p className="text-xl font-medium">رقم الهاتف</p>
                <input
                  className="w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3"
                  type="text"
                  placeholder="أدخل رقم هاتفك"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2 mt-2">
                <p className="text-xl font-medium">الموضوع</p>
                <input
                  className="w-full border bg-gray-50 dark:bg-black border-gray-300 rounded-md outline-0 focus:border-emerald-600 py-2 px-3"
                  type="text"
                  placeholder="أدخل موضوع الرسالة"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="mt-2">
                <label htmlFor="message" className="text-xl font-medium">
                  الرسالة
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="اكتب رسالتك هنا"
                  className="w-full border bg-gray-50 dark:bg-black focus:border-emerald-600 outline-0 border-gray-300 rounded-md py-2 px-3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button types="submit" highlighted={true} icon={<Send />} title="إرسال الرسالة" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
