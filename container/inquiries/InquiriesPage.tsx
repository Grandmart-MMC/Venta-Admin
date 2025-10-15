"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import PaginationComponent from "@/components/Pagination/Pagination";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon, Download, Search, X } from "lucide-react";

import {
  useGetInquiries,
  InquiriesQueryParams,
} from "@/api/services/inquiriesService";
import Spinner from "@/components/Spinner/Spinner";
import Error from "@/components/Error/Error";
import Table from "./components/Table";
import ReusableSheet from "@/components/Sheet/SheetComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exportToExcel } from "@/shared/utils/export";
import { toast } from "react-toastify";
import { ContactFormStatus, PriorityLevel } from "@/shared/constants/status";
import { useTranslations } from "next-intl";

const InquiriesPage = () => {
  const t = useTranslations("inquiries");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  console.log("debouncedSearch: ", debouncedSearch);
  // Applied filters (aktual API çağrısı için)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<number | undefined>(undefined);
  
  // Temporary filters (Sheet içinde seçim için)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined);
  const [tempStatus, setTempStatus] = useState<number | undefined>(undefined);
  const [tempPriority, setTempPriority] = useState<number | undefined>(undefined);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const toggleSheet = () => {
    if (!isSheetOpen) {
      // Sheet açılırken temporary state'leri current state'lerle sync et
      setTempStatus(status);
      setTempPriority(priority);
      setTempDateRange(dateRange);
    }
    setIsSheetOpen((prev) => !prev);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams: InquiriesQueryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    status: status,
    priority: priority,
    startDate: dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const { data, isLoading, error, refetch } = useGetInquiries(queryParams);

  const handleRefresh = () => {
    refetch();
  };

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    // Date range hemen apply olsun çünkü ana sayfada görünüyor
    setDateRange(range);
    setTempDateRange(range);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    // Sadece temporary state'i güncelle
    setTempStatus(value === "all" ? undefined : parseInt(value));
  };

  const handlePriorityChange = (value: string) => {
    // Sadece temporary state'i güncelle
    setTempPriority(value === "all" ? undefined : parseInt(value));
  };

  const handleResetFilters = () => {
    // Hem asıl hem temporary state'leri sıfırla
    setStatus(undefined);
    setPriority(undefined);
    setDateRange(undefined);
    setTempStatus(undefined);
    setTempPriority(undefined);
    setTempDateRange(undefined);
    setSearch("");
    setCurrentPage(1);
    setIsSheetOpen(false);
  };

  const applyFilters = () => {
    // Temporary state'leri asıl state'lere apply et
    setStatus(tempStatus);
    setPriority(tempPriority);
    setDateRange(tempDateRange);
    setCurrentPage(1);
    setIsSheetOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleExport = async () => {
    try {
      if (data?.data) {
        exportToExcel(data.data);
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("İxrac zamanı xəta baş verdi");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <Error error={error.message} />;
  }

  return (
    <React.Fragment>
      <div className="p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-1/2 lg:w-1/3">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder={t("search_placeholder")}
              className="bg-white dark:bg-background pl-8 py-5 h-12 sm:h-auto"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="w-full">
              <DatePickerWithRange
                className="w-full"
                value={dateRange}
                onChange={handleDateRangeChange}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExport}
                className="w-full sm:w-auto h-10 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t("export")}</span>
              </Button>

              <Button
                onClick={toggleSheet}
                className="w-full sm:w-auto h-12 sm:h-auto py-2 sm:py-4 bg-black dark:bg-white"
              >
                <FilterIcon className="h-4 w-4" />
                <span className="sr-only sm:hidden">{t("filter_title")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Table or Not Found + Reset Filters */}
      {(!data?.data || data.data.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-white dark:bg-boxdark shadow-lg rounded-lg p-8 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" /></svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t("not_found.title") || "Nəticə tapılmadı"}</h2>
            <p className="text-gray-500 text-center max-w-xs mb-4">{t("not_found.desc") || "Axtarış və ya filter nəticəsində heç bir məlumat tapılmadı."}</p>
            {(search || dateRange || status !== undefined || priority !== undefined) && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                {t("buttons.reset_filters") || "Filterləri sıfırla"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {(search || dateRange || status !== undefined || priority !== undefined) && (
            <div className="flex justify-end mb-2">
              <button
                onClick={handleResetFilters}
                className=" flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-800 transition"
              >
                {t("buttons.reset_filters") || "Filterləri sıfırla"}
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Table data={data?.data} onRefresh={handleRefresh} />
        </>
      )}

      {/* ReusableSheet with status and priority filters */}
      <ReusableSheet
        open={isSheetOpen}
        onClose={toggleSheet}
        title={t("filter_title") || "Filter"}
      >
        <div className="grid grid-cols-1 gap-6 p-4">
          {/* Status Filter */}
          <div>
            <SelectGroup>
              <SelectLabel className="mb-2 text-sm font-medium">
                {t("status.label") || "Status"}
              </SelectLabel>
              <Select
                value={tempStatus?.toString() || "all"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("status.label") || "Select status"}
                  />
                </SelectTrigger>
                <SelectContent className="z-999">
                  <SelectItem value="all">
                    {t("status.all") || "All Statuses"}
                  </SelectItem>
                  <SelectItem value={ContactFormStatus.New.toString()}>
                    {t("status.new") || "New"}
                  </SelectItem>
                  <SelectItem value={ContactFormStatus.InProgress.toString()}>
                    {t("status.in_progress") || "In Progress"}
                  </SelectItem>
                  <SelectItem value={ContactFormStatus.Resolved.toString()}>
                    {t("status.resolved") || "Resolved"}
                  </SelectItem>
                  <SelectItem value={ContactFormStatus.Unresolved.toString()}>
                    {t("status.unresolved") || "Unresolved"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          {/* Priority Filter */}
          <div>
            <SelectGroup>
              <SelectLabel className="mb-2 text-sm font-medium">
                {t("priority.label") || "Priority"}
              </SelectLabel>
              <Select
                value={tempPriority?.toString() || "all"}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={t("priority.label") || "Select priority"}
                  />
                </SelectTrigger>
                <SelectContent className="z-999">
                  <SelectItem value="all">
                    {t("priority.all") || "All Priorities"}
                  </SelectItem>
                  <SelectItem value={PriorityLevel.Low.toString()}>
                    {t("priority.low") || "Low"}
                  </SelectItem>
                  <SelectItem value={PriorityLevel.Medium.toString()}>
                    {t("priority.medium") || "Medium"}
                  </SelectItem>
                  <SelectItem value={PriorityLevel.High.toString()}>
                    {t("priority.high") || "High"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onClick={applyFilters}
              className="w-full bg-black dark:bg-white text-white dark:text-black"
            >
              {t("buttons.apply_filters") || "Apply Filters"}
            </Button>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              {t("buttons.reset_filters") || "Reset Filters"}
            </Button>
          </div>
        </div>
      </ReusableSheet>

      {/* Pagination component */}
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </React.Fragment>
  );
};

export default InquiriesPage;
