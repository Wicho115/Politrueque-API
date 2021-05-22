import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

export class AdminAuthGuard extends AuthGuard('admin'){
    getRequest(context : ExecutionContext): any {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}