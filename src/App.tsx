import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { useAuthStore } from '@/stores/authStore';


// Pages
import PricingPage from '@/pages/PricingPage';
import { DashboardRouter } from '@/pages/DashboardRouter';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import NotFound from '@/pages/NotFound';
import CompanyHomePage from '@/pages/CompanyHomePage';
import ProductsPageComponent from '@/pages/ProductsPage';
import OrreryPageComponent from '@/pages/OrreryPage';
import SubscriptionListPage from '@/pages/SubscriptionPage';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';
import { AdminDashboard } from '@/pages/AdminDashboard';
import AboutPage from "@/pages/AboutPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import SecurityPage from "@/pages/SecurityPage";
import Contact from "@/pages/Contact";



const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirect if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<CompanyHomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              
              {/* Products Routes */}
              <Route path="/products" element={<ProductsPageComponent />} />
              <Route path="/products/orrery" element={<OrreryPageComponent />} />

              {/* Auth Routes */}
              <Route 
                path="/auth/login" 
                element={
                  <PublicRoute>
                    <LoginForm />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/auth/signup" 
                element={
                  <PublicRoute>
                    <SignupForm />
                  </PublicRoute>
                } 
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usage"
                element={
                  <ProtectedRoute>
                    <UsagePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <ProtectedRoute>
                    <BillingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <PricingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <SubscriptionListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={<AdminDashboard />}
              />
              <Route
                path="/admin/login"
                element={<AdminLoginForm />}
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};





const UsagePage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Usage Page</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

const BillingPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Billing Page</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  </div>
);



export default App;