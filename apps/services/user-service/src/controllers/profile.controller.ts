import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { CreateProfileService } from "../services/createProfile.service.js";
import { EditProfileService } from "../services/editProfile.service.js";

const profileService = new CreateProfileService();
const editProfileService = new EditProfileService();

const createProfileSchema = z.object({
  userID: z.string().uuid(),
});

const updateBioSchema = z.object({
  userID: z.string().uuid(),
  bio: z.string(),
});

const updateAvatarSchema = z.object({
  userID: z.string().uuid(),
  avatarUrl: z.string().url(),
});

const followerSchema = z.object({
  userID: z.string().uuid(),
});

export async function profileRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post("/profile", {
    schema: {
      tags: ["Profile"],
      summary: "Criar perfil",
      description: "Cria o perfil de um usuário a partir do seu ID.",
      body: createProfileSchema,
    },
  }, async (request, reply) => {
    try {
      const profile = await profileService.createProfile(request.body);
      return reply.status(201).send(profile);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error creating profile" });
    }
  });

  router.put("/profile/bio", {
    schema: {
      tags: ["Profile"],
      summary: "Atualizar bio",
      body: updateBioSchema,
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.updateBio(request.body);
      return reply.status(200).send(profile);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error updating bio" });
    }
  });

  router.put("/profile/avatar", {
    schema: {
      tags: ["Profile"],
      summary: "Atualizar avatar",
      body: updateAvatarSchema,
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.updateAvatar(request.body);
      return reply.status(200).send(profile);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error updating avatar" });
    }
  });

  router.post("/profile/followers/increase", {
    schema: {
      tags: ["Profile"],
      summary: "Incrementar seguidores",
      body: followerSchema,
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.increaseFollower(request.body.userID);
      return reply.status(200).send(profile);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error increasing followers" });
    }
  });

  router.post("/profile/followers/decrease", {
    schema: {
      tags: ["Profile"],
      summary: "Decrementar seguidores",
      body: followerSchema,
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.decreaseFollower(request.body.userID);
      return reply.status(200).send(profile);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error decreasing followers" });
    }
  });
}
