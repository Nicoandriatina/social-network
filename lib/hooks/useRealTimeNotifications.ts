import { useSocket } from '@/app/contexts/SocketContext';
import { useEffect, useState } from 'react';


export function useRealtimeNotifications() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    // Écouter les nouvelles notifications
    socket.on('new-notification', (notification) => {
      console.log('🔔 Nouvelle notification reçue:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Notification navigateur
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico'
        });
      }
    });

    return () => {
      socket.off('new-notification');
    };
  }, [socket]);

  // Charger les notifications initiales
  useEffect(() => {
    const loadNotifications = async () => {
      const response = await fetch('/api/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    };

    loadNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected
  };
}