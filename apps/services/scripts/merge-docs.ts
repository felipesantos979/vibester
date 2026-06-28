import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const ROOT = join(__dirname, '..');

const services = [
  {
    name: 'auth-service',
    prefix: '/auth',
    env: {
      JWT_SECRET: 'ci-secret',
      DATABASE_URL: 'postgresql://u:p@localhost:5432/db',
      PROFILE_SERVICE_URL: 'http://localhost:3003',
    },
  },
  {
    name: 'establishment-service',
    prefix: '/establishment',
    env: { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' },
  },
  {
    name: 'event-service',
    prefix: '/event',
    env: { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' },
  },
  {
    name: 'post-service',
    prefix: '/post',
    env: {
      CASSANDRA_CONTACT_POINT: '127.0.0.1',
      CASSANDRA_DATACENTER: 'datacenter1',
      CASSANDRA_KEYSPACE: 'posts',
    },
  },
  {
    name: 'scrapping-service',
    prefix: '/scrapping',
    env: { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' },
  },
  {
    name: 'user-service',
    prefix: '/user',
    env: { DATABASE_URL: 'postgresql://u:p@localhost:5432/db' },
  },
];

const combined: any = {
  openapi: '3.0.3',
  info: {
    title: 'Vibester API',
    description: 'Documentação completa de todos os serviços da API do Vibester.',
    version: '1.0.0',
  },
  tags: [],
  paths: {},
  components: { schemas: {} },
};

for (const service of services) {
  const dir = join(ROOT, service.name);
  const outFile = join(tmpdir(), `vibester-spec-${service.name}.json`);
  console.error(`Gerando spec: ${service.name}...`);

  try {
    execSync(`npx tsx src/generate-spec.ts "${outFile}"`, {
      cwd: dir,
      env: { ...process.env, ...service.env },
      timeout: 30_000,
      stdio: 'pipe',
    });

    const spec = JSON.parse(require('fs').readFileSync(outFile, 'utf-8'));
    if (existsSync(outFile)) unlinkSync(outFile);

    for (const tag of spec.tags ?? []) {
      if (!combined.tags.find((t: any) => t.name === tag.name)) {
        combined.tags.push(tag);
      }
    }

    for (const [path, methods] of Object.entries(spec.paths ?? {})) {
      combined.paths[`${service.prefix}${path}`] = methods;
    }

    Object.assign(combined.components.schemas, spec.components?.schemas ?? {});

    console.error(`  ✓ ${Object.keys(spec.paths ?? {}).length} rotas`);
  } catch (err: any) {
    console.error(`  ✗ Erro em ${service.name}: ${err.stderr?.toString() || err.message}`);
    process.exit(1);
  }
}

const outPath = join(ROOT, 'openapi.json');
writeFileSync(outPath, JSON.stringify(combined, null, 2));
console.error(`\nGerado: ${outPath}`);
