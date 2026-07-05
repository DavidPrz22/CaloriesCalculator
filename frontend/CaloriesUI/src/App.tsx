import './App.css'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "sonner";
import { useEffect } from "react";

import Home from './pages/home'
import Foods from './pages/foods'
import Results from './pages/results'
import Consumption from './pages/consumption'
import NotFound from './pages/notfound'
import AuthPage from './pages/auth'

import { RequireAuth, useAuthStore } from "@/features/UserAuth";

const queryClient = new QueryClient();

function AuthInitializer() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return null;
}

function App() {

  return (
    
  <QueryClientProvider client={queryClient}>
    <AuthInitializer />
    <I18nProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/foods" element={
                <Foods/>
            } />
            <Route path="/results" element={<Results/>} />
            <Route path="/consumption" element={
              <RequireAuth>
                <Consumption/>
              </RequireAuth>
            } />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </BrowserRouter>
      <Toaster richColors position="top-center" />
    </I18nProvider>
  </QueryClientProvider>
  )
}

export default App
