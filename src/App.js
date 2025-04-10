import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './Shared/authContext/authContext';
import ProtectedRoute from './Shared/Routes/protectedRoutes';
import { ToastContainer } from 'react-toastify';
import './App.css';
import MainDashboard from './Component/DashboardComponent/MainDashboard';
import EmailVerification from './Pages/EmailVerification';
import LocalAdmins from './Component/DashboardComponent/LocalAdmins';

const HomePage = lazy(() => import('./Pages/HomePage'));
const Login = lazy(() => import('./Pages/Login'));
const Register = lazy(() => import('./Pages/Register'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const Car = lazy(() => import('./Component/DashboardComponent/Car'));
const Location = lazy(() => import('./Component/DashboardComponent/Location'));
const ParkingHistory = lazy(() => import('./Component/DashboardComponent/ParkingHistory'));
const Payment = lazy(() => import('./Component/DashboardComponent/Payment'));
const Penalties = lazy(() => import('./Component/DashboardComponent/Panelties'));
const Reservations = lazy(() => import('./Component/DashboardComponent/reservation'));
const Users = lazy(() => import('./Component/DashboardComponent/Users'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/emailverification" element={<EmailVerification />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }>
              <Route path="" element={<MainDashboard />} />
              <Route path="cars" element={<Car />} />
              <Route path="locations" element={<Location />} />
              <Route path="parking-history" element={<ParkingHistory />} />
              <Route path="payments" element={<Payment />} />
              <Route path="penalties" element={<Penalties />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="users" element={<Users />} />
              <Route path="localadmins" element={<LocalAdmins />} />
              <Route path="*" element={<Navigate to="/dashboard/cars" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
