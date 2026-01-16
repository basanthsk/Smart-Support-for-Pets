import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { PetProfile } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface RoutineTask {
  id: string;
  task: string;
  startHour: number;
  endHour: number;
  timeLabel: string;
}

export const STAT_ROUTINE: RoutineTask[] = [
  { id: 'morning_walk', task: 'Morning Walk', startHour: 7, endHour: 8, timeLabel: '07:00 - 08:00' },
  { id: 'breakfast', task: 'Breakfast', startHour: 8, endHour: 9, timeLabel: '08:30 - 09:00' },
  { id: 'midday_play', task: 'Mid-day Play', startHour: 12, endHour: 13, timeLabel: '12:00 - 13:00' },
  { id: 'dinner', task: 'Dinner Time', startHour: 18, endHour: 19, timeLabel: '18:00 - 19:00' },
  { id: 'night_walk', task: 'Night Walk', startHour: 21, endHour: 22, timeLabel: '21:00 - 22:00' },
];

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  permissionStatus: NotificationPermission;
  addNotification: (title: string, message: string, type?: AppNotification['type']) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  requestPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    'Notification' in window ? (Notification.permission as NotificationPermission) : 'denied'
  );
  
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (!user) return [];
    const saved = localStorage.getItem(`notifications_${user?.uid}`);
    return saved ? JSON.parse(saved) : [];
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications_${user.uid}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      requestPermission();
    }
  }, [requestPermission]);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'] = 'info') => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 20));

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: 'https://res.cloudinary.com/dazlddxht/image/upload/v1768234409/SS_Paw_Pal_Logo_aceyn8.png'
        });
      } catch (e) {
        console.error("Failed to trigger system notification", e);
      }
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    if (!user) return;

    const checkGlobalReminders = () => {
      const today = new Date();
      const todayKey = today.toISOString().split('T')[0];
      const currentHour = today.getHours();
      const currentMinutes = today.getMinutes();

      // 1. Check Pet Records (Vaccines/Weight)
      const savedPetsStr = localStorage.getItem(`ssp_pets_${user.uid}`);
      if (!savedPetsStr) return;
      const pets: PetProfile[] = JSON.parse(savedPetsStr);

      pets.forEach(pet => {
        // Vaccination Checks
        pet.vaccinations?.forEach(v => {
          if (!v.nextDueDate) return;
          const dueDate = new Date(v.nextDueDate);
          const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7 && diffDays > 0) {
            const alreadyNotified = notifications.some(n => n.message.includes(v.name) && n.timestamp.startsWith(todayKey));
            if (!alreadyNotified) {
              addNotification('Action Required: Vaccine', `${pet.name}'s ${v.name} booster is due in ${diffDays} days!`, 'warning');
            }
          }
        });

        // Routine Task Checks (The Proactive Logic)
        STAT_ROUTINE.forEach(task => {
          const activeKey = `notified_active_${task.id}_${todayKey}_${pet.id}`;
          const upcomingKey = `notified_upcoming_${task.id}_${todayKey}_${pet.id}`;

          // TRIGGER: On the Hour (Active)
          if (currentHour === task.startHour && currentMinutes < 5) {
            if (!localStorage.getItem(activeKey)) {
              addNotification(
                `Care Alert: ${task.task}`,
                `Time to start ${task.task} for ${pet.name}. Schedule: ${task.timeLabel}.`,
                'info'
              );
              localStorage.setItem(activeKey, 'true');
            }
          }

          // TRIGGER: 30 Minutes Before (Upcoming)
          const isUpcomingWindow = (currentHour === task.startHour - 1 && currentMinutes >= 30);
          if (isUpcomingWindow) {
            if (!localStorage.getItem(upcomingKey)) {
              addNotification(
                `Upcoming: ${task.task}`,
                `Getting ready? ${task.task} for ${pet.name} starts in about 30 minutes.`,
                'info'
              );
              localStorage.setItem(upcomingKey, 'true');
            }
          }
        });
      });
    };

    // Check every minute for higher precision
    const interval = setInterval(checkGlobalReminders, 60000);
    checkGlobalReminders(); // Initial check
    return () => clearInterval(interval);
  }, [user, addNotification, notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, permissionStatus, addNotification, markAsRead, clearAll, requestPermission }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};