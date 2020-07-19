import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsuersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
	// user_id: string;
	userId: string;
	avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsuersRepository,

		@inject('StorageProvider')
		private storageProvider: IStorageProvider,
	) {}

	public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new AppError('Only authenticated users can change avatar.', 401);
		}

		if (user.avatar) {
			await this.storageProvider.deleteFile(user.avatar);
		}

		const fileName = await this.storageProvider.saveFile(avatarFilename);

		user.avatar = fileName;

		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
