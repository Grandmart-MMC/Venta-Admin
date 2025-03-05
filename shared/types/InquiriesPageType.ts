

export type InquiriesData = {
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
};

// Updated complete type definition that matches the JSON structure
export interface InquiriesTranslation {
  inquiries: string;
  inquiry: string;
  search_placeholder: string;
  export: string;
  add_inquiry: string;
  filter_title: string;
  category_label: string;
  status: {
    label: string;
    all: string;
    new: string;
    in_progress: string;
    resolved: string;
    unresolved: string;
  };
  priority: {
    label: string;
    all: string;
    low: string;
    medium: string;
    high: string;
  };
  buttons: {
    apply_filters: string;
    reset_filters: string;
    view: string;
    edit: string;
    save: string;
    cancel: string;
    close: string;
  };
  modal: {
    view_title: string;
    edit_title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
    notes: string;
    notes_placeholder: string;
  };
  table: {
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
    status: string;
    priority: string;
    actions: string;
  };
}