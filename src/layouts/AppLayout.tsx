import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  FileText, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Loader2,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const MENU_ITEMS = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'guru', 'staff'] },
  { path: '/app/absensi-karyawan', icon: UserCheck, label: 'Absensi Karyawan', roles: ['admin', 'guru', 'staff'] },
  { path: '/app/absensi-siswa', icon: GraduationCap, label: 'Absensi Siswa', roles: ['admin', 'guru'] },
  { path: '/app/rekap', icon: FileText, label: 'Rekap Absensi', roles: ['admin', 'guru'] },
  { path: '/app/data-siswa', icon: Users, label: 'Data Siswa', roles: ['admin'] },
  { path: '/app/supabase-data', icon: Database, label: 'Supabase Data', roles: ['admin'] },
  { path: '/app/users', icon: Settings, label: 'User Management', roles: ['admin'] },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading, isAdmin, isGuru, isStaff } = useAuth();

  // Responsive sidebar logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const userRole = profile?.role || 'staff';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 288 : 64 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 lg:static overflow-hidden flex flex-col"
      >
        <div className={clsx(
          "h-20 flex items-center border-b border-slate-100 flex-shrink-0",
          sidebarOpen ? "px-6" : "justify-center"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={clsx(
              "bg-primary rounded-lg flex-shrink-0 flex items-center justify-center shadow-lg shadow-red-100",
              sidebarOpen ? "w-10 h-10" : "w-10 h-10 mx-auto"
            )}>
              <GraduationCap className="text-gold w-6 h-6" />
            </div>
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  <h1 className="font-bold text-sm text-primary leading-tight">SMK PRIMA</h1>
                  <p className="text-[10px] font-bold text-accent tracking-widest">UNGGUL</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className={clsx("space-y-4 flex-1 overflow-y-auto overflow-x-hidden", sidebarOpen ? "p-4" : "p-3")}>
          {MENU_ITEMS.filter(item => item.roles.includes(userRole)).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center rounded-xl transition-all group relative justify-center",
                  sidebarOpen ? "gap-4 px-4 py-3 justify-start" : "w-10 h-10 p-0 mx-auto",
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-red-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-gold" : "group-hover:text-primary")} />
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && sidebarOpen && <ChevronRight className="w-4 h-4 ml-auto opacity-50 flex-shrink-0" />}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={clsx("p-4 border-t border-slate-100 flex-shrink-0", !sidebarOpen && "px-2")}>
          <button 
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className={clsx(
              "w-full flex items-center text-slate-500 hover:bg-red-50 hover:text-primary rounded-xl transition-all group",
              sidebarOpen ? "gap-4 px-4 py-3" : "justify-center p-3"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-semibold text-sm whitespace-nowrap"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Backdrop for mobile/tablet */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={clsx(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        "pl-16 lg:pl-0" // Account for fixed mini-sidebar on mobile/tablet
      )}>
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h2 className="font-bold text-slate-800 hidden sm:block">
              {MENU_ITEMS.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{profile?.name || 'User'}</p>
                <p className="text-[10px] font-bold text-accent uppercase tracking-wider">{profile?.role || 'Staff'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid || 'User'}`} alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
