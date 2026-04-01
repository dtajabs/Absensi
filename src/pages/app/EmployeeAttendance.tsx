import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, CheckCircle2, AlertCircle, LogIn, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';

export default function EmployeeAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [lastAttendance, setLastAttendance] = useState<any>(null);
  const { profile, user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchLastAttendance();
    return () => clearInterval(timer);
  }, [user]);

  const fetchLastAttendance = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('attendance_employee')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      if (data && data.length > 0) {
        setLastAttendance(data[0]);
      }
    } catch (err) {
      console.error('Error fetching last attendance:', err);
    }
  };

  const handleAttendance = async (type: 'masuk' | 'pulang') => {
    if (!user || !profile) return;
    
    setStatus('loading');
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { error } = await supabase
        .from('attendance_employee')
        .insert([{
          user_id: user.id,
          user_name: profile.name,
          role: profile.role,
          type,
          date: today,
        }]);
      
      if (error) throw error;
      
      setStatus('success');
      fetchLastAttendance();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Attendance error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Absensi Mandiri Karyawan</h1>
        <p className="text-slate-500">Silakan lakukan absensi sesuai dengan waktu kerja Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-primary rounded-full text-xs font-bold border border-red-100 uppercase tracking-widest">
            Waktu Server
          </div>
          
          <div className="space-y-1">
            <div className="text-6xl font-black text-slate-900 tracking-tighter">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-slate-500 font-medium">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAttendance('masuk')}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-all group"
            >
              <LogIn className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Absen Masuk</span>
            </button>
            <button 
              onClick={() => handleAttendance('pulang')}
              disabled={status === 'loading'}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-500 hover:text-white transition-all group disabled:opacity-50"
            >
              <LogOut className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold">Absen Pulang</span>
            </button>
          </div>

          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              Absensi Berhasil Dicatat!
            </motion.div>
          )}

          {lastAttendance && (
            <div className="pt-4 border-t border-slate-50">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Aktivitas Terakhir</p>
              <p className="text-sm font-bold text-slate-700">
                {lastAttendance.type === 'masuk' ? 'Masuk' : 'Pulang'} pada {lastAttendance.timestamp ? format(new Date(lastAttendance.timestamp), 'HH:mm:ss') : '-'}
              </p>
            </div>
          )}
        </motion.div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Lokasi Presensi
            </h3>
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/map/400/200" 
                alt="Map" 
                className="w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700">Dalam Radius Sekolah</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              Pastikan Anda berada dalam radius 100 meter dari titik koordinat SMK Prima Unggul untuk melakukan absensi.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              Informasi Penting
            </h3>
            <ul className="text-xs text-amber-700 space-y-2 list-disc list-inside">
              <li>Batas waktu absen masuk: 07:15 WIB</li>
              <li>Batas waktu absen pulang: 15:30 WIB</li>
              <li>Keterlambatan akan tercatat otomatis oleh sistem</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
