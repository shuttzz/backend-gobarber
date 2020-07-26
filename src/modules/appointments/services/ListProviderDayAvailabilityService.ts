import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

interface IRequest {
	providerId: string;
	day: number;
	month: number;
	year: number;
}

type IResponse = Array<{
	hour: number;
	available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppoitmentsRepository,
	) {}

	public async execute({
		providerId,
		year,
		month,
		day,
	}: IRequest): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
			{
				providerId,
				year,
				month,
				day,
			},
		);

		const hourStart = 8;

		const eachHourArray = Array.from(
			{ length: 10 },
			(_, index) => index + hourStart,
		);

		const currentDate = new Date(Date.now());

		const availability = eachHourArray.map(hour => {
			const hasAppointmentInHour = appointments.find(
				appointment => getHours(appointment.date) === hour,
			);

			const compareDate = new Date(year, month - 1, day, hour);

			return {
				hour,
				available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
			};
		});

		return availability;
	}
}

export default ListProviderDayAvailabilityService;
