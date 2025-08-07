"use client";

import { LucideArrowBigLeft, LucideArrowLeft, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LeaveOrder from "./leaveOrderDialog";
import { motion, useScroll, useTransform } from "framer-motion";
import { OrderNavpropsType } from "./_OrderPageTypes/types";
const OrderNavBar = ({
  isStage,
  setIsStage,
  Stages,
  title,
  setSelectedTime,
  companyData
}: OrderNavpropsType) => {
  const initialValue = 70;
  const finalValue = 80;
  const thresholdY = 38; // set the scroll position where you want the state change
  const speed = 200;
  const scrollDistance = (initialValue - finalValue) / speed;
  const startY = 100; // scroll position when transition starts
  const endY = startY + scrollDistance;
  const { scrollY } = useScroll();
  const scrollOutput = useTransform(
    scrollY,
    [startY, endY, endY],
    [initialValue, finalValue, finalValue],
    {
      clamp: false,
    }
  )
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  useEffect(
    () => scrollY.onChange((latest) => setIsPastThreshold(latest > thresholdY)),
    []
  );
  const HandlePrevStage = () => {
    if (isStage == Stages[1]) {
      setSelectedTime(null)
      setIsStage(Stages[0]);
    }
    if (isStage == Stages[2]) {
      setIsStage(Stages[1]);
    }
  };
  return (
    <>

      <div className="flex w-[1440px]  justify-between h-fit  px-6 py-2 bg-white z-10 fixed top-0 shadow ">
        <motion.div
          className="font-bold text-xl normal-case "
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: isPastThreshold ? 1 : 0,
            scale: isPastThreshold ? 1 : 0.5,
          }}
        >
          <div className="w-full flex justify-between gap-6 items-center ">
            <div className="flex gap-6">
              {isStage == Stages[0] ? (
                <Dialog>
                  <DialogTrigger className="w-fit px-2 rounded-2xl text-sm font-normal bg-gradient-to-r from-gray-200/50 from-20% via-zinc-300 via-50% to-gray-500 to-90% hover:bg-accent- ">
                    <LucideArrowBigLeft />
                  </DialogTrigger>
                  <LeaveOrder companyData={companyData} />
                </Dialog>
              ) : (
                <div
                  onClick={() => {
                    {
                      HandlePrevStage();
                    }
                  }}
                  className="w-fit px-2 rounded-2xl font-normal bg-gradient-to-r from-gray-200/50 from-20% via-zinc-300 via-50% to-gray-500 to-90% hover:bg-accent- "
                >
                  <LucideArrowBigLeft />
                </div>
              )}
            </div>
            {title}
          </div>
        </motion.div>
        <div>
          <Dialog>
            <DialogTrigger className="w-fit px-2 rounded-2xl font-normal bg-gradient-to-r from-gray-200/50 from-20% via-zinc-300 via-50% to-gray-500 to-90% hover:bg-accent- ">
              Гарах
            </DialogTrigger>
            <LeaveOrder companyData={companyData} />
          </Dialog>
        </div>
      </div>

    </>
  );
};
export default OrderNavBar;
