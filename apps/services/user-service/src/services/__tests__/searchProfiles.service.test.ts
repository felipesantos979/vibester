import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchProfilesService } from "../searchProfiles.service";

const { mockFindMany, mockCount, mockTransaction } = vi.hoisted(() => {
  const mockFindMany = vi.fn();
  const mockCount = vi.fn();
  const mockTransaction = vi.fn().mockImplementation((arg: ((...args: unknown[]) => unknown) | Promise<unknown>[]) => {
    if (typeof arg === "function") return arg({});
    return Promise.all(arg);
  });
  return { mockFindMany, mockCount, mockTransaction };
});

vi.mock("../../prisma/index", () => ({
  default: {
    userProfile: {
      findMany: mockFindMany,
      count: mockCount,
    },
    $transaction: mockTransaction,
  },
}));

function makeDbProfile(overrides: Partial<{
  userID: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  followers: number;
}> = {}) {
  return {
    userID: "user-uuid-1",
    name: "John Doe",
    username: "johndoe",
    avatarUrl: null,
    followers: 0,
    ...overrides,
  };
}

describe("SearchProfilesService", () => {
  let service: SearchProfilesService;

  beforeEach(() => {
    service = new SearchProfilesService();
    vi.clearAllMocks();
    mockTransaction.mockImplementation((arg: ((...args: unknown[]) => unknown) | Promise<unknown>[]) => {
      if (typeof arg === "function") return arg({});
      return Promise.all(arg);
    });
  });

  it("should return matching profiles mapped with accountId", async () => {
    const dbProfile = makeDbProfile({ userID: "uuid-1", name: "Alice", username: "alice" });
    mockFindMany.mockResolvedValue([dbProfile]);
    mockCount.mockResolvedValue(1);

    const result = await service.search({ q: "alice" });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]).toEqual({
      accountId: "uuid-1",
      name: "Alice",
      username: "alice",
      avatarUrl: null,
      followers: 0,
    });
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("should pass correct where clause with insensitive mode", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await service.search({ q: "Test" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: "Test", mode: "insensitive" } },
            { username: { contains: "Test", mode: "insensitive" } },
          ],
        },
      }),
    );
  });

  it("should apply pagination with take and skip", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await service.search({ q: "user", limit: 5, page: 3 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5, skip: 10 }),
    );
  });

  it("should order results by followers descending", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    await service.search({ q: "a" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { followers: "desc" } }),
    );
  });

  it("should return empty data array when no profiles match", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const result = await service.search({ q: "noresults" });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("should use default limit=10 and page=1 when not provided", async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const result = await service.search({ q: "x" });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10, skip: 0 }),
    );
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("should propagate errors from $transaction", async () => {
    mockTransaction.mockRejectedValueOnce(new Error("DB connection failed"));

    await expect(service.search({ q: "error" })).rejects.toThrow("DB connection failed");
  });
});
