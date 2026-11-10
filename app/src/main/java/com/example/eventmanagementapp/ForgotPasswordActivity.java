package com.example.eventmanagementapp;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.example.eventmanagementapp.database.DatabaseHelper;

public class ForgotPasswordActivity extends AppCompatActivity {

    private EditText etIdentifier, etNewPassword, etConfirmNewPassword;
    private Button btnResetPassword, btnBack;
    private DatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgot_password);

        dbHelper = new DatabaseHelper(this);

        etIdentifier = findViewById(R.id.etIdentifier);
        etNewPassword = findViewById(R.id.etNewPassword);
        etConfirmNewPassword = findViewById(R.id.etConfirmNewPassword);
        btnResetPassword = findViewById(R.id.btnResetPassword);
        btnBack = findViewById(R.id.btnBack);

        btnResetPassword.setOnClickListener(v -> resetPassword());
        btnBack.setOnClickListener(v -> finish());
    }

    private void resetPassword() {
        String identifier = etIdentifier.getText().toString().trim();
        String newPass = etNewPassword.getText().toString().trim();
        String confirmPass = etConfirmNewPassword.getText().toString().trim();

        if (TextUtils.isEmpty(identifier) || TextUtils.isEmpty(newPass)) {
            Toast.makeText(this, "Please enter all fields.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (!newPass.equals(confirmPass)) {
            etConfirmNewPassword.setError("Passwords do not match");
            return;
        }

        SQLiteDatabase db = dbHelper.getWritableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, user_id FROM " + DatabaseHelper.TABLE_STUDENTS +
                " WHERE LOWER(email) = LOWER(?) OR UPPER(register_number) = UPPER(?)", new String[]{identifier, identifier});

        int userId = -1;
        if (cursor.moveToFirst()) {
            userId = cursor.getInt(1);
        }
        cursor.close();

        if (userId == -1) {
            Cursor cUser = db.rawQuery("SELECT id FROM " + DatabaseHelper.TABLE_USERS + " WHERE LOWER(username) = LOWER(?)", new String[]{identifier});
            if (cUser.moveToFirst()) {
                userId = cUser.getInt(0);
            }
            cUser.close();
        }

        if (userId != -1) {
            ContentValues cv = new ContentValues();
            cv.put("password", newPass);
            db.update(DatabaseHelper.TABLE_USERS, cv, "id = ?", new String[]{String.valueOf(userId)});
            dbHelper.logActivity(userId, "Password reset successfully");
            Toast.makeText(this, "Password updated successfully! Please login.", Toast.LENGTH_LONG).show();
            finish();
        } else {
            Toast.makeText(this, "No account found matching the given identifier.", Toast.LENGTH_SHORT).show();
        }
    }
}
