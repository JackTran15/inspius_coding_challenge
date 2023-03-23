import { configService } from '@/shared/services/config.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // Get Api ket from request header
    const key = req.headers['X-API-KEY'] ?? req.query.api_key; // checks the header, moves to query if null
    return key === configService.getApiKey();
  }
}
