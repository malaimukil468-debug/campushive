package com.example.eventmanagementapp.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ConfirmationNumber
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.EventAvailable
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.data.EventEntity
import com.example.eventmanagementapp.data.RegistrationEntity
import com.example.eventmanagementapp.ui.components.DashboardActionCard
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.EventPosterImage
import com.example.eventmanagementapp.ui.components.MetricItem
import com.example.eventmanagementapp.ui.localization.AppStrings
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.EmeraldContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldPrimary
import com.example.eventmanagementapp.ui.theme.IndigoAccent
import com.example.eventmanagementapp.ui.theme.IndigoDeep
import com.example.eventmanagementapp.ui.theme.PrimaryBlue
import com.example.eventmanagementapp.ui.theme.PrimaryContainerLight
import com.example.eventmanagementapp.ui.theme.PrimaryRoyalBlue
import com.example.eventmanagementapp.ui.theme.PurpleAccent
import com.example.eventmanagementapp.ui.theme.RoseContainerLight
import com.example.eventmanagementapp.ui.theme.RoseError
import com.example.eventmanagementapp.ui.theme.TealInfo
import com.example.eventmanagementapp.viewmodel.CampusViewModel
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StudentDashboardScreen(
    viewModel: CampusViewModel,
    onBrowseEvents: (favoritesOnly: Boolean) -> Unit,
    onOpenEventDetails: (Int) -> Unit,
    onOpenDigitalPass: (Int) -> Unit,
    onOpenMyEvents: () -> Unit,
    onOpenCertificates: () -> Unit,
    onOpenCalendar: () -> Unit,
    onOpenFeedback: () -> Unit,
    onOpenNotifications: () -> Unit,
    onOpenProfile: () -> Unit,
    onLogout: () -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val notifications by viewModel.notifications.collectAsStateWithLifecycle()
    val certificates by viewModel.certificates.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    val labels = AppStrings.forLanguage(language)

    val user = session.user
    val student = session.student

    val upcomingCount = events.count { it.status == "Upcoming" || it.status == "Approved" }
    val myActiveRegs = remember(registrations, student?.id) {
        registrations.filter { it.studentId == student?.id && it.status == "REGISTERED" }
    }
    val userNotifs = remember(notifications, user?.id) {
        notifications.filter { it.userId == user?.id || it.userId == 0 }
    }
    val unreadNotifs = userNotifs.count { !it.isRead }
    val certCount = certificates.count { it.studentId == student?.id }

    // Calendar state (defaults to October 2026 to match seeded events)
    var calYear by remember { mutableIntStateOf(2026) }
    var calMonth by remember { mutableIntStateOf(9) } // 0-indexed: 9 = October
    var selectedCalDate by remember { mutableStateOf("2026-10-10") }
    var calendarCollapsed by remember { mutableStateOf(false) }

    val registeredItems = remember(myActiveRegs, events) {
        myActiveRegs.mapNotNull { reg ->
            events.firstOrNull { it.id == reg.eventId }?.let { ev -> reg to ev }
        }
    }
    val registeredByDate = remember(registeredItems) {
        registeredItems.groupBy { it.second.date }
    }

    // Search & filter state
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var selectedDateFilter by remember { mutableStateOf("All") }
    var showDatePickerDialog by remember { mutableStateOf(false) }

    val categories = listOf("All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium")
    val activeEvents = remember(events) {
        events.filter { it.status != "Cancelled" && it.status != "Rejected" }
    }
    val distinctDates = remember(activeEvents) {
        activeEvents.map { it.date }.distinct().sorted()
    }
    val todayStr = remember { SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date()) }

    val filteredEvents = remember(activeEvents, searchQuery, selectedCategory, selectedDateFilter, todayStr) {
        activeEvents.filter { ev ->
            val catMatch = selectedCategory == "All" || ev.category.equals(selectedCategory, ignoreCase = true)
            val dateMatch = when (selectedDateFilter) {
                "All" -> true
                "Today" -> ev.date == todayStr
                "Upcoming" -> ev.date >= todayStr
                else -> ev.date == selectedDateFilter
            }
            val queryMatch = if (searchQuery.isBlank()) true else {
                val q = searchQuery.trim().lowercase(Locale.US)
                ev.name.lowercase(Locale.US).contains(q) ||
                    ev.category.lowercase(Locale.US).contains(q) ||
                    ev.venue.lowercase(Locale.US).contains(q) ||
                    ev.date.lowercase(Locale.US).contains(q) ||
                    ev.organizer.lowercase(Locale.US).contains(q)
            }
            catMatch && dateMatch && queryMatch
        }
    }

    if (showDatePickerDialog) {
        val datePickerState = rememberDatePickerState()
        DatePickerDialog(
            onDismissRequest = { showDatePickerDialog = false },
            confirmButton = {
                TextButton(onClick = {
                    datePickerState.selectedDateMillis?.let { millis ->
                        selectedDateFilter = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(millis))
                    }
                    showDatePickerDialog = false
                }) { Text("Select") }
            },
            dismissButton = {
                TextButton(onClick = { showDatePickerDialog = false }) { Text("Cancel") }
            }
        ) {
            DatePicker(state = datePickerState)
        }
    }

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0)
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background),
            contentAlignment = Alignment.TopCenter
        ) {
            LazyColumn(
                modifier = Modifier
                    .widthIn(max = 600.dp)
                    .fillMaxSize()
                    .navigationBarsPadding(),
                contentPadding = PaddingValues(bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Header Banner + Overlapping Metrics Card
                item {
                    Box(modifier = Modifier.fillMaxWidth()) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                                .background(Brush.linearGradient(listOf(PrimaryRoyalBlue, IndigoDeep, Color(0xFF0F172A))))
                                .statusBarsPadding()
                                .padding(start = 20.dp, end = 20.dp, top = 14.dp, bottom = 36.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = labels.studentPortal.uppercase(),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Color(0xFF93C5FD)
                                )
                                IconButton(
                                    onClick = onOpenNotifications,
                                    modifier = Modifier.testTag("student_notifications_button")
                                ) {
                                    BadgedBox(
                                        badge = {
                                            if (unreadNotifs > 0) {
                                                Badge(containerColor = RoseError) {
                                                    Text(unreadNotifs.toString(), color = Color.White)
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Notifications,
                                            contentDescription = "Notifications",
                                            tint = Color.White
                                        )
                                    }
                                }
                            }
                            Text(
                                text = student?.name ?: user?.username ?: "Student",
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color.White
                            )
                            Text(
                                text = "${student?.department ?: "Department"} • ${student?.year ?: ""}",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFBFDBFE)
                            )
                            Text(
                                text = "Reg No: ${student?.registerNumber ?: "927625MCA026"}",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFF93C5FD),
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }

                        // Metrics Card
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp)
                                .align(Alignment.BottomCenter)
                                .offset(y = 26.dp),
                            shape = RoundedCornerShape(20.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 14.dp, horizontal = 8.dp),
                                horizontalArrangement = Arrangement.SpaceEvenly
                            ) {
                                MetricItem(upcomingCount.toString(), labels.upcoming, PrimaryBlue, Modifier.weight(1f))
                                MetricItem(myActiveRegs.size.toString(), labels.myEvents, EmeraldPrimary, Modifier.weight(1f))
                                MetricItem(certCount.toString(), labels.certificates, AmberAccent, Modifier.weight(1f))
                                MetricItem(unreadNotifs.toString(), labels.alerts, PurpleAccent, Modifier.weight(1f))
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(26.dp))
                }

                // Main Actions 2x2 Grid
                item {
                    Column(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = labels.mainActions.uppercase(),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            DashboardActionCard(
                                title = labels.browseEvents,
                                subtitle = "Symposiums, Workshops & Sports",
                                icon = Icons.Filled.CalendarMonth,
                                accentColor = PrimaryBlue,
                                testTag = "action_browse_events",
                                onClick = { onBrowseEvents(false) },
                                modifier = Modifier.weight(1f)
                            )
                            DashboardActionCard(
                                title = labels.digitalPass,
                                subtitle = "Official QR entry credentials",
                                icon = Icons.Filled.ConfirmationNumber,
                                accentColor = EmeraldPrimary,
                                testTag = "action_digital_pass",
                                onClick = { onOpenDigitalPass(-1) },
                                modifier = Modifier.weight(1f)
                            )
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            DashboardActionCard(
                                title = labels.myRegistrations,
                                subtitle = "Active & completed events",
                                icon = Icons.Filled.EventAvailable,
                                accentColor = PurpleAccent,
                                testTag = "action_my_registrations",
                                onClick = onOpenMyEvents,
                                modifier = Modifier.weight(1f)
                            )
                            DashboardActionCard(
                                title = labels.certificates,
                                subtitle = "View & verify certificates",
                                icon = Icons.Filled.WorkspacePremium,
                                accentColor = AmberAccent,
                                testTag = "action_certificates",
                                onClick = onOpenCertificates,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                // Registered Events Monthly Calendar
                item {
                    RegisteredEventsCalendarCard(
                        year = calYear,
                        month = calMonth,
                        selectedDate = selectedCalDate,
                        collapsed = calendarCollapsed,
                        registeredByDate = registeredByDate,
                        allActiveEvents = activeEvents,
                        onToggleCollapse = { calendarCollapsed = !calendarCollapsed },
                        onPrevMonth = {
                            if (calMonth == 0) { calMonth = 11; calYear -= 1 } else calMonth -= 1
                        },
                        onNextMonth = {
                            if (calMonth == 11) { calMonth = 0; calYear += 1 } else calMonth += 1
                        },
                        onToday = {
                            val cal = Calendar.getInstance()
                            calYear = cal.get(Calendar.YEAR)
                            calMonth = cal.get(Calendar.MONTH)
                            selectedCalDate = todayStr
                        },
                        onSelectDate = { dateStr ->
                            selectedCalDate = dateStr
                            val parts = dateStr.split("-")
                            if (parts.size == 3) {
                                calYear = parts[0].toIntOrNull() ?: calYear
                                calMonth = (parts[1].toIntOrNull() ?: (calMonth + 1)) - 1
                            }
                        },
                        onOpenPass = onOpenDigitalPass,
                        onOpenDetails = onOpenEventDetails,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                }

                // Event Directory Search & Filter Bar
                item {
                    Column(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = labels.eventDirectory.uppercase(),
                                    style = MaterialTheme.typography.labelLarge,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                                Surface(
                                    color = PrimaryContainerLight,
                                    shape = RoundedCornerShape(999.dp)
                                ) {
                                    Text(
                                        text = "${filteredEvents.size} of ${activeEvents.size}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = PrimaryRoyalBlue,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                            }
                            if (searchQuery.isNotBlank() || selectedCategory != "All" || selectedDateFilter != "All") {
                                TextButton(onClick = {
                                    searchQuery = ""
                                    selectedCategory = "All"
                                    selectedDateFilter = "All"
                                }) {
                                    Text("Reset Filters", color = RoseError)
                                }
                            }
                        }

                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                        ) {
                            Column(
                                modifier = Modifier.padding(12.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                OutlinedTextField(
                                    value = searchQuery,
                                    onValueChange = { searchQuery = it },
                                    placeholder = { Text("Search title, venue, category, date...") },
                                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                                    trailingIcon = {
                                        if (searchQuery.isNotBlank()) {
                                            IconButton(onClick = { searchQuery = "" }) {
                                                Icon(Icons.Filled.Close, contentDescription = "Clear search")
                                            }
                                        }
                                    },
                                    singleLine = true,
                                    shape = RoundedCornerShape(14.dp),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .testTag("dashboard_search_input")
                                )

                                // Category Filter Chips
                                Row(
                                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    categories.forEach { cat ->
                                        val count = if (cat == "All") activeEvents.size
                                        else activeEvents.count { it.category.equals(cat, ignoreCase = true) }
                                        FilterChip(
                                            selected = selectedCategory == cat,
                                            onClick = { selectedCategory = cat },
                                            label = { Text("$cat ($count)") }
                                        )
                                    }
                                }

                                // Date Filter Chips + Custom Date Picker
                                Row(
                                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    (listOf("All", "Today", "Upcoming") + distinctDates).forEach { d ->
                                        FilterChip(
                                            selected = selectedDateFilter == d,
                                            onClick = { selectedDateFilter = d },
                                            label = { Text(if (d == "All") "All Dates" else d) }
                                        )
                                    }
                                    OutlinedButton(
                                        onClick = { showDatePickerDialog = true },
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Icon(Icons.Filled.DateRange, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Pick Date")
                                    }
                                }
                            }
                        }
                    }
                }

                // Event Cards
                if (filteredEvents.isEmpty()) {
                    item {
                        Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                            EmptyStateCard(
                                icon = Icons.Filled.Search,
                                title = "No events matched your filters",
                                subtitle = "Try clearing the category, date, or search query."
                            )
                        }
                    }
                } else {
                    items(filteredEvents, key = { it.id }) { ev ->
                        DashboardEventRowCard(
                            event = ev,
                            onClick = { onOpenEventDetails(ev.id) },
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }
                }

                // More Features Section
                item {
                    Column(
                        modifier = Modifier.padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = labels.moreFeatures.uppercase(),
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Card(
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                        ) {
                            Column {
                                FeatureListItem(
                                    icon = Icons.Filled.CalendarMonth,
                                    iconTint = PrimaryBlue,
                                    title = "Event Calendar",
                                    subtitle = "Schedule view on calendar dates",
                                    testTag = "feature_calendar",
                                    onClick = onOpenCalendar
                                )
                                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                                FeatureListItem(
                                    icon = Icons.Filled.Star,
                                    iconTint = AmberAccent,
                                    title = "Favorite Events",
                                    subtitle = "Bookmarked campus activities",
                                    testTag = "feature_favorites",
                                    onClick = { onBrowseEvents(true) }
                                )
                                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                                FeatureListItem(
                                    icon = Icons.Filled.Feedback,
                                    iconTint = TealInfo,
                                    title = "Event Feedback",
                                    subtitle = "Rate attended sessions & leave review",
                                    testTag = "feature_feedback",
                                    onClick = onOpenFeedback
                                )
                                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
                                FeatureListItem(
                                    icon = Icons.Filled.Person,
                                    iconTint = IndigoAccent,
                                    title = "My Profile",
                                    subtitle = "Student info, department & contact",
                                    testTag = "feature_profile",
                                    onClick = onOpenProfile
                                )
                            }
                        }

                        OutlinedButton(
                            onClick = onLogout,
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = RoseContainerLight.copy(alpha = 0.55f),
                                contentColor = RoseError
                            ),
                            border = BorderStroke(1.dp, RoseError.copy(alpha = 0.35f)),
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .testTag("student_logout_button")
                        ) {
                            Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(labels.logout, style = MaterialTheme.typography.labelLarge)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RegisteredEventsCalendarCard(
    year: Int,
    month: Int,
    selectedDate: String,
    collapsed: Boolean,
    registeredByDate: Map<String, List<Pair<RegistrationEntity, EventEntity>>>,
    allActiveEvents: List<EventEntity>,
    onToggleCollapse: () -> Unit,
    onPrevMonth: () -> Unit,
    onNextMonth: () -> Unit,
    onToday: () -> Unit,
    onSelectDate: (String) -> Unit,
    onOpenPass: (Int) -> Unit,
    onOpenDetails: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val monthNames = listOf(
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    )
    val daysOfWeek = listOf("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa")

    val cal = remember(year, month) {
        Calendar.getInstance().apply {
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month)
            set(Calendar.DAY_OF_MONTH, 1)
        }
    }
    val daysInMonth = cal.getActualMaximum(Calendar.DAY_OF_MONTH)
    val firstDayOfWeek = cal.get(Calendar.DAY_OF_WEEK) - 1 // 0 = Sunday

    val selectedRegs = registeredByDate[selectedDate].orEmpty()
    val otherEventsOnDay = allActiveEvents.filter { ev ->
        ev.date == selectedDate && selectedRegs.none { it.second.id == ev.id }
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("Registered Events Calendar", style = MaterialTheme.typography.titleSmall)
                        Surface(color = EmeraldContainerLight, shape = RoundedCornerShape(999.dp)) {
                            Text(
                                "${registeredByDate.values.sumOf { it.size }} Booked",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFF065F46),
                                modifier = Modifier.padding(horizontal = 7.dp, vertical = 2.dp)
                            )
                        }
                    }
                    Text(
                        "Monthly schedule of your registered sessions",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                TextButton(onClick = onToggleCollapse) {
                    Text(if (collapsed) "Expand" else "Collapse")
                }
            }

            if (!collapsed) {
                // Month Selector Bar
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 6.dp, vertical = 2.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(onClick = onPrevMonth) {
                            Icon(Icons.Filled.ChevronLeft, contentDescription = "Previous Month")
                        }
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text("${monthNames[month]} $year", style = MaterialTheme.typography.titleSmall)
                            TextButton(onClick = onToday, contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp)) {
                                Text("Today", style = MaterialTheme.typography.labelMedium)
                            }
                        }
                        IconButton(onClick = onNextMonth) {
                            Icon(Icons.Filled.ChevronRight, contentDescription = "Next Month")
                        }
                    }
                }

                // Quick Jump to Registered Dates
                if (registeredByDate.isNotEmpty()) {
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        registeredByDate.entries.forEach { (d, pairs) ->
                            val isSel = selectedDate == d
                            FilterChip(
                                selected = isSel,
                                onClick = { onSelectDate(d) },
                                label = {
                                    Text(
                                        "${d.drop(5)} (${pairs.first().second.name.take(14)})",
                                        maxLines = 1
                                    )
                                }
                            )
                        }
                    }
                }

                // Day-of-week header
                Row(modifier = Modifier.fillMaxWidth()) {
                    daysOfWeek.forEachIndexed { idx, day ->
                        Text(
                            text = day,
                            style = MaterialTheme.typography.labelSmall,
                            color = if (idx == 0 || idx == 6) RoseError else MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                // Calendar Grid
                val totalCells = firstDayOfWeek + daysInMonth
                val rows = (totalCells + 6) / 7
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    for (r in 0 until rows) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            for (c in 0 until 7) {
                                val cellIndex = r * 7 + c
                                val dayNum = cellIndex - firstDayOfWeek + 1
                                if (dayNum in 1..daysInMonth) {
                                    val dateStr = String.format(Locale.US, "%04d-%02d-%02d", year, month + 1, dayNum)
                                    val regCount = registeredByDate[dateStr]?.size ?: 0
                                    val isSelected = selectedDate == dateStr
                                    Surface(
                                        modifier = Modifier
                                            .weight(1f)
                                            .height(42.dp)
                                            .clickable { onSelectDate(dateStr) },
                                        shape = RoundedCornerShape(10.dp),
                                        color = when {
                                            isSelected -> IndigoAccent
                                            regCount > 0 -> EmeraldContainerLight
                                            else -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.55f)
                                        },
                                        border = if (regCount > 0 && !isSelected) BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.45f)) else null
                                    ) {
                                        Column(
                                            modifier = Modifier.fillMaxSize().padding(2.dp),
                                            horizontalAlignment = Alignment.CenterHorizontally,
                                            verticalArrangement = Arrangement.Center
                                        ) {
                                            Text(
                                                text = dayNum.toString(),
                                                style = MaterialTheme.typography.labelMedium,
                                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                                            )
                                            if (regCount > 0) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(5.dp)
                                                        .clip(CircleShape)
                                                        .background(if (isSelected) Color(0xFFFDE68A) else EmeraldPrimary)
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    Spacer(modifier = Modifier.weight(1f).height(42.dp))
                                }
                            }
                        }
                    }
                }

                // Selected Day Schedule Panel
                Surface(
                    color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(14.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Schedule for $selectedDate", style = MaterialTheme.typography.titleSmall)
                            Text(
                                text = if (selectedRegs.isNotEmpty()) "${selectedRegs.size} Booked" else "No registrations",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (selectedRegs.isNotEmpty()) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        if (selectedRegs.isNotEmpty()) {
                            selectedRegs.forEach { (reg, ev) ->
                                Surface(
                                    color = MaterialTheme.colorScheme.surface,
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.35f))
                                ) {
                                    Column(
                                        modifier = Modifier.padding(10.dp),
                                        verticalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(ev.name, style = MaterialTheme.typography.titleSmall)
                                        Text(
                                            "${ev.startTime} - ${ev.endTime} • ${ev.venue}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            "Pass ID: ${reg.registrationId}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = IndigoAccent
                                        )
                                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                            Button(
                                                onClick = { onOpenPass(ev.id) },
                                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("View Pass", style = MaterialTheme.typography.labelMedium)
                                            }
                                            OutlinedButton(
                                                onClick = { onOpenDetails(ev.id) },
                                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("Details", style = MaterialTheme.typography.labelMedium)
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (otherEventsOnDay.isNotEmpty()) {
                            val firstEv = otherEventsOnDay.first()
                            Surface(
                                color = MaterialTheme.colorScheme.surface,
                                shape = RoundedCornerShape(12.dp),
                                border = BorderStroke(1.dp, PrimaryBlue.copy(alpha = 0.25f))
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text("Available Campus Event:", style = MaterialTheme.typography.labelSmall, color = PrimaryBlue)
                                        Text(firstEv.name, style = MaterialTheme.typography.titleSmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Button(
                                        onClick = { onOpenDetails(firstEv.id) },
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                                    ) {
                                        Text("View", style = MaterialTheme.typography.labelMedium)
                                    }
                                }
                            }
                        } else {
                            Text(
                                "You have no registered events scheduled for this day.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DashboardEventRowCard(
    event: EventEntity,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val availableSeats = (event.capacity - event.registeredCount).coerceAtLeast(0)
    val isFull = availableSeats == 0

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("dashboard_event_card_${event.id}")
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            EventPosterImage(
                posterKey = event.posterKey,
                contentDescription = event.name,
                modifier = Modifier
                    .size(70.dp)
                    .clip(RoundedCornerShape(12.dp))
            )
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(color = PrimaryContainerLight, shape = RoundedCornerShape(6.dp)) {
                        Text(
                            text = event.category,
                            style = MaterialTheme.typography.labelSmall,
                            color = PrimaryRoyalBlue,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                    Surface(
                        color = if (isFull) RoseContainerLight else EmeraldContainerLight,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = if (isFull) "FULL" else "$availableSeats seats",
                            style = MaterialTheme.typography.labelSmall,
                            color = if (isFull) RoseError else Color(0xFF065F46),
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
                Text(
                    text = event.name,
                    style = MaterialTheme.typography.titleSmall,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                        Icon(Icons.Filled.CalendarMonth, contentDescription = null, modifier = Modifier.size(12.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(event.date, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                        Icon(Icons.Filled.Schedule, contentDescription = null, modifier = Modifier.size(12.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(event.startTime, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(3.dp)) {
                    Icon(Icons.Filled.LocationOn, contentDescription = null, modifier = Modifier.size(12.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        text = event.venue,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
private fun FeatureListItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    title: String,
    subtitle: String,
    testTag: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .testTag(testTag)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            modifier = Modifier
                .size(34.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(iconTint.copy(alpha = 0.14f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(18.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleSmall)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Icon(
            imageVector = Icons.Filled.ChevronRight,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
