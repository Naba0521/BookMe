import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BriefcaseBusiness, HouseIcon, MapPin } from "lucide-react";

export const WorkAddress = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-[14px]">
      <Dialog>
        <DialogTrigger className="cursor-pointer w-full h-[72px] border border-gray-300 rounded-[6px] hover:bg-[#fbfafa] ">
          <div className="w-full h-full flex items-center px-10 gap-[20px]">
            <div className="h-[50px] w-[50px] bg-[#e8e7e7] rounded-[9999px] flex justify-center items-center">
              <BriefcaseBusiness />
            </div>
            <div className="w-[140px] flex flex-col ">
              <p className="font-bold text-[16px]">Ажил</p>
              <p className="text-[14px] text-gray-400">Ажлын хаяг оруулах</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ажлын хаяг</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[46px] mt-5 border border-gray-400 rounded-[8px] px-4">
            <div className="w-full h-full  flex items-center gap-[12px]">
              <MapPin className="text-gray-600" />
              <input
                type="text"
                className="w-full h-full outline-none placeholder-gray-500"
                placeholder="Ажлын хаягаа оруулна уу."
                aria-label="Гэрийн хаяг"
              />
            </div>
          </div>
          <Button className="w-full h-10 mt-20 bg-blue-500 text-white cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition duration-200">
            Хадгалах
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
