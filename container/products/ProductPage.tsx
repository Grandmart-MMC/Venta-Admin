"use client";
import React, { useState } from "react";
import ProductTable from "@/container/products/components/ProductTable";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReusableSheet from "@/components/Sheet/SheetComponent";
import { FilterIcon, Download, Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import FormComponent from "./components/FormComponent";
import DialogComponent from "./components/DialogComponent";

const ProductPage = () => {
  const [search, setSearch] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleSheet = () => setIsSheetOpen((prev) => !prev);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handleAddProduct = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <React.Fragment>
      <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder={"Search..."}
              className="bg-white dark:bg-background pl-8 py-5 h-12 sm:h-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="w-full">
              <DatePickerWithRange className="w-full" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExport}
                className="w-full sm:w-auto h-10 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>

              <Button
                onClick={toggleSheet}
                className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only sm:hidden">Filter</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end px-2 sm:px-0 my-4">
        <Button
          onClick={handleAddProduct}
          className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white text-sm"
        >
          <Plus className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <ProductTable />

      <ReusableSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Filter Product"
      >
        <div className="grid grid-cols-1 gap-4 p-4">
          <SelectGroup>
            <SelectLabel className="mb-2 text-sm">Category</SelectLabel>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="z-999">
                <SelectGroup>
                  <SelectItem value="smartphones">Smartphones</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </SelectGroup>
        </div>
      </ReusableSheet>

      <DialogComponent
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        toggleDrawer={handleCloseDialog}
        title="Add Product"
      >
        <FormComponent setIsDialogOpen={setIsDialogOpen} />
      </DialogComponent>
    </React.Fragment>
  );
};

export default ProductPage;
