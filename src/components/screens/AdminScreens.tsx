import React, { useState } from 'react';
import { sqliteStore } from '../../database/sqliteStore';
import { User, CollegeEvent } from '../../types';
import { StatusBadge } from './CommonComponents';
import { AdminAnalyticsDashboard } from '../AdminAnalyticsDashboard';
import { 
  Shield, CheckCircle, XCircle, Users, UserPlus, 
  Activity, Settings, HelpCircle, LogOut, Moon, Sun, 
  Languages, Search, Check, AlertCircle, FileText, BarChart3
} from 'lucide-react';

interface AdminProps {
  user: User;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
}

// 1. ADMIN DASHBOARD
export const AdminDashboardScreen: React.FC<AdminProps> = ({ user, onNavigate, onLogout }) => {
  const students = sqliteStore.getStudents();
  const staff = sqliteStore.getStaff();
  const events = sqliteStore.getEvents();
  const pendingEvents = events.filter(e => e.status === 'Pending').length;
  const registrations = sqliteStore.getRegistrations();
  const certificates = sqliteStore.getCertificates();

  return (
    <div className="overflow-y-auto max-h-full pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-5 pt-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
            Super Administrator
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <h2 className="text-xl font-extrabold mt-1 tracking-tight">System Control Panel</h2>
        <p className="text-xs text-purple-200 mt-0.5">National Institute of Engineering & Technology</p>
      </div>

      {/* Metrics Row */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-3 shadow-md border border-slate-100">
          <div className="text-center">
            <div className="text-lg font-black text-purple-700">{students.length}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Students</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-blue-600">{staff.length}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Faculty</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-amber-500">{pendingEvents}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Pending</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-emerald-600">{certificates.length}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Issued Certs</div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Governance Tools</h3>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('adminReports')}
            className="p-3.5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group col-span-2 relative"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <BarChart3 size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Recharts Live
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Attendance &amp; Registration Analytics</div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Interactive charts for attendance trends, venue capacity fill &amp; department stats
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('adminApprovals')}
            className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group relative"
          >
            {pendingEvents > 0 && (
              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-600 text-white font-bold text-[9px] rounded-full">
                {pendingEvents}
              </span>
            )}
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <CheckCircle size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Event Approvals</div>
              <div className="text-[10px] text-slate-500">Approve or reject staff events</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('manageStaff')}
            className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <UserPlus size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Manage Staff</div>
              <div className="text-[10px] text-slate-500">Add faculty & toggle status</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('activityLogs')}
            className="p-3.5 bg-gradient-to-br from-slate-100 to-slate-200/60 border border-slate-200 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Activity Logs</div>
              <div className="text-[10px] text-slate-500">Live SQLite audit trails</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Settings size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">App Settings</div>
              <div className="text-[10px] text-slate-500">Dark mode & Tamil language</div>
            </div>
          </button>
        </div>

        {/* Secondary list */}
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">System Resources</h3>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
          <button
            onClick={() => onNavigate('helpFaq')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">❓</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Help &amp; FAQ Knowledgebase</div>
                <div className="text-[10px] text-slate-500">Registration, pass & certificate guides</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          <span>Admin Logout</span>
        </button>
      </div>
    </div>
  );
};

