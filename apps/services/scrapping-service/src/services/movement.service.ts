import { EstablishmentClient } from "../clients/establishment.client";
import { prisma } from "../prisma/index";
import { SerpApiService, PopularityHourData } from "./serpapi.service";

type MovementLevelValue =
  | "VERY_LOW"
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH"
  | "UNAVAILABLE";

export class MovementService {
  constructor(
    private establishmentClient = new EstablishmentClient(),
    private serpApiService = new SerpApiService()
  ) { }

  async updateMovementLevelsFromSavedEstablishments() {
    await this.cleanOldPopularTimesDaily();

    const establishments = await this.establishmentClient.listOpenEstablishments();

    console.log(`Estabelecimentos encontrados: ${establishments.length}`);

    for (const establishment of establishments) {
      if (!establishment.googlePlaceId) {
        console.log(`[SKIP] ${establishment.name} sem googlePlaceId`);
        continue;
      }

      try {
        console.log(`[SERPAPI] Consultando ${establishment.name}`);

        const data = await this.serpApiService.getPlacePopularity(
          establishment.googlePlaceId
        );

        if (!data || data.liveBusynessScore === null) {
          console.log(`[SEM MOVIMENTO AO VIVO] ${establishment.name}`);

          if (
            data &&
            data.currentDayInt !== null &&
            data.hoursData.length > 0
          ) {
            await this.savePopularTimesDaily({
              establishmentId: establishment.id,
              googlePlaceId: establishment.googlePlaceId,
              currentDayInt: data.currentDayInt,
              hoursData: data.hoursData,
            });
          }

          const fallbackScore = await this.getFallbackScore(
            establishment.id,
            data?.currentDayInt ?? new Date().getDay()
          );

          if (fallbackScore !== null) {
            const level = this.mapScoreToMovementLevel(fallbackScore);

            await this.saveCurrentPopularity({
              establishmentId: establishment.id,
              googlePlaceId: establishment.googlePlaceId,
              level,
              score: fallbackScore,
              statusText: "Estimativa baseada em histórico",
              timeSpent: null,
              isEstimated: true,
            });

            console.log(
              `[FALLBACK] ${establishment.name}: ${fallbackScore}% → ${level}`
            );

            continue;
          }

          await this.saveCurrentPopularity({
            establishmentId: establishment.id,
            googlePlaceId: establishment.googlePlaceId,
            level: "UNAVAILABLE",
            score: null,
            statusText: data?.liveStatus ?? null,
            timeSpent: data?.timeSpent ?? null,
            isEstimated: false,
          });

          continue;
        }

        const score = data.liveBusynessScore;
        const level = this.mapScoreToMovementLevel(score);

        await this.saveCurrentPopularity({
          establishmentId: establishment.id,
          googlePlaceId: establishment.googlePlaceId,
          level,
          score,
          statusText: data.liveStatus,
          timeSpent: data.timeSpent,
          isEstimated: false,
        });

        if (data.currentDayInt !== null && data.hoursData.length > 0) {
          await this.savePopularTimesDaily({
            establishmentId: establishment.id,
            googlePlaceId: establishment.googlePlaceId,
            currentDayInt: data.currentDayInt,
            hoursData: data.hoursData,
          });
        }

        console.log(`[OK] ${establishment.name}: ${score}% → ${level}`);
      } catch (error) {
        console.error(
          `[ERRO] Falha ao atualizar ${establishment.name}:`,
          error
        );
      }
    }

    console.log("Atualização de movement levels finalizada.");
  }

  async getMovementByEstablishmentId(establishmentId: string) {
    return prisma.currentPopularity.findUnique({
      where: {
        establishmentId,
      },
    });
  }

  private async saveCurrentPopularity(data: {
    establishmentId: string;
    googlePlaceId: string;
    level: MovementLevelValue;
    score: number | null;
    statusText: string | null;
    timeSpent: string | null;
    isEstimated: boolean;
  }) {
    const source = data.isEstimated ? "ESTIMATED" : "SERPAPI";
    
    await prisma.currentPopularity.upsert({
      where: {
        establishmentId: data.establishmentId,
      },
      update: {
        googlePlaceId: data.googlePlaceId,
        level: data.level,
        source,
        score: data.score,
        statusText: data.statusText,
        timeSpent: data.timeSpent,
        isEstimated: data.isEstimated,
      },
      create: {
        establishmentId: data.establishmentId,
        googlePlaceId: data.googlePlaceId,
        level: data.level,
        source,
        score: data.score,
        statusText: data.statusText,
        timeSpent: data.timeSpent,
        isEstimated: data.isEstimated,
      },
    });
  }

  private async savePopularTimesDaily(data: {
    establishmentId: string;
    googlePlaceId: string;
    currentDayInt: number;
    hoursData: PopularityHourData[];
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.$transaction([
      prisma.popularTimesDaily.deleteMany({
        where: {
          establishmentId: data.establishmentId,
          capturedDate: today,
        },
      }),

      prisma.popularTimesDaily.createMany({
        data: data.hoursData.map((hour) => ({
          establishmentId: data.establishmentId,
          googlePlaceId: data.googlePlaceId,
          capturedDate: today,
          dayOfWeek: data.currentDayInt,
          hour: hour.hour,
          busynessScore: hour.busyness_score,
          isCurrent: hour.is_current,
          statusText: hour.status_text,
        })),
      }),
    ]);
  }

  private async getFallbackScore(
    establishmentId: string,
    dayOfWeek: number
  ): Promise<number | null> {
    const currentHour = new Date().getHours();

    const result = await prisma.popularTimesDaily.aggregate({
      where: {
        establishmentId,
        dayOfWeek,
        hour: currentHour,
      },
      _avg: {
        busynessScore: true,
      },
    });

    const averageScore = result._avg.busynessScore;

    return averageScore !== null ? Math.round(averageScore) : null;
  }

  private mapScoreToMovementLevel(score: number): MovementLevelValue {
    if (score <= 20) return "VERY_LOW";
    if (score <= 40) return "LOW";
    if (score <= 60) return "MEDIUM";
    if (score <= 80) return "HIGH";

    return "VERY_HIGH";
  }

  private async cleanOldPopularTimesDaily(daysToKeep = 7) {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - daysToKeep);
    limitDate.setHours(0, 0, 0, 0);

    const result = await prisma.popularTimesDaily.deleteMany({
      where: {
        capturedDate: {
          lt: limitDate,
        },
      },
    });

    console.log(
      `[CLEANUP] ${result.count} registros antigos removidos de popularTimesDaily`
    );
  }
}