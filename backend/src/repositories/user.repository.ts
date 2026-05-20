import { UserModel } from '../models/User.model';
import { IUser, RegisterDto } from '../types';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query;
  }

  async findByEmailWithRefreshToken(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+refreshToken');
  }

  async create(data: RegisterDto): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshToken });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find().select('-password -refreshToken');
  }
}

export const userRepository = new UserRepository();
