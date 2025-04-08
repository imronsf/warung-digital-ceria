
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import KasirPage from "./pages/KasirPage";
import ProductPage from "./pages/ProductPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import ReportPage from "./pages/ReportPage";
import UserPage from "./pages/UserPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/kasir" /> : <Login />}
            />
            
            {/* Protected routes */}
            <Route
              path="/" 
              element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
            >
              <Route index element={<Navigate to="/kasir" />} />
              <Route path="kasir" element={<KasirPage />} />
              <Route path="produk" element={<ProductPage />} />
              <Route path="riwayat" element={<TransactionHistoryPage />} />
              <Route path="laporan" element={<ReportPage />} />
              <Route path="pengguna" element={<UserPage />} />
              <Route path="pengaturan" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
