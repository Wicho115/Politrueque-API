import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { SessionService } from "src/session/session.service";
import { Privileges } from "src/user/interface/privileges.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'admin'){
    constructor(
        private readonly userService : UserService,
        private readonly sessionService : SessionService,
    ){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : process.env.ACCESS_TOKEN_SECRET,
            passReqToCallback: true,
        })
    }

    async validate(
        request,
        validationPayload : {id : string, privileges : Privileges},
        done
    ){           
        
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
        const user = await this.userService.searchUserByID(validationPayload.id)        
        

        const admin = await this.userService.getAdminByID(user._id);

        if(!admin){
            done(new UnauthorizedException('Access Denied'), null)
        }

        const privileges = admin.privileges;

        const isValid = await this.sessionService.isValidToken(
            !user ? 'no existe': user._id,
            token
        )    

        if(isValid){
           return done(null, {...user, privileges});                      
        }
        
        done(new UnauthorizedException('The session has expired'), null)
    }
}