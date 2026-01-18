import * as React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { type TafseerSource } from "@/lib/tafseer-api"

interface TafseerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableTafseers: TafseerSource[]
    onSelect: (tafseerId: number | string) => void
}

export default function TafseerDialog({
    open,
    onOpenChange,
    availableTafseers,
    onSelect
}: TafseerDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95%] px-3 sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">اختر التفسير</DialogTitle>
                    <DialogDescription className="text-center">
                        اختر مصدر التفسير الذي تريد عرضه للصفحة الحالية
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar px-1">
                    {availableTafseers.length === 0 ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600 mb-2" />
                            <p className="text-sm text-muted-foreground">جاري تحميل التفاسير...</p>
                        </div>
                    ) : (
                        availableTafseers.map((tafseer) => (
                            <Button
                                key={tafseer.id}
                                variant="outline"
                                className="h-auto py-4 px-6 justify-start text-right hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-2 hover:border-emerald-300 transition-all"
                                onClick={() => onSelect(tafseer.id)}
                            >
                                <div className="flex flex-col items-start gap-1 w-full">
                                    <span className="font-bold text-lg">{tafseer.name}</span>
                                    {tafseer.author && (
                                        <span className="text-sm text-muted-foreground">{tafseer.author}</span>
                                    )}
                                </div>
                            </Button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
