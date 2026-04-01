import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon, 
  User, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle,
  Loader2,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface EmployeeAttendance {
  id: string;
  userId: string;
  userName: string;
  type: 'masuk' | 'pulang';
  timestamp: string;
  date: string;
}

interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  status: string;
  date: string;
  timestamp: string;
}

export default function AttendanceRecap() {
  const [activeTab, setActiveTab] = useState<'employee' | 'student'>('employee');
  const [employeeData, setEmployeeData] = useState<EmployeeAttendance[]>([]);
  const [studentData, setStudentData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'employee') {
        const { data, error } = await supabase
          .from('attendance_employee')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        setEmployeeData(data.map(item => ({
          id: item.id,
          userId: item.user_id,
          userName: item.user_name,
          type: item.type,
          timestamp: item.timestamp,
          date: item.date
        })));
      } else {
        const { data, error } = await supabase
          .from('attendance_students')
          .select('*')
          .order('timestamp', { ascending: false });
        
        if (error) throw error;
        setStudentData(data.map(item => ({
          id: item.id,
          studentId: item.student_id,
          studentName: item.student_name,
          kelas: item.kelas,
          status: item.status,
          date: item.date,
          timestamp: item.timestamp
        })));
      }
    } catch (err) {
      console.error('Error fetching recap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployeeData = employeeData.filter(item => 
    item.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || item.type === filterStatus)
  );

  const filteredStudentData = studentData.filter(item => 
    item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === 'all' || item.status === filterStatus)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rekap Absensi</h1>
          <p className="text-slate-500">Laporan kehadiran harian dan bulanan SMK Prima Unggul.</p>
        </div>
        <button className="btn-primary px-6">
          <Download className="w-4 h-4" /> Export Laporan (Excel)
        </button>
      </div>

      <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-200 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('employee')}
          className={clsx(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
            activeTab === 'employee' ? "bg-primary text-white shadow-lg shadow-red-100" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Users className="w-4 h-4" /> Absensi Karyawan
        </button>
        <button 
          onClick={() => setActiveTab('student')}
          className={clsx(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
            activeTab === 'student' ? "bg-primary text-white shadow-lg shadow-red-100" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <GraduationCap className="w-4 h-4" /> Absensi Siswa
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Cari ${activeTab === 'employee' ? 'karyawan' : 'siswa'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Status</option>
              {activeTab === 'employee' ? (
                <>
                  <option value="masuk">Masuk</option>
                  <option value="pulang">Pulang</option>
                </>
              ) : (
                <>
                  <option value="hadir">Hadir</option>
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                  <option value="alfa">Alfa</option>
                </>
              )}
            </select>
            <button className="btn-secondary py-2 px-4">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {activeTab === 'employee' ? (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTab === 'employee' ? (
                  filteredEmployeeData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{item.userName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.timestamp ? format(new Date(item.timestamp), 'HH:mm') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          item.type === 'masuk' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {item.type === 'masuk' ? 'Masuk' : 'Pulang'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredStudentData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{item.studentName}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.kelas}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          item.status === 'hadir' && "bg-emerald-50 text-emerald-600",
                          item.status === 'sakit' && "bg-amber-50 text-amber-600",
                          item.status === 'izin' && "bg-blue-50 text-blue-600",
                          item.status === 'alfa' && "bg-red-50 text-red-600"
                        )}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {((activeTab === 'employee' && filteredEmployeeData.length === 0) || 
                  (activeTab === 'student' && filteredStudentData.length === 0)) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
