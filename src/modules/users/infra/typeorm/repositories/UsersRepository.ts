import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

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

	// public async findByDate(date: Date): Promise<User | undefined> {
	// const findAppointment = await this.ormRepository.findOne({
	// where: { date }, // está dessa maneira porque o nome do campo que vamos utilizar é o mesmo nome da variável que estamos recebendo
	// });
	// return findAppointment;
	// }

	public async create(userData: ICreateUsersDTO): Promise<User> {
		const user = this.ormRepository.create(userData);

		return user;
	}

	public async save(user: User): Promise<User> {
		return this.ormRepository.save(user);
	}
}

export default UsersRepository;
