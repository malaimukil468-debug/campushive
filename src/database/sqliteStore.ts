import { 
  User, Student, Staff, CollegeEvent, Registration, 
  Waitlist, Attendance, Feedback, Certificate, NotificationItem, ActivityLog,
  EventStatus
} from '../types';
import { notificationDispatcher } from '../utils/notificationSystem';

class SQLiteStore {
  private users: User[] = [];
  private students: Student[] = [];
  private staffMembers: Staff[] = [];
  private events: CollegeEvent[] = [];
  private registrations: Registration[] = [];
  private waitlist: Waitlist[] = [];
  private favorites: { id: number; studentId: number; eventId: number }[] = [];
  private attendanceList: Attendance[] = [];
  private feedbackList: Feedback[] = [];
  private certificates: Certificate[] = [];
  private notifications: NotificationItem[] = [];
  private activityLogs: ActivityLog[] = [];

  constructor() {
    this.loadFromStorage();
    if (this.users.length === 0) {
      this.seedInitialData();
    }
  }

  private saveToStorage() {
    const data = {
      users: this.users,
      students: this.students,
      staffMembers: this.staffMembers,
      events: this.events,
      registrations: this.registrations,
      waitlist: this.waitlist,
      favorites: this.favorites,
      attendanceList: this.attendanceList,
      feedbackList: this.feedbackList,
      certificates: this.certificates,
      notifications: this.notifications,
      activityLogs: this.activityLogs,
    };
    try {
      localStorage.setItem('college_event_sqlite_db', JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem('college_event_sqlite_db');
      if (raw) {
        const parsed = JSON.parse(raw);
        this.users = parsed.users || [];
        this.students = parsed.students || [];
        this.staffMembers = parsed.staffMembers || [];
        this.events = parsed.events || [];
        this.registrations = parsed.registrations || [];
        this.waitlist = parsed.waitlist || [];
        this.favorites = parsed.favorites || [];
        this.attendanceList = parsed.attendanceList || [];
        this.feedbackList = parsed.feedbackList || [];
        this.certificates = parsed.certificates || [];
        this.notifications = parsed.notifications || [];
        this.activityLogs = parsed.activityLogs || [];

        // Ensure student Monika Sivakumar has department Master of Computer Applications and register number 927625MCA026
        const monika = this.students.find(s => s.id === 1 || s.registerNumber === '920422104018' || s.registerNumber === '927625MCA026');
        if (monika) {
          let updated = false;
          if (monika.department !== 'Master of Computer Applications') {
            monika.department = 'Master of Computer Applications';
            updated = true;
          }
          if (monika.registerNumber !== '927625MCA026') {
            const oldReg = monika.registerNumber;
            monika.registerNumber = '927625MCA026';
            this.registrations.forEach(r => {
              if (r.studentId === monika.id || r.registerNumber === oldReg) {
                r.registerNumber = '927625MCA026';
                r.department = 'Master of Computer Applications';
              }
            });
            this.attendanceList.forEach(a => {
              if (a.studentId === monika.id || a.registerNumber === oldReg) {
                a.registerNumber = '927625MCA026';
                a.department = 'Master of Computer Applications';
              }
            });
            updated = true;
          }
          if (updated) {
            this.saveToStorage();
          }
        }

        // Ensure staff member S.Priyadharshini has department Master of Computer Applications
        const priyaStaff = this.staffMembers.find(s => s.id === 1 || s.userId === 2 || s.name.includes('Ramesh') || s.name === 'S.Priyadharshini');
        if (priyaStaff) {
          let updatedStaff = false;
          if (priyaStaff.name !== 'S.Priyadharshini') {
            priyaStaff.name = 'S.Priyadharshini';
            updatedStaff = true;
          }
          if (priyaStaff.department !== 'Master of Computer Applications') {
            priyaStaff.department = 'Master of Computer Applications';
            updatedStaff = true;
          }
          if (priyaStaff.staffId === 'STF-CSE-104') {
            priyaStaff.staffId = 'STF-MCA-104';
            updatedStaff = true;
          }
          if (priyaStaff.email === 'ramesh.kumar@college.edu') {
            priyaStaff.email = 'priyadharshini.mca@college.edu';
            updatedStaff = true;
          }
          // Update event createdByName where createdBy is 2 or createdByName had Ramesh
          this.events.forEach(ev => {
            if (ev.createdBy === 2 || (ev.createdByName && ev.createdByName.includes('Ramesh'))) {
              ev.createdByName = 'S.Priyadharshini';
              updatedStaff = true;
            }
          });
          // Update activity logs
          this.activityLogs.forEach(log => {
            if (log.userId === 2 || (log.userName && log.userName.includes('Ramesh'))) {
              log.userName = 'S.Priyadharshini';
              updatedStaff = true;
            }
          });
          if (updatedStaff) {
            this.saveToStorage();
          }
        }
      }
    } catch {
      // fallback
    }
  }

  public resetDatabase() {
    localStorage.removeItem('college_event_sqlite_db');
    this.seedInitialData();
  }

  private seedInitialData() {
    this.users = [
      { id: 1, username: 'student', password: '1234', role: 'STUDENT', status: 'ACTIVE' },
      { id: 2, username: 'staff', password: '1234', role: 'STAFF', status: 'ACTIVE' },
      { id: 3, username: 'admin', password: 'admin123', role: 'ADMIN', status: 'ACTIVE' },
      { id: 4, username: 'priya_cse', password: '1234', role: 'STUDENT', status: 'ACTIVE' },
      { id: 5, username: 'dr_sharma', password: '1234', role: 'STAFF', status: 'ACTIVE' },
    ];

    this.students = [
      {
        id: 1,
        userId: 1,
        name: 'Monika Sivakumar',
        registerNumber: '927625MCA026',
        department: 'Master of Computer Applications',
        year: 'Final Year (II)',
        email: 'monikasivakumarm@gmail.com',
        phone: '9876543210',
      },
      {
        id: 2,
        userId: 4,
        name: 'Priya Rajendran',
        registerNumber: '920422104025',
        department: 'Information Technology',
        year: 'Third Year (III)',
        email: 'priya.it@college.edu',
        phone: '9845123456',
      }
    ];

    this.staffMembers = [
      {
        id: 1,
        userId: 2,
        name: 'S.Priyadharshini',
        staffId: 'STF-MCA-104',
        department: 'Master of Computer Applications',
        email: 'priyadharshini.mca@college.edu',
        phone: '9443219876',
        status: 'ACTIVE'
      },
      {
        id: 2,
        userId: 5,
        name: 'Dr. Anita Sharma',
        staffId: 'STF-ECE-208',
        department: 'Electronics and Communication',
        email: 'anita.ece@college.edu',
        phone: '9443551122',
        status: 'ACTIVE'
      }
    ];

    this.events = [
      {
        id: 1,
        name: 'National Technical Symposium 2026',
        description: 'Annual inter-collegiate technical fest featuring hackathons, paper presentations, UI/UX design battle, and web development showdowns.',
        category: 'Technical',
        date: '2026-10-10',
        startTime: '09:30',
        endTime: '16:30',
        venue: 'Main Auditorium & CS Labs',
        eventType: 'Offline',
        organizer: 'Dept. of CSE & Coding Club',
        capacity: 100,
        registeredCount: 42,
        registrationDeadline: '2026-10-09',
        poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        meetingLink: '',
        status: 'Upcoming',
        createdBy: 2,
        createdByName: 'S.Priyadharshini',
      },
      {
        id: 2,
        name: 'Vibrant Cultural Fest "Sanskriti"',
        description: 'Spectacular multi-stage music band performances, classical & western dance face-offs, drama, and fine arts exhibits.',
        category: 'Cultural',
        date: '2026-10-15',
        startTime: '10:00',
        endTime: '18:00',
        venue: 'Open Air College Amphitheater',
        eventType: 'Offline',
        organizer: 'Fine Arts & Cultural Council',
        capacity: 200,
        registeredCount: 188,
        registrationDeadline: '2026-10-14',
        poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
        meetingLink: '',
        status: 'Upcoming',
        createdBy: 2,
        createdByName: 'S.Priyadharshini',
      },
      {
        id: 3,
        name: 'Hands-on AI & Robotics Masterclass',
        description: 'Comprehensive industry-aligned workshop covering computer vision, autonomous embedded bots, and real-time edge AI architectures.',
        category: 'Workshop',
        date: '2026-10-22',
        startTime: '10:00',
        endTime: '16:00',
        venue: 'Robotics Lab 3, Tech Block',
        eventType: 'Hybrid',
        organizer: 'IEEE Student Branch & Robotics Club',
        capacity: 40,
        registeredCount: 40, // Full to test waitlist!
        registrationDeadline: '2026-10-21',
        poster: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
        meetingLink: 'https://meet.google.com/xyz-tech-symp',
        status: 'Upcoming',
        createdBy: 2,
        createdByName: 'S.Priyadharshini',
      },
      {
        id: 4,
        name: 'Inter-College Badminton Championship',
        description: 'Singles and doubles knockout tournament for men and women college athletes with trophies and certificates.',
        category: 'Sports',
        date: '2026-10-28',
        startTime: '08:00',
        endTime: '15:00',
        venue: 'Indoor Sports Complex',
        eventType: 'Offline',
        organizer: 'Department of Physical Education',
        capacity: 50,
        registeredCount: 16,
        registrationDeadline: '2026-10-27',
        poster: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=60',
        meetingLink: '',
        status: 'Upcoming',
        createdBy: 2,
        createdByName: 'S.Priyadharshini',
      },
      {
        id: 5,
        name: 'Web3 & Cloud Infrastructure Summit',
        description: 'Distinguished guest lectures from Google Cloud architects and open-source blockchain core maintainers.',
        category: 'Seminar',
        date: '2026-11-05',
        startTime: '11:00',
        endTime: '14:00',
        venue: 'Seminar Hall 1',
        eventType: 'Online',
        organizer: 'CSI Student Chapter',
        capacity: 150,
        registeredCount: 12,
        registrationDeadline: '2026-11-04',
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
        meetingLink: 'https://meet.google.com/abc-web3-cloud',
        status: 'Pending', // pending admin approval!
        createdBy: 5,
        createdByName: 'Dr. Anita Sharma',
      },
      {
        id: 6,
        name: 'Python for Data Science Bootcamp',
        description: 'Complete hands-on crash course on Pandas, NumPy, Scikit-learn, and data visualization.',
        category: 'Workshop',
        date: '2026-09-20',
        startTime: '09:00',
        endTime: '17:00',
        venue: 'Seminar Hall 2',
        eventType: 'Offline',
        organizer: 'Data Science Club',
        capacity: 60,
        registeredCount: 60,
        registrationDeadline: '2026-09-19',
        poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
        meetingLink: '',
        status: 'Completed',
        createdBy: 2,
        createdByName: 'S.Priyadharshini',
      }
    ];

    // Seed registrations for Monika (Student ID 1)
    this.registrations = [
      {
        id: 1,
        studentId: 1,
        eventId: 1,
        registrationId: 'REG-2026-1001-9276',
        registrationDate: '2026-09-25 14:22:10',
        status: 'REGISTERED',
        studentName: 'Monika Sivakumar',
        registerNumber: '927625MCA026',
        department: 'Master of Computer Applications',
        eventName: 'National Technical Symposium 2026',
        eventDate: '2026-10-10',
        venue: 'Main Auditorium & CS Labs',
      },
      {
        id: 2,
        studentId: 1,
        eventId: 6,
        registrationId: 'REG-2026-0920-8812',
        registrationDate: '2026-09-15 11:05:00',
        status: 'REGISTERED',
        studentName: 'Monika Sivakumar',
        registerNumber: '927625MCA026',
        department: 'Master of Computer Applications',
        eventName: 'Python for Data Science Bootcamp',
        eventDate: '2026-09-20',
        venue: 'Seminar Hall 2',
      }
    ];

    this.favorites = [
      { id: 1, studentId: 1, eventId: 1 },
      { id: 2, studentId: 1, eventId: 2 }
    ];

    this.attendanceList = [
      {
        id: 1,
        studentId: 1,
        eventId: 6,
        checkIn: '2026-09-20 09:12:00',
        checkOut: '2026-09-20 17:05:00',
        status: 'Present',
        studentName: 'Monika Sivakumar',
        registerNumber: '927625MCA026',
        department: 'Master of Computer Applications'
      }
    ];

    this.feedbackList = [
      {
        id: 1,
        studentId: 1,
        eventId: 6,
        rating: 5,
        comment: 'Outstanding workshop! The practical code walkthroughs and real dataset projects helped immensely.',
        date: '2026-09-20 18:30:00',
        studentName: 'Monika Sivakumar'
      }
    ];

    this.certificates = [
      {
        id: 1,
        studentId: 1,
        eventId: 6,
        certificateId: 'CERT-COL-2026-9204-6',
        issueDate: '2026-09-21',
        status: 'VALID',
        studentName: 'Monika Sivakumar',
        eventName: 'Python for Data Science Bootcamp',
        eventDate: '2026-09-20',
        organizer: 'Data Science Club'
      }
    ];

    this.notifications = [
      {
        id: 1,
        userId: 1,
        title: 'Registration Confirmed!',
        message: 'Your registration for National Technical Symposium 2026 has been successfully confirmed. View your Digital Pass.',
        date: '2026-09-25 14:22',
        isRead: false
      },
      {
        id: 2,
        userId: 1,
        title: 'Certificate Issued 🎓',
        message: 'Your official certificate of participation for Python for Data Science Bootcamp is now ready to download.',
        date: '2026-09-21 10:00',
        isRead: true
      },
      {
        id: 3,
        userId: 1,
        title: 'Upcoming Event Reminder',
        message: 'Reminder: National Technical Symposium 2026 is scheduled on 2026-10-10 at Main Auditorium.',
        date: '2026-09-30 08:30',
        isRead: false
      },
      {
        id: 4,
        userId: 2,
        title: 'New Student Registration',
        message: 'Monika Sivakumar registered for National Technical Symposium 2026.',
        date: '2026-09-25 14:22',
        isRead: true
      },
      {
        id: 5,
        userId: 3,
        title: 'Event Approval Request',
        message: 'Dr. Anita Sharma submitted "Web3 & Cloud Infrastructure Summit" for approval.',
        date: '2026-09-28 16:45',
        isRead: false
      }
    ];

    this.activityLogs = [
      {
        id: 1,
        userId: 3,
        userName: 'Admin',
        role: 'ADMIN',
        action: 'System initialized with SQLite Database version 1',
        date: '2026-09-01',
        time: '08:00:00'
      },
      {
        id: 2,
        userId: 2,
        userName: 'S.Priyadharshini',
        role: 'STAFF',
        action: 'Created event "National Technical Symposium 2026"',
        date: '2026-09-10',
        time: '11:15:00'
      },
      {
        id: 3,
        userId: 3,
        userName: 'Admin',
        role: 'ADMIN',
        action: 'Approved event "National Technical Symposium 2026"',
        date: '2026-09-11',
        time: '09:30:00'
      },
      {
        id: 4,
        userId: 1,
        userName: 'Monika Sivakumar',
        role: 'STUDENT',
        action: 'Registered for "National Technical Symposium 2026" (ID: REG-2026-1001-9204)',
        date: '2026-09-25',
        time: '14:22:10'
      }
    ];

    this.saveToStorage();
  }

  // Activity Log
  public logActivity(userId: number, userName: string, role: string, action: string) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    const newLog: ActivityLog = {
      id: Date.now(),
      userId,
      userName,
      role,
      action,
      date,
      time
    };
    this.activityLogs.unshift(newLog);
    this.saveToStorage();
  }

