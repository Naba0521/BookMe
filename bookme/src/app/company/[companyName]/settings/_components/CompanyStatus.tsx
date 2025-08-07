import { EmployeeSvg } from "./assets/EmployeeSvg";

type PropsType = {
  employeeCount: number;
};

export const CompanyStatus = ({ employeeCount }: PropsType) => {
  return (
    <div className="w-full bg-white rounded-2xl p-4 flex flex-col gap-3">
      <div className="text-[20px] font-bold">Business Stats</div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <EmployeeSvg /> Нийт ажилтан
          </div>
          <div>{employeeCount}</div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <EmployeeSvg /> Бусад мэдээлэл +
          </div>
          <div>?</div>
        </div>
      </div>
    </div>
  );
};
