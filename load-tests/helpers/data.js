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

export function generatePost(userId) {
  return {
    userId,
    description: `Load test post VU${__VU} iter${__ITER}`,
    mediaType:   'image',
  };
}

export function generateEvent(accountId) {
  const daysAhead = 7 + Math.floor(Math.random() * 30);
  return {
    accountId,
    name:        `K6 Event ${uid()}`,
    description: 'Load test event',
    date:        new Date(Date.now() + daysAhead * 86_400_000).toISOString(),
    latitude:    -23.5505 + (Math.random() - 0.5) * 0.2,
    longitude:   -46.6333 + (Math.random() - 0.5) * 0.2,
    category:    'music',
  };
}

// Coordenadas fixas de SP para buscas de "nearby"
export const NEARBY_QS = 'latitude=-23.5505&longitude=-46.6333&radius=5000';
