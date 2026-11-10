package com.example.eventmanagementapp.admin;

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
