import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class GetOptionalUserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const token =
      request.headers['authorization'] &&
      request.headers['authorization'].split(' ')[1];

    const user = this.jwtService.decode(token);

    if (user) {
      request.user = user;
    }

    return next.handle();
  }
}
