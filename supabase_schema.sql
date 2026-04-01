-- 1. Create Profiles Table (Linked to Auth)
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
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table students enable row level security;
alter table attendance_employee enable row level security;
alter table attendance_students enable row level security;

-- Create Policies (Example: Allow all for now, but should be hardened)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Students are viewable by authenticated users." on students for select using (auth.role() = 'authenticated');
create policy "Admins can manage students." on students for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Users can view their own attendance." on attendance_employee for select using (auth.uid() = user_id);
create policy "Users can insert their own attendance." on attendance_employee for insert with check (auth.uid() = user_id);

create policy "Attendance records viewable by guru and admin." on attendance_students for select using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'guru'))
);
create policy "Guru and admin can insert student attendance." on attendance_students for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'guru'))
);
