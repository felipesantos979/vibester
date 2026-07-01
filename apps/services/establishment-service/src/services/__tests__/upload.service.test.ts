import { describe, it, expect, vi, beforeEach } from "vitest";
import { Readable } from "stream";

const { mockDone, mockUploadCtor, mockUpdate } = vi.hoisted(() => ({
  mockDone: vi.fn().mockResolvedValue(undefined),
  mockUploadCtor: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock("@aws-sdk/lib-storage", () => ({
  Upload: class {
    constructor(params: unknown) {
      mockUploadCtor(params);
    }
    done() {
      return mockDone();
    }
  },
}));

vi.mock("../../config/r2", () => ({ r2Client: {} }));

vi.mock("../../prisma/index", () => ({
  default: {
    establishment: {
      update: mockUpdate,
    },
  },
}));

import { UploadService } from "../upload.service";

const ESTABLISHMENT_ID = "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5";

describe("UploadService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDone.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue({ id: ESTABLISHMENT_ID });
  });

  describe("uploadProfilePicture", () => {
    it("faz upload do stream pro bucket configurado com o content-type correto", async () => {
      const stream = Readable.from(["fake-image-bytes"]);
      await UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/png");

      expect(mockUploadCtor).toHaveBeenCalledTimes(1);
      const params = mockUploadCtor.mock.calls[0][0];
      expect(params.params.Bucket).toBe("test-bucket");
      expect(params.params.ContentType).toBe("image/png");
      expect(params.params.Key).toMatch(new RegExp(`^establishments/${ESTABLISHMENT_ID}/profile/`));
    });

    it("aguarda a conclusão do upload antes de atualizar o registro", async () => {
      const stream = Readable.from(["fake-image-bytes"]);
      await UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/png");

      expect(mockDone).toHaveBeenCalledTimes(1);
    });

    it("atualiza photoUrl do estabelecimento com a URL pública composta por r2_public_url + key", async () => {
      const stream = Readable.from(["fake-image-bytes"]);
      const publicUrl = await UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/png");

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: ESTABLISHMENT_ID },
        data: { photoUrl: publicUrl },
      });
      expect(publicUrl).toMatch(/^https:\/\/test\.r2\.dev\/establishments\//);
    });

    it("retorna a publicUrl gerada", async () => {
      const stream = Readable.from(["fake-image-bytes"]);
      const publicUrl = await UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/jpeg");

      expect(publicUrl.startsWith("https://test.r2.dev/establishments/")).toBe(true);
    });

    it("propaga o erro quando o upload para o R2 falha", async () => {
      mockDone.mockRejectedValueOnce(new Error("R2 upload failed"));
      const stream = Readable.from(["fake-image-bytes"]);

      await expect(
        UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/png")
      ).rejects.toThrow("R2 upload failed");
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it("propaga o erro quando a atualização no banco falha", async () => {
      mockUpdate.mockRejectedValueOnce(new Error("DB error"));
      const stream = Readable.from(["fake-image-bytes"]);

      await expect(
        UploadService.uploadProfilePicture(ESTABLISHMENT_ID, stream, "image/png")
      ).rejects.toThrow("DB error");
    });
  });
});
