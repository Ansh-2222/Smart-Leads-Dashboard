import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/ApiResponse';
import { AuthenticatedRequest, RegisterDto, LoginDto } from '../types';
import { env } from '../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: RegisterDto = req.body;
    const { user, accessToken, refreshToken } = await authService.register(dto);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { user, accessToken }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const dto: LoginDto = req.body;
    const { user, accessToken, refreshToken } = await authService.login(dto);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { user, accessToken }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token: string = req.cookies?.refreshToken ?? req.body?.refreshToken;
    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token provided' });
      return;
    }
    const { accessToken, refreshToken } = await authService.refreshTokens(token);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
    sendSuccess(res, { accessToken }, 'Token refreshed');
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (req.user?.id) await authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, { user }, 'User fetched');
  } catch (err) {
    next(err);
  }
};
