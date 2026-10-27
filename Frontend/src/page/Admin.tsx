import React from "react";
import Sidebar from "../component/sidebar";
import Topbar from "../component/Topbar";
import Order from "../page/Order";
import { Route, Routes } from "react-router-dom";
import HeroPage from "./HeroPage";
import PaymentReview from "./PaymentReview";
import FailedCheckout from "./FailedCheckout";
import LeftAt from "./LeftAt";
import Product from "./Product";
import EmailActivity from './EmailActivity';

const Admin = () => {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      <div className="ml-[260px] flex min-h-screen flex-col">
        <Topbar />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/emails" element={<EmailActivity />} />
            <Route
              path="/orders"
              element={<Order />}
            />
            <Route
              path="/heroimage"
              element={<HeroPage />}
            />
            <Route
              path="/payment-review"
              element={<PaymentReview />}
            />
            <Route
              path="/failed"
              element={<FailedCheckout />}
            />
            <Route
              path="/left-at-checkout"
              element={<LeftAt />}
            />
            <Route
              path="/inventory"
              element={<Product/>}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