  public getActivityLogs(): ActivityLog[] {
    return this.activityLogs;
  }

  // Authentication - supports Username, Student Register Number, College Email, or Staff ID
  public authenticateUser(identifier: string, password: string): { user: User; student?: Student; staff?: Staff } | null {
    const trimmed = identifier.trim();
    if (!trimmed) return null;

    // 1. Direct username match
    let user = this.users.find(u => 
      (u.username.toLowerCase() === trimmed.toLowerCase()) && u.password === password
    );

    // 2. If not matched, check student by Register Number, College Email, or Phone
    if (!user) {
      const studentMatch = this.students.find(s => 
        s.registerNumber.toUpperCase() === trimmed.toUpperCase() ||
        s.email.toLowerCase() === trimmed.toLowerCase() ||
        s.phone === trimmed
      );
      if (studentMatch) {
        const u = this.users.find(x => x.id === studentMatch.userId && x.password === password);
        if (u) {
          return { user: u, student: studentMatch };
        }
      }
    }

    // 3. If not matched, check staff by Staff ID, Email, or Phone
    if (!user) {
      const staffMatch = this.staffMembers.find(st => 
        st.staffId.toUpperCase() === trimmed.toUpperCase() ||
        (st.staffId === 'STF-MCA-104' && trimmed.toUpperCase() === 'STF-CSE-104') ||
        st.email.toLowerCase() === trimmed.toLowerCase() ||
        (st.id === 1 && trimmed.toLowerCase() === 'ramesh.kumar@college.edu') ||
        st.phone === trimmed
      );
      if (staffMatch) {
        const u = this.users.find(x => x.id === staffMatch.userId && x.password === password);
        if (u) {
          return { user: u, staff: staffMatch };
        }
      }
      return null;
    }

    let student: Student | undefined;
    let staff: Staff | undefined;
    if (user.role === 'STUDENT') {
      student = this.students.find(s => s.userId === user.id);
    } else if (user.role === 'STAFF') {
      staff = this.staffMembers.find(s => s.userId === user.id);
    }

    return { user, student, staff };
  }

