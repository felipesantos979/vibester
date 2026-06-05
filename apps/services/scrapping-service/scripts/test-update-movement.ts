import "dotenv/config";
import { MovementService } from "../src/services/movement.service";

async function main() {
  const movementService = new MovementService();

  await movementService.updateMovementLevelsFromSavedEstablishments();
}

main();