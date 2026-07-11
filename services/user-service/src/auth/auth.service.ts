import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserStatus } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Tương ứng handleLogin() trong PHP
  async login(username: string, password: string) {
    const user = await this.usersService.findByUsernameWithPassword(username);

    if (!user) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    if (user.status === UserStatus.BLOCK) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    // Thay cho $_SESSION cũ — cấp JWT token
    const payload = { sub: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { id: user.id, username: user.username, role: user.role },
    };
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
