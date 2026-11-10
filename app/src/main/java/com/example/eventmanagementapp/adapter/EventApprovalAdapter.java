package com.example.eventmanagementapp.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.eventmanagementapp.R;
import com.example.eventmanagementapp.model.EventItem;
import java.util.List;

public class EventApprovalAdapter extends RecyclerView.Adapter<EventApprovalAdapter.ApprovalViewHolder> {

    public interface OnApprovalListener {
        void onApprove(EventItem event);
        void onReject(EventItem event);
    }

    private Context context;
    private List<EventItem> list;
    private OnApprovalListener listener;

    public EventApprovalAdapter(Context context, List<EventItem> list, OnApprovalListener listener) {
        this.context = context;
        this.list = list;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ApprovalViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_event_approval, parent, false);
        return new ApprovalViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ApprovalViewHolder holder, int position) {
        EventItem item = list.get(position);
        holder.tvTitle.setText(item.getName());
        holder.tvDetails.setText("Date: " + item.getDate() + " " + item.getStartTime() + "\nVenue: " + item.getVenue() + "\nOrganizer: " + item.getOrganizer());

        holder.btnApprove.setOnClickListener(v -> {
            if (listener != null) listener.onApprove(item);
        });

        holder.btnReject.setOnClickListener(v -> {
            if (listener != null) listener.onReject(item);
        });
    }

    @Override
    public int getItemCount() {
        return list.size();
    }

    public static class ApprovalViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvDetails;
        Button btnApprove, btnReject;

        public ApprovalViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvDetails = itemView.findViewById(R.id.tvDetails);
            btnApprove = itemView.findViewById(R.id.btnApprove);
            btnReject = itemView.findViewById(R.id.btnReject);
        }
    }
}
