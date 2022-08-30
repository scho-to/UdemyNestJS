import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let fakeRepository: Record<string, unknown>;

  beforeEach(async () => {
    fakeRepository = {
      create: (userDto: CreateUserDto) => {
        return {
          id: 1,
          email: userDto.email,
          password: userDto.password
        } as User;
      },
      save: (user: User) => {
        return user;
      },
      findOneBy: (user: Partial<User>) => {
        return {
          id: user.id,
          email: 'blah@blub.com',
          password: 'horrific'
        } as User;
      },
      remove: (userDto: UserDto) => {
        return userDto;
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeRepository
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a user with the given email and password', async () => {
    const user = await service.create('asdf@asdf.com', 'asdf');
    expect(user).toBeDefined();
  });

  it('findOne should return null if given id is null', async () => {
    const user = await service.findOne(undefined);
    expect(user).toBeNull();
  });

  it('findOne should return user id given id is valid', async () => {
    const user = await service.findOne(1);
    expect(user).toBeDefined();
  });

  it('remove throws an error if given id is not found', async () => {
    fakeRepository.findOneBy = () => null;
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('remove should return the user if given id is valid', async () => {
    const user = await service.remove(1);
    expect(user).toBeDefined();
  });
});
