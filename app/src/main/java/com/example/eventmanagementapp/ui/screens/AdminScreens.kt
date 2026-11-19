package com.example.eventmanagementapp.ui.screens

import androidx.compose.animation.AnimatedVisibility
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Help
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.PersonAdd
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.ui.components.CampusTopBar
import com.example.eventmanagementapp.ui.components.DashboardActionCard
import com.example.eventmanagementapp.ui.components.EmptyStateCard
import com.example.eventmanagementapp.ui.components.MetricItem
import com.example.eventmanagementapp.ui.localization.AppStrings
import com.example.eventmanagementapp.ui.theme.AmberAccent
import com.example.eventmanagementapp.ui.theme.AmberContainerLight
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

@Composable
fun AdminDashboardScreen(
    viewModel: CampusViewModel,
    onOpenAnalytics: () -> Unit,
    onOpenApprovals: () -> Unit,
    onOpenManageStaff: () -> Unit,
    onOpenActivityLogs: () -> Unit,
    onOpenSettings: () -> Unit,
    onOpenHelpFaq: () -> Unit,
    onLogout: () -> Unit
) {
    val students by viewModel.students.collectAsStateWithLifecycle()
    val staffList by viewModel.staffList.collectAsStateWithLifecycle()
    val events by viewModel.events.collectAsStateWithLifecycle()
    val certificates by viewModel.certificates.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    val labels = AppStrings.forLanguage(language)

    val pendingCount = events.count { it.status == "Pending" }

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
                                listOf(Color(0xFF0F172A), IndigoDeep, Color(0xFF3B0764))
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
                                text = "SUPER ADMINISTRATOR",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color(0xFFD8B4FE),
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .size(10.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFF34D399))
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = labels.adminControl,
                            style = MaterialTheme.typography.headlineSmall,
                            color = Color.White,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "National Institute of Engineering & Technology",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color(0xFFE9D5FF)
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
                            MetricItem(students.size.toString(), "Students", PurpleAccent, Modifier.weight(1f))
                            MetricItem(staffList.size.toString(), "Faculty", PrimaryBlue, Modifier.weight(1f))
                            MetricItem(pendingCount.toString(), "Pending", AmberAccent, Modifier.weight(1f))
                            MetricItem(certificates.size.toString(), "Issued Certs", EmeraldPrimary, Modifier.weight(1f))
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
                        text = "GOVERNANCE TOOLS",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold
                    )

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("admin_analytics_card")
                            .clickable(onClick = onOpenAnalytics),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                        border = BorderStroke(1.dp, PrimaryBlue.copy(alpha = 0.35f))
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(40.dp)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Brush.linearGradient(listOf(PrimaryBlue, IndigoAccent))),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Filled.BarChart, contentDescription = "Analytics", tint = Color.White)
                                }
                                Surface(
                                    color = EmeraldContainerLight,
                                    shape = RoundedCornerShape(999.dp)
                                ) {
                                    Text(
                                        text = "Live Telemetry",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color(0xFF065F46),
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }
                            Text(
                                text = labels.analyticsReports,
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "Interactive charts for attendance trends, venue capacity fill & department stats",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.85f)
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        DashboardActionCard(
                            title = labels.eventApprovals,
                            subtitle = "Approve or reject staff events",
                            icon = Icons.Filled.CheckCircle,
                            accentColor = AmberAccent,
                            badgeCount = pendingCount,
                            testTag = "admin_approvals_card",
                            onClick = onOpenApprovals,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardActionCard(
                            title = labels.manageStaff,
                            subtitle = "Add faculty & toggle status",
                            icon = Icons.Filled.PersonAdd,
                            accentColor = PurpleAccent,
                            testTag = "admin_manage_staff_card",
                            onClick = onOpenManageStaff,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        DashboardActionCard(
                            title = labels.activityLogs,
                            subtitle = "Live Room audit trails",
                            icon = Icons.Filled.History,
                            accentColor = Color(0xFF334155),
                            testTag = "admin_activity_logs_card",
                            onClick = onOpenActivityLogs,
                            modifier = Modifier.weight(1f)
                        )
                        DashboardActionCard(
                            title = labels.settings,
                            subtitle = "Dark mode & Tamil language",
                            icon = Icons.Filled.Settings,
                            accentColor = TealInfo,
                            testTag = "admin_settings_card",
                            onClick = onOpenSettings,
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "SYSTEM RESOURCES",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontWeight = FontWeight.Bold
                    )

                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("admin_help_faq_card")
                            .clickable(onClick = onOpenHelpFaq),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(PrimaryBlue.copy(alpha = 0.12f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.AutoMirrored.Filled.Help, contentDescription = "Help & FAQ", tint = PrimaryBlue, modifier = Modifier.size(18.dp))
                            }
                            Column {
                                Text(labels.helpFaq, style = MaterialTheme.typography.titleSmall)
                                Text("Registration, pass & certificate guides", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedButton(
                        onClick = onLogout,
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("admin_logout_button"),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseError),
                        border = BorderStroke(1.dp, RoseError.copy(alpha = 0.45f))
                    ) {
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Admin ${labels.logout}", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun EventApprovalScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val events by viewModel.events.collectAsStateWithLifecycle()
    val pendingEvents = events.filter { it.status == "Pending" }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Event Approval Requests",
                subtitle = "Review submissions from faculty",
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
            if (pendingEvents.isEmpty()) {
                item {
                    Box(modifier = Modifier.widthIn(max = 600.dp)) {
                        EmptyStateCard(
                            icon = Icons.Filled.Verified,
                            title = "No pending requests",
                            subtitle = "All staff event submissions have been reviewed."
                        )
                    }
                }
            } else {
                items(pendingEvents, key = { it.id }) { ev ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(color = AmberContainerLight, shape = RoundedCornerShape(999.dp)) {
                                    Text(
                                        text = "Pending Approval",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color(0xFF92400E),
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                                    )
                                }
                                Text(ev.category, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text(ev.name, style = MaterialTheme.typography.titleMedium)
                            Text("Submitted by: ${ev.createdByName}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("${ev.date} (${ev.startTime} - ${ev.endTime}) • ${ev.venue}", style = MaterialTheme.typography.bodySmall)
                            Text("Capacity: ${ev.capacity} seats", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)

                            HorizontalDivider(color = MaterialTheme.colorScheme.outline)

                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                Button(
                                    onClick = { viewModel.setEventStatus(ev.id, "Upcoming") },
                                    modifier = Modifier
                                        .weight(1f)
                                        .height(48.dp)
                                        .testTag("approve_event_${ev.id}"),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary)
                                ) {
                                    Text("Approve & Publish", fontWeight = FontWeight.Bold)
                                }
                                OutlinedButton(
                                    onClick = { viewModel.setEventStatus(ev.id, "Rejected") },
                                    modifier = Modifier
                                        .height(48.dp)
                                        .testTag("reject_event_${ev.id}"),
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseError),
                                    border = BorderStroke(1.dp, RoseError.copy(alpha = 0.45f))
                                ) {
                                    Text("Reject", fontWeight = FontWeight.Bold)
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
fun ManageStaffScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val staffList by viewModel.staffList.collectAsStateWithLifecycle()
    var showForm by remember { mutableStateOf(false) }
    var name by remember { mutableStateOf("") }
    var staffId by remember { mutableStateOf("") }
    var department by remember { mutableStateOf("Master of Computer Applications") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var feedbackMsg by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Faculty & Staff Management",
                subtitle = "Provision accounts & permissions",
                onBack = onBack,
                actions = {
                    TextButton(
                        onClick = { showForm = !showForm },
                        modifier = Modifier.testTag("toggle_add_staff_button")
                    ) {
                        Text(
                            text = if (showForm) "Close" else "+ Add Staff",
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
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
            feedbackMsg?.let { msg ->
                item {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        color = EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(msg, style = MaterialTheme.typography.bodySmall, color = Color(0xFF065F46), modifier = Modifier.padding(12.dp))
                    }
                }
            }

            item {
                AnimatedVisibility(visible = showForm) {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .widthIn(max = 600.dp),
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, PurpleAccent.copy(alpha = 0.4f))
                    ) {
                        Column(
                            modifier = Modifier.padding(14.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Text("Add New Staff Member", style = MaterialTheme.typography.titleSmall, color = PurpleAccent)
                            OutlinedTextField(
                                value = name,
                                onValueChange = { name = it },
                                label = { Text("Full Name *") },
                                singleLine = true,
                                modifier = Modifier.fillMaxWidth().testTag("add_staff_name_input")
                            )
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedTextField(
                                    value = staffId,
                                    onValueChange = { staffId = it },
                                    label = { Text("Staff ID *") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_id_input")
                                )
                                OutlinedTextField(
                                    value = department,
                                    onValueChange = { department = it },
                                    label = { Text("Department") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_dept_input")
                                )
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedTextField(
                                    value = email,
                                    onValueChange = { email = it },
                                    label = { Text("Email *") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_email_input")
                                )
                                OutlinedTextField(
                                    value = phone,
                                    onValueChange = { phone = it },
                                    label = { Text("Phone") },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_phone_input")
                                )
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                OutlinedTextField(
                                    value = username,
                                    onValueChange = { username = it },
                                    label = { Text("Username *") },
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_username_input")
                                )
                                OutlinedTextField(
                                    value = password,
                                    onValueChange = { password = it },
                                    label = { Text("Password *") },
                                    visualTransformation = PasswordVisualTransformation(),
                                    singleLine = true,
                                    modifier = Modifier.weight(1f).testTag("add_staff_password_input")
                                )
                            }
                            Button(
                                onClick = {
                                    if (name.isNotBlank() && staffId.isNotBlank() && email.isNotBlank() && username.isNotBlank() && password.isNotBlank()) {
                                        viewModel.addStaff(name, staffId, department, email, phone, username, password) { res ->
                                            feedbackMsg = res.message
                                            if (res.success) {
                                                showForm = false
                                                name = ""; staffId = ""; email = ""; phone = ""; username = ""; password = ""
                                            }
                                        }
                                    }
                                },
                                modifier = Modifier.fillMaxWidth().height(48.dp).testTag("save_staff_button"),
                                colors = ButtonDefaults.buttonColors(containerColor = PurpleAccent)
                            ) {
                                Text("Save Staff Account", fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            items(staffList, key = { it.id }) { stf ->
                val isActive = stf.status == "ACTIVE"
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text(stf.name, style = MaterialTheme.typography.titleSmall)
                            Text("${stf.department} • ${stf.staffId}", style = MaterialTheme.typography.bodySmall, color = PurpleAccent, fontWeight = FontWeight.SemiBold)
                            Text("${stf.email} • ${stf.phone}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        OutlinedButton(
                            onClick = { viewModel.toggleStaffStatus(stf.id) },
                            modifier = Modifier.testTag("toggle_staff_status_${stf.id}"),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                containerColor = if (isActive) EmeraldContainerLight else RoseContainerLight,
                                contentColor = if (isActive) Color(0xFF065F46) else RoseError
                            ),
                            border = BorderStroke(1.dp, (if (isActive) EmeraldPrimary else RoseError).copy(alpha = 0.4f))
                        ) {
                            Text(if (isActive) "Active" else "Inactive", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ActivityLogScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val logs by viewModel.activityLogs.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "System Activity Audit Log",
                subtitle = "Operational & security ledger in Room",
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
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            items(logs, key = { it.id }) { log ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "[${log.role}] ${log.userName}",
                                style = MaterialTheme.typography.labelSmall,
                                fontFamily = FontFamily.Monospace,
                                color = PrimaryBlue,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "${log.date} ${log.time}",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Text(log.action, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurface)
                    }
                }
            }
        }
    }
}

@Composable
fun SettingsScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit
) {
    val isDark by viewModel.isDark.collectAsStateWithLifecycle()
    val language by viewModel.language.collectAsStateWithLifecycle()
    var showResetDialog by remember { mutableStateOf(false) }
    var dbResetNotice by remember { mutableStateOf(false) }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("Reset SQLite Database?") },
            text = { Text("This will restore factory demo events, accounts, and registrations.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.resetDatabase {
                            dbResetNotice = true
                        }
                        showResetDialog = false
                    },
                    modifier = Modifier.testTag("confirm_reset_db_button")
                ) {
                    Text("Reset DB", color = RoseError, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Application Settings",
                subtitle = "Theme, localization & local database",
                onBack = onBack
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                if (dbResetNotice) {
                    Surface(
                        color = EmeraldContainerLight,
                        shape = RoundedCornerShape(14.dp),
                        border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(18.dp))
                            Text("Database restored to default seed state!", style = MaterialTheme.typography.bodySmall, color = Color(0xFF065F46))
                        }
                    }
                }

                Card(
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Icon(
                                    imageVector = if (isDark) Icons.Filled.DarkMode else Icons.Filled.LightMode,
                                    contentDescription = "Theme",
                                    tint = if (isDark) PurpleAccent else AmberAccent
                                )
                                Column {
                                    Text("Theme Appearance", style = MaterialTheme.typography.titleSmall)
                                    Text(if (isDark) "Dark Mode Active" else "Light Mode Active", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            Switch(
                                checked = isDark,
                                onCheckedChange = { viewModel.toggleDarkMode() },
                                modifier = Modifier.testTag("dark_mode_switch")
                            )
                        }

                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Filled.Language, contentDescription = "Language", tint = PrimaryBlue)
                                Column {
                                    Text("Multi-Language", style = MaterialTheme.typography.titleSmall)
                                    Text("English / தமிழ் (Tamil)", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                                FilterChip(
                                    selected = language == "en",
                                    onClick = { viewModel.setLanguage("en") },
                                    label = { Text("English") },
                                    modifier = Modifier.testTag("lang_en_chip")
                                )
                                FilterChip(
                                    selected = language == "ta",
                                    onClick = { viewModel.setLanguage("ta") },
                                    label = { Text("தமிழ்") },
                                    modifier = Modifier.testTag("lang_ta_chip")
                                )
                            }
                        }

                        HorizontalDivider(color = MaterialTheme.colorScheme.outline)

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(Icons.Filled.DeleteSweep, contentDescription = "Reset DB", tint = RoseError)
                                Column {
                                    Text("Reset SQLite Database", style = MaterialTheme.typography.titleSmall)
                                    Text("Re-seed initial tables & demo records", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                }
                            }
                            OutlinedButton(
                                onClick = { showResetDialog = true },
                                modifier = Modifier.testTag("reset_db_button"),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = RoseError),
                                border = BorderStroke(1.dp, RoseError.copy(alpha = 0.45f))
                            ) {
                                Text("Reset DB")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun HelpFaqScreen(
    onBack: () -> Unit
) {
    val faqs = listOf(
        "How to register for an event?" to "Browse through upcoming events on the Student Dashboard or Event Search. Open the event details and click \"Proceed to Registration\". Confirm your student details to instantly generate your official Digital Event Pass.",
        "How to cancel registration?" to "Navigate to \"My Registrations\" on the student menu. In the \"Upcoming\" tab, select \"Cancel Registration\". Once confirmed, your seat will be automatically reassigned to the first student on the waiting list.",
        "How to get your Digital Event Pass?" to "After registering, tap \"Digital Event Pass\" on the dashboard. The app displays your student credentials, venue details, and verified QR Pass ID for gate admission.",
        "How to download and verify certificates?" to "Once an event is completed and your QR check-in has been validated by staff, your digital Certificate of Participation is generated automatically with a unique collegiate Certificate ID. You can share or verify it under Certificates.",
        "How to check attendance?" to "Faculty staff scan your digital pass QR code at the entrance. The local Room SQLite database updates your status to \"Present\" with exact entry and exit timestamps."
    )

    Scaffold(
        topBar = {
            CampusTopBar(
                title = "Help & FAQ Knowledgebase",
                subtitle = "Comprehensive guide to campus events",
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
            items(faqs) { (question, answer) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .widthIn(max = 600.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Text(question, style = MaterialTheme.typography.titleSmall, color = PrimaryRoyalBlue)
                        Text(answer, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        }
    }
}
