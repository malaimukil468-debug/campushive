package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
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

public class EventDetailsActivity extends AppCompatActivity {

    private TextView tvName, tvCategory, tvDate, tvTime, tvVenue, tvOrganizer, tvCapacity, tvAvailable, tvDesc, tvDeadline, tvMeetingLink;
    private Button btnRegister, btnToggleFavorite, btnShare, btnJoinMeeting, btnBack;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private int eventId;
    private String eventName = "", eventDate = "", venue = "", organizer = "", meetingUrl = "";
    private int capacity = 0, registeredCount = 0;
    private String deadline = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_details);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        eventId = getIntent().getIntExtra("eventId", -1);

        tvName = findViewById(R.id.tvDetailName);
        tvCategory = findViewById(R.id.tvDetailCategory);
        tvDate = findViewById(R.id.tvDetailDate);
        tvTime = findViewById(R.id.tvDetailTime);
        tvVenue = findViewById(R.id.tvDetailVenue);
        tvOrganizer = findViewById(R.id.tvDetailOrganizer);
        tvCapacity = findViewById(R.id.tvDetailCapacity);
        tvAvailable = findViewById(R.id.tvDetailAvailable);
        tvDesc = findViewById(R.id.tvDetailDesc);
        tvDeadline = findViewById(R.id.tvDetailDeadline);
        tvMeetingLink = findViewById(R.id.tvMeetingLink);

        btnRegister = findViewById(R.id.btnRegister);
        btnToggleFavorite = findViewById(R.id.btnToggleFavorite);
        btnShare = findViewById(R.id.btnShare);
        btnJoinMeeting = findViewById(R.id.btnJoinMeeting);
        btnBack = findViewById(R.id.btnBack);

        loadEventDetails();

        btnRegister.setOnClickListener(v -> handleRegistration());
        btnToggleFavorite.setOnClickListener(v -> toggleFavorite());
        btnShare.setOnClickListener(v -> shareEvent());
        btnJoinMeeting.setOnClickListener(v -> {
            if (!meetingUrl.isEmpty()) {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(meetingUrl)));
            }
        });
        btnBack.setOnClickListener(v -> finish());
    }

    private void loadEventDetails() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT name, description, category, date, start_time, end_time, venue, organizer, capacity, registration_deadline, meeting_link FROM " +
                DatabaseHelper.TABLE_EVENTS + " WHERE id = ?", new String[]{String.valueOf(eventId)});

        if (cursor.moveToFirst()) {
            eventName = cursor.getString(0);
            String desc = cursor.getString(1);
            String cat = cursor.getString(2);
            eventDate = cursor.getString(3);
            String startTime = cursor.getString(4);
            String endTime = cursor.getString(5);
            venue = cursor.getString(6);
            organizer = cursor.getString(7);
            capacity = cursor.getInt(8);
            deadline = cursor.getString(9);
            meetingUrl = cursor.getString(10);
            cursor.close();

            tvName.setText(eventName);
            tvDesc.setText(desc);
            tvCategory.setText(cat);
            tvDate.setText("Date: " + eventDate);
            tvTime.setText("Time: " + startTime + " - " + endTime);
            tvVenue.setText("Venue: " + venue);
            tvOrganizer.setText("Organizer: " + organizer);
            tvCapacity.setText("Capacity: " + capacity);
            tvDeadline.setText("Deadline: " + deadline);

            if (meetingUrl != null && !meetingUrl.isEmpty()) {
                btnJoinMeeting.setVisibility(View.VISIBLE);
            }

            // Calculate registered count
            Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS +
                    " WHERE event_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(eventId)});
            if (cReg.moveToFirst()) {
                registeredCount = cReg.getInt(0);
            }
            cReg.close();

            int available = Math.max(0, capacity - registeredCount);
            if (available <= 0) {
                tvAvailable.setText("Status: FULL (Waitlist Open)");
                btnRegister.setText("Join Waiting List");
            } else {
                tvAvailable.setText("Available Seats: " + available + " / " + capacity);
                btnRegister.setText("Register for Event");
            }

            // Check if student already registered
            int studentId = session.getStudentId();
            Cursor cUserReg = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_REGISTRATIONS +
                    " WHERE student_id = ? AND event_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(studentId), String.valueOf(eventId)});
            if (cUserReg.moveToFirst()) {
                btnRegister.setText("Already Registered ✅");
                btnRegister.setEnabled(false);
            }
            cUserReg.close();

            // Deadline check
            String today = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
            if (deadline != null && !deadline.isEmpty() && today.compareTo(deadline) > 0) {
                btnRegister.setText("Registration Closed");
                btnRegister.setEnabled(false);
            }
        } else {
            cursor.close();
            Toast.makeText(this, "Event not found.", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    private void handleRegistration() {
        Intent intent = new Intent(this, EventRegistrationActivity.class);
        intent.putExtra("eventId", eventId);
        intent.putExtra("eventName", eventName);
        intent.putExtra("eventDate", eventDate);
        intent.putExtra("venue", venue);
        intent.putExtra("capacity", capacity);
        intent.putExtra("registeredCount", registeredCount);
        startActivity(intent);
    }

    private void toggleFavorite() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        Cursor c = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_FAVORITES + " WHERE student_id = ? AND event_id = ?", new String[]{String.valueOf(studentId), String.valueOf(eventId)});
        if (c.moveToFirst()) {
            int favId = c.getInt(0);
            c.close();
            db.delete(DatabaseHelper.TABLE_FAVORITES, "id = ?", new String[]{String.valueOf(favId)});
            Toast.makeText(this, "Removed from Favorites.", Toast.LENGTH_SHORT).show();
        } else {
            c.close();
            db.execSQL("INSERT INTO " + DatabaseHelper.TABLE_FAVORITES + " (student_id, event_id) VALUES (?, ?)", new Object[]{studentId, eventId});
            Toast.makeText(this, "Added to Favorites ⭐", Toast.LENGTH_SHORT).show();
        }
    }

    private void shareEvent() {
        String msg = "College Event: " + eventName + "\nDate: " + eventDate + "\nVenue: " + venue + "\nOrganizer: " + organizer;
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, msg);
        sendIntent.setType("text/plain");
        startActivity(Intent.createChooser(sendIntent, "Share Event"));
    }
}
