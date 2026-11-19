package com.example.eventmanagementapp.data

import kotlinx.coroutines.flow.Flow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class AuthResult(
    val success: Boolean,
    val message: String,
    val user: UserEntity? = null,
    val student: StudentEntity? = null,
    val staff: StaffEntity? = null
)

data class ActionResult(
    val success: Boolean,
    val message: String,
    val extraId: String? = null,
    val waitlisted: Boolean = false
)

data class CheckInResult(
    val success: Boolean,
    val message: String,
    val studentName: String? = null,
    val eventName: String? = null,
    val checkInTime: String? = null,
    val checkOutTime: String? = null
)

class CampusRepository(private val dao: AppDao) {

    val users: Flow<List<UserEntity>> = dao.observeUsers()
    val students: Flow<List<StudentEntity>> = dao.observeStudents()
    val staffMembers: Flow<List<StaffEntity>> = dao.observeStaff()
    val events: Flow<List<EventEntity>> = dao.observeEvents()
    val registrations: Flow<List<RegistrationEntity>> = dao.observeRegistrations()
    val waitlist: Flow<List<WaitlistEntity>> = dao.observeWaitlist()
    val favorites: Flow<List<FavoriteEntity>> = dao.observeFavorites()
    val attendance: Flow<List<AttendanceEntity>> = dao.observeAttendance()
    val feedbackList: Flow<List<FeedbackEntity>> = dao.observeFeedback()
    val certificates: Flow<List<CertificateEntity>> = dao.observeCertificates()
    val notifications: Flow<List<NotificationEntity>> = dao.observeNotifications()
    val activityLogs: Flow<List<ActivityLogEntity>> = dao.observeActivityLogs()

    suspend fun ensureSeeded() {
        if (dao.getUserCount() == 0) {
            seedInitialData()
        }
    }

    suspend fun resetDatabase() {
        dao.clearActivityLogs()
        dao.clearNotifications()
        dao.clearCertificates()
        dao.clearFeedback()
        dao.clearAttendance()
        dao.clearFavorites()
        dao.clearWaitlist()
        dao.clearRegistrations()
        dao.clearEvents()
        dao.clearStaff()
        dao.clearStudents()
        dao.clearUsers()
        seedInitialData()
    }

