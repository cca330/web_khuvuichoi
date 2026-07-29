import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class SecurityLogger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: path.join('logs', 'security.log'),
          level: 'info',
        }),
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error',
        }),
      ],
    });
  }

  logLoginSuccess(username: string, userId: number, ip?: string) {
    this.logger.info('Login successful', {
      event: 'LOGIN_SUCCESS',
      username,
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logLoginFailed(username: string, reason: string, ip?: string) {
    this.logger.warn('Login failed', {
      event: 'LOGIN_FAILED',
      username,
      reason,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logRefreshTokenUsed(userId: number, ip?: string) {
    this.logger.info('Refresh token used', {
      event: 'REFRESH_TOKEN_USED',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logUnauthorizedAccess(endpoint: string, method: string, ip?: string) {
    this.logger.warn('Unauthorized access attempt', {
      event: 'UNAUTHORIZED_ACCESS',
      endpoint,
      method,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logForbiddenAccess(endpoint: string, userId: number, role: string, ip?: string) {
    this.logger.warn('Forbidden access attempt', {
      event: 'FORBIDDEN_ACCESS',
      endpoint,
      userId,
      role,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logRateLimitExceeded(endpoint: string, ip?: string) {
    this.logger.warn('Rate limit exceeded', {
      event: 'RATE_LIMIT_EXCEEDED',
      endpoint,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logSuspiciousActivity(message: string, details: any) {
    this.logger.error('Suspicious activity detected', {
      event: 'SUSPICIOUS_ACTIVITY',
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logPasswordReset(username: string, userId: number, ip?: string) {
    this.logger.info('Password reset requested', {
      event: 'PASSWORD_RESET',
      username,
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logPasswordChanged(userId: number, ip?: string) {
    this.logger.info('Password changed', {
      event: 'PASSWORD_CHANGED',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }
}
