import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from '@app/user/dto/createUser.dto';
import { UserEntity } from '@app/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDTO } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDTO } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      where: { email: createUserDTO.email },
    });
    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDTO.username },
    });
    if (userByEmail || userByUsername)
      throw new HttpException(
        'User already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDTO);
    return this.userRepository.save(newUser);
  }

  async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDTO.email },
      select: ['id', 'username', 'email', 'password', 'bio', 'image'],
    });
    if (user) {
      const isPasswordCorrect = await compare(
        loginUserDTO.password,
        user.password,
      );
      delete user.password;
      if (isPasswordCorrect) return user;
      else
        throw new HttpException(
          'Credentials not valid',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    } else
      throw new HttpException(
        'Credentials not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    Object.assign(user, updateUserDTO);
    return await this.userRepository.save(user as any);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  generateJWT({ id, username, email }: UserEntity): string {
    return sign({ id, username, email }, JWT_SECRET);
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return { user: { ...user, token: this.generateJWT(user) } };
  }
}
