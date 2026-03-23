import { Response } from "express";

export const responseUtil = {
    success(res: Response, data: any, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            data,
        });
    },

    error(res: Response, message: string, statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
}