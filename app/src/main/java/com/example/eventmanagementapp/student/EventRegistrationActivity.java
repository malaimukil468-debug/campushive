package com.example.eventmanagementapp.student;

import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class EventRegistrationActivity extends AppCompatActivity {

    private TextView tvStudentName, tvRegisterNumber, tvEventName, tvEventDate, tvVenue;
    private Button btnConfirmRegistration, btnCancel;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private int eventId;
    private String eventName, eventDate, venue;
    private int capacity, registeredCount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_registration);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        eventId = getIntent().getIntExtra("eventId", -1);
        eventName = getIntent().getStringExtra("eventName");
        eventDate = getIntent().getStringExtra("eventDate");
        venue = getIntent().getStringExtra("venue");
        capacity = getIntent().getIntExtra("capacity", 100);
        registeredCount = getIntent().getIntExtra("registeredCount", 0);

        tvStudentName = findViewById(R.id.tvRegStudentName);
        tvRegisterNumber = findViewById(R.id.tvRegStudentRegNo);
        tvEventName = findViewById(R.id.tvRegEventName);
        tvEventDate = findViewById(R.id.tvRegEventDate);
        tvVenue = findViewById(R.id.tvRegVenue);
        btnConfirmRegistration = findViewById(R.id.btnConfirmRegistration);
        btnCancel = findViewById(R.id.btnCancel);

        tvStudentName.setText("Student Name: " + session.getName());
        tvRegisterNumber.setText("Register No: " + session.getRegNumber());
        tvEventName.setText("Event: " + eventName);
        tvEventDate.setText("Date: " + eventDate);
        tvVenue.setText("Venue: " + venue);

        btnConfirmRegistration.setOnClickListener(v -> confirmRegistration());
        btnCancel.setOnClickListener(v -> finish());
    }

    private void confirmRegistration() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // 1. Prevent duplicate registration
        Cursor cCheck = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_REGISTRATIONS +
                " WHERE student_id = ? AND event_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(studentId), String.valueOf(eventId)});
        if (cCheck.moveToFirst()) {
            cCheck.close();
            Toast.makeText(this, "You are already registered for this event.", Toast.LENGTH_LONG).show();
            return;
        }
        cCheck.close();

        // 2. Capacity Check
        int available = capacity - registeredCount;
        if (available <= 0) {
            // Add to waitlist
            Cursor cWait = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_WAITLIST + " WHERE event_id = ? AND status = 'WAITING'", new String[]{String.valueOf(eventId)});
            int position = 1;
            if (cWait.moveToFirst()) position = cWait.getInt(0) + 1;
            cWait.close();

            ContentValues cvWait = new ContentValues();
            cvWait.put("student_id", studentId);
            cvWait.put("event_id", eventId);
            cvWait.put("position", position);
            cvWait.put("status", "WAITING");
            db.insert(DatabaseHelper.TABLE_WAITLIST, null, cvWait);

            new AlertDialog.Builder(this)
                    .setTitle("Event is Full ℹ️")
                    .setMessage("You have been placed on the Waiting List at position #" + position + ". If someone cancels, you will be auto-promoted!")
                    .setPositiveButton("OK", (dialog, which) -> finish())
                    .show();
            return;
        }

        // 3. Register Student
        String regId = "REG-2026-" + eventId + "-" + (session.getRegNumber().length() > 4 ? session.getRegNumber().substring(session.getRegNumber().length() - 4) : "0000") + "-" + (int)(1000 + Math.random() * 9000);
        String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());

        ContentValues cv = new ContentValues();
        cv.put("student_id", studentId);
        cv.put("event_id", eventId);
        cv.put("registration_id", regId);
        cv.put("registration_date", nowTime);
        cv.put("status", "REGISTERED");
        db.insert(DatabaseHelper.TABLE_REGISTRATIONS, null, cv);

        // Add Notification in SQLite
        ContentValues cvNotif = new ContentValues();
        cvNotif.put("user_id", session.getUserId());
        cvNotif.put("title", "Registration Confirmed! 🎉");
        cvNotif.put("message", "Pass ID: " + regId + " for " + eventName);
        cvNotif.put("date", nowTime.substring(0, 16));
        cvNotif.put("is_read", 0);
        db.insert(DatabaseHelper.TABLE_NOTIFICATIONS, null, cvNotif);

        dbHelper.logActivity(session.getUserId(), "Registered for " + eventName + " (ID: " + regId + ")");

        // Fire System Push Notification via NotificationManager & schedule alarms
        com.example.eventmanagementapp.utils.NotificationHelper.sendRegistrationConfirmationNotification(
                this, eventName, regId, eventDate, venue, eventId
        );
        com.example.eventmanagementapp.utils.NotificationHelper.scheduleEventReminders(
                this, eventId, eventName, eventDate, "09:30", venue
        );

        new AlertDialog.Builder(this)
                .setTitle("Registration Successful! 🎟️")
                .setMessage("Your Digital Event Pass has been generated.\nRegistration ID: " + regId)
                .setPositiveButton("View Pass", (dialog, which) -> {
                    finish();
                    startActivity(new Intent(EventRegistrationActivity.this, DigitalPassActivity.class));
                })
                .setNegativeButton("Back", (dialog, which) -> finish())
                .setCancelable(false)
                .show();
    }
}
