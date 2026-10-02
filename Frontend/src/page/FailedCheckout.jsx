import React, { useState } from "react";
import { Check, Phone, Mail,CircleAlert } from "lucide-react";

const FailedCheckouts = () => {
    const [activeTab, setActiveTab] = useState("chase");

    // Static data for now
    const failedCheckouts = [];

    const tabs = [
        {
            key: "chase",
            label: "To Chase",
            count: failedCheckouts.length,
        },
        {
            key: "handled",
            label: "Handled",
            count: 0,
        },
    ];

    const activeCheckouts =
        activeTab === "chase"
            ? failedCheckouts
            : [];

    return (
        <div className="w-full min-w-0">
            {/* Information Message */}
            <div className="mb-6 flex gap-2 rounded-lg border-l-4 border-[#C41C1C] bg-[#FEF2F2] px-4 py-4 sm:px-5">
                <CircleAlert
                    size={21}
                    className="mt-0.5 shrink-0 text-[#C41C1C]"
                />
                <p className="text-sm leading-6 text-red-700">
                    These customers filled in checkout and the payment gateway
                    refused. They saw an error and{" "}
                    <strong className="font-semibold text-red-900">
                        nothing was charged
                    </strong>
                    . They wanted to buy — a call or an email usually recovers
                    the sale.
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
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${isActive
                                        ? "bg-black text-white"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {tab.label}

                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isActive
                                            ? "bg-white/15 text-white"
                                            : "bg-slate-100 text-slate-500"
                                        }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {activeCheckouts.length === 0 ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-12">
                    <div className="mx-auto flex max-w-md flex-col items-center text-center">
                        {/* Tick Icon */}
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFDF3]">
                            <Check
                                size={24}
                                strokeWidth={2.5}
                                className="text-[#16A34A]"
                            />
                        </div>

                        {/* Heading */}
                        <h2 className="text-sm font-semibold text-slate-900">
                            No failed checkouts
                        </h2>

                        {/* Description */}
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Every checkout that reached a payment gateway got
                            through. If one fails, the customer appears here
                            and the team is emailed straight away.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {activeCheckouts.map((checkout) => (
                        <div
                            key={checkout.id}
                            className="rounded-xl border border-slate-200 bg-white p-5"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Order #{checkout.id}
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {checkout.customer}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        <Phone size={14} />
                                        Call
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                                    >
                                        <Mail size={14} />
                                        Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FailedCheckouts;