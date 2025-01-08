'use client';
import { useEffect, useState } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { Notification } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Image } from '@nextui-org/react';
import { MdEmail } from 'react-icons/md';
import { Spinner } from '@nextui-org/react';

export default function Page() {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [notifications, setNotifications] = useState<any>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const { onGetNotificationByUserId, markNotificationAsRead } =
    useNotification();

  useEffect(() => {
    const fetchNotifications = async () => {
      const fetchedNotifications = await onGetNotificationByUserId(userId);

      // Sort notifications by createdAt (newest first)
      const sortedNotifications = fetchedNotifications.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Newest first
      );

      setNotifications(sortedNotifications);

      const unread = sortedNotifications.filter(
        (noti: Notification) => !noti.isRead
      ).length;
      setUnreadCount(unread);
      setIsLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark the notification as read
    setUnreadCount(unreadCount > 0 ? unreadCount - 1 : unreadCount);

    // Set the selected notification
    setSelectedNotification(notification);
    setNotifications(
      notifications.map((noti: Notification) =>
        noti.id === notification.id ? { ...noti, isRead: true } : noti
      )
    );
    console.log('Selected notification:', selectedNotification);
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  return isLoading ? (
    <Spinner
      className="w-full flex items-center justify-center mt-24"
      label="Đang tải..."
      color="warning"
      labelColor="warning"
    />
  ) : (
    <div className="max-w-6xl mx-auto p-4 my-6">
      {/* Header */}
      <div className="w-fit p-2 flex gap-3 mb-6 items-center border-2 border-orange rounded-lg">
        <div className="text-xl font-bold flex items-center justify-center gap-2">
          <MdEmail size={25} className="flex items-center justify-center" />
          <span>Hộp thư</span>
        </div>

        <div className="bg-orange text-white text-md font-bold rounded-full px-3 py-1">
          {unreadCount}
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar (List of Notifications) */}
        <div className="w-1/3 max-h-[600px] overflow-y-auto shadow-lg border-2 border-orange rounded-lg">
          {notifications?.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col p-3 cursor-pointer border-b hover:bg-gray-100 gap-3 text-gray-500 hover:shadow-lg  ${
                !notification.isRead ? 'bg-white ' : 'bg-gray-200'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div
                className={`${
                  !notification.isRead
                    ? 'font-bold text-black'
                    : 'font-semibold'
                }`}
              >
                {notification.title}
              </div>
              <div className="text-sm ">
                {notification.content.length > 100
                  ? notification.content.substring(0, 100) + '...'
                  : notification.content}
              </div>
              <div className="text-xs ">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content (Selected Notification) */}
        <div className="w-2/3 shadow-lg rounded-lg px-8 py-6 border-2 border-orange">
          {selectedNotification ? (
            <div>
              <div className="text-xl font-bold mb-3">
                {selectedNotification.title}
              </div>
              <hr className="mb-3" />
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-3 ">
                  <Image
                    src={selectedNotification?.createdByUser?.avatar}
                    alt="User Avatar"
                    width={40} // Avatar size
                    height={40}
                    className="rounded-full" // Makes the image circular
                  />
                  <span>
                    {selectedNotification?.createdByUser?.name || 'Anonymous'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mb-5">
                  {new Date(selectedNotification.createdAt).toLocaleString()}
                </div>
              </div>
              <hr className="mb-3" />
              <div className="text-base">{selectedNotification.content}</div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Chọn một thông báo để xem chi tiết.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
