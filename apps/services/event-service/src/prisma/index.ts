import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});

const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;
