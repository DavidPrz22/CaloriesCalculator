import { prisma } from "@/prisma/lib/prisma";
import bcrypt from "bcrypt";
import { type UserSchemaType} from './zod';
import { randomBytes } from "crypto";
import * as jose from 'jose';
import type { Tokens } from "./type";

export class UserController {

    static async comparePasswords(plainPassword: string, hashedPassword: string) {
        // Logic to compare passwords
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    }

    static async hashPassword(password: string) {
        // Logic to hash password
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    }

    static async loginUser({ username, password }: UserSchemaType) {

        // Logic to login user
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await this.comparePasswords(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return {
            id: user.id,
            username: user.username
        };
    }

    static async registerUser({ username, password }: UserSchemaType) {
        // Logic to register user
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (user) {
            throw new Error('User already exists');
        }

        const hashedPassword = await this.hashPassword(password);
        const newUser = await prisma.user.create({
            
            data: {
                username,
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
            },
        });

        return newUser;
    
    }

    static async getUserProfile(user: { id: number; username: string } | undefined) {
        // Logic to retrieve user profile

        if (!user) {
            return null;
        }
        const userProfile = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                id: true,
                username: true,
            },
        });

        return userProfile;
    }

    static async accessJWT(user: { id: number, username: string }) : Promise<string> {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_jwt_secret');

        const alg = 'HS256'

        const jwt = await new jose.SignJWT(user)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:example:issuer')
        .setAudience('urn:example:audience')
        .setExpirationTime('2h')
        .sign(secret)

        return jwt;
    }

    static generateRefreshToken() {
        const refreshToken = randomBytes(64).toString('hex');
        return refreshToken;
    }

    static async generateTokens(user: { id: number, username: string }) : Promise<Tokens> {
        const accessToken = await this.accessJWT(user);
        const refreshToken = this.generateRefreshToken();
        return { 
            "access": accessToken, 
            "refresh": refreshToken 
        };
    }

    static async updateRefreshTokenInDB(userId: number, refreshToken: string) {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }

    static async getUserByRefreshToken(refreshToken: string) {
        return await prisma.user.findFirst({
            where: { refreshToken },
            select: { id: true, username: true }
        });
    }

    static async clearRefreshTokenInDB(userId: number) {
        await prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }
}