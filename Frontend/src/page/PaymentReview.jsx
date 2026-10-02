import React, { useMemo, useState } from "react";
import {
    CircleAlert,
    CheckCircle2,
    Clock3,
    Eye,
    Package,
} from "lucide-react";

const PaymentReview = () => {
    const [activeTab, setActiveTab] = useState("awaiting");

    const payments = [
        {
            id: 1003,
            paymentMethod: "Venmo",
            status: "Awaiting Review",
            customer: "Michael Brown",
            email: "michael@example.com",
            phone: "+1 (555) 234-5678",
            placed: "Sep 30, 2026",
            viewed: "Not Viewed",
            items: 5,
            price: "$320.00",
            proof:
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
        },
        {
            id: 1005,
            paymentMethod: "Cash App",
            status: "Awaiting Review",
            customer: "David Wilson",
            email: "david@example.com",
            phone: "+1 (555) 876-5432",
            placed: "Sep 28, 2026",
            viewed: "Viewed",
            items: 4,
            price: "$210.00",
            proof:
                "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
        },
        {
            id: 1002,
            paymentMethod: "Venmo",
            status: "Approved",
            customer: "Sarah Smith",
            email: "sarah@example.com",
            phone: "+1 (555) 123-4567",
            placed: "Oct 01, 2026",
            viewed: "Viewed",
            items: 1,
            price: "$59.00",
            proof:
                "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
        },
    ];

    const awaitingPayments = useMemo(
        () => payments.filter((payment) => payment.status === "Awaiting Review"),
        [payments]
    );

    const approvedPayments = useMemo(
        () => payments.filter((payment) => payment.status === "Approved"),
        [payments]
    );

    const visiblePayments =
        activeTab === "awaiting"
            ? awaitingPayments
            : activeTab === "approved"
              ? approvedPayments
              : payments;

    const tabs = [
        {
            key: "awaiting",
            label: "Awaiting Review",
            count: awaitingPayments.length,
        },
        {
            key: "approved",
            label: "Approved",
            count: approvedPayments.length,
        },
        {
            key: "all",
            label: "All",
            count: payments.length,
        },
    ];

    const getPaymentMethodStyle = (method) => {
        if (method === "Venmo") {
            return "bg-[#EFF6FF] text-[#0D59F2]";
        }

        if (method === "Cash App") {
            return "bg-[#ECFDF3] text-[#15803D]";
        }

        return "bg-slate-100 text-slate-700";
    };

    return (
        <div className="w-full min-w-0">
            {/* Information Message */}
            <div className="mb-6 flex items-start gap-3 rounded-lg border-l-4 border-[#0D59F2] bg-[#EFF6FF] px-4 py-4 sm:px-5">
                <CircleAlert
                    size={21}
                    className="mt-0.5 shrink-0 text-[#0D59F2]"
                />

                <p className="text-sm leading-6 text-slate-700">
                    Customers send to{" "}
                    <strong className="font-semibold text-slate-900">
                        $azzurriwellness
                    </strong>{" "}
                    (Cash App) or{" "}
                    <strong className="font-semibold text-slate-900">
                        @azzurriwellness
                    </strong>{" "}
                    (Venmo). Check the screenshot against your own account
                    before approving — approving marks the order paid and
                    emails the customer.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 overflow-x-auto border-b border-slate-200">
                <div className="flex min-w-max gap-6 sm:gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition ${
                                activeTab === tab.key
                                    ? "text-[#0D59F2]"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {tab.label}

                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    activeTab === tab.key
                                        ? "bg-[#EFF6FF] text-[#0D59F2]"
                                        : "bg-slate-100 text-slate-500"
                                }`}
                            >
                                {tab.count}
                            </span>

                            {activeTab === tab.key && (
                                <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-[#0D59F2]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Payment Reviews */}
            <div className="space-y-6">
                {visiblePayments.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Package
                                size={22}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-800">
                            No payments found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            There are no payments in this section.
                        </p>
                    </div>
                ) : (
                    visiblePayments.map((payment) => (
                        <div
                            key={payment.id}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                        >
                            {/* Payment Header */}
                            <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="text-sm font-semibold text-slate-900">
                                        Order #{payment.id}
                                    </span>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentMethodStyle(
                                            payment.paymentMethod
                                        )}`}
                                    >
                                        {payment.paymentMethod}
                                    </span>

                                    {payment.status === "Awaiting Review" ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                            <Clock3 size={13} />
                                            Awaiting Review
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                            <CheckCircle2 size={13} />
                                            Approved
                                        </span>
                                    )}
                                </div>

                                <div className="text-left lg:text-right">
                                    <p className="text-xs text-slate-400">
                                        Order Total
                                    </p>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {payment.price}
                                    </p>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
                                {/* Customer Details - ALWAYS ONE COLUMN */}
                                <div className="min-w-0 p-4 sm:p-6">
                                    <div className="flex flex-col gap-5">
                                        <div className="min-w-0">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Customer
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {payment.customer}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Email
                                            </p>

                                            <p className="break-all text-sm text-slate-700">
                                                {payment.email}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Phone
                                            </p>

                                            <p className="text-sm text-slate-700">
                                                {payment.phone}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Placed
                                            </p>

                                            <p className="text-sm text-slate-700">
                                                {payment.placed}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Viewed
                                            </p>

                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    payment.viewed === "Viewed"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                            >
                                                <Eye size={13} />
                                                {payment.viewed}
                                            </span>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Items
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {payment.items}{" "}
                                                {payment.items === 1
                                                    ? "Item"
                                                    : "Items"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Proof */}
                                <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6 lg:border-l lg:border-t-0">
                                    <div className="mb-3">
                                        <h3 className="text-sm font-semibold text-slate-900">
                                            Payment Proof
                                        </h3>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Screenshot submitted by customer
                                        </p>
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                                        <img
                                            src={payment.proof}
                                            alt={`Payment proof for Order #${payment.id}`}
                                            className="h-auto max-h-[420px] w-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PaymentReview;