// 2. EVENT APPROVAL SCREEN
export const EventApprovalScreen: React.FC<{
  user: User;
}> = ({ user }) => {
  const [, setTick] = useState(0);
  const events = sqliteStore.getEvents();
  const pendingEvents = events.filter(e => e.status === 'Pending');

  const handleAction = (eventId: number, status: 'Upcoming' | 'Rejected') => {
    sqliteStore.setEventStatus(eventId, status, user.id, user.username);
    setTick(t => t + 1);
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">Event Approval Requests</h2>
        <p className="text-xs text-slate-500">Review submissions from faculty before publishing</p>
      </div>

      <div className="space-y-3">
        {pendingEvents.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500">
            No pending event approval requests right now.
          </div>
        ) : (
          pendingEvents.map(ev => (
            <div key={ev.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pending Approval
                </span>
                <span className="text-[10px] text-slate-400">{ev.category}</span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900">{ev.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Submitted by: {ev.createdByName || 'Staff'}</p>
                <div className="text-[11px] text-slate-600 mt-1">
                  📅 {ev.date} ({ev.startTime} - {ev.endTime}) • 📍 {ev.venue}
                </div>
                <div className="text-[11px] text-slate-500">Capacity: {ev.capacity} seats</div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => handleAction(ev.id, 'Upcoming')}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle size={13} />
                  <span>Approve &amp; Publish</span>
                </button>
                <button
                  onClick={() => handleAction(ev.id, 'Rejected')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                >
                  <XCircle size={13} />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 3. MANAGE STAFF SCREEN
export const ManageStaffScreen: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [staffId, setStaffId] = useState('');
  const [department, setDepartment] = useState('Master of Computer Applications');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, setTick] = useState(0);

  const staffList = sqliteStore.getStaff();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !staffId || !email || !username || !password) return;
    sqliteStore.addStaff({
      name,
      staffId,
      department,
      email,
      phone
    }, username, password);

    setShowAddForm(false);
    setName('');
    setStaffId('');
    setEmail('');
    setUsername('');
    setPassword('');
    setTick(t => t + 1);
  };

  const handleToggle = (id: number) => {
    sqliteStore.toggleStaffStatus(id);
    setTick(t => t + 1);
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Faculty & Staff Management</h2>
          <p className="text-xs text-slate-500">Provision department accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          {showAddForm ? 'Close' : '+ Add Staff'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-2.5">
          <h3 className="text-xs font-bold text-purple-900">Add New Staff Member</h3>
          <input
            type="text"
            placeholder="Staff Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Staff ID (STF-101)"
              value={staffId}
              onChange={e => setStaffId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Login Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-700 text-white font-bold text-xs rounded-xl"
          >
            Save Staff Account
          </button>
        </form>
      )}

      <div className="space-y-2">
        {staffList.map(stf => (
          <div key={stf.id} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-xs text-slate-800">{stf.name}</div>
              <div className="text-[11px] text-purple-700 font-semibold">{stf.department} • {stf.staffId}</div>
              <div className="text-[10px] text-slate-400">✉️ {stf.email} • 📞 {stf.phone}</div>
            </div>
            <button
              onClick={() => handleToggle(stf.id)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                stf.status === 'ACTIVE'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300'
              }`}
            >
              {stf.status === 'ACTIVE' ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. ACTIVITY LOGS SCREEN (SQLITE AUDIT TRAIL)
export const ActivityLogScreen: React.FC = () => {
  const logs = sqliteStore.getActivityLogs();

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">System Activity Audit Log</h2>
        <p className="text-xs text-slate-500">Immutable ledger of security & operational actions in SQLite</p>
      </div>

      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs text-xs space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-bold font-mono text-slate-700">[{log.role}] {log.userName}</span>
              <span>{log.date} {log.time}</span>
            </div>
            <div className="font-medium text-slate-800">{log.action}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. SETTINGS SCREEN (DARK MODE & TAMIL LOCALIZATION)
export const SettingsScreen: React.FC<AdminProps> = ({
  isDark,
  onToggleDark,
  language = 'en',
  onLanguageChange
}) => {
  const [dbResetNotice, setDbResetNotice] = useState(false);

  const handleReset = () => {
    if (confirm('Reset SQLite database to factory sample data? This will restore test events and registrations.')) {
      sqliteStore.resetDatabase();
      setDbResetNotice(true);
      setTimeout(() => setDbResetNotice(false), 2500);
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">Application Settings</h2>
        <p className="text-xs text-slate-500">Configure theme, multi-language localization & database</p>
      </div>

      {dbResetNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl">
          Database restored to default seed state!
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden text-xs">
        {/* Dark Mode */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isDark ? <Moon size={16} className="text-purple-600" /> : <Sun size={16} className="text-amber-500" />}
            <div>
              <div className="font-bold text-slate-800">Theme Appearance</div>
              <div className="text-[10px] text-slate-500">{isDark ? 'Dark Mode Active' : 'Light Mode Active'}</div>
            </div>
          </div>
          <button
            onClick={onToggleDark}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
          >
            {isDark ? 'Switch Light' : 'Switch Dark'}
          </button>
        </div>

        {/* Multi-Language */}
        <div className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Languages size={16} className="text-blue-600" />
            <div>
              <div className="font-bold text-slate-800">Multi-Language Localization</div>
              <div className="text-[10px] text-slate-500">English / தமிழ் (Tamil)</div>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onLanguageChange && onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${language === 'en' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange && onLanguageChange('ta')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] ${language === 'ta' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Database reset */}
        <div className="p-3.5 flex items-center justify-between">
          <div>
            <div className="font-bold text-slate-800">Reset SQLite Database</div>
            <div className="text-[10px] text-slate-500">Re-seed initial tables & demo records</div>
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg"
          >
            Reset DB
          </button>
        </div>
      </div>
    </div>
  );
};

// 6. HELP & FAQ SCREEN
export const HelpFaqScreen: React.FC = () => {
  const faqs = [
    {
      q: 'How to register for an event?',
      a: 'Browse through upcoming events on the Student Dashboard or Event Search. Open the event details and click "Proceed to Registration". Confirm your student details to instantly generate your official Digital Event Pass.'
    },
    {
      q: 'How to cancel registration?',
      a: 'Navigate to "My Registrations" on the student menu. In the "Upcoming" tab, select "Cancel Registration". Once confirmed, your seat will be automatically reassigned to the first student on the waiting list!'
    },
    {
      q: 'How to get your Digital Event Pass?',
      a: 'After registering, tap "Digital Event Pass" on the dashboard. The app displays your student credentials, venue details, and verified collegiate Pass ID for gate admission.'
    },
    {
      q: 'How to download and verify certificates?',
      a: 'Once an event is completed and your QR check-in has been validated by staff, your digital Certificate of Participation is generated automatically with a unique collegiate Certificate ID. You can share it or authenticate it using the Public Verification tool.'
    },
    {
      q: 'How to check attendance?',
      a: 'Faculty staff scan your digital pass at the entrance. The SQLite database updates your status to "Present" with exact entry and exit timestamps. Staff can also export event attendance rosters.'
    }
  ];

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">Help &amp; Frequently Asked Questions</h2>
        <p className="text-xs text-slate-500">Comprehensive guide to campus event operations</p>
      </div>

      <div className="space-y-2.5">
        {faqs.map((f, i) => (
          <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1">
            <h4 className="font-bold text-xs text-blue-900">{f.q}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. ADMIN REPORTS & ATTENDANCE ANALYTICS SCREEN
export const AdminReportsScreen: React.FC<{
  user: User;
  onNavigate?: (screen: string) => void;
}> = () => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-900">
      <AdminAnalyticsDashboard compact={true} />
    </div>
  );
};

