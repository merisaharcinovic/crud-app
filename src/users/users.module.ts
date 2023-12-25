import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

import { UserRepository } from 'src/database/repositories/user.repository';
import { UserEntity } from 'src/database/entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UserModule {}
