// IDs únicos por VU + iteração para evitar colisão de dados de teste
export function uid() {
  return `${__VU}_${__ITER}_${Date.now()}`;
}

export function generateUser() {
  const id = uid();
  return {
    username: `k6_${id}`,
    name:     `K6 VU${__VU}`,
    email:    `k6_${id}@loadtest.invalid`,
    password: 'K6Load#2024!',
    bornAt:   '1995-01-01',
  };
}

// SEED_ESTABLISHMENT_ID must exist in the database before running load tests
const SEED_ESTABLISHMENT_ID = __ENV.SEED_ESTABLISHMENT_ID || '00000000-0000-0000-0000-000000000001';

export function generateEvent(_accountId) {
  const daysAhead = 7 + Math.floor(Math.random() * 30);
  const startDate = new Date(Date.now() + daysAhead * 86_400_000);
  const endDate   = new Date(startDate.getTime() + 4 * 3_600_000);
  return {
    name:            `K6 Event ${uid()}`,
    photoUrl:        'https://picsum.photos/seed/k6/800/600',
    category:        'music',
    organizer:       `K6 Organizer VU${__VU}`,
    location:        'São Paulo, SP',
    startDate:       startDate.toISOString(),
    endDate:         endDate.toISOString(),
    latitude:        -23.5505 + (Math.random() - 0.5) * 0.2,
    longitude:       -46.6333 + (Math.random() - 0.5) * 0.2,
    establishmentId: SEED_ESTABLISHMENT_ID,
  };
}

// Coordenadas fixas de SP para buscas de "nearby"
export const NEARBY_QS = 'latitude=-23.5505&longitude=-46.6333&radius=5000';

// SEED_ACCOUNT_ID must exist in the database before running load tests
// (alvo fixo para o fluxo de "seguir usuário" — default é a conta k6_test_01)
export const SEED_ACCOUNT_ID = __ENV.SEED_ACCOUNT_ID || 'adbefbd5-af2d-4034-a00b-a2613740a796';
