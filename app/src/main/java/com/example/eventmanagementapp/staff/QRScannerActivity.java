package com.example.eventmanagementapp.staff;

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
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class QRScannerActivity extends AppCompatActivity {

    private Button btnScan, btnBack;
    private TextView tvScanResult, tvStatus;
    private DatabaseHelper dbHelper;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qr_scanner);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        btnScan = findViewById(R.id.btnScan);
        btnBack = findViewById(R.id.btnBack);
        tvScanResult = findViewById(R.id.tvScanResult);
        tvStatus = findViewById(R.id.tvStatus);

        btnScan.setOnClickListener(v -> initiateScan());
        btnBack.setOnClickListener(v -> finish());

        // Automatically start camera on launch
        initiateScan();
    }

    private void initiateScan() {
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setPrompt("Align the QR Code inside the viewfinder");
        integrator.setOrientationLocked(true);
        integrator.setBeepEnabled(true);
        integrator.initiateScan();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() != null) {
                processScannedData(result.getContents());
            } else {
                Toast.makeText(this, "Scan cancelled.", Toast.LENGTH_SHORT).show();
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
        }
    }

    private void processScannedData(String qrData) {
        // Format: REGISTRATION_ID|STUDENT_ID|EVENT_ID or REGISTRATION_ID
        String regId = qrData;
        int parsedStudentId = -1;
        int parsedEventId = -1;

        if (qrData.contains("|")) {
            String[] parts = qrData.split("\\|");
            regId = parts[0];
            if (parts.length >= 3) {
                try {
                    parsedStudentId = Integer.parseInt(parts[1]);
                    parsedEventId = Integer.parseInt(parts[2]);
                } catch (Exception ignored) {}
            }
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // 1. Verify Registration Record
        Cursor cReg = db.rawQuery("SELECT r.student_id, r.event_id, r.status, s.name, s.register_number, e.name " +
                "FROM " + DatabaseHelper.TABLE_REGISTRATIONS + " r " +
                "JOIN " + DatabaseHelper.TABLE_STUDENTS + " s ON r.student_id = s.id " +
                "JOIN " + DatabaseHelper.TABLE_EVENTS + " e ON r.event_id = e.id " +
                "WHERE r.registration_id = ?", new String[]{regId});

        if (cReg.moveToFirst()) {
            int studentId = cReg.getInt(0);
            int eventId = cReg.getInt(1);
            String regStatus = cReg.getString(2);
            String studentName = cReg.getString(3);
            String regNo = cReg.getString(4);
            String eventName = cReg.getString(5);
            cReg.close();

            if (!"REGISTERED".equalsIgnoreCase(regStatus)) {
                showResultDialog("Invalid Pass", "This registration has been " + regStatus + ".");
                return;
            }

            // 2. Check if already checked in
            Cursor cAtt = db.rawQuery("SELECT id, check_in, check_out FROM " + DatabaseHelper.TABLE_ATTENDANCE +
                    " WHERE student_id = ? AND event_id = ?", new String[]{String.valueOf(studentId), String.valueOf(eventId)});

            String nowTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());

            if (cAtt.moveToFirst()) {
                int attId = cAtt.getInt(0);
                String checkInTime = cAtt.getString(1);
                String checkOutTime = cAtt.getString(2);
                cAtt.close();

                if (checkOutTime == null || checkOutTime.isEmpty()) {
                    // Record Check-Out
                    ContentValues cvOut = new ContentValues();
                    cvOut.put("check_out", nowTime);
                    db.update(DatabaseHelper.TABLE_ATTENDANCE, cvOut, "id = ?", new String[]{String.valueOf(attId)});
                    dbHelper.logActivity(session.getUserId(), "Check-out recorded for " + studentName + " (" + regNo + ")");
                    showResultDialog("Check-Out Recorded", "Student: " + studentName + "\nEntry: " + checkInTime + "\nExit: " + nowTime);
                } else {
                    showResultDialog("Already Checked Out", studentName + " has already completed check-in & check-out for this event.");
                }
            } else {
                cAtt.close();
                // Mark Check-In (Present)
                ContentValues cvIn = new ContentValues();
                cvIn.put("student_id", studentId);
                cvIn.put("event_id", eventId);
                cvIn.put("check_in", nowTime);
                cvIn.put("status", "Present");
                db.insert(DatabaseHelper.TABLE_ATTENDANCE, null, cvIn);

                // Auto issue Certificate of Participation
                String certId = "CERT-COL-2026-" + studentId + "-" + eventId;
                ContentValues cvCert = new ContentValues();
                cvCert.put("student_id", studentId);
                cvCert.put("event_id", eventId);
                cvCert.put("certificate_id", certId);
                cvCert.put("issue_date", new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date()));
                cvCert.put("status", "VALID");
                db.insertWithOnConflict(DatabaseHelper.TABLE_CERTIFICATES, null, cvCert, SQLiteDatabase.CONFLICT_IGNORE);

                dbHelper.logActivity(session.getUserId(), "Marked attendance Present for " + studentName + " at " + eventName);
                showResultDialog("Check-in Successful! ✅", "Student: " + studentName + "\nReg No: " + regNo + "\nEvent: " + eventName + "\nTime: " + nowTime + "\nAttendance: PRESENT");
            }
        } else {
            cReg.close();
            showResultDialog("Check-in Failed ❌", "No matching active registration found for Pass ID: " + regId);
        }
    }

    private void showResultDialog(String title, String message) {
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(message)
                .setPositiveButton("Scan Next", (dialog, which) -> initiateScan())
                .setNegativeButton("Done", (dialog, which) -> finish())
                .setCancelable(false)
                .show();
    }
}
