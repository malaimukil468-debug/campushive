package com.example.eventmanagementapp;

import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.admin.AdminDashboardActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.staff.StaffDashboardActivity;
import com.example.eventmanagementapp.student.StudentDashboardActivity;
import com.example.eventmanagementapp.utils.SessionManager;

public class LoginActivity extends AppCompatActivity {

    private EditText etUsername, etPassword;
    private Button btnLogin, btnQuickStudent, btnQuickStaff, btnQuickAdmin;
    private CheckBox cbRememberStudent;
    private TextView tvForgotPassword, tvSignUp;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private SharedPreferences sharedPrefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);
        sharedPrefs = getSharedPreferences("StudentAuthPrefs", MODE_PRIVATE);

        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        cbRememberStudent = findViewById(R.id.cbRememberStudent);
        tvForgotPassword = findViewById(R.id.tvForgotPassword);
        tvSignUp = findViewById(R.id.tvSignUp);
        btnQuickStudent = findViewById(R.id.btnQuickStudent);
        btnQuickStaff = findViewById(R.id.btnQuickStaff);
        btnQuickAdmin = findViewById(R.id.btnQuickAdmin);

        // Pre-fill saved Student Register Number if remembered
        String savedStudentId = sharedPrefs.getString("saved_student_identifier", "927625MCA026");
        boolean isRemembered = sharedPrefs.getBoolean("remember_student", true);
        if (etUsername != null && !TextUtils.isEmpty(savedStudentId)) {
            etUsername.setText(savedStudentId);
            if (cbRememberStudent != null) cbRememberStudent.setChecked(isRemembered);
        }

        btnLogin.setOnClickListener(v -> performLogin());

        tvSignUp.setOnClickListener(v -> startActivity(new Intent(LoginActivity.this, StudentSignupActivity.class)));
        tvForgotPassword.setOnClickListener(v -> startActivity(new Intent(LoginActivity.this, ForgotPasswordActivity.class)));

        // Convenient test credential fillers
        btnQuickStudent.setOnClickListener(v -> {
            etUsername.setText("927625MCA026");
            etPassword.setText("1234");
            Toast.makeText(this, "Student Monika (MCA) autofilled", Toast.LENGTH_SHORT).show();
        });

        btnQuickStaff.setOnClickListener(v -> {
            etUsername.setText("staff");
            etPassword.setText("1234");
        });

        btnQuickAdmin.setOnClickListener(v -> {
            etUsername.setText("admin");
            etPassword.setText("admin123");
        });
    }

    private void performLogin() {
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        if (TextUtils.isEmpty(username)) {
            etUsername.setError("Please enter student Register Number, email, or username");
            etUsername.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(password)) {
            etPassword.setError("Please enter password");
            etPassword.requestFocus();
            return;
        }

        // Save or clear remembered student identifier based on preference
        if (cbRememberStudent != null && cbRememberStudent.isChecked()) {
            sharedPrefs.edit()
                .putString("saved_student_identifier", username)
                .putBoolean("remember_student", true)
                .apply();
        } else {
            sharedPrefs.edit().putBoolean("remember_student", false).apply();
        }

        SQLiteDatabase db = dbHelper.getReadableDatabase();
        // Check users by: username OR student email OR student register_number OR staff_id
        Cursor cursor = db.rawQuery("SELECT id, username, role, status FROM " + DatabaseHelper.TABLE_USERS +
                " WHERE (LOWER(username) = LOWER(?) " +
                " OR id IN (SELECT user_id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE LOWER(email) = LOWER(?) OR UPPER(register_number) = UPPER(?)) " +
                " OR id IN (SELECT user_id FROM " + DatabaseHelper.TABLE_STAFF + " WHERE LOWER(email) = LOWER(?) OR UPPER(staff_id) = UPPER(?))) " +
                " AND password = ?",
                new String[]{username, username, username, username, username, password});

        if (cursor != null && cursor.moveToFirst()) {
            int userId = cursor.getInt(0);
            String uName = cursor.getString(1);
            String role = cursor.getString(2);
            String status = cursor.getString(3);
            cursor.close();

            if ("INACTIVE".equalsIgnoreCase(status)) {
                Toast.makeText(this, "Your student account has been deactivated. Contact Admin.", Toast.LENGTH_LONG).show();
                return;
            }

            int entityId = -1;
            String name = uName;
            String regOrStaffNo = "";
            String email = "";

            if ("STUDENT".equalsIgnoreCase(role)) {
                Cursor cStudent = db.rawQuery("SELECT id, name, register_number, email FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE user_id = ?", new String[]{String.valueOf(userId)});
                if (cStudent.moveToFirst()) {
                    entityId = cStudent.getInt(0);
                    name = cStudent.getString(1);
                    regOrStaffNo = cStudent.getString(2);
                    email = cStudent.getString(3);
                }
                cStudent.close();

                session.createLoginSession(userId, uName, "STUDENT", entityId, name, regOrStaffNo, email);
                dbHelper.logActivity(userId, "Student logged in: " + name + " (Reg: " + regOrStaffNo + ")");
                Toast.makeText(this, "Welcome Student, " + name + " (" + regOrStaffNo + ")", Toast.LENGTH_LONG).show();
                startActivity(new Intent(LoginActivity.this, StudentDashboardActivity.class));
            } else if ("STAFF".equalsIgnoreCase(role)) {
                Cursor cStaff = db.rawQuery("SELECT id, name, staff_id, email FROM " + DatabaseHelper.TABLE_STAFF + " WHERE user_id = ?", new String[]{String.valueOf(userId)});
                if (cStaff.moveToFirst()) {
                    entityId = cStaff.getInt(0);
                    name = cStaff.getString(1);
                    regOrStaffNo = cStaff.getString(2);
                    email = cStaff.getString(3);
                }
                cStaff.close();

                session.createLoginSession(userId, uName, "STAFF", entityId, name, regOrStaffNo, email);
                dbHelper.logActivity(userId, "Staff logged in: " + name);
                Toast.makeText(this, "Welcome Staff, " + name, Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, StaffDashboardActivity.class));
            } else if ("ADMIN".equalsIgnoreCase(role)) {
                session.createLoginSession(userId, uName, "ADMIN", userId, "Administrator", "ADMIN-01", "admin@college.edu");
                dbHelper.logActivity(userId, "Administrator logged in");
                Toast.makeText(this, "Welcome Administrator", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, AdminDashboardActivity.class));
            }
            finish();
        } else {
            if (cursor != null) cursor.close();
            Toast.makeText(this, "Invalid student Register Number or password.", Toast.LENGTH_SHORT).show();
        }
    }
}
