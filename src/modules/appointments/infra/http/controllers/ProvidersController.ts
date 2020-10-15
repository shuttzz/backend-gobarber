import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProvidersService from '@modules/appointments/services/LIstProvidersService';
import { classToClass } from 'class-transformer';

export default class ProvidersController {
	public async index(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id;

		const listProviders = container.resolve(ListProvidersService);

		const providers = await listProviders.execute({ userId });

		return response.json(classToClass(providers));
	}
}
