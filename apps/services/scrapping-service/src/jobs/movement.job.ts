import cron from "node-cron";
import { MovementService } from "../services/movement.service";
import { env } from "../config/env"

const movementService = new MovementService();
let isRunning = false;

export function startMovementJob() {
  cron.schedule("0 * * * *", async () => {
    if (isRunning) {
      console.log("[JOB] Job anterior ainda em execução. Pulando...");
      return;
    }

    isRunning = true;

    try {
      console.log("[JOB] Atualizando nível de movimento...");
      await movementService.updateMovementLevelsFromSavedEstablishments();
      console.log("[JOB] Atualização finalizada.");
    } catch (error) {
      console.error("[JOB] Erro ao atualizar movimento:", error);
    } finally {
      isRunning = false;
    }
  }, {
    timezone: env.timezone,
  });
}