import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
     const request = context.switchToHttp().getRequest();
     const allowUnauthorizedRequest = this.reflector.get<boolean>('allowUnauthorizedRequest', context.getHandler());
    function indexFind(value) {
        return value == 'Authorization';
    }
    if(allowUnauthorizedRequest) {
        return allowUnauthorizedRequest
    } else {
        let index = request.res.req.rawHeaders.findIndex(indexFind)
        if(index != -1) {
            return true
        } else {
            return false
        }
    }
  }
}