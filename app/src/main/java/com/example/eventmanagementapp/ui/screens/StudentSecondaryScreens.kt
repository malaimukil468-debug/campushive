package com.example.eventmanagementapp.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.OpenInNew
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ConfirmationNumber
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Feedback
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarOutline
import androidx.compose.material3.AlertDialog
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
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.ui.components.CampusTopBar
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.EventPosterImage
import com.example.eventmanagementapp.ui.components.QrCodeDisplay
import com.example.eventmanagementapp.ui.components.StatusBadge
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.AmberContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldPrimary
import com.example.eventmanagementapp.ui.theme.IndigoDeep
import com.example.eventmanagementapp.ui.theme.PrimaryBlue
import com.example.eventmanagementapp.ui.theme.PrimaryRoyalBlue
import com.example.eventmanagementapp.ui.theme.RoseContainerLight
import com.example.eventmanagementapp.ui.theme.RoseError
import com.example.eventmanagementapp.ui.theme.TealInfo
import com.example.eventmanagementapp.viewmodel.CampusViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrowseEventsScreen(
    viewModel: CampusViewModel,
    favoritesOnly: Boolean,
    onBack: () -> Unit,
    onSelectEvent: (Int) -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val favorites by viewModel.favorites.collectAsStateWithLifecycle()
    val session by viewModel.session.collectAsStateWithLifecycle()
    val studentId = session.student?.id

    var searchTerm by remember { mutableStateOf("") }
    var categoryFilter by remember { mutableStateOf("All") }
    var dateFilter by remember { mutableStateOf("All") }
    var showDatePicker by remember { mutableStateOf(false) }

    val categories = listOf("All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium")
    val baseEvents = remember(events, favorites, favoritesOnly, studentId) {
        val visible = events.filter { it.status != "Cancelled" && it.status != "Rejected" }
        if (favoritesOnly && studentId != null) {
            val favIds = favorites.filter { it.studentId == studentId }.map { it.eventId }.toSet()
            visible.filter { it.id in favIds }
        } else visible
    }
    val distinctDates = remember(baseEvents) { baseEvents.map { it.date }.distinct().sorted() }
    val todayStr = remember { SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date()) }

    val filtered = remember(baseEvents, searchTerm, categoryFilter, dateFilter, todayStr) {
        baseEvents.filter { ev ->
            val catOk = categoryFilter == "All" || ev.category.equals(categoryFilter, ignoreCase = true)
            val dateOk = when (dateFilter) {
                "All" -> true
                "Today" -> ev.date == todayStr
                "Upcoming" -> ev.date >= todayStr
                else -> ev.date == dateFilter
            }
            val queryOk = if (searchTerm.isBlank()) true else {
                val q = searchTerm.trim().lowercase(Locale.US)
                ev.name.lowercase(Locale.US).contains(q) ||
                    ev.venue.lowercase(Locale.US).contains(q) ||
                    ev.organizer.lowercase(Locale.US).contains(q) ||
                    ev.category.lowercase(Locale.US).contains(q) ||
                    ev.date.lowercase(Locale.US).contains(q)
            }
            catOk && dateOk && queryOk
        }
    }

    if (showDatePicker) {
        val state = rememberDatePickerState()
        DatePickerDialog(
            onDismissRequest = { showDatePicker = false },
            confirmButton = {
                TextButton(onClick = {
                    state.selectedDateMillis?.let {
                        dateFilter = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(it))
                    }
                    showDatePicker = false
                }) { Text("Apply") }
            },
            dismissButton = { TextButton(onClick = { showDatePicker = false }) { Text("Cancel") } }
        ) { DatePicker(state = state) }
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = if (favoritesOnly) "Favorite Events" else "Browse Events",
                onBack = onBack
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            LazyColumn(
                modifier = Modifier.widthIn(max = 600.dp).fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = searchTerm,
                            onValueChange = { searchTerm = it },
                            placeholder = { Text("Search events, categories, venues...") },
                            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                            trailingIcon = {
                                if (searchTerm.isNotBlank()) {
                                    IconButton(onClick = { searchTerm = "" }) {
                                        Icon(Icons.Filled.Close, contentDescription = "Clear")
                                    }
                                }
                            },
                            singleLine = true,
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth().testTag("browse_search_input")
                        )

                        Row(
                            modifier = Modifier.horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            categories.forEach { cat ->
                                FilterChip(
                                    selected = categoryFilter == cat,
                                    onClick = { categoryFilter = cat },
                                    label = { Text(cat) }
                                )
                            }
                        }

                        Row(
                            modifier = Modifier.horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            (listOf("All", "Today", "Upcoming") + distinctDates).forEach { d ->
                                FilterChip(
                                    selected = dateFilter == d,
                                    onClick = { dateFilter = d },
                                    label = { Text(if (d == "All") "All Dates" else d) }
                                )
                            }
                            OutlinedButton(onClick = { showDatePicker = true }) {
                                Icon(Icons.Filled.DateRange, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Calendar")
                            }
                        }
                    }
                }

                if (filtered.isEmpty()) {
                    item {
                        EmptyStateCard(
                            icon = Icons.Filled.CalendarMonth,
                            title = if (favoritesOnly) "No favorite events yet" else "No events found",
                            subtitle = if (favoritesOnly) "Tap the star icon on any event to bookmark it." else "Try adjusting your search or filter criteria."
                        )
                    }
                } else {
                    items(filtered, key = { it.id }) { ev ->
                        val availableSeats = (ev.capacity - ev.registeredCount).coerceAtLeast(0)
                        val isFull = availableSeats == 0
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("browse_event_card_${ev.id}")
                                .clickable { onSelectEvent(ev.id) },
                            shape = RoundedCornerShape(18.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                        ) {
                            Column {
                                Box(modifier = Modifier.fillMaxWidth().height(130.dp)) {
                                    EventPosterImage(
                                        posterKey = ev.posterKey,
                                        contentDescription = ev.name,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Surface(color = PrimaryRoyalBlue.copy(alpha = 0.9f), shape = RoundedCornerShape(999.dp)) {
                                            Text(ev.category, color = Color.White, style = MaterialTheme.typography.labelSmall, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                                        }
                                        Surface(color = Color(0xFF0F172A).copy(alpha = 0.8f), shape = RoundedCornerShape(999.dp)) {
                                            Text(ev.eventType, color = Color.White, style = MaterialTheme.typography.labelSmall, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                                        }
                                    }
                                    Surface(
                                        color = if (isFull) RoseError else EmeraldPrimary,
                                        shape = RoundedCornerShape(999.dp),
                                        modifier = Modifier.align(Alignment.BottomEnd).padding(10.dp)
                                    ) {
                                        Text(
                                            text = if (isFull) "FULL (Waitlist)" else "$availableSeats Seats Left",
                                            color = Color.White,
                                            style = MaterialTheme.typography.labelSmall,
                                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                        )
                                    }
                                }
                                Column(
                                    modifier = Modifier.padding(12.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Text(ev.name, style = MaterialTheme.typography.titleMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                    Text("${ev.date} • ${ev.startTime} - ${ev.endTime}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text(ev.venue, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EventDetailsScreen(
    viewModel: CampusViewModel,
    eventId: Int,
    onBack: () -> Unit,
    onProceedToRegister: (Int) -> Unit,
    onOpenDigitalPass: (Int) -> Unit
) {
    val context = LocalContext.current
    val events by viewModel.events.collectAsStateWithLifecycle()
    val favorites by viewModel.favorites.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val session by viewModel.session.collectAsStateWithLifecycle()

    val event = events.firstOrNull { it.id == eventId }
    val student = session.student
    val isFav = student != null && favorites.any { it.studentId == student.id && it.eventId == eventId }
    val alreadyRegistered = student != null && registrations.any { it.studentId == student.id && it.eventId == eventId && it.status == "REGISTERED" }

    Scaffold(
        topBar = { CampusTopBar(title = "Event Details", onBack = onBack) }
    ) { innerPadding ->
        if (event == null) {
            Box(modifier = Modifier.fillMaxSize().padding(innerPadding), contentAlignment = Alignment.Center) {
                Text("Event not found.")
            }
            return@Scaffold
        }

        val availableSeats = (event.capacity - event.registeredCount).coerceAtLeast(0)
        val isFull = availableSeats == 0
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
        val registrationClosed = event.registrationDeadline.isNotBlank() && today > event.registrationDeadline

        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 600.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp)) {
                    EventPosterImage(
                        posterKey = event.posterKey,
                        contentDescription = event.name,
                        modifier = Modifier.fillMaxSize()
                    )
                    Row(
                        modifier = Modifier.align(Alignment.TopEnd).padding(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(999.dp),
                            color = Color.White.copy(alpha = 0.9f),
                            shadowElevation = 4.dp
                        ) {
                            IconButton(
                                onClick = { viewModel.toggleFavorite(event.id) },
                                modifier = Modifier.testTag("toggle_favorite_button")
                            ) {
                                Icon(
                                    imageVector = if (isFav) Icons.Filled.Star else Icons.Outlined.StarOutline,
                                    contentDescription = "Favorite",
                                    tint = AmberAccent
                                )
                            }
                        }
                        Surface(
                            shape = RoundedCornerShape(999.dp),
                            color = Color.White.copy(alpha = 0.9f),
                            shadowElevation = 4.dp
                        ) {
                            IconButton(
                                onClick = {
                                    val sendIntent = Intent(Intent.ACTION_SEND).apply {
                                        type = "text/plain"
                                        putExtra(Intent.EXTRA_TEXT, "${event.name} on ${event.date} at ${event.venue}. Organized by ${event.organizer}")
                                    }
                                    context.startActivity(Intent.createChooser(sendIntent, "Share Event"))
                                },
                                modifier = Modifier.testTag("share_event_button")
                            ) {
                                Icon(Icons.Filled.Share, contentDescription = "Share Event", tint = Color(0xFF0F172A))
                            }
                        }
                    }
                }

                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        StatusBadge(event.category)
                        StatusBadge(event.status)
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(event.name, style = MaterialTheme.typography.headlineSmall)
                        Text("Organized by ${event.organizer}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }

                    // Capacity card
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(14.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("CAPACITY & SEATS", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                Text("${event.registeredCount} Registered / ${event.capacity} Total", style = MaterialTheme.typography.titleSmall)
                            }
                            StatusBadge(if (isFull) "FULL" else "$availableSeats Available")
                        }
                    }

                    // Schedule card
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            DetailRow(Icons.Filled.CalendarMonth, "Date", event.date)
                            DetailRow(Icons.Filled.Schedule, "Time", "${event.startTime} - ${event.endTime}")
                            DetailRow(Icons.Filled.LocationOn, "Venue", event.venue)
                            if (event.registrationDeadline.isNotBlank()) {
                                DetailRow(Icons.Filled.DateRange, "Deadline", event.registrationDeadline)
                            }
                        }
                    }

                    if (event.meetingLink.isNotBlank()) {
                        OutlinedButton(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(event.meetingLink))
                                context.startActivity(intent)
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp)
                        ) {
                            Icon(Icons.AutoMirrored.Filled.OpenInNew, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Join Online Meeting")
                        }
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text("About This Event", style = MaterialTheme.typography.titleSmall)
                        Text(
                            text = event.description,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    when {
                        alreadyRegistered -> {
                            Surface(
                                color = EmeraldContainerLight,
                                shape = RoundedCornerShape(16.dp),
                                border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.4f))
                            ) {
                                Column(
                                    modifier = Modifier.fillMaxWidth().padding(14.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = EmeraldPrimary)
                                        Text("You are registered for this event!", style = MaterialTheme.typography.titleSmall, color = Color(0xFF065F46))
                                    }
                                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Button(
                                            onClick = { onOpenDigitalPass(event.id) },
                                            modifier = Modifier.weight(1f).testTag("view_digital_pass_button")
                                        ) {
                                            Text("View Pass")
                                        }
                                        OutlinedButton(
                                            onClick = { viewModel.triggerReminderAlert(event) },
                                            modifier = Modifier.weight(1f).testTag("test_reminder_button")
                                        ) {
                                            Icon(Icons.Filled.NotificationsActive, contentDescription = null, modifier = Modifier.size(16.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Reminder")
                                        }
                                    }
                                }
                            }
                        }
                        registrationClosed -> {
                            Surface(
                                color = MaterialTheme.colorScheme.surfaceVariant,
                                shape = RoundedCornerShape(14.dp)
                            ) {
                                Text(
                                    "Registration has closed for this event.",
                                    style = MaterialTheme.typography.titleSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.fillMaxWidth().padding(14.dp)
                                )
                            }
                        }
                        else -> {
                            Button(
                                onClick = { onProceedToRegister(event.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = if (isFull) AmberAccent else PrimaryBlue),
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(50.dp)
                                    .testTag("proceed_registration_button")
                            ) {
                                Text(
                                    text = if (isFull) "Event Full — Join Waiting List" else "Proceed to Registration",
                                    style = MaterialTheme.typography.labelLarge
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailRow(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
        Icon(icon, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(18.dp))
        Text("$label:", style = MaterialTheme.typography.labelLarge)
        Text(value, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun EventRegistrationScreen(
    viewModel: CampusViewModel,
    eventId: Int,
    onBack: () -> Unit,
    onRegistrationComplete: (eventId: Int, waitlisted: Boolean) -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val session by viewModel.session.collectAsStateWithLifecycle()
    val event = events.firstOrNull { it.id == eventId }
    val student = session.student
    var feedbackMessage by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = { CampusTopBar(title = "Confirm Registration", onBack = onBack) }
    ) { innerPadding ->
        if (event == null || student == null) {
            Box(modifier = Modifier.fillMaxSize().padding(innerPadding), contentAlignment = Alignment.Center) {
                Text("Registration data unavailable.")
            }
            return@Scaffold
        }

        val isFull = (event.capacity - event.registeredCount) <= 0

        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(18.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Filled.ConfirmationNumber, contentDescription = null, tint = PrimaryBlue, modifier = Modifier.size(44.dp))
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Confirm Registration", style = MaterialTheme.typography.titleLarge)
                        Text("Review your student registration details", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }

                    feedbackMessage?.let { msg ->
                        Surface(color = AmberContainerLight, shape = RoundedCornerShape(12.dp)) {
                            Text(msg, style = MaterialTheme.typography.bodySmall, modifier = Modifier.fillMaxWidth().padding(12.dp))
                        }
                    }

                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            RegField("STUDENT NAME", student.name)
                            HorizontalDivider()
                            RegField("REGISTER NUMBER", student.registerNumber)
                            HorizontalDivider()
                            RegField("EVENT TITLE", event.name)
                            HorizontalDivider()
                            RegField("DATE & VENUE", "${event.date} at ${event.venue}")
                            HorizontalDivider()
                            RegField(
                                "SEAT ALLOCATION",
                                if (isFull) "Event Full — Waitlist Position Queue" else "Instant Digital Pass Confirmed"
                            )
                        }
                    }
                }

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(
                        onClick = {
                            viewModel.registerForEvent(event.id) { res ->
                                if (res.success) {
                                    onRegistrationComplete(event.id, res.waitlisted)
                                } else {
                                    feedbackMessage = res.message
                                }
                            }
                        },
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("confirm_registration_button")
                    ) {
                        Text(if (isFull) "Join Waiting List" else "Confirm & Generate Pass")
                    }
                    OutlinedButton(
                        onClick = onBack,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.fillMaxWidth().height(48.dp)
                    ) {
                        Text("Cancel")
                    }
                }
            }
        }
    }
}

@Composable
private fun RegField(label: String, value: String) {
    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, style = MaterialTheme.typography.titleSmall)
    }
}

@Composable
fun DigitalPassScreen(
    viewModel: CampusViewModel,
    eventId: Int,
    onBack: () -> Unit,
    onBrowseEvents: () -> Unit,
    onOpenMyEvents: () -> Unit
) {
    val context = LocalContext.current
    val session by viewModel.session.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()

    val student = session.student
    val targetReg = remember(registrations, student?.id, eventId) {
        val mine = registrations.filter { it.studentId == student?.id && it.status == "REGISTERED" }
        if (eventId > 0) mine.firstOrNull { it.eventId == eventId } else mine.firstOrNull()
    }
    val targetEvent = targetReg?.let { r -> events.firstOrNull { it.id == r.eventId } }

    Scaffold(
        topBar = { CampusTopBar(title = "Digital Event Pass", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            if (targetReg == null || targetEvent == null) {
                Column(
                    modifier = Modifier.widthIn(max = 520.dp).padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    EmptyStateCard(
                        icon = Icons.Filled.ConfirmationNumber,
                        title = "No Active Pass",
                        subtitle = "You do not have any confirmed registrations yet."
                    )
                    Button(onClick = onBrowseEvents) {
                        Text("Browse Events")
                    }
                }
                return@Scaffold
            }

            Column(
                modifier = Modifier
                    .widthIn(max = 520.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Digital Pass Credential Card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(26.dp))
                        .background(Brush.verticalGradient(listOf(PrimaryRoyalBlue, IndigoDeep, Color(0xFF020617))))
                        .padding(20.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("NIET • AUTONOMOUS CAMPUS", style = MaterialTheme.typography.labelSmall, color = Color(0xFFBFDBFE))
                            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = Color(0xFF34D399), modifier = Modifier.size(14.dp))
                                Text("VERIFIED ENTRY", style = MaterialTheme.typography.labelSmall, color = Color(0xFF34D399))
                            }
                        }

                        HorizontalDivider(color = Color.White.copy(alpha = 0.16f))

                        Text("DIGITAL EVENT PASS", style = MaterialTheme.typography.titleLarge, color = Color.White)
                        Text("Official Student Admission Credential", style = MaterialTheme.typography.bodySmall, color = Color(0xFFBFDBFE))

                        // Real ZXing QR Code
                        QrCodeDisplay(content = targetReg.registrationId, size = 165.dp)

                        Surface(
                            color = Color(0xFF172554),
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, Color(0xFF3B82F6).copy(alpha = 0.4f))
                        ) {
                            Text(
                                text = "PASS ID: ${targetReg.registrationId}",
                                style = MaterialTheme.typography.labelLarge,
                                fontFamily = FontFamily.Monospace,
                                color = Color(0xFFDBEAFE),
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                            )
                        }

                        HorizontalDivider(color = Color.White.copy(alpha = 0.2f))

                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            PassDetail("EVENT", targetEvent.name)
                            Row(modifier = Modifier.fillMaxWidth()) {
                                Box(modifier = Modifier.weight(1f)) { PassDetail("STUDENT", student?.name ?: "") }
                                Box(modifier = Modifier.weight(1f)) { PassDetail("REG NO", student?.registerNumber ?: "") }
                            }
                            Row(modifier = Modifier.fillMaxWidth()) {
                                Box(modifier = Modifier.weight(1f)) { PassDetail("DATE & TIME", "${targetEvent.date} (${targetEvent.startTime})") }
                                Box(modifier = Modifier.weight(1f)) { PassDetail("VENUE", targetEvent.venue) }
                            }
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        onClick = {
                            val shareText = "CampusHive Event Pass\nEvent: ${targetEvent.name}\nStudent: ${student?.name} (${student?.registerNumber})\nPass ID: ${targetReg.registrationId}\nDate: ${targetEvent.date} at ${targetEvent.venue}"
                            val intent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, shareText)
                            }
                            context.startActivity(Intent.createChooser(intent, "Share Digital Pass"))
                        },
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f).height(48.dp).testTag("share_pass_button")
                    ) {
                        Icon(Icons.Filled.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Share Pass")
                    }
                    OutlinedButton(
                        onClick = onOpenMyEvents,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.height(48.dp)
                    ) {
                        Text("My Events")
                    }
                }
            }
        }
    }
}

