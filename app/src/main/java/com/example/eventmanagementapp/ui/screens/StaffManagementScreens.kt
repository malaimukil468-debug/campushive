package com.example.eventmanagementapp.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
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
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.ui.components.CampusTopBar
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.StatusBadge
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.EmeraldContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldPrimary
import com.example.eventmanagementapp.ui.theme.IndigoDeep
import com.example.eventmanagementapp.ui.theme.PrimaryBlue
import com.example.eventmanagementapp.ui.theme.PrimaryRoyalBlue
import com.example.eventmanagementapp.ui.theme.RoseError
import com.example.eventmanagementapp.viewmodel.CampusViewModel
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManageEventsScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onCreateEvent: () -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    var targetEventId by remember(events) { mutableIntStateOf(events.firstOrNull()?.id ?: 1) }
    var liveMessage by remember { mutableStateOf("") }
    var broadcastNotice by remember { mutableStateOf<String?>(null) }
    var dropdownExpanded by remember { mutableStateOf(false) }
    var cancelTargetId by remember { mutableStateOf<Int?>(null) }

    val selectedEvent = events.firstOrNull { it.id == targetEventId } ?: events.firstOrNull()

    cancelTargetId?.let { idToCancel ->
        AlertDialog(
            onDismissRequest = { cancelTargetId = null },
            title = { Text("Cancel Campus Event?") },
            text = { Text("Registered students will receive cancellation alerts in their notification feed.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.setEventStatus(idToCancel, "Cancelled")
                        cancelTargetId = null
                    },
                    modifier = Modifier.testTag("confirm_cancel_event_button")
                ) {
                    Text("Cancel Event", color = RoseError, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { cancelTargetId = null }) {
                    Text("Keep Event")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Manage Events",
                subtitle = "Live updates & event status control",
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.Transparent)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Brush.linearGradient(listOf(PrimaryRoyalBlue, IndigoDeep)))
                            .padding(16.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Campaign,
                                    contentDescription = "Broadcast",
                                    tint = Color(0xFFFDA4AF),
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "PUBLISH LIVE EVENT UPDATE",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                            Text(
                                text = "Notify all registered attendees in real-time about room changes or schedule updates.",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFFBFDBFE)
                            )

                            broadcastNotice?.let { msg ->
                                Surface(
                                    color = EmeraldContainerLight,
                                    shape = RoundedCornerShape(10.dp)
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(16.dp))
                                        Text(msg, style = MaterialTheme.typography.bodySmall, color = Color(0xFF065F46))
                                    }
                                }
                            }

                            ExposedDropdownMenuBox(
                                expanded = dropdownExpanded,
                                onExpandedChange = { dropdownExpanded = !dropdownExpanded }
                            ) {
                                OutlinedTextField(
                                    value = selectedEvent?.name ?: "Select Event",
                                    onValueChange = {},
                                    readOnly = true,
                                    label = { Text("Target Event", color = Color(0xFFBFDBFE)) },
                                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                                    modifier = Modifier
                                        .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                                        .fillMaxWidth()
                                        .background(Color.White, RoundedCornerShape(12.dp))
                                        .testTag("broadcast_event_dropdown")
                                )
                                ExposedDropdownMenu(
                                    expanded = dropdownExpanded,
                                    onDismissRequest = { dropdownExpanded = false }
                                ) {
                                    events.forEach { ev ->
                                        DropdownMenuItem(
                                            text = { Text(ev.name) },
                                            onClick = {
                                                targetEventId = ev.id
                                                dropdownExpanded = false
                                            }
                                        )
                                    }
                                }
                            }

                            OutlinedTextField(
                                value = liveMessage,
                                onValueChange = { liveMessage = it },
                                placeholder = { Text("e.g. Venue moved to Seminar Hall B. Begins at 10:30 AM.") },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color.White, RoundedCornerShape(12.dp))
                                    .testTag("broadcast_message_input")
                            )

                            Button(
                                onClick = {
                                    if (liveMessage.isNotBlank() && selectedEvent != null) {
                                        viewModel.broadcastEventUpdate(selectedEvent.id, liveMessage.trim()) { res ->
                                            broadcastNotice = res.message
                                            liveMessage = ""
                                        }
                                    }
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("broadcast_submit_button"),
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue)
                            ) {
                                Text("Broadcast to Attendees", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ALL CAMPUS EVENTS (${events.size})",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold
                    )
                    TextButton(
                        onClick = onCreateEvent,
                        modifier = Modifier.testTag("manage_events_new_button")
                    ) {
                        Icon(Icons.Filled.AddCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("New Event", fontWeight = FontWeight.Bold)
                    }
                }
            }

            items(events, key = { it.id }) { ev ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            StatusBadge(status = ev.status)
                            Text(
                                text = ev.category,
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(ev.name, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onSurface)
                        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Filled.CalendarMonth, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text(ev.date, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Filled.LocationOn, contentDescription = null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text(ev.venue, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            }
                        }
                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "${ev.registeredCount} / ${ev.capacity} Registered",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            if (ev.status != "Cancelled") {
                                TextButton(
                                    onClick = { cancelTargetId = ev.id },
                                    modifier = Modifier.testTag("cancel_event_${ev.id}")
                                ) {
                                    Text("Cancel Event", color = RoseError, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegistrationManagementScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()

    var selectedEventId by remember(events) { mutableIntStateOf(events.firstOrNull()?.id ?: 1) }
    var searchQuery by remember { mutableStateOf("") }
    var expanded by remember { mutableStateOf(false) }

    val selectedEvent = events.firstOrNull { it.id == selectedEventId } ?: events.firstOrNull()
    val filtered = remember(registrations, selectedEvent?.id, searchQuery) {
        val targetId = selectedEvent?.id ?: -1
        val q = searchQuery.trim().lowercase(Locale.US)
        registrations.filter { reg ->
            reg.eventId == targetId && (
                q.isEmpty() ||
                    reg.studentName.lowercase(Locale.US).contains(q) ||
                    reg.registerNumber.lowercase(Locale.US).contains(q) ||
                    reg.registrationId.lowercase(Locale.US).contains(q)
                )
        }
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Registration Management",
                subtitle = "Participant rosters & pass IDs",
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        ExposedDropdownMenuBox(
                            expanded = expanded,
                            onExpandedChange = { expanded = !expanded }
                        ) {
                            OutlinedTextField(
                                value = selectedEvent?.let { "${it.name} (${it.date})" } ?: "Select Event",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Select Event") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                                modifier = Modifier
                                    .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                                    .fillMaxWidth()
                                    .testTag("reg_mgmt_event_dropdown")
                            )
                            ExposedDropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false }
                            ) {
                                events.forEach { ev ->
                                    DropdownMenuItem(
                                        text = { Text("${ev.name} (${ev.date})") },
                                        onClick = {
                                            selectedEventId = ev.id
                                            expanded = false
                                        }
                                    )
                                }
                            }
                        }

                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("Search attendee by name, reg no, pass ID...") },
                            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = "Search") },
                            singleLine = true,
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("reg_mgmt_search_input")
                        )
                    }
                }
            }

            item {
                Text(
                    text = "REGISTERED PARTICIPANTS (${filtered.size})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                )
            }

            if (filtered.isEmpty()) {
                item {
                    Box(modifier = Modifier.widthIn(max = 600.dp)) {
                        EmptyStateCard(
                            icon = Icons.Filled.Groups,
                            title = "No registrations found",
                            subtitle = "Try selecting another event or clearing the search filter."
                        )
                    }
                }
            } else {
                items(filtered, key = { it.id }) { reg ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(reg.studentName, style = MaterialTheme.typography.titleSmall)
                                StatusBadge(status = reg.status)
                            }
                            Text(
                                text = "Reg No: ${reg.registerNumber} • Pass: ${reg.registrationId}",
                                style = MaterialTheme.typography.bodySmall,
                                fontFamily = FontFamily.Monospace,
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
fun StaffStudentListScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val students by viewModel.students.collectAsStateWithLifecycle()
    var search by remember { mutableStateOf("") }

    val filtered = remember(students, search) {
        val q = search.trim().lowercase(Locale.US)
        if (q.isEmpty()) students else students.filter {
            it.name.lowercase(Locale.US).contains(q) ||
                it.registerNumber.lowercase(Locale.US).contains(q) ||
                it.department.lowercase(Locale.US).contains(q)
        }
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Student Directory",
                subtitle = "Enrolled students across departments",
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
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                OutlinedTextField(
                    value = search,
                    onValueChange = { search = it },
                    placeholder = { Text("Search by name, reg no, department...") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = "Search") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                        .testTag("staff_student_search_input")
                )
            }

            items(filtered, key = { it.id }) { s ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(s.name, style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onSurface)
                        Text("${s.department} • ${s.year}", style = MaterialTheme.typography.bodySmall, color = PrimaryBlue, fontWeight = FontWeight.SemiBold)
                        Text("Reg No: ${s.registerNumber} • ${s.phone}", style = MaterialTheme.typography.bodySmall, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(s.email, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}

@Composable
fun StaffReportsScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val attendance by viewModel.attendance.collectAsStateWithLifecycle()
    val feedbacks by viewModel.feedbackList.collectAsStateWithLifecycle()

    val totalRegistered = registrations.count { it.status == "REGISTERED" }
    val totalAttended = attendance.count { it.status == "Present" }
    val attendanceRate = if (totalRegistered > 0) (totalAttended * 100 / totalRegistered) else 0
    val avgRating = if (feedbacks.isNotEmpty()) {
        String.format(Locale.US, "%.1f", feedbacks.map { it.rating }.average())
    } else "5.0"

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Reports & Feedback",
                subtitle = "Operational metrics & participant reviews",
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
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("ATTENDANCE RATE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimaryContainer)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("$attendanceRate%", style = MaterialTheme.typography.headlineMedium, color = PrimaryBlue, fontWeight = FontWeight.Black)
                            Text("$totalAttended of $totalRegistered attended", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                    }

                    Card(
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF3C7))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("AVG FEEDBACK", style = MaterialTheme.typography.labelSmall, color = Color(0xFF92400E))
                            Spacer(modifier = Modifier.height(6.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Filled.Star, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(22.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(avgRating, style = MaterialTheme.typography.headlineMedium, color = Color(0xFFB45309), fontWeight = FontWeight.Black)
                            }
                            Text("${feedbacks.size} student reviews", style = MaterialTheme.typography.bodySmall, color = Color(0xFF92400E))
                        }
                    }
                }
            }

            item {
                Text(
                    text = "EVENT REGISTRATION BREAKDOWN",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                )
            }

            items(events, key = { it.id }) { ev ->
                val pct = if (ev.capacity > 0) (ev.registeredCount * 100 / ev.capacity).coerceAtMost(100) else 0
                val fraction = if (ev.capacity > 0) (ev.registeredCount.toFloat() / ev.capacity.toFloat()).coerceIn(0f, 1f) else 0f
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = ev.name,
                                style = MaterialTheme.typography.titleSmall,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                                modifier = Modifier.weight(1f)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "${ev.registeredCount}/${ev.capacity} ($pct%)",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        LinearProgressIndicator(
                            progress = { fraction },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp)
                                .clip(RoundedCornerShape(4.dp)),
                            color = if (pct >= 100) RoseError else PrimaryBlue
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "PARTICIPANT FEEDBACK (${feedbacks.size})",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp)
                )
            }

            if (feedbacks.isEmpty()) {
                item {
                    Box(modifier = Modifier.widthIn(max = 600.dp)) {
                        EmptyStateCard(
                            icon = Icons.Filled.Feedback,
                            title = "No feedback submitted yet",
                            subtitle = "Student event ratings and reviews will appear here."
                        )
                    }
                }
            } else {
                items(feedbacks, key = { it.id }) { fb ->
                    val evName = events.firstOrNull { it.id == fb.eventId }?.name ?: "Campus Event"
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(fb.studentName, style = MaterialTheme.typography.titleSmall)
                                Text("★ ${fb.rating}/5", style = MaterialTheme.typography.labelMedium, color = AmberAccent, fontWeight = FontWeight.Bold)
                            }
                            Text(evName, style = MaterialTheme.typography.labelSmall, color = PrimaryBlue)
                            Text(fb.comment, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
        }
    }
}
