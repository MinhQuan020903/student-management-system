// import prisma from '@/lib/prisma';
import { getRequest } from "@/lib/fetch";
import { postRequest } from "@/lib/fetch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = parseInt(searchParams.get('id') || '1');
  const userId = parseInt(searchParams.get('userId') || '1');

  console.log('🚀 ~ file: route.ts:8 ~ GET ~ id:', id);
  console.log('🚀 ~ file: route.ts:9 ~ GET ~ userId:', userId);

  try {
    // const item = await prisma.assignment.findUnique({
    //   where: {
    //     id,
    //   },
    //   include: {
    //     Assignment_ClassSessions: true,
    //     Assignment_Users: {
    //       where: {
    //         userId: userId,
    //         assignmentId: id,
    //       },
    //     },
    //     bandScore: true,
    //     skill: true,
    //     module: true,
    //   },
    // });
    // const data = {
    //   data: item,
    // };
    // console.log('🚀 ~ GET ~ data:', data);
    const data = await getRequest({
      endPoint: `/api/assignment/${id}?userId=${userId}`,
    });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 400, message: 'error when fetching...' })
    );
  }
}

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    console.log('🚀 ~ file: route.ts:34 ~ POST ~ reqJson:', reqJson);
    // const res = await prisma.assignment.update({
    //   where: {
    //     id: reqJson.id,
    //   },
    //   data: {
    //     lastModifiedTime: reqJson.lastModifiedTime,
    //     files: reqJson.files,
    //   },
    // });
    const res = await postRequest({
      endPoint: `/api/assignment`,
      isFormData: false,
      formData: Request,
    });
    return new Response(JSON.stringify({ res, status: 200 }));
  } catch (error) {
    console.log('🚀 ~ file: route.ts:36 ~ POST ~ error:', error);
  }
  return new Response(JSON.stringify({ status: 404 }));
}
