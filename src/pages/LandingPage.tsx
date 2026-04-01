import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, CheckCircle, ArrowRight, GraduationCap } from 'lucide-react';

const JURUSAN = [
  { id: 'TKJ', name: 'Teknik Komputer & Jaringan', desc: 'Mempelajari infrastruktur jaringan, server, dan keamanan siber.' },
  { id: 'DKV', name: 'Desain Komunikasi Visual', desc: 'Fokus pada kreativitas visual, desain grafis, dan multimedia.' },
  { id: 'BC', name: 'Broadcasting', desc: 'Dunia pertelevisian, produksi konten, dan teknik penyiaran.' },
  { id: 'AK', name: 'Akuntansi', desc: 'Manajemen keuangan, perpajakan, dan audit profesional.' },
  { id: 'MPLB', name: 'Manajemen Perkantoran & Layanan Bisnis', desc: 'Administrasi modern dan layanan bisnis prima.' },
  { id: 'BD', name: 'Bisnis Digital', desc: 'Pemasaran online, e-commerce, dan strategi bisnis masa depan.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
              <GraduationCap className="text-gold w-8 h-8" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-primary">SMK PRIMA UNGGUL</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Excellence in Education</p>
            </div>
          </div>
          <Link to="/login" className="btn-primary">
            Login Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-red-50 text-primary rounded-full text-sm font-bold mb-6 border border-red-100">
              Pendaftaran Tahun Ajaran 2026/2027 Telah Dibuka
            </span>
            <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              Membangun Generasi <span className="text-primary italic">Unggul</span> & Berkarakter
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              SMK Prima Unggul berkomitmen mencetak lulusan yang siap kerja, inovatif, dan memiliki integritas tinggi di era digital.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary px-8 py-4 text-lg">
                Mulai Absensi <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="px-8 py-4 rounded-lg border-2 border-slate-200 font-bold hover:bg-slate-50 transition-colors">
                Profil Sekolah
              </button>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary to-red-900 overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://picsum.photos/seed/school/800/800" 
                alt="SMK Prima Unggul" 
                className="w-full h-full object-cover mix-blend-overlay opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="text-center text-white">
                  <Award className="w-20 h-20 text-gold mx-auto mb-6" />
                  <h3 className="text-3xl font-bold mb-2">Terakreditasi A</h3>
                  <p className="text-white/80">Standar Pendidikan Nasional Berkualitas Tinggi</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gold rounded-full blur-3xl opacity-30 z-0"></div>
            <div className="absolute -top-6 -left-6 w-48 h-48 bg-primary rounded-full blur-3xl opacity-20 z-0"></div>
          </motion.div>
        </div>
      </section>

      {/* Jurusan Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-4">6 Jurusan Unggulan</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Pilih jalur masa depanmu dengan kurikulum yang disesuaikan dengan kebutuhan industri terkini.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {JURUSAN.map((j, idx) => (
              <motion.div 
                key={j.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-red-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="text-xl font-bold">{j.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{j.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{j.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          <div className="text-center">
            <div className="text-4xl lg:text-6xl font-black text-gold mb-2">1500+</div>
            <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Siswa Aktif</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-6xl font-black text-gold mb-2">80+</div>
            <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Guru Ahli</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-6xl font-black text-gold mb-2">200+</div>
            <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Mitra Industri</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-6xl font-black text-gold mb-2">95%</div>
            <div className="text-white/70 uppercase tracking-widest text-xs font-bold">Lulusan Bekerja</div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-8 border-white rounded-full"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-primary w-8 h-8" />
            <span className="font-bold text-slate-900">SMK PRIMA UNGGUL</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 SMK Prima Unggul. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-primary">Facebook</a>
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
