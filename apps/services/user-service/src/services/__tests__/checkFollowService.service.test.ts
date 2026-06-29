import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckFollowService } from "../checkFollow.service";

const { mockCount } = vi.hoisted(() => ({
  mockCount: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
  default: {
    userFollow: {
      count: mockCount,
    },
  },
}));

describe("CheckFollowService", () => {
  let service: CheckFollowService;

  beforeEach(() => {
    service = new CheckFollowService();
    vi.clearAllMocks();
  });

  it("should return true when followerId follows followingId", async () => {
    mockCount.mockResolvedValue(1);

    const result = await service.isFollowing("follower-uuid-1", "following-uuid-2");

    expect(mockCount).toHaveBeenCalledWith({
      where: { followerId: "follower-uuid-1", followingId: "following-uuid-2" },
    });
    expect(result).toBe(true);
  });

  it("should return false when followerId does not follow followingId", async () => {
    mockCount.mockResolvedValue(0);

    const result = await service.isFollowing("follower-uuid-1", "following-uuid-2");

    expect(mockCount).toHaveBeenCalledWith({
      where: { followerId: "follower-uuid-1", followingId: "following-uuid-2" },
    });
    expect(result).toBe(false);
  });

  it("should throw when prisma fails", async () => {
    mockCount.mockRejectedValue(new Error("Database error"));

    await expect(
      service.isFollowing("follower-uuid-1", "following-uuid-2")
    ).rejects.toThrow("Database error");
  });
});