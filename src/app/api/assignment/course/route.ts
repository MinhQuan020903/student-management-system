import prisma from "@/lib/prisma";
// import { getRequest } from "@/lib/fetch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");
  const search = searchParams.get("search") || "";
  const courseId = parseInt(searchParams.get("courseId") || "1");

  try {
    const all = await prisma.assignment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: {
          contains: search,
        },
        courseId,
      },
      include: {
        Assignment_ClassSessions: true,
        Assignment_Users: true,
        bandScore: true,
        skill: true,
        module: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    const total = await prisma.assignment.count({
      where: {
        name: {
          contains: search,
        },
        courseId,
      },
    });
    const totalPage = Math.ceil(total / limit);
    const data = {
      data: all,
      totalItems: total,
      totalPage,
    };
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: 400, message: "error when fetching...", error })
    );
  }
}
