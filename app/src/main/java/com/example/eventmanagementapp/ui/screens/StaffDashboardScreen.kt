package com.example.eventmanagementapp.ui.screens

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.data.CheckInResult
import com.example.eventmanagementapp.ui.components.CampusTopBar
import com.example.eventmanagementapp.ui.components.DashboardActionCard
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.MetricItem
import com.example.eventmanagementapp.ui.components.StatusBadge
import com.example.eventmanagementapp.ui.localization.AppStrings
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.EmeraldContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldPrimary
import com.example.eventmanagementapp.ui.theme.IndigoAccent
import com.example.eventmanagementapp.ui.theme.IndigoDeep
import com.example.eventmanagementapp.ui.theme.PrimaryBlue
import com.example.eventmanagementapp.ui.theme.PrimaryRoyalBlue
import com.example.eventmanagementapp.ui.theme.PurpleAccent
import com.example.eventmanagementapp.ui.theme.RoseContainerLight
import com.example.eventmanagementapp.ui.theme.RoseError
import com.example.eventmanagementapp.ui.theme.TealInfo
import com.example.eventmanagementapp.viewmodel.CampusViewModel
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanOptions

@Composable
fun StaffDashboardScreen(
    viewModel: CampusViewModel,
    onCreateEvent: () -> Unit,
    onOpenQrCheckIn: () -> Unit,
    onManageEvents: () -> Unit,
    onOpenRegistrations: () -> Unit,
    onOpenStudents: () -> Unit,
    onOpenReports: () -> Unit,
    onLogout: () -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val attendance by viewModel.attendance.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    val labels = AppStrings.forLanguage(language)

    val staff = session.staff
    val totalEvents = events.size
    val upcomingEvents = events.count { it.status == "Upcoming" || it.status == "Approved" }
    val totalRegistrations = registrations.count { it.status == "REGISTERED" }
    val totalPresent = attendance.count { it.status == "Present" }

    Scaffold(
        contentWindowInsets = WindowInsets(0, 0, 0, 0),
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .navigationBarsPadding(),
            contentPadding = PaddingValues(bottom = 24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                        .background(
                            Brush.linearGradient(
                                listOf(Color(0xFF1E1B4B), IndigoDeep, PrimaryRoyalBlue)
                            )
                        )
                        .statusBarsPadding()
                        .padding(horizontal = 20.dp, vertical = 18.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp)
                            .align(Alignment.Center)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = labels.staffConsole.uppercase(),
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFFA5B4FC),
                                fontWeight = FontWeight.Bold
                            )
                            Surface(
                                color = Color(0xFF312E81),
                                shape = RoundedCornerShape(999.dp),
                                border = BorderStroke(1.dp, Color(0xFF4F46E5))
                            ) {
                                Text(
                                    text = staff?.staffId ?: "STF-MCA-104",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color.White,
                                    fontFamily = FontFamily.Monospace,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = staff?.name ?: "S.Priyadharshini",
                            style = MaterialTheme.typography.headlineSmall,
                            color = Color.White,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = staff?.department ?: "Master of Computer Applications",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFFC7D2FE)
                        )
                        Spacer(modifier = Modifier.height(14.dp))
                    }
                }
            }

            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .offset(y = (-16).dp),
                    contentAlignment = Alignment.Center
                ) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline),
                        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 14.dp, horizontal = 8.dp),
                            horizontalArrangement = Arrangement.SpaceEvenly
                        ) {
                            MetricItem(totalEvents.toString(), "Total Evts", PrimaryBlue, Modifier.weight(1f))
                            MetricItem(upcomingEvents.toString(), labels.upcoming, IndigoAccent, Modifier.weight(1f))
                            MetricItem(totalRegistrations.toString(), "Registered", EmeraldPrimary, Modifier.weight(1f))
                            MetricItem(totalPresent.toString(), "Attended", TealInfo, Modifier.weight(1f))
                        }
                    }
                }
            }

            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "MANAGEMENT TOOLS",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        DashboardActionCard(
                            title = labels.createEvent,
                            subtitle = "With venue conflict detection",
                            icon = Icons.Filled.AddCircle,
                            accentColor = PrimaryBlue,
                            testTag = "staff_create_event_card",
                            onClick = onCreateEvent,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardActionCard(
                            title = labels.qrCheckIn,
                            subtitle = "Attendance scanner & exit",
                            icon = Icons.Filled.QrCodeScanner,
                            accentColor = EmeraldPrimary,
                            testTag = "staff_qr_checkin_card",
                            onClick = onOpenQrCheckIn,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        DashboardActionCard(
                            title = labels.manageEvents,
                            subtitle = "Edit, status & live updates",
                            icon = Icons.Filled.CalendarMonth,
                            accentColor = PurpleAccent,
                            testTag = "staff_manage_events_card",
                            onClick = onManageEvents,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardActionCard(
                            title = labels.registrations,
                            subtitle = "Participant rosters & pass IDs",
                            icon = Icons.Filled.Description,
                            accentColor = AmberAccent,
                            testTag = "staff_registrations_card",
                            onClick = onOpenRegistrations,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "ANALYTICS & STUDENTS",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold
                    )

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column {
                            StaffMenuRow(
                                icon = Icons.Filled.Groups,
                                iconTint = PrimaryBlue,
                                title = "Student Directory",
                                subtitle = "Search by register number or dept",
                                testTag = "staff_student_directory_row",
                                onClick = onOpenStudents
                            )
                            HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                            StaffMenuRow(
                                icon = Icons.Filled.BarChart,
                                iconTint = TealInfo,
                                title = "Reports & Analytics",
                                subtitle = "Event-wise attendance, feedback %",
                                testTag = "staff_reports_row",
                                onClick = onOpenReports
                            )
                            HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                            StaffMenuRow(
                                icon = Icons.Filled.Feedback,
                                iconTint = AmberAccent,
                                title = "Participant Feedback",
                                subtitle = "View star ratings and comments",
                                testTag = "staff_feedback_row",
                                onClick = onOpenReports
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedButton(
                        onClick = onLogout,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("staff_logout_button"),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseError),
                        border = BorderStroke(1.dp, RoseError.copy(alpha = 0.45f))
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Staff ${labels.logout}", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun StaffMenuRow(
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
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(iconTint.copy(alpha = 0.14f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = title, tint = iconTint, modifier = Modifier.size(18.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onSurface)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateEventScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onEventCreated: () -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val user = session.user
    val staff = session.staff

    val venues = listOf(
        "Main Auditorium & CS Labs",
        "Open Air College Amphitheater",
        "Robotics Lab 3, Tech Block",
        "Indoor Sports Complex",
        "Seminar Hall 1",
        "Seminar Hall 2",
        "Mechanical Workshop Hall"
    )
    val categories = listOf("Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium", "Other")
    val eventTypes = listOf("Offline", "Online", "Hybrid")

    var name by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Technical") }
    var eventType by remember { mutableStateOf("Offline") }
    var venue by remember { mutableStateOf("Seminar Hall 1") }
    var date by remember { mutableStateOf("2026-10-18") }
    var startTime by remember { mutableStateOf("10:00") }
    var endTime by remember { mutableStateOf("16:00") }
    var capacity by remember { mutableStateOf("80") }
    var deadline by remember { mutableStateOf("2026-10-17") }
    var organizer by remember(staff) {
        mutableStateOf(if (staff != null) "${staff.name} (${staff.department})" else "College Event Committee")
    }
    var meetingLink by remember { mutableStateOf("") }
    var notice by remember { mutableStateOf<Pair<String, Boolean>?>(null) }

    var catExpanded by remember { mutableStateOf(false) }
    var typeExpanded by remember { mutableStateOf(false) }
    var venueExpanded by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Create Campus Event",
                subtitle = "Automatic venue conflict verification",
                onBack = onBack
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                notice?.let { (msg, isError) ->
                    Surface(
                        color = if (isError) RoseContainerLight else EmeraldContainerLight,
                        shape = RoundedCornerShape(14.dp),
                        border = BorderStroke(1.dp, (if (isError) RoseError else EmeraldPrimary).copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = if (isError) Icons.Filled.Error else Icons.Filled.CheckCircle,
                                contentDescription = null,
                                tint = if (isError) RoseError else EmeraldPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                            Text(
                                text = msg,
                                style = MaterialTheme.typography.bodySmall,
                                color = if (isError) RoseError else Color(0xFF065F46),
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = name,
                            onValueChange = { name = it },
                            label = { Text("Event Title *") },
                            placeholder = { Text("e.g. AI Hackathon 2026") },
                            singleLine = true,
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("create_event_title_input")
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            ExposedDropdownMenuBox(
                                expanded = catExpanded,
                                onExpandedChange = { catExpanded = !catExpanded },
                                modifier = Modifier.weight(1f)
                            ) {
                                OutlinedTextField(
                                    value = category,
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Category") },
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = catExpanded) },
                                    modifier = Modifier
                                        .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                                        .fillMaxWidth()
                                        .testTag("create_event_category_dropdown")
                                )
                                ExposedDropdownMenu(
                                    expanded = catExpanded,
                                    onDismissRequest = { catExpanded = false }
                                ) {
                                    categories.forEach { c ->
                                        DropdownMenuItem(
                                            text = { Text(c) },
                                            onClick = {
                                                category = c
                                                catExpanded = false
                                            }
                                        )
                                    }
                                }
                            }

                            ExposedDropdownMenuBox(
                                expanded = typeExpanded,
                                onExpandedChange = { typeExpanded = !typeExpanded },
                                modifier = Modifier.weight(1f)
                            ) {
                                OutlinedTextField(
                                    value = eventType,
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Mode") },
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = typeExpanded) },
                                    modifier = Modifier
                                        .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                                        .fillMaxWidth()
                                        .testTag("create_event_type_dropdown")
                                )
                                ExposedDropdownMenu(
                                    expanded = typeExpanded,
                                    onDismissRequest = { typeExpanded = false }
                                ) {
                                    eventTypes.forEach { t ->
                                        DropdownMenuItem(
                                            text = { Text(t) },
                                            onClick = {
                                                eventType = t
                                                typeExpanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        ExposedDropdownMenuBox(
                            expanded = venueExpanded,
                            onExpandedChange = { venueExpanded = !venueExpanded }
                        ) {
                            OutlinedTextField(
                                value = venue,
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Venue (Conflict Checked) *") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = venueExpanded) },
                                modifier = Modifier
                                    .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                                    .fillMaxWidth()
                                    .testTag("create_event_venue_dropdown")
                            )
                            ExposedDropdownMenu(
                                expanded = venueExpanded,
                                onDismissRequest = { venueExpanded = false }
                            ) {
                                venues.forEach { v ->
                                    DropdownMenuItem(
                                        text = { Text(v) },
                                        onClick = {
                                            venue = v
                                            venueExpanded = false
                                        }
                                    )
                                }
                            }
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = date,
                                onValueChange = { date = it },
                                label = { Text("Date *") },
                                placeholder = { Text("YYYY-MM-DD") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1.3f)
                                    .testTag("create_event_date_input")
                            )
                            OutlinedTextField(
                                value = startTime,
                                onValueChange = { startTime = it },
                                label = { Text("Start") },
                                placeholder = { Text("10:00") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("create_event_start_input")
                            )
                            OutlinedTextField(
                                value = endTime,
                                onValueChange = { endTime = it },
                                label = { Text("End") },
                                placeholder = { Text("16:00") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("create_event_end_input")
                            )
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            OutlinedTextField(
                                value = capacity,
                                onValueChange = { capacity = it.filter { ch -> ch.isDigit() } },
                                label = { Text("Capacity *") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("create_event_capacity_input")
                            )
                            OutlinedTextField(
                                value = deadline,
                                onValueChange = { deadline = it },
                                label = { Text("Reg Deadline *") },
                                placeholder = { Text("YYYY-MM-DD") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1.2f)
                                    .testTag("create_event_deadline_input")
                            )
                        }

                        OutlinedTextField(
                            value = organizer,
                            onValueChange = { organizer = it },
                            label = { Text("Organizer Name") },
                            singleLine = true,
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("create_event_organizer_input")
                        )

                        OutlinedTextField(
                            value = description,
                            onValueChange = { description = it },
                            label = { Text("Description") },
                            placeholder = { Text("Brief schedule and requirements...") },
                            minLines = 2,
                            maxLines = 4,
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("create_event_description_input")
                        )

                        if (eventType != "Offline") {
                            OutlinedTextField(
                                value = meetingLink,
                                onValueChange = { meetingLink = it },
                                label = { Text("Meeting Link (Meet / Zoom)") },
                                placeholder = { Text("https://meet.google.com/xyz") },
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("create_event_meeting_link_input")
                            )
                        }

                        Button(
                            onClick = {
                                val cap = capacity.toIntOrNull() ?: 0
                                when {
                                    name.isBlank() || date.isBlank() || startTime.isBlank() || endTime.isBlank() -> {
                                        notice = "Please fill in all mandatory fields." to true
                                    }
                                    cap <= 0 -> {
                                        notice = "Capacity must be greater than zero." to true
                                    }
                                    endTime <= startTime -> {
                                        notice = "End time must be after start time." to true
                                    }
                                    deadline > date -> {
                                        notice = "Registration deadline cannot be after event date." to true
                                    }
                                    else -> {
                                        viewModel.createEvent(
                                            name = name.trim(),
                                            description = description.trim().ifBlank { "Exciting college event open to all students." },
                                            category = category,
                                            date = date.trim(),
                                            startTime = startTime.trim(),
                                            endTime = endTime.trim(),
                                            venue = venue,
                                            eventType = eventType,
                                            organizer = organizer.trim(),
                                            capacity = cap,
                                            registrationDeadline = deadline.trim(),
                                            meetingLink = meetingLink.trim()
                                        ) { res ->
                                            if (res.success) {
                                                notice = res.message to false
                                                onEventCreated()
                                            } else {
                                                notice = res.message to true
                                            }
                                        }
                                    }
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .testTag("create_event_submit_button"),
                            shape = RoundedCornerShape(14.dp)
                        ) {
                            Text(
                                text = if (user?.role == "ADMIN") "Publish Event Immediately" else "Submit Event for Admin Approval",
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StaffAttendanceScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val attendance by viewModel.attendance.collectAsStateWithLifecycle()

    var scanInput by remember { mutableStateOf("") }
    var scanResult by remember { mutableStateOf<CheckInResult?>(null) }
    var cameraMessage by remember { mutableStateOf<String?>(null) }

    val activeRegs = remember(registrations) {
        registrations.filter { it.status == "REGISTERED" }
    }

    val performScan: (String) -> Unit = { code ->
        val trimmed = code.trim()
        if (trimmed.isNotEmpty()) {
            viewModel.checkInStudent(trimmed) { res ->
                scanResult = res
                scanInput = ""
            }
        }
    }

    val zxingLauncher = rememberLauncherForActivityResult(ScanContract()) { result ->
        val contents = result.contents
        if (!contents.isNullOrBlank()) {
            performScan(contents)
        }
    }

    val launchCameraScanner = {
        val options = ScanOptions().apply {
            setDesiredBarcodeFormats(ScanOptions.QR_CODE)
            setPrompt("Scan student Digital Event Pass QR code")
            setBeepEnabled(true)
            setBarcodeImageEnabled(false)
            setOrientationLocked(false)
        }
        zxingLauncher.launch(options)
    }

    val cameraPermissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            cameraMessage = null
            launchCameraScanner()
        } else {
            cameraMessage = "Camera permission is required to scan QR codes. You can still enter the Pass ID manually below."
        }
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "QR Code Check-In",
                subtitle = "Record student entry & exit timestamps",
                onBack = onBack
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
                ) {
                    Column(
                        modifier = Modifier.padding(18.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(54.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.12f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.QrCodeScanner,
                                contentDescription = "QR Scanner",
                                tint = Color(0xFF93C5FD),
                                modifier = Modifier.size(28.dp)
                            )
                        }
                        Text(
                            text = "Digital Pass QR Check-In Scanner",
                            style = MaterialTheme.typography.titleSmall,
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Open camera scanner or paste a Pass ID / QR JSON payload",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFF94A3B8)
                        )

                        Button(
                            onClick = {
                                val granted = ContextCompat.checkSelfPermission(
                                    context,
                                    Manifest.permission.CAMERA
                                ) == PackageManager.PERMISSION_GRANTED
                                if (granted) {
                                    launchCameraScanner()
                                } else {
                                    cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .testTag("open_qr_camera_button"),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary)
                        ) {
                            Icon(Icons.Filled.CameraAlt, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Open QR Camera Scanner", fontWeight = FontWeight.Bold)
                        }

                        cameraMessage?.let { msg ->
                            Text(
                                text = msg,
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFFCD34D)
                            )
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = scanInput,
                                onValueChange = { scanInput = it },
                                placeholder = { Text("Enter Pass ID (e.g. PASS-2026-0261)") },
                                singleLine = true,
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("manual_pass_id_input")
                            )
                            Button(
                                onClick = { performScan(scanInput) },
                                modifier = Modifier
                                    .height(52.dp)
                                    .testTag("process_pass_id_button"),
                                shape = RoundedCornerShape(14.dp)
                            ) {
                                Text("Process")
                            }
                        }
                    }
                }
            }

            scanResult?.let { result ->
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp)
                            .testTag("scan_result_card"),
                        color = if (result.success) EmeraldContainerLight else RoseContainerLight,
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(
                            1.dp,
                            (if (result.success) EmeraldPrimary else RoseError).copy(alpha = 0.4f)
                        )
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = if (result.success) Icons.Filled.CheckCircle else Icons.Filled.Error,
                                    contentDescription = null,
                                    tint = if (result.success) EmeraldPrimary else RoseError,
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = result.message,
                                    style = MaterialTheme.typography.titleSmall,
                                    color = if (result.success) Color(0xFF065F46) else RoseError,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            result.studentName?.let { sName ->
                                HorizontalDivider(color = EmeraldPrimary.copy(alpha = 0.2f))
                                Text("Student: $sName", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                result.eventName?.let { eName ->
                                    Text("Event: $eName", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                }
                                result.checkInTime?.let {
                                    Text("Entry Time: $it", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                }
                                result.checkOutTime?.let {
                                    Text("Exit Time: $it", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                }
                            }
                        }
                    }
                }
            }

            item {
                Text(
                    text = "1-TAP QUICK CHECK-IN (REGISTERED STUDENTS)",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                )
            }

            if (activeRegs.isEmpty()) {
                item {
                    Box(modifier = Modifier.widthIn(max = 600.dp)) {
                        EmptyStateCard(
                            icon = Icons.Filled.QrCodeScanner,
                            title = "No active registrations",
                            subtitle = "Students who register for events will appear here."
                        )
                    }
                }
            } else {
                items(activeRegs.take(4), key = { it.id }) { reg ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = reg.studentName,
                                    style = MaterialTheme.typography.titleSmall,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = "${reg.eventName} • ${reg.registrationId}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            OutlinedButton(
                                onClick = { performScan(reg.registrationId) },
                                modifier = Modifier.testTag("quick_scan_pass_${reg.id}"),
                                shape = RoundedCornerShape(10.dp)
                            ) {
                                Text("Scan Pass")
                            }
                        }
                    }
                }
            }

            item {
                Text(
                    text = "RECENT ATTENDANCE RECORDS (${attendance.size})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                )
            }

            items(attendance, key = { it.id }) { record ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(record.studentName, style = MaterialTheme.typography.titleSmall)
                            Text(
                                text = "In: ${record.checkIn}" + (record.checkOut?.let { " • Out: $it" } ?: " • Active"),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        StatusBadge(status = record.status)
                    }
                }
            }
        }
    }
}
