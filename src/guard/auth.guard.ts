import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const allowUnauthorizedRequest = this.reflector.get<boolean>(
      'allowUnauthorizedRequest',
      context.getHandler(),
    );
    function indexFind(value) {
      return value == 'Authorization';
    }
    if (allowUnauthorizedRequest) {
      return allowUnauthorizedRequest;
    } else {
      let index = request.res.req.rawHeaders.findIndex(indexFind);
      if (index != -1) {
        try {
          const token =
            request.res.req.rawHeaders[index + 1]?.split('Bearer ')[1];
          const loggedInUser: any = jwtDecode(token);
          if (loggedInUser?.full_name) {
            return true;
          } else {
            return false;
          }
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
}
