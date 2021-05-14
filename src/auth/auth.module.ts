import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { SessionModule } from 'src/session/session.module';

@Module({
  imports: [
    UserModule,
    SessionModule,  
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret : process.env.ACCESS_TOKEN_SECRET,
      signOptions : {expiresIn : '7d'}
    })
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
