import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Top_Header from "./component/Top_Header.jsx";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import ScrollToTop from "./component/ScrollToTop.jsx";
import GuestRoute from "./context/GuestRoute.jsx";

import Main_page from "./page/Main_page.jsx";
import Catalog from "./page/Catalog.jsx";
import Contact from "./page/Contact.jsx";
import About from "./page/About.jsx";
import TermCondition from "./page/TermCondition.jsx";
import Privay from "./page/Privay.jsx";
import Refund from "./page/Refund.jsx";
import Shipping from "./page/Shipping.jsx";
import Quality from "./page/Qaulity.jsx";
import Third from "./page/Third.jsx";
import Certificate from "./page/Certificate.jsx";
import Manufacturing from "./page/Manufacturing.jsx";
import Compliance from "./page/Compliance.jsx";
import Signin from "./page/Signin.jsx";
import Login from "./page/Login.jsx";
import NotFound from "./page/NotFound.jsx";
import Checkout from "./page/Checkout.jsx";

// Admin
import AdminLogin from "./page/Admin_Login.jsx";
import Admin from "./page/Admin.jsx";

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* =========================
            ADMIN ROUTES
            No Header / Footer
        ========================= */}
        <Route
          path="/pannel/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/*"
          element={
            <Admin />
          }
        />

        <Route
          path="/admin"
          element={<Navigate to="/admin/orders" replace />}
        />

        {/* =========================
            WEBSITE ROUTES
        ========================= */}
        <Route
          path="*"
          element={
            <>
              <Top_Header />
              <Header />

              <Routes>
                {/* Guest-only routes */}
                <Route
                  path="/signup"
                  element={
                    <GuestRoute>
                      <Signin />
                    </GuestRoute>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                />

                {/* Main Routes */}
                <Route path="/" element={<Main_page />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path='/checkout' element={<Checkout />} />

                {/* Policies */}
                <Route
                  path="/terms"
                  element={<TermCondition />}
                />

                <Route
                  path="/privacy"
                  element={<Privay />}
                />

                <Route
                  path="/refund"
                  element={<Refund />}
                />

                <Route
                  path="/shipping"
                  element={<Shipping />}
                />

                {/* Other Pages */}
                <Route
                  path="/quality"
                  element={<Quality />}
                />

                <Route
                  path="/third"
                  element={<Third />}
                />

                <Route
                  path="/certificate"
                  element={<Certificate />}
                />

                <Route
                  path="/manufacturing"
                  element={<Manufacturing />}
                />

                <Route
                  path="/compliance"
                  element={<Compliance />}
                />

                {/* Unknown Route */}
                <Route
                  path="*"
                  element={<NotFound />}
                />
              </Routes>

              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;