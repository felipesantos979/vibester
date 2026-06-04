import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { env } from "../../src/config/env";

const connectionString = process.env.DATABASE_URL;

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

const WEEK_DAYS: Record<string, number> = {
  domingo: 0,
  segunda_feira: 1,
  terça_feira: 2,
  quarta_feira: 3,
  quinta_feira: 4,
  sexta_feira: 5,
  sábado: 6,
};

function parseHours(hours: Record<string, string>[]) {
  const parsed: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[] = [];

  for (const item of hours) {
    const [day, value] = Object.entries(item)[0];

    if (!day || !value) continue;

    if (value === "Fechado") {
      continue;
    }

    const [openTime, closeTime] = value.split("–");

    if (!openTime || !closeTime) {
      console.log(`[SKIP] Horário inválido: ${day} ${value}`);
      continue;
    }

    parsed.push({
      dayOfWeek: WEEK_DAYS[day],
      openTime: openTime.trim(),
      closeTime: closeTime.trim(),
    });
  }

  return parsed;
}

async function fetchPlaceHours(googlePlaceId: string) {
  const url = new URL("https://serpapi.com/search.json");

  url.searchParams.set("engine", "google_maps");
  url.searchParams.set("type", "place");
  url.searchParams.set("place_id", googlePlaceId);
  url.searchParams.set("api_key", env.SERP_API_KEY);
  url.searchParams.set("hl", "pt-br");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro SerpAPI: ${response.status}`);
  }

  const data = await response.json();

  return data.place_results?.hours ?? [];
}

export async function seedOpeningHours() {
  const establishments = await prisma.establishment.findMany({
    where: {
      googlePlaceId: {
        not: null,
      },
    },
  });

  console.log(
    `Estabelecimentos encontrados: ${establishments.length}`
  );

  for (const establishment of establishments) {
    if (!establishment.googlePlaceId) continue;

    console.log(
      `[SERPAPI] Buscando horários: ${establishment.name}`
    );

    try {
      const hours = await fetchPlaceHours(
        establishment.googlePlaceId
      );

      const parsedHours = parseHours(hours);

      await prisma.establishmentOpeningHour.deleteMany({
        where: {
          establishmentId: establishment.id,
        },
      });

      if (parsedHours.length === 0) {
        console.log(
          `[SEM HORÁRIOS] ${establishment.name}`
        );
        continue;
      }

      await prisma.establishmentOpeningHour.createMany({
        data: parsedHours.map((hour) => ({
          establishmentId: establishment.id,
          dayOfWeek: hour.dayOfWeek,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
        })),
      });

      console.log(
        `[OK] ${establishment.name}: ${parsedHours.length} horários salvos`
      );
    } catch (error) {
      console.error(
        `[ERRO] ${establishment.name}`,
        error
      );
    }
  }

  console.log("Seed de horários finalizada.");
}

export async function disconnectOpeningHoursSeed() {
  await prisma.$disconnect();
  await pool.end();
}