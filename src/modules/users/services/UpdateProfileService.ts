import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsuersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
	userId: string;
	name: string;
	email: string;
	oldPassword?: string;
	password?: string;
}

@injectable()
class UpdateProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsuersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({
		userId,
		name,
		email,
		password,
		oldPassword,
	}: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new AppError('User not found');
		}

		const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

		if (userWithUpdatedEmail && userWithUpdatedEmail.id !== userId) {
			throw new AppError('E-mail already in use.');
		}

		user.name = name;
		user.email = email;

		if (password && !oldPassword) {
			throw new AppError(
				'You need to inform old password to set a new password',
			);
		}

		if (password && oldPassword) {
			const checkOldPassword = await this.hashProvider.compareHash(
				oldPassword,
				user.password,
			);

			if (!checkOldPassword) {
				throw new AppError('Old password does not match.');
			}

			user.password = await this.hashProvider.generateHash(password);
		}

		return this.usersRepository.save(user);
	}
}

export default UpdateProfileService;
