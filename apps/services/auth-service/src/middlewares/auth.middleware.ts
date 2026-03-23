import { Request, Response, NextFunction } from "express";
import { jwtUtil } from "../utils/jwt.util";
import { AppError } from "./error.middleware";

export interface AuthRequest extends Request {
    userId?: String;
}

export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        throw new AppError("Token de autenticação não informado", 401);
    }

    const [, token] = authorization.split(" ")

    try {
        const { userId } = jwtUtil.verify(token);
        req.userId = userId;
        next();
    } catch (err) {
        throw new AppError("Token de autenticação inválido", 401);
    }
}