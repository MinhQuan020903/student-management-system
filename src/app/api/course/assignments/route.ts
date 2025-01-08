import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return new Response(JSON.stringify({ message: 'courseId is required' }), {
      status: 400,
    });
  }

  const assignments = await prisma.assignment.findMany({
    where: { courseId: parseInt(courseId) },
    orderBy: { id: 'asc' },
    include: {
      Assignment_Users: {
        include: { user: true },
      },
    },
  });

  return new Response(JSON.stringify(assignments));
}
