import React from "react";

const StatCard = ({
  width = "w-full",
  height = "h-auto",
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  iconBorder = "border-blue-100",
  value = "8",
  title = "Total Orders",
  subtitle = "Orders received",
}) => {
  return (
    <div
      className={`
        ${width}
        ${height}
        flex
        min-h-[120px]
        items-center
        gap-4
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition
        duration-200
        hover:shadow-md
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          ${iconBg}
          ${iconBorder}
          ${iconColor}
        `}
      >
        {Icon && <Icon size={22} strokeWidth={1.8} />}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-semibold tracking-tight text-[#17212f]">
          {value}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
          {title}
        </p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default StatCard;