package com.example.eventmanagementapp.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {
    // Flows for reactive UI
    @Query("SELECT * FROM users")
    fun observeUsers(): Flow<List<UserEntity>>

    @Query("SELECT * FROM students")
    fun observeStudents(): Flow<List<StudentEntity>>

    @Query("SELECT * FROM staff")
    fun observeStaff(): Flow<List<StaffEntity>>

    @Query("SELECT * FROM events ORDER BY date ASC")
    fun observeEvents(): Flow<List<EventEntity>>

    @Query("SELECT * FROM registrations ORDER BY id DESC")
    fun observeRegistrations(): Flow<List<RegistrationEntity>>

    @Query("SELECT * FROM waitlist ORDER BY position ASC")
    fun observeWaitlist(): Flow<List<WaitlistEntity>>

    @Query("SELECT * FROM favorites")
    fun observeFavorites(): Flow<List<FavoriteEntity>>

    @Query("SELECT * FROM attendance ORDER BY id DESC")
    fun observeAttendance(): Flow<List<AttendanceEntity>>

    @Query("SELECT * FROM feedback ORDER BY id DESC")
    fun observeFeedback(): Flow<List<FeedbackEntity>>

    @Query("SELECT * FROM certificates ORDER BY id DESC")
    fun observeCertificates(): Flow<List<CertificateEntity>>

    @Query("SELECT * FROM notifications ORDER BY id DESC")
    fun observeNotifications(): Flow<List<NotificationEntity>>

    @Query("SELECT * FROM activity_logs ORDER BY id DESC")
    fun observeActivityLogs(): Flow<List<ActivityLogEntity>>

    // Direct queries
    @Query("SELECT COUNT(*) FROM users")
    suspend fun getUserCount(): Int

    @Query("SELECT * FROM users")
    suspend fun getAllUsers(): List<UserEntity>

    @Query("SELECT * FROM students")
    suspend fun getAllStudents(): List<StudentEntity>

    @Query("SELECT * FROM staff")
    suspend fun getAllStaff(): List<StaffEntity>

    @Query("SELECT * FROM events")
    suspend fun getAllEvents(): List<EventEntity>

    @Query("SELECT * FROM events WHERE id = :id LIMIT 1")
    suspend fun getEventById(id: Int): EventEntity?

    @Query("SELECT * FROM registrations")
    suspend fun getAllRegistrations(): List<RegistrationEntity>

    @Query("SELECT * FROM waitlist")
    suspend fun getAllWaitlist(): List<WaitlistEntity>

    @Query("SELECT * FROM favorites WHERE studentId = :studentId AND eventId = :eventId LIMIT 1")
    suspend fun getFavorite(studentId: Int, eventId: Int): FavoriteEntity?

    @Query("SELECT * FROM attendance")
    suspend fun getAllAttendance(): List<AttendanceEntity>

    @Query("SELECT * FROM feedback")
    suspend fun getAllFeedback(): List<FeedbackEntity>

    @Query("SELECT * FROM certificates")
    suspend fun getAllCertificates(): List<CertificateEntity>

    @Query("SELECT * FROM certificates WHERE UPPER(TRIM(certificateId)) = UPPER(TRIM(:certId)) LIMIT 1")
    suspend fun findCertificateByCode(certId: String): CertificateEntity?

    // Inserts & Updates
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUsers(users: List<UserEntity>)

    @Update
    suspend fun updateUser(user: UserEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudent(student: StudentEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStudents(students: List<StudentEntity>)

    @Update
    suspend fun updateStudent(student: StudentEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStaff(staff: StaffEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStaffList(staff: List<StaffEntity>)

    @Update
    suspend fun updateStaff(staff: StaffEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvent(event: EventEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvents(events: List<EventEntity>)

    @Update
    suspend fun updateEvent(event: EventEntity)

    @Query("DELETE FROM events WHERE id = :eventId")
    suspend fun deleteEventById(eventId: Int)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRegistration(registration: RegistrationEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRegistrations(registrations: List<RegistrationEntity>)

    @Update
    suspend fun updateRegistration(registration: RegistrationEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertWaitlist(waitlist: WaitlistEntity): Long

    @Update
    suspend fun updateWaitlist(waitlist: WaitlistEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFavorite(favorite: FavoriteEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFavorites(favorites: List<FavoriteEntity>)

    @Query("DELETE FROM favorites WHERE id = :id")
    suspend fun deleteFavoriteById(id: Int)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAttendance(attendance: AttendanceEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAttendanceList(list: List<AttendanceEntity>)

    @Update
    suspend fun updateAttendance(attendance: AttendanceEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFeedback(feedback: FeedbackEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFeedbackList(list: List<FeedbackEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCertificate(certificate: CertificateEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCertificates(list: List<CertificateEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotification(notification: NotificationEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertNotifications(list: List<NotificationEntity>)

    @Query("UPDATE notifications SET isRead = 1 WHERE id = :id")
    suspend fun markNotificationRead(id: Int)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivityLog(log: ActivityLogEntity): Long

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivityLogs(list: List<ActivityLogEntity>)

    // Clear all tables for Factory Reset
    @Query("DELETE FROM users") suspend fun clearUsers()
    @Query("DELETE FROM students") suspend fun clearStudents()
    @Query("DELETE FROM staff") suspend fun clearStaff()
    @Query("DELETE FROM events") suspend fun clearEvents()
    @Query("DELETE FROM registrations") suspend fun clearRegistrations()
    @Query("DELETE FROM waitlist") suspend fun clearWaitlist()
    @Query("DELETE FROM favorites") suspend fun clearFavorites()
    @Query("DELETE FROM attendance") suspend fun clearAttendance()
    @Query("DELETE FROM feedback") suspend fun clearFeedback()
    @Query("DELETE FROM certificates") suspend fun clearCertificates()
    @Query("DELETE FROM notifications") suspend fun clearNotifications()
    @Query("DELETE FROM activity_logs") suspend fun clearActivityLogs()
}
