import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = parseInt(searchParams.get('id') || '0');

  try {
    const item = await prisma.assignment.findUnique({
      where: {
        id,
      },
      include: {
        Assignment_ClassSessions: true,
        Assignment_Users: true,
        bandScore: true,
        skill: true,
        module: true,
      },
    });
    const data = {
      data: item,
    };
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
    const { data, userId, files } = reqJson;
    console.log('🚀 ~ file: route.ts:34 ~ POST ~ reqJson:', reqJson);

    // Validate the unique identifier
    if (!data.id) {
      throw new Error('Invalid ID: A unique identifier is required for upsert');
    }

    const res = await prisma.assignment_User.upsert({
      where: {
        userId_assignmentId: {
          userId: userId,
          assignmentId: data.id,
        },
      },
      create: {
        createdAt: new Date().toISOString(),
        files: files,
        userId: userId,
        user: data.user ? data.user : undefined,
        assignmentId: data.id,
        assignment: data.assignment ? data.assignment : undefined,
      },
      update: {
        files: files,
        userId: userId,
        user: data.user ? data.user : undefined,
        assignmentId: data.id,
        assignment: data.assignment ? data.assignment : undefined,
      },
    });

    return new Response(JSON.stringify({ res, status: 200 }));
  } catch (error) {
    console.error('🚀 ~ file: route.ts:36 ~ POST ~ error:', error);
    return new Response(JSON.stringify({ error: error, status: 400 }), {
      status: 400,
    });
  }
}
