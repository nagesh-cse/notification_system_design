import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
const socket = io("http://localhost:8000");

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [notificationAlert, setNotificationAlert] = useState();
  const currentUser = localStorage.getItem('currentUser');
  const timeoutRef = useRef();

  useEffect(() => {
    if (!currentUser) return;

    socket.emit('join', currentUser);

    // Listen for real-time notifications
    const handleNotification = (notif) => {
      console.log("Alert Notification: ", notif);
      setNotificationAlert(notif);
      setNotifications((prev) => [notif, ...prev]);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setNotificationAlert(null), 5000);
    };

    socket.on('notification', handleNotification);

    // Fetch notifications from the database on mount/user change
    fetch(`http://localhost:8000/notifications/${currentUser}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off('notification', handleNotification);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 font-sans">
      <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
        Notifications for {currentUser}
      </h2>
      {notificationAlert && (
        <div
          className="flex items-center gap-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg px-5 py-4 mb-5 shadow"
        >
          <span role="img" aria-label="alert">🔔</span>
          <span className="font-medium text-base">
            New notification: {notificationAlert.message}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {notifications.map((n, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow px-6 py-5 border-l-4 border-blue-600 text-gray-900 text-sm transition-shadow"
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}