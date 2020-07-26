import 'reflect-metadata';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		updateProfile = new UpdateProfileService(
			fakeUsersRepository,
			fakeHashProvider,
		);
	});

	it('should be able update the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123123',
		});

		const updatedUser = await updateProfile.execute({
			userId: user.id,
			name: 'John Trê',
			email: 'johntre@example.com',
		});

		expect(updatedUser.name).toBe('John Trê');
		expect(updatedUser.email).toBe('johntre@example.com');
	});

	it('should not be able update the profile from non-existing user', async () => {
		await expect(
			updateProfile.execute({
				userId: 'non-existing-user-id',
				name: 'Test',
				email: 'test@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to change to another user email', async () => {
		await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123123',
		});

		const user = await fakeUsersRepository.create({
			name: 'Test',
			email: 'test@example.com',
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				userId: user.id,
				name: 'John Trê',
				email: 'johndoe@example.com',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able update the password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123',
		});

		const updatedUser = await updateProfile.execute({
			userId: user.id,
			name: 'John Trê',
			email: 'johntre@example.com',
			oldPassword: '123123',
			password: '123456',
		});

		expect(updatedUser.password).toBe('123456');
	});

	it('should not be able to update the password without old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123',
		});

		await expect(
			updateProfile.execute({
				userId: user.id,
				name: 'John Trê',
				email: 'johntre@example.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not be able to update the password with wrong old password', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123',
		});

		await expect(
			updateProfile.execute({
				userId: user.id,
				name: 'John Trê',
				email: 'johntre@example.com',
				oldPassword: 'wrong-old-password',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
