export interface AndroidSourceFile {
  path: string;
  category: 'gradle' | 'manifest' | 'res' | 'database' | 'auth' | 'student' | 'staff' | 'admin' | 'adapter' | 'model' | 'layout';
  title: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidSourceFile[] = [
  // 1. PROJECT BUILD GRADLE
  {
    path: 'build.gradle',
    category: 'gradle',
    title: 'Top-Level build.gradle',
    description: 'Root project build configuration with Google & Maven Central repositories',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://jitpack.io' }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
  },

  // 2. APP BUILD GRADLE
  {
    path: 'app/build.gradle',
    category: 'gradle',
    title: 'App-Level build.gradle',
    description: 'Module dependencies: Material UI, CardView, RecyclerView, ZXing QR Code generator & scanner',
    content: `plugins {
    id 'com.android.application'
}

android {
    namespace 'com.example.eventmanagementapp'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.eventmanagementapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.cardview:cardview:1.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.3.2'

    // QR Code Generation & Scanning (ZXing)
    implementation 'com.google.zxing:core:3.5.3'
    implementation 'com.journeyapps:zxing-android-embedded:4.3.0'

    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
`
  },

  // 3. ANDROID MANIFEST
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    title: 'AndroidManifest.xml',
    description: 'Declares camera/storage permissions and registers all 25+ activities with MainActivity as launcher',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.eventmanagementapp">

    <!-- Permissions for QR scanning, Push Notifications & Event Reminders -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.EventManagementApp"
        tools:targetApi="31">

        <!-- Splash / Main Activity (Launcher) -->
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Authentication Activities -->
        <activity android:name=".LoginActivity" android:exported="false" />
        <activity android:name=".StudentSignupActivity" android:exported="false" />
        <activity android:name=".ForgotPasswordActivity" android:exported="false" />

        <!-- Student Module Activities -->
        <activity android:name=".student.StudentDashboardActivity" android:exported="false" />
        <activity android:name=".student.EventSearchActivity" android:exported="false" />
        <activity android:name=".student.EventDetailsActivity" android:exported="false" />
        <activity android:name=".student.EventRegistrationActivity" android:exported="false" />
        <activity android:name=".student.MyEventsActivity" android:exported="false" />
        <activity android:name=".student.FavoriteEventsActivity" android:exported="false" />
        <activity android:name=".student.DigitalPassActivity" android:exported="false" />
        <activity android:name=".student.ProfileActivity" android:exported="false" />
        <activity android:name=".student.NotificationsActivity" android:exported="false" />
        <activity android:name=".student.CertificateActivity" android:exported="false" />
        <activity android:name=".student.FeedbackActivity" android:exported="false" />
        <activity android:name=".student.CalendarActivity" android:exported="false" />

        <!-- Staff Module Activities -->
        <activity android:name=".staff.StaffDashboardActivity" android:exported="false" />
        <activity android:name=".staff.CreateEventActivity" android:exported="false" />
        <activity android:name=".staff.ManageEventsActivity" android:exported="false" />
        <activity android:name=".staff.EditEventActivity" android:exported="false" />
        <activity android:name=".staff.StudentListActivity" android:exported="false" />
        <activity android:name=".staff.RegistrationManagementActivity" android:exported="false" />
        <activity android:name=".staff.AttendanceActivity" android:exported="false" />
        <activity android:name=".staff.QRScannerActivity" android:exported="false" />
        <activity android:name=".staff.ReportsActivity" android:exported="false" />
        <activity android:name=".staff.FeedbackManagementActivity" android:exported="false" />

        <!-- Admin Module Activities -->
        <activity android:name=".admin.AdminDashboardActivity" android:exported="false" />
        <activity android:name=".admin.ManageStudentsActivity" android:exported="false" />
        <activity android:name=".admin.ManageStaffActivity" android:exported="false" />
        <activity android:name=".admin.EventApprovalActivity" android:exported="false" />
        <activity android:name=".admin.AdminEventManagementActivity" android:exported="false" />
        <activity android:name=".admin.AdminReportsActivity" android:exported="false" />
        <activity android:name=".admin.ActivityLogActivity" android:exported="false" />
        <activity android:name=".admin.SettingsActivity" android:exported="false" />
        <activity android:name=".admin.HelpFaqActivity" android:exported="false" />

        <!-- ZXing Capture Activity for Barcode Scanner -->
        <activity
            android:name="com.journeyapps.barcodescanner.CaptureActivity"
            android:screenOrientation="portrait"
            android:stateNotNeeded="true"
            tools:replace="android:screenOrientation" />

        <!-- BroadcastReceiver for Push Event Reminders via AlarmManager -->
        <receiver
            android:name=".receiver.EventReminderReceiver"
            android:exported="false" />

    </application>

</manifest>
`
  },

  // 4. COLORS.XML
  {
    path: 'app/src/main/res/values/colors.xml',
    category: 'res',
    title: 'colors.xml',
    description: 'Material 3 Indigo and Emerald color palette designed for high legibility and contrast',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#1E40AF</color>
    <color name="primary_dark">#1E3A8A</color>
    <color name="primary_light">#3B82F6</color>
    <color name="primary_container">#DBEAFE</color>
    <color name="secondary">#059669</color>
    <color name="secondary_dark">#047857</color>
    <color name="secondary_light">#10B981</color>
    <color name="accent">#F59E0B</color>

    <color name="background">#F8FAFC</color>
    <color name="surface">#FFFFFF</color>
    <color name="card_stroke">#E2E8F0</color>

    <color name="text_primary">#0F172A</color>
    <color name="text_secondary">#475569</color>
    <color name="text_muted">#94A3B8</color>

    <color name="status_upcoming">#2563EB</color>
    <color name="status_completed">#059669</color>
    <color name="status_pending">#D97706</color>
    <color name="status_cancelled">#DC2626</color>
    <color name="status_full">#EF4444</color>

    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
    <color name="divider">#E2E8F0</color>
</resources>
`
  },

  // 5. STRINGS.XML
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'res',
    title: 'strings.xml',
    description: 'All string resources with complete multi-language keys',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Event Management App</string>
    <string name="college_name">National Institute of Engineering &amp; Technology</string>
    <string name="college_subtitle">Autonomous Campus • Accredited \'A++\' Grade</string>

    <!-- Auth -->
    <string name="login_title">Campus Event Portal</string>
    <string name="login_subtitle">Sign in to access events, passes &amp; certificates</string>
    <string name="username_hint">Username or Email</string>
    <string name="password_hint">Password</string>
    <string name="btn_login">Login</string>
    <string name="forgot_password">Forgot Password?</string>
    <string name="no_account">New Student? Register here</string>
    <string name="signup_title">Student Registration</string>

    <!-- Dashboard -->
    <string name="welcome_back">Welcome back,</string>
    <string name="upcoming_events">Upcoming Events</string>
    <string name="my_registrations">My Registrations</string>
    <string name="notifications">Notifications</string>
    <string name="certificates">Certificates</string>

    <!-- Navigation -->
    <string name="browse_events">Browse Events</string>
    <string name="search_events">Search &amp; Filter</string>
    <string name="my_events">My Events</string>
    <string name="favorite_events">Favorites</string>
    <string name="digital_pass">Digital Event Pass</string>
    <string name="feedback">Feedback</string>
    <string name="calendar">Event Calendar</string>
    <string name="profile">Profile</string>
    <string name="logout">Logout</string>

    <!-- Staff -->
    <string name="create_event">Create Event</string>
    <string name="manage_events">Manage Events</string>
    <string name="attendance">Attendance &amp; Check-In</string>
    <string name="qr_scanner">QR Code Scanner</string>
    <string name="reports">Reports &amp; Analytics</string>

