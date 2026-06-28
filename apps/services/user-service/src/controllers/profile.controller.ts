import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { z } from "zod";
import { CreateProfileService } from "../services/createProfile.service.js";
import { EditProfileService } from "../services/editProfile.service.js";
import { GetProfileService } from "../services/getProfile.service.js";
import { GetFollowersService } from "../services/getFollowers.service.js";
import type { UserProfileModel } from "../generated/prisma/models/UserProfile.js";

const profileService = new CreateProfileService();
const editProfileService = new EditProfileService();
const getProfileService = new GetProfileService();
const getFollowersService = new GetFollowersService();

const errorSchema = z.object({ message: z.string() });

const userProfileSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  bio: z.string().nullable(),
  followers: z.number().int(),
  following: z.number().int(),
  totalPosts: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

function toProfileResponse(profile: UserProfileModel) {
  const { id: _id, userID: accountId, ...rest } = profile;
  return { accountId, ...rest };
}

const createProfileSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string().optional(),
  username: z.string().optional(),
});

const updateProfileInfoSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string(),
  username: z.string(),
});

const updateBioSchema = z.object({
  accountId: z.string().uuid(),
  bio: z.string(),
});

const updateAvatarSchema = z.object({
  accountId: z.string().uuid(),
  avatarUrl: z.string().url(),
});

const followerActionSchema = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
});

const accountIdParamsSchema = z.object({
  accountId: z.string().uuid(),
});

const followerEntrySchema = z.object({
  followerId: z.string().uuid(),
  createdAt: z.date(),
});

const followingEntrySchema = z.object({
  followingId: z.string().uuid(),
  createdAt: z.date(),
});

export async function profileRoutes(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post("/profile", {
    schema: {
      tags: ["Profile"],
      summary: "Criar perfil",
      description: "Cria o perfil de um usuário a partir do seu accountId.",
      body: createProfileSchema,
      response: { 201: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const profile = await profileService.createProfile(request.body);
      return reply.status(201).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error creating profile" });
    }
  });

  router.get("/profile/:accountId", {
    schema: {
      tags: ["Profile"],
      summary: "Buscar perfil por accountId",
      description: "Retorna o perfil de um usuário pelo accountId (UUID da conta).",
      params: accountIdParamsSchema,
      response: {
        200: userProfileSchema,
        404: errorSchema,
        500: errorSchema,
      },
    },
  }, async (request, reply) => {
    try {
      const profile = await getProfileService.getProfileByAccountId(request.params.accountId);
      if (!profile) return reply.status(404).send({ message: "Profile not found" });
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error fetching profile" });
    }
  });

  router.put("/profile/info", {
    schema: {
      tags: ["Profile"],
      summary: "Atualizar nome e username",
      description: "Atualiza o nome e o username do usuário.",
      body: updateProfileInfoSchema,
      response: { 200: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.updateProfileInfo(request.body);
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error updating profile info" });
    }
  });

  router.put("/profile/bio", {
    schema: {
      tags: ["Profile"],
      summary: "Atualizar bio",
      description: "Atualiza a bio do usuário.",
      body: updateBioSchema,
      response: { 200: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.updateBio(request.body);
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error updating bio" });
    }
  });

  router.put("/profile/avatar", {
    schema: {
      tags: ["Profile"],
      summary: "Atualizar avatar",
      description: "Atualiza a URL do avatar do usuário.",
      body: updateAvatarSchema,
      response: { 200: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const profile = await editProfileService.updateAvatar(request.body);
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error updating avatar" });
    }
  });


  router.post("/profile/followers/increase", {
    schema: {
      tags: ["Profile"],
      summary: "Seguir usuário",
      description: "Registra que followerId passou a seguir followingId. Atualiza contadores em ambos os perfis e dispara evento Kafka user.followed.",
      body: followerActionSchema,
      response: { 200: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const { followerId, followingId } = request.body;
      const profile = await editProfileService.increaseFollower(followerId, followingId);
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error increasing followers" });
    }
  });

  router.post("/profile/followers/decrease", {
    schema: {
      tags: ["Profile"],
      summary: "Deixar de seguir usuário",
      description: "Remove o relacionamento de follow entre followerId e followingId. Atualiza contadores em ambos os perfis.",
      body: followerActionSchema,
      response: { 200: userProfileSchema, 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const { followerId, followingId } = request.body;
      const profile = await editProfileService.decreaseFollower(followerId, followingId);
      return reply.status(200).send(toProfileResponse(profile));
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error decreasing followers" });
    }
  });

  router.get("/:accountId/followers", {
    schema: {
      tags: ["Profile"],
      summary: "Listar seguidores",
      description: "Retorna a lista de usuários que seguem o usuário informado.",
      params: accountIdParamsSchema,
      response: { 200: z.array(followerEntrySchema), 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const followers = await getFollowersService.listFollowers(request.params.accountId);
      return reply.status(200).send(followers);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error listing followers" });
    }
  });

  router.get("/:accountId/following", {
    schema: {
      tags: ["Profile"],
      summary: "Listar quem o usuário segue",
      description: "Retorna a lista de usuários que o usuário informado está seguindo.",
      params: accountIdParamsSchema,
      response: { 200: z.array(followingEntrySchema), 500: errorSchema },
    },
  }, async (request, reply) => {
    try {
      const following = await getFollowersService.listFollowing(request.params.accountId);
      return reply.status(200).send(following);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Error listing following" });
    }
  });
}
