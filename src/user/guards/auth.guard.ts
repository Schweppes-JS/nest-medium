import { IExpressRequest } from '@app/types/expressRequest';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IExpressRequest>();
    if (request.user) return true;
    else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
