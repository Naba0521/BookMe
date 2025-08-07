"use client"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { leaveOrderProps } from "./_OrderPageTypes/types"

const LeaveOrder = ({ companyData }: leaveOrderProps) => {
    const router = useRouter()
    return (
        <div>
            <DialogContent showCloseButton={false} className="w-100 h-fit p-9 items-between border-none justify-between " >
                <DialogHeader className="flex flex-col gap-9">
                    <DialogTitle>Захиалгын хэсгийг хаахдаа итгэлтэй байна уу?</DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Бүх сонголтууд устах болно.
                    </DialogDescription>
                    <div className="flex w-full justify-between gap-3">
                        <DialogPrimitive.Close asChild>
                            <Button className="flex-1 h-14 text-wrap" variant="ghost">Захиалгаа үргэлжлүүлэх</Button>
                        </DialogPrimitive.Close>
                        <Button onClick={() => {
                            companyData && router.push(`https://team-naba.vercel.app//company/${companyData.companyName}`)
                        }} className="flex-1 bg-black text-white h-14" >Тийм. Гарах</Button>
                    </div>
                </DialogHeader>
            </DialogContent></div >
    )
}
export default LeaveOrder