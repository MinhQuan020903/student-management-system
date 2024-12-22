import prisma from '@lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    if (!searchParams.get('courseId')) {
      return new Response(JSON.stringify({}), { status: 400 });
    }

    const courseId = parseInt(searchParams.get('courseId') || '0');
    console.log('🚀 ~ file: route.ts ~ line 11 ~ GET ~ courseId', courseId);
    const courseDetail = await prisma.course.findFirst({
      where: {
        id: courseId,
      },
    });

    const teacher = await prisma.user.findFirst({
      where: {
        id: courseDetail?.teacherId,
      },
    });

    const courseResponse = {
      ...courseDetail,
      teacher: teacher,
    };

    console.log(
      '🚀 ~ file: route.ts ~ line 18 ~ GET ~ courseDetail',
      courseResponse
    );

    if (courseDetail) {
      return new Response(JSON.stringify(courseResponse), { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
