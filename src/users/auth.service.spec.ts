import { Test } from '@nestjs/testing';
import { AuthServices } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

it('can create and instance of auth service', async () => {
  const fakeUserService: Partial<UsersService> = {
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

  const service = module.get(AuthServices);

  expect(service).toBeDefined();
});
