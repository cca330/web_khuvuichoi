import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/entities/user.entity';
import { SecurityLogger } from './security-logger.service';

// In-memory store for refresh tokens (nên dùng Redis trong production)
const refreshTokens = new Map<string, { userId: number; username: string; expiresAt: Date }>();

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly securityLogger: SecurityLogger,
  ) {}

  // Tương ứng handleLogin() trong PHP
  async login(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (!user) {
      this.securityLogger.logLoginFailed(username, 'User not found');
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    if (user.status === UserStatus.BLOCK) {
      this.securityLogger.logLoginFailed(username, 'Account blocked');
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.securityLogger.logLoginFailed(username, 'Invalid password');
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    this.securityLogger.logLoginSuccess(username, user.id);

    // Access token ngắn hạn (15 phút)
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    // Refresh token dài hạn (7 ngày)
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // Lưu refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    refreshTokens.set(refreshToken, { userId: user.id, username: user.username, expiresAt });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 phút = 900 giây
      user: { id: user.id, username: user.username, role: user.role },
    };
  }

  // Refresh token để lấy access token mới
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const stored = refreshTokens.get(refreshToken);
      if (!stored) {
        throw new UnauthorizedException('Refresh token không tồn tại');
      }

      if (stored.expiresAt < new Date()) {
        refreshTokens.delete(refreshToken);
        throw new UnauthorizedException('Refresh token đã hết hạn');
      }

      // Lấy user info
      const user = await this.usersService.findOne(stored.userId);
      if (!user || user.status === UserStatus.BLOCK) {
        throw new UnauthorizedException('User không hợp lệ');
      }

      // Tạo access token mới
      const newPayload = { sub: user.id, username: user.username, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });

      return {
        accessToken: newAccessToken,
        expiresIn: 900,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
  }

  // Đăng xuất - xóa refresh token
  async logout(refreshToken: string) {
    refreshTokens.delete(refreshToken);
    return { message: 'Đăng xuất thành công' };
  }

  // Tương ứng handleRegister() trong PHP
  async register(username: string, password: string, email: string) {
    const usernameTaken = await this.usersService.existsUsername(username);
    if (usernameTaken) {
      throw new ConflictException('Username đã tồn tại');
    }

    const emailTaken = await this.usersService.existsEmail(email);
    if (emailTaken) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(username, hashed, email);

    return {
      message: 'Đăng ký thành công',
      id: user.id,
      username: user.username,
    };
  }

  // Tương ứng handleForgotPassword() — thay session bằng reset-token JWT ngắn hạn
  async forgotPassword(username: string, email: string) {
    const user = await this.usersService.findByUsernameAndEmail(
      username,
      email,
    );

    if (!user) {
      throw new BadRequestException('Sai thông tin username hoặc email');
    }

    // Token sống ngắn (15 phút), chỉ dùng để xác nhận quyền đổi mật khẩu
    const resetToken = this.jwtService.sign(
      { sub: user.id, username: user.username, purpose: 'reset-password' },
      { expiresIn: '15m' },
    );

    return {
      resetToken,
      message: 'Xác minh thành công, dùng token này để đổi mật khẩu',
    };
  }

  // Tương ứng updatePassword() trong PHP
  async resetPassword(resetToken: string, newPassword: string) {
    let payload: any;
    try {
      payload = this.jwtService.verify(resetToken);
    } catch {
      throw new BadRequestException('Reset token không hợp lệ hoặc đã hết hạn');
    }

    if (payload.purpose !== 'reset-password') {
      throw new BadRequestException('Token không hợp lệ');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    return this.usersService.updatePassword(payload.username, hashed);
  }
}
