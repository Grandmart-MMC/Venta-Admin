"use client";
import React, { useState } from "react";
import { InquiriesData } from "@/shared/types/InquiriesPageType";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon, EyeIcon } from "lucide-react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateInquiry } from "@/api/services/inquiriesService";
import { ContactFormStatus, PriorityLevel } from "@/shared/constants/status";
import { useTranslations } from "next-intl";
interface ProductTableProps {
  data?: InquiriesData[];
  onRefresh?: () => void;
}

const Table: React.FC<ProductTableProps> = ({ data, onRefresh }) => {
  const t = useTranslations("inquiries.table");
  const tb = useTranslations("inquiries.buttons");
  const tm = useTranslations("inquiries.modal");
  const ts = useTranslations("inquiries.status");
  const tp = useTranslations("inquiries.priority");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiriesData | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    status: 1,
    priority: 1,
    notes: "",
  });

  const { updateInquiry, isLoading: isUpdating } = useUpdateInquiry();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status mətnə çevirmə
  const getStatusInfo = (status: number) => {
    switch (status) {
      case ContactFormStatus.New:
        return {
          text: ts("new") || "Yeni",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case ContactFormStatus.InProgress:
        return {
          text: ts("in_progress") || "İşlənir",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case ContactFormStatus.Resolved:
        return {
          text: ts("resolved") || "Həll edilib",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case ContactFormStatus.Unresolved:
        return {
          text: ts("unresolved") || "Həll edilməyib",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          text: "Naməlum",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  // Priority mətnə çevirmə və stil
  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case PriorityLevel.Low:
        return {
          text: tp("low") || "Aşağı",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case PriorityLevel.Medium:
        return {
          text: tp("medium") || "Orta",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case PriorityLevel.High:
        return {
          text: tp("high") || "Yüksək",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          text: "Təyin edilməyib",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const handleEditClick = (inquiry: InquiriesData) => {
    setSelectedInquiry(inquiry);
    setEditForm({
      status: inquiry?.status,
      priority: inquiry?.priority,
      notes: inquiry?.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (inquiry: InquiriesData) => {
    setSelectedInquiry(inquiry);
    setIsViewModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleInputChange = (field: string, value: unknown) => {
    setEditForm({
      ...editForm,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!selectedInquiry) return;

    try {
      await updateInquiry({
        id: selectedInquiry?.id,
        status: editForm.status,
        priority: editForm.priority,
        notes: editForm.notes,
      });

      // Close modal after successful update
      handleCloseEditModal();

      // Refresh the data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Update inquiry error:", error);
      toast.error("Məlumatları yeniləməkdə xəta baş verdi");
    }
  };

  // Truncate helper
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden sm:grid grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5 min-w-0">
          <div className="col-span-1 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("name") || "Ad"}</p>
          </div>
          <div className="col-span-2 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("email") || "Email"}</p>
          </div>
          <div className="col-span-1 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("phone") || "Telefon"}</p>
          </div>
          <div className="col-span-2 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("message") || "Mesaj"}</p>
          </div>
          <div className="col-span-1 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("date") || "Tarix"}</p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm font-medium">{t("status") || "Status"}</p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm font-medium">
              {t("priority") || "Prioritet"}
            </p>
          </div>
          <div className="col-span-1 flex items-center min-w-0">
            <p className="text-sm font-medium truncate">{t("notes") || "Notes"}</p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm font-medium">
              {t("actions") || "Əməliyyatlar"}
            </p>
          </div>
        </div>

        {/* Not Found State */}
        {(!data || data.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white dark:bg-boxdark shadow-lg rounded-lg p-8 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" /></svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{t("not_found.title") || "Nəticə tapılmadı"}</h2>
              <p className="text-gray-500 text-center max-w-xs">{t("not_found.desc") || "Axtarış və ya filter nəticəsində heç bir məlumat tapılmadı."}</p>
            </div>
          </div>
        )}

        {data?.map((inquiry, idx) => {
          const statusInfo = getStatusInfo(inquiry?.status);
          const priorityInfo = getPriorityInfo(inquiry?.priority);

          return (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-11 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-[#272B30] min-w-0"
            >
              {/* Mobil Görünüş */}
              <div className="sm:hidden flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                  <p className="text-sm font-medium truncate">
                    {inquiry?.contactFormName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {inquiry?.contactFormEmail}
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {truncateText(inquiry?.contactFormPhone, 12)}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {truncateText(inquiry?.contactFormMessage, 30)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(inquiry?.contactFormSendTime)}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span
                      className={`text-xs px-2 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full text-center`}
                    >
                      {statusInfo.text}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 ${priorityInfo.bgColor} ${priorityInfo.textColor} rounded-full text-center`}
                    >
                      {priorityInfo.text}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewClick(inquiry)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {tb("view") || "View"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(inquiry)}
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      {tb("edit") || "Edit"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Desktop Görünüş */}
              <div className="hidden sm:flex col-span-1 items-center min-w-0">
                <p className="text-sm truncate w-full">
                  {inquiry?.contactFormName}
                </p>
              </div>
              <div className="hidden sm:flex col-span-2 items-center min-w-0">
                <p className="text-sm text-muted-foreground truncate w-full">
                  {inquiry?.contactFormEmail}
                </p>
              </div>
              <div className="hidden sm:flex col-span-1 items-center min-w-0">
                <p className="text-sm truncate w-full">{truncateText(inquiry?.contactFormPhone, 12)}</p>
              </div>
              <div className="hidden sm:flex col-span-2 items-center min-w-0">
                <p className="text-sm text-muted-foreground truncate w-full">
                  {truncateText(inquiry?.contactFormMessage, 15)}
                </p>
              </div>
              <div className="hidden sm:flex col-span-1 items-center min-w-0">
                <p className="text-sm truncate w-full">
                  {formatDate(inquiry?.contactFormSendTime)}
                </p>
              </div>
              <div className="hidden sm:flex col-span-1 items-center justify-center">
                <span
                  className={`text-xs px-2 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} rounded-full whitespace-nowrap`}
                >
                  {statusInfo.text}
                </span>
              </div>
              <div className="hidden sm:flex col-span-1 items-center justify-center">
                <span
                  className={`text-xs px-2 py-1 ${priorityInfo.bgColor} ${priorityInfo.textColor} rounded-full whitespace-nowrap`}
                >
                  {priorityInfo.text}
                </span>
              </div>
              <div
                className="hidden sm:flex col-span-1 items-center cursor-pointer min-w-0"
                onClick={() => handleViewClick(inquiry)}
                title={inquiry?.notes}
              >
                <p className="text-sm text-muted-foreground truncate w-full">
                  {inquiry?.notes?.slice(0, 8)}
                  {inquiry?.notes && inquiry.notes.length > 8 && "..."}
                </p>
              </div>

              <div className="hidden sm:flex col-span-1 items-center justify-center space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewClick(inquiry)}
                  className="p-1 h-8 w-8"
                >
                  <EyeIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditClick(inquiry)}
                  className="p-1 h-8 w-8"
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tm("view_title") || "View Inquiry"}</DialogTitle>
          </DialogHeader>

          {selectedInquiry && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tm("name") || "Name"}
                  </h3>
                  <p className="mt-1">{selectedInquiry?.contactFormName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tm("email") || "Email"}
                  </h3>
                  <p className="mt-1">{selectedInquiry?.contactFormEmail}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tm("phone") || "Phone"}
                  </h3>
                  <p className="mt-1">{selectedInquiry?.contactFormPhone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tm("message") || "Message"}
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap">
                    {selectedInquiry?.contactFormMessage}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {tm("date") || "Send Time"}
                  </h3>
                  <p className="mt-1">
                    {formatDate(selectedInquiry?.contactFormSendTime)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {ts("label") || "Status"}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-1 ${
                        getStatusInfo(selectedInquiry?.status).bgColor
                      } ${
                        getStatusInfo(selectedInquiry?.status).textColor
                      } rounded-full`}
                    >
                      {getStatusInfo(selectedInquiry?.status).text}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {tp("label") || "Priority"}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-1 ${
                        getPriorityInfo(selectedInquiry?.priority).bgColor
                      } ${
                        getPriorityInfo(selectedInquiry?.priority).textColor
                      } rounded-full`}
                    >
                      {getPriorityInfo(selectedInquiry?.priority).text}
                    </span>
                  </div>
                </div>

                {selectedInquiry?.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {tm("notes") || "Notes"}
                    </h3>
                    <p className="mt-1 whitespace-pre-wrap">
                      {selectedInquiry?.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={handleCloseViewModal}>
              {tb("close") || "Close"}
            </Button>
            {selectedInquiry && (
              <Button
                onClick={() => {
                  handleCloseViewModal();
                  handleEditClick(selectedInquiry);
                }}
              >
                {tb("edit") || "Edit"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{tm("edit_title") || "Edit Inquiry"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {selectedInquiry && (
              <>
                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium">
                    {ts("label") || "Status"}
                  </label>
                  <Select
                    value={editForm.status.toString()}
                    onValueChange={(value) =>
                      handleInputChange("status", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{ts("new") || "New"}</SelectItem>
                      <SelectItem value="2">
                        {ts("in_progress") || "In Progress"}
                      </SelectItem>
                      <SelectItem value="3">
                        {ts("resolved") || "Resolved"}
                      </SelectItem>
                      <SelectItem value="4">
                        {ts("unresolved") || "Unresolved"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    {ts("label") || "Priority"}
                  </label>
                  <Select
                    value={editForm.priority.toString()}
                    onValueChange={(value) =>
                      handleInputChange("priority", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioritet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{tp("low") || "Aşağı"}</SelectItem>
                      <SelectItem value="2">
                        {tp("medium") || "Orta"}
                      </SelectItem>
                      <SelectItem value="3">
                        {tp("high") || "Yüksək"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    {tm("notes") || "Notes"}
                  </label>
                  <Textarea
                    id="notes"
                    value={editForm.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange("notes", e.target.value)
                    }
                    rows={3}
                    placeholder={tm("notes") || "Notes"}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={handleCloseEditModal}>
              {tb("cancel") || "Cancel"}
            </Button>
            <Button type="submit" onClick={handleSubmit} disabled={isUpdating}>
              {isUpdating ? "..." : tb("save") || "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {isViewModalOpen && selectedInquiry && (
        <Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tm("view_notes") || "Qeyd"}</DialogTitle>
            </DialogHeader>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {selectedInquiry.notes || "-"}
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCloseViewModal}>
                {tb("close") || "Bağla"}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }}
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                {tb("edit") || "Redaktə et"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default Table;
