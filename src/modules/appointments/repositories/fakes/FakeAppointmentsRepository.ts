import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

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
		date,
	}: ICreateAppointmentDTO): Promise<Appointment> {
		const appointment = new Appointment();

		Object.assign(appointment, { id: uuid(), date, providerId });

		this.appointments.push(appointment);

		return appointment;
	}
}

export default AppointmentsRepository;
