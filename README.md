# CampusHive — College Event Management System (Android Kotlin + Jetpack Compose)

CampusHive is a native Android application built with **Kotlin**, **Jetpack Compose**, **Material Design 3**, **Room (SQLite)**, **Type-Safe Navigation Compose**, and **ZXing** for collegiate event publishing, student registrations, digital QR event passes, staff attendance tracking, automated certificate issuance, and administrative analytics.

## Architecture & Project Structure

- **`app/src/main/AndroidManifest.xml`**: Single-activity Compose setup (`MainActivity`) plus ZXing `CaptureActivity`, declaring `CAMERA`, `VIBRATE`, and `POST_NOTIFICATIONS` permissions.
- **`app/src/main/java/com/example/eventmanagementapp/`**:
  - `data/`: Room entities (`Entities.kt`), reactive DAOs (`AppDao.kt`), `AppDatabase.kt` (`CollegeEventDB.db`), and `CampusRepository.kt` (venue conflict detection, waitlist auto-promotion, QR check-in/check-out, certificate generation, activity audit logs, and seeding).
  - `viewmodel/CampusViewModel.kt`: `AndroidViewModel` exposing `StateFlow` streams, SharedPreferences persistence (theme, language, remembered student ID), and repository actions.
  - `utils/`: `QrGenerator.kt` (ZXing `ImageBitmap` QR pass rendering) and `NotificationHelper.kt` (Android notification channels and runtime notification dispatch).
  - `ui/theme/`, `ui/localization/`, `ui/navigation/`, `ui/components/`: Material 3 light/dark themes, English/Tamil (`en`/`ta`) localization, `@Serializable` navigation routes, and reusable Compose components.
  - `ui/screens/`:
    - Authentication: `AuthScreens.kt` (Student/Staff/Admin login, Biometric quick login, Student signup, Password reset).
    - Student Portal: `StudentDashboardScreen.kt`, `StudentSecondaryScreens.kt`, `StudentMoreScreens.kt` (Browse/Search/Date filter, Event Details, Registration & Waitlist, Digital QR Pass, My Events, Certificates + Verifier, Feedback, Calendar, Notifications, Profile).
    - Staff Console: `StaffDashboardScreen.kt`, `StaffManagementScreens.kt` (Create Event with venue conflict checks, QR Camera Check-In & Exit, Manage Events & Live Broadcasts, Registration Rosters, Student Directory, Reports).
    - Admin Panel: `AdminScreens.kt`, `AdminAnalyticsScreen.kt` (Event Approvals, Staff Management, Activity Audit Logs, Settings with Dark Mode / Tamil / DB Reset, Help & FAQ, Compose Canvas Analytics & JSON Export).

## Pre-Seeded Demo Accounts

| Role | Username / Identifier | Password | Name & Department |
| :--- | :--- | :--- | :--- |
| **Student** | `927625MCA026` / `student` | `1234` | Monika Sivakumar (Master of Computer Applications) |
| **Staff** | `STF-MCA-104` / `staff` | `1234` | S.Priyadharshini (Master of Computer Applications) |
| **Admin** | `admin` | `admin123` | Campus Administrator |
