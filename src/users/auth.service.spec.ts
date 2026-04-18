import { Test } from '@nestjs/testing';
import { AuthServices } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service = AuthServices;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
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
      id: 1,
      email: 'test@test.com',
      password: user.password,
    });

    expect(user.password).not.toEqual('teste123');

    const [salt, hash] = user.password.split('.');

    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: 'a' } as User]);
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdfasfas@asdfa.adsf', 'asdfasdf'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Throws if an invalid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { email: 'asdfads@adfssf.dsfas', password: 'adsfasfa' } as User,
      ]);

    await expect(
      service.signin('adsfaadsf@asdfas.fasdf', 'asdfasdf'),
    ).rejects.toThrow(BadRequestException);
  });

  it('Returns a user if correct password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        {
          email: 'asdfads@adfssf.dsfas',
          password:
            'c586c2fdf69e0bc4.d7909fdb7f649c20584373bbe71e7b008b6ae50fc713460d9b6780c13585a6d7',
        } as User,
      ]);

    const user = await service.signin('adsfaadsf@asdfas.fasdf', 'mypass');
    expect(user).toBeDefined();
  });
});
