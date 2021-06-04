import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionService } from "src/session/session.service";
import { User } from "src/user/model/user";
import { UserService } from "src/user/user.service";
import { AuthService } from "../auth.service";

// esta estrategia se usa para las rutas

@Injectable()
export class SameUserStrategy extends PassportStrategy(Strategy, 'same-user'){
    constructor(
        private readonly userService : UserService,
        private readonly sessionService : SessionService,
        private readonly authService : AuthService,
    ){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : process.env.ACCESS_TOKEN_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(
        request,
        validationPayload : {id : string},
        done,
    ): Promise<void>{
        const Querytoken = request.query['token'] as string;                
        if (!Querytoken) done(new BadRequestException("Token wasn't provided on request query."));       
           
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
        const user = await this.userService.searchUserByID(validationPayload.id)

        const queryID = this.authService.resolveIDFromToken(Querytoken);
        const QueryUser = await this.userService.searchUserByID(queryID.id);
        if(QueryUser._id != validationPayload.id) done(new UnauthorizedException("Access denied"));

        const isValid = await this.sessionService.isValidToken(
            !user ? 'no existe': user._id,
            token
        )

        if(isValid){
           return done(null, user);                      
        }
        
        done(new UnauthorizedException('The session has expired'), null)
        
    }

}