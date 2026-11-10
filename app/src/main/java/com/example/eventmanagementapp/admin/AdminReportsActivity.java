package com.example.eventmanagementapp.admin;

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
