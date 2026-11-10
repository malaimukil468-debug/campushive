package com.example.eventmanagementapp;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;

public class StudentSignupActivity extends AppCompatActivity {

    private EditText etName, etRegisterNumber, etEmail, etPhone, etUsername, etPassword, etConfirmPassword;
    private Spinner spDepartment, spYear;
    private Button btnSignUp, btnBackToLogin;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_signup);

        dbHelper = new DatabaseHelper(this);

        etName = findViewById(R.id.etName);
        etRegisterNumber = findViewById(R.id.etRegisterNumber);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        etConfirmPassword = findViewById(R.id.etConfirmPassword);
        spDepartment = findViewById(R.id.spDepartment);
        spYear = findViewById(R.id.spYear);
        btnSignUp = findViewById(R.id.btnSignUp);
        btnBackToLogin = findViewById(R.id.btnBackToLogin);

        // Populate Department Spinner
        String[] departments = {"Master of Computer Applications", "Computer Science and Engineering", "Information Technology", "Electronics & Communication", "Electrical & Electronics", "Mechanical Engineering", "Civil Engineering", "Biotechnology", "Management Studies"};
        ArrayAdapter<String> deptAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, departments);
        spDepartment.setAdapter(deptAdapter);

        // Populate Year Spinner
        String[] years = {"First Year (I)", "Second Year (II)", "Third Year (III)", "Final Year (IV)", "Postgraduate (PG)"};
        ArrayAdapter<String> yearAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, years);
        spYear.setAdapter(yearAdapter);

        btnSignUp.setOnClickListener(v -> performRegistration());
        btnBackToLogin.setOnClickListener(v -> finish());
    }

    private void performRegistration() {
        String name = etName.getText().toString().trim();
        String regNo = etRegisterNumber.getText().toString().trim();
        String department = spDepartment.getSelectedItem().toString();
        String year = spYear.getSelectedItem().toString();
        String email = etEmail.getText().toString().trim();
        String phone = etPhone.getText().toString().trim();
        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString();
        String confirmPassword = etConfirmPassword.getText().toString();

        if (TextUtils.isEmpty(name) || TextUtils.isEmpty(regNo) || TextUtils.isEmpty(email) ||
                TextUtils.isEmpty(phone) || TextUtils.isEmpty(username) || TextUtils.isEmpty(password)) {
            Toast.makeText(this, "Please fill in all required fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.setError("Enter a valid email address");
            etEmail.requestFocus();
            return;
        }

        if (phone.length() < 10) {
            etPhone.setError("Enter a valid 10-digit mobile number");
            etPhone.requestFocus();
            return;
        }

        if (password.length() < 4) {
            etPassword.setError("Password must be at least 4 characters");
            etPassword.requestFocus();
            return;
        }

        if (!password.equals(confirmPassword)) {
            etConfirmPassword.setError("Passwords do not match");
            etConfirmPassword.requestFocus();
            return;
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();

        // Duplicate checks
        Cursor cUser = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_USERS + " WHERE LOWER(username) = LOWER(?)", new String[]{username});
        if (cUser.moveToFirst()) {
            cUser.close();
            etUsername.setError("Username is already taken");
            etUsername.requestFocus();
            return;
        }
        cUser.close();

        Cursor cReg = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE UPPER(register_number) = UPPER(?)", new String[]{regNo});
        if (cReg.moveToFirst()) {
            cReg.close();
            etRegisterNumber.setError("Register Number already exists");
            etRegisterNumber.requestFocus();
            return;
        }
        cReg.close();

        Cursor cEmail = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_STUDENTS + " WHERE LOWER(email) = LOWER(?)", new String[]{email});
        if (cEmail.moveToFirst()) {
            cEmail.close();
            etEmail.setError("Email is already registered");
            etEmail.requestFocus();
            return;
        }
        cEmail.close();

        // Insert into Users table
        ContentValues cvUser = new ContentValues();
        cvUser.put("username", username);
        cvUser.put("password", password);
        cvUser.put("role", "STUDENT");
        cvUser.put("status", "ACTIVE");
        long userId = db.insert(DatabaseHelper.TABLE_USERS, null, cvUser);

        // Insert into Students table
        ContentValues cvStudent = new ContentValues();
        cvStudent.put("user_id", userId);
        cvStudent.put("name", name);
        cvStudent.put("register_number", regNo);
        cvStudent.put("department", department);
        cvStudent.put("year", year);
        cvStudent.put("email", email);
        cvStudent.put("phone", phone);
        db.insert(DatabaseHelper.TABLE_STUDENTS, null, cvStudent);

        dbHelper.logActivity((int) userId, "Student registration completed for: " + name + " (" + regNo + ")");
        Toast.makeText(this, "Registration successful! You can now log in.", Toast.LENGTH_LONG).show();
        finish();
    }
}
