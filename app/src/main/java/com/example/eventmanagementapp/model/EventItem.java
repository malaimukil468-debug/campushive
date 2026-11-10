package com.example.eventmanagementapp.model;

public class EventItem {
    private int id;
    private String name;
    private String description;
    private String category;
    private String date;
    private String startTime;
    private String endTime;
    private String venue;
    private String organizer;
    private int capacity;
    private int registeredCount;
    private String status;

    public EventItem(int id, String name, String description, String category, String date,
                     String startTime, String endTime, String venue, String organizer, int capacity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.venue = venue;
        this.organizer = organizer;
        this.capacity = capacity;
        this.status = "Upcoming";
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getDate() { return date; }
    public String getStartTime() { return startTime; }
    public String getEndTime() { return endTime; }
    public String getVenue() { return venue; }
    public String getOrganizer() { return organizer; }
    public int getCapacity() { return capacity; }
    public int getRegisteredCount() { return registeredCount; }
    public void setRegisteredCount(int registeredCount) { this.registeredCount = registeredCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getAvailableSeats() {
        return Math.max(0, capacity - registeredCount);
    }
}
