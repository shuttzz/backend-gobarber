import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import { celebrate, Joi, Segments } from 'celebrate';

const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayhAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
	'/:providerId/month-availability',
	celebrate({
		[Segments.PARAMS]: {
			providerId: Joi.string().uuid().required(),
		},
	}),
	providerMonthAvailabilityController.index,
);
providersRouter.get(
	'/:providerId/day-availability',
	celebrate({
		[Segments.PARAMS]: {
			providerId: Joi.string().uuid().required(),
		},
	}),
	providerDayhAvailabilityController.index,
);

export default providersRouter;
