import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
	// provider_id: string;
	providerId: string;
	date: Date;
}

@injectable()
class CreateAppointmentService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppoitmentsRepository,
	) {}

	public async execute({ date, providerId }: IRequest): Promise<Appointment> {
		const appointmentDate = startOfHour(date);

		const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
			appointmentDate,
		);

		if (findAppointmentInSameDate) {
			throw new AppError('This appointment is already booked');
		}

		const appointment = await this.appointmentsRepository.create({
			providerId,
			date: appointmentDate,
		});

		return appointment;
	}
}

export default CreateAppointmentService;
