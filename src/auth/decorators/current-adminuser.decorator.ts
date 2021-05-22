import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentAdminUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest().user._doc;
        }

        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user._doc;
    },
);