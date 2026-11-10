package com.example.eventmanagementapp.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.example.eventmanagementapp.utils.NotificationHelper;

public class EventReminderReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;

        int eventId = intent.getIntExtra("eventId", -1);
        String eventName = intent.getStringExtra("eventName");
        String venue = intent.getStringExtra("venue");
        String timeNotice = intent.getStringExtra("timeNotice");

        if (eventName != null && timeNotice != null) {
            NotificationHelper.sendEventReminderNotification(
                    context,
                    eventName,
                    timeNotice,
                    venue != null ? venue : "Campus Venue",
                    eventId
            );
        }
    }
}
