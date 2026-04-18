import { Test } from '@nestjs/testing';
import { AuthServices } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service = AuthServices;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthServices,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthServices);
  });

  it('Can create and instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'teste123');

    expect(user).toEqual({
      id: user.id,
      email: 'test@test.com',
      password: user.password,
    });

    expect(user.password).not.toEqual('teste123');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    await service.signup('aaa@aaa.aaa', 'aaa');
    await expect(service.signup('aaa@aaa.aaa', 'aaa')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws if signin is called with an unused email', async () => {
    await expect(service.signin('aaa@aaa.aaa', 'aaa')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws if an invalid password is provided', async () => {
    await service.signup('aaa@aaa.aaa', 'aaa');
    await expect(service.signin('aaa@aaa.aaa', 'bbb')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Returns a user if correct password is provided', async () => {
    await service.signup('asdfasd@adsffs.fasdf', 'mypass');

    const user = await service.signin('asdfasd@adsffs.fasdf', 'mypass');
    expect(user).toBeDefined();
  });
});
