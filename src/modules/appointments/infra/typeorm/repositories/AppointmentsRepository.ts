import { getRepository, Raw, Repository } from 'typeorm';
import { getMonth, getYear } from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

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
		userId,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = this.ormRepository.create({ providerId, date, userId });

		await this.ormRepository.save(appointment);

		return appointment;
	}

	public async findAllInMonthFromProvider({
		providerId,
		month,
		year,
	}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
		const parsedMonth = String(month).padStart(2, '0');

		const appointments = this.ormRepository.find({
			where: {
				providerId,
				date: Raw(
					dateFieldName =>
						`to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
				),
			},
		});

		return appointments;
	}

	public async findAllInDayFromProvider({
		providerId,
		day,
		month,
		year,
	}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
		const parsedDay = String(day).padStart(2, '0');
		const parsedMonth = String(month).padStart(2, '0');

		const appointments = this.ormRepository.find({
			where: {
				providerId,
				date: Raw(
					dateFieldName =>
						`to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
				),
			},
		});

		return appointments;
	}
}

export default AppointmentsRepository;
