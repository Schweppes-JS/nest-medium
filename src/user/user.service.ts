import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { IUserResponse } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);
    return this.userRepository.save(newUser);
  }

  generateJWT({ id, username, email }: UserEntity): string {
    return sign({ id, username, email }, JWT_SECRET);
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return { user: { ...user, token: this.generateJWT(user) } };
  }
}
