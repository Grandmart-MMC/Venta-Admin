import { HeaderType } from "@/shared/types/header-type";


export const headers : HeaderType[] = [
    {
        accessorKey: "Name",
        header: "Name",
    },
    {
        accessorKey: "Id",
        header: "Product Code",
    },

    {
        accessorKey: "Category.Name",
        header: "Category",
    },
    {
        accessorKey: "Quantity",
        header: "Quantity",
    },
    {
        accessorKey: "Actions",
        header: "Actions",
    },
];