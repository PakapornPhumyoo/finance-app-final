// src/components/Notifications/NotificationsPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '../../store/useNotifications';
import { useBudgetAlerts } from '../../hooks/useBudgetAlerts';

const NotificationsPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  // ใช้ hook สำหรับตรวจสอบการแจ้งเตือนงบประมาณ
  useBudgetAlerts();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget': return '🎯';
      case 'reminder': return '⏰';
      case 'alert': return '⚠️';
      case 'success': return '✅';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'budget': return 'text-orange-600';
      case 'reminder': return 'text-blue-600';
      case 'alert': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // ปิด panel เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-panel') && !target.closest('.notifications-bell')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative notifications-panel">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors notifications-bell"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">การแจ้งเตือน</h3>
              <div className="flex items-center space-x-2">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    อ่านทั้งหมด
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p className="font-medium">ไม่มีการแจ้งเตือน</p>
                <p className="text-sm mt-1">เมื่อมีอัปเดตใหม่จะแสดงที่นี่</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex space-x-3">
                    <div className={`text-lg flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`font-medium text-sm mb-1 ${
                          !notification.read ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0">
                            ใหม่
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-xs">
                          {new Date(notification.createdAt).toLocaleDateString('th-TH', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-red-500 text-xs transition-colors"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                {unreadCount} การแจ้งเตือนที่ยังไม่อ่าน
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;