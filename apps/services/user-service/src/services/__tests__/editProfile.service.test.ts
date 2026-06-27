import { describe, it, expect, vi, beforeEach } from "vitest";
import { EditProfileService } from "../editProfile.service";

const { mockUpdate } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
  default: {
    userProfile: {
      update: mockUpdate,
    },
  },
}));

const USER_ID = "user-uuid-1";

function makeProfile(overrides: Partial<{
  id: string;
  userID: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followers: number;
  following: number;
  totalPosts: number;
  createdAt: Date;
  updatedAt: Date;
}> = {}) {
  return {
    id: "profile-id-1",
    userID: USER_ID,
    name: null,
    username: null,
    avatarUrl: null,
    bio: null,
    followers: 0,
    following: 0,
    totalPosts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("EditProfileService", () => {
  let service: EditProfileService;

  beforeEach(() => {
    service = new EditProfileService();
    vi.clearAllMocks();
  });

  // ======= updateBio =======

  describe("updateBio", () => {
    it("should update the bio of a user profile", async () => {
      const updatedProfile = makeProfile({ bio: "Minha nova bio" });
      mockUpdate.mockResolvedValue(updatedProfile);

      const result = await service.updateBio({ userID: USER_ID, bio: "Minha nova bio" });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { userID: USER_ID },
        data: { bio: "Minha nova bio" },
      });
      expect(result.bio).toBe("Minha nova bio");
    });

    it("should throw when user profile is not found", async () => {
      mockUpdate.mockRejectedValue(new Error("Record to update not found."));

      await expect(
        service.updateBio({ userID: "non-existent", bio: "bio" })
      ).rejects.toThrow("Record to update not found.");
    });
  });

  // ======= updateAvatar =======

  describe("updateAvatar", () => {
    it("should update the avatarUrl of a user profile", async () => {
      const url = "https://example.com/avatar.jpg";
      const updatedProfile = makeProfile({ avatarUrl: url });
      mockUpdate.mockResolvedValue(updatedProfile);

      const result = await service.updateAvatar({ userID: USER_ID, avatarUrl: url });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { userID: USER_ID },
        data: { avatarUrl: url },
      });
      expect(result.avatarUrl).toBe(url);
    });

    it("should throw when user profile is not found", async () => {
      mockUpdate.mockRejectedValue(new Error("Record to update not found."));

      await expect(
        service.updateAvatar({ userID: "non-existent", avatarUrl: "https://example.com/a.jpg" })
      ).rejects.toThrow("Record to update not found.");
    });
  });

  // ======= increaseFollower =======

  describe("increaseFollower", () => {
    it("should increment followers by 1", async () => {
      const updatedProfile = makeProfile({ followers: 1 });
      mockUpdate.mockResolvedValue(updatedProfile);

      const result = await service.increaseFollower(USER_ID);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { userID: USER_ID },
        data: { followers: { increment: 1 } },
      });
      expect(result.followers).toBe(1);
    });

    it("should throw when user profile is not found", async () => {
      mockUpdate.mockRejectedValue(new Error("Record to update not found."));

      await expect(service.increaseFollower("non-existent")).rejects.toThrow(
        "Record to update not found."
      );
    });
  });

  // ======= decreaseFollower =======

  describe("decreaseFollower", () => {
    it("should decrement followers by 1", async () => {
      const updatedProfile = makeProfile({ followers: 0 });
      mockUpdate.mockResolvedValue(updatedProfile);

      const result = await service.decreaseFollower(USER_ID);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { userID: USER_ID },
        data: { followers: { decrement: 1 } },
      });
      expect(result.followers).toBe(0);
    });

    it("should throw when user profile is not found", async () => {
      mockUpdate.mockRejectedValue(new Error("Record to update not found."));

      await expect(service.decreaseFollower("non-existent")).rejects.toThrow(
        "Record to update not found."
      );
    });
  });
});
