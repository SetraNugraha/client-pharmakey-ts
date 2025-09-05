import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Customer
import Login from "./pages/Customer/Login";
import Register from "./pages/Customer/Register";
import Profile from "./pages/Customer/Profile/Profile";
import UpdateProfile from "./pages/Customer/Profile/UpdateProfile";
import Homepage from "./pages/Customer/Homepage";
import Product from "./pages/Customer/Product";
import StoreLocations from "./pages/Customer/StoreLocations";
import Doctors from "./pages/Customer/Doctors";
import DetailProduct from "./pages/Customer/DetailProduct";
import SearchProduct from "./pages/Customer/SearchProduct";
import Transactions from "./pages/Customer/Transactions/Transaction";
import DetailTransaction from "./pages/Customer/Transactions/DetailTransaction";
import Cart from "./pages/Customer/Carts/Cart";
import FinishCheckout from "./pages/Customer/FinishCheckout";
import { CustomerLayout } from "./layouts/CustomerLayout";

// Admin
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminCategory from "./pages/Admin/Category/AdminCategory";
import AdminProducts from "./pages/Admin/Product/AdminProducts";
import AdminTransactions from "./pages/Admin//Transaction/AdminTransactions";
import AdminCustomer from "./pages/Admin/Customer/AdminCustomer";
import { AdminLayout } from "./layouts/AdminLayout";

// Auth Context
import { AuthContextProvider } from "./Auth/AuthContext";
import { PrivateRoutesAdmin } from "./layouts/PrivateRoutesAdmin";
import { PrivateRoutesCustomer } from "./layouts/PrivateRoutesCustomer";
import { useEffect } from "react";

export default function App() {
  const DynamicTitle = () => {
    const location = useLocation();
    useEffect(() => {
      if (location.pathname.startsWith("/admin")) {
        document.title = "Pharmakey Admin";
      } else {
        document.title = "Pharmakey";
      }
    }, [location]);

    return null;
  };
  return (
    <Router>
      <DynamicTitle />
      <AuthContextProvider>
        <Routes>
          {/* User Layout */}
          <Route element={<CustomerLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/detail-product/:slug/:productId" element={<DetailProduct />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/store" element={<StoreLocations />} />
            <Route path="/search-product" element={<SearchProduct />} />

            {/* Private Route Customer */}
            <Route element={<PrivateRoutesCustomer />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/carts" element={<Cart />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/detail-transaction/:transactionId" element={<DetailTransaction />} />
              <Route path="/finish-checkout" element={<FinishCheckout />} />
            </Route>
          </Route>

          {/* Admin layout */}
          {/* Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Private Route Admin */}
          <Route element={<PrivateRoutesAdmin />}>
            <Route element={<AdminLayout />}>
              {/* Dashboard */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Customer */}
              <Route path="/admin/customer" element={<AdminCustomer />} />

              {/* Category */}
              <Route path="/admin/categories" element={<AdminCategory />} />

              {/* Products */}
              <Route path="/admin/products" element={<AdminProducts />} />

              {/* Transactions */}
              <Route path="/admin/transactions" element={<AdminTransactions />} />
            </Route>
          </Route>
          {/* END Private Route Admin */}
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}
