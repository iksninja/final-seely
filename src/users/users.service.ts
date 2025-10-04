import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly repository:
    Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    const user = {
      ...createUserDto,
      password: hashedPassword

    }

    const saveUser = await this.repository.save(user);
    const { password, ...userWithoutPassword } = saveUser;

    return userWithoutPassword;
  }

  async findAll() {

    

    return this.repository.find();
  }

  async findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }

  async upsertByKeycloakId(username: string, keycloakId: string): Promise<User> {
    try {
      return await this.repository.findOneByOrFail({ keycloakId });
    } catch {
     await this.repository.upsert(
      { username, keycloakId },
      {
        conflictPaths: ['keycloakId'],
      },
    );
    return this.repository.findOneByOrFail({ keycloakId });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
