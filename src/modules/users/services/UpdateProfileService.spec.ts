// import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gobarber.com.br',
      password: '123456',
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'nome_atualizado',
      email: 'novoemail@gobarber.com.br',
    });
    expect(updatedUser.name).toBe('nome_atualizado');
    expect(updatedUser.email).toBe('novoemail@gobarber.com.br');
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'gabriel',
      email: 'gabriel@gobarber.com.br',
      password: '123456',
    });
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gobarber.com.br',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'gabriel',
        email: 'gabriel@gobarber.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gobarber.com.br',
      password: '123456',
    });
    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'gabriel',
      email: 'gabriel@gobarber.com.br',
      old_password: '123456',
      password: 'abcdef',
    });
    expect(updatedUser.name).toBe('gabriel');
    expect(updatedUser.email).toBe('gabriel@gobarber.com.br');
    expect(updatedUser.password).toBe('abcdef');
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gobarber.com.br',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'gabriel',
        email: 'gabriel@gobarber.com.br',
        password: 'abcdef',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'teste',
      email: 'teste@gobarber.com.br',
      password: '123456',
    });
    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'gabriel',
        email: 'gabriel@gobarber.com.br',
        password: 'abcdef',
        old_password: 'wrong_old_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to update the profile from non existing user', async () => {
    expect(
      updateProfileService.execute({
        name: 'gabriel',
        email: 'gabriel@gobarber.com.br',
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
