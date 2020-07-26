import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsuersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
	userId: string;
}

@injectable()
class ShowProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsuersRepository,
	) {}

	public async execute({ userId }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new AppError('User not found');
		}

		return user;
	}
}

export default ShowProfileService;
