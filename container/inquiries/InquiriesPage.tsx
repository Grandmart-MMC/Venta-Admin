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
  const t=useTranslations("inquiries");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [status, setStatus] = useState<number | undefined>(undefined);
  const [priority, setPriority] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const toggleSheet = () => setIsSheetOpen((prev) => !prev);

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
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? undefined : parseInt(value));
    setCurrentPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value === "all" ? undefined : parseInt(value));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatus(undefined);
    setPriority(undefined);
    setDateRange(undefined);
    setSearch("");
    setCurrentPage(1);
    setIsSheetOpen(false);
  };

  const applyFilters = () => {
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
      <Table data={data?.data} onRefresh={handleRefresh} />

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
                value={status?.toString() || "all"}
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
                value={priority?.toString() || "all"}
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
                    {t("priority.low" )|| "Low"}
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
