import prisma from '@lib/prisma';

export async function GET() {
  try {
    const getAllCourses = await prisma.course.findMany({});
    console.log('get all courses: ', getAllCourses);
    return new Response(JSON.stringify(getAllCourses), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
