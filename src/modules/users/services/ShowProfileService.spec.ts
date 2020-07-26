import 'reflect-metadata';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersReposiroty';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		showProfile = new ShowProfileService(fakeUsersRepository);
	});

	it('should be able show the profile', async () => {
		const user = await fakeUsersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123123123',
		});

		const profile = await showProfile.execute({
			userId: user.id,
		});

		expect(profile.name).toBe('John Doe');
		expect(profile.email).toBe('johndoe@example.com');
	});

	it('should not be able show the profile from non-existing user', async () => {
		await expect(
			showProfile.execute({
				userId: 'non-existing-user-id',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