  // Dedicated Student Authentication with granular status and error codes
  public authenticateStudent(identifier: string, password: string): {
    success: boolean;
    message: string;
    user?: User;
    student?: Student;
    errorCode?: 'EMPTY_FIELDS' | 'NOT_FOUND' | 'INVALID_PASSWORD' | 'INACTIVE' | 'NOT_STUDENT';
  } {
    const trimmed = identifier.trim();
    if (!trimmed || !password) {
      return { success: false, message: 'Please enter your Register Number / Username and password.', errorCode: 'EMPTY_FIELDS' };
    }

    // Lookup student profile by Register Number, Email, Phone, or Username
    let student = this.findStudentByIdentifier(trimmed);
    let user: User | undefined;

    if (student) {
      user = this.users.find(u => u.id === student!.userId);
    } else {
      // Check if user exists by username
      user = this.users.find(u => u.username.toLowerCase() === trimmed.toLowerCase());
      if (user) {
        student = this.students.find(s => s.userId === user!.id);
      }
    }

    if (!user) {
      return { 
        success: false, 
        message: 'No student account found for "' + trimmed + '". Check your Register Number or sign up.', 
        errorCode: 'NOT_FOUND' 
      };
    }

    if (user.role !== 'STUDENT') {
      return { 
        success: false, 
        message: 'This account (' + user.username + ') belongs to ' + user.role + '. Please use the Faculty & Admin login tab.', 
        errorCode: 'NOT_STUDENT' 
      };
    }

    if (user.password !== password) {
      return { 
        success: false, 
        message: 'Incorrect password for student account. Please verify or use Forgot Password.', 
        errorCode: 'INVALID_PASSWORD' 
      };
    }

    if (user.status === 'INACTIVE') {
      return { 
        success: false, 
        message: 'This student account has been marked inactive. Please visit the Campus Registrar.', 
        errorCode: 'INACTIVE' 
      };
    }

    // Successful student login - log activity
    const studentName = student ? student.name : user.username;
    this.logActivity(user.id, studentName, 'STUDENT', `Student logged in successfully (Reg: ${student?.registerNumber || 'N/A'})`);

    return {
      success: true,
      message: `Welcome back, ${studentName}! Authenticated successfully.`,
      user,
      student
    };
  }

