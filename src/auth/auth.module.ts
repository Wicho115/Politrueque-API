import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { SessionModule } from 'src/session/session.module';
import { JwtAdminStrategy } from './strategies/admin.strategy';
import { SameUserStrategy } from './strategies/same-jwt.strategy';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() =>UserModule),
    SessionModule,      
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret : process.env.ACCESS_TOKEN_SECRET,
      signOptions : {expiresIn : '7d'}
    })
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtAdminStrategy, SameUserStrategy],
  controllers: [AuthController],
  exports : [AuthService]
})
export class AuthModule {}
