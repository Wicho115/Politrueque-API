import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/user/model/user";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService : AuthService
    ){
        //usernamefiled puede ser lo que quiera
        super({usernameField : 'email'})
    }

    async validate(email : string, password : string, boleta : string): Promise<User>{        
        const user = await this.authService.validate(email, password);

        if(!user){
            throw new UnauthorizedException('Email or password are not the same');
        }

        return user;
    }

}