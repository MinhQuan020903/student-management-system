import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = parseInt(searchParams.get('id') || '1');
  const userId = parseInt(searchParams.get('userId') || '1');

  console.log('🚀 ~ file: route.ts:8 ~ GET ~ id:', id);
  console.log('🚀 ~ file: route.ts:9 ~ GET ~ userId:', userId);

  try {
    const item = await prisma.assignment.findUnique({
      where: {
        id,
      },
      include: {
        Assignment_ClassSessions: true,
        Assignment_Users: {
          where: {
            userId: userId,
            assignmentId: id,
          },
        },
        bandScore: true,
        skill: true,
        module: true,
      },
    });
    const data = {
      data: item,
    };
    console.log('🚀 ~ GET ~ data:', data);
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

    const res = await prisma.assignment.upsert({
      create: {
        name: reqJson.name,
        moduleId: reqJson.moduleId,
        skillId: reqJson.skillId,
        bandScoreId: reqJson.bandScoreId,
        startTime: reqJson.startTime,
        files: reqJson.files,
        lastModifiedTime: reqJson.lastModifiedTime,
        percentage: reqJson.percentage,
      } as Prisma.AssignmentUncheckedCreateInput,
      update: {
        lastModifiedTime: reqJson.lastModifiedTime,
        files: reqJson.files,
      },
      where: {
        id: reqJson.id,
      },
    });

    return new Response(JSON.stringify({ res, status: 200 }));
  } catch (error) {
    console.log('🚀 ~ file: route.ts:36 ~ POST ~ error:', (error as Error).message);
    return new Response(
      JSON.stringify({ status: 404, message: 'Error during upsert', error: (error as Error).message }),
      { status: 404 }
    );
  }
  
}


