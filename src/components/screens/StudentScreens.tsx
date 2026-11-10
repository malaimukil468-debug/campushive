import React, { useState, useMemo } from 'react';
import { sqliteStore } from '../../database/sqliteStore';
import { Student, User, CollegeEvent, Registration } from '../../types';
import { StatusBadge } from './CommonComponents';
import { 
  Calendar as CalendarIcon, Search, Ticket, Star, Award, 
  Bell, MessageSquare, UserCheck, LogOut, MapPin, Clock, Users,
  Share2, ExternalLink, CheckCircle, AlertTriangle, ShieldCheck, ChevronRight,
  ChevronLeft, CalendarDays
} from 'lucide-react';

interface StudentProps {
  user: User;
  student?: Student;
  onNavigate: (screen: string, params?: any) => void;
  onLogout: () => void;
}

// 1. STUDENT DASHBOARD
export const StudentDashboardScreen: React.FC<StudentProps> = ({ user, student, onNavigate, onLogout }) => {
  const events = sqliteStore.getEvents();
  const upcomingCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Approved').length;
  const myRegCount = sqliteStore.getRegistrations().filter(r => r.studentId === student?.id && r.status === 'REGISTERED').length;
  const notifs = sqliteStore.getUserNotifications(user.id);
  const unreadNotifs = notifs.filter(n => !n.isRead).length;
  const certCount = sqliteStore.getCertificates(student?.id).length;

  // Registered Events Calendar state (defaults to October 2026 for demo events)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-10-15');
  const [calendarCollapsed, setCalendarCollapsed] = useState(false);

  // Student's registered events with full event details
  const registeredEventsList = useMemo(() => {
    const regs = sqliteStore.getRegistrations().filter(r => r.studentId === student?.id && r.status === 'REGISTERED');
    const allEvents = sqliteStore.getEvents();
    return regs.map(reg => {
      const event = allEvents.find(e => e.id === reg.eventId);
      return { reg, event };
    }).filter((item): item is { reg: Registration; event: CollegeEvent } => item.event !== undefined);
  }, [student?.id, events]);

  // Map of YYYY-MM-DD -> registered events
  const registeredDatesMap = useMemo(() => {
    const map = new Map<string, { reg: Registration; event: CollegeEvent }[]>();
    registeredEventsList.forEach(item => {
      const d = item.event.date;
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(item);
    });
    return map;
  }, [registeredEventsList]);

  // Calendar month data
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth());
    const pad = (n: number) => n < 10 ? '0' + n : String(n);
    setSelectedCalendarDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
  };

  // Selected date scheduled events
  const selectedDateRegisteredEvents = registeredDatesMap.get(selectedCalendarDate) || [];
  const otherEventsOnSelectedDate = useMemo(() => {
    return events.filter(e => 
      e.date === selectedCalendarDate && 
      e.status !== 'Cancelled' && 
      e.status !== 'Rejected' &&
      !selectedDateRegisteredEvents.some(s => s.event.id === e.id)
    );
  }, [events, selectedCalendarDate, selectedDateRegisteredEvents]);

  // Search & Filter state on the Dashboard
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Symposium'];
  
  // Dynamic category event counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 
      All: events.filter(e => e.status !== 'Cancelled' && e.status !== 'Rejected').length 
    };
    events.forEach(e => {
      if (e.status !== 'Cancelled' && e.status !== 'Rejected') {
        counts[e.category] = (counts[e.category] || 0) + 1;
      }
    });
    return counts;
  }, [events]);

  // Distinct sorted dates present in the database
  const distinctDates = useMemo(() => {
    return Array.from(new Set(events.filter(e => e.status !== 'Cancelled' && e.status !== 'Rejected').map(e => e.date))).sort();
  }, [events]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered dashboard events list
  const filteredDashboardEvents = useMemo(() => {
    return events.filter(ev => {
      if (ev.status === 'Cancelled' || ev.status === 'Rejected') return false;

      // Category filter
      if (selectedCategory !== 'All' && ev.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Date filter
      if (selectedDate !== 'All') {
        if (selectedDate === 'Today') {
          if (ev.date !== todayStr) return false;
        } else if (selectedDate === 'Upcoming') {
          if (ev.date < todayStr) return false;
        } else if (ev.date !== selectedDate) {
          return false;
        }
      }

      // Search term filter (by name, category, date, venue, organizer, or description)
      if (dashboardSearch.trim()) {
        const query = dashboardSearch.toLowerCase();
        const matchesName = ev.name.toLowerCase().includes(query);
        const matchesCat = ev.category.toLowerCase().includes(query);
        const matchesVenue = ev.venue.toLowerCase().includes(query);
        const matchesDate = ev.date.toLowerCase().includes(query);
        const matchesOrg = ev.organizer.toLowerCase().includes(query);
        const matchesDesc = ev.description.toLowerCase().includes(query);
        return matchesName || matchesCat || matchesVenue || matchesDate || matchesOrg || matchesDesc;
      }

      return true;
    });
  }, [events, dashboardSearch, selectedCategory, selectedDate, todayStr]);

  return (
    <div className="overflow-y-auto max-h-full pb-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-5 pt-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
            Student Portal
          </span>
          <button 
            onClick={() => onNavigate('notifications')}
            className="relative p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <Bell size={16} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </button>
        </div>
        <h2 className="text-xl font-extrabold mt-1 tracking-tight">{student?.name || user.username}</h2>
        <p className="text-xs text-blue-200 mt-0.5">
          {student?.department ? `${student.department} • ${student.year}` : 'College Student'}
        </p>
        <p className="text-[10px] text-blue-300 font-mono mt-0.5">Reg No: {student?.registerNumber || '927625MCA026'}</p>
      </div>

      {/* Metrics Row */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-3 shadow-md border border-slate-100">
          <div className="text-center">
            <div className="text-lg font-black text-blue-700">{upcomingCount}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Upcoming</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-emerald-600">{myRegCount}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">My Events</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-amber-500">{certCount}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Certificates</div>
          </div>
          <div className="text-center border-l border-slate-100">
            <div className="text-lg font-black text-purple-600">{unreadNotifs}</div>
            <div className="text-[9px] font-semibold text-slate-500 uppercase">Alerts</div>
          </div>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Main Actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('browseEvents')}
            className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <CalendarIcon size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Browse Events</div>
              <div className="text-[10px] text-slate-500">Symposiums, Workshops & Sports</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('digitalPass')}
            className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Ticket size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Digital Event Pass</div>
              <div className="text-[10px] text-slate-500">Official entry credentials</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('myEvents')}
            className="p-3.5 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">My Registrations</div>
              <div className="text-[10px] text-slate-500">Active & completed events</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('certificates')}
            className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl text-left flex flex-col justify-between hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm mb-2 group-hover:scale-105 transition-transform">
              <Award size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Certificates</div>
              <div className="text-[10px] text-slate-500">View & verify certificates</div>
            </div>
          </button>
        </div>

        {/* 2. REGISTERED EVENTS CALENDAR VIEW (MONTHLY FORMAT) */}
        <div className="pt-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs mb-3">
            {/* Calendar Header with Navigation */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Registered Events Calendar</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {registeredEventsList.length} Booked
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Monthly schedule of your registered sessions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCalendarCollapsed(!calendarCollapsed)}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {calendarCollapsed ? 'Expand ▾' : 'Collapse ▴'}
                </button>
              </div>
            </div>

            {!calendarCollapsed && (
              <>
                {/* Month Selector Bar */}
                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl mb-2.5 border border-slate-100">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800">
                      {monthNames[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      onClick={handleJumpToToday}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors"
                    >
                      Today
                    </button>
                  </div>

                  <button
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-white rounded-lg text-slate-600 transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Quick-Jump to Registered Event Dates */}
                {registeredDatesMap.size > 0 && (
                  <div className="mb-2.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>⚡</span> Quick Jump to Registered Dates:
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {Array.from(registeredDatesMap.entries()).map(([d, items]) => {
                        const isSelected = selectedCalendarDate === d;
                        const eventName = items[0]?.event.name || 'Event';
                        return (
                          <button
                            key={d}
                            onClick={() => {
                              setSelectedCalendarDate(d);
                              const parts = d.split('-');
                              if (parts.length === 3) {
                                setCalendarYear(parseInt(parts[0], 10));
                                setCalendarMonth(parseInt(parts[1], 10) - 1);
                              }
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border flex items-center gap-1 ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            <span>📅 {d.slice(5)}</span>
                            <span className="opacity-80 truncate max-w-[90px]">({eventName})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Day-of-Week Headers */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {daysOfWeek.map((day, idx) => (
                    <div
                      key={day}
                      className={`text-[10px] font-bold py-1 ${
                        idx === 0 || idx === 6 ? 'text-rose-500' : 'text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Monthly Calendar Grid Cells */}
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {/* Trailing days from previous month */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                    const prevMonthDay = daysInPrevMonth - firstDayOfWeek + i + 1;
                    return (
                      <div
                        key={`prev-${i}`}
                        className="h-10 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-300 font-medium select-none bg-slate-50/50"
                      >
                        {prevMonthDay}
                      </div>
                    );
                  })}

                  {/* Current month days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const padMonth = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
                    const padDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                    const dateStr = `${calendarYear}-${padMonth}-${padDay}`;

                    const regItems = registeredDatesMap.get(dateStr) || [];
                    const hasRegistered = regItems.length > 0;
                    const isSelected = selectedCalendarDate === dateStr;
                    const isToday = dateStr === todayStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedCalendarDate(dateStr)}
                        className={`h-11 rounded-xl flex flex-col items-center justify-between p-1 transition-all relative ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300 ring-offset-1 font-bold'
                            : hasRegistered
                            ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold hover:bg-emerald-100'
                            : isToday
                            ? 'bg-blue-50 text-blue-800 border border-blue-200 font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className={`text-[11px] leading-tight ${isSelected ? 'text-white' : ''}`}>
                          {dayNum}
                        </span>

                        {hasRegistered && (
                          <div className="flex items-center gap-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-600 animate-pulse'}`} />
                            {regItems.length > 1 && (
                              <span className={`text-[8px] font-black ${isSelected ? 'text-indigo-100' : 'text-emerald-700'}`}>
                                {regItems.length}
                              </span>
                            )}
                          </div>
                        )}

                        {!hasRegistered && isToday && (
                          <span className={`text-[8px] font-semibold ${isSelected ? 'text-indigo-200' : 'text-blue-500'}`}>
                            Today
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Day Details / Registered Events Panel */}
                <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">🗓️</span>
                      <span className="text-xs font-bold text-slate-800">
                        Schedule for {selectedCalendarDate}
                      </span>
                    </div>
                    {selectedDateRegisteredEvents.length > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {selectedDateRegisteredEvents.length} Event{selectedDateRegisteredEvents.length > 1 ? 's' : ''} Scheduled
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        No registrations
                      </span>
                    )}
                  </div>

                  {selectedDateRegisteredEvents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateRegisteredEvents.map(({ reg, event }) => (
                        <div
                          key={reg.id}
                          className="p-2.5 bg-white rounded-xl border border-emerald-200 shadow-xs flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                                  {event.category}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  CONFIRMED
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {event.name}
                              </h4>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Clock size={11} className="text-slate-400" />
                                <span>{event.startTime} - {event.endTime}</span>
                                <span>•</span>
                                <MapPin size={11} className="text-slate-400" />
                                <span className="truncate">{event.venue}</span>
                              </p>
                              <p className="text-[9px] font-mono text-indigo-700 mt-1">
                                🎟️ Pass ID: <span className="font-bold">{reg.registrationId}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <button
                              onClick={() => onNavigate('digitalPass', { event, registration: reg })}
                              className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <Ticket size={12} />
                              <span>View Pass</span>
                            </button>
                            <button
                              onClick={() => onNavigate('eventDetails', { event })}
                              className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <ExternalLink size={12} />
                              <span>Event Details</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-[11px] text-slate-500">
                        You have no registered events scheduled for this day.
                      </p>
                      {otherEventsOnSelectedDate.length > 0 && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-slate-200 text-left">
                          <p className="text-[10px] text-blue-700 font-semibold mb-1">
                            💡 Available Campus Event on this Date:
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {otherEventsOnSelectedDate[0].name}
                            </span>
                            <button
                              onClick={() => onNavigate('eventDetails', { event: otherEventsOnSelectedDate[0] })}
                              className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded hover:bg-blue-700 shrink-0"
                            >
                              View & Register
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* SEARCH AND FILTER BAR FOR DASHBOARD EVENT LIST */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-1 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Event Directory</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {filteredDashboardEvents.length} of {events.length}
              </span>
            </h3>
            {(dashboardSearch || selectedCategory !== 'All' || selectedDate !== 'All') && (
              <button
                onClick={() => {
                  setDashboardSearch('');
                  setSelectedCategory('All');
                  setSelectedDate('All');
                  setShowDatePicker(false);
                }}
                className="text-[10px] font-bold text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-3 mb-3">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={dashboardSearch}
                onChange={e => setDashboardSearch(e.target.value)}
                placeholder="Search by event title, venue, category, date..."
                className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
              {dashboardSearch && (
                <button
                  onClick={() => setDashboardSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Active Filters Summary Chips */}
            {(dashboardSearch || selectedCategory !== 'All' || selectedDate !== 'All') && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5 pb-1 border-b border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400">Active:</span>
                {dashboardSearch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                    "{dashboardSearch}"
                    <button onClick={() => setDashboardSearch('')} className="hover:text-rose-600 font-bold ml-0.5">✕</button>
                  </span>
                )}
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-600 font-bold ml-0.5">✕</button>
                  </span>
                )}
                {selectedDate !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-200">
                    Date: {selectedDate}
                    <button onClick={() => setSelectedDate('All')} className="hover:text-rose-600 font-bold ml-0.5">✕</button>
                  </span>
                )}
              </div>
            )}

            {/* Category Filter Pills with Live Event Counts */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>🏷️</span> Filter by Category
                </span>
                {selectedCategory !== 'All' && (
                  <button 
                    onClick={() => setSelectedCategory('All')} 
                    className="text-[10px] text-blue-600 font-semibold hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map(cat => {
                  const count = categoryCounts[cat] || 0;
                  const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-700 text-white shadow-xs scale-[1.02]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[9px] px-1 py-0.2 rounded-full ${
                        isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200/70 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Filter Selection: Preset Chips & Interactive Date Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <span>📅</span> Filter by Date
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
                  >
                    <span>{showDatePicker ? 'Hide Calendar' : 'Custom Date 📆'}</span>
                  </button>
                  {selectedDate !== 'All' && (
                    <button 
                      onClick={() => setSelectedDate('All')} 
                      className="text-[10px] text-rose-600 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Date Presets Row */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedDate('All')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedDate === 'All'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Dates
                </button>
                <button
                  onClick={() => setSelectedDate('Today')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedDate === 'Today'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setSelectedDate('Upcoming')}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                    selectedDate === 'Upcoming'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Upcoming
                </button>
                {distinctDates.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                      selectedDate === d
                        ? 'bg-indigo-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Custom Date Picker Input (Expandable) */}
              {showDatePicker && (
                <div className="mt-2 p-2 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="text-[10px] font-semibold text-indigo-900 flex items-center gap-1 shrink-0">
                    <span>🗓️ Pick Date:</span>
                  </div>
                  <input
                    type="date"
                    value={selectedDate.match(/^\d{4}-\d{2}-\d{2}$/) ? selectedDate : ''}
                    onChange={e => setSelectedDate(e.target.value || 'All')}
                    className="flex-1 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                  {selectedDate !== 'All' && (
                    <button
                      onClick={() => setSelectedDate('All')}
                      className="px-2 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-lg text-[10px] font-bold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Embedded Filtered Events List */}
          <div className="space-y-2.5 mb-2">
            {filteredDashboardEvents.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-1">
                <div className="font-bold text-slate-700">No events matched your search filters</div>
                <p className="text-[11px] text-slate-400">Try changing the category, date or search query</p>
                <button
                  onClick={() => {
                    setDashboardSearch('');
                    setSelectedCategory('All');
                    setSelectedDate('All');
                  }}
                  className="mt-2 px-3 py-1 bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                >
                  Show All Events
                </button>
              </div>
            ) : (
              filteredDashboardEvents.map(event => {
                const availableSeats = Math.max(0, event.capacity - event.registeredCount);
                const isFull = availableSeats === 0;

                return (
                  <div
                    key={event.id}
                    onClick={() => onNavigate('eventDetails', { event })}
                    className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex gap-3 items-center group active:scale-[0.99]"
                  >
                    <img
                      src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300'}
                      alt={event.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                          {event.category}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isFull ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {isFull ? 'FULL' : `${availableSeats} seats`}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-700 transition-colors">
                        {event.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>📅 {event.date}</span>
                        <span>⏰ {event.startTime}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        📍 {event.venue}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Secondary Services List */}
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 pt-2">More Features</h3>
        <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
          <button
            onClick={() => onNavigate('calendar')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs">📅</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Event Calendar</div>
                <div className="text-[10px] text-slate-500">Schedule view on calendar dates</div>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('favorites')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs">⭐</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Favorite Events</div>
                <div className="text-[10px] text-slate-500">Bookmarked campus activities</div>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('feedback')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs">💬</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Event Feedback</div>
                <div className="text-[10px] text-slate-500">Rate attended sessions & leave review</div>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center text-xs">👤</div>
              <div>
                <div className="text-xs font-semibold text-slate-800">My Profile</div>
                <div className="text-[10px] text-slate-500">Student info, department & contact</div>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// 2. BROWSE & SEARCH EVENTS SCREEN
export const BrowseEventsScreen: React.FC<{
  onSelectEvent: (event: CollegeEvent) => void;
}> = ({ onSelectEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Symposium'];
  const allEvents = sqliteStore.getEvents();

  const todayStr = new Date().toISOString().split('T')[0];

  const distinctDates = useMemo(() => {
    return Array.from(new Set(allEvents.filter(e => e.status !== 'Cancelled' && e.status !== 'Rejected').map(e => e.date))).sort();
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(ev => {
      if (ev.status === 'Cancelled' || ev.status === 'Rejected') return false;

      // Category filter
      if (categoryFilter !== 'All' && ev.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Date filter
      if (dateFilter !== 'All') {
        if (dateFilter === 'Today') {
          if (ev.date !== todayStr) return false;
        } else if (dateFilter === 'Upcoming') {
          if (ev.date < todayStr) return false;
        } else if (ev.date !== dateFilter) {
          return false;
        }
      }

      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = ev.name.toLowerCase().includes(query);
        const matchesVenue = ev.venue.toLowerCase().includes(query);
        const matchesOrg = ev.organizer.toLowerCase().includes(query);
        const matchesCat = ev.category.toLowerCase().includes(query);
        const matchesDate = ev.date.toLowerCase().includes(query);
        return matchesName || matchesVenue || matchesOrg || matchesCat || matchesDate;
      }

      return true;
    });
  }, [allEvents, searchTerm, categoryFilter, dateFilter, todayStr]);

  return (
    <div className="p-3 overflow-y-auto max-h-full">
      {/* Search Bar */}
      <div className="relative mb-2.5">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by event name, category, venue, date..."
          className="w-full pl-8 pr-8 py-2 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white border border-transparent focus:border-blue-600 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter by Category Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Category
          </span>
          {categoryFilter !== 'All' && (
            <button 
              onClick={() => setCategoryFilter('All')} 
              className="text-[10px] text-blue-600 font-semibold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                categoryFilter.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter by Date Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Date
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800"
            >
              {showDatePicker ? 'Hide Date' : 'Calendar 📅'}
            </button>
            {dateFilter !== 'All' && (
              <button 
                onClick={() => setDateFilter('All')} 
                className="text-[10px] text-rose-600 font-semibold hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Today', 'Upcoming', ...distinctDates].map(d => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${
                dateFilter === d
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d === 'All' ? 'All Dates' : d}
            </button>
          ))}
        </div>

        {showDatePicker && (
          <div className="mt-1.5 p-2 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center gap-2">
            <input
              type="date"
              value={dateFilter.match(/^\d{4}-\d{2}-\d{2}$/) ? dateFilter : ''}
              onChange={e => setDateFilter(e.target.value || 'All')}
              className="flex-1 px-2 py-1 bg-white border border-indigo-200 rounded-lg text-xs text-slate-800 focus:outline-none"
            />
            {dateFilter !== 'All' && (
              <button
                onClick={() => setDateFilter('All')}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 px-0.5">
        <span>Showing {filteredEvents.length} events</span>
        {(searchTerm || categoryFilter !== 'All' || dateFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('All');
              setDateFilter('All');
              setShowDatePicker(false);
            }}
            className="text-[10px] text-rose-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No events match your criteria.
          </div>
        ) : (
          filteredEvents.map(event => {
            const availableSeats = Math.max(0, event.capacity - event.registeredCount);
            const isFull = availableSeats === 0;

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
              >
                <div className="h-28 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60'}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900/90 text-white backdrop-blur-xs">
                      {event.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs ${
                      isFull ? 'bg-red-600 text-white' : 'bg-emerald-600/90 text-white'
                    }`}>
                      {isFull ? 'FULL (Waitlist)' : `${availableSeats} Seats Left`}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{event.name}</h4>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {event.date} • {event.startTime}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 truncate">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

// 3. EVENT DETAILS SCREEN
export const EventDetailsScreen: React.FC<{
  event: CollegeEvent;
  student?: Student;
  onNavigate: (screen: string, params?: any) => void;
}> = ({ event, student, onNavigate }) => {
  const [isFav, setIsFav] = useState(() => student ? sqliteStore.isFavorite(student.id, event.id) : false);
  const [shareNotice, setShareNotice] = useState(false);

  const availableSeats = Math.max(0, event.capacity - event.registeredCount);
  const isFull = availableSeats === 0;

  const userRegistrations = sqliteStore.getRegistrations();
  const alreadyRegistered = student ? userRegistrations.some(r => r.studentId === student.id && r.eventId === event.id && r.status === 'REGISTERED') : false;

  const today = new Date().toISOString().split('T')[0];
  const registrationClosed = event.registrationDeadline && today > event.registrationDeadline;

  const toggleFav = () => {
    if (student) {
      const next = sqliteStore.toggleFavorite(student.id, event.id);
      setIsFav(next);
    }
  };

  const handleShare = () => {
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2500);
  };

  return (
    <div className="overflow-y-auto max-h-full pb-6">
      <div className="h-44 w-full relative bg-slate-900">
        <img
          src={event.poster || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={toggleFav}
            className="p-2 bg-white/80 hover:bg-white rounded-full text-amber-500 shadow-md transition-all active:scale-90"
          >
            <Star size={16} fill={isFav ? '#f59e0b' : 'none'} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/80 hover:bg-white rounded-full text-slate-700 shadow-md transition-all active:scale-90"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {shareNotice && (
        <div className="m-3 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>📋 Event link and details copied for sharing!</span>
        </div>
      )}

      <div className="p-4 space-y-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={event.category} />
            <span className="text-[10px] font-semibold text-slate-500">Status: {event.status}</span>
          </div>
          <h2 className="text-base font-extrabold text-slate-900 leading-snug">{event.name}</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Organized by {event.organizer}</p>
        </div>

        {/* Available seats indicator */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Capacity & Seats</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {event.registeredCount} Registered / {event.capacity} Total
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
              isFull ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isFull ? 'FULL' : `${availableSeats} Available`}
            </span>
          </div>
        </div>

        {/* Event Schedule Info */}
        <div className="space-y-2 bg-white border border-slate-200 rounded-xl p-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <CalendarIcon size={14} className="text-blue-600 shrink-0" />
            <span><strong>Date:</strong> {event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Clock size={14} className="text-blue-600 shrink-0" />
            <span><strong>Time:</strong> {event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin size={14} className="text-blue-600 shrink-0" />
            <span><strong>Venue:</strong> {event.venue}</span>
          </div>
          {event.registrationDeadline && (
            <div className="flex items-center gap-2 text-slate-700">
              <Clock size={14} className="text-amber-600 shrink-0" />
              <span><strong>Deadline:</strong> {event.registrationDeadline}</span>
            </div>
          )}
        </div>

        {/* Online meeting button if available */}
        {event.meetingLink && (
          <a
            href={event.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Join Online Meeting</span>
          </a>
        )}

        <div>
          <h4 className="text-xs font-bold text-slate-700 mb-1">About This Event</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
            {event.description}
          </p>
        </div>

        {/* Register CTA Button */}
        {alreadyRegistered ? (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-2">
            <div className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle size={16} />
              <span>You are registered for this event!</span>
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onNavigate('digitalPass')}
                className="px-3 py-1 bg-blue-700 text-white rounded-lg text-[11px] font-bold shadow-xs"
              >
                View Digital Pass 🎟️
              </button>
              <button
                onClick={() => sqliteStore.triggerReminderPush(event.id, `starts in 1 hour (${event.startTime})`)}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
                title="Simulate Android NotificationManager Event Reminder"
              >
                <span>⏰ Test Reminder Alert</span>
              </button>
            </div>
          </div>
        ) : registrationClosed ? (
          <div className="p-3 bg-slate-100 text-slate-500 rounded-xl text-center text-xs font-bold">
            Registration has closed for this event.
          </div>
        ) : (
          <button
            onClick={() => onNavigate('eventRegistration', { event })}
            className={`w-full py-3 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] ${
              isFull 
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' 
                : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20'
            }`}
          >
            {isFull ? 'Event Full — Join Waiting List 📋' : 'Proceed to Registration 🎟️'}
          </button>
        )}
      </div>
    </div>
  );
};

// 4. EVENT REGISTRATION CONFIRMATION SCREEN
export const EventRegistrationScreen: React.FC<{
  event: CollegeEvent;
  student?: Student;
  onNavigate: (screen: string, params?: any) => void;
}> = ({ event, student, onNavigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    if (!student) return;
    setIsProcessing(true);

    setTimeout(() => {
      const res = sqliteStore.registerForEvent(student.id, event.id);
      setIsProcessing(false);
      if (res.success) {
        onNavigate('digitalPass', { eventId: event.id });
      } else {
        alert(res.message);
      }
    }, 400);
  };

  return (
    <div className="p-4 flex flex-col justify-between min-h-full">
      <div>
        <div className="text-center my-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
            <Ticket size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-800">Confirm Registration</h2>
          <p className="text-xs text-slate-500">Review your student registration details</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 my-4">
          <div className="border-b border-slate-100 pb-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Student Name</div>
            <div className="text-xs font-bold text-slate-800">{student?.name}</div>
          </div>
          <div className="border-b border-slate-100 pb-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Register Number</div>
            <div className="text-xs font-bold text-slate-800 font-mono">{student?.registerNumber}</div>
          </div>
          <div className="border-b border-slate-100 pb-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Event Title</div>
            <div className="text-xs font-bold text-blue-900">{event.name}</div>
          </div>
          <div className="border-b border-slate-100 pb-2">
            <div className="text-[10px] uppercase font-bold text-slate-400">Date & Venue</div>
            <div className="text-xs font-medium text-slate-700">{event.date} at {event.venue}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Seat Allocation</div>
            <div className="text-xs font-semibold text-emerald-700">Instant Digital Pass Confirmed</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? 'Confirming with SQLite...' : 'Confirm & Generate Pass 🎟️'}
        </button>
        <button
          onClick={() => onNavigate('eventDetails', { event })}
          className="w-full py-2 text-xs text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// 5. DIGITAL PASS SCREEN WITH QR
export const DigitalPassScreen: React.FC<{
  student?: Student;
  eventId?: number;
  onNavigate: (screen: string) => void;
}> = ({ student, eventId, onNavigate }) => {
  const registrations = sqliteStore.getRegistrations();
  const events = sqliteStore.getEvents();

  // Find target or latest registration
  const targetReg = eventId 
    ? registrations.find(r => r.studentId === student?.id && r.eventId === eventId && r.status === 'REGISTERED')
    : registrations.filter(r => r.studentId === student?.id && r.status === 'REGISTERED').slice(-1)[0];

  const targetEvent = targetReg ? events.find(e => e.id === targetReg.eventId) : null;

  if (!targetReg || !targetEvent) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <Ticket size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-700">No Active Pass</h3>
        <p className="text-xs text-slate-500 mt-1">You do not have any confirmed registrations yet.</p>
        <button
          onClick={() => onNavigate('browseEvents')}
          className="mt-4 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-xl border border-blue-800/80 text-center relative overflow-hidden">
        {/* Pass Top Branding */}
        <div className="flex items-center justify-between text-[10px] tracking-widest uppercase font-bold text-blue-200 border-b border-blue-800/60 pb-2 mb-3">
          <span>NIET • Autonomous Campus</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle size={11} /> Verified Entry
          </span>
        </div>

        <h2 className="text-base font-black tracking-tight text-white">DIGITAL EVENT PASS</h2>
        <p className="text-[11px] text-blue-200/80 mt-0.5">Official Student Admission Credential</p>

        {/* Verified Pass Badge Container (Replaces QR) */}
        <div className="my-4 py-4 px-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xs flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-2.5">
            <ShieldCheck size={30} />
          </div>
          <div className="text-[11px] font-semibold text-emerald-300 tracking-wide uppercase">
            Admission Authorized
          </div>
          <div className="mt-2 bg-blue-950/80 rounded-xl py-1.5 px-4 font-mono text-xs font-bold text-blue-200 border border-blue-700/60 shadow-inner">
            PASS ID: {targetReg.registrationId}
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5">
            Admit 1 Student • Non-Transferable Pass
          </div>
        </div>

        {/* Dashed divider */}
        <div className="my-3 border-t-2 border-dashed border-blue-700/60 relative">
          <div className="absolute -left-7 -top-2.5 w-5 h-5 bg-slate-100 rounded-full" />
          <div className="absolute -right-7 -top-2.5 w-5 h-5 bg-slate-100 rounded-full" />
        </div>

        {/* Student & Event Credentials */}
        <div className="text-left space-y-2 text-xs">
          <div>
            <div className="text-[10px] text-blue-300 uppercase font-semibold">Event</div>
            <div className="font-bold text-white text-sm">{targetEvent.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Student</div>
              <div className="font-bold text-white">{student?.name}</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Reg No</div>
              <div className="font-mono text-white font-semibold">{student?.registerNumber}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Date & Time</div>
              <div className="text-white text-[11px]">{targetEvent.date} ({targetEvent.startTime})</div>
            </div>
            <div>
              <div className="text-[10px] text-blue-300 uppercase font-semibold">Venue</div>
              <div className="text-white text-[11px] truncate">{targetEvent.venue}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => {
            alert('Event Pass shared via Android Intent: ' + targetReg.registrationId);
          }}
          className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
        >
          <Share2 size={14} />
          <span>Share Pass</span>
        </button>
        <button
          onClick={() => onNavigate('myEvents')}
          className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
        >
          My Events
        </button>
      </div>
    </div>
  );
};

// 6. MY EVENTS SCREEN (UPCOMING, COMPLETED, CANCELLED, WAITLISTED)
export const MyEventsScreen: React.FC<{
  student?: Student;
  onNavigate: (screen: string, params?: any) => void;
}> = ({ student, onNavigate }) => {
  const [tab, setTab] = useState<'Upcoming' | 'Completed' | 'Cancelled' | 'Waitlisted'>('Upcoming');
  const [, setTick] = useState(0);

  const registrations = sqliteStore.getRegistrations().filter(r => r.studentId === student?.id);
  const waitlists = sqliteStore.getWaitlist().filter(w => w.studentId === student?.id && w.status === 'WAITING');
  const events = sqliteStore.getEvents();

  const handleCancel = (eventId: number) => {
    if (!student) return;
    if (confirm('Are you sure you want to cancel this registration? A seat will open up for the waitlist.')) {
      const res = sqliteStore.cancelRegistration(student.id, eventId);
      alert(res.message);
      setTick(t => t + 1);
    }
  };

  return (
    <div className="p-3 overflow-y-auto max-h-full">
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
        {(['Upcoming', 'Completed', 'Waitlisted', 'Cancelled'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
              tab === t ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Waitlisted' ? (
        <div className="space-y-2.5">
          {waitlists.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">No waitlisted events.</div>
          ) : (
            waitlists.map(w => {
              const ev = events.find(e => e.id === w.eventId);
              return (
                <div key={w.id} className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                      Waitlist Position #{w.position}
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold">Pending Seat Opening</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 mt-1.5">{ev?.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Date: {ev?.date} • {ev?.venue}</p>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {registrations
            .filter(r => {
              const ev = events.find(e => e.id === r.eventId);
              if (tab === 'Cancelled') return r.status === 'CANCELLED';
              if (tab === 'Completed') return r.status === 'REGISTERED' && ev?.status === 'Completed';
              return r.status === 'REGISTERED' && ev?.status !== 'Completed';
            })
            .map(reg => {
              const ev = events.find(e => e.id === reg.eventId);
              if (!ev) return null;

              return (
                <div key={reg.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                      {reg.registrationId}
                    </span>
                    <StatusBadge status={reg.status === 'CANCELLED' ? 'Cancelled' : ev.status} />
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{ev.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">📅 {ev.date} at {ev.startTime}</p>
                    <p className="text-[11px] text-slate-500">📍 {ev.venue}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {reg.status === 'REGISTERED' && (
                      <button
                        onClick={() => onNavigate('digitalPass', { eventId: ev.id })}
                        className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <Ticket size={13} />
                        <span>View Pass</span>
                      </button>
                    )}

                    {tab === 'Upcoming' && (
                      <button
                        onClick={() => handleCancel(ev.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                      >
                        Cancel Registration
                      </button>
                    )}

                    {tab === 'Completed' && (
                      <button
                        onClick={() => onNavigate('feedback', { eventId: ev.id })}
                        className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare size={13} />
                        <span>Leave Feedback</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

// 7. CERTIFICATES & VERIFICATION SCREEN
export const CertificatesScreen: React.FC<{
  student?: Student;
}> = ({ student }) => {
  const [verifyId, setVerifyId] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; data?: any } | null>(null);

  const certificates = sqliteStore.getCertificates(student?.id);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId.trim()) return;
    const res = sqliteStore.verifyCertificate(verifyId.trim());
    if (res) {
      setVerifyResult({ valid: true, data: res });
    } else {
      setVerifyResult({ valid: false });
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">My Certificates</h3>
        {certificates.length === 0 ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
            No certificates issued yet. Complete an event and verify attendance to receive your certificate.
          </div>
        ) : (
          certificates.map(cert => (
            <div
              key={cert.id}
              className="bg-[#FFFDF7] border-2 border-amber-300 rounded-2xl p-4 shadow-sm text-center space-y-2 relative"
            >
              <div className="text-2xl">🏛️</div>
              <div className="text-[10px] font-bold tracking-widest text-blue-900 uppercase">
                National Institute of Engineering & Technology
              </div>
              <div className="text-xs font-extrabold text-amber-800 tracking-tight">
                CERTIFICATE OF PARTICIPATION
              </div>
              <div className="text-[10px] text-slate-500">This is proudly presented to</div>
              <div className="text-sm font-extrabold text-slate-900">{cert.studentName}</div>
              <div className="text-[10px] text-slate-500">for successfully participating in</div>
              <div className="text-xs font-bold text-blue-950">{cert.eventName}</div>
              <div className="text-[10px] text-slate-400">Date: {cert.eventDate}</div>
              <div className="pt-2 border-t border-amber-100 flex justify-between items-center text-[10px] text-amber-900 font-mono font-bold">
                <span>{cert.certificateId}</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">VALID</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Certificate Verification tool */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={16} className="text-blue-700" />
          <h4 className="text-xs font-bold text-slate-800">Public Certificate Verification</h4>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Enter any Certificate ID issued by the college to authenticate validity.
        </p>

        <form onSubmit={handleVerify} className="flex gap-2">
          <input
            type="text"
            value={verifyId}
            onChange={e => setVerifyId(e.target.value)}
            placeholder="e.g. CERT-COL-2026-1-6"
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Verify
          </button>
        </form>

        {verifyResult && (
          <div className={`mt-3 p-3 rounded-xl text-xs border ${
            verifyResult.valid 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {verifyResult.valid ? (
              <div>
                <div className="font-bold flex items-center gap-1 text-emerald-700">
                  <CheckCircle size={14} /> VALID CERTIFICATE
                </div>
                <div className="mt-1 text-[11px]">
                  <strong>Student:</strong> {verifyResult.data.studentName}<br/>
                  <strong>Event:</strong> {verifyResult.data.eventName}<br/>
                  <strong>Issue Date:</strong> {verifyResult.data.issueDate}
                </div>
              </div>
            ) : (
              <div className="font-bold flex items-center gap-1 text-rose-700">
                <AlertTriangle size={14} /> INVALID CERTIFICATE: Record not found in college SQLite database.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 8. EVENT FEEDBACK SCREEN
export const FeedbackScreen: React.FC<{
  student?: Student;
  eventId?: number;
}> = ({ student, eventId: initialEventId }) => {
  const [selectedEventId, setSelectedEventId] = useState<number>(initialEventId || 1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const completedEvents = sqliteStore.getEvents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    if (!comment.trim()) {
      setStatus({ text: 'Please write your feedback comment.', isError: true });
      return;
    }

    const res = sqliteStore.submitFeedback(student.id, Number(selectedEventId), rating, comment.trim());
    if (res.success) {
      setStatus({ text: res.message, isError: false });
      setComment('');
    } else {
      setStatus({ text: res.message, isError: true });
    }
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-800">Event Feedback</h2>
        <p className="text-xs text-slate-500">Help organizers improve future campus events</p>
      </div>

      {status && (
        <div className={`p-3 text-xs rounded-xl mb-4 border ${status.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
          {status.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Select Event</label>
          <select
            value={selectedEventId}
            onChange={e => setSelectedEventId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          >
            {completedEvents.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({e.date})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Your Rating</label>
          <div className="flex gap-2 text-2xl py-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`transition-transform active:scale-90 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
            <span className="text-xs font-bold text-slate-600 self-center ml-2">{rating} / 5 Stars</span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">Review & Suggestions</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={4}
            placeholder="Share what you liked, venue arrangements, guest speakers..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs shadow-md"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

// 9. CALENDAR SCREEN
export const CalendarScreen: React.FC<{
  onSelectEvent: (event: CollegeEvent) => void;
}> = ({ onSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-10');
  const events = sqliteStore.getEvents();

  const scheduledEvents = events.filter(e => e.date === selectedDate);

  // Distinct dates with events
  const dates = Array.from(new Set(events.map(e => e.date))).sort();

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Event Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dates.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`p-2.5 rounded-xl border text-center min-w-[70px] shrink-0 transition-all ${
                selectedDate === d
                  ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-[10px] uppercase font-bold opacity-80">{d.slice(5, 7)} / {d.slice(8, 10)}</div>
              <div className="text-xs font-extrabold mt-0.5">{d.slice(8, 10)}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Scheduled on {selectedDate} ({scheduledEvents.length})
        </h3>
        <div className="space-y-2.5">
          {scheduledEvents.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-400">
              No events scheduled on this date.
            </div>
          ) : (
            scheduledEvents.map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e)}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {e.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {e.startTime} - {e.endTime}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{e.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1">📍 {e.venue}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 10. NOTIFICATIONS SCREEN
export const NotificationsScreen: React.FC<{
  user: User;
}> = ({ user }) => {
  const notifs = sqliteStore.getUserNotifications(user.id);

  return (
    <div className="p-4 overflow-y-auto max-h-full space-y-2.5">
      {notifs.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">No notifications yet.</div>
      ) : (
        notifs.map(n => (
          <div
            key={n.id}
            onClick={() => sqliteStore.markNotificationAsRead(n.id)}
            className={`p-3.5 rounded-2xl border transition-all ${
              n.isRead ? 'bg-white border-slate-200' : 'bg-blue-50/70 border-blue-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">{n.title}</span>
              <span className="text-[10px] text-slate-400">{n.date}</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

// 11. PROFILE SCREEN
export const ProfileScreen: React.FC<{
  student?: Student;
}> = ({ student }) => {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(student?.phone || '');
  const [email, setEmail] = useState(student?.email || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;
    sqliteStore.updateStudentProfile(student.id, { phone, email });
    setEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="p-4 overflow-y-auto max-h-full">
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm text-center mb-4">
        <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-2">
          {student?.name?.charAt(0) || 'S'}
        </div>
        <h3 className="font-bold text-sm text-slate-800">{student?.name}</h3>
        <p className="text-xs text-slate-500 font-mono">Reg No: {student?.registerNumber}</p>
        <p className="text-xs text-blue-700 font-medium mt-0.5">{student?.department}</p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl mb-3">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Year of Study</label>
          <input
            type="text"
            disabled
            value={student?.year || ''}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600"
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Email Address</label>
          <input
            type="email"
            disabled={!editing}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl text-xs text-slate-800 ${editing ? 'bg-white border-blue-500' : 'bg-slate-50 border-slate-200'}`}
          />
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Phone Number</label>
          <input
            type="tel"
            disabled={!editing}
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl text-xs text-slate-800 ${editing ? 'bg-white border-blue-500' : 'bg-slate-50 border-slate-200'}`}
          />
        </div>

        {editing ? (
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="w-full mt-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
          >
            Edit Profile
          </button>
        )}
      </form>
    </div>
  );
};
