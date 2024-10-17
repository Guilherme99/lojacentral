import React, { createContext, useContext, useState } from "react";
import { Toast } from "react-bootstrap";

interface ToastContextType {
  showToast: (message: string, type: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("success");
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);

  const showToast = (message: string, type: string) => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000); // Esconder após 3 segundos
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isToastVisible && (
        <Toast
          bg={toastType}
          onClose={() => setIsToastVisible(false)}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
