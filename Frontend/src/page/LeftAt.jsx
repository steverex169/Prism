import React, { useEffect, useState } from "react";
import {
    CircleAlert,
    Mail,
    Phone,
    Clock3,
    Trash2,
    Check,
} from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "";

const tabs = [
    {
        id: "followup",
        label: "To follow up",
    },
    {
        id: "followed",
        label: "Followed up",
    },
    {
        id: "ordered",
        label: "Went on to order",
    },
];

const formatDate = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

const formatTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getLastActiveText = (dateString) => {
    if (!dateString) {
        return "LAST ACTIVE RECENTLY";
    }

    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now - date;
    const diffMinutes = Math.floor(
        diffMs / (1000 * 60)
    );

    if (diffMinutes < 1) {
        return "LAST ACTIVE JUST NOW";
    }

    if (diffMinutes < 60) {
        return `LAST ACTIVE ${diffMinutes} MIN AGO`;
    }

    const diffHours = Math.floor(
        diffMinutes / 60
    );

    if (diffHours < 24) {
        return `LAST ACTIVE ${diffHours} ${
            diffHours === 1 ? "HOUR" : "HOURS"
        } AGO`;
    }

    const diffDays = Math.floor(
        diffHours / 24
    );

    return `LAST ACTIVE ${diffDays} ${
        diffDays === 1 ? "DAY" : "DAYS"
    } AGO`;
};

const getCartName = (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
        return "Cart";
    }

    if (cartItems.length === 1) {
        return cartItems[0]?.name || "Cart";
    }

    return `${cartItems[0]?.name || "Cart"} + ${
        cartItems.length - 1
    } more`;
};

const LeftAt = () => {
    const [activeTab, setActiveTab] =
        useState("followup");

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/abandoned-carts/`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load abandoned customers"
                );
            }

            const data = await response.json();

            setCustomers(data);
        } catch (error) {
            console.error(
                "Failed to fetch abandoned customers:",
                error
            );

            setError(
                "Unable to load abandoned customers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const markFollowedUp = async (id) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/abandoned-carts/${id}/followed-up`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to mark customer as followed up"
                );
            }

            setCustomers((currentCustomers) =>
                currentCustomers.map((customer) =>
                    customer.id === id
                        ? {
                              ...customer,
                              status: "followed_up",
                          }
                        : customer
                )
            );

            setActiveTab("followed");
        } catch (error) {
            console.error(
                "Failed to mark customer:",
                error
            );

            alert(
                "Failed to mark customer as followed up."
            );
        }
    };

    const deleteCustomer = async (id) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/abandoned-carts/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete customer"
                );
            }

            setCustomers((currentCustomers) =>
                currentCustomers.filter(
                    (customer) =>
                        customer.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete customer:",
                error
            );

            alert(
                "Failed to delete customer."
            );
        }
    };

    const getCustomersForTab = () => {
        if (activeTab === "followup") {
            return customers.filter(
                (customer) =>
                    customer.status === "pending"
            );
        }

        if (activeTab === "followed") {
            return customers.filter(
                (customer) =>
                    customer.status ===
                    "followed_up"
            );
        }

        if (activeTab === "ordered") {
            return customers.filter(
                (customer) =>
                    customer.status === "ordered"
            );
        }

        return [];
    };

    const visibleCustomers =
        getCustomersForTab();

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <CircleAlert
                            size={22}
                            className="text-red-500"
                        />

                        <h1 className="text-2xl font-bold text-slate-800">
                            Left At Checkout
                        </h1>
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                        Customers who left before
                        completing their order.
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

                    <div className="flex border-b border-slate-200">
                        {tabs.map((tab) => {
                            const count =
                                customers.filter(
                                    (customer) => {
                                        if (
                                            tab.id ===
                                            "followup"
                                        ) {
                                            return (
                                                customer.status ===
                                                "pending"
                                            );
                                        }

                                        if (
                                            tab.id ===
                                            "followed"
                                        ) {
                                            return (
                                                customer.status ===
                                                "followed_up"
                                            );
                                        }

                                        return (
                                            customer.status ===
                                            "ordered"
                                        );
                                    }
                                ).length;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab.id
                                        )
                                    }
                                    className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                                        activeTab ===
                                        tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {tab.label}

                                    {count > 0 && (
                                        <span className="ml-2 text-xs bg-slate-100 rounded-full px-2 py-1">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6">

                        {loading && (
                            <div className="text-center py-12 text-slate-500">
                                Loading customers...
                            </div>
                        )}

                        {!loading && error && (
                            <div className="text-center py-12 text-red-500">
                                {error}
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            visibleCustomers.length ===
                                0 && (
                                <div className="text-center py-12 text-slate-500">
                                    No customers in this section.
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            visibleCustomers.map(
                                (customer) => (
                                    <div
                                        key={
                                            customer.id
                                        }
                                        className="border border-slate-200 rounded-xl p-5 mb-4"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                            <div className="flex-1">

                                                <div className="flex items-start justify-between gap-4">

                                                    <div>
                                                        <h2 className="text-lg font-bold text-slate-800">
                                                            {
                                                                customer.customer_name
                                                            }
                                                        </h2>

                                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">

                                                            <span className="flex items-center gap-1">
                                                                <Mail
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                                {
                                                                    customer.customer_email
                                                                }
                                                            </span>

                                                            <span className="flex items-center gap-1">
                                                                <Phone
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                                {
                                                                    customer.customer_phone
                                                                }
                                                            </span>

                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-slate-800">
                                                            $
                                                            {Number(
                                                                customer.total ||
                                                                    0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </div>

                                                        <div className="text-xs text-slate-400">
                                                            {
                                                                customer.items
                                                            }{" "}
                                                            items
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-400">

                                                    <span className="flex items-center gap-1">
                                                        <Clock3
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            customer.last_active
                                                        }
                                                    </span>

                                                    <span>
                                                        {formatDate(
                                                            customer.last_active
                                                        )}
                                                    </span>

                                                    <span>
                                                        {formatTime(
                                                            customer.last_active
                                                        )}
                                                    </span>

                                                </div>

                                                <div className="mt-3 text-sm text-slate-600">
                                                    <span className="font-semibold">
                                                        Cart:
                                                    </span>{" "}
                                                    {getCartName(
                                                        customer.cart_items
                                                    )}
                                                </div>

                                                {customer.research_field && (
                                                    <div className="mt-1 text-sm text-slate-600">
                                                        <span className="font-semibold">
                                                            Research:
                                                        </span>{" "}
                                                        {
                                                            customer.research_field
                                                        }
                                                    </div>
                                                )}

                                            </div>

                                            <div className="flex flex-wrap gap-2">

                                                <a
                                                    href={`mailto:${customer.customer_email}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                                                >
                                                    <Mail
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Email them
                                                </a>

                                                {customer.status ===
                                                    "pending" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            markFollowedUp(
                                                                customer.id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                                                    >
                                                        <Check
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        Mark as followed up
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteCustomer(
                                                            customer.id
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                                                >
                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Delete
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                )
                            )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftAt;