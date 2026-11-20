import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AlertCircle, Settings, ExternalLink } from 'lucide-react';
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

// Configuration check
const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function ConfigError() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 border border-slate-100">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Konfigurasi Belum Lengkap</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Aplikasi memerlukan kredensial Supabase untuk berfungsi. Silakan tambahkan variabel lingkungan berikut di dashboard Vercel atau file .env Anda.
          </p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 text-left space-y-3 font-mono text-xs border border-slate-100">
          <div className="flex items-center justify-between text-slate-400 uppercase tracking-widest text-[10px] font-bold">
            <span>Required Variables</span>
            <Settings className="w-3 h-3" />
          </div>
          <div className="space-y-1">
            <p className="text-red-500">VITE_SUPABASE_URL</p>
            <p className="text-red-500">VITE_SUPABASE_ANON_KEY</p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <a 
            href="https://vercel.com/docs/projects/environment-variables" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-red-100"
          >
            Cara Set di Vercel <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
            Setelah ditambahkan, lakukan redeploy aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  if (!isSupabaseConfigured) {
    return <ConfigError />;
  }

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

