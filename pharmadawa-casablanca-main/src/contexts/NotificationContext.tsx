import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Notification {
  id: string;
  type: "new_order" | "order_status_change" | "other";
  title: string;
  message: string;
  order?: {
    id: string;
    [key: string]: any;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isAuthenticated } = useAuth();
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
        }/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
        }/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Start polling when authenticated
  useEffect(() => {
    if (isAuthenticated && !pollingInterval) {
      // Initial fetch
      fetchNotifications();

      // Set up polling every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [isAuthenticated]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
