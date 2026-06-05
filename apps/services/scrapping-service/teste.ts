import { MovementService } from "./src/services/movement.service";
import { prisma } from "./src/prisma/index";

async function main() {
  const movementService = new MovementService();

  await movementService.updateMovementLevelsFromSavedEstablishments();
}

main()
  .catch((error) => {
    console.error("Erro no teste:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });