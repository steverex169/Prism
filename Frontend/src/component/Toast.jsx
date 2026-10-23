import React, { useEffect } from "react";

const Toast = ({
  type = "success",
  message = "",
  onClose,
  duration = 3500,
}) => {
  useEffect(() => {
    if (!message || !onClose || duration <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [message, onClose, duration]);

  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      aria-live={isSuccess ? "polite" : "assertive"}
      className={`fixed right-4 top-4 z-[9999] flex w-[calc(100%-2rem)] max-w-[360px] items-start gap-3 rounded-lg border bg-white p-4 shadow-lg sm:right-6 sm:top-6 ${
        isSuccess
          ? "border-green-200 text-green-800"
          : "border-red-200 text-red-700"
      }`}
    >
      <span
        className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
          isSuccess ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-lg leading-none opacity-60 transition-opacity hover:opacity-100"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;