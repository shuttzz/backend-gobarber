import { uuid } from 'uuidv4';
import { getMonth, getYear, isEqual, getDate } from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class AppointmentsRepository implements IAppoitmentsRepository {
	private appointments: Appointment[] = [];

	public async findByDate(date: Date): Promise<Appointment | undefined> {
		const findAppointment = this.appointments.find(appointment =>
			isEqual(appointment.date, date),
		);

		return findAppointment;
	}

	public async create({
		providerId,
		userId,
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), date, providerId, userId });

		this.appointments.push(appointment);

		return appointment;
	}

	public async findAllInMonthFromProvider({
		providerId,
		month,
		year,
	}: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
		const appointments = this.appointments.filter(
			appointment =>
				appointment.providerId === providerId &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year,
		);

		return appointments;
	}

	public async findAllInDayFromProvider({
		providerId,
		day,
		month,
		year,
	}: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
		const appointments = this.appointments.filter(
			appointment =>
				appointment.providerId === providerId &&
				getDate(appointment.date) === day &&
				getMonth(appointment.date) + 1 === month &&
				getYear(appointment.date) === year,
		);

		return appointments;
	}
}

export default AppointmentsRepository;
