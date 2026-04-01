import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Check, X, Clock, AlertCircle, Save, GraduationCap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Student } from '../../types';
import { format } from 'date-fns';
import { clsx } from 'clsx';

export default function StudentAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState('');
  const [kelasList, setKelasList] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const formattedData = data.map(s => ({
        id: s.id,
        nis: s.nis,
        name: s.name,
        kelas: s.kelas,
        jurusan: s.jurusan
      })) as Student[];
      
      setStudents(formattedData);
      
      const uniqueKelas = Array.from(new Set(formattedData.map(s => s.kelas))).sort();
      setKelasList(uniqueKelas);
      if (uniqueKelas.length > 0) setSelectedKelas(uniqueKelas[0]);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const filteredStudents = students.filter(s => s.kelas === selectedKelas);
      
      const attendanceData = filteredStudents.map(student => ({
        student_id: student.id,
        student_name: student.name,
        kelas: student.kelas,
        status: attendance[student.id] || 'hadir',
        date: today,
        recorded_by: user.id
      }));

      const { error } = await supabase
        .from('attendance_students')
        .insert(attendanceData);

      if (error) throw error;
      
      alert('Absensi berhasil disimpan!');
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const currentStudents = students.filter(s => s.kelas === selectedKelas);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Absensi Siswa</h1>
          <p className="text-slate-500">Pilih kelas dan catat kehadiran siswa hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
          >
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button 
            onClick={handleSave}
            disabled={saving || loading || currentStudents.length === 0}
            className="btn-primary px-6 disabled:opacity-70"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Simpan Absensi</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NIS</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Siswa</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{student.nis}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-primary flex items-center justify-center font-bold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {[
                          { id: 'hadir', label: 'H', color: 'bg-emerald-500', icon: Check },
                          { id: 'sakit', label: 'S', color: 'bg-amber-500', icon: Clock },
                          { id: 'izin', label: 'I', color: 'bg-blue-500', icon: AlertCircle },
                          { id: 'alfa', label: 'A', color: 'bg-red-500', icon: X },
                        ].map((status) => (
                          <button
                            key={status.id}
                            onClick={() => handleStatusChange(student.id, status.id)}
                            className={clsx(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                              (attendance[student.id] || 'hadir') === status.id
                                ? `${status.color} border-transparent text-white shadow-lg`
                                : "border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                            title={status.id.toUpperCase()}
                          >
                            <span className="font-bold text-xs">{status.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {currentStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                      Tidak ada data siswa di kelas ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Ringkasan Sementara</h4>
          <p className="text-xs text-blue-700">
            Hadir: {Object.values(attendance).filter(v => v === 'hadir').length} | 
            Sakit: {Object.values(attendance).filter(v => v === 'sakit').length} | 
            Izin: {Object.values(attendance).filter(v => v === 'izin').length} | 
            Alfa: {Object.values(attendance).filter(v => v === 'alfa').length}
          </p>
        </div>
      </div>
    </div>
  );
}
