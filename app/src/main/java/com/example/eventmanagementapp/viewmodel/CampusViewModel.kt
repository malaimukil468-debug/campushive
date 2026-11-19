package com.example.eventmanagementapp.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.eventmanagementapp.data.ActionResult
import com.example.eventmanagementapp.data.ActivityLogEntity
import com.example.eventmanagementapp.data.AppDatabase
import com.example.eventmanagementapp.data.AttendanceEntity
import com.example.eventmanagementapp.data.CampusRepository
import com.example.eventmanagementapp.data.CertificateEntity
import com.example.eventmanagementapp.data.CheckInResult
import com.example.eventmanagementapp.data.EventEntity
import com.example.eventmanagementapp.data.FavoriteEntity
import com.example.eventmanagementapp.data.FeedbackEntity
import com.example.eventmanagementapp.data.NotificationEntity
import com.example.eventmanagementapp.data.RegistrationEntity
import com.example.eventmanagementapp.data.StaffEntity
import com.example.eventmanagementapp.data.StudentEntity
import com.example.eventmanagementapp.data.UserEntity
import com.example.eventmanagementapp.data.WaitlistEntity
import com.example.eventmanagementapp.utils.NotificationHelper
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class SessionState(
    val user: UserEntity? = null,
    val student: StudentEntity? = null,
    val staff: StaffEntity? = null
)

class CampusViewModel(application: Application) : AndroidViewModel(application) {
    private val db = AppDatabase.getInstance(application)
    private val repo = CampusRepository(db.appDao())
    private val prefs = application.getSharedPreferences("campushive_prefs", Context.MODE_PRIVATE)

    val users: StateFlow<List<UserEntity>> = repo.users.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val students: StateFlow<List<StudentEntity>> = repo.students.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val staffList: StateFlow<List<StaffEntity>> = repo.staffMembers.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val events: StateFlow<List<EventEntity>> = repo.events.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val registrations: StateFlow<List<RegistrationEntity>> = repo.registrations.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val waitlist: StateFlow<List<WaitlistEntity>> = repo.waitlist.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val favorites: StateFlow<List<FavoriteEntity>> = repo.favorites.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val attendance: StateFlow<List<AttendanceEntity>> = repo.attendance.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val feedbackList: StateFlow<List<FeedbackEntity>> = repo.feedbackList.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val certificates: StateFlow<List<CertificateEntity>> = repo.certificates.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val notifications: StateFlow<List<NotificationEntity>> = repo.notifications.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
    val activityLogs: StateFlow<List<ActivityLogEntity>> = repo.activityLogs.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _session = MutableStateFlow(SessionState())
    val session: StateFlow<SessionState> = _session.asStateFlow()

    private val _isDark = MutableStateFlow(prefs.getBoolean("dark_mode", false))
    val isDark: StateFlow<Boolean> = _isDark.asStateFlow()

    private val _language = MutableStateFlow(prefs.getString("language", "en") ?: "en")
    val language: StateFlow<String> = _language.asStateFlow()

    private val _rememberedStudentId = MutableStateFlow(prefs.getString("remembered_student_id", "927625MCA026") ?: "927625MCA026")
    val rememberedStudentId: StateFlow<String> = _rememberedStudentId.asStateFlow()

    init {
        viewModelScope.launch {
            repo.ensureSeeded()
        }
    }

    fun toggleDarkMode() {
        val next = !_isDark.value
        _isDark.value = next
        prefs.edit().putBoolean("dark_mode", next).apply()
    }

    fun setLanguage(lang: String) {
        _language.value = lang
        prefs.edit().putString("language", lang).apply()
    }

    fun saveRememberedStudentId(identifier: String, remember: Boolean) {
        val value = if (remember) identifier.trim() else ""
        _rememberedStudentId.value = value
        prefs.edit().putString("remembered_student_id", value).apply()
    }

    fun loginStudent(identifier: String, password: String, rememberMe: Boolean, onResult: (Boolean, String, String?) -> Unit) {
        viewModelScope.launch {
            val res = repo.authenticateStudent(identifier, password)
            if (res.success && res.user != null) {
                saveRememberedStudentId(identifier, rememberMe)
                _session.value = SessionState(res.user, res.student, res.staff)
                onResult(true, res.message, res.user.role)
            } else {
                onResult(false, res.message, null)
            }
        }
    }

    fun loginBiometric(studentId: Int?, onResult: (Boolean, String) -> Unit) {
        viewModelScope.launch {
            val res = repo.authenticateStudentBiometric(studentId)
            if (res.success && res.user != null) {
                _session.value = SessionState(res.user, res.student, res.staff)
                onResult(true, res.message)
            } else {
                onResult(false, res.message)
            }
        }
    }

    fun loginFacultyOrAdmin(identifier: String, password: String, onResult: (Boolean, String, String?) -> Unit) {
        viewModelScope.launch {
            val res = repo.authenticateFacultyOrAdmin(identifier, password)
            if (res.success && res.user != null) {
                _session.value = SessionState(res.user, res.student, res.staff)
                onResult(true, res.message, res.user.role)
            } else {
                onResult(false, res.message, null)
            }
        }
    }

    fun logout() {
        _session.value = SessionState()
    }

    fun registerStudent(
        name: String,
        registerNumber: String,
        department: String,
        year: String,
        email: String,
        phone: String,
        username: String,
        password: String,
        onResult: (ActionResult) -> Unit
    ) {
        viewModelScope.launch {
            val res = repo.registerStudent(name, registerNumber, department, year, email, phone, username, password)
            onResult(res)
        }
    }

