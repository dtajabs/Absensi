export type UserRole = 'admin' | 'guru' | 'staff';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  kelas: string;
  jurusan: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  role: UserRole;
  type: 'masuk' | 'pulang';
  timestamp: string;
  date: string; // YYYY-MM-DD
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  studentName: string;
  kelas: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alfa';
  date: string;
  recordedBy: string; // Guru UID
  timestamp: string;
}
