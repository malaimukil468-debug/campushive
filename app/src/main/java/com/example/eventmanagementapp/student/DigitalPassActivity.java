package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class DigitalPassActivity extends AppCompatActivity {

    private TextView tvStudentName, tvRegisterNumber, tvEventName, tvEventDate, tvVenue, tvRegistrationId, tvEmptyNotice;
    private Button btnSharePass, btnBack;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private String shareContent = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_digital_pass);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStudentName = findViewById(R.id.tvStudentName);
        tvRegisterNumber = findViewById(R.id.tvRegisterNumber);
        tvEventName = findViewById(R.id.tvEventName);
        tvEventDate = findViewById(R.id.tvEventDate);
        tvVenue = findViewById(R.id.tvVenue);
        tvRegistrationId = findViewById(R.id.tvRegistrationId);
        btnSharePass = findViewById(R.id.btnSharePass);
        btnBack = findViewById(R.id.btnBack);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);

        loadLatestEventPass();

        btnSharePass.setOnClickListener(v -> {
            if (!shareContent.isEmpty()) {
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, shareContent);
                sendIntent.setType("text/plain");
                startActivity(Intent.createChooser(sendIntent, "Share Event Pass"));
            }
        });

        btnBack.setOnClickListener(v -> finish());
    }

    private void loadLatestEventPass() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        String query = "SELECT r.registration_id, r.registration_date, e.id, e.name, e.date, e.start_time, e.venue " +
                "FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " r " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON r.event_id = e.id " +
                "WHERE r.student_id = ? AND r.status = 'REGISTERED' " +
                "ORDER BY r.id DESC LIMIT 1";

        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(studentId)});
        if (cursor.moveToFirst()) {
            String regId = cursor.getString(0);
            int eventId = cursor.getInt(2);
            String eventName = cursor.getString(3);
            String eventDate = cursor.getString(4);
            String startTime = cursor.getString(5);
            String venue = cursor.getString(6);
            cursor.close();

            tvStudentName.setText(session.getName());
            tvRegisterNumber.setText("Reg No: " + session.getRegNumber());
            tvEventName.setText(eventName);
            tvEventDate.setText("Date: " + eventDate + " at " + startTime);
            tvVenue.setText("Venue: " + venue);
            tvRegistrationId.setText("Pass ID: " + regId);

            shareContent = "COLLEGE DIGITAL EVENT PASS\n\n" +
                    "Event: " + eventName + "\n" +
                    "Student: " + session.getName() + " (" + session.getRegNumber() + ")\n" +
                    "Date: " + eventDate + "\n" +
                    "Venue: " + venue + "\n" +
                    "Registration Pass ID: " + regId;
        } else {
            cursor.close();
            tvEmptyNotice.setVisibility(View.VISIBLE);
            findViewById(R.id.cardPassContainer).setVisibility(View.GONE);
            btnSharePass.setEnabled(false);
        }
    }
}
