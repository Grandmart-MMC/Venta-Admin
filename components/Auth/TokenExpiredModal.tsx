"use client";
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface TokenExpiredModalProps {
  isOpen: boolean;
  onLoginRedirect: () => void;
}

const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({
  isOpen,
  onLoginRedirect,
}) => {
  const t = useTranslations("auth");

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("token_expired.title") || "Sessiya müddəti bitmişdir"}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {t("token_expired.message") || 
              "Təhlükəsizlik səbəbi ilə sessiya müddətiniz başa çatmışdır. Xahiş edirik yenidən daxil olun."}
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              {t("token_expired.security_note") || 
                "Bu təhlükəsizlik tədbidir və məlumatlarınızı qorumaq üçündür."}
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onLoginRedirect}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("token_expired.login_button") || "Yenidən Daxil Ol"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenExpiredModal; 