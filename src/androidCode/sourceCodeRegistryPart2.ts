import { AndroidSourceFile } from './sourceCodeRegistry';

export const ANDROID_PROJECT_FILES_PART2: AndroidSourceFile[] = [
  // 1. EVENT ITEM MODEL
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/model/EventItem.java',
    category: 'model',
    title: 'EventItem.java',
    description: 'POJO model representing a college event with capacity, venue, time, and status attributes',
    content: `package com.example.eventmanagementapp.model;

public class EventItem {
    private int id;
    private String name;
    private String description;
    private String category;
    private String date;
    private String startTime;
    private String endTime;
    private String venue;
    private String organizer;
    private int capacity;
    private int registeredCount;
    private String status;

    public EventItem(int id, String name, String description, String category, String date,
                     String startTime, String endTime, String venue, String organizer, int capacity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.organizer = organizer;
        this.capacity = capacity;
        this.status = "Upcoming";
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getDate() { return date; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getVenue() { return venue; }
    public String getOrganizer() { return organizer; }
    public int getCapacity() { return capacity; }
    public int getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(int registeredCount) { this.registeredCount = registeredCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getAvailableSeats() {
        return Math.max(0, capacity - registeredCount);
    }
}
`
  },

  // 2. EVENT ADAPTER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/adapter/EventAdapter.java',
    category: 'adapter',
    title: 'EventAdapter.java',
    description: 'RecyclerView Adapter binding college events with live available seat counts and status pills',
    content: `package com.example.eventmanagementapp.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.model.EventItem;
import java.util.List;

public class EventAdapter extends RecyclerView.Adapter<EventAdapter.EventViewHolder> {

    public interface OnEventClickListener {
        void onEventClick(EventItem event);
    }

    private Context context;
    private List<EventItem> eventList;
    private OnEventClickListener listener;

    public EventAdapter(Context context, List<EventItem> eventList, OnEventClickListener listener) {
        this.context = context;
        this.eventList = eventList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_event, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
        EventItem event = eventList.get(position);
        holder.tvEventName.setText(event.getName());
        holder.tvCategory.setText(event.getCategory());
        holder.tvDate.setText("📅 " + event.getDate() + " | " + event.getStartTime());
        holder.tvVenue.setText("📍 " + event.getVenue());

        int available = event.getAvailableSeats();
        if (available <= 0) {
            holder.tvAvailableSeats.setText("FULL (Waitlist)");
            holder.tvAvailableSeats.setTextColor(Color.RED);
        } else {
            holder.tvAvailableSeats.setText(available + " Seats Left");
            holder.tvAvailableSeats.setTextColor(Color.parseColor("#059669"));
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onEventClick(event);
        });
    }

    @Override
    public int getItemCount() {
        return eventList.size();
    }

    public static class EventViewHolder extends RecyclerView.ViewHolder {
        TextView tvEventName, tvCategory, tvDate, tvVenue, tvAvailableSeats;

        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            tvEventName = itemView.findViewById(R.id.tvEventName);
            tvCategory = itemView.findViewById(R.id.tvCategory);
            tvDate = itemView.findViewById(R.id.tvDate);
            tvVenue = itemView.findViewById(R.id.tvVenue);
            tvAvailableSeats = itemView.findViewById(R.id.tvAvailableSeats);
        }
    }
}
`
  },

  // 3. EVENT APPROVAL ADAPTER (ADMIN)
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/adapter/EventApprovalAdapter.java',
    category: 'adapter',
    title: 'EventApprovalAdapter.java',
    description: 'Admin adapter for reviewing pending staff events with Approve and Reject buttons',
    content: `package com.example.eventmanagementapp.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.model.EventItem;
import java.util.List;

public class EventApprovalAdapter extends RecyclerView.Adapter<EventApprovalAdapter.ApprovalViewHolder> {

    public interface OnApprovalListener {
        void onApprove(EventItem event);
        void onReject(EventItem event);
    }

    private Context context;
    private List<EventItem> list;
    private OnApprovalListener listener;

    public EventApprovalAdapter(Context context, List<EventItem> list, OnApprovalListener listener) {
        this.context = context;
        this.list = list;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ApprovalViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_event_approval, parent, false);
        return new ApprovalViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ApprovalViewHolder holder, int position) {
        EventItem item = list.get(position);
        holder.tvTitle.setText(item.getName());
        holder.tvDetails.setText("Date: " + item.getDate() + " " + item.getStartTime() + "\\nVenue: " + item.getVenue() + "\\nOrganizer: " + item.getOrganizer());

        holder.btnApprove.setOnClickListener(v -> {
            if (listener != null) listener.onApprove(item);
        });

        holder.btnReject.setOnClickListener(v -> {
            if (listener != null) listener.onReject(item);
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ApprovalViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvDetails;
        Button btnApprove, btnReject;

        public ApprovalViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDetails = itemView.findViewById(R.id.tvDetails);
            btnApprove = itemView.findViewById(R.id.btnApprove);
            btnReject = itemView.findViewById(R.id.btnReject);
        }
    }
}
`
  },

  // 4. EVENT DETAILS ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/student/EventDetailsActivity.java',
    category: 'student',
    title: 'EventDetailsActivity.java',
    description: 'Displays full event specifics, available seats calculation, deadline check, and registration trigger',
    content: `package com.example.eventmanagementapp.student;

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
        String msg = "College Event: " + eventName + "\\nDate: " + eventDate + "\\nVenue: " + venue + "\\nOrganizer: " + organizer;
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, msg);
        sendIntent.setType("text/plain");
        startActivity(Intent.createChooser(sendIntent, "Share Event"));
    }
}
`
  },

  // 5. EVENT REGISTRATION ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/student/EventRegistrationActivity.java',
    category: 'student',
    title: 'EventRegistrationActivity.java',
    description: 'Confirmation dialog screen, unique registration ID generation, pass creation, and waitlist handling',
    content: `package com.example.eventmanagementapp.student;

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
                .setMessage("Your Digital Event Pass has been generated.\\nRegistration ID: " + regId)
                .setPositiveButton("View Pass", (dialog, which) -> {
                    finish();
                    startActivity(new Intent(EventRegistrationActivity.this, DigitalPassActivity.class));
                })
                .setNegativeButton("Back", (dialog, which) -> finish())
                .setCancelable(false)
                .show();
    }
}
`
  },

  // 6. STAFF DASHBOARD ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/staff/StaffDashboardActivity.java',
    category: 'staff',
    title: 'StaffDashboardActivity.java',
    description: 'Staff command center showing total events, registrations, attendance rate, and feature shortcuts',
    content: `package com.example.eventmanagementapp.staff;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class StaffDashboardActivity extends AppCompatActivity {

    private TextView tvStaffName, tvTotalEvents, tvUpcomingEvents, tvTotalRegs, tvAttendanceCount;
    private CardView cardCreateEvent, cardManageEvents, cardStudentList, cardRegManagement, cardAttendance, cardReports, cardFeedback;
    private Button btnLogout;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_staff_dashboard);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStaffName = findViewById(R.id.tvStaffName);
        tvTotalEvents = findViewById(R.id.tvTotalEvents);
        tvUpcomingEvents = findViewById(R.id.tvUpcomingEvents);
        tvTotalRegs = findViewById(R.id.tvTotalRegs);
        tvAttendanceCount = findViewById(R.id.tvAttendanceCount);

        cardCreateEvent = findViewById(R.id.cardCreateEvent);
        cardManageEvents = findViewById(R.id.cardManageEvents);
        cardStudentList = findViewById(R.id.cardStudentList);
        cardRegManagement = findViewById(R.id.cardRegManagement);
        cardAttendance = findViewById(R.id.cardAttendance);
        cardReports = findViewById(R.id.cardReports);
        cardFeedback = findViewById(R.id.cardFeedback);
        btnLogout = findViewById(R.id.btnLogout);

        tvStaffName.setText(session.getName());

        setupNavigation();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshStats();
    }

    private void refreshStats() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        Cursor c1 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS, null);
        if (c1.moveToFirst()) tvTotalEvents.setText(String.valueOf(c1.getInt(0)));
        c1.close();

        Cursor c2 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Upcoming' OR status = 'Approved'", null);
        if (c2.moveToFirst()) tvUpcomingEvents.setText(String.valueOf(c2.getInt(0)));
        c2.close();

        Cursor c3 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " WHERE status = 'REGISTERED'", null);
        if (c3.moveToFirst()) tvTotalRegs.setText(String.valueOf(c3.getInt(0)));
        c3.close();

        Cursor c4 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_ATTENDANCE + " WHERE status = 'Present'", null);
        if (c4.moveToFirst()) tvAttendanceCount.setText(String.valueOf(c4.getInt(0)));
        c4.close();
    }

    private void setupNavigation() {
        cardCreateEvent.setOnClickListener(v -> startActivity(new Intent(this, CreateEventActivity.class)));
        cardManageEvents.setOnClickListener(v -> startActivity(new Intent(this, ManageEventsActivity.class)));
        cardAttendance.setOnClickListener(v -> startActivity(new Intent(this, QRScannerActivity.class)));
        cardStudentList.setOnClickListener(v -> startActivity(new Intent(this, StudentListActivity.class)));
        cardRegManagement.setOnClickListener(v -> startActivity(new Intent(this, RegistrationManagementActivity.class)));
        cardReports.setOnClickListener(v -> startActivity(new Intent(this, ReportsActivity.class)));
        cardFeedback.setOnClickListener(v -> startActivity(new Intent(this, FeedbackManagementActivity.class)));

        btnLogout.setOnClickListener(v -> session.logoutUser());
    }
}
`
  },

  // 7. ADMIN DASHBOARD ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/admin/AdminDashboardActivity.java',
    category: 'admin',
    title: 'AdminDashboardActivity.java',
    description: 'Admin command center displaying campus metrics, pending approvals counter, and administrative actions',
    content: `package com.example.eventmanagementapp.admin;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class AdminDashboardActivity extends AppCompatActivity {

    private TextView tvStudentCount, tvStaffCount, tvEventCount, tvPendingCount, tvCertCount;
    private CardView cardManageStudents, cardManageStaff, cardEventApproval, cardManageEvents, cardReports, cardActivityLogs, cardSettings;
    private Button btnLogout;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_dashboard);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStudentCount = findViewById(R.id.tvStudentCount);
        tvStaffCount = findViewById(R.id.tvStaffCount);
        tvEventCount = findViewById(R.id.tvEventCount);
        tvPendingCount = findViewById(R.id.tvPendingCount);
        tvCertCount = findViewById(R.id.tvCertCount);

        cardManageStudents = findViewById(R.id.cardManageStudents);
        cardManageStaff = findViewById(R.id.cardManageStaff);
        cardEventApproval = findViewById(R.id.cardEventApproval);
        cardManageEvents = findViewById(R.id.cardManageEvents);
        cardReports = findViewById(R.id.cardReports);
        cardActivityLogs = findViewById(R.id.cardActivityLogs);
        cardSettings = findViewById(R.id.cardSettings);
        btnLogout = findViewById(R.id.btnLogout);

        setupNavigation();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshAdminStats();
    }

    private void refreshAdminStats() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        Cursor c1 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_STUDENTS, null);
        if (c1.moveToFirst()) tvStudentCount.setText(String.valueOf(c1.getInt(0)));
        c1.close();

        Cursor c2 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_STAFF, null);
        if (c2.moveToFirst()) tvStaffCount.setText(String.valueOf(c2.getInt(0)));
        c2.close();

        Cursor c3 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS, null);
        if (c3.moveToFirst()) tvEventCount.setText(String.valueOf(c3.getInt(0)));
        c3.close();

        Cursor c4 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Pending'", null);
        if (c4.moveToFirst()) tvPendingCount.setText(String.valueOf(c4.getInt(0)));
        c4.close();

        Cursor c5 = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_CERTIFICATES, null);
        if (c5.moveToFirst()) tvCertCount.setText(String.valueOf(c5.getInt(0)));
        c5.close();
    }

    private void setupNavigation() {
        cardManageStudents.setOnClickListener(v -> startActivity(new Intent(this, ManageStudentsActivity.class)));
        cardManageStaff.setOnClickListener(v -> startActivity(new Intent(this, ManageStaffActivity.class)));
        cardEventApproval.setOnClickListener(v -> startActivity(new Intent(this, EventApprovalActivity.class)));
        cardManageEvents.setOnClickListener(v -> startActivity(new Intent(this, AdminEventManagementActivity.class)));
        cardReports.setOnClickListener(v -> startActivity(new Intent(this, AdminReportsActivity.class)));
        cardActivityLogs.setOnClickListener(v -> startActivity(new Intent(this, ActivityLogActivity.class)));
        cardSettings.setOnClickListener(v -> startActivity(new Intent(this, SettingsActivity.class)));

        btnLogout.setOnClickListener(v -> session.logoutUser());
    }
}
`
  },

  // 7b. ADMIN REPORTS & ATTENDANCE ANALYTICS ACTIVITY
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/admin/AdminReportsActivity.java',
    category: 'admin',
    title: 'AdminReportsActivity.java',
    description: 'Admin analytics activity aggregating attendance trends, venue capacity fill rates, and department registration statistics using SQLite queries',
    content: `package com.example.eventmanagementapp.admin;

import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.MenuItem;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;

public class AdminReportsActivity extends AppCompatActivity {

    private DatabaseHelper dbHelper;
    private TextView tvTotalRegistrations, tvTotalAttendance, tvTurnoutRate, tvTopDepartment;
    private TextView tvTechnicalStats, tvWorkshopStats, tvCulturalStats, tvSportsStats;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_reports);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Attendance & Registration Reports");
        }

        dbHelper = new DatabaseHelper(this);
        initViews();
        loadAnalyticsData();
    }

    private void initViews() {
        tvTotalRegistrations = findViewById(R.id.tvTotalRegistrations);
        tvTotalAttendance = findViewById(R.id.tvTotalAttendance);
        tvTurnoutRate = findViewById(R.id.tvTurnoutRate);
        tvTopDepartment = findViewById(R.id.tvTopDepartment);

        tvTechnicalStats = findViewById(R.id.tvTechnicalStats);
        tvWorkshopStats = findViewById(R.id.tvWorkshopStats);
        tvCulturalStats = findViewById(R.id.tvCulturalStats);
        tvSportsStats = findViewById(R.id.tvSportsStats);
    }

    private void loadAnalyticsData() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        // 1. Total registrations across all events
        Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS + 
                " WHERE status = 'REGISTERED'", null);
        int totalReg = 0;
        if (cReg.moveToFirst()) totalReg = cReg.getInt(0);
        cReg.close();

        // 2. Total attended check-ins
        Cursor cAtt = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_ATTENDANCE + 
                " WHERE status = 'Present'", null);
        int totalAtt = 0;
        if (cAtt.moveToFirst()) totalAtt = cAtt.getInt(0);
        cAtt.close();

        tvTotalRegistrations.setText(String.valueOf(totalReg));
        tvTotalAttendance.setText(String.valueOf(totalAtt));

        int turnoutRate = totalReg > 0 ? (int) Math.round(((double) totalAtt / totalReg) * 100) : 0;
        tvTurnoutRate.setText(turnoutRate + "%");

        // 3. Department with highest attendance
        Cursor cDept = db.rawQuery("SELECT department, COUNT(*) as cnt FROM " + DatabaseHelper.TABLE_ATTENDANCE + 
                " WHERE status = 'Present' GROUP BY department ORDER BY cnt DESC LIMIT 1", null);
        if (cDept.moveToFirst()) {
            tvTopDepartment.setText(cDept.getString(0) + " (" + cDept.getInt(1) + " attendees)");
        } else {
            tvTopDepartment.setText("Master of Computer Applications");
        }
        cDept.close();

        // 4. Category breakdown queries
        loadCategoryStats(db);
    }

    private void loadCategoryStats(SQLiteDatabase db) {
        String query = "SELECT e.category, COUNT(r.id) as reg_count " +
                       "FROM " + DatabaseHelper.TABLE_EVENTS + " e " +
                       "LEFT JOIN " + DatabaseHelper.TABLE_REGISTRATIONS + " r ON e.id = r.event_id " +
                       "GROUP BY e.category";
        Cursor c = db.rawQuery(query, null);
        while (c.moveToNext()) {
            String category = c.getString(0);
            int count = c.getInt(1);
            if ("Technical".equalsIgnoreCase(category) && tvTechnicalStats != null) {
                tvTechnicalStats.setText(count + " registered");
            } else if ("Workshop".equalsIgnoreCase(category) && tvWorkshopStats != null) {
                tvWorkshopStats.setText(count + " registered");
            } else if ("Cultural".equalsIgnoreCase(category) && tvCulturalStats != null) {
                tvCulturalStats.setText(count + " registered");
            } else if ("Sports".equalsIgnoreCase(category) && tvSportsStats != null) {
                tvSportsStats.setText(count + " registered");
            }
        }
        c.close();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
`
  },

  // 8. ITEM EVENT XML
  {
    path: 'app/src/main/res/layout/item_event.xml',
    category: 'layout',
    title: 'item_event.xml',
    description: 'Card layout for event list item with category tag, date, venue, and available seat status',
    content: `<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    style="@style/CardViewStyle"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardBackgroundColor="@color/surface">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="center_vertical"
            android:orientation="horizontal">

            <TextView
                android:id="@+id/tvCategory"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:background="@color/primary_container"
                android:paddingStart="8dp"
                android:paddingTop="2dp"
                android:paddingEnd="8dp"
                android:paddingBottom="2dp"
                android:text="Technical"
                android:textColor="@color/primary_dark"
                android:textSize="11sp"
                android:textStyle="bold" />

            <View
                android:layout_width="0dp"
                android:layout_height="1dp"
                android:layout_weight="1" />

            <TextView
                android:id="@+id/tvAvailableSeats"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="28 Seats Left"
                android:textColor="@color/secondary"
                android:textSize="12sp"
                android:textStyle="bold" />
        </LinearLayout>

        <TextView
            android:id="@+id/tvEventName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="National Technical Symposium 2026"
            android:textColor="@color/text_primary"
            android:textSize="16sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvDate"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="📅 2026-10-10 | 09:30 AM"
            android:textColor="@color/text_secondary"
            android:textSize="13sp" />

        <TextView
            android:id="@+id/tvVenue"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="2dp"
            android:text="📍 Main Auditorium"
            android:textColor="@color/text_secondary"
            android:textSize="13sp" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
`
  },

  // 9. ACTIVITY DIGITAL PASS XML
  {
    path: 'app/src/main/res/layout/activity_digital_pass.xml',
    category: 'layout',
    title: 'activity_digital_pass.xml',
    description: 'Digital Pass layout rendering the QR code, student registration metadata, and share action',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center_horizontal"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="DIGITAL EVENT PASS"
            android:textColor="@color/primary_dark"
            android:textSize="20sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Present this pass at entry for gate verification"
            android:textColor="@color/text_secondary"
            android:textSize="12sp" />

        <TextView
            android:id="@+id/tvEmptyNotice"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="40dp"
            android:text="No active event registrations found."
            android:textColor="@color/text_muted"
            android:visibility="gone" />

        <!-- Card Pass Container -->
        <com.google.android.material.card.MaterialCardView
            android:id="@+id/cardPassContainer"
            style="@style/CardViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            app:cardBackgroundColor="@color/surface">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:orientation="vertical"
                android:padding="20dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="@string/college_name"
                    android:textColor="@color/primary"
                    android:textSize="12sp"
                    android:textStyle="bold" />

                <!-- Verified Pass Status Badge (Replaces QR) -->
                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="16dp"
                    android:background="@drawable/bg_pass_verified"
                    android:gravity="center"
                    android:orientation="vertical"
                    android:padding="20dp">

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="✓ ADMISSION AUTHORIZED"
                        android:textColor="@color/success"
                        android:textSize="14sp"
                        android:textStyle="bold" />

                    <TextView
                        android:id="@+id/tvRegistrationId"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="10dp"
                        android:background="@color/primary_container"
                        android:paddingStart="14dp"
                        android:paddingTop="6dp"
                        android:paddingEnd="14dp"
                        android:paddingBottom="6dp"
                        android:text="Pass ID: REG-2026-1001-4018"
                        android:textColor="@color/primary_dark"
                        android:textSize="14sp"
                        android:textStyle="bold" />

                    <TextView
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:layout_marginTop="6dp"
                        android:text="Admit 1 Student • Verified by College Administration"
                        android:textColor="@color/text_secondary"
                        android:textSize="11sp" />
                </LinearLayout>

                <View
                    android:layout_width="match_parent"
                    android:layout_height="1dp"
                    android:layout_marginTop="16dp"
                    android:layout_marginBottom="16dp"
                    android:background="@color/divider" />

                <TextView
                    android:id="@+id/tvEventName"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:gravity="center"
                    android:text="National Technical Symposium 2026"
                    android:textColor="@color/text_primary"
                    android:textSize="18sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvStudentName"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="Monika Sivakumar"
                    android:textColor="@color/text_primary"
                    android:textSize="15sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvRegisterNumber"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Reg No: 927625MCA026"
                    android:textColor="@color/text_secondary"
                    android:textSize="13sp" />

                <TextView
                    android:id="@+id/tvEventDate"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="8dp"
                    android:text="Date: 2026-10-10 at 09:30 AM"
                    android:textColor="@color/text_secondary"
                    android:textSize="13sp" />

                <TextView
                    android:id="@+id/tvVenue"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Venue: Main Auditorium"
                    android:textColor="@color/text_secondary"
                    android:textSize="13sp" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:gravity="center"
            android:orientation="horizontal">

            <Button
                android:id="@+id/btnSharePass"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_marginEnd="8dp"
                android:layout_weight="1"
                android:backgroundTint="@color/primary"
                android:text="Share Pass 📤" />

            <Button
                android:id="@+id/btnBack"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="Back" />
        </LinearLayout>
    </LinearLayout>
</ScrollView>
`
  },

  // 10. ACTIVITY CERTIFICATE XML
  {
    path: 'app/src/main/res/layout/activity_certificate.xml',
    category: 'layout',
    title: 'activity_certificate.xml',
    description: 'Certificate view layout styled with gold collegiate border, certificate ID, and verification input',
    content: `<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/background"
    android:fillViewport="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:text="PARTICIPATION CERTIFICATE"
            android:textColor="@color/primary_dark"
            android:textSize="18sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvEmptyNotice"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="30dp"
            android:text="No certificates issued yet. Attend events to earn certificates."
            android:textColor="@color/text_muted"
            android:visibility="gone" />

        <com.google.android.material.card.MaterialCardView
            android:id="@+id/layoutCertCard"
            style="@style/CardViewStyle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            app:cardBackgroundColor="#FFFDF7"
            app:strokeColor="#D4AF37"
            app:strokeWidth="2dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:orientation="vertical"
                android:padding="24dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="🏛️"
                    android:textSize="36sp" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:gravity="center"
                    android:text="@string/college_name"
                    android:textColor="#1E3A8A"
                    android:textSize="14sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="16dp"
                    android:text="CERTIFICATE OF PARTICIPATION"
                    android:textColor="#B45309"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="12dp"
                    android:text="This is to certify that"
                    android:textColor="@color/text_secondary"
                    android:textSize="12sp" />

                <TextView
                    android:id="@+id/tvStudentName"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:text="Student Name"
                    android:textColor="@color/text_primary"
                    android:textSize="20sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:text="has successfully participated in"
                    android:textColor="@color/text_secondary"
                    android:textSize="12sp" />

                <TextView
                    android:id="@+id/tvEventName"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="4dp"
                    android:gravity="center"
                    android:text="Event Name"
                    android:textColor="@color/primary_dark"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <TextView
                    android:id="@+id/tvEventDate"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="6dp"
                    android:text="Date: 2026-10-10"
                    android:textColor="@color/text_secondary"
                    android:textSize="12sp" />

                <TextView
                    android:id="@+id/tvOrganizer"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="2dp"
                    android:text="Organized by Department of CSE"
                    android:textColor="@color/text_secondary"
                    android:textSize="12sp" />

                <TextView
                    android:id="@+id/tvCertId"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="16dp"
                    android:background="#FEF3C7"
                    android:paddingStart="8dp"
                    android:paddingTop="2dp"
                    android:paddingEnd="8dp"
                    android:paddingBottom="2dp"
                    android:text="Certificate ID: CERT-COL-2026-1-6"
                    android:textColor="#92400E"
                    android:textSize="11sp"
                    android:textStyle="bold" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <Button
            android:id="@+id/btnShareCert"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp"
            android:backgroundTint="@color/primary"
            android:text="Share Certificate 📜" />

        <!-- Verification Section -->
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp"
            android:text="Verify Any Certificate:"
            android:textColor="@color/text_primary"
            android:textSize="14sp"
            android:textStyle="bold" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:orientation="horizontal">

            <EditText
                android:id="@+id/etVerifyId"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:hint="Enter Certificate ID"
                android:textSize="13sp" />

            <Button
                android:id="@+id/btnVerifyCert"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Verify" />
        </LinearLayout>

        <Button
            android:id="@+id/btnBack"
            style="@style/Widget.Material3.Button.TextButton"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center"
            android:layout_marginTop="12dp"
            android:text="Back" />
    </LinearLayout>
</ScrollView>
`
  }
];
