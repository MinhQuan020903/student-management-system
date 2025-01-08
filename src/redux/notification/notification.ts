import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@prisma/client';
import { useNotification } from '@/hooks/useNotification';

const { onGetNotificationByUserId, markNotificationAsRead } = useNotification();

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  selectedNotification: Notification | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  selectedNotification: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Set notifications after fetching them
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      const sortedNotifications = action.payload.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      state.notifications = sortedNotifications;
      state.unreadCount = sortedNotifications.filter(
        (noti) => !noti.isRead
      ).length;
      state.isLoading = false;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Select a notification and mark it as read
    selectNotification: (state, action: PayloadAction<Notification>) => {
      const selectedNotification = action.payload;
      state.selectedNotification = selectedNotification;

      // Mark the notification as read
      state.notifications = state.notifications.map((noti) =>
        noti.id === selectedNotification.id ? { ...noti, isRead: true } : noti
      );

      // Update unread count
      state.unreadCount = state.notifications.filter(
        (noti) => !noti.isRead
      ).length;

      // Call the API to mark it as read
      markNotificationAsRead(selectedNotification.id);
    },

    // Add a new notification
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount++;
      }
    },

    // Delete a notification
    deleteNotification: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(
        (notification) => notification.id === action.payload.id
      );
      if (index !== -1) {
        state.notifications.splice(index, 1);
        if (!action.payload.isRead) {
          state.unreadCount--;
        }
      }
    },
  },
});

export const {
  setNotifications,
  setLoading,
  selectNotification,
  addNotification,
  deleteNotification,
} = notificationSlice.actions;

// Async action to fetch notifications
export const fetchNotifications = (userId: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const fetchedNotifications = await onGetNotificationByUserId(userId);
    dispatch(setNotifications(fetchedNotifications));
  } catch (error) {
    dispatch(setLoading(false));
    console.error('Failed to fetch notifications:', error);
  }
};

export default notificationSlice.reducer;
