import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';

import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';

interface IRequest {
	providerId: string;
	month: number;
	year: number;
}

type IResponse = Array<{
	day: number;
	available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppoitmentsRepository,
	) {}

	public async execute({
		providerId,
		year,
		month,
	}: IRequest): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
			{ providerId, month, year },
		);

		const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

		const eachDayArray = Array.from(
			{ length: numberOfDaysInMonth },
			(_, index) => index + 1,
		);

		const availability = eachDayArray.map(day => {
			const appointmentsInDay = appointments.filter(appointment => {
				return getDate(appointment.date) === day;
			});

			return { day, available: appointmentsInDay.length < 10 };
		});

		return availability;
	}
}

export default ListProviderMonthAvailabilityService;
