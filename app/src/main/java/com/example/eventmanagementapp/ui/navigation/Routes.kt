package com.example.eventmanagementapp.ui.navigation

import kotlinx.serialization.Serializable

@Serializable object LoginRoute
@Serializable object SignupRoute
@Serializable object ForgotPasswordRoute

// Student routes
@Serializable object StudentDashboardRoute
@Serializable data class BrowseEventsRoute(val favoritesOnly: Boolean = false)
@Serializable data class EventDetailsRoute(val eventId: Int)
@Serializable data class EventRegistrationRoute(val eventId: Int)
@Serializable data class DigitalPassRoute(val eventId: Int = -1)
@Serializable object MyEventsRoute
@Serializable object CertificatesRoute
@Serializable data class FeedbackRoute(val eventId: Int = -1)
@Serializable object CalendarRoute
@Serializable object NotificationsRoute
@Serializable object ProfileRoute

// Staff routes
@Serializable object StaffDashboardRoute
@Serializable object CreateEventRoute
@Serializable object StaffAttendanceRoute
@Serializable object ManageEventsRoute
@Serializable object RegistrationManagementRoute
@Serializable object StaffStudentListRoute
@Serializable object StaffReportsRoute

// Admin routes
@Serializable object AdminDashboardRoute
@Serializable object AdminApprovalsRoute
@Serializable object AdminReportsRoute
@Serializable object ManageStaffRoute
@Serializable object ActivityLogsRoute
@Serializable object SettingsRoute
@Serializable object HelpFaqRoute
