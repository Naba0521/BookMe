"use client"
import { useEffect, useState } from "react";
import { api } from "@/axios";
import { useParams } from "next/navigation";
import { BookingPage } from "./_components/(BookingProcess)/bookingProcess";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { useCompanyAuth } from "@/app/_providers/CompanyAuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CompanyType } from "./_components/(BookingProcess)/(publicItems)/_OrderPageTypes/types";

export default function OrderPage() {
    const Stages = ["Ажилтан", "Огноо", "Баталгаажуулалт", "амжилттай захиалагдлаа"]
    const [loading, setLoading] = useState<boolean>(false)
    const [isStage, setIsStage] = useState<string>(Stages[0])
    const [isSelectEmployee, setIsSelectEmployee] = useState<string | string[]>("")
    const { companyName } = useParams<{ companyName: string }>();
    const [companyData, setCompany] = useState<CompanyType | undefined>(undefined);
    const [date, setDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<Date | null>(null)
    const [selectedEmployeeImf, setSelectedEmployeeImf] = useState<string | undefined>(undefined)
    const { user } = useAuth()
    const { company } = useCompanyAuth()
    const router = useRouter();
    const HandleNextStage = () => {
        if (isStage == Stages[0] && !(isSelectEmployee == "")) { setIsStage(Stages[1]) }
        if (isStage == Stages[1] && selectedTime !== null) { setIsStage(Stages[2]) }
    };
    useEffect(() => {
        const fetchCompany = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/company/name/${companyName}`);
                if (response.data && response.data.company) {
                    setCompany(response.data.company);
                    console.log(response.data);
                } else {
                    console.warn("Компани олдсонгүй");
                }
                setLoading(false);
            } catch (err) {
                console.error("Компаний мэдээлэл авахад алдаа гарлаа:", err);
                setLoading(false);
            }
        };
        if (companyName) {
            fetchCompany();
        }
    }, [companyName]);
    if (loading) return (
        <div className="w-full h-screen flex justify-center items-center">
            <p className="text-xl font-semibold text-gray-700">Түр хүлээнэ үү... ⏳</p>
        </div>
    );
    if (company) return (
        <div className="w-screen h-screen  flex items-center justify-center">
            <div className="w-[1440px] h-screen flex flex-col items-center gap-20 bg-white justify-center ">
                <h1 className="text-2xl font-bold  shadow-2xl w-2/3 text-center rounded-full p-4 ">❌ Хэрэглэгчид зориулсан захиалгын хуудас байна.Компаний хяналын самбараас захиалгаа үүсгэнэ үү⁉️.</h1>
                <div className="flex gap-6 ">
                    <Button onClick={() => { companyData && router.push(`/company/${companyData.companyName}`); }}
                        className="w-fit h-fit rounded-4xl  border border-black text-xl p-6" variant={"ghost"}>Буцах </Button>
                    <Button onClick={() => { companyData && router.push(`/company/${companyData.companyName}/dashboard`); }}
                        className="w-fit h-fit rounded-4xl   text-xl p-6" variant={"ghost"}> хяналтын самбар </Button>
                </div>
            </div>

        </div>
    )
    if (!user) return (
        <div className="w-screen h-screen  flex items-center justify-center">
            <div className="w-[1440px] h-screen flex flex-col items-center  bg-white  ">
                <div className="w-full items-start justify-items-start p-5 " > <Button variant={"default"} onClick={() => { companyData && router.push(`/company/${companyData.companyName}`); }}>буцах</Button></div>
                <div className="w-full items-center h-full flex justify-center gap-20 flex-col">
                    <h1 className="text-2xl font-bold    w-2/3 text-center shadow-2xl rounded-full p-4 ">❌ Бүртгэлтэй болон нэвтэрсэн хэрэглэгч захиалга өгөх боломжтой⁉️.</h1>
                    <div className="flex gap-6 ">
                        <Button onClick={() => { companyData && router.push(`/company/${companyData.companyName}/login`); }}
                            className="w-fit h-fit rounded-4xl  border border-black text-xl p-6" variant={"ghost"}> Нэвтрэх </Button>
                        <Button onClick={() => { companyData && router.push(`/company/${companyData.companyName}/signup`); }}
                            className="w-fit h-fit rounded-4xl   text-xl p-6" variant={"default"}> Бүртгүүлэх </Button>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        Stages.indexOf(isStage) <= Stages.length - 1 && (
            <BookingPage
                date={date} setDate={setDate} isStage={isStage} setIsStage={setIsStage}
                isSelectEmployee={isSelectEmployee} setIsSelectEmployee={setIsSelectEmployee}
                selectedTime={selectedTime} setSelectedTime={setSelectedTime}
                selectedEmployeeImf={selectedEmployeeImf} setSelectedEmployeeImf={setSelectedEmployeeImf}
                HandleNextStage={HandleNextStage}
                companyData={companyData}
            />
        )
    )
}