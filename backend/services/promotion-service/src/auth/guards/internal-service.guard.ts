import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InternalServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expectedToken = this.configService.get<string>(
      'INTERNAL_SERVICE_TOKEN',
    );
    const receivedToken = request.header('x-internal-service-token');

    if (!expectedToken || receivedToken !== expectedToken) {
      throw new UnauthorizedException('Invalid internal service credentials');
    }

    return true;
  }
}
