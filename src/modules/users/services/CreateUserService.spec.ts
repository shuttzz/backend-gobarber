import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
	it('should be able to create a new user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		const user = await createUser.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		expect(user).toHaveProperty('id');
	});

	it('should be able to create a new user with same email from another', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
		);

		await createUser.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		expect(
			createUser.execute({
				name: 'Jhon Doe',
				email: 'jhondoe@example.com',
				password: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
