import { EmployeeType } from "../_providers/CompanySettingsProvider";
export const EmployeeCard = ({
  employeeName,
  description,
  profileImage,
}: EmployeeType) => {
  return (
    <div className="w-full h-full rounded-4xl flex flex-col justify-between items-center p-5 gap-3 bg-[#f7f7f7]">
      <img src={`${profileImage}`} className="rounded-2xl h-[200px]" />
      <div className="w-full  rounded-2xl px-3 ">
        <div className="bg-white w-fit rounded-2xl p-3 ">
          Нэр: {employeeName}
        </div>
      </div>
      <div className="w-full  rounded-2xl px-3 ">
        <div className="bg-white w-full rounded-2xl p-3 ">
          Танилцуулга: {description}
        </div>
      </div>
    </div>
  );
};
