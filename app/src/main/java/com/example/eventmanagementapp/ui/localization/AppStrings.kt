package com.example.eventmanagementapp.ui.localization

data class LocalizedLabels(
    val portalTitle: String,
    val studentPortal: String,
    val staffConsole: String,
    val adminControl: String,
    val browseEvents: String,
    val digitalPass: String,
    val myRegistrations: String,
    val certificates: String,
    val upcoming: String,
    val myEvents: String,
    val alerts: String,
    val logout: String,
    val settings: String,
    val mainActions: String,
    val moreFeatures: String,
    val eventDirectory: String,
    val createEvent: String,
    val qrCheckIn: String,
    val manageEvents: String,
    val registrations: String,
    val eventApprovals: String,
    val manageStaff: String,
    val activityLogs: String,
    val analyticsReports: String,
    val helpFaq: String
)

object AppStrings {
    private val en = LocalizedLabels(
        portalTitle = "Campus Event Portal",
        studentPortal = "Student Portal",
        staffConsole = "Faculty & Staff Console",
        adminControl = "System Control Panel",
        browseEvents = "Browse Events",
        digitalPass = "Digital Event Pass",
        myRegistrations = "My Registrations",
        certificates = "Certificates",
        upcoming = "Upcoming",
        myEvents = "My Events",
        alerts = "Alerts",
        logout = "Logout",
        settings = "App Settings",
        mainActions = "Main Actions",
        moreFeatures = "More Features",
        eventDirectory = "Event Directory",
        createEvent = "Create Event",
        qrCheckIn = "QR Check-In",
        manageEvents = "Manage Events",
        registrations = "Registrations",
        eventApprovals = "Event Approvals",
        manageStaff = "Manage Staff",
        activityLogs = "Activity Logs",
        analyticsReports = "Attendance & Registration Analytics",
        helpFaq = "Help & FAQ Knowledgebase"
    )

    private val ta = LocalizedLabels(
        portalTitle = "வளாக நிகழ்வு இணையதளம்",
        studentPortal = "மாணவர் பகுதி",
        staffConsole = "ஆசிரியர் கட்டுப்பாட்டு அறை",
        adminControl = "நிர்வாக கட்டுப்பாட்டு அறை",
        browseEvents = "நிகழ்வுகளைப் பார்",
        digitalPass = "டிஜிட்டல் அனுமதிச் சீட்டு",
        myRegistrations = "என் பதிவுகள்",
        certificates = "சான்றிதழ்கள்",
        upcoming = "வரவிருக்கும்",
        myEvents = "என் நிகழ்வுகள்",
        alerts = "அறிவிப்புகள்",
        logout = "வெளியேறு",
        settings = "அமைப்புகள்",
        mainActions = "முக்கிய செயல்கள்",
        moreFeatures = "மேலும் வசதிகள்",
        eventDirectory = "நிகழ்வு பட்டியல்",
        createEvent = "நிகழ்வு உருவாக்கு",
        qrCheckIn = "QR வருகை பதிவு",
        manageEvents = "நிகழ்வு நிர்வாகம்",
        registrations = "பதிவு பட்டியல்",
        eventApprovals = "நிகழ்வு ஒப்புதல்கள்",
        manageStaff = "ஆசிரியர் நிர்வாகம்",
        activityLogs = "செயல்பாட்டு பதிவுகள்",
        analyticsReports = "வருகை மற்றும் பதிவு பகுப்பாய்வு",
        helpFaq = "உதவி & கேள்விகள்"
    )

    fun forLanguage(lang: String): LocalizedLabels = if (lang == "ta") ta else en
}
