import Router, { type Router as RouterType } from 'express';
/// <reference path="../nodeApp/types/express.d.ts" />
import { UserSchema } from './zod';
import { UserController } from './controller';  
import { UserService } from './services/services';

export function getPublicUserRoutes(): RouterType {
    const userRoutes = Router();

    userRoutes.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const validationResult = UserSchema.safeParse({ username, password });
        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error });
        }

        const user = await UserController.loginUser({ username, password });
        const { access, refresh } = await UserController.generateTokens({ id: user.id, username: user.username });
    
        await UserController.updateRefreshTokenInDB(user.id, refresh);

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.json({ message: 'Login successful', user, accessToken: access });
    })

    userRoutes.post('/signup', async (req, res) => {
        const { username, password } = req.body;
        const validationResult = UserSchema.safeParse({ username, password });

        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error });
        }

        const user = await UserController.registerUser({ username, password });
        const { access, refresh } = await UserController.generateTokens({ id: user.id, username: user.username });
        
        await UserController.updateRefreshTokenInDB(user.id, refresh);

        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.status(201).json({ message: 'User registered successfully', user, accessToken: access });
    }) 

    userRoutes.post('/refresh-token', async (req, res) => {
        const cookieHeader = req.headers.cookie;
        const currentRefreshToken = cookieHeader?.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];
        
        if (!currentRefreshToken) {
            return res.status(401).json({ error: 'Unauthorized: No refresh token provided' });
        }

        const user = await UserController.getUserByRefreshToken(currentRefreshToken);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid refresh token' });
        }

        const { access, refresh } = await UserController.generateTokens({ id: user.id, username: user.username });
        await UserController.updateRefreshTokenInDB(user.id, refresh);
        
        res.cookie('refreshToken', refresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({ message: 'Token refreshed successfully', user: user, accessToken: access });
    })

    return userRoutes;
}

export function getPrivateUserRoutes(): RouterType {
    const userRoutes = Router();

    userRoutes.get('/profile', UserService.validateJWT, async (req, res) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userProfile = await UserController.getUserProfile(user);
        res.json(userProfile);
    }) 

    userRoutes.post('/logout', async (req, res) => {
        const cookieHeader = req.headers.cookie;
        const currentRefreshToken = cookieHeader?.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];

        if (!currentRefreshToken) {
            return res.status(400).json({ error: 'No refresh token provided' });
        }
        
        const user = await UserController.getUserByRefreshToken(currentRefreshToken);

        if (!user) {
            return res.status(400).json({ error: 'Invalid refresh token' });
        }

        await UserController.clearRefreshTokenInDB(user.id);
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.json({ message: 'Logout successful' });
    })

    return userRoutes;
}