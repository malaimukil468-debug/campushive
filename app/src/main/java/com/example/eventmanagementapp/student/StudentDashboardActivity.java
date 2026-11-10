package com.example.eventmanagementapp.student;

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

public class StudentDashboardActivity extends AppCompatActivity {

    private TextView tvStudentName, tvWelcome, tvUpcomingCount, tvRegCount, tvNotifCount, tvCertCount;
    private CardView cardBrowse, cardSearch, cardMyEvents, cardFavorites, cardDigitalPass, cardCertificates, cardNotifs, cardProfile, cardFeedback, cardCalendar;
    private Button btnLogout, btnDashboardDateFilter, btnDashboardResetFilter;
    private android.widget.EditText etDashboardSearch;
    private android.widget.Spinner spDashboardCategory;
    private androidx.recyclerview.widget.RecyclerView rvDashboardEvents;
    private com.example.eventmanagementapp.adapter.EventAdapter dashboardAdapter;
    private java.util.List<com.example.eventmanagementapp.model.EventItem> dashboardEventsList;

    // CalendarView components for registered events schedule
    private android.widget.CalendarView calendarViewDashboard;
    private TextView tvCalendarSelectedDate, tvCalendarEmptyState;
    private androidx.recyclerview.widget.RecyclerView rvCalendarRegisteredEvents;
    private com.example.eventmanagementapp.adapter.EventAdapter calendarEventsAdapter;
    private java.util.List<com.example.eventmanagementapp.model.EventItem> calendarRegisteredEventsList;

