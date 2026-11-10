import React, { useState, useEffect } from 'react';
import { User, Student, Staff, CollegeEvent } from '../types';
import { sqliteStore } from '../database/sqliteStore';
import { TopBar } from './screens/CommonComponents';
import { notificationDispatcher, PushNotification } from '../utils/notificationSystem';
import { 
  LoginScreen, SignupScreen, ForgotPasswordScreen 
} from './screens/AuthScreens';
import { 
  StudentDashboardScreen, BrowseEventsScreen, EventDetailsScreen,
  EventRegistrationScreen, DigitalPassScreen, MyEventsScreen,
  CertificatesScreen, FeedbackScreen, CalendarScreen,
  NotificationsScreen, ProfileScreen
} from './screens/StudentScreens';
import { 
  StaffDashboardScreen, CreateEventScreen, StaffAttendanceScreen,
  ManageEventsScreen, RegistrationManagementScreen, StaffStudentListScreen,
  StaffReportsScreen
} from './screens/StaffScreens';
import { 
  AdminDashboardScreen, EventApprovalScreen, ManageStaffScreen,
  ActivityLogScreen, SettingsScreen, HelpFaqScreen, AdminReportsScreen
} from './screens/AdminScreens';
import { Wifi, BatteryMedium, Signal, ChevronLeft, Circle, Square, Bell, X, CheckCircle2, AlertCircle } from 'lucide-react';

