"use client";

import React from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "./Button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      icon: <AlertCircle className="h-6 w-6 text-red-600" />,
      bg: "bg-red-50",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
      bg: "bg-amber-50",
      button: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      icon: <AlertCircle className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-50",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const theme = themes[variant];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="absolute right-4 top-4">
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6 pt-8 text-center">
          <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${theme.bg}`}>
            {theme.icon}
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex flex-col space-y-2 bg-slate-50 p-4">
          <Button 
            onClick={onConfirm}
            isLoading={isLoading}
            className={`w-full ${theme.button} text-white shadow-sm`}
          >
            {confirmText}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isLoading}
            className="w-full text-slate-600 hover:bg-slate-200"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
