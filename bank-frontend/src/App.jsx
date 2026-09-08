import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Transactions from "./pages/transactions";
import Transfer from "./pages/Transfer";
import Profile from "./pages/Profile";
import AdminRoute from "./Components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAccount from "./pages/admin/AdminAccount";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import AdminUsers from "./pages/admin/adminuser";
import ProtectedRoute from "./Components/ProtectedRoute";
import AccountDetails from "./pages/AccountDetails";
import Navbar from "./Components/Navbar";
import AIAssistant from "./Components/AiAssistant";
import AdminTransactions from "./pages/admin/AdminTransactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              <AIAssistant />
            </ProtectedRoute>
          }
        />
        <Route
  path="/deposit"
  element={
    <ProtectedRoute>
      <Deposit />
    </ProtectedRoute>
  }
/>
<Route
  path="/account/:id"
  element={<AccountDetails />}
/>
<Route
  path="/withdraw"
  element={
    <ProtectedRoute>
      <Withdraw />
    </ProtectedRoute>
  }
/>

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
             
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
             
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/users"
  element={
    <ProtectedRoute>
     
      <AdminUsers />
    </ProtectedRoute>
  }
/>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/transactions"
  element={
    <AdminRoute>
      <AdminTransactions />
    </AdminRoute>
  }
/>

        {/* Admin pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/accounts"
          element={
            <ProtectedRoute requiredRole="Admin">
              
              <AdminAccount />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;