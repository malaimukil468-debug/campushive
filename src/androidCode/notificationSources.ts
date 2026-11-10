import { AndroidSourceFile } from './sourceCodeRegistry';

export const NOTIFICATION_ANDROID_FILES: AndroidSourceFile[] = [
  // 1. NOTIFICATION HELPER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/utils/NotificationHelper.java',
    category: 'database',
    title: 'NotificationHelper.java',
    description: 'System Push Notifications using NotificationManager, NotificationChannels, PendingIntent, and AlarmManager',
    content: `package com.example.eventmanagementapp.utils;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.receiver.EventReminderReceiver;
import com.example.eventmanagementapp.student.DigitalPassActivity;
import com.example.eventmanagementapp.student.EventDetailsActivity;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class NotificationHelper {

    // Notification Channel Identifiers
    public static final String CHANNEL_REGISTRATIONS = "channel_event_registrations";
    public static final String CHANNEL_REMINDERS = "channel_event_reminders";
    public static final String CHANNEL_UPDATES = "channel_live_updates";

    private static final String CHANNEL_REG_NAME = "Event Registrations & Passes";
    private static final String CHANNEL_REM_NAME = "Upcoming Event Reminders";
    private static final String CHANNEL_UPD_NAME = "Live Event Announcements";

    /**
     * Initializes all NotificationChannels for Android 8.0 (API 26) and above.
     */
    public static void createNotificationChannels(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null) return;

            // 1. Registration Confirmation Channel (High Importance with Sound & Vibration)
            NotificationChannel regChannel = new NotificationChannel(
                    CHANNEL_REGISTRATIONS,
                    CHANNEL_REG_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            regChannel.setDescription("Alerts for confirmed event registrations and digital pass generation.");
            regChannel.enableLights(true);
            regChannel.setLightColor(Color.BLUE);
            regChannel.enableVibration(true);
            regChannel.setVibrationPattern(new long[]{0, 250, 100, 250});
            manager.createNotificationChannel(regChannel);

            // 2. Event Reminder Channel (Default/High Importance)
            NotificationChannel remChannel = new NotificationChannel(
                    CHANNEL_REMINDERS,
                    CHANNEL_REM_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            remChannel.setDescription("Alerts reminding students 1 day and 1 hour before scheduled events.");
            remChannel.enableLights(true);
            remChannel.setLightColor(Color.YELLOW);
            remChannel.enableVibration(true);
            manager.createNotificationChannel(remChannel);

            // 3. Live Announcements Channel
            NotificationChannel updChannel = new NotificationChannel(
                    CHANNEL_UPDATES,
                    CHANNEL_UPD_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            updChannel.setDescription("Real-time venue shifts and organizer schedule updates.");
            manager.createNotificationChannel(updChannel);
        }
    }

    /**
     * Displays a Heads-Up Push Notification alerting the student that their registration
     * was confirmed, with a 1-tap PendingIntent to view their Digital Event Pass.
     */
    public static void sendRegistrationConfirmationNotification(Context context, String eventName, String regId, String eventDate, String venue, int eventId) {
        createNotificationChannels(context);
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        // PendingIntent to launch DigitalPassActivity
        Intent passIntent = new Intent(context, DigitalPassActivity.class);
        passIntent.putExtra("eventId", eventId);
        passIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        int requestCode = (int) System.currentTimeMillis();
        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                requestCode,
                passIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        Uri defaultSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        String bigText = "Your registration for \"" + eventName + "\" is confirmed!\n" +
                "Registration ID: " + regId + "\n" +
                "Date: " + eventDate + " | Venue: " + venue + "\n" +
                "Tap to display your Digital QR Entry Pass at the venue.";

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_REGISTRATIONS)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Registration Confirmed! 🎉")
                .setContentText("Pass ID: " + regId + " for " + eventName)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(bigText))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setSound(defaultSound)
                .setAutoCancel(true)
                .setColor(Color.parseColor("#1E40AF"))
                .setContentIntent(pendingIntent)
                .addAction(R.drawable.ic_launcher_foreground, "View Digital Pass", pendingIntent);

        int notificationId = 1000 + eventId;
        manager.notify(notificationId, builder.build());
    }

    /**
     * Sends an Upcoming Event Reminder push notification with time notice and venue info.
     */
    public static void sendEventReminderNotification(Context context, String eventName, String timeNotice, String venue, int eventId) {
        createNotificationChannels(context);
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;

        Intent detailsIntent = new Intent(context, EventDetailsActivity.class);
        detailsIntent.putExtra("eventId", eventId);
        detailsIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                eventId,
                detailsIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
        );

        String bigText = "Reminder: \"" + eventName + "\" " + timeNotice + ".\n" +
                "Venue: " + venue + "\n" +
                "Please have your Digital Pass ready for QR check-in.";

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_REMINDERS)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("Upcoming Event Reminder ⏰")
                .setContentText(eventName + " " + timeNotice)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(bigText))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setColor(Color.parseColor("#D97706"))
                .setContentIntent(pendingIntent)
                .addAction(R.drawable.ic_launcher_foreground, "Event Details", pendingIntent);

        int notificationId = 2000 + eventId;
        manager.notify(notificationId, builder.build());
    }

    /**
     * Schedules automated background alarms via AlarmManager for 1-day and 1-hour before the event.
     */
    public static void scheduleEventReminders(Context context, int eventId, String eventName, String eventDateStr, String startTimeStr, String venue) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
            Date eventTime = sdf.parse(eventDateStr + " " + startTimeStr);
            if (eventTime == null) return;

            long eventMillis = eventTime.getTime();
            long now = System.currentTimeMillis();

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager == null) return;

            // 1 Day Before Reminder (24 hours = 86,400,000 ms)
            long oneDayBefore = eventMillis - (24 * 60 * 60 * 1000);
            if (oneDayBefore > now) {
                Intent intent24h = new Intent(context, EventReminderReceiver.class);
                intent24h.putExtra("eventId", eventId);
                intent24h.putExtra("eventName", eventName);
                intent24h.putExtra("venue", venue);
                intent24h.putExtra("timeNotice", "starts tomorrow at " + startTimeStr);

                PendingIntent pi24h = PendingIntent.getBroadcast(
                        context,
                        eventId * 10 + 1,
                        intent24h,
                        PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
                );

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, oneDayBefore, pi24h);
                } else {
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, oneDayBefore, pi24h);
                }
            }

            // 1 Hour Before Reminder (1 hour = 3,600,000 ms)
            long oneHourBefore = eventMillis - (60 * 60 * 1000);
            if (oneHourBefore > now) {
                Intent intent1h = new Intent(context, EventReminderReceiver.class);
                intent1h.putExtra("eventId", eventId);
                intent1h.putExtra("eventName", eventName);
                intent1h.putExtra("venue", venue);
                intent1h.putExtra("timeNotice", "starts in 1 hour (" + startTimeStr + ")");

                PendingIntent pi1h = PendingIntent.getBroadcast(
                        context,
                        eventId * 10 + 2,
                        intent1h,
                        PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0)
                );

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, oneHourBefore, pi1h);
                } else {
                    alarmManager.setExact(AlarmManager.RTC_WAKEUP, oneHourBefore, pi1h);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
`
  },

  // 2. EVENT REMINDER BROADCAST RECEIVER
  {
    path: 'app/src/main/java/com/example/eventmanagementapp/receiver/EventReminderReceiver.java',
    category: 'database',
    title: 'EventReminderReceiver.java',
    description: 'BroadcastReceiver triggered by AlarmManager to post heads-up push notifications for scheduled events',
    content: `package com.example.eventmanagementapp.receiver;

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
`
  }
];
