package com.example.eventmanagementapp.utils;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import com.example.eventmanagementapp.LoginActivity;

public class SessionManager {

    private static final String PREF_NAME = "EventAppSession";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";
    private static final String KEY_USER_ID = "userId";
    private static final String KEY_USERNAME = "username";
    private static final String KEY_ROLE = "role"; // ADMIN, STAFF, STUDENT
    private static final String KEY_STUDENT_ID = "studentId";
    private static final String KEY_STAFF_ID = "staffId";
    private static final String KEY_NAME = "name";
    private static final String KEY_REG_NO = "regNumber";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_DARK_MODE = "darkMode";
    private static final String KEY_LANGUAGE = "language"; // "en" or "ta"

    private SharedPreferences pref;
    private SharedPreferences.Editor editor;
    private Context context;

    public SessionManager(Context context) {
        this.context = context;
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = pref.edit();
    }

    public void createLoginSession(int userId, String username, String role, int entityId, String name, String regOrStaffNo, String email) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putInt(KEY_USER_ID, userId);
        editor.putString(KEY_USERNAME, username);
        editor.putString(KEY_ROLE, role);
        editor.putString(KEY_NAME, name);
        editor.putString(KEY_EMAIL, email);

        if ("STUDENT".equalsIgnoreCase(role)) {
            editor.putInt(KEY_STUDENT_ID, entityId);
            editor.putString(KEY_REG_NO, regOrStaffNo);
        } else if ("STAFF".equalsIgnoreCase(role)) {
            editor.putInt(KEY_STAFF_ID, entityId);
            editor.putString(KEY_REG_NO, regOrStaffNo);
        }
        editor.apply();
    }

    public boolean isLoggedIn() {
        return pref.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public int getUserId() {
        return pref.getInt(KEY_USER_ID, -1);
    }

    public String getUsername() {
        return pref.getString(KEY_USERNAME, "");
    }

    public String getUserRole() {
        return pref.getString(KEY_ROLE, "");
    }

    public int getStudentId() {
        return pref.getInt(KEY_STUDENT_ID, -1);
    }

    public int getStaffId() {
        return pref.getInt(KEY_STAFF_ID, -1);
    }

    public String getName() {
        return pref.getString(KEY_NAME, "User");
    }

    public String getRegNumber() {
        return pref.getString(KEY_REG_NO, "");
    }

    public String getEmail() {
        return pref.getString(KEY_EMAIL, "");
    }

    public void setDarkMode(boolean enabled) {
        editor.putBoolean(KEY_DARK_MODE, enabled);
        editor.apply();
    }

    public boolean isDarkMode() {
        return pref.getBoolean(KEY_DARK_MODE, false);
    }

    public void setLanguage(String lang) {
        editor.putString(KEY_LANGUAGE, lang);
        editor.apply();
    }

    public String getLanguage() {
        return pref.getString(KEY_LANGUAGE, "en");
    }

    public void logoutUser() {
        editor.clear();
        editor.apply();
        Intent intent = new Intent(context, LoginActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        context.startActivity(intent);
    }
}
