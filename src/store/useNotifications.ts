// src/store/useNotifications.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'budget' | 'reminder' | 'alert' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'> & { id?: string }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotifications = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const { notifications } = get();
        
        const newNotification: Notification = {
          ...notification,
          id: notification.id || Date.now().toString(), // ใช้ custom ID ถ้ามี, ถ้าไม่มีใช้ timestamp
          read: false,
          createdAt: new Date().toISOString(),
        };
        
        // ตรวจสอบว่าไม่มีการแจ้งเตือนซ้ำ
        const isDuplicate = notifications.some(
          n => n.id === newNotification.id || 
               (n.type === newNotification.type && n.message === newNotification.message)
        );
        
        if (!isDuplicate) {
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));
        }
      },
      
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0,
        }));
      },
      
      deleteNotification: (id) => {
        set((state) => {
          const notification = state.notifications.find((notif) => notif.id === id);
          return {
            notifications: state.notifications.filter((notif) => notif.id !== id),
            unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
          };
        });
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
    }),
    {
      name: 'notifications-storage',
    }
  )
);