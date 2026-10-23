import React from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Download, LogOut } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const tabs = {
    "/admin/orders": "Orders",
    "/admin/payment-review": "Payment Review",
    "/admin/failed": "Failed",
    "/admin/checkouts": "Checkouts",
    "/admin/left-at-checkout": "Left At Checkout",
    "/admin/deleted-orders": "Deleted Orders",
    "/admin/inventory": "Inventory Product",
    "/admin/heroimage": "Hero Images",
  };

  const activeTab =
    tabs[location.pathname] ||
    Object.entries(tabs).find(
      ([path]) =>
        path !== "/admin" && location.pathname.startsWith(path + "/")
    )?.[1] ||
    "orders";


  const handleExport = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "GET",
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        throw new Error("Failed to fetch orders for export.");
      }

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const orders = await response.json();

      if (!Array.isArray(orders)) {
        throw new Error("Invalid orders response.");
      }

      const headers = [
        "ID",
        "Order Number",
        "Customer",
        "Email",
        "Items",
        "Total",
        "Payment",
        "Payment Method",
        "Status",
        "Date",
      ];

      const escapeCSV = (value) => {
        let text = String(value ?? "");

        // Prevent spreadsheet formula injection
        if (/^[\s]*[=+\-@]/.test(text)) {
          text = "'" + text;
        }

        return `"${text.replace(/"/g, '""')}"`;
      };

      const rows = orders.map((order) => [
        order.id,
        order.order_number || "",
        order.customer_name || "",
        order.customer_email || "",
        order.items ?? 0,
        Number(order.total || 0).toFixed(2),
        order.payment || "Unpaid",
        order.payment_method || "Unknown",
        order.status || "Pending",
        order.date
          ? new Date(order.date).toLocaleDateString("en-US")
          : "",
      ]);

      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\r\n");

      const blob = new Blob(["\uFEFF", csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
      showSuccess("Orders exported successfully.");
    } catch (error) {
      console.error("CSV export failed:", error);
      showError(error.message || "Failed to export orders.");
    }
  };


  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.detail || "Logout failed.");
      }

      sessionStorage.setItem(
        "prismAdminFlash",
        JSON.stringify({
          type: "success",
          message: "Logged out successfully.",
        })
      );
      window.location.replace("/pannel/login");
    } catch (error) {
      console.error("Admin logout error:", error);
      showError(error.message || "Unable to log out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b border-slate-200 bg-white px-8">
      {/* Active Tab */}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold tracking-tight text-[#17212f]">
          {activeTab}
        </h1>
        <p className="mt-0.5 text-xs text-slate-400">
          Prism Wellness / Store Panel
        </p>
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-3">
        {activeTab === "Orders" && (
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-blue-600 px-4 text-sm font-normal text-blue-600 transition hover:bg-blue-50"
          >
            <Download size={17} strokeWidth={1.8} />
            <span>Export CSV</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={17} strokeWidth={1.9} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;