  // Look up student by Register No, Email, Phone, or Username
  public findStudentByIdentifier(identifier: string): Student | undefined {
    const trimmed = identifier.trim();
    if (!trimmed) return undefined;

    // Check register number (case-insensitive)
    const byReg = this.students.find(s => s.registerNumber.toUpperCase() === trimmed.toUpperCase());
    if (byReg) return byReg;

    // Check email
    const byEmail = this.students.find(s => s.email.toLowerCase() === trimmed.toLowerCase());
    if (byEmail) return byEmail;

    // Check phone
    const byPhone = this.students.find(s => s.phone === trimmed);
    if (byPhone) return byPhone;

    // Check username
    const user = this.users.find(u => u.username.toLowerCase() === trimmed.toLowerCase() && u.role === 'STUDENT');
    if (user) {
      return this.students.find(s => s.userId === user.id);
    }

    return undefined;
  }

  // Quick Biometric (Fingerprint / Touch ID / Face ID) simulation for Students
  public authenticateStudentBiometric(studentId?: number): {
    success: boolean;
    message: string;
    user?: User;
    student?: Student;
  } {
    let student: Student | undefined;
    if (studentId) {
      student = this.students.find(s => s.id === studentId);
    } else {
      // Default to first active student (e.g. Monika)
      student = this.students[0];
    }

    if (!student) {
      return { success: false, message: 'No registered student biometric profile found.' };
    }

    const user = this.users.find(u => u.id === student!.userId);
    if (!user || user.status === 'INACTIVE') {
      return { success: false, message: 'Student account is inactive.' };
    }

    this.logActivity(user.id, student.name, 'STUDENT', `Biometric Touch ID authentication verified for ${student.name}`);
    return {
      success: true,
      message: `Biometric identity verified: ${student.name}`,
      user,
      student
    };
  }

  public registerStudent(data: {
    name: string;
    registerNumber: string;
    department: string;
    year: string;
    email: string;
    phone: string;
    username: string;
    password: string;
  }): { success: boolean; message: string; student?: Student } {
    // Unique checks
    if (this.users.some(u => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, message: 'Username is already taken.' };
    }
    if (this.students.some(s => s.registerNumber.toUpperCase() === data.registerNumber.toUpperCase())) {
      return { success: false, message: 'Register Number already exists in the system.' };
    }
    if (this.students.some(s => s.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'Email address is already registered.' };
    }

    const newUserId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1;
    const newUser: User = {
      id: newUserId,
      username: data.username,
      password: data.password,
      role: 'STUDENT',
      status: 'ACTIVE'
    };
    this.users.push(newUser);

    const newStudentId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    const newStudent: Student = {
      id: newStudentId,
      userId: newUserId,
      name: data.name,
      registerNumber: data.registerNumber,
      department: data.department,
      year: data.year,
      email: data.email,
      phone: data.phone
    };
    this.students.push(newStudent);

    this.logActivity(newUserId, data.name, 'STUDENT', `Student signed up (Reg: ${data.registerNumber})`);
    this.createNotification(newUserId, 'Welcome to College Event Portal', 'Your student account has been created successfully!');

    this.saveToStorage();
    return { success: true, message: 'Registration successful! You can now log in.', student: newStudent };
  }

