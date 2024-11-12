import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '3');
  const search = searchParams.get('search') || '1';
  const type = parseInt(searchParams.get('type') || '1');

  const all = await prisma.room.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          id: parseInt(search),
        },
      ],

      typeId: type,
    },
    include: {
      classsessions: true,
      classshifts: true,
      facilities: true,
    },
    orderBy: {
      id: 'asc',
    },
  });
  const total = await prisma.room.count({
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          id: parseInt(search),
        },
      ],

      typeId: type,
    },
  });
  const totalPage = Math.ceil(total / limit);
  const data = {
    data: all,
    totalItems: total,
    totalPage,
  };
  return new Response(JSON.stringify(data), { status: 200 });
}