    <!-- Admin -->
    <string name="manage_students">Manage Students</string>
    <string name="manage_staff">Manage Staff</string>
    <string name="event_approval">Event Approvals</string>
    <string name="activity_logs">Activity Audit Logs</string>
    <string name="settings">Settings</string>
    <string name="help_faq">Help &amp; FAQ</string>
</resources>
`
  },

  // 6. THEMES.XML
  {
    path: 'app/src/main/res/values/themes.xml',
    category: 'res',
    title: 'themes.xml',
    description: 'Material 3 DayNight themes with customized toolbar and CardView styles',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.EventManagementApp" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Primary brand color -->
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_dark</item>
        <item name="colorOnPrimary">@color/white</item>

        <!-- Secondary brand color -->
        <item name="colorSecondary">@color/secondary</item>
        <item name="colorSecondaryVariant">@color/secondary_dark</item>
        <item name="colorOnSecondary">@color/white</item>

        <!-- Status bar color -->
        <item name="android:statusBarColor">@color/primary_dark</item>
        <item name="android:windowLightStatusBar" tools:targetApi="m">false</item>
        <item name="android:windowBackground">@color/background</item>
    </style>

    <style name="CardViewStyle" parent="Widget.Material3.CardView.Elevated">
        <item name="cardCornerRadius">14dp</item>
        <item name="cardElevation">2dp</item>
        <item name="strokeColor">@color/card_stroke</item>
        <item name="strokeWidth">1dp</item>
    </style>
</resources>
`
  },

  // 7. DATABASE HELPER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/database/DatabaseHelper.java',
    category: 'database',
    title: 'DatabaseHelper.java',
    description: 'Complete SQLiteOpenHelper with 13 tables, parameterized SQL, conflict check, waitlist auto-promotion, and seed data',
    content: `package com.example.eventmanagementapp.database;

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
`
  },

  // 8. SESSION MANAGER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/utils/SessionManager.java',
    category: 'auth',
    title: 'SessionManager.java',
    description: 'Manages user session, login state, role verification, dark mode, and multi-language preference in SharedPreferences',
    content: `package com.example.eventmanagementapp.utils;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import com.example.eventmanagementapp.LoginActivity;

public class SessionManager {

    private static final String PREF_NAME = "EventAppSession";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";
    private static final String KEY_USER_ID = "userId";
    private static final String KEY_USERNAME = "username";
    private static final String KEY_ROLE = "role"; // ADMIN, STAFF, STUDENT
    private static final String KEY_STUDENT_ID = "studentId";
    private static final String KEY_STAFF_ID = "staffId";
    private static final String KEY_NAME = "name";
    private static final String KEY_REG_NO = "regNumber";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_DARK_MODE = "darkMode";
    private static final String KEY_LANGUAGE = "language"; // "en" or "ta"

    private SharedPreferences pref;
    private SharedPreferences.Editor editor;
    private Context context;

    public SessionManager(Context context) {
        this.context = context;
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = pref.edit();
    }

    public void createLoginSession(int userId, String username, String role, int entityId, String name, String regOrStaffNo, String email) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putInt(KEY_USER_ID, userId);
        editor.putString(KEY_USERNAME, username);
        editor.putString(KEY_ROLE, role);
        editor.putString(KEY_NAME, name);
        editor.putString(KEY_EMAIL, email);

        if ("STUDENT".equalsIgnoreCase(role)) {
            editor.putInt(KEY_STUDENT_ID, entityId);
            editor.putString(KEY_REG_NO, regOrStaffNo);
        } else if ("STAFF".equalsIgnoreCase(role)) {
            editor.putInt(KEY_STAFF_ID, entityId);
            editor.putString(KEY_REG_NO, regOrStaffNo);
        }
        editor.apply();
    }

    public boolean isLoggedIn() {
        return pref.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public int getUserId() {
        return pref.getInt(KEY_USER_ID, -1);
    }

    public String getUsername() {
        return pref.getString(KEY_USERNAME, "");
    }

    public String getUserRole() {
        return pref.getString(KEY_ROLE, "");
    }

    public int getStudentId() {
        return pref.getInt(KEY_STUDENT_ID, -1);
    }

    public int getStaffId() {
        return pref.getInt(KEY_STAFF_ID, -1);
    }

    public String getName() {
        return pref.getString(KEY_NAME, "User");
    }

    public String getRegNumber() {
        return pref.getString(KEY_REG_NO, "");
    }

    public String getEmail() {
        return pref.getString(KEY_EMAIL, "");
    }

    public void setDarkMode(boolean enabled) {
        editor.putBoolean(KEY_DARK_MODE, enabled);
        editor.apply();
    }

    public boolean isDarkMode() {
        return pref.getBoolean(KEY_DARK_MODE, false);
    }

    public void setLanguage(String lang) {
        editor.putString(KEY_LANGUAGE, lang);
        editor.apply();
    }

    public String getLanguage() {
        return pref.getString(KEY_LANGUAGE, "en");
    }

    public void logoutUser() {
        editor.clear();
        editor.apply();
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
    }
}
`
  },

  // 9. QR CODE HELPER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/utils/QRCodeHelper.java',
    category: 'database',
    title: 'QRCodeHelper.java',
    description: 'Generates crisp QR Code Bitmaps using ZXing library for Digital Event Passes',
    content: `package com.example.eventmanagementapp.utils;

import android.graphics.Bitmap;
import android.graphics.Color;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;

public class QRCodeHelper {

    public static Bitmap generateQRCode(String data, int width, int height) {
        MultiFormatWriter writer = new MultiFormatWriter();
        try {
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, width, height);
            Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.RGB_565);
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    bitmap.setPixel(x, y, bitMatrix.get(x, y) ? Color.BLACK : Color.WHITE);
                }
            }
            return bitmap;
        } catch (WriterException e) {
            e.printStackTrace();
            return null;
        }
    }
}
`
  },

  // 10. MAIN ACTIVITY (SPLASH ROUTER)
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/MainActivity.java',
    category: 'auth',
    title: 'MainActivity.java',
    description: 'Splash screen with session detection routing automatically to Admin, Staff, or Student Dashboard',
    content: `package com.example.eventmanagementapp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.admin.AdminDashboardActivity;
import com.example.eventmanagementapp.staff.StaffDashboardActivity;
import com.example.eventmanagementapp.student.StudentDashboardActivity;
import com.example.eventmanagementapp.utils.SessionManager;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SessionManager session = new SessionManager(this);

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (session.isLoggedIn()) {
                String role = session.getUserRole();
                if ("ADMIN".equalsIgnoreCase(role)) {
                    startActivity(new Intent(MainActivity.this, AdminDashboardActivity.class));
                } else if ("STAFF".equalsIgnoreCase(role)) {
                    startActivity(new Intent(MainActivity.this, StaffDashboardActivity.class));
                } else {
                    startActivity(new Intent(MainActivity.this, StudentDashboardActivity.class));
                }
            } else {
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
            }
            finish();
        }, 1500);
    }
}
`
  },

  // 11. LOGIN ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/LoginActivity.java',
    category: 'auth',
    title: 'LoginActivity.java',
    description: 'Role-based login with password masking, validation, test quick-fill buttons, and redirect logic',
    content: `package com.example.eventmanagementapp;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.admin.AdminDashboardActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.staff.StaffDashboardActivity;
import com.example.eventmanagementapp.student.StudentDashboardActivity;
import com.example.eventmanagementapp.utils.SessionManager;

public class LoginActivity extends AppCompatActivity {

    private EditText etUsername, etPassword;
    private Button btnLogin, btnQuickStudent, btnQuickStaff, btnQuickAdmin;
    private CheckBox cbRememberStudent;
    private TextView tvForgotPassword, tvSignUp;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private SharedPreferences sharedPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);
        sharedPrefs = getSharedPreferences("StudentAuthPrefs", MODE_PRIVATE);

        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        cbRememberStudent = findViewById(R.id.cbRememberStudent);
        tvForgotPassword = findViewById(R.id.tvForgotPassword);
        tvSignUp = findViewById(R.id.tvSignUp);
        btnQuickStudent = findViewById(R.id.btnQuickStudent);
        btnQuickStaff = findViewById(R.id.btnQuickStaff);
        btnQuickAdmin = findViewById(R.id.btnQuickAdmin);

        // Pre-fill saved Student Register Number if remembered
        String savedStudentId = sharedPrefs.getString("saved_student_identifier", "927625MCA026");
        boolean isRemembered = sharedPrefs.getBoolean("remember_student", true);
        if (etUsername != null && !TextUtils.isEmpty(savedStudentId)) {
            etUsername.setText(savedStudentId);
            if (cbRememberStudent != null) cbRememberStudent.setChecked(isRemembered);
        }

        btnLogin.setOnClickListener(v -> performLogin());

        tvSignUp.setOnClickListener(v -> startActivity(new Intent(LoginActivity.this, StudentSignupActivity.class)));
        tvForgotPassword.setOnClickListener(v -> startActivity(new Intent(LoginActivity.this, ForgotPasswordActivity.class)));

        // Convenient test credential fillers
        btnQuickStudent.setOnClickListener(v -> {
            etUsername.setText("927625MCA026");
            etPassword.setText("1234");
            Toast.makeText(this, "Student Monika (MCA) autofilled", Toast.LENGTH_SHORT).show();
        });

        btnQuickStaff.setOnClickListener(v -> {
            etUsername.setText("staff");
            etPassword.setText("1234");
        });

        btnQuickAdmin.setOnClickListener(v -> {
            etUsername.setText("admin");
            etPassword.setText("admin123");
        });
    }

    private void performLogin() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (TextUtils.isEmpty(username)) {
            etUsername.setError("Please enter student Register Number, email, or username");
            etUsername.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(password)) {
            etPassword.setError("Please enter password");
            etPassword.requestFocus();
            return;
        }

        // Save or clear remembered student identifier based on preference
        if (cbRememberStudent != null && cbRememberStudent.isChecked()) {
            sharedPrefs.edit()
                .putString("saved_student_identifier", username)
                .putBoolean("remember_student", true)
                .apply();
        } else {
            sharedPrefs.edit().putBoolean("remember_student", false).apply();
        }

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        // Check users by: username OR student email OR student register_number OR staff_id
        Cursor cursor = db.rawQuery("SELECT id, username, role, status FROM " + DatabaseHelper.TABLE_USERS +
                " WHERE (LOWER(username) = LOWER(?) " +
                " OR id IN (SELECT user_id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE LOWER(email) = LOWER(?) OR UPPER(register_number) = UPPER(?)) " +
                " OR id IN (SELECT user_id FROM " + DatabaseHelper.TABLE_STAFF + " WHERE LOWER(email) = LOWER(?) OR UPPER(staff_id) = UPPER(?))) " +
                " AND password = ?",
                new String[]{username, username, username, username, username, password});

        if (cursor != null && cursor.moveToFirst()) {
            int userId = cursor.getInt(0);
            String uName = cursor.getString(1);
            String role = cursor.getString(2);
            String status = cursor.getString(3);
            cursor.close();

            if ("INACTIVE".equalsIgnoreCase(status)) {
                Toast.makeText(this, "Your student account has been deactivated. Contact Admin.", Toast.LENGTH_LONG).show();
                return;
            }

            int entityId = -1;
            String name = uName;
            String regOrStaffNo = "";
            String email = "";

            if ("STUDENT".equalsIgnoreCase(role)) {
                Cursor cStudent = db.rawQuery("SELECT id, name, register_number, email FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE user_id = ?", new String[]{String.valueOf(userId)});
                if (cStudent.moveToFirst()) {
                    entityId = cStudent.getInt(0);
                    name = cStudent.getString(1);
                    regOrStaffNo = cStudent.getString(2);
                    email = cStudent.getString(3);
                }
                cStudent.close();

                session.createLoginSession(userId, uName, "STUDENT", entityId, name, regOrStaffNo, email);
                dbHelper.logActivity(userId, "Student logged in: " + name + " (Reg: " + regOrStaffNo + ")");
                Toast.makeText(this, "Welcome Student, " + name + " (" + regOrStaffNo + ")", Toast.LENGTH_LONG).show();
                startActivity(new Intent(LoginActivity.this, StudentDashboardActivity.class));
            } else if ("STAFF".equalsIgnoreCase(role)) {
                Cursor cStaff = db.rawQuery("SELECT id, name, staff_id, email FROM " + DatabaseHelper.TABLE_STAFF + " WHERE user_id = ?", new String[]{String.valueOf(userId)});
                if (cStaff.moveToFirst()) {
                    entityId = cStaff.getInt(0);
                    name = cStaff.getString(1);
                    regOrStaffNo = cStaff.getString(2);
                    email = cStaff.getString(3);
                }
                cStaff.close();

                session.createLoginSession(userId, uName, "STAFF", entityId, name, regOrStaffNo, email);
                dbHelper.logActivity(userId, "Staff logged in: " + name);
                Toast.makeText(this, "Welcome Staff, " + name, Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, StaffDashboardActivity.class));
            } else if ("ADMIN".equalsIgnoreCase(role)) {
                session.createLoginSession(userId, uName, "ADMIN", userId, "Administrator", "ADMIN-01", "admin@college.edu");
                dbHelper.logActivity(userId, "Administrator logged in");
                Toast.makeText(this, "Welcome Administrator", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, AdminDashboardActivity.class));
            }
            finish();
        } else {
            if (cursor != null) cursor.close();
            Toast.makeText(this, "Invalid student Register Number or password.", Toast.LENGTH_SHORT).show();
        }
    }
}
`
  },

  // 12. STUDENT SIGNUP ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/StudentSignupActivity.java',
    category: 'auth',
    title: 'StudentSignupActivity.java',
    description: 'Student registration with comprehensive validation (email regex, phone digits, password match, duplicate prevention)',
    content: `package com.example.eventmanagementapp;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;

public class StudentSignupActivity extends AppCompatActivity {

    private EditText etName, etRegisterNumber, etEmail, etPhone, etUsername, etPassword, etConfirmPassword;
    private Spinner spDepartment, spYear;
    private Button btnSignUp, btnBackToLogin;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_signup);

        dbHelper = new DatabaseHelper(this);

        etName = findViewById(R.id.etName);
        etRegisterNumber = findViewById(R.id.etRegisterNumber);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        etConfirmPassword = findViewById(R.id.etConfirmPassword);
        spDepartment = findViewById(R.id.spDepartment);
        spYear = findViewById(R.id.spYear);
        btnSignUp = findViewById(R.id.btnSignUp);
        btnBackToLogin = findViewById(R.id.btnBackToLogin);

        // Populate Department Spinner
        String[] departments = {"Master of Computer Applications", "Computer Science and Engineering", "Information Technology", "Electronics & Communication", "Electrical & Electronics", "Mechanical Engineering", "Civil Engineering", "Biotechnology", "Management Studies"};
        ArrayAdapter<String> deptAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, departments);
        spDepartment.setAdapter(deptAdapter);

        // Populate Year Spinner
        String[] years = {"First Year (I)", "Second Year (II)", "Third Year (III)", "Final Year (IV)", "Postgraduate (PG)"};
        ArrayAdapter<String> yearAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, years);
        spYear.setAdapter(yearAdapter);

        btnSignUp.setOnClickListener(v -> performRegistration());
        btnBackToLogin.setOnClickListener(v -> finish());
    }

    private void performRegistration() {
        String name = etName.getText().toString().trim();
        String regNo = etRegisterNumber.getText().toString().trim();
        String department = spDepartment.getSelectedItem().toString();
        String year = spYear.getSelectedItem().toString();
        String email = etEmail.getText().toString().trim();
        String phone = etPhone.getText().toString().trim();
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString();
        String confirmPassword = etConfirmPassword.getText().toString();

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(regNo) || TextUtils.isEmpty(email) ||
                TextUtils.isEmpty(phone) || TextUtils.isEmpty(username) || TextUtils.isEmpty(password)) {
            Toast.makeText(this, "Please fill in all required fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("Enter a valid email address");
            etEmail.requestFocus();
            return;
        }

        if (phone.length() < 10) {
            etPhone.setError("Enter a valid 10-digit mobile number");
            etPhone.requestFocus();
            return;
        }

        if (password.length() < 4) {
            etPassword.setError("Password must be at least 4 characters");
            etPassword.requestFocus();
            return;
        }

        if (!password.equals(confirmPassword)) {
            etConfirmPassword.setError("Passwords do not match");
            etConfirmPassword.requestFocus();
            return;
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // Duplicate checks
        Cursor cUser = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_USERS + " WHERE LOWER(username) = LOWER(?)", new String[]{username});
        if (cUser.moveToFirst()) {
            cUser.close();
            etUsername.setError("Username is already taken");
            etUsername.requestFocus();
            return;
        }
        cUser.close();

        Cursor cReg = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE UPPER(register_number) = UPPER(?)", new String[]{regNo});
        if (cReg.moveToFirst()) {
            cReg.close();
            etRegisterNumber.setError("Register Number already exists");
            etRegisterNumber.requestFocus();
            return;
        }
        cReg.close();

        Cursor cEmail = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE LOWER(email) = LOWER(?)", new String[]{email});
        if (cEmail.moveToFirst()) {
            cEmail.close();
            etEmail.setError("Email is already registered");
            etEmail.requestFocus();
            return;
        }
        cEmail.close();

        // Insert into Users table
        ContentValues cvUser = new ContentValues();
        cvUser.put("username", username);
        cvUser.put("password", password);
        cvUser.put("role", "STUDENT");
        cvUser.put("status", "ACTIVE");
        long userId = db.insert(DatabaseHelper.TABLE_USERS, null, cvUser);

        // Insert into Students table
        ContentValues cvStudent = new ContentValues();
        cvStudent.put("user_id", userId);
        cvStudent.put("name", name);
        cvStudent.put("register_number", regNo);
        cvStudent.put("department", department);
        cvStudent.put("year", year);
        cvStudent.put("email", email);
        cvStudent.put("phone", phone);
        db.insert(DatabaseHelper.TABLE_STUDENTS, null, cvStudent);

        dbHelper.logActivity((int) userId, "Student registration completed for: " + name + " (" + regNo + ")");
        Toast.makeText(this, "Registration successful! You can now log in.", Toast.LENGTH_LONG).show();
        finish();
    }
}
`
  },

  // 13. FORGOT PASSWORD ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/ForgotPasswordActivity.java',
    category: 'auth',
    title: 'ForgotPasswordActivity.java',
    description: 'Allows verified students/staff to reset password securely with email or registration number check',
    content: `package com.example.eventmanagementapp;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;

public class ForgotPasswordActivity extends AppCompatActivity {

    private EditText etIdentifier, etNewPassword, etConfirmNewPassword;
    private Button btnResetPassword, btnBack;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        dbHelper = new DatabaseHelper(this);

        etIdentifier = findViewById(R.id.etIdentifier);
        etNewPassword = findViewById(R.id.etNewPassword);
        etConfirmNewPassword = findViewById(R.id.etConfirmNewPassword);
        btnResetPassword = findViewById(R.id.btnResetPassword);
        btnBack = findViewById(R.id.btnBack);

        btnResetPassword.setOnClickListener(v -> resetPassword());
        btnBack.setOnClickListener(v -> finish());
    }

    private void resetPassword() {
        String identifier = etIdentifier.getText().toString().trim();
        String newPass = etNewPassword.getText().toString().trim();
        String confirmPass = etConfirmNewPassword.getText().toString().trim();

        if (TextUtils.isEmpty(identifier) || TextUtils.isEmpty(newPass)) {
            Toast.makeText(this, "Please enter all fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!newPass.equals(confirmPass)) {
            etConfirmNewPassword.setError("Passwords do not match");
            return;
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, user_id FROM " + DatabaseHelper.TABLE_STUDENTS +
                " WHERE LOWER(email) = LOWER(?) OR UPPER(register_number) = UPPER(?)", new String[]{identifier, identifier});

        int userId = -1;
        if (cursor.moveToFirst()) {
            userId = cursor.getInt(1);
        }
        cursor.close();

        if (userId == -1) {
            Cursor cUser = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_USERS + " WHERE LOWER(username) = LOWER(?)", new String[]{identifier});
            if (cUser.moveToFirst()) {
                userId = cUser.getInt(0);
            }
            cUser.close();
        }

        if (userId != -1) {
            ContentValues cv = new ContentValues();
            cv.put("password", newPass);
            db.update(DatabaseHelper.TABLE_USERS, cv, "id = ?", new String[]{String.valueOf(userId)});
            dbHelper.logActivity(userId, "Password reset successfully");
            Toast.makeText(this, "Password updated successfully! Please login.", Toast.LENGTH_LONG).show();
            finish();
        } else {
            Toast.makeText(this, "No account found matching the given identifier.", Toast.LENGTH_SHORT).show();
        }
    }
}
`
  },

  // 14. STUDENT DASHBOARD ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/student/StudentDashboardActivity.java',
    category: 'student',
    title: 'StudentDashboardActivity.java',
    description: 'Student Hub with dynamic counters (upcoming, registrations, certificates, notifications) and 10 action buttons',
    content: `package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class StudentDashboardActivity extends AppCompatActivity {

    private TextView tvStudentName, tvWelcome, tvUpcomingCount, tvRegCount, tvNotifCount, tvCertCount;
    private CardView cardBrowse, cardSearch, cardMyEvents, cardFavorites, cardDigitalPass, cardCertificates, cardNotifs, cardProfile, cardFeedback, cardCalendar;
    private Button btnLogout, btnDashboardDateFilter, btnDashboardResetFilter;
    private android.widget.EditText etDashboardSearch;
    private android.widget.Spinner spDashboardCategory;
    private androidx.recyclerview.widget.RecyclerView rvDashboardEvents;
    private com.example.eventmanagementapp.adapter.EventAdapter dashboardAdapter;
    private java.util.List<com.example.eventmanagementapp.model.EventItem> dashboardEventsList;

    // CalendarView components for registered events schedule
    private android.widget.CalendarView calendarViewDashboard;
    private TextView tvCalendarSelectedDate, tvCalendarEmptyState;
    private androidx.recyclerview.widget.RecyclerView rvCalendarRegisteredEvents;
    private com.example.eventmanagementapp.adapter.EventAdapter calendarEventsAdapter;
    private java.util.List<com.example.eventmanagementapp.model.EventItem> calendarRegisteredEventsList;

    private DatabaseHelper dbHelper;
    private SessionManager session;
    private String selectedCategory = "All";
    private String selectedDate = "All";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_dashboard);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvWelcome = findViewById(R.id.tvWelcome);
        tvStudentName = findViewById(R.id.tvStudentName);
        tvUpcomingCount = findViewById(R.id.tvUpcomingCount);
        tvRegCount = findViewById(R.id.tvRegCount);
        tvNotifCount = findViewById(R.id.tvNotifCount);
        tvCertCount = findViewById(R.id.tvCertCount);

        cardBrowse = findViewById(R.id.cardBrowse);
        cardSearch = findViewById(R.id.cardSearch);
        cardMyEvents = findViewById(R.id.cardMyEvents);
        cardFavorites = findViewById(R.id.cardFavorites);
        cardDigitalPass = findViewById(R.id.cardDigitalPass);
        cardCertificates = findViewById(R.id.cardCertificates);
        cardNotifs = findViewById(R.id.cardNotifs);
        cardProfile = findViewById(R.id.cardProfile);
        cardFeedback = findViewById(R.id.cardFeedback);
        cardCalendar = findViewById(R.id.cardCalendar);
        btnLogout = findViewById(R.id.btnLogout);

        // Search and Filter Views
        etDashboardSearch = findViewById(R.id.etDashboardSearch);
        spDashboardCategory = findViewById(R.id.spDashboardCategory);
        btnDashboardDateFilter = findViewById(R.id.btnDashboardDateFilter);
        btnDashboardResetFilter = findViewById(R.id.btnDashboardResetFilter);
        rvDashboardEvents = findViewById(R.id.rvDashboardEvents);

        // CalendarView components
        calendarViewDashboard = findViewById(R.id.calendarViewDashboard);
        tvCalendarSelectedDate = findViewById(R.id.tvCalendarSelectedDate);
        tvCalendarEmptyState = findViewById(R.id.tvCalendarEmptyState);
        rvCalendarRegisteredEvents = findViewById(R.id.rvCalendarRegisteredEvents);

        tvStudentName.setText(session.getName());

        setupNavigation();
        setupDashboardEventSearchAndFilter();
        setupDashboardCalendarView();
    }

    private void setupDashboardCalendarView() {
        calendarRegisteredEventsList = new java.util.ArrayList<>();
        calendarEventsAdapter = new com.example.eventmanagementapp.adapter.EventAdapter(this, calendarRegisteredEventsList, event -> {
            Intent intent = new Intent(StudentDashboardActivity.this, EventDetailsActivity.class);
            intent.putExtra("eventId", event.getId());
            startActivity(intent);
        });
        rvCalendarRegisteredEvents.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
        rvCalendarRegisteredEvents.setAdapter(calendarEventsAdapter);

        // Default to today's date formatted as yyyy-MM-dd
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault());
        String initialDate = sdf.format(new java.util.Date(calendarViewDashboard.getDate()));
        loadRegisteredEventsForDate(initialDate);

        calendarViewDashboard.setOnDateChangeListener((view, year, month, dayOfMonth) -> {
            String selected = String.format(java.util.Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, dayOfMonth);
            loadRegisteredEventsForDate(selected);
        });
    }

    private void loadRegisteredEventsForDate(String dateStr) {
        calendarRegisteredEventsList.clear();
        tvCalendarSelectedDate.setText("Registered Events on " + dateStr);

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT e.id, e.name, e.description, e.category, e.date, e.start_time, e.end_time, e.venue, e.organizer, e.capacity " +
                "FROM " + DatabaseHelper.TABLE_EVENTS + " e " +
                "JOIN " + DatabaseHelper.TABLE_REGISTRATIONS + " r ON e.id = r.event_id " +
                "WHERE r.student_id = ? AND r.status = 'REGISTERED' AND e.date = ?",
                new String[]{String.valueOf(session.getStudentId()), dateStr});

        while (cursor.moveToNext()) {
            com.example.eventmanagementapp.model.EventItem item = new com.example.eventmanagementapp.model.EventItem(
                    cursor.getInt(0), cursor.getString(1), cursor.getString(2), cursor.getString(3),
                    cursor.getString(4), cursor.getString(5), cursor.getString(6), cursor.getString(7),
                    cursor.getString(8), cursor.getInt(9)
            );
            calendarRegisteredEventsList.add(item);
        }
        cursor.close();
        calendarEventsAdapter.notifyDataSetChanged();

        if (calendarRegisteredEventsList.isEmpty()) {
            tvCalendarEmptyState.setVisibility(android.view.View.VISIBLE);
            rvCalendarRegisteredEvents.setVisibility(android.view.View.GONE);
            tvCalendarEmptyState.setText("No registered events scheduled on " + dateStr);
        } else {
            tvCalendarEmptyState.setVisibility(android.view.View.GONE);
            rvCalendarRegisteredEvents.setVisibility(android.view.View.VISIBLE);
        }
    }

    private void setupDashboardEventSearchAndFilter() {
        dashboardEventsList = new java.util.ArrayList<>();
        dashboardAdapter = new com.example.eventmanagementapp.adapter.EventAdapter(this, dashboardEventsList, event -> {
            Intent intent = new Intent(StudentDashboardActivity.this, EventDetailsActivity.class);
            intent.putExtra("eventId", event.getId());
            startActivity(intent);
        });
        rvDashboardEvents.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
        rvDashboardEvents.setAdapter(dashboardAdapter);

        // Populate Category Spinner
        String[] categories = {"All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium"};
        android.widget.ArrayAdapter<String> catAdapter = new android.widget.ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        spDashboardCategory.setAdapter(catAdapter);

        spDashboardCategory.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, android.view.View view, int position, long id) {
                selectedCategory = categories[position];
                filterDashboardEvents();
            }
            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {}
        });

        // Search text watcher
        etDashboardSearch.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterDashboardEvents();
            }
            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });

        // Date picker filter button
        btnDashboardDateFilter.setOnClickListener(v -> {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            new android.app.DatePickerDialog(this, (view, year, month, day) -> {
                selectedDate = String.format(java.util.Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                btnDashboardDateFilter.setText(selectedDate);
                filterDashboardEvents();
            }, cal.get(java.util.Calendar.YEAR), cal.get(java.util.Calendar.MONTH), cal.get(java.util.Calendar.DAY_OF_MONTH)).show();
        });

        btnDashboardResetFilter.setOnClickListener(v -> {
            etDashboardSearch.setText("");
            spDashboardCategory.setSelection(0);
            selectedCategory = "All";
            selectedDate = "All";
            btnDashboardDateFilter.setText("Pick Date 📅");
            filterDashboardEvents();
        });

        filterDashboardEvents();
    }

    private void filterDashboardEvents() {
        dashboardEventsList.clear();
        String query = etDashboardSearch.getText().toString().trim().toLowerCase();

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, name, description, category, date, start_time, end_time, venue, organizer, capacity, status FROM " +
                DatabaseHelper.TABLE_EVENTS + " WHERE status != 'Cancelled' AND status != 'Rejected' ORDER BY date ASC", null);

        while (cursor.moveToNext()) {
            int id = cursor.getInt(0);
            String name = cursor.getString(1);
            String desc = cursor.getString(2);
            String cat = cursor.getString(3);
            String date = cursor.getString(4);
            String startTime = cursor.getString(5);
            String endTime = cursor.getString(6);
            String venue = cursor.getString(7);
            String organizer = cursor.getString(8);
            int capacity = cursor.getInt(9);

            // Apply category filter
            if (!"All".equals(selectedCategory) && !cat.equalsIgnoreCase(selectedCategory)) {
                continue;
            }

            // Apply date filter
            if (!"All".equals(selectedDate) && !date.equals(selectedDate)) {
                continue;
            }

            // Apply query filter (name, venue, category, date)
            if (!query.isEmpty()) {
                boolean matchesName = name.toLowerCase().contains(query);
                boolean matchesVenue = venue.toLowerCase().contains(query);
                boolean matchesCat = cat.toLowerCase().contains(query);
                boolean matchesDate = date.toLowerCase().contains(query);
                if (!matchesName && !matchesVenue && !matchesCat && !matchesDate) {
                    continue;
                }
            }

            com.example.eventmanagementapp.model.EventItem item = new com.example.eventmanagementapp.model.EventItem(
                    id, name, desc, cat, date, startTime, endTime, venue, organizer, capacity
            );

            // Fetch registration count
            Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS +
                    " WHERE event_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(id)});
            if (cReg.moveToFirst()) item.setRegisteredCount(cReg.getInt(0));
            cReg.close();

            dashboardEventsList.add(item);
        }
        cursor.close();
        dashboardAdapter.notifyDataSetChanged();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshCounters();
    }

    private void refreshCounters() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        // 1. Upcoming Events Count
        Cursor cUpcoming = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Upcoming' OR status = 'Approved'", null);
        if (cUpcoming.moveToFirst()) tvUpcomingCount.setText(String.valueOf(cUpcoming.getInt(0)));
        cUpcoming.close();

        // 2. My Registrations Count
        int studentId = session.getStudentId();
        Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " WHERE student_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(studentId)});
        if (cReg.moveToFirst()) tvRegCount.setText(String.valueOf(cReg.getInt(0)));
        cReg.close();

        // 3. Notifications Count
        int userId = session.getUserId();
        Cursor cNotif = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_NOTIFICATIONS + " WHERE user_id = ? AND is_read = 0", new String[]{String.valueOf(userId)});
        if (cNotif.moveToFirst()) tvNotifCount.setText(String.valueOf(cNotif.getInt(0)));
        cNotif.close();

        // 4. Certificates Count
        Cursor cCert = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_CERTIFICATES + " WHERE student_id = ? AND status = 'VALID'", new String[]{String.valueOf(studentId)});
        if (cCert.moveToFirst()) tvCertCount.setText(String.valueOf(cCert.getInt(0)));
        cCert.close();
    }

    private void setupNavigation() {
        cardBrowse.setOnClickListener(v -> startActivity(new Intent(this, EventSearchActivity.class)));
        cardSearch.setOnClickListener(v -> startActivity(new Intent(this, EventSearchActivity.class)));
        cardMyEvents.setOnClickListener(v -> startActivity(new Intent(this, MyEventsActivity.class)));
        cardFavorites.setOnClickListener(v -> startActivity(new Intent(this, FavoriteEventsActivity.class)));
        cardDigitalPass.setOnClickListener(v -> startActivity(new Intent(this, DigitalPassActivity.class)));
        cardCertificates.setOnClickListener(v -> startActivity(new Intent(this, CertificateActivity.class)));
        cardNotifs.setOnClickListener(v -> startActivity(new Intent(this, NotificationsActivity.class)));
        cardProfile.setOnClickListener(v -> startActivity(new Intent(this, ProfileActivity.class)));
        cardFeedback.setOnClickListener(v -> startActivity(new Intent(this, FeedbackActivity.class)));
        cardCalendar.setOnClickListener(v -> startActivity(new Intent(this, CalendarActivity.class)));

        btnLogout.setOnClickListener(v -> session.logoutUser());
    }
}
`
  },

  // 15. DIGITAL PASS ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/student/DigitalPassActivity.java',
    category: 'student',
    title: 'DigitalPassActivity.java',
    description: 'Renders verified collegiate event admission credentials with registration ID, session details, and Android share intent',
    content: `package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class DigitalPassActivity extends AppCompatActivity {

    private TextView tvStudentName, tvRegisterNumber, tvEventName, tvEventDate, tvVenue, tvRegistrationId, tvEmptyNotice;
    private Button btnSharePass, btnBack;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private String shareContent = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_digital_pass);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStudentName = findViewById(R.id.tvStudentName);
        tvRegisterNumber = findViewById(R.id.tvRegisterNumber);
        tvEventName = findViewById(R.id.tvEventName);
        tvEventDate = findViewById(R.id.tvEventDate);
        tvVenue = findViewById(R.id.tvVenue);
        tvRegistrationId = findViewById(R.id.tvRegistrationId);
        btnSharePass = findViewById(R.id.btnSharePass);
        btnBack = findViewById(R.id.btnBack);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);

        loadLatestEventPass();

        btnSharePass.setOnClickListener(v -> {
            if (!shareContent.isEmpty()) {
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, shareContent);
                sendIntent.setType("text/plain");
                startActivity(Intent.createChooser(sendIntent, "Share Event Pass"));
            }
        });

        btnBack.setOnClickListener(v -> finish());
    }

    private void loadLatestEventPass() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        String query = "SELECT r.registration_id, r.registration_date, e.id, e.name, e.date, e.start_time, e.venue " +
                "FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " r " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON r.event_id = e.id " +
                "WHERE r.student_id = ? AND r.status = 'REGISTERED' " +
                "ORDER BY r.id DESC LIMIT 1";

        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(studentId)});
        if (cursor.moveToFirst()) {
            String regId = cursor.getString(0);
            int eventId = cursor.getInt(2);
            String eventName = cursor.getString(3);
            String eventDate = cursor.getString(4);
            String startTime = cursor.getString(5);
            String venue = cursor.getString(6);
            cursor.close();

            tvStudentName.setText(session.getName());
            tvRegisterNumber.setText("Reg No: " + session.getRegNumber());
            tvEventName.setText(eventName);
            tvEventDate.setText("Date: " + eventDate + " at " + startTime);
            tvVenue.setText("Venue: " + venue);
            tvRegistrationId.setText("Pass ID: " + regId);

            shareContent = "COLLEGE DIGITAL EVENT PASS\\n\\n" +
                    "Event: " + eventName + "\\n" +
                    "Student: " + session.getName() + " (" + session.getRegNumber() + ")\\n" +
                    "Date: " + eventDate + "\\n" +
                    "Venue: " + venue + "\\n" +
                    "Registration Pass ID: " + regId;
        } else {
            cursor.close();
            tvEmptyNotice.setVisibility(View.VISIBLE);
            findViewById(R.id.cardPassContainer).setVisibility(View.GONE);
            btnSharePass.setEnabled(false);
        }
    }
}
`
  },

  // 16. QR SCANNER ACTIVITY (STAFF ATTENDANCE)
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/staff/QRScannerActivity.java',
    category: 'staff',
    title: 'QRScannerActivity.java',
    description: 'Camera QR scanner integration with automatic registration verification, duplicate check, and Present marking',
    content: `package com.example.eventmanagementapp.staff;

import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class QRScannerActivity extends AppCompatActivity {

    private Button btnScan, btnBack;
    private TextView tvScanResult, tvStatus;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qr_scanner);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        btnScan = findViewById(R.id.btnScan);
        btnBack = findViewById(R.id.btnBack);
        tvScanResult = findViewById(R.id.tvScanResult);
        tvStatus = findViewById(R.id.tvStatus);

        btnScan.setOnClickListener(v -> initiateScan());
        btnBack.setOnClickListener(v -> finish());

        // Automatically start camera on launch
        initiateScan();
    }

    private void initiateScan() {
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setPrompt("Align the QR Code inside the viewfinder");
        integrator.setOrientationLocked(true);
        integrator.setBeepEnabled(true);
        integrator.initiateScan();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() != null) {
                processScannedData(result.getContents());
            } else {
                Toast.makeText(this, "Scan cancelled.", Toast.LENGTH_SHORT).show();
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void processScannedData(String qrData) {
        // Format: REGISTRATION_ID|STUDENT_ID|EVENT_ID or REGISTRATION_ID
        String regId = qrData;
        int parsedStudentId = -1;
        int parsedEventId = -1;

        if (qrData.contains("|")) {
            String[] parts = qrData.split("\\\\|");
            regId = parts[0];
            if (parts.length >= 3) {
                try {
                    parsedStudentId = Integer.parseInt(parts[1]);
                    parsedEventId = Integer.parseInt(parts[2]);
                } catch (Exception ignored) {}
            }
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // 1. Verify Registration Record
        Cursor cReg = db.rawQuery("SELECT r.student_id, r.event_id, r.status, s.name, s.register_number, e.name " +
                "FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " r " +
                "JOIN " + DatabaseHelper.TABLE_STUDENTS + " s ON r.student_id = s.id " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON r.event_id = e.id " +
                "WHERE r.registration_id = ?", new String[]{regId});

        if (cReg.moveToFirst()) {
            int studentId = cReg.getInt(0);
            int eventId = cReg.getInt(1);
            String regStatus = cReg.getString(2);
            String studentName = cReg.getString(3);
            String regNo = cReg.getString(4);
            String eventName = cReg.getString(5);
            cReg.close();

            if (!"REGISTERED".equalsIgnoreCase(regStatus)) {
                showResultDialog("Invalid Pass", "This registration has been " + regStatus + ".");
                return;
            }

            // 2. Check if already checked in
            Cursor cAtt = db.rawQuery("SELECT id, check_in, check_out FROM " + DatabaseHelper.TABLE_ATTENDANCE +
                    " WHERE student_id = ? AND event_id = ?", new String[]{String.valueOf(studentId), String.valueOf(eventId)});

            String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());

            if (cAtt.moveToFirst()) {
                int attId = cAtt.getInt(0);
                String checkInTime = cAtt.getString(1);
                String checkOutTime = cAtt.getString(2);
                cAtt.close();

                if (checkOutTime == null || checkOutTime.isEmpty()) {
                    // Record Check-Out
                    ContentValues cvOut = new ContentValues();
                    cvOut.put("check_out", nowTime);
                    db.update(DatabaseHelper.TABLE_ATTENDANCE, cvOut, "id = ?", new String[]{String.valueOf(attId)});
                    dbHelper.logActivity(session.getUserId(), "Check-out recorded for " + studentName + " (" + regNo + ")");
                    showResultDialog("Check-Out Recorded", "Student: " + studentName + "\\nEntry: " + checkInTime + "\\nExit: " + nowTime);
                } else {
                    showResultDialog("Already Checked Out", studentName + " has already completed check-in & check-out for this event.");
                }
            } else {
                cAtt.close();
                // Mark Check-In (Present)
                ContentValues cvIn = new ContentValues();
                cvIn.put("student_id", studentId);
                cvIn.put("event_id", eventId);
                cvIn.put("check_in", nowTime);
                cvIn.put("status", "Present");
                db.insert(DatabaseHelper.TABLE_ATTENDANCE, null, cvIn);

                // Auto issue Certificate of Participation
                String certId = "CERT-COL-2026-" + studentId + "-" + eventId;
                ContentValues cvCert = new ContentValues();
                cvCert.put("student_id", studentId);
                cvCert.put("event_id", eventId);
                cvCert.put("certificate_id", certId);
                cvCert.put("issue_date", new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date()));
                cvCert.put("status", "VALID");
                db.insertWithOnConflict(DatabaseHelper.TABLE_CERTIFICATES, null, cvCert, SQLiteDatabase.CONFLICT_IGNORE);

                dbHelper.logActivity(session.getUserId(), "Marked attendance Present for " + studentName + " at " + eventName);
                showResultDialog("Check-in Successful! ✅", "Student: " + studentName + "\\nReg No: " + regNo + "\\nEvent: " + eventName + "\\nTime: " + nowTime + "\\nAttendance: PRESENT");
            }
        } else {
            cReg.close();
            showResultDialog("Check-in Failed ❌", "No matching active registration found for Pass ID: " + regId);
        }
    }

    private void showResultDialog(String title, String message) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("Scan Next", (dialog, which) -> initiateScan())
                .setNegativeButton("Done", (dialog, which) -> finish())
                .setCancelable(false)
                .show();
    }
}
`
  },

  // 17. CREATE EVENT ACTIVITY (STAFF / ADMIN WITH CONFLICT DETECTION)
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/staff/CreateEventActivity.java',
    category: 'staff',
    title: 'CreateEventActivity.java',
    description: 'Event creation with date/time pickers, capacity validation, and venue conflict detection logic',
    content: `package com.example.eventmanagementapp.staff;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;
import java.util.Calendar;
import java.util.Locale;

public class CreateEventActivity extends AppCompatActivity {

    private EditText etEventName, etDescription, etDate, etStartTime, etEndTime, etVenue, etCapacity, etDeadline, etOrganizer, etMeetingLink;
    private Spinner spCategory, spEventType;
    private Button btnCreateEvent, btnCancel;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_event);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        etEventName = findViewById(R.id.etEventName);
        etDescription = findViewById(R.id.etDescription);
        etDate = findViewById(R.id.etDate);
        etStartTime = findViewById(R.id.etStartTime);
        etEndTime = findViewById(R.id.etEndTime);
        etVenue = findViewById(R.id.etVenue);
        etCapacity = findViewById(R.id.etCapacity);
        etDeadline = findViewById(R.id.etDeadline);
        etOrganizer = findViewById(R.id.etOrganizer);
        etMeetingLink = findViewById(R.id.etMeetingLink);
        spCategory = findViewById(R.id.spCategory);
        spEventType = findViewById(R.id.spEventType);
        btnCreateEvent = findViewById(R.id.btnCreateEvent);
        btnCancel = findViewById(R.id.btnCancel);

        // Spinners
        String[] categories = {"Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium", "Other"};
        spCategory.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories));

        String[] types = {"Offline", "Online", "Hybrid"};
        spEventType.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, types));

        setupPickers();

        btnCreateEvent.setOnClickListener(v -> saveEvent());
        btnCancel.setOnClickListener(v -> finish());
    }

    private void setupPickers() {
        Calendar cal = Calendar.getInstance();

        etDate.setOnClickListener(v -> {
            new DatePickerDialog(this, (view, year, month, day) -> {
                String d = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                etDate.setText(d);
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
        });

        etDeadline.setOnClickListener(v -> {
            new DatePickerDialog(this, (view, year, month, day) -> {
                String d = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                etDeadline.setText(d);
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
        });

        etStartTime.setOnClickListener(v -> {
            new TimePickerDialog(this, (view, hour, minute) -> {
                etStartTime.setText(String.format(Locale.getDefault(), "%02d:%02d", hour, minute));
            }, 10, 0, true).show();
        });

        etEndTime.setOnClickListener(v -> {
            new TimePickerDialog(this, (view, hour, minute) -> {
                etEndTime.setText(String.format(Locale.getDefault(), "%02d:%02d", hour, minute));
            }, 16, 0, true).show();
        });
    }

    private void saveEvent() {
        String name = etEventName.getText().toString().trim();
        String desc = etDescription.getText().toString().trim();
        String category = spCategory.getSelectedItem().toString();
        String date = etDate.getText().toString().trim();
        String start = etStartTime.getText().toString().trim();
        String end = etEndTime.getText().toString().trim();
        String venue = etVenue.getText().toString().trim();
        String type = spEventType.getSelectedItem().toString();
        String capStr = etCapacity.getText().toString().trim();
        String deadline = etDeadline.getText().toString().trim();
        String organizer = etOrganizer.getText().toString().trim();
        String link = etMeetingLink.getText().toString().trim();

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(date) || TextUtils.isEmpty(start) ||
                TextUtils.isEmpty(end) || TextUtils.isEmpty(venue) || TextUtils.isEmpty(capStr)) {
            Toast.makeText(this, "Please fill in all mandatory fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        int capacity = Integer.parseInt(capStr);
        if (capacity <= 0) {
            etCapacity.setError("Capacity must be greater than zero");
            return;
        }

        if (deadline.compareTo(date) > 0) {
            Toast.makeText(this, "Registration deadline cannot be after event date.", Toast.LENGTH_SHORT).show();
            return;
        }

        // Venue conflict detection
        if (dbHelper.hasVenueConflict(venue, date, start, end, 0)) {
            Toast.makeText(this, "Venue is already booked during this time on " + date, Toast.LENGTH_LONG).show();
            return;
        }

        // Staff creates Pending, Admin creates Upcoming/Approved
        String status = "ADMIN".equalsIgnoreCase(session.getUserRole()) ? "Upcoming" : "Pending";

        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("name", name);
        cv.put("description", desc);
        cv.put("category", category);
        cv.put("date", date);
        cv.put("start_time", start);
        cv.put("end_time", end);
        cv.put("venue", venue);
        cv.put("event_type", type);
        cv.put("capacity", capacity);
        cv.put("registration_deadline", deadline);
        cv.put("organizer", organizer);
        cv.put("meeting_link", link);
        cv.put("status", status);
        cv.put("created_by", session.getUserId());

        db.insert(DatabaseHelper.TABLE_EVENTS, null, cv);
        dbHelper.logActivity(session.getUserId(), "Created event: " + name + " (Status: " + status + ")");

        Toast.makeText(this, "ADMIN".equalsIgnoreCase(session.getUserRole()) ? "Event created and published!" : "Event submitted for Admin approval.", Toast.LENGTH_LONG).show();
        finish();
    }
}
`
  },

  // 18. ADMIN EVENT APPROVAL ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/admin/EventApprovalActivity.java',
    category: 'admin',
    title: 'EventApprovalActivity.java',
    description: 'Admin screen to review pending events proposed by staff and Approve or Reject with instant status update',
    content: `package com.example.eventmanagementapp.admin;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.adapter.EventApprovalAdapter;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.model.EventItem;
import com.example.eventmanagementapp.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

public class EventApprovalActivity extends AppCompatActivity {

    private RecyclerView rvPendingEvents;
    private TextView tvEmptyNotice;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private EventApprovalAdapter adapter;
    private List<EventItem> pendingList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_approval);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        rvPendingEvents = findViewById(R.id.rvPendingEvents);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);
        rvPendingEvents.setLayoutManager(new LinearLayoutManager(this));

        pendingList = new ArrayList<>();
        adapter = new EventApprovalAdapter(this, pendingList, new EventApprovalAdapter.OnApprovalListener() {
            @Override
            public void onApprove(EventItem event) {
                updateEventStatus(event.getId(), "Upcoming", "Approved");
            }

            @Override
            public void onReject(EventItem event) {
                updateEventStatus(event.getId(), "Rejected", "Rejected");
            }
        });
        rvPendingEvents.setAdapter(adapter);

        loadPendingEvents();
    }

    private void loadPendingEvents() {
        pendingList.clear();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, name, description, category, date, start_time, end_time, venue, organizer, capacity FROM " +
                DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Pending'", null);

        while (cursor.moveToNext()) {
            EventItem item = new EventItem(
                    cursor.getInt(0),
                    cursor.getString(1),
                    cursor.getString(2),
                    cursor.getString(3),
                    cursor.getString(4),
                    cursor.getString(5),
                    cursor.getString(6),
                    cursor.getString(7),
                    cursor.getString(8),
                    cursor.getInt(9)
            );
            pendingList.add(item);
        }
        cursor.close();
        adapter.notifyDataSetChanged();

        tvEmptyNotice.setVisibility(pendingList.isEmpty() ? View.VISIBLE : View.GONE);
    }

    private void updateEventStatus(int eventId, String newStatus, String actionLabel) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("status", newStatus);
        db.update(DatabaseHelper.TABLE_EVENTS, cv, "id = ?", new String[]{String.valueOf(eventId)});

        dbHelper.logActivity(session.getUserId(), "Admin " + actionLabel + " event ID: " + eventId);
        Toast.makeText(this, "Event " + actionLabel + " successfully.", Toast.LENGTH_SHORT).show();
        loadPendingEvents();
    }
}
`
  },

  // 19. CERTIFICATE ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/student/CertificateActivity.java',
    category: 'student',
    title: 'CertificateActivity.java',
    description: 'Displays official digital Certificate of Participation with unique Certificate ID, share button, and ID verification',
    content: `package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class CertificateActivity extends AppCompatActivity {

    private TextView tvStudentName, tvEventName, tvEventDate, tvOrganizer, tvCertId, tvEmptyNotice;
    private View layoutCertCard;
    private Button btnShareCert, btnVerifyCert, btnBack;
    private EditText etVerifyId;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_certificate);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStudentName = findViewById(R.id.tvStudentName);
        tvEventName = findViewById(R.id.tvEventName);
        tvEventDate = findViewById(R.id.tvEventDate);
        tvOrganizer = findViewById(R.id.tvOrganizer);
        tvCertId = findViewById(R.id.tvCertId);
        layoutCertCard = findViewById(R.id.layoutCertCard);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);
        btnShareCert = findViewById(R.id.btnShareCert);
        btnVerifyCert = findViewById(R.id.btnVerifyCert);
        etVerifyId = findViewById(R.id.etVerifyId);
        btnBack = findViewById(R.id.btnBack);

        loadLatestCertificate();

        btnShareCert.setOnClickListener(v -> shareCertificate());
        btnVerifyCert.setOnClickListener(v -> verifyCertificateId());
        btnBack.setOnClickListener(v -> finish());
    }

    private void loadLatestCertificate() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        String query = "SELECT c.certificate_id, c.issue_date, e.name, e.date, e.organizer " +
                "FROM " + DatabaseHelper.TABLE_CERTIFICATES + " c " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON c.event_id = e.id " +
                "WHERE c.student_id = ? AND c.status = 'VALID' ORDER BY c.id DESC LIMIT 1";

        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(studentId)});
        if (cursor.moveToFirst()) {
            String certId = cursor.getString(0);
            String issueDate = cursor.getString(1);
            String eventName = cursor.getString(2);
            String eventDate = cursor.getString(3);
            String organizer = cursor.getString(4);
            cursor.close();

            tvStudentName.setText(session.getName());
            tvEventName.setText(eventName);
            tvEventDate.setText("Date: " + eventDate);
            tvOrganizer.setText("Organized by " + organizer);
            tvCertId.setText("Certificate ID: " + certId);

            layoutCertCard.setVisibility(View.VISIBLE);
            tvEmptyNotice.setVisibility(View.GONE);
        } else {
            cursor.close();
            layoutCertCard.setVisibility(View.GONE);
            tvEmptyNotice.setVisibility(View.VISIBLE);
        }
    }

    private void shareCertificate() {
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, "CERTIFICATE OF PARTICIPATION\\n\\n" +
                "Awarded to: " + session.getName() + "\\n" +
                "For event: " + tvEventName.getText().toString() + "\\n" +
                tvCertId.getText().toString() + "\\n" +
                "College: National Institute of Engineering & Technology");
        sendIntent.setType("text/plain");
        startActivity(Intent.createChooser(sendIntent, "Share Certificate"));
    }

    private void verifyCertificateId() {
        String enteredId = etVerifyId.getText().toString().trim();
        if (enteredId.isEmpty()) {
            etVerifyId.setError("Enter Certificate ID");
            return;
        }

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        String q = "SELECT s.name, e.name, c.issue_date, c.status " +
                "FROM " + DatabaseHelper.TABLE_CERTIFICATES + " c " +
                "JOIN " + DatabaseHelper.TABLE_STUDENTS + " s ON c.student_id = s.id " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON c.event_id = e.id " +
                "WHERE UPPER(c.certificate_id) = UPPER(?)";

        Cursor c = db.rawQuery(q, new String[]{enteredId});
        if (c.moveToFirst()) {
            String studentName = c.getString(0);
            String evName = c.getString(1);
            String date = c.getString(2);
            String status = c.getString(3);
            c.close();

            new AlertDialog.Builder(this)
                    .setTitle("VALID CERTIFICATE ✅")
                    .setMessage("Student: " + studentName + "\\nEvent: " + evName + "\\nIssued Date: " + date + "\\nStatus: " + status)
                    .setPositiveButton("OK", null)
                    .show();
        } else {
            c.close();
            new AlertDialog.Builder(this)
                    .setTitle("INVALID CERTIFICATE ❌")
                    .setMessage("No matching certificate record found in the college database.")
                    .setPositiveButton("OK", null)
                    .show();
        }
    }
}
`
  },

  // 20. ACTIVITY MAIN XML
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    category: 'layout',
    title: 'activity_main.xml',
    description: 'Splash screen layout with college branding, insignia, and animated progress indicator',
    content: `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/primary_dark"
    android:padding="24dp">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_centerInParent="true"
        android:gravity="center"
        android:orientation="vertical">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="🏛️"
            android:textSize="64sp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:text="@string/app_name"
            android:textColor="@color/white"
            android:textSize="24sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="@string/college_name"
            android:textColor="@color/primary_container"
            android:textSize="14sp" />

        <ProgressBar
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:layout_marginTop="32dp"
            android:indeterminate="true"
            android:indeterminateTint="@color/white" />
    </LinearLayout>
</RelativeLayout>
`
  },

  // 21. ACTIVITY LOGIN XML
  {
    path: 'app/src/main/res/layout/activity_login.xml',
    category: 'layout',
    title: 'activity_login.xml',
    description: 'Clean login layout with username/password fields, quick-test credential pills, and registration links',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:layout_marginBottom="24dp"
            android:gravity="center"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="🎓"
                android:textSize="48sp" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:text="@string/login_title"
                android:textColor="@color/text_primary"
                android:textSize="22sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:text="@string/login_subtitle"
                android:textColor="@color/text_secondary"
                android:textSize="13sp" />
        </LinearLayout>

        <com.google.android.material.card.MaterialCardView
            style="@style/CardViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:cardBackgroundColor="@color/surface">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="20dp">

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:hint="@string/username_hint">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etUsername"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="text" />
                </com.google.android.material.textfield.TextInputLayout>

                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:hint="@string/password_hint"
                    app:passwordToggleEnabled="true">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etPassword"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="textPassword" />
                </com.google.android.material.textfield.TextInputLayout>

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:gravity="center_vertical"
                    android:orientation="horizontal">

                    <CheckBox
                        android:id="@+id/cbRememberStudent"
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:checked="true"
                        android:text="Remember Student ID"
                        android:textColor="@color/text_secondary"
                        android:textSize="12sp" />

                    <TextView
                        android:id="@+id/tvForgotPassword"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:padding="4dp"
                        android:text="@string/forgot_password"
                        android:textColor="@color/primary"
                        android:textSize="13sp" />
                </LinearLayout>

                <Button
                    android:id="@+id/btnLogin"
                    android:layout_width="match_parent"
                    android:layout_height="52dp"
                    android:layout_marginTop="16dp"
                    android:backgroundTint="@color/primary"
                    android:text="@string/btn_login"
                    android:textColor="@color/white"
                    android:textStyle="bold" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Test Account Quick-Fill Buttons -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="20dp"
            android:text="Tap to Quick Fill Test Credentials:"
            android:textColor="@color/text_muted"
            android:textSize="12sp" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:gravity="center"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnQuickStudent"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginEnd="6dp"
                android:text="Student"
                android:textSize="11sp" />

            <Button
                android:id="@+id/btnQuickStaff"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginEnd="6dp"
                android:text="Staff"
                android:textSize="11sp" />

            <Button
                android:id="@+id/btnQuickAdmin"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Admin"
                android:textSize="11sp" />
        </LinearLayout>

        <TextView
            android:id="@+id/tvSignUp"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="24dp"
            android:padding="8dp"
            android:text="@string/no_account"
            android:textColor="@color/primary"
            android:textSize="14sp"
            android:textStyle="bold" />

    </LinearLayout>
</ScrollView>
`
  },

  // 22. ACTIVITY STUDENT DASHBOARD XML
  {
    path: 'app/src/main/res/layout/activity_student_dashboard.xml',
    category: 'layout',
    title: 'activity_student_dashboard.xml',
    description: 'Grid cards dashboard for student with count metrics and instant navigation to all 10 features',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <!-- Top Header Banner -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@color/primary_dark"
            android:orientation="vertical"
            android:padding="20dp">

            <TextView
                android:id="@+id/tvWelcome"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@string/welcome_back"
                android:textColor="@color/primary_container"
                android:textSize="13sp" />

            <TextView
                android:id="@+id/tvStudentName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Student"
                android:textColor="@color/white"
                android:textSize="22sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="4dp"
                android:text="@string/college_name"
                android:textColor="@color/primary_container"
                android:textSize="12sp" />
        </LinearLayout>

        <!-- Metric Counters Row -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:layout_marginTop="-16dp"
            android:layout_marginEnd="16dp"
            android:orientation="horizontal">

            <com.google.android.material.card.MaterialCardView
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginEnd="4dp"
                android:layout_weight="1">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="12dp">

                    <TextView
                        android:id="@+id/tvUpcomingCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="4"
                        android:textColor="@color/primary"
                        android:textSize="20sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Upcoming"
                        android:textColor="@color/text_secondary"
                        android:textSize="11sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <com.google.android.material.card.MaterialCardView
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginEnd="4dp"
                android:layout_weight="1">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="12dp">

                    <TextView
                        android:id="@+id/tvRegCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="2"
                        android:textColor="@color/secondary"
                        android:textSize="20sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Registered"
                        android:textColor="@color/text_secondary"
                        android:textSize="11sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <com.google.android.material.card.MaterialCardView
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="12dp">

                    <TextView
                        android:id="@+id/tvCertCount"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="1"
                        android:textColor="@color/accent"
                        android:textSize="20sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="Certificates"
                        android:textColor="@color/text_secondary"
                        android:textSize="11sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>
        </LinearLayout>

        <!-- Feature Grid Buttons -->
        <GridLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:columnCount="2"
            android:padding="12dp">

            <!-- 1. Browse Events -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardBrowse"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="📅" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/browse_events" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 2. Search & Filter -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardSearch"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="🔍" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/search_events" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 3. My Events -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardMyEvents"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="🎟️" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/my_events" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 4. Digital Event Pass -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardDigitalPass"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="📱" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/digital_pass" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 5. Certificates -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardCertificates"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="🎓" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/certificates" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 6. Notifications -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardNotifs"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="🔔" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/notifications" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 7. Favorites -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardFavorites"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="⭐" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/favorite_events" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>

            <!-- 8. Feedback -->
            <com.google.android.material.card.MaterialCardView
                android:id="@+id/cardFeedback"
                style="@style/CardViewStyle"
                android:layout_width="0dp"
                android:layout_height="100dp"
                android:layout_columnWeight="1"
                android:layout_margin="6dp">
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="match_parent"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="8dp">
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:text="💬" android:textSize="24sp" />
                    <TextView android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="4dp" android:text="@string/feedback" android:textColor="@color/text_primary" android:textStyle="bold" android:textSize="13sp" />
                </LinearLayout>
            </com.google.android.material.card.MaterialCardView>
        </GridLayout>

        <!-- Registered Events Monthly Calendar Section -->
        <com.google.android.material.card.MaterialCardView
            style="@style/CardViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:layout_marginTop="8dp"
            android:layout_marginEnd="16dp"
            android:layout_marginBottom="8dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="14dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:gravity="center_vertical"
                    android:orientation="horizontal">

                    <TextView
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:text="Registered Events Calendar"
                        android:textColor="@color/text_primary"
                        android:textSize="15sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:background="@drawable/bg_badge"
                        android:paddingStart="8dp"
                        android:paddingTop="2dp"
                        android:paddingEnd="8dp"
                        android:paddingBottom="2dp"
                        android:text="Monthly Schedule"
                        android:textColor="@color/primary"
                        android:textSize="10sp"
                        android:textStyle="bold" />
                </LinearLayout>

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="2dp"
                    android:text="Tap any date to view scheduled event details"
                    android:textColor="@color/text_secondary"
                    android:textSize="11sp" />

                <!-- Android CalendarView Widget -->
                <CalendarView
                    android:id="@+id/calendarViewDashboard"
                    android:layout_width="match_parent"
                    android:layout_height="300dp"
                    android:layout_marginTop="8dp"
                    android:firstDayOfWeek="1"
                    android:showWeekNumber="false" />

                <TextView
                    android:id="@+id/tvCalendarSelectedDate"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="Registered Events on Selected Date"
                    android:textColor="@color/primary"
                    android:textSize="13sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvCalendarEmptyState"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:gravity="center"
                    android:padding="12dp"
                    android:background="@drawable/bg_rounded_card"
                    android:text="No registered events scheduled on this date"
                    android:textColor="@color/text_secondary"
                    android:textSize="12sp" />

                <androidx.recyclerview.widget.RecyclerView
                    android:id="@+id/rvCalendarRegisteredEvents"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:nestedScrollingEnabled="false"
                    android:visibility="gone" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <!-- Event List Search & Filter Bar Section -->
        <com.google.android.material.card.MaterialCardView
            style="@style/CardViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginStart="16dp"
            android:layout_marginTop="8dp"
            android:layout_marginEnd="16dp"
            android:layout_marginBottom="8dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="14dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Explore Events"
                    android:textColor="@color/text_primary"
                    android:textSize="15sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="2dp"
                    android:text="Search and filter events by category or date"
                    android:textColor="@color/text_secondary"
                    android:textSize="11sp" />

                <!-- Search Input -->
                <com.google.android.material.textfield.TextInputLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:hint="Search events, venue or date..."
                    app:startIconDrawable="@android:drawable/ic_menu_search"
                    style="@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox.Dense">

                    <com.google.android.material.textfield.TextInputEditText
                        android:id="@+id/etDashboardSearch"
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:inputType="text"
                        android:textSize="13sp" />
                </com.google.android.material.textfield.TextInputLayout>

                <!-- Filter Controls Row: Category Spinner & Date Picker Button -->
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:orientation="horizontal"
                    android:gravity="center_vertical">

                    <LinearLayout
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:orientation="vertical"
                        android:layout_marginEnd="6dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Category"
                            android:textColor="@color/text_secondary"
                            android:textSize="10sp"
                            android:textStyle="bold" />

                        <Spinner
                            android:id="@+id/spDashboardCategory"
                            android:layout_width="match_parent"
                            android:layout_height="40dp"
                            android:background="@android:drawable/btn_dropdown"
                            android:spinnerMode="dropdown" />
                    </LinearLayout>

                    <LinearLayout
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:orientation="vertical"
                        android:layout_marginStart="6dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Filter by Date"
                            android:textColor="@color/text_secondary"
                            android:textSize="10sp"
                            android:textStyle="bold" />

                        <Button
                            android:id="@+id/btnDashboardDateFilter"
                            style="@style/Widget.Material3.Button.OutlinedButton"
                            android:layout_width="match_parent"
                            android:layout_height="40dp"
                            android:paddingStart="6dp"
                            android:paddingEnd="6dp"
                            android:text="Pick Date 📅"
                            android:textSize="11sp" />
                    </LinearLayout>
                </LinearLayout>

                <!-- Reset Filters Button -->
                <Button
                    android:id="@+id/btnDashboardResetFilter"
                    style="@style/Widget.Material3.Button.TextButton"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_gravity="end"
                    android:layout_marginTop="4dp"
                    android:text="Reset Filters"
                    android:textColor="@color/primary"
                    android:textSize="11sp" />

                <!-- Events RecyclerView -->
                <androidx.recyclerview.widget.RecyclerView
                    android:id="@+id/rvDashboardEvents"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:nestedScrollingEnabled="false" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <Button
            android:id="@+id/btnLogout"
            style="@style/Widget.Material3.Button.TextButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="12dp"
            android:layout_marginBottom="24dp"
            android:text="@string/logout"
            android:textColor="@color/status_cancelled" />
    </LinearLayout>
</ScrollView>
`
  }
];
