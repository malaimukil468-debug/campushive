package com.example.eventmanagementapp.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val username: String,
    val password: String,
    val role: String, // "ADMIN", "STAFF", "STUDENT"
    val status: String = "ACTIVE" // "ACTIVE", "INACTIVE"
)

@Entity(tableName = "students")
data class StudentEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val name: String,
    val registerNumber: String,
    val department: String,
    val year: String,
    val email: String,
    val phone: String
)

@Entity(tableName = "staff")
data class StaffEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val name: String,
    val staffId: String,
    val department: String,
    val email: String,
    val phone: String,
    val status: String = "ACTIVE"
)

@Entity(tableName = "events")
data class EventEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val description: String,
    val category: String, // Technical, Cultural, Sports, Workshop, Seminar, Symposium, Other
    val date: String, // YYYY-MM-DD
    val startTime: String, // HH:mm
    val endTime: String, // HH:mm
    val venue: String,
    val eventType: String, // Online, Offline, Hybrid
    val organizer: String,
    val capacity: Int,
    val registeredCount: Int,
    val registrationDeadline: String, // YYYY-MM-DD
    val posterKey: String,
    val meetingLink: String = "",
    val status: String, // Pending, Approved, Upcoming, Ongoing, Completed, Cancelled, Rejected
    val createdBy: Int,
    val createdByName: String
)

@Entity(tableName = "registrations")
data class RegistrationEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int,
    val registrationId: String,
    val registrationDate: String,
    val status: String, // REGISTERED, CANCELLED
    val studentName: String,
    val registerNumber: String,
    val department: String,
    val eventName: String,
    val eventDate: String,
    val venue: String
)

@Entity(tableName = "waitlist")
data class WaitlistEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int,
    val position: Int,
    val status: String, // WAITING, PROMOTED, CANCELLED
    val studentName: String
)

@Entity(tableName = "favorites")
data class FavoriteEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int
)

@Entity(tableName = "attendance")
data class AttendanceEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int,
    val checkIn: String,
    val checkOut: String? = null,
    val status: String, // Present, Absent
    val studentName: String,
    val registerNumber: String,
    val department: String
)

@Entity(tableName = "feedback")
data class FeedbackEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int,
    val rating: Int,
    val comment: String,
    val date: String,
    val studentName: String
)

@Entity(tableName = "certificates")
data class CertificateEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val studentId: Int,
    val eventId: Int,
    val certificateId: String,
    val issueDate: String,
    val status: String, // VALID, REVOKED
    val studentName: String,
    val eventName: String,
    val eventDate: String,
    val organizer: String
)

@Entity(tableName = "notifications")
data class NotificationEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int, // 0 = broadcast
    val title: String,
    val message: String,
    val date: String,
    val isRead: Boolean = false
)

@Entity(tableName = "activity_logs")
data class ActivityLogEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val userId: Int,
    val userName: String,
    val role: String,
    val action: String,
    val date: String,
    val time: String
)
