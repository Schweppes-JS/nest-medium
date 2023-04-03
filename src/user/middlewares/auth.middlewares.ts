import { JWT_SECRET } from '@app/config';
import { IExpressRequest } from '@app/types/expressRequest';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decode = verify(token, JWT_SECRET);
        const user = await this.userService.findById(decode['id']);
        req.user = user;
        next();
      } catch (e) {
        req.user = null;
        return next();
      }
    } else {
      req.user = null;
      return next();
    }
  }
}
