import { userRepository } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { RegisterDto, LoginDto, UserRole } from '../types';

export class AuthService {
  async register(dto: RegisterDto) {
    const exists = await userRepository.existsByEmail(dto.email);
    if (exists) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const user = await userRepository.create({
      ...dto,
      role: dto.role ?? UserRole.SALES,
    });

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    return { user, accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email, true);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValid = user.comparePassword
      ? await user.comparePassword(dto.password)
      : false;
    if (!isValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const payload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);

    const userWithoutSensitive = await userRepository.findById(user._id.toString());
    return { user: userWithoutSensitive, accessToken, refreshToken };
  }

  async refreshTokens(token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await userRepository.findByEmailWithRefreshToken(payload.email);
    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, 'Refresh token mismatch');
    }

    const newPayload = { id: user._id.toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(newPayload);
    const refreshToken = generateRefreshToken(newPayload);

    await userRepository.updateRefreshToken(user._id.toString(), refreshToken);
    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }
}

export const authService = new AuthService();
