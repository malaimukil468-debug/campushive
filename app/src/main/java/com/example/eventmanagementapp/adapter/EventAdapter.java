package com.example.eventmanagementapp.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.model.EventItem;
import java.util.List;

public class EventAdapter extends RecyclerView.Adapter<EventAdapter.EventViewHolder> {

    public interface OnEventClickListener {
        void onEventClick(EventItem event);
    }

    private Context context;
    private List<EventItem> eventList;
    private OnEventClickListener listener;

    public EventAdapter(Context context, List<EventItem> eventList, OnEventClickListener listener) {
        this.context = context;
        this.eventList = eventList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public EventViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_event, parent, false);
        return new EventViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull EventViewHolder holder, int position) {
        EventItem event = eventList.get(position);
        holder.tvEventName.setText(event.getName());
        holder.tvCategory.setText(event.getCategory());
        holder.tvDate.setText("📅 " + event.getDate() + " | " + event.getStartTime());
        holder.tvVenue.setText("📍 " + event.getVenue());

        int available = event.getAvailableSeats();
        if (available <= 0) {
            holder.tvAvailableSeats.setText("FULL (Waitlist)");
            holder.tvAvailableSeats.setTextColor(Color.RED);
        } else {
            holder.tvAvailableSeats.setText(available + " Seats Left");
            holder.tvAvailableSeats.setTextColor(Color.parseColor("#059669"));
        }

        holder.itemView.setOnClickListener(v -> {
            if (listener != null) listener.onEventClick(event);
        });
    }

    @Override
    public int getItemCount() {
        return eventList.size();
    }

    public static class EventViewHolder extends RecyclerView.ViewHolder {
        TextView tvEventName, tvCategory, tvDate, tvVenue, tvAvailableSeats;

        public EventViewHolder(@NonNull View itemView) {
            super(itemView);
            tvEventName = itemView.findViewById(R.id.tvEventName);
            tvCategory = itemView.findViewById(R.id.tvCategory);
            tvDate = itemView.findViewById(R.id.tvDate);
            tvVenue = itemView.findViewById(R.id.tvVenue);
            tvAvailableSeats = itemView.findViewById(R.id.tvAvailableSeats);
        }
    }
}
