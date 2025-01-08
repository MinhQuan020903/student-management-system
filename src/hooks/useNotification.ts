import { getRequest, patchRequest } from '@/lib/fetch';

export const useNotification = () => {
  const onGetNotificationByUserId = async (userId: number): Promise<any[]> => {
    try {
      // Perform the API request to fetch notifications
      const res = await getRequest({
        endPoint: `/api/user/notification?userId=${userId}`,
      });

      // Ensure that res is of the expected type (Notification array)
      if (Array.isArray(res)) {
        return res.length > 0 ? res : [];
      } else {
        console.error('Invalid response format:', res);
        return [];
      }
    } catch (error) {
      console.error('Error fetching notifications for userId', userId, error);
      return [];
    }
  };

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      const res = await patchRequest({
        endPoint: `/api/user/notification?notificationId=${notificationId}`,
        formData: {},
        isFormData: false,
      });

      return res; // Return the updated notification
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return { onGetNotificationByUserId, markNotificationAsRead };
};
