package com.example.eventmanagementapp.staff;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.ContentValues;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;
import java.util.Calendar;
import java.util.Locale;

public class CreateEventActivity extends AppCompatActivity {

    private EditText etEventName, etDescription, etDate, etStartTime, etEndTime, etVenue, etCapacity, etDeadline, etOrganizer, etMeetingLink;
    private Spinner spCategory, spEventType;
    private Button btnCreateEvent, btnCancel;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_event);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        etEventName = findViewById(R.id.etEventName);
        etDescription = findViewById(R.id.etDescription);
        etDate = findViewById(R.id.etDate);
        etStartTime = findViewById(R.id.etStartTime);
        etEndTime = findViewById(R.id.etEndTime);
        etVenue = findViewById(R.id.etVenue);
        etCapacity = findViewById(R.id.etCapacity);
        etDeadline = findViewById(R.id.etDeadline);
        etOrganizer = findViewById(R.id.etOrganizer);
        etMeetingLink = findViewById(R.id.etMeetingLink);
        spCategory = findViewById(R.id.spCategory);
        spEventType = findViewById(R.id.spEventType);
        btnCreateEvent = findViewById(R.id.btnCreateEvent);
        btnCancel = findViewById(R.id.btnCancel);

        // Spinners
        String[] categories = {"Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium", "Other"};
        spCategory.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories));

        String[] types = {"Offline", "Online", "Hybrid"};
        spEventType.setAdapter(new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, types));

        setupPickers();

        btnCreateEvent.setOnClickListener(v -> saveEvent());
        btnCancel.setOnClickListener(v -> finish());
    }

    private void setupPickers() {
        Calendar cal = Calendar.getInstance();

        etDate.setOnClickListener(v -> {
            new DatePickerDialog(this, (view, year, month, day) -> {
                String d = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                etDate.setText(d);
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
        });

        etDeadline.setOnClickListener(v -> {
            new DatePickerDialog(this, (view, year, month, day) -> {
                String d = String.format(Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                etDeadline.setText(d);
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
        });

        etStartTime.setOnClickListener(v -> {
            new TimePickerDialog(this, (view, hour, minute) -> {
                etStartTime.setText(String.format(Locale.getDefault(), "%02d:%02d", hour, minute));
            }, 10, 0, true).show();
        });

        etEndTime.setOnClickListener(v -> {
            new TimePickerDialog(this, (view, hour, minute) -> {
                etEndTime.setText(String.format(Locale.getDefault(), "%02d:%02d", hour, minute));
            }, 16, 0, true).show();
        });
    }

    private void saveEvent() {
        String name = etEventName.getText().toString().trim();
        String desc = etDescription.getText().toString().trim();
        String category = spCategory.getSelectedItem().toString();
        String date = etDate.getText().toString().trim();
        String start = etStartTime.getText().toString().trim();
        String end = etEndTime.getText().toString().trim();
        String venue = etVenue.getText().toString().trim();
        String type = spEventType.getSelectedItem().toString();
        String capStr = etCapacity.getText().toString().trim();
        String deadline = etDeadline.getText().toString().trim();
        String organizer = etOrganizer.getText().toString().trim();
        String link = etMeetingLink.getText().toString().trim();

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(date) || TextUtils.isEmpty(start) ||
                TextUtils.isEmpty(end) || TextUtils.isEmpty(venue) || TextUtils.isEmpty(capStr)) {
            Toast.makeText(this, "Please fill in all mandatory fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        int capacity = Integer.parseInt(capStr);
        if (capacity <= 0) {
            etCapacity.setError("Capacity must be greater than zero");
            return;
        }

        if (deadline.compareTo(date) > 0) {
            Toast.makeText(this, "Registration deadline cannot be after event date.", Toast.LENGTH_SHORT).show();
            return;
        }

        // Venue conflict detection
        if (dbHelper.hasVenueConflict(venue, date, start, end, 0)) {
            Toast.makeText(this, "Venue is already booked during this time on " + date, Toast.LENGTH_LONG).show();
            return;
        }

        // Staff creates Pending, Admin creates Upcoming/Approved
        String status = "ADMIN".equalsIgnoreCase(session.getUserRole()) ? "Upcoming" : "Pending";

        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("name", name);
        cv.put("description", desc);
        cv.put("category", category);
        cv.put("date", date);
        cv.put("start_time", start);
        cv.put("end_time", end);
        cv.put("venue", venue);
        cv.put("event_type", type);
        cv.put("capacity", capacity);
        cv.put("registration_deadline", deadline);
        cv.put("organizer", organizer);
        cv.put("meeting_link", link);
        cv.put("status", status);
        cv.put("created_by", session.getUserId());

        db.insert(DatabaseHelper.TABLE_EVENTS, null, cv);
        dbHelper.logActivity(session.getUserId(), "Created event: " + name + " (Status: " + status + ")");

        Toast.makeText(this, "ADMIN".equalsIgnoreCase(session.getUserRole()) ? "Event created and published!" : "Event submitted for Admin approval.", Toast.LENGTH_LONG).show();
        finish();
    }
}
