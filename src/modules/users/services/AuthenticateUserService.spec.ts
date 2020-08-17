import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();

		authenticateUser = new AuthenticateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});

	it('should be able to authenticate', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		const response = await authenticateUser.execute({
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		expect(response).toHaveProperty('token');
		expect(response.user).toEqual(user);
	});

	it('should be able to authenticate with non existing user', async () => {
		await expect(
			authenticateUser.execute({
				email: 'jhondoe@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to authenticate with wrong password', async () => {
		await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'jhondoe@example.com',
			password: '123456',
		});

		await expect(
			authenticateUser.execute({
				email: 'jhondoe@example.com',
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
