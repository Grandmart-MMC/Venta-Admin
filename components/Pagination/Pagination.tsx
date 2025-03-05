"use client";
import React from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationComponentProps) => {
  if (totalPages <= 1) return null;

  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };
  return (
    <div className="mt-6 sm:mt-8 px-4 sm:px-0">
      <ReactPaginate
        previousLabel={<ChevronLeft size={16} />}
        nextLabel={<ChevronRight size={16} />}
        breakLabel="..."
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageChange}
        forcePage={currentPage - 1}
        containerClassName="flex items-center justify-center sm:justify-end gap-1"
        pageClassName="hidden sm:block"
        pageLinkClassName="inline-flex items-center justify-center w-8 h-8 rounded-md text-sm"
        activeLinkClassName="bg-slate-200 dark:bg-slate-800 font-medium"
        previousClassName="inline-flex items-center justify-center p-2"
        nextClassName="inline-flex items-center justify-center p-2"
        previousLinkClassName={`${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        nextLinkClassName={`${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        breakClassName="inline-flex items-center justify-center"
        disabledClassName="pointer-events-none"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default PaginationComponent;
