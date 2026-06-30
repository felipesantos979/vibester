import prismaClient from "../prisma/index.js";

export interface SearchProfilesInput {
  q: string;
  limit?: number;
  page?: number;
}

export interface SearchProfileResult {
  accountId: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  followers: number;
}

export interface SearchProfilesOutput {
  data: SearchProfileResult[];
  total: number;
  page: number;
  limit: number;
}

export class SearchProfilesService {
  async search({ q, limit = 10, page = 1 }: SearchProfilesInput): Promise<SearchProfilesOutput> {
    const where = {
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { username: { contains: q, mode: "insensitive" as const } },
      ],
    };

    const skip = (page - 1) * limit;

    const [profiles, total] = await prismaClient.$transaction([
      prismaClient.userProfile.findMany({
        where,
        select: {
          userID: true,
          name: true,
          username: true,
          avatarUrl: true,
          followers: true,
        },
        take: limit,
        skip,
        orderBy: { followers: "desc" },
      }),
      prismaClient.userProfile.count({ where }),
    ]);

    return {
      data: profiles.map(({ userID, ...rest }) => ({ accountId: userID, ...rest })),
      total,
      page,
      limit,
    };
  }
}
