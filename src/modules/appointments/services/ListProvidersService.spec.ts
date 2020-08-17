import 'reflect-metadata';
import ListProvidersService from '@modules/appointments/services/LIstProvidersService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeCacheProvider = new FakeCacheProvider();
		listProviders = new ListProvidersService(
			fakeUsersRepository,
			fakeCacheProvider,
		);
	});

	it('should be able to list the providers', async () => {
		const user1 = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123',
		});

		const user2 = await fakeUsersRepository.create({
			name: 'John Trê',
			email: 'johntre@example.com',
			password: '321321',
		});

		const logedUser = await fakeUsersRepository.create({
			name: 'User Loged',
			email: 'user@example.com',
			password: '123456',
		});

		const providers = await listProviders.execute({
			userId: logedUser.id,
		});

		expect(providers).toEqual([user1, user2]);
	});
});
