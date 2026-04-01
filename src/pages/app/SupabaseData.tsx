import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  Code,
  Table as TableIcon,
  Copy,
  ChevronDown
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

type TableType = 'students' | 'attendance_employee' | 'attendance_students' | 'profiles';

export default function SupabaseData() {
  const [activeTab, setActiveTab] = useState<'data' | 'schema'>('data');
  const [activeTable, setActiveTable] = useState<TableType>('students');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newStudent, setNewStudent] = useState({ nis: '', name: '', kelas: '', jurusan: '' });
  const [actionStatus, setActionStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    if (activeTab === 'data') {
      fetchData();
    }
  }, [activeTable, activeTab]);

  const fetchData = async () => {
    const isConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!isConfigured) {
      setLoading(false);
      setError('Konfigurasi Supabase belum lengkap. Silakan tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di menu Secrets.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: result, error } = await supabase
        .from(activeTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setData(result || []);
    } catch (err: any) {
      console.error(`Error fetching ${activeTable}:`, err);
      setError(err.message || `Gagal mengambil data dari tabel "${activeTable}". Pastikan tabel sudah dibuat di Supabase.`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      alert('Konfigurasi Supabase belum lengkap.');
      return;
    }
    setActionStatus('loading');
    try {
      const { error } = await supabase
        .from('students')
        .insert([newStudent]);

      if (error) throw error;
      
      setNewStudent({ nis: '', name: '', kelas: '', jurusan: '' });
      setIsAdding(false);
      setActionStatus('success');
      fetchData();
      setTimeout(() => setActionStatus('idle'), 3000);
    } catch (err: any) {
      alert('Error adding student: ' + err.message);
      setActionStatus('idle');
    }
  };

  const handleDelete = async (id: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      alert('Konfigurasi Supabase belum lengkap.');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      const { error } = await supabase
        .from(activeTable)
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const filteredData = data.filter(item => {
    const searchStr = searchTerm.toLowerCase();
    if (activeTable === 'students') {
      return item.name?.toLowerCase().includes(searchStr) || item.nis?.includes(searchStr);
    }
    if (activeTable === 'profiles') {
      return item.name?.toLowerCase().includes(searchStr) || item.email?.toLowerCase().includes(searchStr);
    }
    return true;
  });

  const sqlSchema = `-- 1. Create Profiles Table (Linked to Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text not null,
  role text check (role in ('admin', 'guru', 'staff')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Students Table
create table students (
  id uuid default gen_random_uuid() primary key,
  nis text unique not null,
  name text not null,
  kelas text not null,
  jurusan text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Employee Attendance Table
create table attendance_employee (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  user_name text not null,
  role text not null,
  type text check (type in ('masuk', 'pulang')) not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  date date default current_date not null
);

-- 4. Create Student Attendance Table
create table attendance_students (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references students(id) on delete cascade not null,
  student_name text not null,
  kelas text not null,
  status text check (status in ('hadir', 'izin', 'sakit', 'alfa')) not null,
  date date default current_date not null,
  recorded_by uuid references profiles(id) not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="text-primary w-6 h-6" />
            Supabase Full Database
          </h1>
          <p className="text-slate-500 text-sm">Integrasi database relasional lengkap dengan Supabase PostgreSQL.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('data')}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'data' ? "bg-primary text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Data Explorer
          </button>
          <button 
            onClick={() => setActiveTab('schema')}
            className={clsx(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              activeTab === 'schema' ? "bg-primary text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <Code className="w-3.5 h-3.5" />
            SQL Schema
          </button>
        </div>
      </div>

      {activeTab === 'data' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            {(['students', 'attendance_employee', 'attendance_students', 'profiles'] as TableType[]).map((table) => (
              <button
                key={table}
                onClick={() => setActiveTable(table)}
                className={clsx(
                  "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                  activeTable === table 
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary"
                )}
              >
                {table.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-800">Tabel Tidak Ditemukan / Belum Dikonfigurasi</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {error}. <br />
                  Silakan buka tab <strong>SQL Schema</strong> untuk menyalin kode pembuatan tabel dan jalankan di SQL Editor Supabase Anda.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={`Cari di ${activeTable}...`}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchData}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className={clsx("w-5 h-5", loading && "animate-spin")} />
                </button>
                {activeTable === 'students' && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-red-100 hover:scale-105 transition-transform text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    {activeTable === 'students' && (
                      <>
                        <th className="px-6 py-4">NIS</th>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Kelas</th>
                        <th className="px-6 py-4">Jurusan</th>
                      </>
                    )}
                    {activeTable === 'attendance_employee' && (
                      <>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Tipe</th>
                        <th className="px-6 py-4">Waktu</th>
                      </>
                    )}
                    {activeTable === 'attendance_students' && (
                      <>
                        <th className="px-6 py-4">Siswa</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Dicatat Oleh</th>
                      </>
                    )}
                    {activeTable === 'profiles' && (
                      <>
                        <th className="px-6 py-4">Nama</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                      </>
                    )}
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-medium">Memuat data...</p>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center">
                        <Database className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-400">Tidak ada data</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        {activeTable === 'students' && (
                          <>
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.nis}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                            <td className="px-6 py-4 text-slate-600">{item.kelas}</td>
                            <td className="px-6 py-4 text-slate-500">{item.jurusan}</td>
                          </>
                        )}
                        {activeTable === 'attendance_employee' && (
                          <>
                            <td className="px-6 py-4 font-bold text-slate-700">{item.user_name}</td>
                            <td className="px-6 py-4 text-slate-500 uppercase text-[10px] font-bold">{item.role}</td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                item.type === 'masuk' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              )}>
                                {item.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(item.timestamp).toLocaleString('id-ID')}</td>
                          </>
                        )}
                        {activeTable === 'attendance_students' && (
                          <>
                            <td className="px-6 py-4 font-bold text-slate-700">{item.student_name}</td>
                            <td className="px-6 py-4">
                              <span className={clsx(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                item.status === 'hadir' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                              )}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                            <td className="px-6 py-4 text-xs text-slate-400">{item.recorded_by}</td>
                          </>
                        )}
                        {activeTable === 'profiles' && (
                          <>
                            <td className="px-6 py-4 font-bold text-slate-700">{item.name}</td>
                            <td className="px-6 py-4 text-slate-500">{item.email}</td>
                            <td className="px-6 py-4 uppercase text-[10px] font-bold text-primary">{item.role}</td>
                          </>
                        )}
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 relative group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 text-xs font-mono text-slate-500">supabase_schema.sql</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(sqlSchema);
                    alert('SQL Schema disalin ke clipboard!');
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Copy SQL"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed custom-scrollbar max-h-[600px]">
                {sqlSchema}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Cara Setup
              </h3>
              <ol className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">1</span>
                  <span>Buka <strong>SQL Editor</strong> di dashboard Supabase Anda.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">2</span>
                  <span>Salin kode SQL di samping dan tempelkan ke editor.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">3</span>
                  <span>Klik <strong>Run</strong> untuk membuat semua tabel dan relasi.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">4</span>
                  <span>Pastikan <strong>RLS</strong> sudah aktif untuk keamanan data.</span>
                </li>
              </ol>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-emerald-900 text-sm">Keuntungan Relasional</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Dengan menggunakan PostgreSQL di Supabase, data Anda memiliki integritas referensial. 
                Misalnya, absensi tidak bisa dicatat untuk siswa yang tidak terdaftar (Foreign Key constraint).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal (Simplified for demo) */}
      {isAdding && activeTable === 'students' && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6">Tambah Data Siswa</h2>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIS</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Contoh: 2021001"
                  value={newStudent.nis}
                  onChange={(e) => setNewStudent({...newStudent, nis: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Contoh: Budi Santoso"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kelas</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="XII RPL 1"
                    value={newStudent.kelas}
                    onChange={(e) => setNewStudent({...newStudent, kelas: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jurusan</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="RPL"
                    value={newStudent.jurusan}
                    onChange={(e) => setNewStudent({...newStudent, jurusan: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={actionStatus === 'loading'}
                  className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-red-100 hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {actionStatus === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Data berhasil disimpan ke Supabase!</span>
        </motion.div>
      )}
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
