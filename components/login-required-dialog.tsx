"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

interface LoginRequiredDialogProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
}

export function LoginRequiredDialog({
    isOpen,
    onClose,
    title = "تسجيل الدخول مطلوب",
    description = "يرجى تسجيل الدخول أو إنشاء حساب لتتمكن من إضافة العناصر إلى مفضلتك ومزامنتها عبر جميع أجهزتك."
}: LoginRequiredDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">{title}</DialogTitle>
                    <DialogDescription className="text-right">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-4">
                    <Link href="/auth/login" className="w-full">
                        <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
                            <LogIn className="h-4 w-4" />
                            تسجيل الدخول
                        </Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full">
                        <Button variant="outline" className="w-full gap-2" onClick={onClose}>
                            <UserPlus className="h-4 w-4" />
                            إنشاء حساب جديد
                        </Button>
                    </Link>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