@Composable
private fun PassDetail(label: String, value: String) {
    Column {
        Text(label, style = MaterialTheme.typography.labelSmall, color = Color(0xFF93C5FD))
        Text(value, style = MaterialTheme.typography.bodyMedium, color = Color.White, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun MyEventsScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onOpenDigitalPass: (Int) -> Unit,
    onOpenFeedback: (Int) -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val registrations by viewModel.registrations.collectAsStateWithLifecycle()
    val waitlist by viewModel.waitlist.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()

    val studentId = session.student?.id
    val tabs = listOf("Upcoming", "Completed", "Waitlisted", "Cancelled")
    var selectedTab by remember { mutableIntStateOf(0) }
    var cancelTargetEventId by remember { mutableStateOf<Int?>(null) }
    var actionNotice by remember { mutableStateOf<String?>(null) }

    if (cancelTargetEventId != null) {
        AlertDialog(
            onDismissRequest = { cancelTargetEventId = null },
            title = { Text("Cancel Registration?") },
            text = { Text("Your seat will be automatically reassigned to the first student on the waiting list.") },
            confirmButton = {
                Button(
                    onClick = {
                        val id = cancelTargetEventId!!
                        cancelTargetEventId = null
                        viewModel.cancelRegistration(id) { res ->
                            actionNotice = res.message
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoseError)
                ) { Text("Confirm Cancel") }
            },
            dismissButton = {
                TextButton(onClick = { cancelTargetEventId = null }) { Text("Keep Seat") }
            }
        )
    }

    Scaffold(
        topBar = { CampusTopBar(title = "My Registrations", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(modifier = Modifier.widthIn(max = 600.dp).fillMaxSize()) {
                TabRow(selectedTabIndex = selectedTab) {
                    tabs.forEachIndexed { idx, label ->
                        Tab(
                            selected = selectedTab == idx,
                            onClick = { selectedTab = idx },
                            text = { Text(label, maxLines = 1, overflow = TextOverflow.Ellipsis) }
                        )
                    }
                }

                actionNotice?.let { msg ->
                    Surface(
                        color = EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth().padding(12.dp)
                    ) {
                        Text(msg, style = MaterialTheme.typography.bodySmall, color = Color(0xFF065F46), modifier = Modifier.padding(10.dp))
                    }
                }

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (selectedTab == 2) {
                        val myWaitlist = waitlist.filter { it.studentId == studentId && it.status == "WAITING" }
                        if (myWaitlist.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Filled.Schedule,
                                    title = "No Waitlisted Events",
                                    subtitle = "Waitlisted full-capacity events will appear here."
                                )
                            }
                        } else {
                            items(myWaitlist, key = { it.id }) { w ->
                                val ev = events.firstOrNull { it.id == w.eventId }
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = AmberContainerLight.copy(alpha = 0.45f)),
                                    border = BorderStroke(1.dp, AmberAccent.copy(alpha = 0.4f))
                                ) {
                                    Column(modifier = Modifier.fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            StatusBadge("Position #${w.position}")
                                            Text("Pending Opening", style = MaterialTheme.typography.labelSmall, color = AmberAccent)
                                        }
                                        Text(ev?.name ?: "Campus Event", style = MaterialTheme.typography.titleSmall)
                                        Text("${ev?.date ?: ""} • ${ev?.venue ?: ""}", style = MaterialTheme.typography.bodySmall)
                                    }
                                }
                            }
                        }
                    } else {
                        val myRegs = registrations.filter { it.studentId == studentId }.filter { reg ->
                            val ev = events.firstOrNull { it.id == reg.eventId }
                            when (selectedTab) {
                                1 -> reg.status == "REGISTERED" && ev?.status == "Completed"
                                3 -> reg.status == "CANCELLED"
                                else -> reg.status == "REGISTERED" && ev?.status != "Completed"
                            }
                        }
                        if (myRegs.isEmpty()) {
                            item {
                                EmptyStateCard(
                                    icon = Icons.Filled.ConfirmationNumber,
                                    title = "No ${tabs[selectedTab]} Registrations",
                                    subtitle = "Events matching this category will appear here."
                                )
                            }
                        } else {
                            items(myRegs, key = { it.id }) { reg ->
                                val ev = events.firstOrNull { it.id == reg.eventId } ?: return@items
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                                ) {
                                    Column(modifier = Modifier.fillMaxWidth().padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                            Text(reg.registrationId, style = MaterialTheme.typography.labelSmall, color = PrimaryBlue)
                                            StatusBadge(if (reg.status == "CANCELLED") "Cancelled" else ev.status)
                                        }
                                        Text(ev.name, style = MaterialTheme.typography.titleSmall)
                                        Text("${ev.date} at ${ev.startTime} • ${ev.venue}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        HorizontalDivider()
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            if (reg.status == "REGISTERED") {
                                                TextButton(onClick = { onOpenDigitalPass(ev.id) }) {
                                                    Icon(Icons.Filled.ConfirmationNumber, contentDescription = null, modifier = Modifier.size(16.dp))
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text("View Pass")
                                                }
                                            }
                                            if (selectedTab == 0) {
                                                TextButton(
                                                    onClick = { cancelTargetEventId = ev.id },
                                                    modifier = Modifier.testTag("cancel_reg_${ev.id}")
                                                ) {
                                                    Text("Cancel Registration", color = RoseError)
                                                }
                                            }
                                            if (selectedTab == 1) {
                                                TextButton(onClick = { onOpenFeedback(ev.id) }) {
                                                    Icon(Icons.Filled.Feedback, contentDescription = null, modifier = Modifier.size(16.dp), tint = TealInfo)
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text("Leave Feedback", color = TealInfo)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
