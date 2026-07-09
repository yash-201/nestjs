import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    if (context.getType<string>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext();
      return {
        req: gqlCtx.req,
        res: gqlCtx.req?.res || gqlCtx.res
      };
    }

    // HTTP REST fallback
    return {
      req: context.switchToHttp().getRequest(),
      res: context.switchToHttp().getResponse()
    };
  }
}
