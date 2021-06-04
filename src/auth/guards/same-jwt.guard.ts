import { AuthGuard } from "@nestjs/passport";

export class SameUserAuthGuard extends AuthGuard('same-user'){}