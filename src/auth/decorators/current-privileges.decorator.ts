import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentPrivileges = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
        if (context.getType() === 'http') {
            return context.switchToHttp().getRequest().user.privileges;
        }

        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.user.privileges;
    },
);