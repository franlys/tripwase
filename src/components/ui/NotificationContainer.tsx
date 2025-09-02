import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import type { Notification } from '../../contexts/NotificationContext';

const NotificationItem: React.FC<{ 
  notification: Notification; 
  onRemove: (id: string) => void; 
}> = ({ notification, onRemove }) => {
  const getNotificationStyle = (type: Notification['type']) => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      maxWidth: '400px',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      transform: 'translateX(0)',
      transition: 'all 0.3s ease-out'
    };

    const typeStyles = {
      success: { backgroundColor: '#10b981', color: 'white', borderLeft: '4px solid #059669' },
      error: { backgroundColor: '#ef4444', color: 'white', borderLeft: '4px solid #dc2626' },
      warning: { backgroundColor: '#f59e0b', color: 'white', borderLeft: '4px solid #d97706' },
      info: { backgroundColor: '#3b82f6', color: 'white', borderLeft: '4px solid #2563eb' }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  const getIcon = (type: Notification['type']) => {
    const icons = { success: '✓', error: '×', warning: '⚠', info: 'i' };
    return icons[type];
  };

  return (
    <div style={getNotificationStyle(notification.type)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: '12px', fontSize: '14px', fontWeight: 'bold'
        }}>
          {getIcon(notification.type)}
        </div>
        
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
            {notification.title}
          </h4>
          <p style={{ margin: '0', fontSize: '13px', opacity: 0.9, lineHeight: '1.4' }}>
            {notification.message}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => onRemove(notification.id)}
        style={{
          background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer', fontSize: '18px', padding: '0',
          width: '20px', height: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: '20px', right: '20px',
      zIndex: 1000, pointerEvents: 'none'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
