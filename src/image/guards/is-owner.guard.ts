import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return true;
  }
}