    private suspend fun seedInitialData() {
        dao.insertUsers(
            listOf(
                UserEntity(id = 1, username = "student", password = "1234", role = "STUDENT", status = "ACTIVE"),
                UserEntity(id = 2, username = "staff", password = "1234", role = "STAFF", status = "ACTIVE"),
                UserEntity(id = 3, username = "admin", password = "admin123", role = "ADMIN", status = "ACTIVE"),
                UserEntity(id = 4, username = "priya_cse", password = "1234", role = "STUDENT", status = "ACTIVE"),
                UserEntity(id = 5, username = "dr_sharma", password = "1234", role = "STAFF", status = "ACTIVE")
            )
        )

        dao.insertStudents(
            listOf(
                StudentEntity(
                    id = 1,
                    userId = 1,
                    name = "Monika Sivakumar",
                    registerNumber = "927625MCA026",
                    department = "Master of Computer Applications",
                    year = "Final Year (II)",
                    email = "monikasivakumarm@gmail.com",
                    phone = "9876543210"
                ),
                StudentEntity(
                    id = 2,
                    userId = 4,
                    name = "Priya Rajendran",
                    registerNumber = "920422104025",
                    department = "Information Technology",
                    year = "Third Year (III)",
                    email = "priya.it@college.edu",
                    phone = "9845123456"
                )
            )
        )

        dao.insertStaffList(
            listOf(
                StaffEntity(
                    id = 1,
                    userId = 2,
                    name = "S.Priyadharshini",
                    staffId = "STF-MCA-104",
                    department = "Master of Computer Applications",
                    email = "priyadharshini.mca@college.edu",
                    phone = "9443219876",
                    status = "ACTIVE"
                ),
                StaffEntity(
                    id = 2,
                    userId = 5,
                    name = "Dr. Anita Sharma",
                    staffId = "STF-ECE-208",
                    department = "Electronics and Communication",
                    email = "anita.ece@college.edu",
                    phone = "9443551122",
                    status = "ACTIVE"
                )
            )
        )

        dao.insertEvents(
            listOf(
                EventEntity(
                    id = 1,
                    name = "National Technical Symposium 2026",
                    description = "Annual inter-collegiate technical fest featuring hackathons, paper presentations, UI/UX design battle, and web development showdowns.",
                    category = "Technical",
                    date = "2026-10-10",
                    startTime = "09:30",
                    endTime = "16:30",
                    venue = "Main Auditorium & CS Labs",
                    eventType = "Offline",
                    organizer = "Dept. of CSE & Coding Club",
                    capacity = 100,
                    registeredCount = 42,
                    registrationDeadline = "2026-10-09",
                    posterKey = "tech",
                    meetingLink = "",
                    status = "Upcoming",
                    createdBy = 2,
                    createdByName = "S.Priyadharshini"
                ),
                EventEntity(
                    id = 2,
                    name = "Vibrant Cultural Fest \"Sanskriti\"",
                    description = "Spectacular multi-stage music band performances, classical & western dance face-offs, drama, and fine arts exhibits.",
                    category = "Cultural",
                    date = "2026-10-15",
                    startTime = "10:00",
                    endTime = "18:00",
                    venue = "Open Air College Amphitheater",
                    eventType = "Offline",
                    organizer = "Fine Arts & Cultural Council",
                    capacity = 200,
                    registeredCount = 188,
                    registrationDeadline = "2026-10-14",
                    posterKey = "cultural",
                    meetingLink = "",
                    status = "Upcoming",
                    createdBy = 2,
                    createdByName = "S.Priyadharshini"
                ),
                EventEntity(
                    id = 3,
                    name = "Hands-on AI & Robotics Masterclass",
                    description = "Comprehensive industry-aligned workshop covering computer vision, autonomous embedded bots, and real-time edge AI architectures.",
                    category = "Workshop",
                    date = "2026-10-22",
                    startTime = "10:00",
                    endTime = "16:00",
                    venue = "Robotics Lab 3, Tech Block",
                    eventType = "Hybrid",
                    organizer = "IEEE Student Branch & Robotics Club",
                    capacity = 40,
                    registeredCount = 40,
                    registrationDeadline = "2026-10-21",
                    posterKey = "tech",
                    meetingLink = "https://meet.google.com/xyz-tech-symp",
                    status = "Upcoming",
                    createdBy = 2,
                    createdByName = "S.Priyadharshini"
                ),
                EventEntity(
                    id = 4,
                    name = "Inter-College Badminton Championship",
                    description = "Singles and doubles knockout tournament for men and women college athletes with trophies and certificates.",
                    category = "Sports",
                    date = "2026-10-28",
                    startTime = "08:00",
                    endTime = "15:00",
                    venue = "Indoor Sports Complex",
                    eventType = "Offline",
                    organizer = "Department of Physical Education",
                    capacity = 50,
                    registeredCount = 16,
                    registrationDeadline = "2026-10-27",
                    posterKey = "sports",
                    meetingLink = "",
                    status = "Upcoming",
                    createdBy = 2,
                    createdByName = "S.Priyadharshini"
                ),
                EventEntity(
                    id = 5,
                    name = "Web3 & Cloud Infrastructure Summit",
                    description = "Distinguished guest lectures from Google Cloud architects and open-source blockchain core maintainers.",
                    category = "Seminar",
                    date = "2026-11-05",
                    startTime = "11:00",
                    endTime = "14:00",
                    venue = "Seminar Hall 1",
                    eventType = "Online",
                    organizer = "CSI Student Chapter",
                    capacity = 150,
                    registeredCount = 12,
                    registrationDeadline = "2026-11-04",
                    posterKey = "hero",
                    meetingLink = "https://meet.google.com/abc-web3-cloud",
                    status = "Pending",
                    createdBy = 5,
                    createdByName = "Dr. Anita Sharma"
                ),
                EventEntity(
                    id = 6,
                    name = "Python for Data Science Bootcamp",
                    description = "Complete hands-on crash course on Pandas, NumPy, Scikit-learn, and data visualization.",
                    category = "Workshop",
                    date = "2026-09-20",
                    startTime = "09:00",
                    endTime = "17:00",
                    venue = "Seminar Hall 2",
                    eventType = "Offline",
                    organizer = "Data Science Club",
                    capacity = 60,
                    registeredCount = 60,
                    registrationDeadline = "2026-09-19",
                    posterKey = "tech",
                    meetingLink = "",
                    status = "Completed",
                    createdBy = 2,
                    createdByName = "S.Priyadharshini"
                )
            )
        )

        dao.insertRegistrations(
            listOf(
                RegistrationEntity(
                    id = 1,
                    studentId = 1,
                    eventId = 1,
                    registrationId = "REG-2026-1001-9276",
                    registrationDate = "2026-09-25 14:22:10",
                    status = "REGISTERED",
                    studentName = "Monika Sivakumar",
                    registerNumber = "927625MCA026",
                    department = "Master of Computer Applications",
                    eventName = "National Technical Symposium 2026",
                    eventDate = "2026-10-10",
                    venue = "Main Auditorium & CS Labs"
                ),
                RegistrationEntity(
                    id = 2,
                    studentId = 1,
                    eventId = 6,
                    registrationId = "REG-2026-0920-8812",
                    registrationDate = "2026-09-15 11:05:00",
                    status = "REGISTERED",
                    studentName = "Monika Sivakumar",
                    registerNumber = "927625MCA026",
                    department = "Master of Computer Applications",
                    eventName = "Python for Data Science Bootcamp",
                    eventDate = "2026-09-20",
                    venue = "Seminar Hall 2"
                )
            )
        )

        dao.insertFavorites(
            listOf(
                FavoriteEntity(id = 1, studentId = 1, eventId = 1),
                FavoriteEntity(id = 2, studentId = 1, eventId = 2)
            )
        )

        dao.insertAttendanceList(
            listOf(
                AttendanceEntity(
                    id = 1,
                    studentId = 1,
                    eventId = 6,
                    checkIn = "2026-09-20 09:12:00",
                    checkOut = "2026-09-20 17:05:00",
                    status = "Present",
                    studentName = "Monika Sivakumar",
                    registerNumber = "927625MCA026",
                    department = "Master of Computer Applications"
                )
            )
        )

        dao.insertFeedbackList(
            listOf(
                FeedbackEntity(
                    id = 1,
                    studentId = 1,
                    eventId = 6,
                    rating = 5,
                    comment = "Outstanding workshop! The practical code walkthroughs and real dataset projects helped immensely.",
                    date = "2026-09-20 18:30:00",
                    studentName = "Monika Sivakumar"
                )
            )
        )

        dao.insertCertificates(
            listOf(
                CertificateEntity(
                    id = 1,
                    studentId = 1,
                    eventId = 6,
                    certificateId = "CERT-COL-2026-9204-6",
                    issueDate = "2026-09-21",
                    status = "VALID",
                    studentName = "Monika Sivakumar",
                    eventName = "Python for Data Science Bootcamp",
                    eventDate = "2026-09-20",
                    organizer = "Data Science Club"
                )
            )
        )

        dao.insertNotifications(
            listOf(
                NotificationEntity(
                    id = 1,
                    userId = 1,
                    title = "Registration Confirmed!",
                    message = "Your registration for National Technical Symposium 2026 has been successfully confirmed. View your Digital Pass.",
                    date = "2026-09-25 14:22",
                    isRead = false
                ),
                NotificationEntity(
                    id = 2,
                    userId = 1,
                    title = "Certificate Issued",
                    message = "Your official certificate of participation for Python for Data Science Bootcamp is now ready to download.",
                    date = "2026-09-21 10:00",
                    isRead = true
                ),
                NotificationEntity(
                    id = 3,
                    userId = 1,
                    title = "Upcoming Event Reminder",
                    message = "Reminder: National Technical Symposium 2026 is scheduled on 2026-10-10 at Main Auditorium.",
                    date = "2026-09-30 08:30",
                    isRead = false
                ),
                NotificationEntity(
                    id = 4,
                    userId = 2,
                    title = "New Student Registration",
                    message = "Monika Sivakumar registered for National Technical Symposium 2026.",
                    date = "2026-09-25 14:22",
                    isRead = true
                ),
                NotificationEntity(
                    id = 5,
                    userId = 3,
                    title = "Event Approval Request",
                    message = "Dr. Anita Sharma submitted \"Web3 & Cloud Infrastructure Summit\" for approval.",
                    date = "2026-09-28 16:45",
                    isRead = false
                )
            )
        )

        dao.insertActivityLogs(
            listOf(
                ActivityLogEntity(
                    id = 1,
                    userId = 3,
                    userName = "Admin",
                    role = "ADMIN",
                    action = "System initialized with Room SQLite Database version 1",
                    date = "2026-09-01",
                    time = "08:00:00"
                ),
                ActivityLogEntity(
                    id = 2,
                    userId = 2,
                    userName = "S.Priyadharshini",
                    role = "STAFF",
                    action = "Created event \"National Technical Symposium 2026\"",
                    date = "2026-09-10",
                    time = "11:15:00"
                ),
                ActivityLogEntity(
                    id = 3,
                    userId = 3,
                    userName = "Admin",
                    role = "ADMIN",
                    action = "Approved event \"National Technical Symposium 2026\"",
                    date = "2026-09-11",
                    time = "09:30:00"
                ),
                ActivityLogEntity(
                    id = 4,
                    userId = 1,
                    userName = "Monika Sivakumar",
                    role = "STUDENT",
                    action = "Registered for \"National Technical Symposium 2026\" (ID: REG-2026-1001-9276)",
                    date = "2026-09-25",
                    time = "14:22:10"
                )
            )
        )
    }

