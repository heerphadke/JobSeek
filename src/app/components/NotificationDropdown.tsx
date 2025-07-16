"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiCalendar, FiBriefcase, FiEye } from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'interview' | 'application' | 'view' | 'message';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'interview',
      title: 'Interview Scheduled',
      description: 'Your interview with Tech Corp is confirmed for tomorrow at 10:00 AM',
      time: '1h ago',
      read: false,
    },
    {
      id: '2',
      type: 'application',
      title: 'Application Viewed',
      description: 'Innovation Labs viewed your application',
      time: '2h ago',
      read: false,
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from the hiring manager at Future Systems',
      time: '3h ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'interview':
        return <FiCalendar className="text-purple-400" />;
      case 'application':
        return <FiBriefcase className="text-blue-400" />;
      case 'view':
        return <FiEye className="text-green-400" />;
      case 'message':
        return <FiCheck className="text-yellow-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
      >
        <FiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50"
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-gray-700/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="ml-3 flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Mark all as read
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 