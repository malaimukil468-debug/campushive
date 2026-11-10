package com.example.eventmanagementapp;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.admin.AdminDashboardActivity;
import com.example.eventmanagementapp.staff.StaffDashboardActivity;
import com.example.eventmanagementapp.student.StudentDashboardActivity;
import com.example.eventmanagementapp.utils.SessionManager;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        SessionManager session = new SessionManager(this);

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            if (session.isLoggedIn()) {
                String role = session.getUserRole();
                if ("ADMIN".equalsIgnoreCase(role)) {
                    startActivity(new Intent(MainActivity.this, AdminDashboardActivity.class));
                } else if ("STAFF".equalsIgnoreCase(role)) {
                    startActivity(new Intent(MainActivity.this, StaffDashboardActivity.class));
                } else {
                    startActivity(new Intent(MainActivity.this, StudentDashboardActivity.class));
                }
            } else {
                startActivity(new Intent(MainActivity.this, LoginActivity.class));
            }
            finish();
        }, 1500);
    }
}
