package com.example.eventmanagementapp.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "CollegeEventDB.db";
    private static final int DATABASE_VERSION = 1;

    // Table Names
    public static final String TABLE_USERS = "users";
    public static final String TABLE_STUDENTS = "students";
    public static final String TABLE_STAFF = "staff";
    public static final String TABLE_EVENTS = "events";
    public static final String TABLE_REGISTRATIONS = "registrations";
    public static final String TABLE_WAITLIST = "waitlist";
    public static final String TABLE_FAVORITES = "favorites";
    public static final String TABLE_ATTENDANCE = "attendance";
    public static final String TABLE_FEEDBACK = "feedback";
    public static final String TABLE_CERTIFICATES = "certificates";
    public static final String TABLE_EVENT_GALLERY = "event_gallery";
    public static final String TABLE_NOTIFICATIONS = "notifications";
    public static final String TABLE_ACTIVITY_LOGS = "activity_logs";

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // 1. Users Table
        db.execSQL("CREATE TABLE " + TABLE_USERS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "username TEXT UNIQUE NOT NULL, " +
                "password TEXT NOT NULL, " +
                "role TEXT NOT NULL, " +
                "status TEXT DEFAULT 'ACTIVE')");

        // 2. Students Table
        db.execSQL("CREATE TABLE " + TABLE_STUDENTS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "user_id INTEGER, " +
                "name TEXT NOT NULL, " +
                "register_number TEXT UNIQUE NOT NULL, " +
                "department TEXT NOT NULL, " +
                "year TEXT NOT NULL, " +
                "email TEXT UNIQUE NOT NULL, " +
                "phone TEXT NOT NULL, " +
                "FOREIGN KEY(user_id) REFERENCES " + TABLE_USERS + "(id) ON DELETE CASCADE)");

        // 3. Staff Table
        db.execSQL("CREATE TABLE " + TABLE_STAFF + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "user_id INTEGER, " +
                "name TEXT NOT NULL, " +
                "staff_id TEXT UNIQUE NOT NULL, " +
                "department TEXT NOT NULL, " +
                "email TEXT UNIQUE NOT NULL, " +
                "phone TEXT NOT NULL, " +
                "status TEXT DEFAULT 'ACTIVE', " +
                "FOREIGN KEY(user_id) REFERENCES " + TABLE_USERS + "(id) ON DELETE CASCADE)");

        // 4. Events Table
        db.execSQL("CREATE TABLE " + TABLE_EVENTS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "name TEXT NOT NULL, " +
                "description TEXT, " +
                "category TEXT NOT NULL, " +
                "date TEXT NOT NULL, " +
                "start_time TEXT NOT NULL, " +
                "end_time TEXT NOT NULL, " +
                "venue TEXT NOT NULL, " +
                "event_type TEXT NOT NULL, " +
                "organizer TEXT NOT NULL, " +
                "capacity INTEGER NOT NULL, " +
                "registration_deadline TEXT NOT NULL, " +
                "poster TEXT, " +
                "meeting_link TEXT, " +
                "status TEXT DEFAULT 'Pending', " +
                "created_by INTEGER)");

        // 5. Registrations Table
        db.execSQL("CREATE TABLE " + TABLE_REGISTRATIONS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL, " +
                "registration_id TEXT UNIQUE NOT NULL, " +
                "registration_date TEXT NOT NULL, " +
                "status TEXT DEFAULT 'REGISTERED', " +
                "FOREIGN KEY(student_id) REFERENCES " + TABLE_STUDENTS + "(id), " +
                "FOREIGN KEY(event_id) REFERENCES " + TABLE_EVENTS + "(id))");

        // 6. Waitlist Table
        db.execSQL("CREATE TABLE " + TABLE_WAITLIST + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL, " +
                "position INTEGER NOT NULL, " +
                "status TEXT DEFAULT 'WAITING')");

        // 7. Favorites Table
        db.execSQL("CREATE TABLE " + TABLE_FAVORITES + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL)");

        // 8. Attendance Table (Check-in & Check-out)
        db.execSQL("CREATE TABLE " + TABLE_ATTENDANCE + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL, " +
                "check_in TEXT NOT NULL, " +
                "check_out TEXT, " +
                "status TEXT DEFAULT 'Present')");

        // 9. Feedback Table
        db.execSQL("CREATE TABLE " + TABLE_FEEDBACK + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL, " +
                "rating INTEGER NOT NULL, " +
                "comment TEXT, " +
                "date TEXT NOT NULL)");

        // 10. Certificates Table
        db.execSQL("CREATE TABLE " + TABLE_CERTIFICATES + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "student_id INTEGER NOT NULL, " +
                "event_id INTEGER NOT NULL, " +
                "certificate_id TEXT UNIQUE NOT NULL, " +
                "issue_date TEXT NOT NULL, " +
                "status TEXT DEFAULT 'VALID')");

        // 11. Event Gallery Table
        db.execSQL("CREATE TABLE " + TABLE_EVENT_GALLERY + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "event_id INTEGER NOT NULL, " +
                "image_path TEXT NOT NULL, " +
                "caption TEXT)");

        // 12. Notifications Table
        db.execSQL("CREATE TABLE " + TABLE_NOTIFICATIONS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "user_id INTEGER NOT NULL, " +
                "title TEXT NOT NULL, " +
                "message TEXT NOT NULL, " +
                "date TEXT NOT NULL, " +
                "is_read INTEGER DEFAULT 0)");

        // 13. Activity Logs Table
        db.execSQL("CREATE TABLE " + TABLE_ACTIVITY_LOGS + " (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "user_id INTEGER, " +
                "action TEXT NOT NULL, " +
                "date TEXT NOT NULL, " +
                "time TEXT NOT NULL)");

        // Insert Default Seed Data
        seedDefaultData(db);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ACTIVITY_LOGS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_NOTIFICATIONS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_EVENT_GALLERY);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_CERTIFICATES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_FEEDBACK);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ATTENDANCE);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_FAVORITES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_WAITLIST);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_REGISTRATIONS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_EVENTS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_STAFF);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_STUDENTS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        onCreate(db);
    }

    private void seedDefaultData(SQLiteDatabase db) {
        // Users: student / 1234, staff / 1234, admin / admin123
        db.execSQL("INSERT INTO " + TABLE_USERS + " (id, username, password, role) VALUES (1, 'student', '1234', 'STUDENT')");
        db.execSQL("INSERT INTO " + TABLE_USERS + " (id, username, password, role) VALUES (2, 'staff', '1234', 'STAFF')");
        db.execSQL("INSERT INTO " + TABLE_USERS + " (id, username, password, role) VALUES (3, 'admin', 'admin123', 'ADMIN')");

        // Student Profile
        db.execSQL("INSERT INTO " + TABLE_STUDENTS + " (id, user_id, name, register_number, department, year, email, phone) " +
                "VALUES (1, 1, 'Monika Sivakumar', '927625MCA026', 'Master of Computer Applications', 'Final Year (II)', 'monikasivakumarm@gmail.com', '9876543210')");

        // Staff Profile
        db.execSQL("INSERT INTO " + TABLE_STAFF + " (id, user_id, name, staff_id, department, email, phone) " +
                "VALUES (1, 2, 'S.Priyadharshini', 'STF-MCA-104', 'Master of Computer Applications', 'priyadharshini.mca@college.edu', '9443219876')");

        // Sample Events
        db.execSQL("INSERT INTO " + TABLE_EVENTS + " (id, name, description, category, date, start_time, end_time, venue, event_type, organizer, capacity, registration_deadline, poster, meeting_link, status, created_by) " +
                "VALUES (1, 'Technical Symposium 2026', 'Inter-collegiate national fest with coding, robotics and web-dev battle.', 'Technical', '2026-10-10', '09:30', '16:30', 'Main Auditorium', 'Offline', 'Dept. of CSE', 100, '2026-10-09', '', '', 'Upcoming', 2)");

        db.execSQL("INSERT INTO " + TABLE_EVENTS + " (id, name, description, category, date, start_time, end_time, venue, event_type, organizer, capacity, registration_deadline, poster, meeting_link, status, created_by) " +
                "VALUES (2, 'Cultural Fest 2026', 'Annual cultural festival with music bands, choreography, and solo singing.', 'Cultural', '2026-10-15', '10:00', '18:00', 'College Ground', 'Offline', 'Fine Arts Council', 200, '2026-10-14', '', '', 'Upcoming', 2)");

        db.execSQL("INSERT INTO " + TABLE_EVENTS + " (id, name, description, category, date, start_time, end_time, venue, event_type, organizer, capacity, registration_deadline, poster, meeting_link, status, created_by) " +
                "VALUES (3, 'AI & Robotics Hands-on Workshop', 'Comprehensive practical session on edge AI, ROS and embedded controllers.', 'Workshop', '2026-10-22', '10:00', '16:00', 'Robotics Lab 3', 'Hybrid', 'IEEE Student Branch', 40, '2026-10-21', '', 'https://meet.google.com/xyz', 'Upcoming', 2)");

        db.execSQL("INSERT INTO " + TABLE_EVENTS + " (id, name, description, category, date, start_time, end_time, venue, event_type, organizer, capacity, registration_deadline, poster, meeting_link, status, created_by) " +
                "VALUES (4, 'Inter-College Sports Championship', 'Knockout badminton and volleyball tournaments with prizes.', 'Sports', '2026-10-28', '08:00', '15:00', 'Indoor Sports Complex', 'Offline', 'Dept. of Physical Education', 50, '2026-10-27', '', '', 'Upcoming', 2)");

        // Initial Registration
        db.execSQL("INSERT INTO " + TABLE_REGISTRATIONS + " (student_id, event_id, registration_id, registration_date, status) " +
                "VALUES (1, 1, 'REG-2026-1001-4018', '2026-09-25 14:00:00', 'REGISTERED')");

        // Seed Notification
        db.execSQL("INSERT INTO " + TABLE_NOTIFICATIONS + " (user_id, title, message, date, is_read) " +
                "VALUES (1, 'Registration Confirmed', 'Your pass for Technical Symposium 2026 is ready.', '2026-09-25 14:00', 0)");

        // Seed Activity Log
        db.execSQL("INSERT INTO " + TABLE_ACTIVITY_LOGS + " (user_id, action, date, time) " +
                "VALUES (3, 'System initialized with preloaded events and credentials', '2026-10-01', '00:00:00')");
    }

    // Helper: Check Venue Conflict (Same venue, same date, overlapping time)
    public boolean hasVenueConflict(String venue, String date, String startTime, String endTime, int excludeEventId) {
        SQLiteDatabase db = this.getReadableDatabase();
        String query = "SELECT id, start_time, end_time FROM " + TABLE_EVENTS +
                " WHERE venue = ? AND date = ? AND status != 'Cancelled' AND status != 'Rejected'";
        Cursor cursor = db.rawQuery(query, new String[]{venue, date});

        boolean conflict = false;
        while (cursor.moveToNext()) {
            int id = cursor.getInt(0);
            if (excludeEventId > 0 && id == excludeEventId) continue;
            String evStart = cursor.getString(1);
            String evEnd = cursor.getString(2);

            if (isTimeOverlapping(startTime, endTime, evStart, evEnd)) {
                conflict = true;
                break;
            }
        }
        cursor.close();
        return conflict;
    }

    private boolean isTimeOverlapping(String start1, String end1, String start2, String end2) {
        int s1 = timeToMinutes(start1);
        int e1 = timeToMinutes(end1);
        int s2 = timeToMinutes(start2);
        int e2 = timeToMinutes(end2);
        return (s1 < e2 && e1 > s2);
    }

    private int timeToMinutes(String time) {
        String[] parts = time.split(":");
        return Integer.parseInt(parts[0]) * 60 + Integer.parseInt(parts[1]);
    }

    // Log Activity Helper
    public void logActivity(int userId, String action) {
        SQLiteDatabase db = this.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("user_id", userId);
        cv.put("action", action);
        cv.put("date", new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date()));
        cv.put("time", new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date()));
        db.insert(TABLE_ACTIVITY_LOGS, null, cv);
    }
}
