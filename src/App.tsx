import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AdminAuthProvider } from "./contexts/AdminAuthContext"
import HomePage from "./pages/HomePage"
import LandingPage from "./pages/LandingPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import ScanPage from "./pages/ScanPage"
import DropPointsPage from "./pages/DropPointsPage"
import WalletPage from "./pages/WalletPage"
import RewardsPage from "./pages/RewardsPage"
import OnboardingPage from "./pages/OnboardingPage"
import SettingsPage from "./pages/SettingsPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminAnalytics from "./pages/admin/AdminAnalytics"
import AdminMonitor from "./pages/admin/AdminMonitor"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected user routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/drop-points" element={<DropPointsPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/monitor" element={<AdminMonitor />} />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
