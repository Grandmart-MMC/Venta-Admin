"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { CircleArrowLeft } from "lucide-react";
import { Product } from "../../../shared/types/product-type";

interface DialogComponentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDrawer: (product?: Product) => void;
  title: string;
  children: React.ReactNode;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  open,
  setOpen,
  toggleDrawer,
  title,
  children,
}) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="z-[99999] bg-white dark:bg-boxdark rounded-md shadow-lg h-[90vh]">
        <div
          onClick={() => toggleDrawer()}
          className="fixed left-4 top-4 flex items-center gap-4 cursor-pointer"
        >
          <CircleArrowLeft className="dark:text-white" size={40} />
          <span className="text-lg font-semibold text-black dark:text-white">
            Back
          </span>
        </div>
        <DrawerHeader>
          <DrawerTitle className="text-xl my-4 shadow-border font-semibold text-center text-primary-DEFAULT dark:text-white">
            {title}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto">
          <div className="mt-6 mx-auto w-[80%]">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DialogComponent;
