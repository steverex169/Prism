import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShoppingCart,
  CreditCard,
  AlertCircle,
  ClipboardList,
  LogOut,
  Trash2,
  Package,
  Store,
  Image,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { name: "Payment Review", path: "/admin/payment-review", icon: CreditCard },
    { name: "Failed", path: "/admin/failed", icon: AlertCircle },
    { name: "Checkouts", path: "/admin/checkouts", icon: ClipboardList },
    { name: "Left At Checkout", path: "/admin/left-at-checkout", icon: LogOut },
    { name: "Deleted Orders", path: "/admin/deleted-orders", icon: Trash2 },
    { name: "Inventory Product", path: "/admin/inventory", icon: Package },
    { name: "Hero Images" , path: "/admin/heroimage", icon: Image },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col overflow-y-auto border-r border-white/5 bg-[#101823] px-4 py-6 text-white">
      {/* Branding */}
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <ShieldCheck size={24} strokeWidth={1.8} />
        </div>

        <span className="whitespace-nowrap text-[17px] font-semibold tracking-tight">
          Prism Wellness
        </span>
      </div>

      {/* Navigation */}
      <div>
        <p className="mb-4 px-3 text-[10px] font-bold tracking-[1.5px] text-slate-400">
          STORE PANEL
        </p>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#243346] text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* View Store */}
      <div className="mt-auto pt-8">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 px-3 text-[13px] font-medium text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <Store size={19} strokeWidth={1.8} />
          <span>View Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;