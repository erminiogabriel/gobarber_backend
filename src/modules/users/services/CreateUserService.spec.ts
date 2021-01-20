import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Gabriel Erminio Machado',
      email: 'gabriel@movitech.com.br',
      password: 'senha123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Gabriel Erminio Machado',
      email: 'gabriel@movitech.com.br',
      password: 'senha123',
    });

    await expect(
      createUser.execute({
        name: 'Gabriel Erminio Machado',
        email: 'gabriel@movitech.com.br',
        password: 'senha123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});