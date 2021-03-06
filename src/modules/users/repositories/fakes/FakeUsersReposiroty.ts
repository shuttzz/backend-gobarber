import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
	private users: User[] = [];

	public async findById(id: string): Promise<User | undefined> {
		return this.users.find(user => user.id === id);
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		return this.users.find(user => user.email === email);
	}

	public async create(userData: ICreateUsersDTO): Promise<User> {
		const user = new User();

		Object.assign(user, { id: uuid() }, userData);

		this.users.push(user);

		return user;
	}

	public async save(user: User): Promise<User> {
		const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

		this.users[findIndex] = user;

		return user;
	}

	public async findAllProviders({
		exceptUserId,
	}: IFindAllProvidersDTO): Promise<User[]> {
		let { users } = this;

		if (exceptUserId) {
			users = this.users.filter(user => user.id !== exceptUserId);
		}

		return users;
	}
}

export default FakeUsersRepository;
