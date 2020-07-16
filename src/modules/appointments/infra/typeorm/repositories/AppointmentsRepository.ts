import { getRepository, Repository } from 'typeorm';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppoitmentsRepository {
	private ormRepository: Repository<Appointment>;

	constructor() {
		this.ormRepository = getRepository(Appointment);
	}

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		const findAppointment = await this.ormRepository.findOne({
			where: { date }, // está dessa maneira porque o nome do campo que vamos utilizar é o mesmo nome da variável que estamos recebendo
		});
		return findAppointment;
	}

	public async create({
		providerId,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({ providerId, date });

		await this.ormRepository.save(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;
