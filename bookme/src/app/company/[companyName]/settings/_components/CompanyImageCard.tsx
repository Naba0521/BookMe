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
    <div className="w-full h-full relative">
      {newImage ? (
        <img
          src={URL.createObjectURL(newImage)}
          className="w-full h-full rounded-3xl bg-amber-500"
        />
      ) : (
        <img src={image} className="w-full h-full rounded-3xl" />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button
            // type="button"
            className="rounded-full absolute right-2 top-2 opacity-70"
          >
            x
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Устгахдаа итгэлтэй байна уу?
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="w-full h-full">
              <img src={image} className="w-[500px] h-[250px] rounded-3xl" />
            </div>
            <div className="w-full flex justify-center gap-3 items-center">
              <Button
                onClick={async () => {
                  setLoading(true);
                  await handleDeleteImage();
                  setLoading(false);
                }}
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
