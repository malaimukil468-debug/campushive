package com.example.eventmanagementapp.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Fingerprint
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MenuAnchorType
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.eventmanagementapp.data.StudentEntity
import com.example.eventmanagementapp.ui.components.CampusTopBar
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
import com.example.eventmanagementapp.viewmodel.CampusViewModel

@Composable
fun LoginScreen(
    viewModel: CampusViewModel,
    onLoginSuccess: (role: String) -> Unit,
    onNavigateSignup: () -> Unit,
    onNavigateForgot: () -> Unit
) {
    val students by viewModel.students.collectAsStateWithLifecycle()
    val rememberedId by viewModel.rememberedStudentId.collectAsStateWithLifecycle()

    var authPortal by remember { mutableStateOf("student") }
    var studentIdentifier by remember(rememberedId) { mutableStateOf(rememberedId.ifBlank { "927625MCA026" }) }
    var studentPassword by remember { mutableStateOf("1234") }
    var rememberMe by remember { mutableStateOf(true) }
    var showPassword by remember { mutableStateOf(false) }

    var facultyIdentifier by remember { mutableStateOf("staff") }
    var facultyPassword by remember { mutableStateOf("1234") }
    var showFacultyPassword by remember { mutableStateOf(false) }

    var isAuthenticating by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var successMsg by remember { mutableStateOf<String?>(null) }
    var failedAttempts by remember { mutableIntStateOf(0) }

    val recognizedStudent: StudentEntity? = remember(studentIdentifier, students, authPortal) {
        if (authPortal != "student" || studentIdentifier.isBlank()) null
        else {
            val q = studentIdentifier.trim()
            students.firstOrNull {
                it.registerNumber.equals(q, ignoreCase = true) ||
                    it.email.equals(q, ignoreCase = true) ||
                    it.phone == q ||
                    (q.equals("student", ignoreCase = true) && it.id == 1) ||
                    (q.equals("priya_cse", ignoreCase = true) && it.id == 2)
            }
        }
    }

    Scaffold { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Spacer(modifier = Modifier.height(6.dp))

                // College Branding Header
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(62.dp)
                            .clip(RoundedCornerShape(18.dp))
                            .background(Brush.linearGradient(listOf(PrimaryBlue, IndigoDeep, PrimaryRoyalBlue))),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.School,
                            contentDescription = "CampusHive",
                            tint = Color.White,
                            modifier = Modifier.size(34.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "Campus Event Portal",
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "National Institute of Engineering & Technology",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                // Portal Mode Switcher Tabs
                Surface(
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(4.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        PortalTabButton(
                            selected = authPortal == "student",
                            label = "Student Portal",
                            icon = Icons.Filled.School,
                            testTag = "tab_student_portal",
                            onClick = {
                                authPortal = "student"
                                errorMsg = null
                                successMsg = null
                            },
                            modifier = Modifier.weight(1f)
                        )
                        PortalTabButton(
                            selected = authPortal == "faculty_admin",
                            label = "Faculty & Admin",
                            icon = Icons.Filled.AccountBalance,
                            testTag = "tab_faculty_portal",
                            onClick = {
                                authPortal = "faculty_admin"
                                errorMsg = null
                                successMsg = null
                            },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }

                AnimatedVisibility(visible = errorMsg != null) {
                    Surface(
                        color = RoseContainerLight,
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, RoseError.copy(alpha = 0.35f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Filled.Error, contentDescription = null, tint = RoseError, modifier = Modifier.size(18.dp))
                            Text(
                                text = errorMsg ?: "",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF991B1B)
                            )
                        }
                    }
                }

                AnimatedVisibility(visible = successMsg != null) {
                    Surface(
                        color = EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp),
                        border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.35f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(18.dp))
                            Text(
                                text = successMsg ?: "",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF065F46),
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }

                if (authPortal == "student") {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text("Student Sign In", style = MaterialTheme.typography.titleMedium)
                                    Text(
                                        "Authenticate using College Credentials",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                Surface(
                                    color = PrimaryContainerLight,
                                    shape = RoundedCornerShape(999.dp)
                                ) {
                                    Text(
                                        "Verified",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = PrimaryRoyalBlue,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            OutlinedTextField(
                                value = studentIdentifier,
                                onValueChange = { studentIdentifier = it },
                                label = { Text("Register No. / Email / Username") },
                                leadingIcon = { Icon(Icons.Filled.Person, contentDescription = null) },
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("student_identifier_input")
                            )

                            if (recognizedStudent != null) {
                                Surface(
                                    color = EmeraldContainerLight,
                                    shape = RoundedCornerShape(10.dp),
                                    border = BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.3f))
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 10.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = recognizedStudent.name,
                                                style = MaterialTheme.typography.labelMedium,
                                                color = Color(0xFF065F46),
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                            Text(
                                                text = recognizedStudent.department,
                                                style = MaterialTheme.typography.bodySmall,
                                                color = Color(0xFF047857),
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                        }
                                        Text(
                                            text = recognizedStudent.registerNumber,
                                            style = MaterialTheme.typography.labelSmall,
                                            fontFamily = FontFamily.Monospace,
                                            color = Color(0xFF064E3B)
                                        )
                                    }
                                }
                            }

                            OutlinedTextField(
                                value = studentPassword,
                                onValueChange = { studentPassword = it },
                                label = { Text("Student Password") },
                                leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null) },
                                trailingIcon = {
                                    IconButton(onClick = { showPassword = !showPassword }) {
                                        Icon(
                                            imageVector = if (showPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                                            contentDescription = if (showPassword) "Hide password" else "Show password"
                                        )
                                    }
                                },
                                visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("student_password_input")
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.clickable { rememberMe = !rememberMe }
                                ) {
                                    Checkbox(checked = rememberMe, onCheckedChange = { rememberMe = it })
                                    Text("Remember Student ID", style = MaterialTheme.typography.bodySmall)
                                }
                                TextButton(
                                    onClick = onNavigateForgot,
                                    modifier = Modifier.testTag("forgot_password_button")
                                ) {
                                    Text("Forgot Password?", style = MaterialTheme.typography.labelMedium)
                                }
                            }

                            Button(
                                onClick = {
                                    errorMsg = null
                                    successMsg = null
                                    isAuthenticating = true
                                    viewModel.loginStudent(studentIdentifier, studentPassword, rememberMe) { ok, msg, role ->
                                        isAuthenticating = false
                                        if (ok && role != null) {
                                            successMsg = msg
                                            failedAttempts = 0
                                            onLoginSuccess(role)
                                        } else {
                                            failedAttempts += 1
                                            errorMsg = if (failedAttempts >= 3) {
                                                "$msg (Tip: Use Forgot Password to reset credentials)"
                                            } else msg
                                        }
                                    }
                                },
                                enabled = !isAuthenticating,
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = PrimaryBlue),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("student_login_button")
                            ) {
                                if (isAuthenticating) {
                                    CircularProgressIndicator(modifier = Modifier.size(18.dp), color = Color.White, strokeWidth = 2.dp)
                                } else {
                                    Icon(Icons.Filled.School, contentDescription = null, modifier = Modifier.size(18.dp))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Authenticate Student Login", style = MaterialTheme.typography.labelLarge)
                                }
                            }

                            OutlinedButton(
                                onClick = {
                                    errorMsg = null
                                    val targetId = recognizedStudent?.id ?: students.firstOrNull()?.id
                                    viewModel.loginBiometric(targetId) { ok, msg ->
                                        if (ok) {
                                            successMsg = msg
                                            onLoginSuccess("STUDENT")
                                        } else {
                                            errorMsg = msg
                                        }
                                    }
                                },
                                shape = RoundedCornerShape(14.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("biometric_login_button")
                            ) {
                                Icon(Icons.Filled.Fingerprint, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Quick Touch ID / Biometric Auth")
                            }
                        }
                    }

                    // Quick Select Registered Students
                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = PrimaryContainerLight.copy(alpha = 0.45f)),
                        border = BorderStroke(1.dp, PrimaryBlue.copy(alpha = 0.25f))
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
                                    "QUICK SELECT REGISTERED STUDENT",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = PrimaryRoyalBlue
                                )
                                Text(
                                    "${students.size} Students",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = PrimaryBlue
                                )
                            }
                            students.forEach { st ->
                                val selected = studentIdentifier.equals(st.registerNumber, ignoreCase = true)
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = MaterialTheme.colorScheme.surface,
                                    border = BorderStroke(
                                        width = if (selected) 1.5.dp else 1.dp,
                                        color = if (selected) PrimaryBlue else MaterialTheme.colorScheme.outline
                                    ),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .testTag("quick_student_${st.id}")
                                        .clickable {
                                            studentIdentifier = st.registerNumber
                                            studentPassword = "1234"
                                            errorMsg = null
                                        }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(10.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(30.dp)
                                                .clip(CircleShape)
                                                .background(PrimaryContainerLight),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                st.name.take(1),
                                                style = MaterialTheme.typography.labelLarge,
                                                color = PrimaryRoyalBlue
                                            )
                                        }
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(st.name, style = MaterialTheme.typography.titleSmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                            Text(
                                                "${st.department} • ${st.year}",
                                                style = MaterialTheme.typography.bodySmall,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                        }
                                        Surface(
                                            color = PrimaryContainerLight,
                                            shape = RoundedCornerShape(6.dp)
                                        ) {
                                            Text(
                                                st.registerNumber,
                                                style = MaterialTheme.typography.labelSmall,
                                                color = PrimaryRoyalBlue,
                                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Faculty & Admin Portal
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Text("Faculty & Staff Login", style = MaterialTheme.typography.titleMedium)
                            Text(
                                "Department Coordinators and System Administrators",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            OutlinedTextField(
                                value = facultyIdentifier,
                                onValueChange = { facultyIdentifier = it },
                                label = { Text("Staff ID / Username / Email") },
                                leadingIcon = { Icon(Icons.Filled.Badge, contentDescription = null) },
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("faculty_identifier_input")
                            )

                            OutlinedTextField(
                                value = facultyPassword,
                                onValueChange = { facultyPassword = it },
                                label = { Text("Password") },
                                leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null) },
                                trailingIcon = {
                                    IconButton(onClick = { showFacultyPassword = !showFacultyPassword }) {
                                        Icon(
                                            imageVector = if (showFacultyPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                                            contentDescription = "Toggle password"
                                        )
                                    }
                                },
                                visualTransformation = if (showFacultyPassword) VisualTransformation.None else PasswordVisualTransformation(),
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("faculty_password_input")
                            )

                            Button(
                                onClick = {
                                    errorMsg = null
                                    successMsg = null
                                    isAuthenticating = true
                                    viewModel.loginFacultyOrAdmin(facultyIdentifier, facultyPassword) { ok, msg, role ->
                                        isAuthenticating = false
                                        if (ok && role != null) {
                                            successMsg = msg
                                            onLoginSuccess(role)
                                        } else {
                                            errorMsg = msg
                                        }
                                    }
                                },
                                enabled = !isAuthenticating,
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = IndigoAccent),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .testTag("faculty_login_button")
                            ) {
                                Text("Sign In to Staff / Admin Portal", style = MaterialTheme.typography.labelLarge)
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                            }

                            Text(
                                "STAFF & ADMIN 1-TAP FILL",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.align(Alignment.CenterHorizontally)
                            )

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                OutlinedButton(
                                    onClick = {
                                        facultyIdentifier = "staff"
                                        facultyPassword = "1234"
                                        errorMsg = null
                                    },
                                    modifier = Modifier
                                        .weight(1f)
                                        .testTag("fill_staff_button")
                                ) {
                                    Text("S.Priyadharshini", maxLines = 1, overflow = TextOverflow.Ellipsis)
                                }
                                OutlinedButton(
                                    onClick = {
                                        facultyIdentifier = "admin"
                                        facultyPassword = "admin123"
                                        errorMsg = null
                                    },
                                    modifier = Modifier
                                        .weight(1f)
                                        .testTag("fill_admin_button")
                                ) {
                                    Icon(Icons.Filled.AdminPanelSettings, contentDescription = null, modifier = Modifier.size(16.dp), tint = PurpleAccent)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("Admin", maxLines = 1)
                                }
                            }
                        }
                    }
                }

                // Footer Navigation
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("New to the college?", style = MaterialTheme.typography.bodySmall)
                        TextButton(
                            onClick = onNavigateSignup,
                            modifier = Modifier.testTag("create_student_account_button")
                        ) {
                            Text("Create Student Account", style = MaterialTheme.typography.labelLarge)
                        }
                    }
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            Icons.Filled.VerifiedUser,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(13.dp)
                        )
                        Text(
                            "College Examination & Event Cell • NIET Portal",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PortalTabButton(
    selected: Boolean,
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    testTag: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .height(44.dp)
            .testTag(testTag)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = if (selected) MaterialTheme.colorScheme.surface else Color.Transparent,
        shadowElevation = if (selected) 2.dp else 0.dp
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (selected) PrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelLarge,
                color = if (selected) PrimaryBlue else MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignupScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onSignupSuccess: () -> Unit
) {
    val departments = listOf(
        "Master of Computer Applications",
        "Computer Science and Engineering",
        "Information Technology",
        "Electronics & Communication",
        "Electrical & Electronics",
        "Mechanical Engineering",
        "Civil Engineering",
        "Biotechnology",
        "Management Studies"
    )
    val years = listOf("First Year (I)", "Second Year (II)", "Third Year (III)", "Final Year (IV)", "Postgraduate (PG)")

    var name by remember { mutableStateOf("") }
    var registerNumber by remember { mutableStateOf("") }
    var department by remember { mutableStateOf(departments.first()) }
    var year by remember { mutableStateOf(years[3]) }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    var deptExpanded by remember { mutableStateOf(false) }
    var yearExpanded by remember { mutableStateOf(false) }
    var statusMsg by remember { mutableStateOf<Pair<String, Boolean>?>(null) }

    Scaffold(
        topBar = { CampusTopBar(title = "Student Sign Up", subtitle = "Register with college credentials", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                statusMsg?.let { (text, isErr) ->
                    Surface(
                        color = if (isErr) RoseContainerLight else EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = text,
                            style = MaterialTheme.typography.bodySmall,
                            color = if (isErr) RoseError else Color(0xFF065F46),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp)
                        )
                    }
                }

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Student Name *") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("signup_name_input")
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = registerNumber,
                        onValueChange = { registerNumber = it },
                        label = { Text("Register No *") },
                        singleLine = true,
                        modifier = Modifier.weight(1f).testTag("signup_reg_input")
                    )

                    ExposedDropdownMenuBox(
                        expanded = yearExpanded,
                        onExpandedChange = { yearExpanded = !yearExpanded },
                        modifier = Modifier.weight(1f)
                    ) {
                        OutlinedTextField(
                            value = year,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Year") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = yearExpanded) },
                            modifier = Modifier.menuAnchor(MenuAnchorType.PrimaryNotEditable)
                        )
                        ExposedDropdownMenu(expanded = yearExpanded, onDismissRequest = { yearExpanded = false }) {
                            years.forEach { y ->
                                DropdownMenuItem(text = { Text(y) }, onClick = { year = y; yearExpanded = false })
                            }
                        }
                    }
                }

                ExposedDropdownMenuBox(
                    expanded = deptExpanded,
                    onExpandedChange = { deptExpanded = !deptExpanded }
                ) {
                    OutlinedTextField(
                        value = department,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Department") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = deptExpanded) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .menuAnchor(MenuAnchorType.PrimaryNotEditable)
                    )
                    ExposedDropdownMenu(expanded = deptExpanded, onDismissRequest = { deptExpanded = false }) {
                        departments.forEach { d ->
                            DropdownMenuItem(text = { Text(d) }, onClick = { department = d; deptExpanded = false })
                        }
                    }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("Email *") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        singleLine = true,
                        modifier = Modifier.weight(1f).testTag("signup_email_input")
                    )
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { phone = it },
                        label = { Text("Phone *") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                        singleLine = true,
                        modifier = Modifier.weight(1f).testTag("signup_phone_input")
                    )
                }

                OutlinedTextField(
                    value = username,
                    onValueChange = { username = it },
                    label = { Text("Choose Username *") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("signup_username_input")
                )

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it },
                        label = { Text("Password *") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.weight(1f).testTag("signup_password_input")
                    )
                    OutlinedTextField(
                        value = confirmPassword,
                        onValueChange = { confirmPassword = it },
                        label = { Text("Confirm *") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.weight(1f).testTag("signup_confirm_input")
                    )
                }

                Button(
                    onClick = {
                        when {
                            name.isBlank() || registerNumber.isBlank() || email.isBlank() || phone.isBlank() || username.isBlank() || password.isBlank() ->
                                statusMsg = "Please fill in all mandatory fields." to true
                            !email.contains("@") || !email.contains(".") ->
                                statusMsg = "Please enter a valid email address." to true
                            phone.length < 10 ->
                                statusMsg = "Phone number must be at least 10 digits." to true
                            password != confirmPassword ->
                                statusMsg = "Passwords do not match." to true
                            else -> {
                                viewModel.registerStudent(name, registerNumber, department, year, email, phone, username, password) { res ->
                                    statusMsg = res.message to !res.success
                                    if (res.success) onSignupSuccess()
                                }
                            }
                        }
                    },
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("signup_submit_button")
                ) {
                    Text("Complete Student Registration")
                }
            }
        }
    }
}

