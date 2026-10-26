import React, { useEffect, useState, } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
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
import { useCart } from "./context/CartContext.jsx";

// Admin
import AdminLogin from "./page/Admin_Login.jsx";
import Admin from "./page/Admin.jsx";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";


/* =========================
   PROTECTED CHECKOUT
========================= */

const ProtectedCheckout = () => {
  const { cartItems } = useCart();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [access, setAccess] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    const verifyCheckoutAccess = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) setAccess("login");
          return;
        }

        const data = await response.json();
        const user = data?.user;

        if (!cancelled) {
          setAccess(user?.compliance_complete === true ? "allowed" : "incomplete");
        }
      } catch {
        if (!cancelled) setAccess("login");
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    verifyCheckoutAccess();
    return () => { cancelled = true; };
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white text-sm text-[#697181]">
        Verifying your researcher account...
      </div>
    );
  }

  if (access === "login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (access === "incomplete") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-semibold text-[#1E293B]">Researcher verification required</h1>
        <p className="mt-3 text-sm leading-6 text-[#64748B]">
          Checkout is available only to accounts with completed age, qualified-researcher, research-field, research-use, and terms confirmations. Please contact support to update your account details.
        </p>
        <a href="/contact" className="mt-6 rounded-lg bg-[#0D59F2] px-5 py-3 text-sm font-semibold text-white">
          Contact support
        </a>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/catalog" replace />;
  }

  return <Checkout />;
};


/* =========================
   PROTECTED ADMIN
========================= */

const ProtectedAdmin = () => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const checkAdminAuthentication = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/status`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (response.ok) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error(
        "Admin authentication check error:",
        error
      );

      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkAdminAuthentication();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setChecking(true);
        checkAdminAuthentication();
      }
    };

    const handlePageShow = () => {
      setChecking(true);
      checkAdminAuthentication();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white">
        <div className="text-sm text-gray-500">
          Checking access...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Navigate
        to="/panel/login"
        replace
      />
    );
  }

  return <Admin />;
};



const AGE_GATE_STORAGE_KEY = "prism_age_gate_confirmed";
const AGE_GATE_REQUIRED_TEXT =
  "All products are sold for Research Use Only. To continue you confirm that you are a qualified research professional aged 21 or older.";

const AgeGate = ({ onConfirm }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/90 px-4 py-8"
    >
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
          Age Gate + Login Gate
        </p>
        <h1
          id="age-gate-title"
          className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl"
        >
          Research Professional Verification
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Access to this website is restricted to qualified research professionals aged 21 or older.
        </p>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-blue-700"
          />
          <span>{AGE_GATE_REQUIRED_TEXT}</span>
        </label>

        <button
          type="button"
          disabled={!confirmed}
          onClick={onConfirm}
          className="mt-5 w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          I Confirm and Continue
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [ageGateConfirmed, setAgeGateConfirmed] = useState(() => {
    try {
      return sessionStorage.getItem(AGE_GATE_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const confirmAgeGate = () => {
    try {
      sessionStorage.setItem(AGE_GATE_STORAGE_KEY, "true");
    } catch {
      // The gate still unlocks for this rendered session if storage is unavailable.
    }
    setAgeGateConfirmed(true);
  };

  if (!ageGateConfirmed) {
    return <AgeGate onConfirm={confirmAgeGate} />;
  }

  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* =========================
            ADMIN LOGIN
            No Header / Footer
        ========================= */}

        <Route
          path="/panel/login"
          element={<AdminLogin />}
        />


        {/* =========================
            PROTECTED ADMIN ROUTES
            No Header / Footer
        ========================= */}

        <Route
          path="/admin/*"
          element={<ProtectedAdmin />}
        />


        {/* =========================
            ADMIN ROOT
        ========================= */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/orders"
              replace
            />
          }
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

                <Route
                  path="/"
                  element={<Main_page />}
                />

                <Route
                  path="/faq"
                  element={<Main_page />}
                />

                <Route
                  path="/catalog"
                  element={<Catalog />}
                />

                <Route
                  path="/contact"
                  element={<Contact />}
                />

                <Route
                  path="/about"
                  element={<About />}
                />

                <Route
                  path="/checkout"
                  element={<ProtectedCheckout />}
                />


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