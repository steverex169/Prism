import React, { useMemo, useState } from "react";
import StatCard from "../component/Statcard.jsx";
import {
    ShoppingCart,
    CreditCard,
    Package,
    AlertCircle,
    Search,
    Filter,
    Mail,
} from "lucide-react";

const Order = () => {
    // --------------------------------
    // SAMPLE ORDERS
    // Replace this later with API data
    // --------------------------------

    const [orders] = useState([
        {
            id: 1001,
            customer: "John Doe",
            email: "john@example.com",
            items: 3,
            total: "$149.00",
            promotion: "WELCOME10",
            payment: "Paid",
            method: "Visa",
            status: "Processing",
            date: "Oct 02, 2026",
        },
        {
            id: 1002,
            customer: "Sarah Smith",
            email: "sarah@example.com",
            items: 1,
            total: "$59.00",
            promotion: "—",
            payment: "Paid",
            method: "PayPal",
            status: "Shipped",
            date: "Oct 01, 2026",
        },
        {
            id: 1003,
            customer: "Michael Brown",
            email: "michael@example.com",
            items: 5,
            total: "$320.00",
            promotion: "SAVE20",
            payment: "Unpaid",
            method: "Payment Pending",
            status: "Pending",
            date: "Sep 30, 2026",
        },
        {
            id: 1004,
            customer: "Emily Johnson",
            email: "emily@example.com",
            items: 2,
            total: "$99.00",
            promotion: "—",
            payment: "Paid",
            method: "Mastercard",
            status: "Delivered",
            date: "Sep 29, 2026",
        },
        {
            id: 1005,
            customer: "David Wilson",
            email: "david@example.com",
            items: 4,
            total: "$210.00",
            promotion: "NEWUSER",
            payment: "Unpaid",
            method: "Other / Contact for Payment",
            status: "Checkout",
            date: "Sep 28, 2026",
        },
        {
            id: 1006,
            customer: "Olivia Davis",
            email: "olivia@example.com",
            items: 2,
            total: "$85.00",
            promotion: "—",
            payment: "Paid",
            method: "American Express",
            status: "Cancelled",
            date: "Sep 27, 2026",
        },
        {
            id: 1007,
            customer: "James Miller",
            email: "james@example.com",
            items: 1,
            total: "$45.00",
            promotion: "—",
            payment: "Unpaid",
            method: "Bitcoin (BTC)",
            status: "Failed",
            date: "Sep 26, 2026",
        },
    ]);

    // --------------------------------
    // FILTER STATE
    // --------------------------------

    const [search, setSearch] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const [activeFilters, setActiveFilters] = useState([]);

    // --------------------------------
    // FILTER OPTIONS
    // --------------------------------

    const orderStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Checkout",
        "Failed",
    ];

    const paymentStatuses = [
        "Paid",
        "Unpaid",
    ];

    const paymentMethods = [
        "Payment Pending",
        "Other / Contact for Payment",
        "Legacy Payment Method",
        "Bitcoin (BTC)",
        "Ethereum (ETH)",
        "Tether (USDT - TRON)",
        "Tether (USDT - Ethereum)",
        "Mastercard",
        "Visa",
        "PayPal",
        "Cash App",
        "Venmo",
        "American Express",
    ];

    // --------------------------------
    // APPLY FILTERS
    // --------------------------------

    const handleFilter = () => {
        const filters = [];

        if (orderStatus) {
            filters.push({
                type: "Order",
                value: orderStatus,
            });
        }

        if (paymentStatus) {
            filters.push({
                type: "Payment",
                value: paymentStatus,
            });
        }

        if (paymentMethod) {
            filters.push({
                type: "Method",
                value: paymentMethod,
            });
        }

        setActiveFilters(filters);
    };

    // --------------------------------
    // FILTER ORDERS
    // --------------------------------

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                order.customer.toLowerCase().includes(searchValue) ||
                order.email.toLowerCase().includes(searchValue) ||
                String(order.id).includes(searchValue);

            const matchesOrderStatus =
                !orderStatus ||
                order.status === orderStatus;

            const matchesPaymentStatus =
                !paymentStatus ||
                order.payment === paymentStatus;

            const matchesPaymentMethod =
                !paymentMethod ||
                order.method === paymentMethod;

            return (
                matchesSearch &&
                matchesOrderStatus &&
                matchesPaymentStatus &&
                matchesPaymentMethod
            );
        });
    }, [
        orders,
        search,
        orderStatus,
        paymentStatus,
        paymentMethod,
    ]);

    // --------------------------------
    // STATUS STYLES
    // --------------------------------

    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return "bg-amber-50 text-amber-600 border-amber-100";

            case "Processing":
                return "bg-blue-50 text-blue-600 border-blue-100";

            case "Shipped":
                return "bg-purple-50 text-purple-600 border-purple-100";

            case "Delivered":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";

            case "Cancelled":
                return "bg-red-50 text-red-600 border-red-100";

            case "Failed":
                return "bg-red-50 text-red-600 border-red-100";

            case "Checkout":
                return "bg-slate-100 text-slate-600 border-slate-200";

            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getPaymentStyle = (payment) => {
        return payment === "Paid"
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-amber-50 text-amber-600 border-amber-100";
    };

    return (
        <div className="w-full space-y-6">

            {/* --------------------------------
                STAT CARDS
            -------------------------------- */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    width="w-full"
                    height="h-[135px]"
                    icon={ShoppingCart}
                    iconColor="text-blue-600"
                    iconBg="bg-blue-50"
                    iconBorder="border-blue-100"
                    value="8"
                    title="Total Orders"
                    subtitle="Orders received"
                />

                <StatCard
                    width="w-full"
                    height="h-[135px]"
                    icon={CreditCard}
                    iconColor="text-emerald-600"
                    iconBg="bg-emerald-50"
                    iconBorder="border-emerald-100"
                    value="12"
                    title="Payments"
                    subtitle="Payments received"
                />

                <StatCard
                    width="w-full"
                    height="h-[135px]"
                    icon={Package}
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                    iconBorder="border-purple-100"
                    value="24"
                    title="Products"
                    subtitle="Products in inventory"
                />

                <StatCard
                    width="w-full"
                    height="h-[135px]"
                    icon={AlertCircle}
                    iconColor="text-red-600"
                    iconBg="bg-red-50"
                    iconBorder="border-red-100"
                    value="3"
                    title="Failed Orders"
                    subtitle="Requires attention"
                />

            </div>

            {/* --------------------------------
                ORDERS SECTION
            -------------------------------- */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* --------------------------------
                    HEADER / SEARCH / FILTERS
                -------------------------------- */}

                <div className="border-b border-slate-200 p-5">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        {/* Search */}

                        <div className="relative w-full xl:max-w-sm">

                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search orders..."
                                className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Filters */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                            {/* Order Status */}

                            <select
                                value={orderStatus}
                                onChange={(e) =>
                                    setOrderStatus(e.target.value)
                                }
                                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    Active Order
                                </option>

                                {orderStatuses.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                ))}
                            </select>

                            {/* Payment */}

                            <select
                                value={paymentStatus}
                                onChange={(e) =>
                                    setPaymentStatus(e.target.value)
                                }
                                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    All Payments
                                </option>

                                {paymentStatuses.map((payment) => (
                                    <option
                                        key={payment}
                                        value={payment}
                                    >
                                        {payment}
                                    </option>
                                ))}
                            </select>

                            {/* Payment Method */}

                            <select
                                value={paymentMethod}
                                onChange={(e) =>
                                    setPaymentMethod(e.target.value)
                                }
                                className="h-11 max-w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">
                                    All Methods
                                </option>

                                {paymentMethods.map((method) => (
                                    <option
                                        key={method}
                                        value={method}
                                    >
                                        {method}
                                    </option>
                                ))}
                            </select>

                            {/* Filter Button */}

                            <button
                                type="button"
                                onClick={handleFilter}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                <Filter size={17} />
                                Filter
                            </button>

                        </div>

                    </div>

                    {/* --------------------------------
                        ACTIVE FILTERS
                    -------------------------------- */}

                    {activeFilters.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">

                            <span className="text-xs font-medium text-slate-500">
                                Filters:
                            </span>

                            {activeFilters.map((filter) => (
                                <span
                                    key={`${filter.type}-${filter.value}`}
                                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                                >
                                    {filter.type}: {filter.value}
                                </span>
                            ))}

                        </div>
                    )}

                </div>

                {/* --------------------------------
                    TABLE
                -------------------------------- */}

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1200px] border-collapse">

                        <thead>

                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    ID
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Items
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Total
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Promotion
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Payment
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Send Email
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredOrders.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="10"
                                        className="px-6 py-16 text-center text-sm text-slate-500"
                                    >
                                        No orders found
                                    </td>

                                </tr>

                            ) : (

                                filteredOrders.map((order) => (

                                    <tr
                                        key={order.id}
                                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                            #{order.id}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                            {order.customer}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {order.email}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {order.items}
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                            {order.total}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {order.promotion}
                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getPaymentStyle(
                                                    order.payment
                                                )}`}
                                            >
                                                {order.payment}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {order.date}
                                        </td>

                                        <td className="px-6 py-4">

                                            <button
                                                type="button"
                                                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Mail size={15} />
                                                Send
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default Order;