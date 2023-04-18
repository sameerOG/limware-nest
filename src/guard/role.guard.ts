import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import JwtAuthenticationGuard from '../guard/jwtAuthentication.guard';

const RoleGuard = (role: any): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthenticationGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<any>();
      console.log(request);
      const user = request.user;

      return user?.role.includes(role);
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
