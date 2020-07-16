import {EntityRepository, Repository} from 'typeorm';

import Appointment from "../models/Appointment";

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
	public async findByDate(date: Date): Promise<Appointment | null> {
		const findAppointment = await this.findOne({
			where: {date}, // está dessa maneira porque o nome do campo que vamos utilizar é o mesmo nome da variável que estamos recebendo
		});
		return findAppointment || null;
	}
}

export default AppointmentsRepository;
