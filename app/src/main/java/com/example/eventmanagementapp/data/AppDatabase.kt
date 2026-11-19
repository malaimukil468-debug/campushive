package com.example.eventmanagementapp.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        UserEntity::class,
        StudentEntity::class,
        StaffEntity::class,
        EventEntity::class,
        RegistrationEntity::class,
        WaitlistEntity::class,
        FavoriteEntity::class,
        AttendanceEntity::class,
        FeedbackEntity::class,
        CertificateEntity::class,
        NotificationEntity::class,
        ActivityLogEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun appDao(): AppDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "CollegeEventDB.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
