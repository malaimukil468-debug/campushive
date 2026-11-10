package com.example.eventmanagementapp.student;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.utils.SessionManager;

public class CertificateActivity extends AppCompatActivity {

    private TextView tvStudentName, tvEventName, tvEventDate, tvOrganizer, tvCertId, tvEmptyNotice;
    private View layoutCertCard;
    private Button btnShareCert, btnVerifyCert, btnBack;
    private EditText etVerifyId;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_certificate);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        tvStudentName = findViewById(R.id.tvStudentName);
        tvEventName = findViewById(R.id.tvEventName);
        tvEventDate = findViewById(R.id.tvEventDate);
        tvOrganizer = findViewById(R.id.tvOrganizer);
        tvCertId = findViewById(R.id.tvCertId);
        layoutCertCard = findViewById(R.id.layoutCertCard);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);
        btnShareCert = findViewById(R.id.btnShareCert);
        btnVerifyCert = findViewById(R.id.btnVerifyCert);
        etVerifyId = findViewById(R.id.etVerifyId);
        btnBack = findViewById(R.id.btnBack);

        loadLatestCertificate();

        btnShareCert.setOnClickListener(v -> shareCertificate());
        btnVerifyCert.setOnClickListener(v -> verifyCertificateId());
        btnBack.setOnClickListener(v -> finish());
    }

    private void loadLatestCertificate() {
        int studentId = session.getStudentId();
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        String query = "SELECT c.certificate_id, c.issue_date, e.name, e.date, e.organizer " +
                "FROM " + DatabaseHelper.TABLE_CERTIFICATES + " c " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON c.event_id = e.id " +
                "WHERE c.student_id = ? AND c.status = 'VALID' ORDER BY c.id DESC LIMIT 1";

        Cursor cursor = db.rawQuery(query, new String[]{String.valueOf(studentId)});
        if (cursor.moveToFirst()) {
            String certId = cursor.getString(0);
            String issueDate = cursor.getString(1);
            String eventName = cursor.getString(2);
            String eventDate = cursor.getString(3);
            String organizer = cursor.getString(4);
            cursor.close();

            tvStudentName.setText(session.getName());
            tvEventName.setText(eventName);
            tvEventDate.setText("Date: " + eventDate);
            tvOrganizer.setText("Organized by " + organizer);
            tvCertId.setText("Certificate ID: " + certId);

            layoutCertCard.setVisibility(View.VISIBLE);
            tvEmptyNotice.setVisibility(View.GONE);
        } else {
            cursor.close();
            layoutCertCard.setVisibility(View.GONE);
            tvEmptyNotice.setVisibility(View.VISIBLE);
        }
    }

    private void shareCertificate() {
        Intent sendIntent = new Intent();
        sendIntent.setAction(Intent.ACTION_SEND);
        sendIntent.putExtra(Intent.EXTRA_TEXT, "CERTIFICATE OF PARTICIPATION\n\n" +
                "Awarded to: " + session.getName() + "\n" +
                "For event: " + tvEventName.getText().toString() + "\n" +
                tvCertId.getText().toString() + "\n" +
                "College: National Institute of Engineering & Technology");
        sendIntent.setType("text/plain");
        startActivity(Intent.createChooser(sendIntent, "Share Certificate"));
    }

    private void verifyCertificateId() {
        String enteredId = etVerifyId.getText().toString().trim();
        if (enteredId.isEmpty()) {
            etVerifyId.setError("Enter Certificate ID");
            return;
        }

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        String q = "SELECT s.name, e.name, c.issue_date, c.status " +
                "FROM " + DatabaseHelper.TABLE_CERTIFICATES + " c " +
                "JOIN " + DatabaseHelper.TABLE_STUDENTS + " s ON c.student_id = s.id " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON c.event_id = e.id " +
                "WHERE UPPER(c.certificate_id) = UPPER(?)";

        Cursor c = db.rawQuery(q, new String[]{enteredId});
        if (c.moveToFirst()) {
            String studentName = c.getString(0);
            String evName = c.getString(1);
            String date = c.getString(2);
            String status = c.getString(3);
            c.close();

            new AlertDialog.Builder(this)
                    .setTitle("VALID CERTIFICATE ✅")
                    .setMessage("Student: " + studentName + "\nEvent: " + evName + "\nIssued Date: " + date + "\nStatus: " + status)
                    .setPositiveButton("OK", null)
                    .show();
        } else {
            c.close();
            new AlertDialog.Builder(this)
                    .setTitle("INVALID CERTIFICATE ❌")
                    .setMessage("No matching certificate record found in the college database.")
                    .setPositiveButton("OK", null)
                    .show();
        }
    }
}
