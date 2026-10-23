import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const NotificationContext = createContext(null);

function ToastItem({ notification, onDismiss }) {
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      onDismiss(notification.id);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const isError = notification.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${isError ? "border-red-200" : "border-emerald-200"}`}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
      )}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${isError ? "text-red-800" : "text-emerald-800"}`}>
          {isError ? "Something went wrong" : "Success"}
        </p>
        <p className="mt-1 break-words text-sm text-slate-600">
          {notification.message}
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(notification.id)}
        className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }, []);

  const notify = useCallback((type, message) => {
    const id = ++nextId.current;
    setNotifications((current) => [
      ...current,
      { id, type, message: String(message || (type === "error" ? "An unexpected error occurred." : "Action completed successfully.")) },
    ]);
  }, []);

  const showSuccess = useCallback((message) => notify("success", message), [notify]);
  const showError = useCallback((message) => notify("error", message), [notify]);

  useEffect(() => {
    try {
      const flash = sessionStorage.getItem("prismAdminFlash");

      if (flash) {
        sessionStorage.removeItem("prismAdminFlash");
        const parsed = JSON.parse(flash);

        if (parsed?.type === "error") {
          showError(parsed.message);
        } else {
          showSuccess(parsed?.message || "Action completed successfully.");
        }
      }
    } catch {
      sessionStorage.removeItem("prismAdminFlash");
    }
  }, [showError, showSuccess]);

  return (
    <NotificationContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return context;
}
