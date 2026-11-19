package com.example.eventmanagementapp

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.example.eventmanagementapp.ui.navigation.ActivityLogsRoute
import com.example.eventmanagementapp.ui.navigation.AdminApprovalsRoute
import com.example.eventmanagementapp.ui.navigation.AdminDashboardRoute
import com.example.eventmanagementapp.ui.navigation.AdminReportsRoute
import com.example.eventmanagementapp.ui.navigation.BrowseEventsRoute
import com.example.eventmanagementapp.ui.navigation.CalendarRoute
import com.example.eventmanagementapp.ui.navigation.CertificatesRoute
import com.example.eventmanagementapp.ui.navigation.CreateEventRoute
import com.example.eventmanagementapp.ui.navigation.DigitalPassRoute
import com.example.eventmanagementapp.ui.navigation.EventDetailsRoute
import com.example.eventmanagementapp.ui.navigation.EventRegistrationRoute
import com.example.eventmanagementapp.ui.navigation.FeedbackRoute
import com.example.eventmanagementapp.ui.navigation.ForgotPasswordRoute
import com.example.eventmanagementapp.ui.navigation.HelpFaqRoute
import com.example.eventmanagementapp.ui.navigation.LoginRoute
import com.example.eventmanagementapp.ui.navigation.ManageEventsRoute
import com.example.eventmanagementapp.ui.navigation.ManageStaffRoute
import com.example.eventmanagementapp.ui.navigation.MyEventsRoute
import com.example.eventmanagementapp.ui.navigation.NotificationsRoute
import com.example.eventmanagementapp.ui.navigation.ProfileRoute
import com.example.eventmanagementapp.ui.navigation.RegistrationManagementRoute
import com.example.eventmanagementapp.ui.navigation.SettingsRoute
import com.example.eventmanagementapp.ui.navigation.SignupRoute
import com.example.eventmanagementapp.ui.navigation.StaffAttendanceRoute
import com.example.eventmanagementapp.ui.navigation.StaffDashboardRoute
import com.example.eventmanagementapp.ui.navigation.StaffReportsRoute
import com.example.eventmanagementapp.ui.navigation.StaffStudentListRoute
import com.example.eventmanagementapp.ui.navigation.StudentDashboardRoute
import com.example.eventmanagementapp.ui.screens.ActivityLogScreen
import com.example.eventmanagementapp.ui.screens.AdminAnalyticsScreen
import com.example.eventmanagementapp.ui.screens.AdminDashboardScreen
import com.example.eventmanagementapp.ui.screens.BrowseEventsScreen
import com.example.eventmanagementapp.ui.screens.CalendarScreen
import com.example.eventmanagementapp.ui.screens.CertificatesScreen
import com.example.eventmanagementapp.ui.screens.CreateEventScreen
import com.example.eventmanagementapp.ui.screens.DigitalPassScreen
import com.example.eventmanagementapp.ui.screens.EventApprovalScreen
import com.example.eventmanagementapp.ui.screens.EventDetailsScreen
import com.example.eventmanagementapp.ui.screens.EventRegistrationScreen
import com.example.eventmanagementapp.ui.screens.FeedbackScreen
import com.example.eventmanagementapp.ui.screens.ForgotPasswordScreen
import com.example.eventmanagementapp.ui.screens.HelpFaqScreen
import com.example.eventmanagementapp.ui.screens.LoginScreen
import com.example.eventmanagementapp.ui.screens.ManageEventsScreen
import com.example.eventmanagementapp.ui.screens.ManageStaffScreen
import com.example.eventmanagementapp.ui.screens.MyEventsScreen
import com.example.eventmanagementapp.ui.screens.NotificationsScreen
import com.example.eventmanagementapp.ui.screens.ProfileScreen
import com.example.eventmanagementapp.ui.screens.RegistrationManagementScreen
import com.example.eventmanagementapp.ui.screens.SettingsScreen
import com.example.eventmanagementapp.ui.screens.SignupScreen
import com.example.eventmanagementapp.ui.screens.StaffAttendanceScreen
import com.example.eventmanagementapp.ui.screens.StaffDashboardScreen
import com.example.eventmanagementapp.ui.screens.StaffReportsScreen
import com.example.eventmanagementapp.ui.screens.StaffStudentListScreen
import com.example.eventmanagementapp.ui.screens.StudentDashboardScreen
import com.example.eventmanagementapp.ui.theme.CampusHiveTheme
import com.example.eventmanagementapp.utils.NotificationHelper
import com.example.eventmanagementapp.viewmodel.CampusViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        NotificationHelper.ensureChannel(this)

        setContent {
            val viewModel: CampusViewModel = viewModel()
            val isDark by viewModel.isDark.collectAsStateWithLifecycle()
            val navController = rememberNavController()

            val notifPermissionLauncher = rememberLauncherForActivityResult(
                ActivityResultContracts.RequestPermission()
            ) { }

            LaunchedEffect(Unit) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    val granted = ContextCompat.checkSelfPermission(
                        this@MainActivity,
                        Manifest.permission.POST_NOTIFICATIONS
                    ) == PackageManager.PERMISSION_GRANTED
                    if (!granted) {
                        notifPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                    }
                }
            }

            CampusHiveTheme(darkTheme = isDark) {
                NavHost(
                    navController = navController,
                    startDestination = LoginRoute
                ) {
                    composable<LoginRoute> {
                        LoginScreen(
                            viewModel = viewModel,
                            onLoginSuccess = { role ->
                                val dest: Any = when (role) {
                                    "STAFF" -> StaffDashboardRoute
                                    "ADMIN" -> AdminDashboardRoute
                                    else -> StudentDashboardRoute
                                }
                                navController.navigate(dest) {
                                    popUpTo<LoginRoute> { inclusive = true }
                                }
                            },
                            onNavigateSignup = { navController.navigate(SignupRoute) },
                            onNavigateForgot = { navController.navigate(ForgotPasswordRoute) }
                        )
                    }

                    composable<SignupRoute> {
                        SignupScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onSignupSuccess = { navController.popBackStack() }
                        )
                    }

                    composable<ForgotPasswordRoute> {
                        ForgotPasswordScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onResetSuccess = { navController.popBackStack() }
                        )
                    }

                    // Student Routes
                    composable<StudentDashboardRoute> {
                        StudentDashboardScreen(
                            viewModel = viewModel,
                            onBrowseEvents = { favs -> navController.navigate(BrowseEventsRoute(favs)) },
                            onOpenEventDetails = { id -> navController.navigate(EventDetailsRoute(id)) },
                            onOpenDigitalPass = { id -> navController.navigate(DigitalPassRoute(id)) },
                            onOpenMyEvents = { navController.navigate(MyEventsRoute) },
                            onOpenCertificates = { navController.navigate(CertificatesRoute) },
                            onOpenCalendar = { navController.navigate(CalendarRoute) },
                            onOpenFeedback = { navController.navigate(FeedbackRoute(-1)) },
                            onOpenNotifications = { navController.navigate(NotificationsRoute) },
                            onOpenProfile = { navController.navigate(ProfileRoute) },
                            onLogout = {
                                viewModel.logout()
                                navController.navigate(LoginRoute) {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }

                    composable<BrowseEventsRoute> { entry ->
                        val args = entry.toRoute<BrowseEventsRoute>()
                        BrowseEventsScreen(
                            viewModel = viewModel,
                            favoritesOnly = args.favoritesOnly,
                            onBack = { navController.popBackStack() },
                            onSelectEvent = { id -> navController.navigate(EventDetailsRoute(id)) }
                        )
                    }

                    composable<EventDetailsRoute> { entry ->
                        val args = entry.toRoute<EventDetailsRoute>()
                        EventDetailsScreen(
                            viewModel = viewModel,
                            eventId = args.eventId,
                            onBack = { navController.popBackStack() },
                            onProceedToRegister = { id -> navController.navigate(EventRegistrationRoute(id)) },
                            onOpenDigitalPass = { id -> navController.navigate(DigitalPassRoute(id)) }
                        )
                    }

                    composable<EventRegistrationRoute> { entry ->
                        val args = entry.toRoute<EventRegistrationRoute>()
                        EventRegistrationScreen(
                            viewModel = viewModel,
                            eventId = args.eventId,
                            onBack = { navController.popBackStack() },
                            onRegistrationComplete = { id, waitlisted ->
                                val target: Any = if (waitlisted) MyEventsRoute else DigitalPassRoute(id)
                                navController.navigate(target) {
                                    popUpTo<StudentDashboardRoute>()
                                }
                            }
                        )
                    }

                    composable<DigitalPassRoute> { entry ->
                        val args = entry.toRoute<DigitalPassRoute>()
                        DigitalPassScreen(
                            viewModel = viewModel,
                            eventId = args.eventId,
                            onBack = { navController.popBackStack() },
                            onBrowseEvents = { navController.navigate(BrowseEventsRoute(false)) },
                            onOpenMyEvents = { navController.navigate(MyEventsRoute) }
                        )
                    }

                    composable<MyEventsRoute> {
                        MyEventsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onOpenDigitalPass = { id -> navController.navigate(DigitalPassRoute(id)) },
                            onOpenFeedback = { id -> navController.navigate(FeedbackRoute(id)) }
                        )
                    }

                    composable<CertificatesRoute> {
                        CertificatesScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<FeedbackRoute> { entry ->
                        val args = entry.toRoute<FeedbackRoute>()
                        FeedbackScreen(
                            viewModel = viewModel,
                            initialEventId = args.eventId,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<CalendarRoute> {
                        CalendarScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onSelectEvent = { id -> navController.navigate(EventDetailsRoute(id)) }
                        )
                    }

                    composable<NotificationsRoute> {
                        NotificationsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<ProfileRoute> {
                        ProfileScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    // Staff Routes
                    composable<StaffDashboardRoute> {
                        StaffDashboardScreen(
                            viewModel = viewModel,
                            onCreateEvent = { navController.navigate(CreateEventRoute) },
                            onOpenQrCheckIn = { navController.navigate(StaffAttendanceRoute) },
                            onManageEvents = { navController.navigate(ManageEventsRoute) },
                            onOpenRegistrations = { navController.navigate(RegistrationManagementRoute) },
                            onOpenStudents = { navController.navigate(StaffStudentListRoute) },
                            onOpenReports = { navController.navigate(StaffReportsRoute) },
                            onLogout = {
                                viewModel.logout()
                                navController.navigate(LoginRoute) {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }

                    composable<CreateEventRoute> {
                        CreateEventScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onEventCreated = {
                                navController.navigate(ManageEventsRoute) {
                                    popUpTo<StaffDashboardRoute>()
                                }
                            }
                        )
                    }

                    composable<StaffAttendanceRoute> {
                        StaffAttendanceScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<ManageEventsRoute> {
                        ManageEventsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() },
                            onCreateEvent = { navController.navigate(CreateEventRoute) }
                        )
                    }

                    composable<RegistrationManagementRoute> {
                        RegistrationManagementScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<StaffStudentListRoute> {
                        StaffStudentListScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<StaffReportsRoute> {
                        StaffReportsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    // Admin Routes
                    composable<AdminDashboardRoute> {
                        AdminDashboardScreen(
                            viewModel = viewModel,
                            onOpenAnalytics = { navController.navigate(AdminReportsRoute) },
                            onOpenApprovals = { navController.navigate(AdminApprovalsRoute) },
                            onOpenManageStaff = { navController.navigate(ManageStaffRoute) },
                            onOpenActivityLogs = { navController.navigate(ActivityLogsRoute) },
                            onOpenSettings = { navController.navigate(SettingsRoute) },
                            onOpenHelpFaq = { navController.navigate(HelpFaqRoute) },
                            onLogout = {
                                viewModel.logout()
                                navController.navigate(LoginRoute) {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }

                    composable<AdminApprovalsRoute> {
                        EventApprovalScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<AdminReportsRoute> {
                        AdminAnalyticsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<ManageStaffRoute> {
                        ManageStaffScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<ActivityLogsRoute> {
                        ActivityLogScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<SettingsRoute> {
                        SettingsScreen(
                            viewModel = viewModel,
                            onBack = { navController.popBackStack() }
                        )
                    }

                    composable<HelpFaqRoute> {
                        HelpFaqScreen(
                            onBack = { navController.popBackStack() }
                        )
                    }
                }
            }
        }
    }
}
