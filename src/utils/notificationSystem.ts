export interface PushNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  category: 'REGISTRATION' | 'REMINDER' | 'UPDATE' | 'WAITLIST';
  targetScreen?: string;
  screenParams?: any;
  eventId?: number;
}

type NotificationListener = (notification: PushNotification) => void;

class NotificationDispatcher {
  private listeners: NotificationListener[] = [];
  private history: PushNotification[] = [];

  constructor() {
    this.history = [
      {
        id: 'init-1',
        title: 'Registration Confirmed! 🎉',
        body: 'Your pass for National Technical Symposium 2026 is confirmed. Tap to view Digital Event Pass.',
        timestamp: '10m ago',
        category: 'REGISTRATION',
        targetScreen: 'digitalPass',
        screenParams: { eventId: 1 }
      },
      {
        id: 'init-2',
        title: 'Upcoming Event Reminder ⏰',
        body: 'National Technical Symposium 2026 is scheduled tomorrow at 09:30 AM in Main Auditorium.',
        timestamp: '1h ago',
        category: 'REMINDER',
        targetScreen: 'eventDetails',
        screenParams: { event: { id: 1, name: 'National Technical Symposium 2026' } }
      }
    ];
  }

  public subscribe(listener: NotificationListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public sendPushNotification(notification: Omit<PushNotification, 'id' | 'timestamp'>) {
    const newNotif: PushNotification = {
      ...notification,
      id: 'push-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timestamp: 'Just now'
    };

    this.history.unshift(newNotif);
    this.listeners.forEach(listener => listener(newNotif));
  }

  public getHistory(): PushNotification[] {
    return [...this.history];
  }

  public clearHistory() {
    this.history = [];
  }
}

export const notificationDispatcher = new NotificationDispatcher();
