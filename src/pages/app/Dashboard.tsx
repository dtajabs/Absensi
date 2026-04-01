import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Clock, 
  Loader2,
  ArrowRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalStudents: 0,
    employeeAttendance: 0,
    studentAttendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch totals
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: studentsCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });
      
      // Fetch today's attendance
      const { count: empAttendanceCount } = await supabase
        .from('attendance_employee')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('type', 'masuk');
      
      const { count: stuAttendanceCount } = await supabase
        .from('attendance_students')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'hadir');

      setStats({
        totalEmployees: usersCount || 0,
        totalStudents: studentsCount || 0,
        employeeAttendance: empAttendanceCount || 0,
        studentAttendance: stuAttendanceCount || 0,
      });

      // Fetch recent activity
      const { data: recentData } = await supabase
        .from('attendance_employee')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (recentData) {
        setRecentActivity(recentData.map(item => ({
          id: item.id,
          userName: item.user_name,
          type: item.type,
          timestamp: item.timestamp
        })));
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    { label: 'Total Karyawan', value: stats.totalEmployees.toString(), icon: Users, color: 'bg-blue-500', trend: 'Aktif' },
    { label: 'Total Siswa', value: stats.totalStudents.toString(), icon: GraduationCap, color: 'bg-primary', trend: 'Terdaftar' },
    { label: 'Kehadiran Karyawan', value: stats.employeeAttendance.toString(), icon: UserCheck, color: 'bg-emerald-500', trend: 'Hari ini' },
    { label: 'Kehadiran Siswa', value: stats.studentAttendance.toString(), icon: Clock, color: 'bg-amber-500', trend: 'Hari ini' },
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Selamat datang kembali di Panel Administrasi SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <CalendarIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-slate-700">{format(new Date(), 'dd MMMM yyyy')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={clsx("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Aktivitas Terbaru</h2>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{activity.userName}</p>
                      <p className="text-xs text-slate-500">
                        {activity.type === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'} • {activity.timestamp ? format(new Date(activity.timestamp), 'HH:mm') : '-'} WIB
                      </p>
                    </div>
                  </div>
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                    activity.type === 'masuk' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {activity.type === 'masuk' ? 'Masuk' : 'Pulang'}
                  </span>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  Belum ada aktivitas hari ini.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-red-100">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Pengumuman Sekolah</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-gold mb-1">{format(new Date(), 'dd MMM yyyy').toUpperCase()}</p>
                <p className="text-sm font-medium">Rapat Koordinasi Persiapan Ujian Tengah Semester di Ruang Guru.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-gold mb-1">{format(new Date(), 'dd MMM yyyy').toUpperCase()}</p>
                <p className="text-sm font-medium">Kegiatan Kerja Bakti Lingkungan Sekolah untuk seluruh siswa.</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gold hover:text-red-900 transition-all">
              Semua Pengumuman
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute top-20 -left-10 w-24 h-24 bg-white/5 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
