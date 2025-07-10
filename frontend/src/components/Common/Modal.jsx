import React from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "medium" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-4xl",
    xlarge: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
