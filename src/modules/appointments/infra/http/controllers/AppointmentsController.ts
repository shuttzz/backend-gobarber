import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentController {
	public async create(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id;
		const { providerId, date } = request.body;

		const parsedDate = parseISO(date);

		const createAppointmentService = container.resolve(
			CreateAppointmentService,
		);

		const appointment = await createAppointmentService.execute({
			date: parsedDate,
			userId,
			providerId,
		});

		return response.json(appointment);
	}
}
