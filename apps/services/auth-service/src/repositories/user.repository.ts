import { prisma } from "../config/prisma.config";
import { RegisterDTO } from "../dtos/auth.dto";

interface User { 
    id: string
    name: string
    email: string
    password: string
}

export const userRepository = {
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        })
    },

    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        })
    },

    async create(data: RegisterDTO): Promise<User> {
        return prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
            },
        })
    },

}