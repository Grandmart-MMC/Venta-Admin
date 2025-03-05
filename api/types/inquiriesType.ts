export interface Inquiry {
  id: number;
  contactFormId: number;
  contactFormName: string;
  contactFormEmail: string;
  contactFormPhone: string;
  contactFormMessage: string;
  contactFormAvantage: number;
  contactFormSendTime: string;
  status: number;
  priority: number;
  notes: string;
}

export interface InquiryResponseData {
  totalCount: number;
  page: number;
  pageSize: number;
  data: Inquiry[];
}
