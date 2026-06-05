import {
    seedEstablishments,
    disconnectEstablishmentSeed,
} from "./seed-establishment";

import {
    seedOpeningHours,
    disconnectOpeningHoursSeed,
} from "./seed-opening-hours";

async function main() {
    await seedEstablishments();
    await seedOpeningHours();
}

main()
    .catch((error) => {
        console.error("Erro ao executar seeds:", error);
        process.exit(1);
    })
    .finally(async () => {
        await disconnectEstablishmentSeed();
        await disconnectOpeningHoursSeed();
    });