  public resetPassword(identifier: string, regNumberOrEmail: string, newPassword: string): boolean {
    const student = this.students.find(s => 
      s.email.toLowerCase() === regNumberOrEmail.toLowerCase() || 
      s.registerNumber.toUpperCase() === regNumberOrEmail.toUpperCase()
    );
    if (student) {
      const user = this.users.find(u => u.id === student.userId);
      if (user) {
        user.password = newPassword;
        this.saveToStorage();
        return true;
      }
    }
    const user = this.users.find(u => u.username.toLowerCase() === identifier.toLowerCase());
    if (user) {
      user.password = newPassword;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Events CRUD
  public getEvents(): CollegeEvent[] {
    return [...this.events];
  }

  public getEventById(id: number): CollegeEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  // Conflict Detection: Same venue, same date, overlapping time
  public checkEventConflict(venue: string, date: string, startTime: string, endTime: string, excludeEventId?: number): boolean {
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    return this.events.some(ev => {
      if (excludeEventId && ev.id === excludeEventId) return false;
      if (ev.status === 'Cancelled' || ev.status === 'Rejected') return false;
      if (ev.venue.toLowerCase().trim() === venue.toLowerCase().trim() && ev.date === date) {
        const evStart = toMinutes(ev.startTime);
        const evEnd = toMinutes(ev.endTime);
        // Overlap condition
        return (newStart < evEnd && newEnd > evStart);
      }
      return false;
    });
  }

  public createEvent(data: Omit<CollegeEvent, 'id' | 'registeredCount' | 'status'>, role: string, createdByName: string): { success: boolean; message: string; event?: CollegeEvent } {
    // Conflict check
    if (this.checkEventConflict(data.venue, data.date, data.startTime, data.endTime)) {
      return { success: false, message: 'Venue is already booked during this time on ' + data.date };
    }

    const newId = this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1;
    // Staff created events start as Pending, Admin created events can be Approved/Upcoming
    const status: EventStatus = role === 'ADMIN' ? 'Upcoming' : 'Pending';

    const newEvent: CollegeEvent = {
      ...data,
      id: newId,
      registeredCount: 0,
      status,
      createdByName
    };
    this.events.push(newEvent);

    this.logActivity(data.createdBy, createdByName, role, `Created event "${newEvent.name}" (Status: ${status})`);

    if (role === 'STAFF') {
      // Notify Admin
      const admins = this.users.filter(u => u.role === 'ADMIN');
      admins.forEach(adm => {
        this.createNotification(adm.id, 'New Event Awaiting Approval', `${createdByName} submitted "${newEvent.name}" for review.`);
      });
    }

    this.saveToStorage();
    return { success: true, message: role === 'ADMIN' ? 'Event created & published successfully!' : 'Event submitted for Admin approval.', event: newEvent };
  }

  public updateEvent(eventId: number, data: Partial<CollegeEvent>, userId: number, userName: string): { success: boolean; message: string } {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx === -1) return { success: false, message: 'Event not found.' };

    const current = this.events[idx];
    if (data.venue && data.date && data.startTime && data.endTime) {
      if (this.checkEventConflict(data.venue, data.date, data.startTime, data.endTime, eventId)) {
        return { success: false, message: 'Venue is already booked during this time on ' + data.date };
      }
    }

    this.events[idx] = { ...current, ...data };
    this.logActivity(userId, userName, 'STAFF', `Updated details for event "${current.name}"`);

    // Notify registered students about updates
    const regs = this.registrations.filter(r => r.eventId === eventId && r.status === 'REGISTERED');
    regs.forEach(r => {
      const student = this.students.find(s => s.id === r.studentId);
      if (student) {
        this.createNotification(student.userId, `Update: ${current.name}`, `Event details were updated. Venue: ${this.events[idx].venue}, Date: ${this.events[idx].date}`);
      }
    });

    this.saveToStorage();
    return { success: true, message: 'Event updated successfully.' };
  }

  public setEventStatus(eventId: number, status: EventStatus, adminId: number, adminName: string): { success: boolean; message: string } {
    const ev = this.events.find(e => e.id === eventId);
    if (!ev) return { success: false, message: 'Event not found.' };

    ev.status = status;
    this.logActivity(adminId, adminName, 'ADMIN', `Changed status of "${ev.name}" to ${status}`);

    // Notify creator
    const creator = this.users.find(u => u.id === ev.createdBy);
    if (creator) {
      this.createNotification(creator.id, `Event ${status}`, `Your event "${ev.name}" has been ${status.toLowerCase()} by Admin.`);
    }

    this.saveToStorage();
    return { success: true, message: `Event marked as ${status}.` };
  }

  public deleteEvent(eventId: number, userId: number, userName: string): { success: boolean; message: string } {
    const idx = this.events.findIndex(e => e.id === eventId);
    if (idx === -1) return { success: false, message: 'Event not found.' };
    const name = this.events[idx].name;
    this.events.splice(idx, 1);
    this.logActivity(userId, userName, 'STAFF/ADMIN', `Deleted event "${name}"`);
    this.saveToStorage();
    return { success: true, message: 'Event removed.' };
  }

  // Registration & Seat Management
  public registerForEvent(studentId: number, eventId: number): { success: boolean; message: string; waitlisted?: boolean; regId?: string } {
    const ev = this.events.find(e => e.id === eventId);
    const student = this.students.find(s => s.id === studentId);
    if (!ev || !student) return { success: false, message: 'Invalid event or student.' };

    // Already registered check
    const existing = this.registrations.find(r => r.studentId === studentId && r.eventId === eventId && r.status === 'REGISTERED');
    if (existing) {
      return { success: false, message: 'You are already registered for this event.' };
    }

    // Deadline check
    const today = new Date().toISOString().split('T')[0];
    if (ev.registrationDeadline && today > ev.registrationDeadline) {
      return { success: false, message: 'Registration has closed for this event.' };
    }

    // Available seats check
    const availableSeats = ev.capacity - ev.registeredCount;
    if (availableSeats <= 0) {
      // Check if already in waitlist
      const inWaitlist = this.waitlist.some(w => w.studentId === studentId && w.eventId === eventId && w.status === 'WAITING');
      if (inWaitlist) {
        return { success: false, message: 'You are already on the waiting list for this event.' };
      }

      const position = this.waitlist.filter(w => w.eventId === eventId && w.status === 'WAITING').length + 1;
      this.waitlist.push({
        id: Date.now(),
        studentId,
        eventId,
        position,
        status: 'WAITING',
        studentName: student.name
      });
      this.createNotification(student.userId, 'Added to Waitlist', `Event is full. You are #${position} on the waiting list for ${ev.name}.`);
      this.saveToStorage();
      return { success: true, message: `Event full. Added to waiting list at position #${position}.`, waitlisted: true };
    }

    // Register successfully
    const regNumCode = student.registerNumber.slice(-4) || '0000';
    const regId = `REG-2026-${eventId}-${regNumCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg: Registration = {
      id: Date.now(),
      studentId,
      eventId,
      registrationId: regId,
      registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'REGISTERED',
      studentName: student.name,
      registerNumber: student.registerNumber,
      department: student.department,
      eventName: ev.name,
      eventDate: ev.date,
      venue: ev.venue
    };

    this.registrations.push(newReg);
    ev.registeredCount += 1;

    this.logActivity(student.userId, student.name, 'STUDENT', `Registered for "${ev.name}" (ID: ${regId})`);
    this.createNotification(student.userId, 'Registration Successful! 🎉', `You are confirmed for ${ev.name}. Digital Event Pass generated.`);

    // Dispatch System Push Notification via NotificationManager Emulator
    notificationDispatcher.sendPushNotification({
      title: 'Registration Confirmed! 🎉',
      body: `Pass ID: ${regId} issued for "${ev.name}" on ${ev.date}. Tap to view entry pass.`,
      category: 'REGISTRATION',
      targetScreen: 'digitalPass',
      screenParams: { eventId: ev.id },
      eventId: ev.id
    });

    // Notify event organizer/staff
    const staffUser = this.users.find(u => u.id === ev.createdBy);
    if (staffUser) {
      this.createNotification(staffUser.id, 'New Registration', `${student.name} (${student.registerNumber}) registered for ${ev.name}.`);
    }

    this.saveToStorage();
    return { success: true, message: 'Event registration successful! Pass generated.', regId };
  }

  // Cancel Registration with Waitlist Auto-Promotion
  public cancelRegistration(studentId: number, eventId: number): { success: boolean; message: string } {
    const reg = this.registrations.find(r => r.studentId === studentId && r.eventId === eventId && r.status === 'REGISTERED');
    const ev = this.events.find(e => e.id === eventId);
    const student = this.students.find(s => s.id === studentId);

    if (!reg || !ev || !student) {
      return { success: false, message: 'Active registration not found.' };
    }

    reg.status = 'CANCELLED';
    ev.registeredCount = Math.max(0, ev.registeredCount - 1);

    this.logActivity(student.userId, student.name, 'STUDENT', `Cancelled registration for "${ev.name}"`);
    this.createNotification(student.userId, 'Registration Cancelled', `Your registration for ${ev.name} has been cancelled.`);

    // AUTO-PROMOTE FIRST WAITING LIST STUDENT
    const nextWaiting = this.waitlist
      .filter(w => w.eventId === eventId && w.status === 'WAITING')
      .sort((a, b) => a.position - b.position)[0];

    if (nextWaiting) {
      nextWaiting.status = 'PROMOTED';
      const promotedStudent = this.students.find(s => s.id === nextWaiting.studentId);
      if (promotedStudent) {
        const regNumCode = promotedStudent.registerNumber.slice(-4) || '0000';
        const regId = `REG-2026-${eventId}-${regNumCode}-${Math.floor(1000 + Math.random() * 9000)}`;

        this.registrations.push({
          id: Date.now() + 1,
          studentId: promotedStudent.id,
          eventId,
          registrationId: regId,
          registrationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
          status: 'REGISTERED',
          studentName: promotedStudent.name,
          registerNumber: promotedStudent.registerNumber,
          department: promotedStudent.department,
          eventName: ev.name,
          eventDate: ev.date,
          venue: ev.venue
        });

        ev.registeredCount += 1;

        this.createNotification(
          promotedStudent.userId,
          'Waitlist Cleared! Confirmed 🎟️',
          `A seat opened up for "${ev.name}"! You have been automatically registered. Pass ID: ${regId}`
        );
        this.logActivity(
          promotedStudent.userId,
          promotedStudent.name,
          'SYSTEM',
          `Auto-promoted from waitlist for "${ev.name}"`
        );
      }
    }

    this.saveToStorage();
    return { success: true, message: 'Registration cancelled.' + (nextWaiting ? ' Waitlisted student automatically promoted.' : '') };
  }

  // Favorites
  public toggleFavorite(studentId: number, eventId: number): boolean {
    const idx = this.favorites.findIndex(f => f.studentId === studentId && f.eventId === eventId);
    let isFav = false;
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
      isFav = false;
    } else {
      this.favorites.push({ id: Date.now(), studentId, eventId });
      isFav = true;
    }
    this.saveToStorage();
    return isFav;
  }

  public isFavorite(studentId: number, eventId: number): boolean {
    return this.favorites.some(f => f.studentId === studentId && f.eventId === eventId);
  }

  public getFavoriteEvents(studentId: number): CollegeEvent[] {
    const favEventIds = this.favorites.filter(f => f.studentId === studentId).map(f => f.eventId);
    return this.events.filter(e => favEventIds.includes(e.id));
  }

  // QR Check-in / Check-out & Attendance
  public checkInStudent(rawQrData: string, staffUserId: number, staffName: string): { 
    success: boolean; 
    message: string; 
    studentName?: string; 
    eventName?: string; 
    attendance?: Attendance 
  } {
    // QR can be regId or REGISTRATION_ID|STUDENT_ID|EVENT_ID or JSON
    let registrationId = rawQrData.trim();
    if (rawQrData.includes('|')) {
      const parts = rawQrData.split('|');
      registrationId = parts[0];
    } else if (rawQrData.startsWith('{')) {
      try {
        const parsed = JSON.parse(rawQrData);
        registrationId = parsed.registrationId || parsed.regId || registrationId;
      } catch {
        // keep string
      }
    }

    const reg = this.registrations.find(r => r.registrationId === registrationId && r.status === 'REGISTERED');
    if (!reg) {
      return { success: false, message: 'Invalid or cancelled registration pass.' };
    }

    const ev = this.events.find(e => e.id === reg.eventId);
    const student = this.students.find(s => s.id === reg.studentId);
    if (!ev || !student) {
      return { success: false, message: 'Registration records inconsistent.' };
    }

    // Check duplicate check-in
    let existingAtt = this.attendanceList.find(a => a.studentId === student.id && a.eventId === ev.id);
    const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (existingAtt) {
      if (!existingAtt.checkOut) {
        // Record Check-Out
        existingAtt.checkOut = nowTimestamp;
        this.logActivity(staffUserId, staffName, 'STAFF', `Recorded exit/checkout for ${student.name} at "${ev.name}"`);
        this.saveToStorage();
        return {
          success: true,
          message: `Check-out recorded for ${student.name} at ${nowTimestamp}.`,
          studentName: student.name,
          eventName: ev.name,
          attendance: existingAtt
        };
      } else {
        return {
          success: false,
          message: `${student.name} has already checked in and checked out for this event.`
        };
      }
    }

    // Mark Present
    const newAtt: Attendance = {
      id: Date.now(),
      studentId: student.id,
      eventId: ev.id,
      checkIn: nowTimestamp,
      status: 'Present',
      studentName: student.name,
      registerNumber: student.registerNumber,
      department: student.department
    };
    this.attendanceList.push(newAtt);

    // Auto-generate Certificate if event completed or attended
    this.issueCertificate(student.id, ev.id);

    this.logActivity(staffUserId, staffName, 'STAFF', `Marked attendance (Present) for ${student.name} at "${ev.name}"`);
    this.createNotification(student.userId, 'Check-in Confirmed! 📍', `You have been checked in for "${ev.name}" at ${nowTimestamp}.`);

    this.saveToStorage();
    return {
      success: true,
      message: `Check-in Successful! Marked Present for ${student.name}.`,
      studentName: student.name,
      eventName: ev.name,
      attendance: newAtt
    };
  }

  // Certificate Generation & Verification
  public issueCertificate(studentId: number, eventId: number): Certificate {
    const existing = this.certificates.find(c => c.studentId === studentId && c.eventId === eventId);
    if (existing) return existing;

    const student = this.students.find(s => s.id === studentId);
    const ev = this.events.find(e => e.id === eventId);
    const certId = `CERT-COL-2026-${studentId}-${eventId}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert: Certificate = {
      id: Date.now(),
      studentId,
      eventId,
      certificateId: certId,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'VALID',
      studentName: student?.name || 'Student',
      eventName: ev?.name || 'College Event',
      eventDate: ev?.date || '2026-10-01',
      organizer: ev?.organizer || 'College Event Committee'
    };

    this.certificates.push(newCert);
    if (student) {
      this.createNotification(student.userId, 'Certificate Ready! 🎓', `Your certificate for ${ev?.name} has been generated.`);
    }
    this.saveToStorage();
    return newCert;
  }

  public verifyCertificate(certId: string): Certificate | null {
    const cert = this.certificates.find(c => c.certificateId.trim().toUpperCase() === certId.trim().toUpperCase());
    return cert || null;
  }

  // Feedback
  public submitFeedback(studentId: number, eventId: number, rating: number, comment: string): { success: boolean; message: string } {
    const existing = this.feedbackList.find(f => f.studentId === studentId && f.eventId === eventId);
    if (existing) {
      return { success: false, message: 'You have already submitted feedback for this event.' };
    }

    const student = this.students.find(s => s.id === studentId);
    const newFeedback: Feedback = {
      id: Date.now(),
      studentId,
      eventId,
      rating,
      comment,
      date: new Date().toISOString().replace('T', ' ').slice(0, 19),
      studentName: student?.name || 'Student'
    };
    this.feedbackList.push(newFeedback);
    this.saveToStorage();
    return { success: true, message: 'Thank you! Your feedback has been submitted.' };
  }

  public getEventFeedback(eventId: number): Feedback[] {
    return this.feedbackList.filter(f => f.eventId === eventId);
  }

  // Notifications
  public createNotification(userId: number, title: string, message: string) {
    const newNotif: NotificationItem = {
      id: Date.now() + Math.floor(Math.random() * 100),
      userId,
      title,
      message,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isRead: false
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage();
  }

  public getUserNotifications(userId: number): NotificationItem[] {
    return this.notifications.filter(n => n.userId === userId || n.userId === 0);
  }

  public markNotificationAsRead(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveToStorage();
    }
  }

  // Getters for lists
  public getStudents(): Student[] {
    return [...this.students];
  }

  public getStaff(): Staff[] {
    return [...this.staffMembers];
  }

  public getRegistrations(): Registration[] {
    return [...this.registrations];
  }

  public getAttendance(): Attendance[] {
    return [...this.attendanceList];
  }

  public getCertificates(studentId?: number): Certificate[] {
    if (studentId) {
      return this.certificates.filter(c => c.studentId === studentId);
    }
    return [...this.certificates];
  }

  public getFeedback(): Feedback[] {
    return [...this.feedbackList];
  }

  public getWaitlist(): Waitlist[] {
    return [...this.waitlist];
  }

  // Staff management by Admin
  public addStaff(data: Omit<Staff, 'id' | 'userId' | 'status'>, username: string, password: string): Staff {
    const newUserId = Math.max(...this.users.map(u => u.id)) + 1;
    this.users.push({
      id: newUserId,
      username,
      password,
      role: 'STAFF',
      status: 'ACTIVE'
    });
    const newStaffId = Math.max(...this.staffMembers.map(s => s.id)) + 1;
    const newStaff: Staff = {
      id: newStaffId,
      userId: newUserId,
      ...data,
      status: 'ACTIVE'
    };
    this.staffMembers.push(newStaff);
    this.saveToStorage();
    return newStaff;
  }

  public toggleStaffStatus(staffId: number): boolean {
    const stf = this.staffMembers.find(s => s.id === staffId);
    if (stf) {
      stf.status = stf.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const user = this.users.find(u => u.id === stf.userId);
      if (user) {
        user.status = stf.status;
      }
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Update Student Profile
  public updateStudentProfile(studentId: number, data: Partial<Student>): boolean {
    const idx = this.students.findIndex(s => s.id === studentId);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...data };
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Trigger simulated push notification for Event Reminders (e.g. 1-day or 1-hour before)
  public triggerReminderPush(eventId: number, timeNotice: string = 'starts tomorrow at 09:30 AM') {
    const ev = this.events.find(e => e.id === eventId) || this.events[0];
    if (ev) {
      notificationDispatcher.sendPushNotification({
        title: 'Upcoming Event Reminder ⏰',
        body: `"${ev.name}" ${timeNotice} in ${ev.venue}. Have your Digital Pass ready!`,
        category: 'REMINDER',
        targetScreen: 'eventDetails',
        screenParams: { event: ev },
        eventId: ev.id
      });
    }
  }
}

export const sqliteStore = new SQLiteStore();
