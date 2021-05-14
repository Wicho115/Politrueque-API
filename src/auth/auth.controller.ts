import { BadRequestException, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/model/user';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
        private readonly sessionService : SessionService,
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req : Request) : Promise<{access_token : string, user : Record<string, string | boolean>}>{
        return await this.authService.login(req.user as User)
    }

    @Get('logout')
    logout(@Req() req : Request){
        const token =  req.query['token'] as string;

        if(!token){
            return new BadRequestException('Token was not provided')
        }else{
            const { id } = this.authService.resolveIDFromToken(token);
            this.sessionService.invalidateToken(id, token);
            return {
                succes : true
            }
        }
    }

    @Get('destroy')
    async destroy(@Req() req: Request) {
        const token = req.query['token'] as string;
        if (!token)
            return new BadRequestException(
                "Token wasn't provided on request query.",
            );
        else {
            const { id } = this.authService.resolveIDFromToken(token);
            const valid = await this.sessionService.isValidToken(id, token);
            if (valid) {
                this.sessionService.invalidateAllTokens(id);
                return {
                    success: true,
                };
            } else {
                return new UnauthorizedException();
            }
        }
    }

    @Get('validate')
    async validate(@Req() req: Request) {

        const token = req.query['token'] as string;        
        
        if (!token)
            return new BadRequestException(
                "Token wasn't provided on request query.",
            );
        else {
            
            const { id } = this.authService.resolveIDFromToken(token);            
            
            const valid = await this.sessionService.isValidToken(id, token);            
            
            return { valid };
        }
    }
}
