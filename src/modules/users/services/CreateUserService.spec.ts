import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeCacheProvider = new FakeCacheProvider();
		createUser = new CreateUserService(
			fakeUsersRepository,
			fakeHashProvider,
			fakeCacheProvider,
		);
	});

	it('should be able to create a new user', async () => {
		const user = await createUser.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		expect(user).toHaveProperty('id');
	});

	it('should be able to create a new user with same email from another', async () => {
		await createUser.execute({
			name: 'Jhon Doe',
			email: 'jhondoe@example.com',
			password: '123123123',
		});

		await expect(
			createUser.execute({
				name: 'Jhon Doe',
				email: 'jhondoe@example.com',
				password: '123123123',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
