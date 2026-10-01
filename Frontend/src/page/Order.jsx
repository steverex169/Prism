import React from 'react'
import StatCard from '../component/Statcard.jsx'
import { ShoppingCart, CreditCard, Package, AlertCircle } from 'lucide-react';

const Order = () => {
    return (
        <>
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
        </>
    )
}

export default Order