    private fun nowDate(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())
    private fun nowTime(): String = SimpleDateFormat("HH:mm:ss", Locale.US).format(Date())
    private fun nowTimestamp(): String = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
    private fun nowShortTimestamp(): String = SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.US).format(Date())

    suspend fun logActivity(userId: Int, userName: String, role: String, action: String) {
        dao.insertActivityLog(
            ActivityLogEntity(
                userId = userId,
                userName = userName,
                role = role,
                action = action,
                date = nowDate(),
                time = nowTime()
            )
        )
    }

    suspend fun createNotification(userId: Int, title: String, message: String) {
        dao.insertNotification(
            NotificationEntity(
                userId = userId,
                title = title,
                message = message,
                date = nowShortTimestamp(),
                isRead = false
            )
        )
    }

    suspend fun markNotificationAsRead(id: Int) {
        dao.markNotificationRead(id)
    }

    suspend fun findStudentByIdentifier(identifier: String): StudentEntity? {
        val trimmed = identifier.trim()
        if (trimmed.isEmpty()) return null
        val students = dao.getAllStudents()
        val users = dao.getAllUsers()

        students.firstOrNull { it.registerNumber.equals(trimmed, ignoreCase = true) }?.let { return it }
        students.firstOrNull { it.email.equals(trimmed, ignoreCase = true) }?.let { return it }
        students.firstOrNull { it.phone == trimmed }?.let { return it }

        val user = users.firstOrNull { it.username.equals(trimmed, ignoreCase = true) && it.role == "STUDENT" }
        return if (user != null) students.firstOrNull { it.userId == user.id } else null
    }

    suspend fun authenticateStudent(identifier: String, password: String): AuthResult {
        val trimmed = identifier.trim()
        if (trimmed.isEmpty() || password.isEmpty()) {
            return AuthResult(false, "Please enter your Register Number / Username and password.")
        }
        val users = dao.getAllUsers()
        val students = dao.getAllStudents()

        var student = findStudentByIdentifier(trimmed)
        val user = if (student != null) {
            users.firstOrNull { it.id == student.userId }
        } else {
            val u = users.firstOrNull { it.username.equals(trimmed, ignoreCase = true) }
            if (u != null) student = students.firstOrNull { it.userId == u.id }
            u
        }

        if (user == null) {
            return AuthResult(false, "No student account found for \"$trimmed\". Check your Register Number or sign up.")
        }
        if (user.role != "STUDENT") {
            return AuthResult(false, "This account (${user.username}) belongs to ${user.role}. Please use the Faculty & Admin login tab.")
        }
        if (user.password != password) {
            return AuthResult(false, "Incorrect password for student account. Please verify or use Forgot Password.")
        }
        if (user.status == "INACTIVE") {
            return AuthResult(false, "This student account has been marked inactive. Please visit the Campus Registrar.")
        }

        val name = student?.name ?: user.username
        logActivity(user.id, name, "STUDENT", "Student logged in successfully (Reg: ${student?.registerNumber ?: "N/A"})")
        return AuthResult(true, "Welcome back, $name! Authenticated successfully.", user = user, student = student)
    }

    suspend fun authenticateStudentBiometric(studentId: Int?): AuthResult {
        val students = dao.getAllStudents()
        val student = if (studentId != null) students.firstOrNull { it.id == studentId } else students.firstOrNull()
        if (student == null) {
            return AuthResult(false, "No registered student biometric profile found.")
        }
        val user = dao.getAllUsers().firstOrNull { it.id == student.userId }
        if (user == null || user.status == "INACTIVE") {
            return AuthResult(false, "Student account is inactive.")
        }
        logActivity(user.id, student.name, "STUDENT", "Biometric Touch ID authentication verified for ${student.name}")
        return AuthResult(true, "Biometric identity verified: ${student.name}", user = user, student = student)
    }

    suspend fun authenticateFacultyOrAdmin(identifier: String, password: String): AuthResult {
        val trimmed = identifier.trim()
        if (trimmed.isEmpty() || password.isEmpty()) {
            return AuthResult(false, "Please enter your credentials.")
        }
        val users = dao.getAllUsers()
        val staffList = dao.getAllStaff()
        val students = dao.getAllStudents()

        var user = users.firstOrNull { it.username.equals(trimmed, ignoreCase = true) && it.password == password }
        var staff: StaffEntity? = null

        if (user == null) {
            staff = staffList.firstOrNull {
                it.staffId.equals(trimmed, ignoreCase = true) ||
                    it.email.equals(trimmed, ignoreCase = true) ||
                    it.phone == trimmed
            }
            if (staff != null) {
                user = users.firstOrNull { it.id == staff.userId && it.password == password }
            }
        }

        if (user == null) {
            return AuthResult(false, "Invalid staff/admin credentials.")
        }
        if (user.status == "INACTIVE") {
            return AuthResult(false, "This account is deactivated. Contact the administrator.")
        }

        val resolvedStaff = staff ?: if (user.role == "STAFF") staffList.firstOrNull { it.userId == user.id } else null
        val resolvedStudent = if (user.role == "STUDENT") students.firstOrNull { it.userId == user.id } else null
        return AuthResult(true, "Signed in as ${user.role}", user = user, student = resolvedStudent, staff = resolvedStaff)
    }

    suspend fun registerStudent(
        name: String,
        registerNumber: String,
        department: String,
        year: String,
        email: String,
        phone: String,
        username: String,
        password: String
    ): ActionResult {
        val users = dao.getAllUsers()
        val students = dao.getAllStudents()

        if (users.any { it.username.equals(username.trim(), ignoreCase = true) }) {
            return ActionResult(false, "Username is already taken.")
        }
        if (students.any { it.registerNumber.equals(registerNumber.trim(), ignoreCase = true) }) {
            return ActionResult(false, "Register Number already exists in the system.")
        }
        if (students.any { it.email.equals(email.trim(), ignoreCase = true) }) {
            return ActionResult(false, "Email address is already registered.")
        }

        val newUserId = dao.insertUser(
            UserEntity(
                username = username.trim(),
                password = password,
                role = "STUDENT",
                status = "ACTIVE"
            )
        ).toInt()

        dao.insertStudent(
            StudentEntity(
                userId = newUserId,
                name = name.trim(),
                registerNumber = registerNumber.trim().uppercase(Locale.US),
                department = department,
                year = year,
                email = email.trim(),
                phone = phone.trim()
            )
        )

        logActivity(newUserId, name.trim(), "STUDENT", "Student signed up (Reg: $registerNumber)")
        createNotification(newUserId, "Welcome to CampusHive", "Your student account has been created successfully!")
        return ActionResult(true, "Registration successful! You can now log in.")
    }

    suspend fun resetPassword(identifier: String, regNoOrEmail: String, newPassword: String): Boolean {
        val students = dao.getAllStudents()
        val users = dao.getAllUsers()

        val student = students.firstOrNull {
            it.email.equals(regNoOrEmail.trim(), ignoreCase = true) ||
                it.registerNumber.equals(regNoOrEmail.trim(), ignoreCase = true)
        }
        val user = if (student != null) {
            users.firstOrNull { it.id == student.userId }
        } else {
            users.firstOrNull { it.username.equals(identifier.trim(), ignoreCase = true) }
        } ?: return false

        dao.updateUser(user.copy(password = newPassword))
        return true
    }

    suspend fun checkEventConflict(
        venue: String,
        date: String,
        startTime: String,
        endTime: String,
        excludeEventId: Int? = null
    ): Boolean {
        fun toMinutes(t: String): Int {
            val parts = t.split(":")
            val h = parts.getOrNull(0)?.toIntOrNull() ?: 0
            val m = parts.getOrNull(1)?.toIntOrNull() ?: 0
            return h * 60 + m
        }
        val newStart = toMinutes(startTime)
        val newEnd = toMinutes(endTime)
        return dao.getAllEvents().any { ev ->
            if (excludeEventId != null && ev.id == excludeEventId) return@any false
            if (ev.status == "Cancelled" || ev.status == "Rejected") return@any false
            if (ev.venue.trim().equals(venue.trim(), ignoreCase = true) && ev.date == date) {
                val evStart = toMinutes(ev.startTime)
                val evEnd = toMinutes(ev.endTime)
                newStart < evEnd && newEnd > evStart
            } else {
                false
            }
        }
    }

    suspend fun createEvent(
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
        createdBy: Int,
        role: String,
        createdByName: String
    ): ActionResult {
        if (checkEventConflict(venue, date, startTime, endTime)) {
            return ActionResult(false, "Venue is already booked during this time on $date")
        }
        val status = if (role == "ADMIN") "Upcoming" else "Pending"
        val posterKey = when (category.lowercase(Locale.US)) {
            "cultural" -> "cultural"
            "sports" -> "sports"
            "seminar" -> "hero"
            else -> "tech"
        }

        dao.insertEvent(
            EventEntity(
                name = name.trim(),
                description = description.ifBlank { "Exciting college event open to all students." },
                category = category,
                date = date,
                startTime = startTime,
                endTime = endTime,
                venue = venue,
                eventType = eventType,
                organizer = organizer,
                capacity = capacity,
                registeredCount = 0,
                registrationDeadline = registrationDeadline,
                posterKey = posterKey,
                meetingLink = meetingLink,
                status = status,
                createdBy = createdBy,
                createdByName = createdByName
            )
        )

        logActivity(createdBy, createdByName, role, "Created event \"$name\" (Status: $status)")
        if (role == "STAFF") {
            dao.getAllUsers().filter { it.role == "ADMIN" }.forEach { adm ->
                createNotification(adm.id, "New Event Awaiting Approval", "$createdByName submitted \"$name\" for review.")
            }
        }

        val msg = if (role == "ADMIN") "Event created & published successfully!" else "Event submitted for Admin approval."
        return ActionResult(true, msg)
    }

    suspend fun setEventStatus(eventId: Int, status: String, actorId: Int, actorName: String, actorRole: String): ActionResult {
        val ev = dao.getEventById(eventId) ?: return ActionResult(false, "Event not found.")
        dao.updateEvent(ev.copy(status = status))
        logActivity(actorId, actorName, actorRole, "Changed status of \"${ev.name}\" to $status")
        createNotification(ev.createdBy, "Event $status", "Your event \"${ev.name}\" has been marked $status.")
        return ActionResult(true, "Event marked as $status.")
    }

    suspend fun broadcastEventUpdate(eventId: Int, message: String, staffId: Int, staffName: String): ActionResult {
        val ev = dao.getEventById(eventId) ?: return ActionResult(false, "Event not found.")
        val regs = dao.getAllRegistrations().filter { it.eventId == eventId && it.status == "REGISTERED" }
        val students = dao.getAllStudents()
        regs.forEach { reg ->
            students.firstOrNull { it.id == reg.studentId }?.let { st ->
                createNotification(st.userId, "Live Update: ${ev.name}", message.trim())
            }
        }
        logActivity(staffId, staffName, "STAFF", "Broadcasted live update for \"${ev.name}\" to ${regs.size} attendees")
        return ActionResult(true, "Update broadcasted to ${regs.size} registered students.")
    }

    suspend fun registerForEvent(studentId: Int, eventId: Int): ActionResult {
        val ev = dao.getEventById(eventId) ?: return ActionResult(false, "Event not found.")
        val student = dao.getAllStudents().firstOrNull { it.id == studentId } ?: return ActionResult(false, "Student not found.")

        val existing = dao.getAllRegistrations().firstOrNull {
            it.studentId == studentId && it.eventId == eventId && it.status == "REGISTERED"
        }
        if (existing != null) {
            return ActionResult(false, "You are already registered for this event.")
        }

        val today = nowDate()
        if (ev.registrationDeadline.isNotBlank() && today > ev.registrationDeadline) {
            return ActionResult(false, "Registration has closed for this event.")
        }

        val availableSeats = ev.capacity - ev.registeredCount
        if (availableSeats <= 0) {
            val allWaitlist = dao.getAllWaitlist()
            if (allWaitlist.any { it.studentId == studentId && it.eventId == eventId && it.status == "WAITING" }) {
                return ActionResult(false, "You are already on the waiting list for this event.")
            }
            val position = allWaitlist.count { it.eventId == eventId && it.status == "WAITING" } + 1
            dao.insertWaitlist(
                WaitlistEntity(
                    studentId = studentId,
                    eventId = eventId,
                    position = position,
                    status = "WAITING",
                    studentName = student.name
                )
            )
            createNotification(student.userId, "Added to Waitlist", "Event is full. You are #$position on the waiting list for ${ev.name}.")
            return ActionResult(true, "Event full. Added to waiting list at position #$position.", waitlisted = true)
        }

        val regNumCode = student.registerNumber.takeLast(4).ifBlank { "0000" }
        val regId = "REG-2026-$eventId-$regNumCode-${(1000..9999).random()}"

        dao.insertRegistration(
            RegistrationEntity(
                studentId = studentId,
                eventId = eventId,
                registrationId = regId,
                registrationDate = nowTimestamp(),
                status = "REGISTERED",
                studentName = student.name,
                registerNumber = student.registerNumber,
                department = student.department,
                eventName = ev.name,
                eventDate = ev.date,
                venue = ev.venue
            )
        )
        dao.updateEvent(ev.copy(registeredCount = ev.registeredCount + 1))
        logActivity(student.userId, student.name, "STUDENT", "Registered for \"${ev.name}\" (ID: $regId)")
        createNotification(student.userId, "Registration Successful!", "You are confirmed for ${ev.name}. Digital Event Pass generated.")
        createNotification(ev.createdBy, "New Registration", "${student.name} (${student.registerNumber}) registered for ${ev.name}.")
        return ActionResult(true, "Event registration successful! Pass generated.", extraId = regId)
    }

    suspend fun cancelRegistration(studentId: Int, eventId: Int): ActionResult {
        val reg = dao.getAllRegistrations().firstOrNull {
            it.studentId == studentId && it.eventId == eventId && it.status == "REGISTERED"
        } ?: return ActionResult(false, "Active registration not found.")
        val ev = dao.getEventById(eventId) ?: return ActionResult(false, "Event not found.")
        val student = dao.getAllStudents().firstOrNull { it.id == studentId } ?: return ActionResult(false, "Student not found.")

        dao.updateRegistration(reg.copy(status = "CANCELLED"))
        var updatedCount = (ev.registeredCount - 1).coerceAtLeast(0)

        logActivity(student.userId, student.name, "STUDENT", "Cancelled registration for \"${ev.name}\"")
        createNotification(student.userId, "Registration Cancelled", "Your registration for ${ev.name} has been cancelled.")

        val nextWaiting = dao.getAllWaitlist()
            .filter { it.eventId == eventId && it.status == "WAITING" }
            .minByOrNull { it.position }

        var promotedMsg = ""
        if (nextWaiting != null) {
            dao.updateWaitlist(nextWaiting.copy(status = "PROMOTED"))
            val promotedStudent = dao.getAllStudents().firstOrNull { it.id == nextWaiting.studentId }
            if (promotedStudent != null) {
                val regNumCode = promotedStudent.registerNumber.takeLast(4).ifBlank { "0000" }
                val regId = "REG-2026-$eventId-$regNumCode-${(1000..9999).random()}"
                dao.insertRegistration(
                    RegistrationEntity(
                        studentId = promotedStudent.id,
                        eventId = eventId,
                        registrationId = regId,
                        registrationDate = nowTimestamp(),
                        status = "REGISTERED",
                        studentName = promotedStudent.name,
                        registerNumber = promotedStudent.registerNumber,
                        department = promotedStudent.department,
                        eventName = ev.name,
                        eventDate = ev.date,
                        venue = ev.venue
                    )
                )
                updatedCount += 1
                createNotification(
                    promotedStudent.userId,
                    "Waitlist Cleared! Confirmed",
                    "A seat opened up for \"${ev.name}\"! You have been automatically registered. Pass ID: $regId"
                )
                logActivity(promotedStudent.userId, promotedStudent.name, "SYSTEM", "Auto-promoted from waitlist for \"${ev.name}\"")
                promotedMsg = " Waitlisted student automatically promoted."
            }
        }

        dao.updateEvent(ev.copy(registeredCount = updatedCount))
        return ActionResult(true, "Registration cancelled.$promotedMsg")
    }

    suspend fun toggleFavorite(studentId: Int, eventId: Int): Boolean {
        val existing = dao.getFavorite(studentId, eventId)
        return if (existing != null) {
            dao.deleteFavoriteById(existing.id)
            false
        } else {
            dao.insertFavorite(FavoriteEntity(studentId = studentId, eventId = eventId))
            true
        }
    }

    suspend fun checkInStudent(rawQrData: String, staffUserId: Int, staffName: String): CheckInResult {
        var registrationId = rawQrData.trim()
        if (registrationId.contains("|")) {
            registrationId = registrationId.split("|").first().trim()
        }

        val reg = dao.getAllRegistrations().firstOrNull {
            it.registrationId.equals(registrationId, ignoreCase = true) && it.status == "REGISTERED"
        } ?: return CheckInResult(false, "Invalid or cancelled registration pass.")

        val ev = dao.getEventById(reg.eventId) ?: return CheckInResult(false, "Event record not found.")
        val student = dao.getAllStudents().firstOrNull { it.id == reg.studentId }
            ?: return CheckInResult(false, "Student record not found.")

        val existingAtt = dao.getAllAttendance().firstOrNull { it.studentId == student.id && it.eventId == ev.id }
        val ts = nowTimestamp()

        if (existingAtt != null) {
            return if (existingAtt.checkOut.isNullOrBlank()) {
                val updated = existingAtt.copy(checkOut = ts)
                dao.updateAttendance(updated)
                logActivity(staffUserId, staffName, "STAFF", "Recorded exit/checkout for ${student.name} at \"${ev.name}\"")
                CheckInResult(
                    success = true,
                    message = "Check-out recorded for ${student.name} at $ts.",
                    studentName = student.name,
                    eventName = ev.name,
                    checkInTime = existingAtt.checkIn,
                    checkOutTime = ts
                )
            } else {
                CheckInResult(false, "${student.name} has already checked in and checked out for this event.")
            }
        }

        dao.insertAttendance(
            AttendanceEntity(
                studentId = student.id,
                eventId = ev.id,
                checkIn = ts,
                status = "Present",
                studentName = student.name,
                registerNumber = student.registerNumber,
                department = student.department
            )
        )

        issueCertificate(student.id, ev.id)
        logActivity(staffUserId, staffName, "STAFF", "Marked attendance (Present) for ${student.name} at \"${ev.name}\"")
        createNotification(student.userId, "Check-in Confirmed!", "You have been checked in for \"${ev.name}\" at $ts.")

        return CheckInResult(
            success = true,
            message = "Check-in Successful! Marked Present for ${student.name}.",
            studentName = student.name,
            eventName = ev.name,
            checkInTime = ts
        )
    }

    suspend fun issueCertificate(studentId: Int, eventId: Int): CertificateEntity {
        val existing = dao.getAllCertificates().firstOrNull { it.studentId == studentId && it.eventId == eventId }
        if (existing != null) return existing

        val student = dao.getAllStudents().firstOrNull { it.id == studentId }
        val ev = dao.getEventById(eventId)
        val certId = "CERT-COL-2026-$studentId-$eventId-${(1000..9999).random()}"

        val newCert = CertificateEntity(
            studentId = studentId,
            eventId = eventId,
            certificateId = certId,
            issueDate = nowDate(),
            status = "VALID",
            studentName = student?.name ?: "Student",
            eventName = ev?.name ?: "College Event",
            eventDate = ev?.date ?: "2026-10-01",
            organizer = ev?.organizer ?: "College Event Committee"
        )
        dao.insertCertificate(newCert)
        if (student != null) {
            createNotification(student.userId, "Certificate Ready!", "Your certificate for ${ev?.name ?: "Event"} has been generated.")
        }
        return newCert
    }

    suspend fun verifyCertificate(certId: String): CertificateEntity? {
        return dao.findCertificateByCode(certId)
    }

    suspend fun submitFeedback(studentId: Int, eventId: Int, rating: Int, comment: String): ActionResult {
        val existing = dao.getAllFeedback().firstOrNull { it.studentId == studentId && it.eventId == eventId }
        if (existing != null) {
            return ActionResult(false, "You have already submitted feedback for this event.")
        }
        val student = dao.getAllStudents().firstOrNull { it.id == studentId }
        dao.insertFeedback(
            FeedbackEntity(
                studentId = studentId,
                eventId = eventId,
                rating = rating,
                comment = comment.trim(),
                date = nowTimestamp(),
                studentName = student?.name ?: "Student"
            )
        )
        return ActionResult(true, "Thank you! Your feedback has been submitted.")
    }

    suspend fun addStaff(
        name: String,
        staffId: String,
        department: String,
        email: String,
        phone: String,
        username: String,
        password: String
    ): ActionResult {
        if (dao.getAllUsers().any { it.username.equals(username.trim(), ignoreCase = true) }) {
            return ActionResult(false, "Username is already taken.")
        }
        val userId = dao.insertUser(
            UserEntity(
                username = username.trim(),
                password = password,
                role = "STAFF",
                status = "ACTIVE"
            )
        ).toInt()

        dao.insertStaff(
            StaffEntity(
                userId = userId,
                name = name.trim(),
                staffId = staffId.trim(),
                department = department.trim(),
                email = email.trim(),
                phone = phone.trim(),
                status = "ACTIVE"
            )
        )
        return ActionResult(true, "Staff account created for $name.")
    }

    suspend fun toggleStaffStatus(staffRecordId: Int) {
        val stf = dao.getAllStaff().firstOrNull { it.id == staffRecordId } ?: return
        val nextStatus = if (stf.status == "ACTIVE") "INACTIVE" else "ACTIVE"
        dao.updateStaff(stf.copy(status = nextStatus))
        dao.getAllUsers().firstOrNull { it.id == stf.userId }?.let { u ->
            dao.updateUser(u.copy(status = nextStatus))
        }
    }

    suspend fun updateStudentProfile(studentId: Int, email: String, phone: String): StudentEntity? {
        val student = dao.getAllStudents().firstOrNull { it.id == studentId } ?: return null
        val updated = student.copy(email = email.trim(), phone = phone.trim())
        dao.updateStudent(updated)
        return updated
    }
}
