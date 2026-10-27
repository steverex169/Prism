import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "Confirm action",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onCancel?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel?.();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
            <AlertTriangle size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <p id="confirm-dialog-message" className="mt-2 text-sm leading-6 text-slate-600">
              {message}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close confirmation"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${danger ? "bg-red-600 hover:bg-red-700" : "bg-[#0047ab] hover:bg-[#003b91]"}`}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
