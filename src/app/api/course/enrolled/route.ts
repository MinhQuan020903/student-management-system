import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ message: 'userId is required' }), {
      status: 400,
    });
  }

  const courses = await prisma.course_User.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { id: 'asc' },
    include: { course: true },
  });

  const response = courses.map((courseUser) => courseUser.course);

  return new Response(JSON.stringify(response));
}
