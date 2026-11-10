export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT';

export interface User {
  id: number;
  username: string;
  password?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Student {
  id: number;
  userId: number;
  name: string;
  registerNumber: string;
  department: string;
  year: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface Staff {
  id: number;
  userId: number;
  name: string;
  staffId: string;
  department: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Symposium' | 'Other';
export type EventType = 'Online' | 'Offline' | 'Hybrid';
export type EventStatus = 'Pending' | 'Approved' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Rejected';

export interface CollegeEvent {
  id: number;
  name: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  venue: string;
  eventType: EventType;
  organizer: string;
  capacity: number;
  registeredCount: number;
  registrationDeadline: string; // YYYY-MM-DD
  poster: string;
  meetingLink?: string;
  status: EventStatus;
  createdBy: number; // staff/admin userId
  createdByName?: string;
}

export interface Registration {
  id: number;
  studentId: number;
  eventId: number;
  registrationId: string; // e.g. REG-2026-1001
  registrationDate: string;
  status: 'REGISTERED' | 'CANCELLED';
  studentName?: string;
  registerNumber?: string;
  department?: string;
  eventName?: string;
  eventDate?: string;
  venue?: string;
}

export interface Waitlist {
  id: number;
  studentId: number;
  eventId: number;
  position: number;
  status: 'WAITING' | 'PROMOTED' | 'CANCELLED';
  studentName?: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  eventId: number;
  checkIn: string; // Timestamp
  checkOut?: string; // Timestamp
  status: 'Present' | 'Absent';
  studentName?: string;
  registerNumber?: string;
  department?: string;
}

export interface Feedback {
  id: number;
  studentId: number;
  eventId: number;
  rating: number; // 1-5
  comment: string;
  date: string;
  studentName?: string;
}

export interface Certificate {
  id: number;
  studentId: number;
  eventId: number;
  certificateId: string; // e.g. CERT-COL-2026-8941
  issueDate: string;
  status: 'VALID' | 'REVOKED';
  studentName?: string;
  eventName?: string;
  eventDate?: string;
  organizer?: string;
}

export interface NotificationItem {
  id: number;
  userId: number; // 0 for broadcast, or specific user ID
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  role: string;
  action: string;
  date: string;
  time: string;
}
