"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { LoadingSvg } from "@/app/_components/assets/LoadingSvg";

type Props = {
  image: string;
  index: number;
  newImage: File | null;
  id: string | undefined;
  handleDeleteImage: () => void;
};

export const CompanyImageCard = ({
  image,
  newImage,
  handleDeleteImage,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full h-full relative ">
      {newImage ? (
        <img
          src={URL.createObjectURL(newImage)}
          className="w-full h-full rounded-3xl"
        />
      ) : (
        <img src={image} className="w-full h-full rounded-2xl border-2 border-gray-400" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="rounded-full flex items-center justify-center bg-black text-white p-4 w-[20px] h-[20px] absolute right-2 top-2 opacity-70 hover:bg-gray-900 cursor-pointer">
            x
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-red-400">
              Устгахдаа итгэлтэй байна уу?
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 ">
            <div className="w-full h-full flex flex-col items-center">
              <img src={image} className="w-[200px] h-[200px] rounded-3xl" />
            </div>
            <div className="w-full flex justify-center gap-3 items-center">
              <Button
                onClick={async () => {
                  setLoading(true);
                  await handleDeleteImage();
                  setLoading(false);
                  setOpen(false);
                }}
                className="bg-[#007FFF] border-[#007FFF] text-white hover:bg-[#007FFF]/10 hover:text-[#007FFF]"
                variant="outline"
              >
                {!loading ? "Тийм" : <LoadingSvg />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
