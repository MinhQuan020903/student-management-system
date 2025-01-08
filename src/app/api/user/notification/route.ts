import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get('userId') || '1');

  if (!userId) {
    return new Response(JSON.stringify('User not found'), { status: 403 });
  }

  try {
    const res = await prisma.notification.findMany({
      where: {
        userId: userId,
      },
      include: {
        createdByUser: true,
      },
    });
    console.log('res:', res);

    // If there are notifications, return them; otherwise, return an empty array
    return new Response(JSON.stringify(res.length > 0 ? res : []), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const notificationId = parseInt(searchParams.get('notificationId') || '0');

  if (!notificationId) {
    return new Response(JSON.stringify('Notification not found'), {
      status: 404,
    });
  }

  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return new Response(JSON.stringify(updatedNotification), { status: 200 });
  } catch (error) {
    console.error('Error updating notification as read:', error);
    return new Response(JSON.stringify('Error marking notification as read'), {
      status: 500,
    });
  }
}