@Composable
fun ForgotPasswordScreen(
    viewModel: CampusViewModel,
    onBack: () -> Unit,
    onResetSuccess: () -> Unit
) {
    var identifier by remember { mutableStateOf("") }
    var regNoOrEmail by remember { mutableStateOf("") }
    var newPass by remember { mutableStateOf("") }
    var confirmPass by remember { mutableStateOf("") }
    var statusMsg by remember { mutableStateOf<Pair<String, Boolean>?>(null) }

    Scaffold(
        topBar = { CampusTopBar(title = "Reset Password", subtitle = "Verify details to set a new password", onBack = onBack) }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentAlignment = Alignment.TopCenter
        ) {
            Column(
                modifier = Modifier
                    .widthIn(max = 560.dp)
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                statusMsg?.let { (text, isErr) ->
                    Surface(
                        color = if (isErr) RoseContainerLight else EmeraldContainerLight,
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = text,
                            style = MaterialTheme.typography.bodySmall,
                            color = if (isErr) RoseError else Color(0xFF065F46),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp)
                        )
                    }
                }

                OutlinedTextField(
                    value = identifier,
                    onValueChange = { identifier = it },
                    label = { Text("Username") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("forgot_username_input")
                )
                OutlinedTextField(
                    value = regNoOrEmail,
                    onValueChange = { regNoOrEmail = it },
                    label = { Text("Email or Register Number") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("forgot_reg_email_input")
                )
                OutlinedTextField(
                    value = newPass,
                    onValueChange = { newPass = it },
                    label = { Text("New Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("forgot_new_password_input")
                )
                OutlinedTextField(
                    value = confirmPass,
                    onValueChange = { confirmPass = it },
                    label = { Text("Confirm New Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth().testTag("forgot_confirm_password_input")
                )

                Button(
                    onClick = {
                        when {
                            identifier.isBlank() || newPass.isBlank() || confirmPass.isBlank() ->
                                statusMsg = "Please fill in all fields" to true
                            newPass != confirmPass ->
                                statusMsg = "Passwords do not match" to true
                            else -> {
                                viewModel.resetPassword(identifier, regNoOrEmail.ifBlank { identifier }, newPass) { ok ->
                                    if (ok) {
                                        statusMsg = "Password reset successful! You can now log in." to false
                                        onResetSuccess()
                                    } else {
                                        statusMsg = "No matching user or student record found." to true
                                    }
                                }
                            }
                        }
                    },
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("forgot_submit_button")
                ) {
                    Text("Update Password")
                }
            }
        }
    }
}
