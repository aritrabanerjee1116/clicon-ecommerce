import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

// Layout
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminLayout from "../admin/AdminLayout";

// Customer Pages
import Home from "../pages/Home";
import ProductsPage from "../pages/ProductsPage";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import OrdersPage from "../pages/OrdersPage";
import AccountPage from "../pages/AccountPage";

// Admin Pages
import Dashboard from "../admin/Dashboard";
import ProductManagement from "../admin/ProductManagement";
import CategoryManagement from "../admin/CategoryManagement";
import OrderManagement from "../admin/OrderManagement";
import UserManagement from "../admin/UserManagement";
import InventoryManagement from "../admin/InventoryManagement";
import ReviewModeration from "../admin/ReviewModeration";
import SettingsPage from "../admin/SettingsPage";
import Support from "../pages/Support";
import ShippingInfo from "../pages/Shipping";
import Returns from "../pages/Return";
import FAQ from "../pages/Faq";


// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAppSelector((s) => s.auth);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading, profileLoaded } = useAppSelector((s) => s.auth);
  

  // DEBUG: Remove this after admin works
  console.log('[AdminRoute]', { loading, profileLoaded, user: !!user, profileRole: profile?.role, profile });

  if (loading || !profileLoaded) return null; // Wait for profile to load
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Customer layout with navbar + footer
const CustomerLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main style={{ minHeight: "70vh" }}>{children}</main>
    <Footer />
  </>
);

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages (no navbar/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/products" element={<CustomerLayout><ProductsPage /></CustomerLayout>} />
        <Route path="/products/:id" element={<CustomerLayout><ProductDetails /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><ProtectedRoute><CartPage /></ProtectedRoute></CustomerLayout>} />
        <Route path="/wishlist" element={<CustomerLayout><ProtectedRoute><WishlistPage /></ProtectedRoute></CustomerLayout>} />
        <Route path="/orders" element={<CustomerLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></CustomerLayout>} />
        <Route path="/account" element={<CustomerLayout><ProtectedRoute><AccountPage /></ProtectedRoute></CustomerLayout>} />
         <Route path="/support" element={<CustomerLayout><Support /></CustomerLayout>} />
         <Route path="/shipping" element={<CustomerLayout><ShippingInfo /></CustomerLayout>} />
         <Route path="/return" element={<CustomerLayout><Returns /></CustomerLayout>} />
         <Route path="/faq" element={<CustomerLayout><FAQ /></CustomerLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="reviews" element={<ReviewModeration />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;