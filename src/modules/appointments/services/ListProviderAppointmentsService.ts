import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppoitmentsRepository from '@modules/appointments/repositories/IAppoitmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
	providerId: string;
	day: number;
	month: number;
	year: number;
}

@injectable()
class ListProviderAppointmentsService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppoitmentsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({
		providerId,
		year,
		month,
		day,
	}: IRequest): Promise<Appointment[]> {
		const cacheKey = `provider-appointments:${providerId}:${year}-${month}-${day}`;
		let appointments = await this.cacheProvider.recover<Appointment[]>(
			cacheKey,
		);

		if (!appointments) {
			appointments = await this.appointmentsRepository.findAllInDayFromProvider(
				{ providerId, year, month, day },
			);
			await this.cacheProvider.save(cacheKey, appointments);
		}

		return appointments;
	}
}

export default ListProviderAppointmentsService;
