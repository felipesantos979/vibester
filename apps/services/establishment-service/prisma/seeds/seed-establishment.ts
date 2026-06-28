import { env } from "../../src/config/env";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { places } from "../data/places";

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não definida");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export async function seedEstablishments() {
  console.log(`Encontrados ${places.length} lugares`);

  for (const place of places) {
    await prisma.establishment.upsert({
      where: {
        googlePlaceId: place.placeId,
      },
      update: {
        name: place.name,
        averageRating: place.rating,
        latitude: place.lat,
        longitude: place.lng,
        category: "bar",
      },
      create: {
        googlePlaceId: place.placeId,
        name: place.name,
        averageRating: place.rating,
        latitude: place.lat,
        longitude: place.lng,
        category: "bar",
      },
    });
  }

  console.log("Seed de estabelecimentos concluído.");
}

export async function disconnectEstablishmentSeed() {
  await prisma.$disconnect();
  await pool.end();
}