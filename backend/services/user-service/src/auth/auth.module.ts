import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SecurityLogger } from './security-logger.service';

// Validate JWT config at startup
function validateJwtConfig(configService: ConfigService): void {
  const jwtSecret = configService.get<string>('JWT_SECRET');
  const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN');

  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  if (jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (!jwtExpiresIn) {
    throw new Error('JWT_EXPIRES_IN environment variable is required');
  }
}

@Module({
  imports: [
    UsersModule, // dùng lại UsersService (đã export ở bước trước)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Validate config at startup
        validateJwtConfig(configService);

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') as any,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SecurityLogger],
})
export class AuthModule {}
