"use client";
import { useAuth } from "@/app/_providers/UserAuthProvider";
import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HouseIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LocPicker } from "./Location";

export const HomeAddress = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!location || !user?._id) return toast.error("Хаяг сонгоно уу.");

    try {
      setLoading(true);
      await api.patch(`/patch/${user._id}`, {
        userId: user._id,
        address: location.address,
        lat: location.lat,
        lng: location.lng,
      });
      toast.success("Хаяг амжилттай хадгалагдлаа!");
      setOpen(false);
    } catch (error) {
      toast.error("Хаяг хадгалах үед алдаа гарлаа.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-fit flex flex-col gap-[14px]">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="cursor-pointer w-full h-[72px] border border-gray-300 rounded-[6px] hover:bg-[#fbfafa] ">
          <div className="w-full h-full flex items-center px-10 gap-[20px]">
            <div className="h-[50px] w-[50px] bg-[#e8e7e7] rounded-full flex justify-center items-center">
              <HouseIcon />
            </div>
            <div className="w-[140px] flex flex-col ">
              <p className="font-bold text-[16px]">Гэр</p>
              <p className="text-[14px] text-gray-400">Гэрийн хаяг оруулах</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Гэрийн хаяг</DialogTitle>
          </DialogHeader>
          {open && <LocPicker onSelect={setLocation} />}
          {location && (
            <div className="mt-4 text-sm text-gray-600">
              <p>📍 Хаяг: {location.address}</p>
              <p>
                🌐 Координат: {location.lat}, {location.lng}
              </p>
            </div>
          )}

          <Button
            className="w-full h-10 mt-6 bg-blue-500 text-white cursor-pointer"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};
