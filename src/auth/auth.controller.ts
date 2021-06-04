import { BadRequestException, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { SessionService } from 'src/session/session.service';
import { User } from 'src/user/model/user';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SameUserAuthGuard } from './guards/same-jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly sessionService: SessionService,
        private readonly userService : UserService,
    ) { }

    @Get('test')
    test(@Req() req: Request) {
        const quer = req.query;
        console.log(quer);

        const t = req.query['t'];
        console.log(t);
        return 'Yes';
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: Request): Promise<{ access_token: string, user: Record<string, string | boolean> }> {
        return await this.authService.login(req.user as User)
    }

    @UseGuards(SameUserAuthGuard)
    @Get('logout')
    logout(@Req() req: Request) {
        const token = req.query['token'] as string;

        if (!token) {
            return new BadRequestException('Token was not provided')
        } else {
            const { id } = this.authService.resolveIDFromToken(token);
            this.sessionService.invalidateToken(id, token);
            return {
                succes: true
            }
        }
    }

    @UseGuards(SameUserAuthGuard)
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

    @UseGuards(SameUserAuthGuard)
    @Get('validate')
    async validate(@Req() req: Request) {        
        const token = req.query['token'] as string;                

        const { id } = this.authService.resolveIDFromToken(token);
        const valid = await this.sessionService.isValidToken(id, token);    
        let user = await this.userService.searchUserByID(id);
        const admin = await this.userService.getAdminByID(id);
        let privileges ;
        if(!admin){
            privileges = null;
        }else{
            privileges = admin.privileges
        }
        if(!user) user = null;
        return { valid, user : {
            _id : user._id,
            email : user.email,
            boleta : user.boleta,
            img : user.img,
            username : user.username
        }, privileges };

    }
}
