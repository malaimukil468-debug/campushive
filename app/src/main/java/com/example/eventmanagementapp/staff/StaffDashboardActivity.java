package com.example.eventmanagementapp.staff;

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
