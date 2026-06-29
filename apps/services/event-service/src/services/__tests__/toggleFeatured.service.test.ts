import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToggleFeaturedService } from "../toggleFeatured.service";

const { mockUpdate } = vi.hoisted(() => ({
    mockUpdate: vi.fn(),
}));

vi.mock("../../prisma/index", () => ({
    default: {
        event: {
            update: mockUpdate,
        },
    },
}));

const EVENT_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("ToggleFeaturedService", () => {
    let service: ToggleFeaturedService;

    beforeEach(() => {
        service = new ToggleFeaturedService();
        vi.clearAllMocks();
    });

    it("should set isFeatured to true", async () => {
        mockUpdate.mockResolvedValue({ id: EVENT_ID, isFeatured: true });

        const result = await service.toggleFeatured(EVENT_ID, true);

        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: EVENT_ID },
            data: { isFeatured: true },
            select: { id: true, isFeatured: true },
        });
        expect(result).toEqual({ id: EVENT_ID, isFeatured: true });
    });

    it("should set isFeatured to false", async () => {
        mockUpdate.mockResolvedValue({ id: EVENT_ID, isFeatured: false });

        const result = await service.toggleFeatured(EVENT_ID, false);

        expect(result.isFeatured).toBe(false);
    });

    it("should throw 'Evento não encontrado' when event does not exist (P2025)", async () => {
        const { Prisma } = await import("../../generated/prisma/client");
        mockUpdate.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError("Record not found", {
                code: "P2025",
                clientVersion: "7.0.0",
            }),
        );

        await expect(service.toggleFeatured(EVENT_ID, true)).rejects.toThrow(
            "Evento não encontrado",
        );
    });

    it("should rethrow unexpected errors", async () => {
        mockUpdate.mockRejectedValue(new Error("DB connection lost"));

        await expect(service.toggleFeatured(EVENT_ID, true)).rejects.toThrow("DB connection lost");
    });

    it("should perform a single atomic update (no prior findUnique)", async () => {
        mockUpdate.mockResolvedValue({ id: EVENT_ID, isFeatured: true });

        await service.toggleFeatured(EVENT_ID, true);

        // Only update called — no findUnique
        expect(mockUpdate).toHaveBeenCalledTimes(1);
    });
});
