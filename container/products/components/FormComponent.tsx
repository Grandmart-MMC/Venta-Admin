"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Product } from "../../../shared/types/product-type";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formSchema } from "@/shared/constants/validations";


interface Props {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues?: Product;
}

const FormComponent = ({ setIsDialogOpen, initialValues }: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      category: initialValues?.category?.name || "",
      price: initialValues?.price || 0,
      quantity: initialValues?.quantity || 0,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    const productData: Product = {
      id: initialValues?.id || 0,
      productCode: initialValues?.productCode || "",
      name: data.name,
      detail: initialValues?.detail || "",
      image: initialValues?.image || "",
      quantity: data.quantity,
      category: {
        id: initialValues?.category?.id || 0,
        name: data.category,
      },
    };

    console.log("Form Submitted: ", productData, images);
    setIsDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6"
      >
        {/* Form Fields */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Product name"
                  className="h-12 sm:h-14 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="h-12 sm:h-14 text-base dark:border-form-strokedark dark:bg-white dark:text-black dark:focus:border-primary focus-visible:ring-neutral-50 focus:outline-none focus-visible:border-neutral-50 ring-offset-neutral-50 focus:ring-neutral-50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="z-99999">
                      <SelectGroup>
                        <SelectItem className="text-md" value="1">
                          Smartphones
                        </SelectItem>
                        <SelectItem className="text-md" value="2">
                          Electronics
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Price ($)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0.00"
                  className="h-12 sm:h-14 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="quantity"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full sm:col-span-1">
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="0"
                  className="h-12 sm:h-14 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <div className="col-span-full">
          <FormLabel>Product Images</FormLabel>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="border-2 border-dashed rounded-lg p-4 w-full sm:w-34 h-28 flex flex-col items-center justify-center cursor-pointer">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <svg
                className="w-12 h-12 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm text-gray-500">Upload images</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24">
                  <Image
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-full flex items-center justify-center">
          <Button
            type="submit"
            className="w-[200px]  mt-4 h-12 sm:h-14 text-lg"
          >
            {initialValues ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FormComponent;
