"use client";;
import EmployeeCard from "../../(publicItems)/employeeCard";
import { StagOneProps } from "../../(publicItems)/_OrderPageTypes/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StagaOneSelectEmployee({
  company,
  isSelectEmployee,
  setIsSelectEmployee,
  selectedEmployeeImf,
  setSelectedEmployeeImf,
}: StagOneProps) {
  const router=useRouter()
  return (
    company?.employees.length > 0 ?
      <div className="grid grid-cols-3 w-fit gap-5 justify-between items-center p-5">
        {company?.employees.map((item, index) =>
          item.availability !== (undefined) && item.availability == (true) ? (
            <div
              key={index}
              onClick={() => {
                if (
                  isSelectEmployee === "" ||
                  isSelectEmployee !== item.employeeName
                ) {
                  setIsSelectEmployee(item.employeeName);
                  setSelectedEmployeeImf(item._id);
                }
              }}
              className={` ${item._id == selectedEmployeeImf
                ? "rounded-xl p-2 border bg-gradient-to-r from-sky-200   to-blue-400 border-sky-400"
                : "rounded-xl p-2"
                }`}
            >
              <EmployeeCard
                ner={item.employeeName}
                mergejil={item.description}
                captionText={
                  selectedEmployeeImf === item._id
                    ? null
                    : `${item.employeeName}-д захиалга өгөх`
                }
                zurag={item.profileImage || ""}
              />
            </div>
          ) : null
        )}
      </div>
      : <div className="w-full aspect-8/5 mt-22 shadow flex flex-col gap-6 text-xl font-bold rounded-2xl border items-center text-wrap p-20  "> 
       <div className=" w-full  text-center">Захиалга өгөх боломжтой ажилтан байхгүй байна. Өөрчлөлт орсны дараа дахин оролдно уу!</div>
       <Button onClick={()=>{
      company && router.push(`https://team-naba.vercel.app//company/${company.companyName}`)
       }}>Буцах</Button></div>
  );
}
