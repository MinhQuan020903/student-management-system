import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let total = 0;

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '3');
  const search = searchParams.get('search') || '';
  console.log('🚀 ~ file: route.ts:10 ~ GET ~ search:', search);
  const userId = parseInt(searchParams.get('userId') || '6');

  const assignments = await prisma.assignment_User.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      userId: userId,
    },
    include: {
      assignment: {
        include: {
          Assignment_ClassSessions: {
            include: {
              classSession: {
                include: {
                  Course: true,
                },
              },
            },
          },
        },
      },
    },
  });
  console.log('🚀 ~ file: route.ts:35 ~ GET ~ assignments:', assignments);

  total = await prisma.assignment_User.count({
    where: {
      userId: userId,
    },
  });

  const totalPage = Math.ceil(total / limit);
  const data = {
    data: assignments,
    totalItems: total,
    totalPage,
  };
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const assignmentUserId = parseInt(
      searchParams.get('assignmentUserId') || '1'
    );

    const reqJson = await req.json();
    const score = reqJson.score;
    const comment = reqJson.comment;

    const res = await prisma.assignment_User.update({
      where: {
        id: assignmentUserId,
      },
      data: {
        score,
        comment,
      },
    });
    return new Response(JSON.stringify({ res, status: 200 }));
  } catch (error) {
    console.log('🚀 ~ file: route.ts:78 ~ PUT ~ error:', error);
  }
  return new Response(JSON.stringify({ status: 404 }));
}
