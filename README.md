# Campus Hive — College Event Management System (Android Application)

Campus Hive is a comprehensive, production-grade Android application for higher education institutions that streamlines campus event publishing, student seat reservations, digital QR event passes, staff attendance verification, and automated certificate issuance.

## Architecture & Project Structure

- **`app/src/main/AndroidManifest.xml`**: Complete manifest declaring camera, notification, exact alarm, and vibration permissions, plus all 25+ activities.
- **`app/src/main/java/com/example/eventmanagementapp/`**:
  - `database/DatabaseHelper.java`: Full SQLiteOpenHelper managing 13 relational tables, automated waitlist promotion, venue conflict detection, and seed records.
  - `utils/SessionManager.java`: SharedPreferences session state, role validation, theme preferences, and multi-language keys.
  - `utils/QRCodeHelper.java`: ZXing QR code generator creating scannable digital event pass bitmaps.
  - `utils/NotificationHelper.java` & `receiver/EventReminderReceiver.java`: Android NotificationManager with high-priority notification channels and AlarmManager broadcast receiver.
  - `student/`: Activities for Student Dashboard, Event Search, Event Registration, Digital Pass, Certificates, Calendar, and Feedback.
  - `staff/`: Activities for Staff Dashboard, Create Event, Event Management, QR Scanner, Attendance, and Reports.
  - `admin/`: Activities for Admin Dashboard, Event Approvals, Staff Directory, Activity Logs, and Analytics.
- **`app/src/main/res/`**:
  - XML layouts (`activity_main.xml`, `activity_login.xml`, `activity_student_dashboard.xml`, `activity_digital_pass.xml`, `activity_certificate.xml`, `item_event.xml`).
  - Values (`colors.xml`, `strings.xml`, `themes.xml`) conforming to Material Design 3.

## Roles & Pre-Seeded Accounts

| Role | Username / Identifier | Password | Name & Department |
| :--- | :--- | :--- | :--- |
| **Student** | `927625MCA026` / `student` | `1234` | Monika Sivakumar (Master of Computer Applications) |
| **Staff** | `STF-MCA-104` / `staff` | `1234` | S.Priyadharshini (Master of Computer Applications) |
| **Admin** | `admin` | `admin123` | Campus Administrator |

## Key Features

1. **Venue Conflict Detection**: Automatically prevents scheduling collisions for the same venue, date, and overlapping time slots.
2. **Dynamic QR Event Passes**: Generates secure verification codes for registered attendees.
3. **Waitlist Auto-Promotion**: When an attendee cancels a booking, the next queued student is automatically promoted and issued a pass.
4. **Attendance & Instant Certificates**: Staff scan passes or manually verify attendance to mark presence and issue tamper-verifiable certificates.
5. **Notification System**: Push notifications for registration confirmations, reminders, and schedule updates.
