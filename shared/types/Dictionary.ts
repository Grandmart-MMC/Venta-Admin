export interface Translations {
  products: {
    products: string;
    product: string;
    search_placeholder: string;
    export: string;
    add_product: string;
    filter_title: string;
    category_label: string;
  };
  sidebar: {
    title: string;
    dashboard: string;
    inquiries: string;
    videos: string;
    ad: string;
  };
  inquiries: {
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
  };
  login: {
    title: string;
    heading: string;
    email: {
      label: string;
      placeholder: string;
    };
    password: {
      label: string;
      placeholder: string;
    };
    submit: string;
    success: string;
    error: string;
    email_required: string;
    email_invalid: string;
    password_required: string;
    password_invalid: string;
  };
}