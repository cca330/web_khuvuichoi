import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@SkipThrottle() // Bỏ qua global throttle cho auth controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 10, ttl: 600000 } }) // Giới hạn 5 đăng ký/phút
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password, dto.email);
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 10, ttl: 600000 } }) // Giới hạn 5 đăng nhập/phút - chống brute force
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @Post('forgot-password')
  @Throttle({ short: { limit: 3, ttl: 60000 }, long: { limit: 5, ttl: 600000 } }) // Giới hạn 3 request/phút
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.username, dto.email);
  }

  @Post('reset-password')
  @Throttle({ short: { limit: 3, ttl: 60000 }, long: { limit: 5, ttl: 600000 } })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.resetToken, dto.newPassword);
  }
}
