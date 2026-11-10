import React, { useState, useEffect } from 'react';
import { sqliteStore } from '../../database/sqliteStore';
import { User, Student, Staff } from '../../types';
import { 
  GraduationCap, Lock, User as UserIcon, Mail, Phone, BookOpen, KeyRound, 
  ArrowRight, Eye, EyeOff, Fingerprint, ShieldCheck, CheckCircle2, 
  AlertCircle, Sparkles, School, Building2, UserCheck, HelpCircle
} from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (user: User, student?: Student, staff?: Staff) => void;
  onNavigate: (screen: string) => void;
  defaultRole?: 'STUDENT' | 'STAFF' | 'ADMIN';
}

export const LoginScreen: React.FC<AuthProps> = ({ onLoginSuccess, onNavigate, defaultRole = 'STUDENT' }) => {
  // Tab state: 'student' or 'faculty_admin'
  const [authPortal, setAuthPortal] = useState<'student' | 'faculty_admin'>(
    defaultRole === 'STUDENT' ? 'student' : 'faculty_admin'
  );

  // Student authentication state
  const [studentIdentifier, setStudentIdentifier] = useState(() => {
    const saved = localStorage.getItem('college_student_saved_id');
    if (!saved || saved === '920422104018') {
      return '927625MCA026';
    }
    return saved;
  });
  const [studentPassword, setStudentPassword] = useState('1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [recognizedStudent, setRecognizedStudent] = useState<Student | undefined>();

  // Faculty/Admin authentication state
  const [facultyIdentifier, setFacultyIdentifier] = useState('staff');
  const [facultyPassword, setFacultyPassword] = useState('1234');

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Registered students list for instant selector
  const [allStudents, setAllStudents] = useState<Student[]>(() => sqliteStore.getStudents());

  // Real-time student identification lookup as identifier changes
  useEffect(() => {
    if (authPortal === 'student' && studentIdentifier.trim()) {
      const match = sqliteStore.findStudentByIdentifier(studentIdentifier.trim());
      setRecognizedStudent(match);
    } else {
      setRecognizedStudent(undefined);
    }
  }, [studentIdentifier, authPortal]);

  // Handle Student Login Authentication
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!studentIdentifier.trim()) {
      setErrorMsg('Please enter your Register Number, Email, or Username.');
      return;
    }
    if (!studentPassword) {
      setErrorMsg('Please enter your student password.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      const authResult = sqliteStore.authenticateStudent(studentIdentifier.trim(), studentPassword);

      if (authResult.success && authResult.user && authResult.student) {
        // Handle Remember Me preference
        if (rememberMe) {
          localStorage.setItem('college_student_saved_id', studentIdentifier.trim());
        } else {
          localStorage.removeItem('college_student_saved_id');
        }

        setSuccessMsg(`Welcome, ${authResult.student.name}! Accessing student dashboard...`);
        setFailedAttempts(0);

        setTimeout(() => {
          setIsAuthenticating(false);
          onLoginSuccess(authResult.user!, authResult.student, undefined);
        }, 500);
      } else {
        setIsAuthenticating(false);
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 3) {
          setErrorMsg(`${authResult.message || 'Authentication failed.'} (3 failed attempts: You can use "Forgot Password" to reset credentials)`);
        } else {
          setErrorMsg(authResult.message || 'Invalid Register Number or Password.');
        }
      }
    }, 350);
  };

  // Handle Faculty/Admin Login
  const handleFacultyAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!facultyIdentifier.trim() || !facultyPassword) {
      setErrorMsg('Please enter your credentials');
      return;
    }

    setIsAuthenticating(true);
    setTimeout(() => {
      const result = sqliteStore.authenticateUser(facultyIdentifier.trim(), facultyPassword);
      setIsAuthenticating(false);

      if (result) {
        if (result.user.status === 'INACTIVE') {
          setErrorMsg('This account is deactivated. Contact the administrator.');
          return;
        }
        onLoginSuccess(result.user, result.student, result.staff);
      } else {
        setErrorMsg('Invalid staff/admin credentials.');
      }
    }, 350);
  };

  // Instant Biometric Touch ID authentication simulation for Students
  const handleBiometricAuth = () => {
    setErrorMsg('');
    setBiometricScanning(true);

    setTimeout(() => {
      const match = recognizedStudent || allStudents[0];
      const result = sqliteStore.authenticateStudentBiometric(match?.id);

      if (result.success && result.user && result.student) {
        setBiometricScanning(false);
        setSuccessMsg(`Touch ID Verified: ${result.student.name}`);
        setTimeout(() => {
          onLoginSuccess(result.user!, result.student, undefined);
        }, 500);
      } else {
        setBiometricScanning(false);
        setErrorMsg('Biometric verification failed. Please login with password.');
      }
    }, 700);
  };

  // 1-Tap Student Quick Filler
  const selectStudentAccount = (student: Student) => {
    setStudentIdentifier(student.registerNumber);
    setStudentPassword('1234');
    setRecognizedStudent(student);
    setErrorMsg('');
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col justify-between min-h-full bg-slate-50/70">
      <div>
        {/* College Header Branding */}
        <div className="text-center mt-2 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-800/25 mb-2.5">
            <GraduationCap size={30} />
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
            Campus Event Portal
          </h2>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            National Institute of Engineering & Technology
          </p>
        </div>

        {/* Portal Mode Tabs: Student Portal (Featured) vs Faculty/Admin */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-4 border border-slate-300/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setAuthPortal('student');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              authPortal === 'student'
                ? 'bg-white text-blue-700 shadow-md shadow-slate-300/50 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={15} />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthPortal('faculty_admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              authPortal === 'faculty_admin'
                ? 'bg-white text-indigo-700 shadow-md shadow-slate-300/50 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 size={14} />
            <span>Faculty &amp; Admin</span>
          </button>
        </div>

        {/* Error and Success Feedback Alerts */}
        {errorMsg && (
          <div className="mb-3.5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 shadow-sm animate-shake">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1 text-[11px] leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-3.5 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 shadow-sm">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="text-[11px] font-semibold">{successMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* STUDENT AUTHENTICATION FORM                                   */}
        {/* ============================================================== */}
        {authPortal === 'student' ? (
          <div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 mb-3">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Student Sign In</h3>
                    <p className="text-[10px] text-slate-400">Authenticate using College Credentials</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                  Student Verified
                </span>
              </div>

              <form onSubmit={handleStudentLogin} className="space-y-3">
                {/* Student Identifier Field: Register Number / Email / Username */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Register No. / Email / Username
                    </label>
                    <span className="text-[10px] text-slate-400">e.g. 927625MCA026</span>
                  </div>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={studentIdentifier}
                      onChange={e => setStudentIdentifier(e.target.value)}
                      placeholder="e.g. 927625MCA026 or student"
                      autoCapitalize="none"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 transition-colors"
                    />
                  </div>

                  {/* Real-Time Live Recognition Badge */}
                  {recognizedStudent && (
                    <div className="mt-1.5 p-1.5 px-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-1.5 truncate">
                        <UserCheck size={12} className="text-emerald-600 shrink-0" />
                        <span className="font-bold truncate">{recognizedStudent.name}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-emerald-700 truncate">{recognizedStudent.department}</span>
                      </div>
                      <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded text-emerald-900 border border-emerald-300 shrink-0 ml-1">
                        {recognizedStudent.registerNumber}
                      </span>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Student Password
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('forgotPassword')}
                      className="text-[11px] text-blue-700 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={studentPassword}
                      onChange={e => setStudentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me and Security Checkbox */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-[11px] font-medium text-slate-600">
                      Remember my Student ID
                    </span>
                  </label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-600" /> SSL 256-bit
                  </span>
                </div>

                {/* Primary Student Sign In Button */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Student Identity...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap size={15} />
                      <span>Authenticate Student Login</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                {/* Biometric Touch ID Quick Login Simulation */}
                <button
                  type="button"
                  onClick={handleBiometricAuth}
                  disabled={biometricScanning}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Fingerprint size={16} className={biometricScanning ? 'text-blue-600 animate-pulse' : 'text-slate-600'} />
                  <span>
                    {biometricScanning ? 'Scanning Fingerprint...' : 'Quick Touch ID / Fingerprint Auth'}
                  </span>
                </button>
              </form>
            </div>

            {/* Quick 1-Tap Student Profiles from Database */}
            <div className="bg-blue-50/70 border border-blue-200/60 rounded-2xl p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                  <Sparkles size={11} className="text-blue-600" /> Quick Select Registered Student
                </span>
                <span className="text-[10px] text-blue-600 font-mono">
                  {allStudents.length} Students
                </span>
              </div>
              <div className="space-y-1.5">
                {allStudents.map(st => {
                  const isSelected = studentIdentifier === st.registerNumber || studentIdentifier === st.email;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => selectStudentAccount(st)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-left border text-xs flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-sm text-blue-900 ring-1 ring-blue-400'
                          : 'bg-white/70 border-slate-200/80 hover:bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {st.name.charAt(0)}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-[11px] truncate leading-tight">{st.name}</p>
                          <p className="text-[9px] text-slate-500 truncate">{st.department} • {st.year}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {st.registerNumber}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* FACULTY & ADMIN AUTHENTICATION FORM                           */
          /* ============================================================== */
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 mb-3">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                👔
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800">Faculty &amp; Staff Login</h3>
                <p className="text-[10px] text-slate-400">Department Coordinators and System Administrators</p>
              </div>
            </div>

            <form onSubmit={handleFacultyAdminLogin} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Staff ID / Username / Email
                </label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={facultyIdentifier}
                    onChange={e => setFacultyIdentifier(e.target.value)}
                    placeholder="e.g. staff or STF-MCA-104"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    value={facultyPassword}
                    onChange={e => setFacultyPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to Staff Portal</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 text-center mb-2">
                Staff &amp; Admin 1-Tap Fill
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFacultyIdentifier('staff');
                    setFacultyPassword('1234');
                  }}
                  className="py-1.5 px-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
                >
                  👔 S.Priyadharshini (Staff)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFacultyIdentifier('admin');
                    setFacultyPassword('admin123');
                  }}
                  className="py-1.5 px-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-colors"
                >
                  👑 Administrator
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation: Student Registration and Portal Info */}
      <div className="pt-3 border-t border-slate-200/80 text-center">
        <p className="text-xs text-slate-600">
          New to the college?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-blue-700 font-bold hover:underline inline-flex items-center gap-0.5"
          >
            <span>Create Student Account</span>
            <ArrowRight size={12} />
          </button>
        </p>
        <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-center gap-1">
          <HelpCircle size={10} /> College Examination &amp; Event Cell • NIET Portal v2.4
        </p>
      </div>
    </div>
  );
};

// Also export StudentLoginScreen alias for modularity
export const StudentLoginScreen = LoginScreen;

export const SignupScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [department, setDepartment] = useState('Master of Computer Applications');
  const [year, setYear] = useState('Final Year (II)');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const departments = [
    'Master of Computer Applications',
    'Computer Science and Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Biotechnology',
    'Management Studies'
  ];

  const years = [
    'First Year (I)',
    'Second Year (II)',
    'Third Year (III)',
    'Final Year (IV)',
    'Postgraduate (PG)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !registerNumber || !email || !phone || !username || !password) {
      setMsg({ text: 'Please fill in all mandatory fields.', isError: true });
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setMsg({ text: 'Please enter a valid email address.', isError: true });
      return;
    }
    if (phone.length < 10) {
      setMsg({ text: 'Phone number must be at least 10 digits.', isError: true });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ text: 'Passwords do not match.', isError: true });
      return;
    }

    const res = sqliteStore.registerStudent({
      name,
      registerNumber,
      department,
      year,
      email,
      phone,
      username,
      password
    });

    if (res.success) {
      setMsg({ text: res.message, isError: false });
      setTimeout(() => onNavigate('login'), 1500);
    } else {
      setMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Student Sign Up</h2>
        <p className="text-xs text-slate-500">Register with your college credentials</p>
      </div>

      {msg && (
        <div className={`p-3 text-xs rounded-xl mb-4 border ${msg.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Full Student Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Monika Sivakumar"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Register No *</label>
            <input
              type="text"
              value={registerNumber}
              onChange={e => setRegisterNumber(e.target.value)}
              placeholder="927625MCA026"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Year of Study</label>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Department</label>
          <select
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="student@college.edu"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mobile Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Choose Username *</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="e.g. monika2026"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
        >
          Complete Student Registration
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full py-2 text-xs text-slate-600 hover:text-slate-900"
        >
          Cancel and Back to Login
        </button>
      </form>
    </div>
  );
};

export const ForgotPasswordScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [regNoOrEmail, setRegNoOrEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !newPass || !confirmPass) {
      setStatus({ text: 'Please fill in all fields', isError: true });
      return;
    }
    if (newPass !== confirmPass) {
      setStatus({ text: 'Passwords do not match', isError: true });
      return;
    }

    const ok = sqliteStore.resetPassword(identifier, regNoOrEmail || identifier, newPass);
    if (ok) {
      setStatus({ text: 'Password reset successful! You can now log in with your new password.', isError: false });
      setTimeout(() => onNavigate('login'), 1500);
    } else {
      setStatus({ text: 'No matching user or student record found.', isError: true });
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold text-slate-800 mb-1">Reset Password</h2>
      <p className="text-xs text-slate-500 mb-4">Verify your account details to set a new password</p>

      {status && (
        <div className={`p-3 text-xs rounded-xl mb-4 border ${status.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-3.5">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Username</label>
          <input
            type="text"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            placeholder="e.g. student"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Email or Register Number</label>
          <input
            type="text"
            value={regNoOrEmail}
            onChange={e => setRegNoOrEmail(e.target.value)}
            placeholder="e.g. 927625MCA026 or monikasivakumarm@gmail.com"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">New Password</label>
          <input
            type="password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Confirm New Password</label>
          <input
            type="password"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md mt-2"
        >
          Update Password
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full py-2 text-xs text-slate-600 hover:text-slate-900"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};
