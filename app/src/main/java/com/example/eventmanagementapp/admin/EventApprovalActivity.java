package com.example.eventmanagementapp.admin;

import android.content.ContentValues;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.adapter.EventApprovalAdapter;
import com.example.eventmanagementapp.database.DatabaseHelper;
import com.example.eventmanagementapp.model.EventItem;
import com.example.eventmanagementapp.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

public class EventApprovalActivity extends AppCompatActivity {

    private RecyclerView rvPendingEvents;
    private TextView tvEmptyNotice;
    private DatabaseHelper dbHelper;
    private SessionManager session;
    private EventApprovalAdapter adapter;
    private List<EventItem> pendingList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_event_approval);

        dbHelper = new DatabaseHelper(this);
        session = new SessionManager(this);

        rvPendingEvents = findViewById(R.id.rvPendingEvents);
        tvEmptyNotice = findViewById(R.id.tvEmptyNotice);
        rvPendingEvents.setLayoutManager(new LinearLayoutManager(this));

        pendingList = new ArrayList<>();
        adapter = new EventApprovalAdapter(this, pendingList, new EventApprovalAdapter.OnApprovalListener() {
            @Override
            public void onApprove(EventItem event) {
                updateEventStatus(event.getId(), "Upcoming", "Approved");
            }

            @Override
            public void onReject(EventItem event) {
                updateEventStatus(event.getId(), "Rejected", "Rejected");
            }
        });
        rvPendingEvents.setAdapter(adapter);

        loadPendingEvents();
    }

    private void loadPendingEvents() {
        pendingList.clear();
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.rawQuery("SELECT id, name, description, category, date, start_time, end_time, venue, organizer, capacity FROM " +
                DatabaseHelper.TABLE_EVENTS + " WHERE status = 'Pending'", null);

        while (cursor.moveToNext()) {
            EventItem item = new EventItem(
                    cursor.getInt(0),
                    cursor.getString(1),
                    cursor.getString(2),
                    cursor.getString(3),
                    cursor.getString(4),
                    cursor.getString(5),
                    cursor.getString(6),
                    cursor.getString(7),
                    cursor.getString(8),
                    cursor.getInt(9)
            );
            pendingList.add(item);
        }
        cursor.close();
        adapter.notifyDataSetChanged();

        tvEmptyNotice.setVisibility(pendingList.isEmpty() ? View.VISIBLE : View.GONE);
    }

    private void updateEventStatus(int eventId, String newStatus, String actionLabel) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put("status", newStatus);
        db.update(DatabaseHelper.TABLE_EVENTS, cv, "id = ?", new String[]{String.valueOf(eventId)});

        dbHelper.logActivity(session.getUserId(), "Admin " + actionLabel + " event ID: " + eventId);
        Toast.makeText(this, "Event " + actionLabel + " successfully.", Toast.LENGTH_SHORT).show();
        loadPendingEvents();
    }
}