export const MobileFrame: React.FC<{
  onOpenCodeStudio?: () => void;
}> = ({ onOpenCodeStudio }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default to student for instant test readiness
    const userRes = sqliteStore.authenticateUser('student', '1234');
    return userRes?.user || null;
  });
  const [currentStudent, setCurrentStudent] = useState<Student | undefined>(() => {
    const userRes = sqliteStore.authenticateUser('student', '1234');
    return userRes?.student;
  });
  const [currentStaff, setCurrentStaff] = useState<Staff | undefined>();

  const [currentScreen, setCurrentScreen] = useState<string>('studentDashboard');
  const [screenStack, setScreenStack] = useState<string[]>(['studentDashboard']);
  const [screenParams, setScreenParams] = useState<any>({});
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState('09:41');

  // Push Notification state
  const [activeHeadsUp, setActiveHeadsUp] = useState<PushNotification | null>(null);
  const [showNotificationShade, setShowNotificationShade] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<PushNotification[]>(() => notificationDispatcher.getHistory());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen to live push notifications
  useEffect(() => {
    const unsubscribe = notificationDispatcher.subscribe((notif) => {
      setActiveHeadsUp(notif);
      setNotificationHistory(notificationDispatcher.getHistory());

      // Auto dismiss heads-up banner after 6 seconds
      const timer = setTimeout(() => {
        setActiveHeadsUp(prev => (prev?.id === notif.id ? null : prev));
      }, 6000);

      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  const navigateTo = (screen: string, params: any = {}) => {
    setScreenStack(prev => [...prev, screen]);
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleBack = () => {
    if (screenStack.length > 1) {
      const newStack = [...screenStack];
      newStack.pop();
      const prevScreen = newStack[newStack.length - 1];
      setScreenStack(newStack);
      setCurrentScreen(prevScreen);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStudent(undefined);
    setCurrentStaff(undefined);
    setScreenStack(['login']);
    setCurrentScreen('login');
  };

  const handleLoginSuccess = (user: User, student?: Student, staff?: Staff) => {
    setCurrentUser(user);
    setCurrentStudent(student);
    setCurrentStaff(staff);
    if (user.role === 'ADMIN') {
      setScreenStack(['adminDashboard']);
      setCurrentScreen('adminDashboard');
    } else if (user.role === 'STAFF') {
      setScreenStack(['staffDashboard']);
      setCurrentScreen('staffDashboard');
    } else {
      setScreenStack(['studentDashboard']);
      setCurrentScreen('studentDashboard');
    }
  };

  // Quick switch role buttons in simulator header
  const switchRole = (role: 'STUDENT' | 'STAFF' | 'ADMIN') => {
    if (role === 'STUDENT') {
      const res = sqliteStore.authenticateUser('student', '1234');
      if (res) handleLoginSuccess(res.user, res.student, res.staff);
    } else if (role === 'STAFF') {
      const res = sqliteStore.authenticateUser('staff', '1234');
      if (res) handleLoginSuccess(res.user, res.student, res.staff);
    } else if (role === 'ADMIN') {
      const res = sqliteStore.authenticateUser('admin', 'admin123');
      if (res) handleLoginSuccess(res.user, res.student, res.staff);
    }
  };

  const handleNotificationTap = (notif: PushNotification) => {
    setActiveHeadsUp(null);
    setShowNotificationShade(false);
    if (notif.targetScreen) {
      navigateTo(notif.targetScreen, notif.screenParams);
    }
  };

  // Push notification testing triggers
  const triggerRegistrationPush = () => {
    notificationDispatcher.sendPushNotification({
      title: 'Registration Confirmed! 🎉',
      body: 'Pass ID: REG-2026-1001-4018 issued for "National Technical Symposium 2026". Tap to view your Digital Event Pass.',
      category: 'REGISTRATION',
      targetScreen: 'digitalPass',
      screenParams: { eventId: 1 },
      eventId: 1
    });
  };

  const triggerOneHourReminderPush = () => {
    notificationDispatcher.sendPushNotification({
      title: 'Upcoming Event Reminder ⏰',
      body: '"National Technical Symposium 2026" starts in 1 hour (09:30 AM) in Main Auditorium. Have your Digital Pass ready!',
      category: 'REMINDER',
      targetScreen: 'eventDetails',
      screenParams: { event: sqliteStore.getEvents()[0] },
      eventId: 1
    });
  };

  const triggerOneDayReminderPush = () => {
    notificationDispatcher.sendPushNotification({
      title: 'Upcoming Event Reminder 📅',
      body: '"Vibrant Cultural Fest Sanskriti" is scheduled tomorrow at 10:00 AM at Open Air Amphitheater.',
      category: 'REMINDER',
      targetScreen: 'eventDetails',
      screenParams: { event: sqliteStore.getEvents()[1] },
      eventId: 2
    });
  };

  const triggerLiveUpdatePush = () => {
    notificationDispatcher.sendPushNotification({
      title: 'Live Event Update 📢',
      body: 'Venue changed to Seminar Hall B. Keynote speech starting at 10:45 AM.',
      category: 'UPDATE',
      targetScreen: 'eventDetails',
      screenParams: { event: sqliteStore.getEvents()[0] },
      eventId: 1
    });
  };

  // Render active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
      case 'studentLogin':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={navigateTo} defaultRole="STUDENT" />;
      case 'signup':
        return <SignupScreen onNavigate={navigateTo} />;
      case 'forgotPassword':
        return <ForgotPasswordScreen onNavigate={navigateTo} />;

      // Student Screens
      case 'studentDashboard':
        return (
          <StudentDashboardScreen
            user={currentUser!}
            student={currentStudent}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'browseEvents':
        return (
          <BrowseEventsScreen
            onSelectEvent={ev => navigateTo('eventDetails', { event: ev })}
          />
        );
      case 'eventDetails':
        return (
          <EventDetailsScreen
            event={screenParams.event}
            student={currentStudent}
            onNavigate={navigateTo}
          />
        );
      case 'eventRegistration':
        return (
          <EventRegistrationScreen
            event={screenParams.event}
            student={currentStudent}
            onNavigate={navigateTo}
          />
        );
      case 'digitalPass':
        return (
          <DigitalPassScreen
            student={currentStudent}
            eventId={screenParams.eventId}
            onNavigate={navigateTo}
          />
        );
      case 'myEvents':
        return (
          <MyEventsScreen
            student={currentStudent}
            onNavigate={navigateTo}
          />
        );
      case 'favorites':
        return (
          <BrowseEventsScreen
            onSelectEvent={ev => navigateTo('eventDetails', { event: ev })}
          />
        );
      case 'certificates':
        return (
          <CertificatesScreen
            student={currentStudent}
          />
        );
      case 'feedback':
        return (
          <FeedbackScreen
            student={currentStudent}
            eventId={screenParams.eventId}
          />
        );
      case 'calendar':
        return (
          <CalendarScreen
            onSelectEvent={ev => navigateTo('eventDetails', { event: ev })}
          />
        );
      case 'notifications':
        return <NotificationsScreen user={currentUser!} />;
      case 'profile':
        return <ProfileScreen student={currentStudent} />;

      // Staff Screens
      case 'staffDashboard':
        return (
          <StaffDashboardScreen
            user={currentUser!}
            staff={currentStaff}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        );
      case 'createEvent':
        return (
          <CreateEventScreen
            user={currentUser!}
            staff={currentStaff}
            onNavigate={navigateTo}
          />
        );
      case 'staffAttendance':
        return (
          <StaffAttendanceScreen
            user={currentUser!}
            staff={currentStaff}
          />
        );
      case 'manageEvents':
        return (
          <ManageEventsScreen
            user={currentUser!}
            onNavigate={navigateTo}
          />
        );
      case 'registrationManagement':
        return <RegistrationManagementScreen />;
      case 'staffStudentList':
        return <StaffStudentListScreen />;
      case 'staffReports':
        return <StaffReportsScreen />;
      case 'staffFeedback':
        return <StaffReportsScreen />;

      // Admin Screens
      case 'adminDashboard':
        return (
          <AdminDashboardScreen
            user={currentUser!}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            language={language}
            onLanguageChange={setLanguage}
          />
        );
      case 'adminApprovals':
        return <EventApprovalScreen user={currentUser!} />;
      case 'adminReports':
        return <AdminReportsScreen user={currentUser!} onNavigate={navigateTo} />;
      case 'manageStaff':
        return <ManageStaffScreen />;
      case 'activityLogs':
        return <ActivityLogScreen />;
      case 'settings':
        return (
          <SettingsScreen
            user={currentUser!}
            onNavigate={navigateTo}
            onLogout={handleLogout}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            language={language}
            onLanguageChange={setLanguage}
          />
        );
      case 'helpFaq':
        return <HelpFaqScreen />;

      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={navigateTo} />;
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'browseEvents': return 'Browse Events';
      case 'eventDetails': return 'Event Details';
      case 'eventRegistration': return 'Register';
      case 'digitalPass': return 'Digital Event Pass';
      case 'myEvents': return 'My Registrations';
      case 'favorites': return 'Favorite Events';
      case 'certificates': return 'Certificates';
      case 'feedback': return 'Event Feedback';
      case 'calendar': return 'Event Calendar';
      case 'notifications': return 'Notifications';
      case 'profile': return 'My Profile';
      case 'createEvent': return 'Create Event';
      case 'staffAttendance': return 'Attendance & QR';
      case 'manageEvents': return 'Manage Events';
      case 'registrationManagement': return 'Registrations';
      case 'staffStudentList': return 'Student Directory';
      case 'staffReports': return 'Reports & Analytics';
      case 'adminApprovals': return 'Event Approvals';
      case 'adminReports': return 'Attendance & Registration Reports';
      case 'manageStaff': return 'Staff Directory';
      case 'activityLogs': return 'Activity Audit Trail';
      case 'settings': return 'App Settings';
      case 'helpFaq': return 'Help & FAQ';
      default: return 'Event Management App';
    }
  };

  const showTopBar = !['login', 'studentLogin', 'signup', 'forgotPassword', 'studentDashboard', 'staffDashboard', 'adminDashboard'].includes(currentScreen);

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4">
      {/* Push Notification Quick Test Bar */}
      <div className="w-full max-w-[420px] mb-2 p-2 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl border border-blue-900/60 shadow-lg text-white">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-300">
            <Bell size={13} className="text-amber-400" />
            <span>NotificationManager Test Triggers:</span>
          </div>
          <button
            onClick={() => setShowNotificationShade(!showNotificationShade)}
            className="text-[10px] font-semibold text-blue-300 hover:text-white underline"
          >
            {showNotificationShade ? 'Close Shade' : `Shade (${notificationHistory.length})`}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={triggerRegistrationPush}
            className="py-1 px-2 bg-blue-800/80 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold text-left truncate transition-colors border border-blue-700"
          >
            🎟️ Reg Confirmed Pass
          </button>
          <button
            onClick={triggerOneHourReminderPush}
            className="py-1 px-2 bg-amber-800/80 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold text-left truncate transition-colors border border-amber-700"
          >
            ⏰ 1-Hour Reminder
          </button>
          <button
            onClick={triggerOneDayReminderPush}
            className="py-1 px-2 bg-indigo-800/80 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold text-left truncate transition-colors border border-indigo-700"
          >
            📅 1-Day Reminder
          </button>
          <button
            onClick={triggerLiveUpdatePush}
            className="py-1 px-2 bg-teal-800/80 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold text-left truncate transition-colors border border-teal-700"
          >
            📢 Live Venue Shift
          </button>
        </div>
      </div>

      {/* Quick Role Switcher Toolbar */}
      <div className="w-full max-w-[420px] mb-2 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-white shadow-lg text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[11px] text-slate-300">
          <span>Role:</span>
          <span className="text-blue-400 uppercase font-mono">{currentUser?.role || 'Guest'}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => switchRole('STUDENT')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              currentUser?.role === 'STUDENT' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => switchRole('STAFF')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              currentUser?.role === 'STAFF' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Staff
          </button>
          <button
            onClick={() => switchRole('ADMIN')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              currentUser?.role === 'ADMIN' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Android Device Mockup Shell */}
      <div className="relative w-full max-w-[420px] h-[820px] bg-slate-950 rounded-[46px] p-3 shadow-2xl border-[5px] border-slate-800 ring-1 ring-slate-700/50 flex flex-col justify-between select-none">
        {/* Device camera hole notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-950" />
          </div>
        </div>

        {/* Screen Bezel */}
        <div className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}>
          {/* Android Status Bar (Clickable to open Notification Shade) */}
          <div 
            onClick={() => setShowNotificationShade(!showNotificationShade)}
            className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold bg-transparent text-slate-700 shrink-0 z-30 cursor-pointer select-none"
            title="Tap to pull down Notification Shade"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-mono tracking-tight">{currentTime}</span>
              {notificationHistory.length > 0 && (
                <span className="w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                  {notificationHistory.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal size={12} />
              <Wifi size={12} />
              <BatteryMedium size={14} />
            </div>
          </div>

          {/* ANDROID 14/15 HEADS-UP PUSH NOTIFICATION BANNER */}
          {activeHeadsUp && (
            <div className="absolute top-9 left-2 right-2 z-50 animate-bounce-short">
              <div 
                onClick={() => handleNotificationTap(activeHeadsUp)}
                className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl border border-blue-500/40 shadow-2xl cursor-pointer hover:bg-slate-800 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-blue-600 text-[10px] flex items-center justify-center">
                      🏛️
                    </span>
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      Event Portal • NotificationManager
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-slate-400">now</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHeadsUp(null);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                  {activeHeadsUp.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {activeHeadsUp.body}
                </p>
                <div className="mt-1.5 text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                  Tap to view Digital Pass / Details →
                </div>
              </div>
            </div>
          )}

          {/* ANDROID NOTIFICATION SHADE DRAWER */}
          {showNotificationShade && (
            <div className="absolute inset-0 top-9 bg-slate-950/95 backdrop-blur-md z-40 text-white p-4 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-amber-400" />
                    <h3 className="font-bold text-sm tracking-tight">Android Notification Shade</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        notificationDispatcher.clearHistory();
                        setNotificationHistory([]);
                      }}
                      className="text-[10px] font-semibold text-slate-400 hover:text-white"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setShowNotificationShade(false)}
                      className="p-1 hover:bg-slate-800 rounded-lg text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 mt-3">
                  {notificationHistory.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      No active push notifications in tray.
                    </div>
                  ) : (
                    notificationHistory.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationTap(n)}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/60 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-blue-400">{n.title}</span>
                          <span className="text-slate-500">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{n.body}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
                NotificationChannel: High Priority • Sound &amp; Vibration Enabled
              </div>
            </div>
          )}

          {/* Contextual App Top Bar */}
          {showTopBar && (
            <TopBar
              title={getScreenTitle()}
              onBack={handleBack}
            />
          )}

          {/* Active Screen View */}
          <div className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-200">
            {renderScreen()}
          </div>

          {/* Android Gesture Pill Navigation Bar */}
          <div className="h-6 bg-slate-100/80 backdrop-blur-xs flex items-center justify-center shrink-0 border-t border-slate-200/50">
            <div 
              onClick={handleBack}
              className="w-28 h-1 bg-slate-400/80 hover:bg-slate-600 rounded-full cursor-pointer transition-colors" 
              title="Swipe up / Tap to go back"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

