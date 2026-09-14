import { type UserSchemaType } from './zod';
import type { Tokens } from "./type";
export declare class UserController {
    static comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    static hashPassword(password: string): Promise<string>;
    static loginUser({ username, password }: UserSchemaType): Promise<{
        id: number;
        username: string;
    }>;
    static registerUser({ username, password }: UserSchemaType): Promise<{
        id: number;
        username: string;
    }>;
    static getUserProfile(user: {
        id: number;
        username: string;
    } | undefined): Promise<{
        id: number;
        username: string;
    } | null>;
    static accessJWT(user: {
        id: number;
        username: string;
    }): Promise<string>;
    static generateRefreshToken(): string;
    static generateTokens(user: {
        id: number;
        username: string;
    }): Promise<Tokens>;
    static updateRefreshTokenInDB(userId: number, refreshToken: string): Promise<void>;
    static getUserByRefreshToken(refreshToken: string): Promise<{
        id: number;
        username: string;
    } | null>;
    static clearRefreshTokenInDB(userId: number): Promise<void>;
}
//# sourceMappingURL=controller.d.ts.map