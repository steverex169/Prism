import React, { useState } from "react";
import {
    CircleAlert,
    Mail,
    Phone,
    Clock3,
    Trash2,
    Check,
} from "lucide-react";

const LeftAt = () => {
    const [activeTab, setActiveTab] = useState("followup");

    // Static data for now
    const customers = [
        {
            id: 1,
            name: "test",
            email: "test@example.com",
            phone: "+1 (555) 123-4567",
            total: "$297.00",
            date: "Oct 01, 2026",
            time: "3:42 PM",
            lastActive: "LAST ACTIVE 1 DAY AGO",
            items: "2",
            cart: "Wellness Starter Package",
        },
    ];

    const tabs = [
        {
            key: "followup",
            label: "To follow up",
            count: customers.length,
        },
        {
            key: "followed",
            label: "Followed up",
            count: 0,
        },
        {
            key: "ordered",
            label: "Went on to order",
            count: 0,
        },
    ];

    const visibleCustomers =
        activeTab === "followup" ? customers : [];

    return (
        <div className="w-full min-w-0">
            {/* Informational Banner */}
            <div className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-[#B06300] bg-[#FFF9E6] px-4 py-4 sm:px-5">
                <CircleAlert
                    size={21}
                    className="mt-0.5 shrink-0 text-[#B06300]"
                />

                <p className="text-sm leading-6 text-[#694B1B]">
                    These are customers who added items to their cart{" "}
                    <strong className="font-semibold text-[#4D3510]">
                        without placing an order
                    </strong>
                    . A quick email or call can help recover the sale. If
                    they{" "}
                    <strong className="font-semibold text-[#4D3510]">
                        went on to order
                    </strong>
                    , their status will be updated automatically.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex min-w-max gap-2">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-[#151C28] text-white"
                                        : "border border-slate-200 bg-[#F8FAFC] text-slate-700 hover:bg-white"
                                }`}
                            >
                                {tab.label}

                                <span
                                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                        isActive
                                            ? "border-white/20 bg-white/10 text-white"
                                            : "border-white bg-white text-slate-500"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Customer Cards */}
            {visibleCustomers.length === 0 ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-12">
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Check
                                size={24}
                                className="text-slate-400"
                            />
                        </div>

                        <h2 className="text-sm font-semibold text-slate-900">
                            Nothing here
                        </h2>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            There are no customers in this section.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-5">
                    {visibleCustomers.map((customer) => (
                        <div
                            key={customer.id}
                            className="overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-[#B06300] bg-white shadow-sm"
                        >
                            {/* Card Header */}
                            <div className="flex flex-col gap-5 p-4 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
                                {/* Customer Information */}
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-slate-900">
                                        {customer.name}
                                    </h2>

                                    <div className="mt-3 flex flex-col gap-2">
                                        <a
                                            href={`mailto:${customer.email}`}
                                            className="inline-flex min-w-0 items-center gap-2 text-sm text-[#1A66FF] hover:underline"
                                        >
                                            <Mail
                                                size={15}
                                                className="shrink-0"
                                            />
                                            <span className="truncate">
                                                {customer.email}
                                            </span>
                                        </a>

                                        <a
                                            href={`tel:${customer.phone}`}
                                            className="inline-flex items-center gap-2 text-sm text-[#1A66FF] hover:underline"
                                        >
                                            <Phone
                                                size={15}
                                                className="shrink-0"
                                            />
                                            <span>{customer.phone}</span>
                                        </a>
                                    </div>

                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E1ECFF] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#1551B5]">
                                        <Clock3 size={12} />
                                        {customer.lastActive}
                                    </div>
                                </div>

                                {/* Order Total */}
                                <div className="shrink-0 lg:text-right">
                                    <p className="text-xl font-bold text-slate-900 sm:text-2xl">
                                        {customer.total}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {customer.date} · {customer.time}
                                    </p>
                                </div>
                            </div>

                            {/* Cart Contents */}
                            <div className="mx-4 mb-4 rounded-lg bg-[#F8F9FA] p-4 sm:mx-6 sm:mb-6">
                                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    What was in their cart
                                </p>

                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-slate-700 shadow-sm">
                                            {customer.items}
                                        </span>

                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {customer.cart}
                                        </p>
                                    </div>

                                    <span className="text-xs text-slate-500">
                                        {customer.items}{" "}
                                        {customer.items === "1"
                                            ? "item"
                                            : "items"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-4 sm:flex-row sm:flex-wrap sm:px-6">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10B981] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#059669]"
                                >
                                    <Mail size={15} />
                                    Email them
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                                >
                                    <Check size={15} />
                                    Mark as followed up
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeftAt;