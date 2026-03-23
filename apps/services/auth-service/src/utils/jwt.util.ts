import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const jwtUtil = {
    generateAccess(userId: string): string {
        return jwt.sign({ userId }, env.jwtSecret, {
            expiresIn: env.jwtExpiresIn,
        })
    },

    generateRefresh(userId: string): string {
        return jwt.sign({ userId }, env.jwtSecret, {
            expiresIn: env.jwtRefreshExpiresIn,
        })
    },

    verify(token: string): { userId: string } {
        return jwt.verify(token, env.jwtSecret) as { userId: string };
    }
}