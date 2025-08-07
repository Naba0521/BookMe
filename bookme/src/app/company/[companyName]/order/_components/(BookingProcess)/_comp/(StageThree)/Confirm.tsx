"use client"

import { ShoppingBag } from "lucide-react"
import { ConfirmBookingProps } from "../../(publicItems)/_OrderPageTypes/types";

export default function ConfirmBooking({ isChecked, setIsChecked }: ConfirmBookingProps) {


    return (
        <div className="flex  flex-col w-full h-[80%]  gap-10 justify-between items-center">
            <div className="w-full flex flex-col gap-5">
                <h1 className="text-4xl"> Төлбөрийн нөхцөл </h1>
                <div className="w-full h-20 border border-gray-500 flex gap-6 px-6  items-center rounded-2xl text-2xl">
                    <ShoppingBag />
                    <p> Урьдчилсан цаг захиалгад төлбөр төлөх шаардалагагүй.</p>
                </div>
                <div className={!isChecked ? "flex flex-col text-sm font-bold" : "text-sm font-normal"} >
                    <p className="w-full flex items-center text-red-500 text-xl justify-end">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            className="mr-2"
                        />
                        Санамж:
                    </p>
                    <div>
                        <p className="w-full ">Ирж чадахгүй болон өөрөө цуцлах боломжгүй тохиолдолд байгууллагын ажилтантай холбогдож мэдэгдэнэ үү!. Баярлалаа</p>
                    </div>

                </div>
            </div>
            <div className="flex-3 w-full h-full flex flex-col gap-5"><h1 className="text-4xl"> Нэмэлт мэдээлэл</h1>
                < textarea placeholder="захиалгад хавсаргах нэмэлт мэдээлэл байвал бичнэ үү..."
                    className="w-full h-3/1 border placeholder-gray-300 p-6 items-start justify-center border-gray-500 rounded-2xl text-2xl"
                    onChange={() => { }}>
                </textarea>
            </div>
        </div >
    )
}