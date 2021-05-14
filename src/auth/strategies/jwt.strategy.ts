import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { SessionService } from "src/session/session.service";
import { User } from "src/user/model/user";
import { UserService } from "src/user/user.service";

// esta estrategia se usa para las rutas

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly userService : UserService,
        private readonly sessionService : SessionService,
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
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
        const user = await this.userService.searchUserByID(validationPayload.id)

        console.log(validationPayload.id);
        
        console.log(token);
        console.log(user);
        
        

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