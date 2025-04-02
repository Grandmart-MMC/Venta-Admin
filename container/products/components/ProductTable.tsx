"use client";
import React, { useState } from "react";
import Image from "next/image";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import DialogComponent from "./DialogComponent";
import DetailSection from "./DetailSection";
import { Product } from "../../../shared/types/product-type";
import FormComponent from "./FormComponent";
import { headers } from "@/shared/constants/table-header";
import { products } from "@/shared/constants/product-data";

const ProductTable: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const toggleDrawer = (product?: Product) => {
    setIsEditing(false);
    if (product) {
      setSelectedProduct(product);
      setOpen(true);
    } else {
      setSelectedProduct(null);
      setOpen(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setOpen(true);
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
          {headers?.map((header, idx) => (
            <div
              key={idx}
              className={`${
                idx === 0 ? "col-span-2" : "col-span-1"
              } flex items-start`}
            >
              <p className="text-sm font-medium dark:text-gray-200">
                {header.header}
              </p>
            </div>
          ))}
        </div>

        {products?.map((product, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 sm:grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-[#272B30]"
          >
            {/* Mobile View */}
            <div className="sm:hidden flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={product.image || "/default-image.png"}
                    width={48}
                    height={48}
                    alt="Product"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-black dark:text-white line-clamp-1">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {product.productCode}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {product.quantity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleDrawer(product)}
                  className="text-gray-500 hover:text-primary"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-primary">
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Desktop Content */}
            <div className="hidden sm:flex col-span-2 items-center">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={product.image || "/default-image.png"}
                    width={48}
                    height={48}
                    alt="Product"
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-black dark:text-white line-clamp-1">
                  {product.name}
                </p>
              </div>
            </div>

            <div className="hidden sm:flex col-span-1 items-center">
              <p className="text-sm text-black dark:text-white line-clamp-1">
                {product.productCode}
              </p>
            </div>

            <div className="hidden sm:flex col-span-1 items-center">
              <p className="text-sm text-black dark:text-white line-clamp-1">
                {product.category?.name}
              </p>
            </div>

            <div className="hidden sm:flex col-span-1 items-center">
              <p className="text-sm text-black dark:text-white">
                {product.quantity}
              </p>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex items-center justify-end sm:justify-start gap-3 mt-2 sm:mt-0">
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => toggleDrawer(product)}
                  className="text-gray-500 hover:text-primary"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="text-gray-500 hover:text-primary">
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => handleEdit(product)}
                className="text-gray-500 hover:text-primary"
              >
                <EditIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div className="sm:hidden mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Category: {product.category?.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <DialogComponent
        open={open}
        setOpen={setOpen}
        toggleDrawer={toggleDrawer}
        title={isEditing ? "Edit Product" : "Product Details"} // Update title based on mode
      >
        {isEditing ? (
          <FormComponent
            setIsDialogOpen={setOpen} // Close dialog after submission
            initialValues={selectedProduct || undefined} // Pass selected product for editing
          />
        ) : (
          <DetailSection product={selectedProduct} />
        )}
      </DialogComponent>
    </>
  );
};

export default ProductTable;
