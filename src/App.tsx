import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Landing from "./pages/Landing";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import NewPassword from "./pages/auth/NewPassword";

import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Chat from "./pages/Chat";
import WalletPage from "./pages/WalletPage";
import Shipping from "./pages/Shipping";
import Currency from "./pages/Currency";
import Documents from "./pages/Documents";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import Reviews from "./pages/Reviews";
import Disputes from "./pages/Disputes";
import Security from "./pages/Security";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function LayoutRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function LandingRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <Landing />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingRedirect />} />
              <Route path="/auth/signin" element={<AuthRedirect><SignIn /></AuthRedirect>} />
              <Route path="/auth/signup" element={<AuthRedirect><SignUp /></AuthRedirect>} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password" element={<NewPassword />} />

              {/* Protected routes */}
              <Route path="/" element={<LayoutRoute><Dashboard /></LayoutRoute>} />
              <Route path="/marketplace" element={<LayoutRoute><Marketplace /></LayoutRoute>} />
              <Route path="/orders" element={<LayoutRoute><Orders /></LayoutRoute>} />
              <Route path="/cart" element={<LayoutRoute><Cart /></LayoutRoute>} />
              <Route path="/checkout" element={<LayoutRoute><Checkout /></LayoutRoute>} />
              <Route path="/chat" element={<LayoutRoute><Chat /></LayoutRoute>} />
              <Route path="/wallet" element={<LayoutRoute><WalletPage /></LayoutRoute>} />
              <Route path="/shipping" element={<LayoutRoute><Shipping /></LayoutRoute>} />
              <Route path="/currency" element={<LayoutRoute><Currency /></LayoutRoute>} />
              <Route path="/documents" element={<LayoutRoute><Documents /></LayoutRoute>} />
              <Route path="/ai-assistant" element={<LayoutRoute><AIAssistant /></LayoutRoute>} />
              <Route path="/analytics" element={<LayoutRoute><Analytics /></LayoutRoute>} />
              <Route path="/reviews" element={<LayoutRoute><Reviews /></LayoutRoute>} />
              <Route path="/disputes" element={<LayoutRoute><Disputes /></LayoutRoute>} />
              <Route path="/security" element={<LayoutRoute><Security /></LayoutRoute>} />
              <Route path="/notifications" element={<LayoutRoute><Notifications /></LayoutRoute>} />
              <Route path="/settings" element={<LayoutRoute><SettingsPage /></LayoutRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
