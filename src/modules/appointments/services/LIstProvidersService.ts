import { inject, injectable } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsuersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
	userId: string;
}

@injectable()
class ListProvidersService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsuersRepository,
	) {}

	public async execute({ userId }: IRequest): Promise<User[]> {
		const users = await this.usersRepository.findAllProviders({
			exceptUserId: userId,
		});

		return users;
	}
}

export default ListProvidersService;
