import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/app/Dashboard';
import EmployeeAttendance from './pages/app/EmployeeAttendance';
import StudentAttendance from './pages/app/StudentAttendance';
import AttendanceRecap from './pages/app/AttendanceRecap';
import StudentData from './pages/app/StudentData';
import UserManagement from './pages/app/UserManagement';
import SupabaseData from './pages/app/SupabaseData';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
          <Route path="absensi-siswa" element={<StudentAttendance />} />
          <Route path="rekap" element={<AttendanceRecap />} />
          <Route path="data-siswa" element={<StudentData />} />
          <Route path="supabase-data" element={<SupabaseData />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

