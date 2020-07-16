import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import uploadConfig from '@config/upload';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsuersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
	// user_id: string;
	userId: string;
	avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository') private usersRepository: IUsuersRepository,
	) {}

	public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new AppError(
				'Only authenticated users can change avatar.',
				401,
			);
		}

		if (user.avatar) {
			const userAvatarFilePath = path.join(
				uploadConfig.directory,
				user.avatar,
			);
			const userAvatarFileExists = await fs.promises.stat(
				userAvatarFilePath,
			); // Método stat retorna informações de um arquivo, apenas se ele existir

			if (userAvatarFileExists) {
				await fs.promises.unlink(userAvatarFilePath);
			}
		}

		user.avatar = avatarFilename;

		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
