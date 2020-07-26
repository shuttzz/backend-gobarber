import { getRepository, Not, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = getRepository(User);
	}

	public async findById(id: string): Promise<User | undefined> {
		const user = await this.ormRepository.findOne(id);

		return user;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const user = await this.ormRepository.findOne({
			where: { email },
		});

		return user;
	}

	public async create(userData: ICreateUsersDTO): Promise<User> {
		const user = this.ormRepository.create(userData);

		return this.save(user);
	}

	public async save(user: User): Promise<User> {
		return this.ormRepository.save(user);
	}

	public async findAllProviders({
		exceptUserId,
	}: IFindAllProvidersDTO): Promise<User[]> {
		let users: User[];

		if (exceptUserId) {
			users = await this.ormRepository.find({
				where: {
					id: Not(exceptUserId),
				},
			});
		} else {
			users = await this.ormRepository.find();
		}

		return users;
	}
}

export default UsersRepository;