    fun resetPassword(identifier: String, regNoOrEmail: String, newPass: String, onResult: (Boolean) -> Unit) {
        viewModelScope.launch {
            val ok = repo.resetPassword(identifier, regNoOrEmail, newPass)
            onResult(ok)
        }
    }

    fun toggleFavorite(eventId: Int) {
        val studentId = _session.value.student?.id ?: return
        viewModelScope.launch {
            repo.toggleFavorite(studentId, eventId)
        }
    }

    fun registerForEvent(eventId: Int, onResult: (ActionResult) -> Unit) {
        val studentId = _session.value.student?.id ?: return
        viewModelScope.launch {
            val res = repo.registerForEvent(studentId, eventId)
            if (res.success && !res.waitlisted) {
                val ev = events.value.firstOrNull { it.id == eventId }
                NotificationHelper.showNotification(
                    getApplication(),
                    "Registration Confirmed!",
                    "Pass ${res.extraId ?: ""} issued for \"${ev?.name ?: "Campus Event"}\"."
                )
            }
            onResult(res)
        }
    }

    fun cancelRegistration(eventId: Int, onResult: (ActionResult) -> Unit) {
        val studentId = _session.value.student?.id ?: return
        viewModelScope.launch {
            val res = repo.cancelRegistration(studentId, eventId)
            onResult(res)
        }
    }

    fun triggerReminderAlert(event: EventEntity) {
        NotificationHelper.showNotification(
            getApplication(),
            "Upcoming Event Reminder",
            "\"${event.name}\" starts at ${event.startTime} on ${event.date} in ${event.venue}. Have your Digital Pass ready!"
        )
    }

    fun submitFeedback(eventId: Int, rating: Int, comment: String, onResult: (ActionResult) -> Unit) {
        val studentId = _session.value.student?.id ?: return
        viewModelScope.launch {
            val res = repo.submitFeedback(studentId, eventId, rating, comment)
            onResult(res)
        }
    }

    fun verifyCertificate(certId: String, onResult: (CertificateEntity?) -> Unit) {
        viewModelScope.launch {
            onResult(repo.verifyCertificate(certId))
        }
    }

    fun markNotificationRead(id: Int) {
        viewModelScope.launch {
            repo.markNotificationAsRead(id)
        }
    }

    fun updateStudentProfile(email: String, phone: String, onComplete: () -> Unit) {
        val studentId = _session.value.student?.id ?: return
        viewModelScope.launch {
            val updated = repo.updateStudentProfile(studentId, email, phone)
            if (updated != null) {
                _session.value = _session.value.copy(student = updated)
            }
            onComplete()
        }
    }

    fun createEvent(
        name: String,
        description: String,
        category: String,
        date: String,
        startTime: String,
        endTime: String,
        venue: String,
        eventType: String,
        organizer: String,
        capacity: Int,
        registrationDeadline: String,
        meetingLink: String,
        onResult: (ActionResult) -> Unit
    ) {
        val user = _session.value.user ?: return
        val creatorName = _session.value.staff?.name ?: user.username
        viewModelScope.launch {
            val res = repo.createEvent(
                name, description, category, date, startTime, endTime,
                venue, eventType, organizer, capacity, registrationDeadline,
                meetingLink, user.id, user.role, creatorName
            )
            onResult(res)
        }
    }

    fun setEventStatus(eventId: Int, status: String, onResult: (ActionResult) -> Unit = {}) {
        val user = _session.value.user ?: return
        val actorName = _session.value.staff?.name ?: user.username
        viewModelScope.launch {
            val res = repo.setEventStatus(eventId, status, user.id, actorName, user.role)
            onResult(res)
        }
    }

    fun broadcastEventUpdate(eventId: Int, message: String, onResult: (ActionResult) -> Unit) {
        val user = _session.value.user ?: return
        val staffName = _session.value.staff?.name ?: user.username
        viewModelScope.launch {
            val res = repo.broadcastEventUpdate(eventId, message, user.id, staffName)
            if (res.success) {
                val ev = events.value.firstOrNull { it.id == eventId }
                NotificationHelper.showNotification(
                    getApplication(),
                    "Live Event Update: ${ev?.name ?: "Campus Event"}",
                    message
                )
            }
            onResult(res)
        }
    }

    fun checkInStudent(qrData: String, onResult: (CheckInResult) -> Unit) {
        val user = _session.value.user ?: return
        val staffName = _session.value.staff?.name ?: "S.Priyadharshini"
        viewModelScope.launch {
            val res = repo.checkInStudent(qrData, user.id, staffName)
            onResult(res)
        }
    }

    fun addStaff(
        name: String,
        staffId: String,
        department: String,
        email: String,
        phone: String,
        username: String,
        password: String,
        onResult: (ActionResult) -> Unit
    ) {
        viewModelScope.launch {
            val res = repo.addStaff(name, staffId, department, email, phone, username, password)
            onResult(res)
        }
    }

    fun toggleStaffStatus(staffRecordId: Int) {
        viewModelScope.launch {
            repo.toggleStaffStatus(staffRecordId)
        }
    }

    fun resetDatabase(onComplete: () -> Unit) {
        viewModelScope.launch {
            repo.resetDatabase()
            onComplete()
        }
    }
}
