package com.example.eventmanagementapp.ui.screens

import android.content.Intent
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.WorkspacePremium
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.FilterChip
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
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.data.CertificateEntity
import com.example.eventmanagementapp.ui.components.CampusTopBar
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.StarRatingSelector
import com.example.eventmanagementapp.ui.components.StatusBadge
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.EmeraldContainerLight
import com.example.eventmanagementapp.ui.theme.EmeraldPrimary
import com.example.eventmanagementapp.ui.theme.PrimaryBlue
import com.example.eventmanagementapp.ui.theme.PrimaryContainerLight
import com.example.eventmanagementapp.ui.theme.PrimaryRoyalBlue
import com.example.eventmanagementapp.ui.theme.RoseContainerLight
import com.example.eventmanagementapp.ui.theme.RoseError
import com.example.eventmanagementapp.viewmodel.CampusViewModel

@Composable
fun CertificatesScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val session by viewModel.session.collectAsStateWithLifecycle()
    val certificates by viewModel.certificates.collectAsStateWithLifecycle()
    val myCerts = certificates.filter { it.studentId == session.student?.id }

    var verifyInput by remember { mutableStateOf("") }
    var verifyAttempted by remember { mutableStateOf(false) }
    var verifiedCert by remember { mutableStateOf<CertificateEntity?>(null) }

    Scaffold(
        topBar = { CampusTopBar(title = "Certificates & Verification", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 600.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text("MY CERTIFICATES", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)

                if (myCerts.isEmpty()) {
                    EmptyStateCard(
                        icon = Icons.Filled.WorkspacePremium,
                        title = "No Certificates Issued Yet",
                        subtitle = "Complete an event and verify QR attendance to receive your official certificate."
                    )
                } else {
                    myCerts.forEach { cert ->
                        Card(
                            shape = RoundedCornerShape(22.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFDF7)),
                            border = BorderStroke(2.dp, AmberAccent.copy(alpha = 0.65f))
                        ) {
                            Column(
                                modifier = Modifier.fillMaxWidth().padding(18.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(Icons.Filled.AccountBalance, contentDescription = null, tint = PrimaryRoyalBlue, modifier = Modifier.size(30.dp))
                                Text(
                                    "NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = PrimaryRoyalBlue,
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    "CERTIFICATE OF PARTICIPATION",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = Color(0xFF92400E)
                                )
                                Text("This is proudly presented to", style = MaterialTheme.typography.bodySmall, color = Color(0xFF475569))
                                Text(cert.studentName, style = MaterialTheme.typography.titleLarge, color = Color(0xFF0F172A))
                                Text("for successfully participating in", style = MaterialTheme.typography.bodySmall, color = Color(0xFF475569))
                                Text(cert.eventName, style = MaterialTheme.typography.titleSmall, color = PrimaryRoyalBlue, textAlign = TextAlign.Center)
                                Text("Date: ${cert.eventDate} • Organizer: ${cert.organizer}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF64748B))
                                HorizontalDivider(color = AmberAccent.copy(alpha = 0.3f), modifier = Modifier.padding(vertical = 4.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(cert.certificateId, style = MaterialTheme.typography.labelSmall, fontFamily = FontFamily.Monospace, color = Color(0xFF78350F))
                                    StatusBadge(cert.status)
                                }
                                OutlinedButton(
                                    onClick = {
                                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                            type = "text/plain"
                                            putExtra(Intent.EXTRA_TEXT, "Verified CampusHive Certificate\nRecipient: ${cert.studentName}\nEvent: ${cert.eventName}\nID: ${cert.certificateId}")
                                        }
                                        context.startActivity(Intent.createChooser(shareIntent, "Share Certificate"))
                                    },
                                    modifier = Modifier.fillMaxWidth().padding(top = 6.dp)
                                ) {
                                    Icon(Icons.Filled.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Share Credential")
                                }
                            }
                        }
                    }
                }

                // Public Certificate Verification
                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(Icons.Filled.VerifiedUser, contentDescription = null, tint = PrimaryBlue)
                            Text("Public Certificate Verification", style = MaterialTheme.typography.titleSmall)
                        }
                        Text(
                            "Enter any Certificate ID (e.g. CERT-COL-2026-9204-6) to authenticate validity.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = verifyInput,
                                onValueChange = { verifyInput = it },
                                placeholder = { Text("CERT-COL-2026-...") },
                                singleLine = true,
                                modifier = Modifier.weight(1f).testTag("verify_cert_input")
                            )
                            Button(
                                onClick = {
                                    if (verifyInput.isNotBlank()) {
                                        viewModel.verifyCertificate(verifyInput) { res ->
                                            verifiedCert = res
                                            verifyAttempted = true
                                        }
                                    }
                                },
                                modifier = Modifier.height(52.dp).testTag("verify_cert_button")
                            ) {
                                Text("Verify")
                            }
                        }

                        if (verifyAttempted) {
                            val cert = verifiedCert
                            if (cert != null) {
                                Surface(
                                    color = EmeraldContainerLight,
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.4f))
                                ) {
                                    Column(modifier = Modifier.fillMaxWidth().padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                            Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(16.dp))
                                            Text("VALID CERTIFICATE", style = MaterialTheme.typography.labelLarge, color = Color(0xFF065F46))
                                        }
                                        Text("Student: ${cert.studentName}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                        Text("Event: ${cert.eventName}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                        Text("Issue Date: ${cert.issueDate}", style = MaterialTheme.typography.bodySmall, color = Color(0xFF064E3B))
                                    }
                                }
                            } else {
                                Surface(
                                    color = RoseContainerLight,
                                    shape = RoundedCornerShape(12.dp),
                                    border = BorderStroke(1.dp, RoseError.copy(alpha = 0.4f))
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth().padding(12.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(Icons.Filled.Error, contentDescription = null, tint = RoseError, modifier = Modifier.size(16.dp))
                                        Text("INVALID CERTIFICATE: Record not found in Room SQLite database.", style = MaterialTheme.typography.bodySmall, color = RoseError)
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FeedbackScreen(
    viewModel: CampusViewModel,
    initialEventId: Int,
    onBack: () -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    var selectedEventId by remember(events, initialEventId) {
        mutableIntStateOf(if (initialEventId > 0) initialEventId else (events.firstOrNull()?.id ?: 1))
    }
    var dropdownExpanded by remember { mutableStateOf(false) }
    var rating by remember { mutableIntStateOf(5) }
    var comment by remember { mutableStateOf("") }
    var statusMsg by remember { mutableStateOf<Pair<String, Boolean>?>(null) }

    val selectedEvent = events.firstOrNull { it.id == selectedEventId }

    Scaffold(
        topBar = { CampusTopBar(title = "Event Feedback", subtitle = "Help organizers improve campus events", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                statusMsg?.let { (msg, isErr) ->
                    Surface(
                        color = if (isErr) RoseContainerLight else EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            msg,
                            style = MaterialTheme.typography.bodySmall,
                            color = if (isErr) RoseError else Color(0xFF065F46),
                            modifier = Modifier.fillMaxWidth().padding(12.dp)
                        )
                    }
                }

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        ExposedDropdownMenuBox(
                            expanded = dropdownExpanded,
                            onExpandedChange = { dropdownExpanded = !dropdownExpanded }
                        ) {
                            OutlinedTextField(
                                value = selectedEvent?.let { "${it.name} (${it.date})" } ?: "Select Event",
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Select Event") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = dropdownExpanded) },
                                modifier = Modifier.fillMaxWidth().menuAnchor(MenuAnchorType.PrimaryNotEditable)
                            )
                            ExposedDropdownMenu(expanded = dropdownExpanded, onDismissRequest = { dropdownExpanded = false }) {
                                events.forEach { ev ->
                                    DropdownMenuItem(
                                        text = { Text("${ev.name} (${ev.date})") },
                                        onClick = { selectedEventId = ev.id; dropdownExpanded = false }
                                    )
                                }
                            }
                        }

                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text("Your Rating", style = MaterialTheme.typography.labelLarge)
                            StarRatingSelector(rating = rating, onRatingSelected = { rating = it })
                        }

                        OutlinedTextField(
                            value = comment,
                            onValueChange = { comment = it },
                            label = { Text("Review & Suggestions") },
                            placeholder = { Text("Share what you liked, venue arrangements, guest speakers...") },
                            minLines = 4,
                            modifier = Modifier.fillMaxWidth().testTag("feedback_comment_input")
                        )

                        Button(
                            onClick = {
                                if (comment.isBlank()) {
                                    statusMsg = "Please write your feedback comment." to true
                                } else {
                                    viewModel.submitFeedback(selectedEventId, rating, comment) { res ->
                                        statusMsg = res.message to !res.success
                                        if (res.success) comment = ""
                                    }
                                }
                            },
                            shape = RoundedCornerShape(14.dp),
                            modifier = Modifier.fillMaxWidth().height(48.dp).testTag("submit_feedback_button")
                        ) {
                            Text("Submit Feedback")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CalendarScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onSelectEvent: (Int) -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val distinctDates = remember(events) { events.map { it.date }.distinct().sorted() }
    var selectedDate by remember(distinctDates) { mutableStateOf(distinctDates.firstOrNull() ?: "2026-10-10") }
    val scheduled = events.filter { it.date == selectedDate }

    Scaffold(
        topBar = { CampusTopBar(title = "Event Calendar", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 600.dp)
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("SELECT EVENT DATE", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(
                    modifier = Modifier.horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    distinctDates.forEach { d ->
                        FilterChip(
                            selected = selectedDate == d,
                            onClick = { selectedDate = d },
                            label = { Text(d) }
                        )
                    }
                }

                Text("SCHEDULED ON $selectedDate (${scheduled.size})", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)

                LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    if (scheduled.isEmpty()) {
                        item {
                            EmptyStateCard(
                                icon = Icons.Filled.CalendarMonth,
                                title = "No Events Scheduled",
                                subtitle = "Select another date above to view campus events."
                            )
                        }
                    } else {
                        items(scheduled, key = { it.id }) { ev ->
                            Card(
                                modifier = Modifier.fillMaxWidth().clickable { onSelectEvent(ev.id) },
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                            ) {
                                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                        StatusBadge(ev.category)
                                        Text("${ev.startTime} - ${ev.endTime}", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Text(ev.name, style = MaterialTheme.typography.titleSmall)
                                    Text(ev.venue, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
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
fun NotificationsScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val notifications by viewModel.notifications.collectAsStateWithLifecycle()
    val userId = session.user?.id
    val userNotifs = notifications.filter { it.userId == userId || it.userId == 0 }

    Scaffold(
        topBar = { CampusTopBar(title = "Notifications", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            LazyColumn(
                modifier = Modifier.widthIn(max = 600.dp).fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                if (userNotifs.isEmpty()) {
                    item {
                        EmptyStateCard(
                            icon = Icons.Filled.Notifications,
                            title = "No Notifications Yet",
                            subtitle = "Event confirmations, reminders, and announcements appear here."
                        )
                    }
                } else {
                    items(userNotifs, key = { it.id }) { n ->
                        Card(
                            modifier = Modifier.fillMaxWidth().clickable { viewModel.markNotificationRead(n.id) },
                            colors = CardDefaults.cardColors(
                                containerColor = if (n.isRead) MaterialTheme.colorScheme.surface else PrimaryContainerLight.copy(alpha = 0.4f)
                            ),
                            border = BorderStroke(1.dp, if (n.isRead) MaterialTheme.colorScheme.outline else PrimaryBlue.copy(alpha = 0.35f))
                        ) {
                            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                    Text(n.title, style = MaterialTheme.typography.titleSmall, modifier = Modifier.weight(1f))
                                    Text(n.date, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                                Text(n.message, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val session by viewModel.session.collectAsStateWithLifecycle()
    val student = session.student

    var editing by remember { mutableStateOf(false) }
    var email by remember(student?.email) { mutableStateOf(student?.email ?: "") }
    var phone by remember(student?.phone) { mutableStateOf(student?.phone ?: "") }
    var savedNotice by remember { mutableStateOf(false) }

    Scaffold(
        topBar = { CampusTopBar(title = "My Profile", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier.fillMaxSize().padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Card(
                    shape = RoundedCornerShape(22.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(68.dp)
                                .clip(CircleShape)
                                .background(PrimaryContainerLight),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = student?.name?.take(1) ?: "S",
                                style = MaterialTheme.typography.headlineMedium,
                                color = PrimaryRoyalBlue
                            )
                        }
                        Text(student?.name ?: "Student", style = MaterialTheme.typography.titleLarge)
                        Text("Reg No: ${student?.registerNumber ?: ""}", style = MaterialTheme.typography.labelMedium, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(student?.department ?: "", style = MaterialTheme.typography.bodyMedium, color = PrimaryBlue, fontWeight = FontWeight.SemiBold)
                    }
                }

                if (savedNotice) {
                    Surface(color = EmeraldContainerLight, shape = RoundedCornerShape(12.dp)) {
                        Text("Profile updated successfully!", style = MaterialTheme.typography.bodySmall, color = Color(0xFF065F46), modifier = Modifier.fillMaxWidth().padding(12.dp))
                    }
                }

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        OutlinedTextField(
                            value = student?.year ?: "",
                            onValueChange = {},
                            enabled = false,
                            label = { Text("Year of Study") },
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            enabled = editing,
                            label = { Text("Email Address") },
                            modifier = Modifier.fillMaxWidth().testTag("profile_email_input")
                        )
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            enabled = editing,
                            label = { Text("Phone Number") },
                            modifier = Modifier.fillMaxWidth().testTag("profile_phone_input")
                        )

                        if (editing) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = {
                                        viewModel.updateStudentProfile(email, phone) {
                                            editing = false
                                            savedNotice = true
                                        }
                                    },
                                    modifier = Modifier.weight(1f).testTag("profile_save_button")
                                ) { Text("Save Changes") }
                                OutlinedButton(
                                    onClick = {
                                        email = student?.email ?: ""
                                        phone = student?.phone ?: ""
                                        editing = false
                                    }
                                ) { Text("Cancel") }
                            }
                        } else {
                            OutlinedButton(
                                onClick = { editing = true; savedNotice = false },
                                modifier = Modifier.fillMaxWidth().testTag("profile_edit_button")
                            ) {
                                Text("Edit Profile")
                            }
                        }
                    }
                }
            }
        }
    }
}
