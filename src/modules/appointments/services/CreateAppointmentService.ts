import { isBefore, startOfHour, getHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
	providerId: string;
	userId: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppoitmentsRepository,
	) {}

	public async execute({
		date,
		providerId,
		userId,
	}: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		if (isBefore(appointmentDate, Date.now())) {
			throw new AppError("You can't create an appointment on a past date.");
		}

		if (userId === providerId) {
			throw new AppError("You can't create an appointment with yourself.");
		}

		if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
			throw new AppError(
				'You can only create appointments between 8am and 5pm',
			);
		}

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const appointment = await this.appointmentsRepository.create({
			providerId,
			userId,
			date: appointmentDate,
		});

		return appointment;
	}
}

export default CreateAppointmentService;
