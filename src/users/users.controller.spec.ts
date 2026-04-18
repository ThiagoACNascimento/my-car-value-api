import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthServices } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthServices>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'adsf@fadsf.dfas',
          password: 'safadf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdfad' } as User]);
      },
      // remove: (id: number) => { },
      // update: () => {},
    };
    fakeAuthService = {
      // signup: () => {},
      // signin: () => {
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUserService },
        { provide: AuthServices, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUserAll returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('adasf@fadsdf.dsfsd');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('adasf@fadsdf.dsfsd');
  });
});
