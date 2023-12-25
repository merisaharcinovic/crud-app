import { Module } from '@nestjs/common';
import { AuthController } from '../auth/controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { UsersService } from 'src/users/services/users.service';
import { UserRepository } from 'src/database/repositories/user.repository';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UsersService, UserRepository],
  exports: [JwtStrategy, LocalStrategy]
})
export class AuthModule {}
