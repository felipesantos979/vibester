import cron from "node-cron";
import { MovementService } from "../services/movement.service";
import { env } from "../config/env";
import { type AppLogger, consoleLogger } from "../utils/logger";

export function startMovementJob(logger: AppLogger = consoleLogger): () => void {
  const movementService = new MovementService(undefined, undefined, logger);
  let isRunning = false;

  const task = cron.schedule(
    "0 * * * *",
    async () => {
      if (isRunning) {
        logger.warn("[JOB] Job anterior ainda em execução. Pulando...");
        return;
      }

      isRunning = true;

      try {
        logger.info("[JOB] Atualizando nível de movimento...");
        await movementService.updateMovementLevelsFromSavedEstablishments();
        logger.info("[JOB] Atualização finalizada.");
      } catch (error) {
        logger.error("[JOB] Erro ao atualizar movimento", error);
      } finally {
        isRunning = false;
      }
    },
    { timezone: env.timezone }
  );

  return () => task.stop();
}
