import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/user';
import { UserService } from 'src/user/user.service';
import {compare} from 'bcryptjs'
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService : UserService,
        private readonly jwtService : JwtService,
        private readonly sessionService : SessionService,
    ) {}

    async validate(email: string, password : string): Promise<User> | null{
        const user = await this.userService.searchUserByEmail(email);

        if(!user){
            return null;
        }

        const validPassword = await compare(password, user.password)

        return validPassword ? user : null;
    }

    async login(user : User): Promise<{access_token : string, user : Record<string, string | boolean>}>{
        const payload = {
            id : user._id
        }

        const token = this.jwtService.sign(payload, {
            secret : process.env.ACCESS_TOKEN_SECRET
        })

        await this.sessionService.createSession(user._id, token);

        return {
            user: {
                email: user.email,
                username : user.username,
                id : user._id,            

            },
            access_token : token
        }
    }

    async verify(token : string): Promise<User>{
        const decoded = this.jwtService.verify(token, {
            secret : process.env.ACCESS_TOKEN_SECRET
        })

        const user = await this.userService.searchUserByEmail(decoded.mail);

        if(!user){
            throw new Error('Unable to get the user from token');
        }

        return user;
    }

    resolveIDFromToken(token: string): { id: string } {
        return this.jwtService.verify(token, {
            secret: process.env.ACCESS_TOKEN_SECRET,
        });
    }
}