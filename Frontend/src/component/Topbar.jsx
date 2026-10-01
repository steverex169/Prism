import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Download, LogOut } from "lucide-react";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
    "Dashboard";

  const handleExport = () => {
    console.log(`Export CSV for: ${activeTab}`);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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