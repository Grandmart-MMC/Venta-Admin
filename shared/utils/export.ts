import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { InquiriesData } from '@/shared/types/InquiriesPageType';


const getStatusText = (status: number): string => {
  switch(status) {
    case 1: return 'Yeni';
    case 2: return 'İşlənir';
    case 3: return 'Həll edilib';
    case 4: return 'Həll edilməyib';
    default: return 'Naməlum';
  }
};

const getPriorityText = (priority: number): string => {
  switch(priority) {
    case 1: return 'Aşağı';
    case 2: return 'Orta';
    case 3: return 'Yüksək';
    default: return 'Təyin edilməyib';
  }
};


const formatExcelDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm');
  } catch (error) {
    console.error('Date format error:', error);
    return dateString;
  }
};


export const exportToExcel = (data: InquiriesData[], fileName?: string) => {
  try {
    if (!data || data.length === 0) {
      toast.warning('İxrac etmək üçün məlumat yoxdur');
      return;
    }

    // Transform data for Excel format
    const excelData = data.map((item) => ({
      'Ad': item.contactFormName || '',
      'Email': item.contactFormEmail || '',
      'Telefon': item.contactFormPhone || '',
      'Mesaj': item.contactFormMessage || '',
      'Göndərilmə tarixi': formatExcelDate(item.contactFormSendTime),
      'Status': getStatusText(item.status),
      'Prioritet': getPriorityText(item.priority),
      'Qeydlər': item.notes || ''
    }));


    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Müraciətlər');

  
    const columnWidths = [
      { wch: 20 }, // Ad
      { wch: 25 }, // Email
      { wch: 15 }, // Telefon
      { wch: 40 }, // Mesaj
      { wch: 20 }, // Göndərilmə tarixi
      { wch: 15 }, // Status
      { wch: 15 }, // Prioritet
      { wch: 30 }, // Qeydlər
    ];
    worksheet['!cols'] = columnWidths;

    // Generate file name
    const defaultFileName = `inquiries_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    const outputFileName = fileName || defaultFileName;

    // Write and download the file
    XLSX.writeFile(workbook, outputFileName);
    toast.success('Müraciətlər uğurla ixrac edildi');
  } catch (error) {
    console.error('Excel export error:', error);
    toast.error('İxrac zamanı xəta baş verdi');
  }
};
