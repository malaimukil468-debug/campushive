import React, { useState } from 'react';
import { sqliteStore } from '../../database/sqliteStore';
import { Staff, User, CollegeEvent } from '../../types';
import { StatusBadge } from './CommonComponents';
import { 
  PlusCircle, Calendar, Users, QrCode, FileText, 
  MessageSquare, Bell, LogOut, CheckCircle2, AlertTriangle, 
  Search, Clock, MapPin, Edit3, Trash2, Radio, BarChart3
} from 'lucide-react';

interface StaffProps {
  user: User;
  staff?: Staff;
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
}

// 1. STAFF DASHBOARD
export const StaffDashboardScreen: React.FC<StaffProps> = ({ user, staff, onNavigate, onLogout }) => {
  const events = sqliteStore.getEvents();
  const registrations = sqliteStore.getRegistrations();
  const attendance = sqliteStore.getAttendance();

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'Upcoming' || e.status === 'Approved').length;
  const totalRegistrations = registrations.filter(r => r.status === 'REGISTERED').length;
  const totalPresent = attendance.filter(a => a.status === 'Present').length;

  return (
    <div className="overflow-y-auto max-h-full pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-5 pt-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
            Faculty &amp; Staff Console
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-800/80 rounded-full border border-indigo-700">
            {staff?.staffId || 'STF-MCA-104'}
          </span>
        </div>
        <h2 className="text-xl font-extrabold mt-1 tracking-tight">{staff?.name || 'S.Priyadharshini'}</h2>
        <p className="text-xs text-indigo-200 mt-0.5">{staff?.department || 'Master of Computer Applications'}</p>
      </div>

      {/* Metrics Row */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-3 shadow-md border border-slate-100">
          <div className="text-center">
            <div className="text-lg font-black text-blue-700">{totalEvents}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Total Evts</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-indigo-600">{upcomingEvents}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Upcoming</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-emerald-600">{totalRegistrations}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Registered</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-teal-600">{totalPresent}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Attended</div>
          </div>
        </div>
      </div>

      {/* Primary Staff Actions */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Management Tools</h3>
        
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('createEvent')}
            className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <PlusCircle size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Create Event</div>
              <div className="text-[10px] text-slate-500">With venue conflict detection</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('staffAttendance')}
            className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <QrCode size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">QR Check-In</div>
              <div className="text-[10px] text-slate-500">Attendance scanner & exit</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('manageEvents')}
            className="p-3.5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Manage Events</div>
              <div className="text-[10px] text-slate-500">Edit, status & live updates</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('registrationManagement')}
            className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Registrations</div>
              <div className="text-[10px] text-slate-500">Participant rosters & export</div>
            </div>
          </button>
        </div>

        {/* Secondary Tools */}
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">Analytics & Students</h3>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
          <button
            onClick={() => onNavigate('staffStudentList')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">👥</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Student Directory</div>
                <div className="text-[10px] text-slate-500">Search by register number or dept</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('staffReports')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">📊</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Reports &amp; Analytics</div>
                <div className="text-[10px] text-slate-500">Event-wise attendance, feedback %</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('staffFeedback')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">💬</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Participant Feedback</div>
                <div className="text-[10px] text-slate-500">View star ratings and comments</div>
              </div>
            </div>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          <span>Staff Logout</span>
        </button>
      </div>
    </div>
  );
};