    private DatabaseHelper dbHelper;
    private SessionManager session;
    private String selectedCategory = "All";
    private String selectedDate = "All";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_dashboard);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvWelcome = findViewById(R.id.tvWelcome);
        tvStudentName = findViewById(R.id.tvStudentName);
        tvUpcomingCount = findViewById(R.id.tvUpcomingCount);
        tvRegCount = findViewById(R.id.tvRegCount);
        tvNotifCount = findViewById(R.id.tvNotifCount);
        tvCertCount = findViewById(R.id.tvCertCount);

        cardBrowse = findViewById(R.id.cardBrowse);
        cardSearch = findViewById(R.id.cardSearch);
        cardMyEvents = findViewById(R.id.cardMyEvents);
        cardFavorites = findViewById(R.id.cardFavorites);
        cardDigitalPass = findViewById(R.id.cardDigitalPass);
        cardCertificates = findViewById(R.id.cardCertificates);
        cardNotifs = findViewById(R.id.cardNotifs);
        cardProfile = findViewById(R.id.cardProfile);
        cardFeedback = findViewById(R.id.cardFeedback);
        cardCalendar = findViewById(R.id.cardCalendar);
        btnLogout = findViewById(R.id.btnLogout);

        // Search and Filter Views
        etDashboardSearch = findViewById(R.id.etDashboardSearch);
        spDashboardCategory = findViewById(R.id.spDashboardCategory);
        btnDashboardDateFilter = findViewById(R.id.btnDashboardDateFilter);
        btnDashboardResetFilter = findViewById(R.id.btnDashboardResetFilter);
        rvDashboardEvents = findViewById(R.id.rvDashboardEvents);

        // CalendarView components
        calendarViewDashboard = findViewById(R.id.calendarViewDashboard);
        tvCalendarSelectedDate = findViewById(R.id.tvCalendarSelectedDate);
        tvCalendarEmptyState = findViewById(R.id.tvCalendarEmptyState);
        rvCalendarRegisteredEvents = findViewById(R.id.rvCalendarRegisteredEvents);

        tvStudentName.setText(session.getName());

        setupNavigation();
        setupDashboardEventSearchAndFilter();
        setupDashboardCalendarView();
    }

    private void setupDashboardCalendarView() {
        calendarRegisteredEventsList = new java.util.ArrayList<>();
        calendarEventsAdapter = new com.example.eventmanagementapp.adapter.EventAdapter(this, calendarRegisteredEventsList, event -> {
            Intent intent = new Intent(StudentDashboardActivity.this, EventDetailsActivity.class);
            intent.putExtra("eventId", event.getId());
            startActivity(intent);
        });
        rvCalendarRegisteredEvents.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
        rvCalendarRegisteredEvents.setAdapter(calendarEventsAdapter);

        // Default to today's date formatted as yyyy-MM-dd
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault());
        String initialDate = sdf.format(new java.util.Date(calendarViewDashboard.getDate()));
        loadRegisteredEventsForDate(initialDate);

        calendarViewDashboard.setOnDateChangeListener((view, year, month, dayOfMonth) -> {
            String selected = String.format(java.util.Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, dayOfMonth);
            loadRegisteredEventsForDate(selected);
        });
    }

    private void loadRegisteredEventsForDate(String dateStr) {
        calendarRegisteredEventsList.clear();
        tvCalendarSelectedDate.setText("Registered Events on " + dateStr);

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT e.id, e.name, e.description, e.category, e.date, e.start_time, e.end_time, e.venue, e.organizer, e.capacity " +
                "FROM " + DatabaseHelper.TABLE_EVENTS + " e " +
                "JOIN " + DatabaseHelper.TABLE_REGISTRATIONS + " r ON e.id = r.event_id " +
                "WHERE r.student_id = ? AND r.status = 'REGISTERED' AND e.date = ?",
                new String[]{String.valueOf(session.getStudentId()), dateStr});

        while (cursor.moveToNext()) {
            com.example.eventmanagementapp.model.EventItem item = new com.example.eventmanagementapp.model.EventItem(
                    cursor.getInt(0), cursor.getString(1), cursor.getString(2), cursor.getString(3),
                    cursor.getString(4), cursor.getString(5), cursor.getString(6), cursor.getString(7),
                    cursor.getString(8), cursor.getInt(9)
            );
            calendarRegisteredEventsList.add(item);
        }
        cursor.close();
        calendarEventsAdapter.notifyDataSetChanged();

        if (calendarRegisteredEventsList.isEmpty()) {
            tvCalendarEmptyState.setVisibility(android.view.View.VISIBLE);
            rvCalendarRegisteredEvents.setVisibility(android.view.View.GONE);
            tvCalendarEmptyState.setText("No registered events scheduled on " + dateStr);
        } else {
            tvCalendarEmptyState.setVisibility(android.view.View.GONE);
            rvCalendarRegisteredEvents.setVisibility(android.view.View.VISIBLE);
        }
    }

    private void setupDashboardEventSearchAndFilter() {
        dashboardEventsList = new java.util.ArrayList<>();
        dashboardAdapter = new com.example.eventmanagementapp.adapter.EventAdapter(this, dashboardEventsList, event -> {
            Intent intent = new Intent(StudentDashboardActivity.this, EventDetailsActivity.class);
            intent.putExtra("eventId", event.getId());
            startActivity(intent);
        });
        rvDashboardEvents.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(this));
        rvDashboardEvents.setAdapter(dashboardAdapter);

        // Populate Category Spinner
        String[] categories = {"All", "Technical", "Cultural", "Sports", "Workshop", "Seminar", "Symposium"};
        android.widget.ArrayAdapter<String> catAdapter = new android.widget.ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, categories);
        spDashboardCategory.setAdapter(catAdapter);

        spDashboardCategory.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, android.view.View view, int position, long id) {
                selectedCategory = categories[position];
                filterDashboardEvents();
            }
            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {}
        });

        // Search text watcher
        etDashboardSearch.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterDashboardEvents();
            }
            @Override
            public void afterTextChanged(android.text.Editable s) {}
        });

        // Date picker filter button
        btnDashboardDateFilter.setOnClickListener(v -> {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            new android.app.DatePickerDialog(this, (view, year, month, day) -> {
                selectedDate = String.format(java.util.Locale.getDefault(), "%04d-%02d-%02d", year, month + 1, day);
                btnDashboardDateFilter.setText(selectedDate);
                filterDashboardEvents();
            }, cal.get(java.util.Calendar.YEAR), cal.get(java.util.Calendar.MONTH), cal.get(java.util.Calendar.DAY_OF_MONTH)).show();
        });

        btnDashboardResetFilter.setOnClickListener(v -> {
            etDashboardSearch.setText("");
            spDashboardCategory.setSelection(0);
            selectedCategory = "All";
            selectedDate = "All";
            btnDashboardDateFilter.setText("Pick Date 📅");
            filterDashboardEvents();
        });

        filterDashboardEvents();
    }

    private void filterDashboardEvents() {
        dashboardEventsList.clear();
        String query = etDashboardSearch.getText().toString().trim().toLowerCase();

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, name, description, category, date, start_time, end_time, venue, organizer, capacity, status FROM " +
                DatabaseHelper.TABLE_EVENTS + " WHERE status != 'Cancelled' AND status != 'Rejected' ORDER BY date ASC", null);

        while (cursor.moveToNext()) {
            int id = cursor.getInt(0);
            String name = cursor.getString(1);
            String desc = cursor.getString(2);
            String cat = cursor.getString(3);
            String date = cursor.getString(4);
            String startTime = cursor.getString(5);
            String endTime = cursor.getString(6);
            String venue = cursor.getString(7);
            String organizer = cursor.getString(8);
            int capacity = cursor.getInt(9);

            // Apply category filter
            if (!"All".equals(selectedCategory) && !cat.equalsIgnoreCase(selectedCategory)) {
                continue;
            }

            // Apply date filter
            if (!"All".equals(selectedDate) && !date.equals(selectedDate)) {
                continue;
            }

            // Apply query filter (name, venue, category, date)
            if (!query.isEmpty()) {
                boolean matchesName = name.toLowerCase().contains(query);
                boolean matchesVenue = venue.toLowerCase().contains(query);
                boolean matchesCat = cat.toLowerCase().contains(query);
                boolean matchesDate = date.toLowerCase().contains(query);
                if (!matchesName && !matchesVenue && !matchesCat && !matchesDate) {
                    continue;
                }
            }

            com.example.eventmanagementapp.model.EventItem item = new com.example.eventmanagementapp.model.EventItem(
                    id, name, desc, cat, date, startTime, endTime, venue, organizer, capacity
            );

            // Fetch registration count
            Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS +
                    " WHERE event_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(id)});
            if (cReg.moveToFirst()) item.setRegisteredCount(cReg.getInt(0));
            cReg.close();

            dashboardEventsList.add(item);
        }
        cursor.close();
        dashboardAdapter.notifyDataSetChanged();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshCounters();
    }

    private void refreshCounters() {
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        // 1. Upcoming Events Count
        Cursor cUpcoming = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Upcoming' OR status = 'Approved'", null);
        if (cUpcoming.moveToFirst()) tvUpcomingCount.setText(String.valueOf(cUpcoming.getInt(0)));
        cUpcoming.close();

        // 2. My Registrations Count
        int studentId = session.getStudentId();
        Cursor cReg = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " WHERE student_id = ? AND status = 'REGISTERED'", new String[]{String.valueOf(studentId)});
        if (cReg.moveToFirst()) tvRegCount.setText(String.valueOf(cReg.getInt(0)));
        cReg.close();

        // 3. Notifications Count
        int userId = session.getUserId();
        Cursor cNotif = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_NOTIFICATIONS + " WHERE user_id = ? AND is_read = 0", new String[]{String.valueOf(userId)});
        if (cNotif.moveToFirst()) tvNotifCount.setText(String.valueOf(cNotif.getInt(0)));
        cNotif.close();

        // 4. Certificates Count
        Cursor cCert = db.rawQuery("SELECT COUNT(*) FROM " + DatabaseHelper.TABLE_CERTIFICATES + " WHERE student_id = ? AND status = 'VALID'", new String[]{String.valueOf(studentId)});
        if (cCert.moveToFirst()) tvCertCount.setText(String.valueOf(cCert.getInt(0)));
        cCert.close();
    }

    private void setupNavigation() {
        cardBrowse.setOnClickListener(v -> startActivity(new Intent(this, EventSearchActivity.class)));
        cardSearch.setOnClickListener(v -> startActivity(new Intent(this, EventSearchActivity.class)));
        cardMyEvents.setOnClickListener(v -> startActivity(new Intent(this, MyEventsActivity.class)));
        cardFavorites.setOnClickListener(v -> startActivity(new Intent(this, FavoriteEventsActivity.class)));
        cardDigitalPass.setOnClickListener(v -> startActivity(new Intent(this, DigitalPassActivity.class)));
        cardCertificates.setOnClickListener(v -> startActivity(new Intent(this, CertificateActivity.class)));
        cardNotifs.setOnClickListener(v -> startActivity(new Intent(this, NotificationsActivity.class)));
        cardProfile.setOnClickListener(v -> startActivity(new Intent(this, ProfileActivity.class)));
        cardFeedback.setOnClickListener(v -> startActivity(new Intent(this, FeedbackActivity.class)));
        cardCalendar.setOnClickListener(v -> startActivity(new Intent(this, CalendarActivity.class)));

        btnLogout.setOnClickListener(v -> session.logoutUser());
    }
}
