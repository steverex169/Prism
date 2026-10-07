import React, { useEffect, useMemo, useState } from "react";
import StatCard from "../component/Statcard.jsx";
import {
    ShoppingCart,
    CreditCard,
    Package,
    AlertCircle,
    Search,
    Filter,
    Mail,
    Pencil,
    Trash2,
    X,
    Save,
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const Order = () => {
    // --------------------------------
    // ORDERS FROM BACKEND API
    // --------------------------------

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --------------------------------
    // EDIT STATE
    // --------------------------------

    const [editingOrder, setEditingOrder] = useState(null);
    const [savingOrder, setSavingOrder] = useState(false);
    const [deletingOrderId, setDeletingOrderId] = useState(null);

    // --------------------------------
    // GET ORDERS
    // --------------------------------

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/orders/`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const contentType =
                response.headers.get("content-type");

            if (!contentType?.includes("application/json")) {
                throw new Error(
                    "Server returned an invalid response."
                );
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to load orders."
                );
            }

            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);

            setError(
                error.message || "Failed to load orders."
            );
        } finally {
            setLoading(false);
        }
    };

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
        "Credit / Debit Card",
    ];

    // --------------------------------
    // FORMAT API ORDERS FOR UI
    // --------------------------------

    const formattedOrders = useMemo(() => {
        return orders.map((order) => {
            const status = order.status
                ? order.status.charAt(0).toUpperCase() +
                order.status.slice(1).toLowerCase()
                : "Pending";

            return {
                ...order,

                customer: order.customer_name || "—",

                email: order.customer_email || "—",

                total:
                    order.total !== null &&
                        order.total !== undefined
                        ? Number(order.total)
                        : 0,

                method:
                    order.payment_method || "Unknown",

                status,

                payment:
                    order.payment
                        ? order.payment.charAt(0).toUpperCase() +
                        order.payment.slice(1).toLowerCase()
                        : "Unpaid",

                date: order.date
                    ? new Date(order.date).toLocaleDateString(
                        "en-US",
                        {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        }
                    )
                    : "—",
            };
        });
    }, [orders]);

    // --------------------------------
    // REAL STATISTICS
    // --------------------------------

    const totalOrders = orders.length;

    const totalPayments = orders.filter(
        (order) =>
            String(order.payment || "").toLowerCase() ===
            "paid"
    ).length;

    const totalProducts = orders.reduce(
        (total, order) =>
            total + Number(order.items || 0),
        0
    );

    const failedOrders = orders.filter(
        (order) =>
            String(order.status || "").toLowerCase() ===
            "failed"
    ).length;

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
        const searchValue = search.toLowerCase().trim();

        return formattedOrders.filter((order) => {
            const matchesSearch =
                !searchValue ||
                String(order.customer || "")
                    .toLowerCase()
                    .includes(searchValue);

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
        formattedOrders,
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

    // --------------------------------
    // EDIT ORDER
    // --------------------------------

    const openEditModal = (order) => {
        setEditingOrder({
            id: order.id,
            order_number: order.order_number || "",
            customer_name: order.customer_name || "",
            customer_email: order.customer_email || "",
            research_field: order.research_field || "",
            items: order.items || 0,
            total: order.total || 0,
            payment: order.payment || "Unpaid",
            payment_method: order.payment_method || "",
            status: order.status || "pending",
        });
    };

    const closeEditModal = () => {
        if (!savingOrder) {
            setEditingOrder(null);
        }
    };

    const handleEditChange = (field, value) => {
        setEditingOrder((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSaveOrder = async () => {
        if (!editingOrder) {
            return;
        }

        try {
            setSavingOrder(true);

            const response = await fetch(
                `${API_BASE_URL}/orders/${editingOrder.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        order_number:
                            editingOrder.order_number.trim(),

                        customer_name:
                            editingOrder.customer_name.trim(),

                        customer_email:
                            editingOrder.customer_email.trim(),

                        research_field:
                            editingOrder.research_field.trim(),

                        items: Number(editingOrder.items),

                        total: Number(editingOrder.total),

                        payment:
                            editingOrder.payment,

                        payment_method:
                            editingOrder.payment_method,

                        status:
                            editingOrder.status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to update order."
                );
            }

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order.id === data.id
                        ? data
                        : order
                )
            );

            setEditingOrder(null);

        } catch (error) {
            console.error(
                "Failed to update order:",
                error
            );

            alert(
                error.message ||
                "Failed to update order."
            );
        } finally {
            setSavingOrder(false);
        }
    };

    // --------------------------------
    // DELETE ORDER
    // --------------------------------

    const handleDeleteOrder = async (orderId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingOrderId(orderId);

            const response = await fetch(
                `${API_BASE_URL}/orders/${orderId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Failed to delete order."
                );
            }

            setOrders((previousOrders) =>
                previousOrders.filter(
                    (order) => order.id !== orderId
                )
            );

        } catch (error) {
            console.error(
                "Failed to delete order:",
                error
            );

            alert(
                error.message ||
                "Failed to delete order."
            );
        } finally {
            setDeletingOrderId(null);
        }
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
                    value={loading ? "..." : String(totalOrders)}
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
                    value={loading ? "..." : String(totalPayments)}
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
                    value={loading ? "..." : String(totalProducts)}
                    title="Products"
                    subtitle="Products ordered"
                />

                <StatCard
                    width="w-full"
                    height="h-[135px]"
                    icon={AlertCircle}
                    iconColor="text-red-600"
                    iconBg="bg-red-50"
                    iconBorder="border-red-100"
                    value={loading ? "..." : String(failedOrders)}
                    title="Failed Orders"
                    subtitle="Requires attention"
                />

            </div>

            {/* --------------------------------
                ORDERS SECTION
            -------------------------------- */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* HEADER */}

                <div className="border-b border-slate-200 p-5">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                        {/* SEARCH */}

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

                        {/* FILTERS */}

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">

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

                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1250px] border-collapse">

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
                                    Payment
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-6 py-16 text-center text-sm text-slate-500"
                                    >
                                        Loading orders...
                                    </td>
                                </tr>

                            ) : error ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="text-sm font-medium text-red-500">
                                            {error}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={fetchOrders}
                                            className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Try Again
                                        </button>

                                    </td>
                                </tr>

                            ) : filteredOrders.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="9"
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
                                            ${Number(order.total).toFixed(2)}
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

                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        openEditModal(order)
                                                    }
                                                    title="Edit Order"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Pencil size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteOrder(
                                                            order.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingOrderId ===
                                                        order.id
                                                    }
                                                    title="Delete Order"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Trash2 size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    title="Send Email"
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Mail size={15} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* --------------------------------
                EDIT ORDER MODAL
            -------------------------------- */}

            {editingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">

                    <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-800">
                                    Edit Order
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Order #{editingOrder.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={savingOrder}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* MODAL BODY */}

                        <div className="max-h-[70vh] overflow-y-auto p-6">

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                {/* Order Number */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Order Number
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            editingOrder.order_number
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "order_number",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Customer Name */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Customer Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            editingOrder.customer_name
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "customer_name",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Email */}

                                <div className="sm:col-span-2">

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Customer Email
                                    </label>

                                    <input
                                        type="email"
                                        value={
                                            editingOrder.customer_email
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "customer_email",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                                {/* Items */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Items
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            editingOrder.items
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "items",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                                {/* Total */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Total
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            editingOrder.total
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "total",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                                {/* Payment */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Payment
                                    </label>

                                    <select
                                        value={
                                            editingOrder.payment
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "payment",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        {paymentStatuses.map(
                                            (payment) => (
                                                <option
                                                    key={payment}
                                                    value={payment}
                                                >
                                                    {payment}
                                                </option>
                                            )
                                        )}
                                    </select>

                                </div>

                                {/* Payment Method */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Payment Method
                                    </label>

                                    <select
                                        value={
                                            editingOrder.payment_method
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "payment_method",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        <option value="">
                                            Select Method
                                        </option>

                                        {paymentMethods.map(
                                            (method) => (
                                                <option
                                                    key={method}
                                                    value={method}
                                                >
                                                    {method}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* Status */}

                                <div className="sm:col-span-2">

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Order Status
                                    </label>

                                    <select
                                        value={
                                            editingOrder.status
                                        }
                                        onChange={(e) =>
                                            handleEditChange(
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >

                                        {orderStatuses.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status.toLowerCase()}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                            </div>

                        </div>

                        {/* MODAL FOOTER */}

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

                            <button
                                type="button"
                                onClick={closeEditModal}
                                disabled={savingOrder}
                                className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveOrder}
                                disabled={savingOrder}
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save size={16} />

                                {savingOrder
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Order;