// 2. CREATE EVENT SCREEN (WITH CONFLICT DETECTION)
export const CreateEventScreen: React.FC<{
  user: User;
  staff?: Staff;
  onNavigate: (screen: string) => void;
}> = ({ user, staff, onNavigate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<any>('Technical');
  const [date, setDate] = useState('2026-10-18');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [venue, setVenue] = useState('Seminar Hall 1');
  const [eventType, setEventType] = useState<any>('Offline');
  const [capacity, setCapacity] = useState('80');
  const [deadline, setDeadline] = useState('2026-10-17');
  const [organizer, setOrganizer] = useState(staff ? `${staff.name} (${staff.department})` : 'College Event Committee');
  const [meetingLink, setMeetingLink] = useState('');
  const [statusNotice, setStatusNotice] = useState<{ text: string; isError: boolean } | null>(null);

  const venues = [
    'Main Auditorium & CS Labs',
    'Open Air College Amphitheater',
    'Robotics Lab 3, Tech Block',
    'Indoor Sports Complex',
    'Seminar Hall 1',
    'Seminar Hall 2',
    'Mechanical Workshop Hall'
  ];

  const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Symposium', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date || !startTime || !endTime || !venue) {
      setStatusNotice({ text: 'Please fill in all mandatory fields.', isError: true });
      return;
    }

    const capNum = parseInt(capacity, 10);
    if (isNaN(capNum) || capNum <= 0) {
      setStatusNotice({ text: 'Capacity must be greater than zero.', isError: true });
      return;
    }

    if (endTime <= startTime) {
      setStatusNotice({ text: 'End time must be after start time.', isError: true });
      return;
    }

    if (deadline > date) {
      setStatusNotice({ text: 'Registration deadline cannot be after event date.', isError: true });
      return;
    }

    const res = sqliteStore.createEvent(
      {
        name: name.trim(),
        description: description.trim() || 'Exciting college event open to all students.',
        category,
        date,
        startTime,
        endTime,
        venue,
        eventType,
        organizer,
        capacity: capNum,
        registrationDeadline: deadline,
        poster: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        meetingLink,
        createdBy: user.id
      },
      user.role,
      staff?.name || user.username
    );

    if (res.success) {
      setStatusNotice({ text: res.message, isError: false });
      setTimeout(() => onNavigate('manageEvents'), 1500);
    } else {
      // Conflict detection or failure
      setStatusNotice({ text: res.message, isError: true });
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="mb-3">
        <h2 className="text-base font-bold text-slate-800">Create New Campus Event</h2>
        <p className="text-xs text-slate-500">Includes automatic venue conflict verification</p>
      </div>

      {statusNotice && (
        <div className={`p-3 text-xs rounded-xl mb-4 border ${statusNotice.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          <div className="font-bold flex items-center gap-1.5">
            {statusNotice.isError ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
            <span>{statusNotice.text}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Event Title *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. AI Hackathon 2026"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            >
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Venue (Conflict Checked) *</label>
          <select
            value={venue}
            onChange={e => setVenue(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          >
            {venues.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Start Time *</label>
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">End Time *</label>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Max Capacity *</label>
            <input
              type="number"
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
              min="1"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Reg Deadline *</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Organizer Name</label>
          <input
            type="text"
            value={organizer}
            onChange={e => setOrganizer(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief schedule and requirements..."
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>

        {eventType !== 'Offline' && (
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Meeting Link (Google Meet / Zoom)</label>
            <input
              type="url"
              value={meetingLink}
              onChange={e => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/xyz"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md mt-2"
        >
          {user.role === 'ADMIN' ? 'Publish Event Immediately' : 'Submit Event for Admin Approval'}
        </button>
      </form>
    </div>
  );
};

// 3. STAFF ATTENDANCE & QR SCANNER SCREEN
export const StaffAttendanceScreen: React.FC<{
  user: User;
  staff?: Staff;
}> = ({ user, staff }) => {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    studentName?: string;
    eventName?: string;
    attendance?: any;
  } | null>(null);

  const registrations = sqliteStore.getRegistrations().filter(r => r.status === 'REGISTERED');
  const attendanceList = sqliteStore.getAttendance();

  const handleScan = (qrCode: string) => {
    if (!qrCode.trim()) return;
    const res = sqliteStore.checkInStudent(qrCode.trim(), user.id, staff?.name || 'S.Priyadharshini');
    setScanResult(res);
    setScanInput('');
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">QR Code Check-In & Attendance</h2>
        <p className="text-xs text-slate-500">Scan student pass to record entry and exit times</p>
      </div>

      {/* Simulated Scanner Input */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg text-center space-y-3">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-blue-300">
          <QrCode size={24} />
        </div>
        <div>
          <div className="text-xs font-bold">QR Camera Viewfinder Active</div>
          <div className="text-[10px] text-slate-400">Scan or paste Digital Event Pass code</div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={scanInput}
            onChange={e => setScanInput(e.target.value)}
            placeholder="Scan code or enter Pass ID..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleScan(scanInput)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Process
          </button>
        </div>
      </div>

      {/* Result Card */}
      {scanResult && (
        <div className={`p-4 rounded-2xl border text-xs shadow-sm ${
          scanResult.success 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="font-bold text-sm flex items-center gap-1.5 mb-1">
            {scanResult.success ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-rose-600" />}
            <span>{scanResult.message}</span>
          </div>
          {scanResult.studentName && (
            <div className="mt-2 space-y-0.5 text-[11px] opacity-90 border-t border-emerald-200 pt-1.5">
              <div><strong>Student:</strong> {scanResult.studentName}</div>
              <div><strong>Event:</strong> {scanResult.eventName}</div>
              {scanResult.attendance?.checkIn && (
                <div><strong>Entry Timestamp:</strong> {scanResult.attendance.checkIn}</div>
              )}
              {scanResult.attendance?.checkOut && (
                <div><strong>Exit Timestamp:</strong> {scanResult.attendance.checkOut}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 1-Tap Quick Scan from Registered Students for Testing */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          1-Tap Quick Scan (Simulate Student QR Pass)
        </h3>
        <div className="space-y-2">
          {registrations.slice(0, 3).map(r => (
            <div
              key={r.id}
              className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">{r.studentName}</div>
                <div className="text-[10px] text-slate-500">{r.eventName} • {r.registrationId}</div>
              </div>
              <button
                onClick={() => handleScan(r.registrationId)}
                className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100"
              >
                Scan Pass 📲
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Roster */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Recent Attendance Records ({attendanceList.length})
        </h3>
        <div className="space-y-2">
          {attendanceList.map(a => (
            <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-800">{a.studentName}</div>
                <div className="text-[10px] text-slate-500">In: {a.checkIn} {a.checkOut ? `• Out: ${a.checkOut}` : '• Active'}</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. MANAGE EVENTS & LIVE UPDATES SCREEN
export const ManageEventsScreen: React.FC<{
  user: User;
  onNavigate: (screen: string) => void;
}> = ({ user, onNavigate }) => {
  const [liveMsg, setLiveMsg] = useState('');
  const [targetEventId, setTargetEventId] = useState<number>(1);
  const [notice, setNotice] = useState('');
  const [, setTick] = useState(0);

  const events = sqliteStore.getEvents();

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveMsg.trim()) return;

    const ev = sqliteStore.getEventById(targetEventId);
    if (ev) {
      // Broadcast notification to registered students
      const regs = sqliteStore.getRegistrations().filter(r => r.eventId === targetEventId && r.status === 'REGISTERED');
      regs.forEach(r => {
        const student = sqliteStore.getStudents().find(s => s.id === r.studentId);
        if (student) {
          sqliteStore.createNotification(student.userId, `Live Update: ${ev.name}`, liveMsg.trim());
        }
      });
      setNotice(`Update broadcasted to ${regs.length} registered students.`);
      setLiveMsg('');
      setTimeout(() => setNotice(''), 3000);
    }
  };

  const handleCancelEvent = (eventId: number) => {
    if (confirm('Cancel this event? Registered students will receive cancellation alerts.')) {
      sqliteStore.setEventStatus(eventId, 'Cancelled', user.id, user.username);
      setTick(t => t + 1);
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-4">
      {/* Broadcast Live Event Update */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-md space-y-2.5">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-rose-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Publish Live Event Update</h3>
        </div>
        <p className="text-[10px] text-blue-200">
          Notify all registered attendees in real-time about room changes or delay announcements.
        </p>

        {notice && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs rounded-xl">
            {notice}
          </div>
        )}

        <form onSubmit={handlePostUpdate} className="space-y-2">
          <select
            value={targetEventId}
            onChange={e => setTargetEventId(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id} className="text-slate-900">{ev.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={liveMsg}
            onChange={e => setLiveMsg(e.target.value)}
            placeholder="e.g. Venue moved to Seminar Hall B. Begins at 10:30 AM."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-blue-300 focus:outline-none focus:bg-white/20"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
          >
            Broadcast to Attendees 📢
          </button>
        </form>
      </div>

      {/* Events List */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">All Campus Events</h3>
          <button
            onClick={() => onNavigate('createEvent')}
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
          >
            <PlusCircle size={13} />
            <span>New Event</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {events.map(ev => (
            <div key={ev.id} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <StatusBadge status={ev.status} />
                <span className="text-[10px] text-slate-400">{ev.category}</span>
              </div>
              <h4 className="font-bold text-xs text-slate-800">{ev.name}</h4>
              <p className="text-[11px] text-slate-500">📅 {ev.date} • 📍 {ev.venue}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-600">
                  {ev.registeredCount} / {ev.capacity} Registered
                </span>
                {ev.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelEvent(ev.id)}
                    className="text-rose-600 hover:text-rose-800 font-semibold text-xs"
                  >
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. REGISTRATION MANAGEMENT SCREEN
export const RegistrationManagementScreen: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const events = sqliteStore.getEvents();
  const allRegistrations = sqliteStore.getRegistrations();

  const filtered = allRegistrations.filter(r => {
    const matchesEvent = r.eventId === selectedEventId;
    const matchesQuery = 
      (r.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (r.registerNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      r.registrationId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEvent && matchesQuery;
  });

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">Registration Management</h2>
        <p className="text-xs text-slate-500">Participant rosters by event with pass IDs</p>
      </div>

      <div className="space-y-2 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
        <label className="text-[11px] font-semibold text-slate-600 block">Select Event</label>
        <select
          value={selectedEventId}
          onChange={e => setSelectedEventId(Number(e.target.value))}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
        >
          {events.map(e => <option key={e.id} value={e.id}>{e.name} ({e.date})</option>)}
        </select>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search attendee by name or reg no..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
          />
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Registered Participants ({filtered.length})
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No registrations found.</div>
          ) : (
            filtered.map(reg => (
              <div key={reg.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{reg.studentName}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {reg.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Reg No: {reg.registerNumber} • Pass: {reg.registrationId}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 6. STUDENT LIST SCREEN
export const StaffStudentListScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const students = sqliteStore.getStudents();

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.registerNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3">
      <div>
        <h2 className="text-base font-bold text-slate-800">Student Directory</h2>
        <p className="text-xs text-slate-500">Search enrolled students across all departments</p>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, reg no, department..."
          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 shadow-xs"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <h4 className="font-bold text-xs text-slate-900">{s.name}</h4>
            <div className="text-[11px] text-blue-700 font-semibold">{s.department} • {s.year}</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
              Reg No: {s.registerNumber} • 📞 {s.phone}
            </div>
            <div className="text-[10px] text-slate-400">✉️ {s.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. STAFF REPORTS & ANALYTICS SCREEN
export const StaffReportsScreen: React.FC = () => {
  const events = sqliteStore.getEvents();
  const registrations = sqliteStore.getRegistrations();
  const attendance = sqliteStore.getAttendance();
  const feedbacks = sqliteStore.getFeedback();

  const totalRegistered = registrations.filter(r => r.status === 'REGISTERED').length;
  const totalAttended = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-3.5">
      <div>
        <h2 className="text-base font-bold text-slate-800">Campus Analytics & Reports</h2>
        <p className="text-xs text-slate-500">Live operational metrics and participation statistics</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-500">Attendance Rate</div>
          <div className="text-2xl font-black text-blue-700 mt-1">{attendanceRate}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalAttended} of {totalRegistered} attended</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5">
          <div className="text-[10px] uppercase font-bold text-slate-500">Avg Feedback Rating</div>
          <div className="text-2xl font-black text-amber-600 mt-1">★ {avgRating}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{feedbacks.length} student reviews</div>
        </div>
      </div>

      {/* Event Breakdown */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Registration Breakdown</h3>
        <div className="space-y-2">
          {events.map(ev => {
            const pct = Math.round((ev.registeredCount / ev.capacity) * 100);
            return (
              <div key={ev.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="truncate pr-2">{ev.name}</span>
                  <span className="shrink-0">{ev.registeredCount}/{ev.capacity} ({pct}%)</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
